import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import prisma from "@/lib/prisma";
import Dashboard from "@/components/Dashboard";
import {
  createCheckoutLink,
  createCustomerIfNull,
  generateCustomerPortalLink,
  hasSubscription,
} from "@/utils/stripe";

// Main dashboard page component
const Page = async () => {
  // Fetch the current user's information
  const user = await currentUser();

  // Redirect to home if no user is authenticated
  if (!user) {
    redirect("/");
  }

  try {
    // Concurrent fetching of user data and subscription status
    const [userData, subscriptionData] = await Promise.all([
      // Upsert user data in the database
      prisma.user.upsert({
        where: { clerkId: user.id },
        update: {
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName} ${user.lastName}`,
        },
        create: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName} ${user.lastName}`,
          fullname: `${user.firstName} ${user.lastName}`,
          type: 'USER',
        },
        select: {
          lessonPlans: true,
          stripe_customer_id: true,
        },
      }),
      // Check if the user has an active subscription
      hasSubscription(),
    ]);

    // Ensure the user has a Stripe customer ID
    const stripeCustomerId = await createCustomerIfNull();

    // Generate links for managing subscription and checkout
    const [manageLink, checkoutLink] = await Promise.all([
      generateCustomerPortalLink(stripeCustomerId),
      createCheckoutLink(stripeCustomerId),
    ]);

    // Render the dashboard with user-specific data
    return (
      <MaxWidthWrapper className="py-8 md:py-20">
        <Dashboard
          lessonPlans={userData.lessonPlans}
          subscribed={subscriptionData.isSubscribed}
          manage_link={manageLink ?? ''}
          checkout_link={checkoutLink ?? ''}
        />
      </MaxWidthWrapper>
    );
  } catch (error) {
    // Handle any errors that occur during data fetching or processing
    console.error("Error in dashboard page:", error);
    return (
      <MaxWidthWrapper className="py-8 md:py-20">
        <div>An error occurred. Please try again later.</div>
      </MaxWidthWrapper>
    );
  }
};

export default Page;

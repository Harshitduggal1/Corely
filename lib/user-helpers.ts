import prisma from "@/lib/prisma";
import { plansMap } from "./constants";

export async function hasCancelledSubscription(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      stripe_customer_id: true,
    },
  });

  // Since we can't directly check subscriptionStatus, we'll assume
  // a cancelled subscription if there's no stripe_customer_id
  return user?.stripe_customer_id === null;
}

export async function doesUserExist(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  return user;
}

export async function updateUser(userId: string, email: string) {
  return prisma.user.update({
    where: { email: email },
    data: { id: userId }
  });
}

export function getPlanType(priceId: string | null) {
  if (priceId === null) return { id: "starter", name: "Starter" };

  const checkPlanType = plansMap.find((plan) => plan.priceId === priceId);
  return checkPlanType || { id: "starter", name: "Starter" };
}

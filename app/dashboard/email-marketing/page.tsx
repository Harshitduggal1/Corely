import { onGetAllCampaigns, onGetAllCustomers } from '@/_actions/mail'
import EmailMarketing from '@/_components/email-marketing'
import InfoBar from '@/_components/infobar'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Page: React.FC = async () => {
  const user = await currentUser()

  if (!user) return null

  const customers = await onGetAllCustomers(user.id)
  const campaigns = await onGetAllCampaigns(user.id)

  if (!customers || !campaigns) {
    // Handle the case where data fetching failed
    return <div>Failed to load data. Please try again later.</div>
  }

  return (
    <>
      <InfoBar />
      <EmailMarketing
        campaign={campaigns.campaign ?? []}
        subscription={customers.subscription ?? null}
        domains={customers.domains ?? []}
      />
    </>
  )
}

export default Page

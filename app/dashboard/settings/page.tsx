import InfoBar from '@/_components/infobar'
import BillingSettings from '@/_components/settings/billing-settings'
import ChangePassword from '@/_components/settings/change-password'
import DarkModetoggle from '@/_components/settings/dark-mode'
import React from 'react'

const Page: React.FC = () => {
  return (
    <>
      <InfoBar />
      <div className="overflow-y-auto w-full chat-window flex-1 h-0 flex flex-col gap-10">
        <BillingSettings />
        <DarkModetoggle />
        <ChangePassword />
      </div>
    </>
  )
}

export default Page

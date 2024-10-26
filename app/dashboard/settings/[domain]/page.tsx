import { onGetCurrentDomainInfo } from '@/_actions/settings'
import BotTrainingForm from '@/_components/forms/settings/bot-training'
import SettingsForm from '@/_components/forms/settings/form'
import InfoBar from '@/_components/infobar'
import ProductTable from '@/_components/products'
import { redirect } from 'next/navigation'
import React from 'react'
import { Plans } from '@prisma/client' // Make sure to import the Plans enum

type Props = { params: { domain: string } }

const DomainSettingsPage = async ({ params }: Props) => {
  const domain = await onGetCurrentDomainInfo(params.domain)
  if (!domain) redirect('/dashboard')

  return (
    <>
      <InfoBar />
      <div className="overflow-y-auto w-full chat-window flex-1 h-0">
        <SettingsForm
          plan={domain.subscription?.plan ?? Plans.STANDARD} // Use a default Plans value
          chatBot={domain.domains[0].chatBot}
          id={domain.domains[0].id}
          name={domain.domains[0].name}
        />
        <BotTrainingForm id={domain.domains[0].id} />
        <ProductTable
          id={domain.domains[0].id}
          products={domain.domains[0].products || []}
        />
      </div>
    </>
  )
}

export default DomainSettingsPage

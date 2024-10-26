import { onGetAllAccountDomains } from '@/_actions/settings'
import ConversationMenu from '@/_components/conversations'
import Messenger from '@/_components/conversations/messenger'
import InfoBar from '@/_components/infobar'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const ConversationPage: React.FC = async () => {
 

  const domains = await onGetAllAccountDomains()
  return (
    <div className="w-full h-full flex">
      <ConversationMenu domains={domains?.domains} />

      <Separator orientation="vertical" />
      <div className="w-full flex flex-col">
        <div className="px-5">
          <InfoBar />
        </div>
        <Messenger />
      </div>
    </div>
  )
}

export default ConversationPage

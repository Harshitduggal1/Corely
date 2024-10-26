import { onGetPaymentConnected } from '@/_actions/settings'
import InfoBar from '@/_components/infobar'
import IntegrationsList from '@/_components/integrations'

const IntegrationsPage = async () => {
  const payment = await onGetPaymentConnected()

  const connections = {
    stripe: payment ? true : false,
  }

  return (
    <>
      <InfoBar />
      <IntegrationsList connections={connections} />
    </>
  )
}

export default IntegrationsPage

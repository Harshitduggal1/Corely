import { getUserAppointments } from '@/_actions/appointment'
import {
  getUserBalance,
  getUserClients,
  getUserPlanInfo,
  getUserTotalProductPrices,
  getUserTransactions,
} from '@/_actions/dashboard'
import DashboardCard from '@/_components/dashboard/cards'
import { PlanUsage } from '@/_components/dashboard/plan-usage'
import InfoBar from '@/_components/infobar'
import { Separator } from '@/components/ui/separator'
import CalIcon from '@/icons/cal-icon'
import EmailIcon from '@/icons/email-icon'
import PersonIcon from '@/icons/person-icon'
import { TransactionsIcon } from '@/icons/transactions-icon'
import { DollarSign } from 'lucide-react'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {
  const clients = await getUserClients()
  const sales = await getUserBalance()
  const bookings = await getUserAppointments()
  const plan = await getUserPlanInfo()
  const transactions = await getUserTransactions()
  const products = await getUserTotalProductPrices()

  return (
    <>
      <InfoBar />
      <div className="flex-1 w-full h-0 overflow-y-auto chat-window">
        <div className="flex flex-wrap gap-5">
          <DashboardCard
            value={clients || 0}
            title="Potential Clients"
            icon={<PersonIcon />}
          />
          <DashboardCard
            value={products! * clients! || 0}
            sales
            title="Pipline Value"
            icon={<DollarSign />}
          />
          <DashboardCard
            value={bookings || 0}
            title="Appointments"
            icon={<CalIcon />}
          />
          <DashboardCard
            value={sales || 0}
            sales
            title="Total Sales"
            icon={<DollarSign />}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 py-10 w-full">
          <div>
            <div>
              <h2 className="font-bold text-2xl">Plan Usage</h2>
              <p className="font-light text-sm">
                A detailed overview of your metrics, usage, customers and more
              </p>
            </div>
            <PlanUsage
              plan={plan?.plan!}
              credits={plan?.credits || 0}
              domains={plan?.domains || 0}
              clients={clients || 0}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-5 w-full">
              <div className="flex items-center gap-3">
                <TransactionsIcon />
                <p className="font-bold">Recent Transactions</p>
              </div>
              <p className="text-sm">See more</p>
            </div>
            <Separator orientation="horizontal" />
            {transactions &&
              transactions.data.map((transaction) => (
                <div
                  className="flex justify-between items-center gap-3 py-5 border-b-2 w-full"
                  key={transaction.id}
                >
                  <p className="font-bold">
                    {transaction.calculated_statement_descriptor}
                  </p>
                  <p className="font-bold text-xl">
                    ${transaction.amount / 100}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Page

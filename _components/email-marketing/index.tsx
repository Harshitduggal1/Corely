'use client'
import { useEmailMarketing } from '@/hooks/email-marketing/use-marketing'
import React from 'react'
import { CustomerTable } from './customer-table'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import Modal from '../mondal'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import { Loader } from '../loader'
import FormGenerator from '../forms/form-generator'
import { cn, getMonthName } from '@/lib/_utils'
import CalIcon from '@/icons/cal-icon'
import PersonIcon from '@/icons/person-icon'
import { EditEmail } from './edit-email'

type Props = {
  domains: {
    customer: {
      Domain: {
        name: string
      } | null
      id: string
      email: string | null
    }[]
  }[]
  campaign: {
    name: string
    id: string
    customers: string[]
    createdAt: Date
  }[]
  subscription: {
    plan: 'STANDARD' | 'PRO' | 'ULTIMATE'
    credits: number
  } | null
}
//pro

const EmailMarketing = ({ campaign, domains }: Props) => {
  const {
    onSelectedEmails,
    isSelected,
    onCreateCampaign,
    register,
    errors,
    loading,
    onSelectCampaign,
    processing,
    onAddCustomersToCampaign,
    campaignId,
    onBulkEmail,
    onSetAnswersId,
    isId,
    registerEmail,
    emailErrors,
    onCreateEmailTemplate,
    setValue,
  } = useEmailMarketing()

  // Force PRO plan
  const forcedSubscription = { plan: 'PRO' as const, credits: 1000 }

  return (
    <div className="flex-1 gap-10 grid grid-cols-1 lg:grid-cols-2 w-full h-0">
      <CustomerTable
        domains={domains}
        onId={onSetAnswersId}
        onSelect={onSelectedEmails}
        select={isSelected}
        id={isId}
      />
      <div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onAddCustomersToCampaign}
          >
            <Plus /> Add to campaign
          </Button>
          <Modal
            title="Create a new campaign"
            description="Add your customers and create a marketing campaign"
            trigger={
              <Card className="flex items-center gap-2 px-3 text-sm cursor-pointer">
                <Loader loading={false}>
                  <Plus /> Create Campaign
                </Loader>
              </Card>
            }
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={onCreateCampaign}
            >
              <FormGenerator
                name="name"
                register={register}
                errors={errors}
                inputType="input"
                placeholder="your campaign name"
                type="text"
              />
              <Button
                className="w-full"
                type="submit"
              >
                <Loader loading={loading}>Create Campaign</Loader>
              </Button>
            </form>
          </Modal>
          <Card className="p-2">
            <CardDescription className="font-bold">
              {forcedSubscription.credits} credits
            </CardDescription>
          </Card>
        </div>
        <div className="flex flex-col items-end gap-3 mt-5">
          {campaign &&
            campaign.map((camp, i) => (
              <Card
                key={camp.id}
                className={cn(
                  'p-5 min-w-[600px] cursor-pointer',
                  campaignId == camp.id ? 'bg-gray-50' : ''
                )}
                onClick={() => onSelectCampaign(camp.id)}
              >
                <Loader loading={processing}>
                  <CardContent className="flex flex-col items-center gap-3 p-0">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <CalIcon />
                        <CardDescription>
                          Created {getMonthName(camp.createdAt.getMonth())}{' '}
                          {camp.createdAt.getDate()}th
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <PersonIcon />
                        <CardDescription>
                          {camp.customers.length} customers added
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <CardTitle className="text-xl">{camp.name}</CardTitle>
                      <div className="flex gap-3">
                        <Modal
                          title="Edit Email"
                          description="This email will be sent to campaign members"
                          trigger={
                            <Card className="bg-grandis hover:bg-orange px-5 py-2 rounded-lg font-semibold text-gray-700 text-sm cursor-pointer">
                              Edit Email
                            </Card>
                          }
                        >
                          <EditEmail
                            register={registerEmail}
                            errors={emailErrors}
                            setDefault={setValue}
                            id={camp.id}
                            onCreate={onCreateEmailTemplate}
                          />
                        </Modal>
                        <Button
                          variant="default"
                          className="rounded-lg"
                          onClick={() =>
                            onBulkEmail(
                              campaign[i].customers.map((c) => c),
                              camp.id
                            )
                          }
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Loader>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

export default EmailMarketing

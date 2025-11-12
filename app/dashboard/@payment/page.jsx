"use client"

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { IconRefresh } from '@tabler/icons-react'

const timeRangeToDays = {
  '7days': 7,
  '14days': 14,
  '30days': 30,
  '90days': 90,
  '1year': 365,
}

export default function Page() {
  const [timeRange, setTimeRange] = useState('7days')

  const lastDays = timeRangeToDays[timeRange] || 30
  const key = `/org/dashboard/revenue/by-payment-status?lastDays=${lastDays}`

  const { data, error, mutate } = useSWR(key, fetcher, { refreshInterval: 180000, revalidateOnFocus: true })

  const summary = useMemo(() => (data && data.data ? data.data.summary : null), [data])
  const breakdown = useMemo(() => (data && data.data && Array.isArray(data.data.breakdown) ? data.data.breakdown : []), [data])

  const totalRevenue = summary?.totalRevenue ?? breakdown.reduce((s, b) => s + (b.totalRevenue || 0), 0)
  const totalTransactions = summary?.totalTransactions ?? breakdown.reduce((s, b) => s + (b.transactions || 0), 0)

  return (
    <Card className="w-full p-0 sm:px-2 px-2 h-full py-2">
      <div className="flex items-center justify-between px-2 ">
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v)}>
            <SelectTrigger className="w-[140px]">{timeRange}</SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="14days">Last 14 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className='font-semibold text-lg'>Payment Status</p>

        <div className="flex items-center ">
          <Button size="sm" variant="icon" onClick={() => mutate()}>
            <IconRefresh className="h-4 w-4 " />
          </Button>
        </div>
      </div>

      <div className="h-full">
        {error && <div className="text-red-600">Failed to load payment breakdown</div>}
        {!data && !error && <div>Loading...</div>}

        {data && (
          <div className="">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Transactions</div>
                <div className="text-lg font-medium">{totalTransactions}</div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Breakdown by Payment Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {breakdown.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No breakdown data available.</div>
                ) : (
                  breakdown.map((b) => (
                    <div key={b.status} className="p-4 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium capitalize">{b.status}</div>
                        <div className="text-sm text-muted-foreground">{b.transactions} transactions</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(b.totalRevenue || 0).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{(b.revenuePercent || 0).toFixed(2)}%</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

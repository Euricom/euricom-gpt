import { supabase } from "@/lib/supabase/browser-client"

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth()
const startDate = new Date(year, month, 1)
const endDate = new Date(year, month + 1, 1)

export const getBalances = async (month: number) => {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 1)

  const { data: balances } = await supabase.rpc("get_balances_between_dates", {
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  })

  return balances
}

export const getMyBalance = async (userId: string) => {
  const { data: balance } = await supabase.rpc("get_my_balance", {
    user_id: userId,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  })

  return balance || 0
}

import { supabase } from "@/lib/supabase/browser-client"

export const getBalances = async () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 1)
  const { data: balances } = await supabase.rpc("get_balances_between_dates", {
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  })

  return balances
}

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { IconCoins } from "@tabler/icons-react"
import { SIDEBAR_ICON_SIZE } from "../../sidebar-switcher"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { SidebarSearch } from "../../sidebar-search"
import { Balance } from "@/types/balance"
import { getBalances } from "@/db/balances"
import { IconLeft, IconRight } from "react-day-picker"

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
]

const BalanceOverviewItem = () => {
  const [balances, setBalances] = useState<Array<Balance>>([])
  const [searchTerm, setSearchTerm] = useState("")
  const monthToday = new Date().getMonth()
  const [month, setMonth] = useState(new Date().getMonth())

  useEffect(() => {
    const fetchBalances = async () => {
      const data = (await getBalances(month)) || []
      setBalances(
        data.map(d => ({ name: d.display_name, balance: d.total_price }))
      )
    }
    fetchBalances()
  }, [month])

  const filteredData =
    balances.filter(b =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || balances

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <IconCoins size={SIDEBAR_ICON_SIZE} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between" side="left">
        <div className="grow overflow-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Balance Overview
              <div className="flex items-center text-muted-foreground">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={month === 0}
                  onClick={() => setMonth(month - 1)}
                >
                  <IconLeft />
                </Button>
                <p>{monthNames[month]}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={month === monthToday}
                  onClick={() => setMonth(month + 1)}
                >
                  <IconRight />
                </Button>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4">
            {balances.length > 0 && (
              <SidebarSearch
                contentType={"Balances" as any}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}

            {filteredData.length === 0 ? (
              <div className=" text-center text-muted-foreground p-8 text-lg italic">
                No balances.
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredData.map(b => (
                  <div className="flex justify-between">
                    <p>{b.name}</p>
                    <p>$ {b.balance.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default BalanceOverviewItem

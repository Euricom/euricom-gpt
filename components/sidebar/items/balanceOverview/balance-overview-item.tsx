import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { IconCoins, IconX } from "@tabler/icons-react"
import { SIDEBAR_ICON_SIZE } from "../../sidebar-switcher"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { SidebarSearch } from "../../sidebar-search"
import { Balance } from "@/types/balance"
import { getBalances } from "@/db/balances"
import { IconLeft, IconRight } from "react-day-picker"
import { getChatsPerPerson } from "@/db/chats"

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

type BalanceOverview = {
  name: string
  balance: number
  chats: number
  messages: number
}

const BalanceOverviewItem = () => {
  const [balances, setBalances] = useState<Array<BalanceOverview>>([])
  const [searchTerm, setSearchTerm] = useState("")
  const monthToday = new Date().getMonth()
  const [month, setMonth] = useState(new Date().getMonth())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchBalances = async () => {
      const balanceData = (await getBalances(month)) || []
      const chatData = (await getChatsPerPerson(month)) || []

      setBalances(
        balanceData.map(d => {
          const chat = chatData.find(
            chat => chat.display_name === d.display_name
          )
          return {
            name: d.display_name,
            balance: d.total_price,
            chats: chat?.chats || 0,
            messages: chat?.messages || 0
          }
        })
      )
    }
    fetchBalances()
  }, [month])

  const filteredData =
    balances.filter(b =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || balances

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <IconCoins size={SIDEBAR_ICON_SIZE} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col " side="left">
        <SheetHeader>
          <div className="ml-auto space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              <IconX stroke={3} />
            </Button>
          </div>
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
        {balances.length > 0 && (
          <SidebarSearch
            contentType={"Balances" as any}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
        <div className="overflow-auto max-h-fit p-1">
          <div className="flex flex-col gap-4 overflow-auto max-h-fit">
            {filteredData.length === 0 ? (
              <div className=" text-center text-muted-foreground p-8 text-lg italic">
                No balances.
              </div>
            ) : (
              <div className="flex flex-col gap-1 ">
                {filteredData.map(b => (
                  <div className="flex justify-between">
                    <p className="w-1/2">{b.name}</p>
                    <p>
                      {b.chats}c / {b.messages / 2}m
                    </p>
                    <p>$ {b.balance.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <hr className="border-2 border-secondaryEuricom rounded m-1" />
          <h1 className="m-1">
            <div className="flex justify-between">
              <p className="w-1/2">Total:</p>
              <p>
                {filteredData.reduce((acc, prev) => {
                  return (acc += prev.chats)
                }, 0)}
                c /{" "}
                {filteredData.reduce((acc, prev) => {
                  return (acc += prev.messages / 2)
                }, 0)}
                m
              </p>
              <p>
                ${" "}
                {filteredData
                  .reduce((acc, prev) => {
                    return (acc += prev.balance)
                  }, 0)
                  .toFixed(2)}
              </p>
            </div>
          </h1>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default BalanceOverviewItem

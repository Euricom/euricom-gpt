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
import { useContext } from "react"
import { ChatbotUIContext } from "@/context/context"

const BalanceOverviewItem = () => {
  const { balances } = useContext(ChatbotUIContext)

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
            <SheetTitle>Balance Overview</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 mt-4">
            {balances.length === 0 ? (
              <div className=" text-center text-muted-foreground p-8 text-lg italic">
                No balances.
              </div>
            ) : (
              balances.map(b => (
                <div className="flex justify-between">
                  <p>{b.name}</p>
                  <p>$ {b.balance.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default BalanceOverviewItem

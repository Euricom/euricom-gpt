import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { UserRole, userRoles } from "@/types/user-role"
import {
  IconUser,
  IconChevronDown,
  IconCircleCheckFilled
} from "@tabler/icons-react"
import { FC, useEffect, useRef, useState } from "react"

interface AssistantRoleSelectProps {
  selectedAssistantRoleItems: UserRole[]
  onAssistantRoleSelect: (item: UserRole) => void
}

export const AssistantRoleSelect: FC<AssistantRoleSelectProps> = ({
  selectedAssistantRoleItems,
  onAssistantRoleSelect
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100) // FIX: hacky
    }
  }, [isOpen])

  const handleItemSelect = (item: UserRole) => {
    onAssistantRoleSelect(item)
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={isOpen => {
        setIsOpen(isOpen)
        setSearch("")
      }}
    >
      <DropdownMenuTrigger
        className="bg-background w-full justify-start border-2 px-3 py-5"
        asChild
      >
        <Button
          ref={triggerRef}
          className="flex items-center justify-between"
          variant="ghost"
        >
          <div className="flex items-center">
            <div className="ml-2 flex items-center">
              {selectedAssistantRoleItems.length} roles selected
            </div>
          </div>

          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        style={{ width: triggerRef.current?.offsetWidth }}
        className="space-y-2 overflow-auto p-2"
        align="start"
      >
        <Input
          ref={inputRef}
          placeholder="Search roles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.stopPropagation()}
        />

        {selectedAssistantRoleItems
          .filter(item => item.toLowerCase().includes(search.toLowerCase()))
          .map(item => (
            <AssistantRoleItemOption
              key={item}
              item={item as UserRole}
              selected={selectedAssistantRoleItems.some(
                selectedAssistantRole => selectedAssistantRole === item
              )}
              onSelect={handleItemSelect}
            />
          ))}

        {userRoles
          .filter(
            role =>
              !selectedAssistantRoleItems.some(
                selectedAssistantRole => selectedAssistantRole === role
              ) && role.toLowerCase().includes(search.toLowerCase())
          )
          .map(role => (
            <AssistantRoleItemOption
              key={role}
              item={role}
              selected={selectedAssistantRoleItems.some(
                selectedAssistantRole => selectedAssistantRole === role
              )}
              onSelect={handleItemSelect}
            />
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface AssistantRoleOptionItemProps {
  item: UserRole
  selected: boolean
  onSelect: (item: UserRole) => void
}

const AssistantRoleItemOption: FC<AssistantRoleOptionItemProps> = ({
  item,
  selected,
  onSelect
}) => {
  const handleSelect = () => {
    onSelect(item)
  }

  return (
    <div
      className="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-50"
      onClick={handleSelect}
    >
      <div className="flex grow items-center truncate">
        <div className="mr-2 min-w-[24px]">
          <IconUser size={24} />
        </div>

        <div className="truncate">{item}</div>
      </div>

      {selected && (
        <IconCircleCheckFilled size={20} className="min-w-[30px] flex-none" />
      )}
    </div>
  )
}

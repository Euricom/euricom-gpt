//Changes Euricom (add admin folder item)

import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import { FC, useRef, useState } from "react"

interface AdminFolderProps {
  folderName: string
  children: React.ReactNode
}

export const AdminFolder: FC<AdminFolderProps> = ({ folderName, children }) => {
  const itemRef = useRef<HTMLDivElement>(null)

  const [isDragOver, setIsDragOver] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      itemRef.current?.click()
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      ref={itemRef}
      id="folder"
      className={cn("rounded focus:outline-none", isDragOver && "bg-accent")}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        tabIndex={0}
        className={cn(
          "hover:bg-accent focus:bg-accent flex w-full cursor-pointer items-center justify-between rounded p-2 hover:opacity-50 focus:outline-none"
        )}
        onClick={handleClick}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <IconChevronDown stroke={3} />
            ) : (
              <IconChevronRight stroke={3} />
            )}

            <div>{folderName}</div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-5 mt-2 space-y-2 border-l-2 pl-4">{children}</div>
      )}
    </div>
  )
}

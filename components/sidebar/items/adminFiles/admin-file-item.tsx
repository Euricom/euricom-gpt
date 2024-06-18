//Changes Euricom (add admin file item)
import { FileIcon } from "@/components/ui/file-icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FILE_DESCRIPTION_MAX, FILE_NAME_MAX } from "@/db/limits"
import { getFileFromStorage } from "@/db/storage/files"
import { Tables } from "@/supabase/types"
import { EventHandler, FC, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"
import { cn } from "@/lib/utils"

interface AdminFileItemProps {
  file: Tables<"files">
  isAdmin?: boolean
}

export const AdminFileItem: FC<AdminFileItemProps> = ({
  file,
  isAdmin = false
}) => {
  const [name, setName] = useState(file.name)
  const [isTyping, setIsTyping] = useState(false)
  const [description, setDescription] = useState(file.description)
  const [isHovering, setIsHovering] = useState(false)
  const [admin, setAdmin] = useState(isAdmin)

  const getLinkAndView = async () => {
    const link = await getFileFromStorage(file.file_path)
    window.open(link, "_blank")
  }

  return (
    <>
      {admin ? (
        <SidebarItem
          item={file}
          isTyping={isTyping}
          contentType="adminFiles"
          icon={<FileIcon type={file.type} size={30} />}
          updateState={{ name, description }}
          renderInputs={() => (
            <>
              <div
                className="cursor-pointer underline hover:opacity-50"
                onClick={getLinkAndView}
              >
                View {file.name}
              </div>

              <div className="flex flex-col justify-between">
                <div>{file.type}</div>

                <div>{formatFileSize(file.size)}</div>

                <div>{file.tokens.toLocaleString()} tokens</div>
              </div>

              <div className="space-y-1">
                <Label>Name</Label>

                <Input
                  placeholder="File name..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={FILE_NAME_MAX}
                />
              </div>

              <div className="space-y-1">
                <Label>Description</Label>

                <Input
                  placeholder="File description..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  maxLength={FILE_DESCRIPTION_MAX}
                />
              </div>
            </>
          )}
        />
      ) : (
        <div
          className={cn(
            "hover:bg-accent flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none"
          )}
          tabIndex={0}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {<FileIcon type={file.type} size={30} />}

          <div className="ml-3 flex-1 truncate text-sm font-semibold">
            {file.name}
          </div>

          {/* TODO */}
          {/* {isHovering && (
      <WithTooltip
        delayDuration={1000}
        display={<div>Start chat with {contentType.slice(0, -1)}</div>}
        trigger={
          <IconSquarePlus
            className="cursor-pointer hover:text-blue-500"
            size={20}
            onClick={handleClickAction}
          />
        }
      />
    )} */}
        </div>
      )}
    </>
  )
}

export const formatFileSize = (sizeInBytes: number): string => {
  let size = sizeInBytes
  let unit = "bytes"

  if (size >= 1024) {
    size /= 1024
    unit = "KB"
  }

  if (size >= 1024) {
    size /= 1024
    unit = "MB"
  }

  if (size >= 1024) {
    size /= 1024
    unit = "GB"
  }

  return `${size.toFixed(2)} ${unit}`
}

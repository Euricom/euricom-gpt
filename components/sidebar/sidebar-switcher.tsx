import { ContentType } from "@/types"
import {
  IconAdjustmentsHorizontal,
  IconBolt,
  IconBooks,
  IconFile,
  IconMessage,
  IconPencil,
  IconRobotFace,
  IconSparkles
} from "@tabler/icons-react"
import { FC, useContext } from "react"
import { TabsList } from "../ui/tabs"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { SidebarSwitchItem } from "./sidebar-switch-item"
import { ChatbotUIContext } from "@/context/context"
import { Divider } from "@nextui-org/react"

export const SIDEBAR_ICON_SIZE = 28

interface SidebarSwitcherProps {
  onContentTypeChange: (contentType: ContentType) => void
}

export const SidebarSwitcher: FC<SidebarSwitcherProps> = ({
  onContentTypeChange
}) => {
  //Changes Euricom to adapt Azure (TODO: Admin system for now)
  const { user } = useContext(ChatbotUIContext)
  const admin = user?.email === "kobe.dehandschutter@euri.com"

  return (
    <div className="flex flex-col justify-between border-r-2 pb-5 bg-primaryEuricom-900">
      <TabsList className="bg-primaryEuricom-900 grid h-[480px] grid-rows-9">
        <div className=" inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm">
          <img src="/euricom_logo_small.png" className="h-6 w-6" />
        </div>

        <SidebarSwitchItem
          icon={<IconMessage size={SIDEBAR_ICON_SIZE} />}
          contentType="chats"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          icon={<IconAdjustmentsHorizontal size={SIDEBAR_ICON_SIZE} />}
          contentType="presets"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          icon={<IconPencil size={SIDEBAR_ICON_SIZE} />}
          contentType="prompts"
          onContentTypeChange={onContentTypeChange}
        />
        {/* 
        //Changes Euricom to adapt Azure (remove models, collections)
        <SidebarSwitchItem
          icon={<IconSparkles size={SIDEBAR_ICON_SIZE} />}
          contentType="models"
          onContentTypeChange={onContentTypeChange}
        /> */}

        <SidebarSwitchItem
          icon={<IconFile size={SIDEBAR_ICON_SIZE} />}
          contentType="files"
          onContentTypeChange={onContentTypeChange}
        />

        {/* <SidebarSwitchItem
          icon={<IconBooks size={SIDEBAR_ICON_SIZE} />}
          contentType="collections"
          onContentTypeChange={onContentTypeChange}
        /> */}

        {
          //Changes Euricom (add admin sidebar)
          admin && (
            <>
              <hr className="border-2 border-secondaryEuricom rounded" />
              <SidebarSwitchItem
                icon={<IconRobotFace size={SIDEBAR_ICON_SIZE} />}
                contentType="assistants"
                onContentTypeChange={onContentTypeChange}
              />

              <SidebarSwitchItem
                icon={<IconFile size={SIDEBAR_ICON_SIZE} />}
                contentType="adminFiles"
                onContentTypeChange={onContentTypeChange}
              />
              <SidebarSwitchItem
                icon={<IconBolt size={SIDEBAR_ICON_SIZE} />}
                contentType="tools"
                onContentTypeChange={onContentTypeChange}
              />
            </>
          )
        }
      </TabsList>

      <div className="flex flex-col items-center space-y-4 text-secondaryEuricom-300">
        {/* TODO */}
        {/* <WithTooltip display={<div>Import</div>} trigger={<Import />} /> */}

        {/* TODO */}
        {/* <Alerts /> */}

        <WithTooltip
          display={<div>Profile Settings</div>}
          trigger={<ProfileSettings />}
        />
      </div>
    </div>
  )
}

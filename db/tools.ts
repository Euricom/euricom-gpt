import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import {
  createFile,
  createFileBasedOnExtension,
  deleteFile,
  deleteFileWorkspace,
  getAdminFiles,
  updateFile
} from "./files"
import { getServerUser } from "@/lib/server/auth"
import { useContext } from "react"
import { ChatbotUIContext } from "@/context/context"
import { getFile } from "@xenova/transformers/types/utils/hub"
import { deleteFileFromStorage } from "./storage/files"

export const getToolById = async (toolId: string) => {
  const { data: tool, error } = await supabase
    .from("tools")
    .select("*")
    .eq("id", toolId)
    .single()

  if (!tool) {
    throw new Error(error.message)
  }

  return tool
}

export const getToolWorkspacesByWorkspaceId = async (workspaceId: string) => {
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select(
      `
      id,
      name,
      tools (*)
    `
    )
    .eq("id", workspaceId)
    .single()

  if (!workspace) {
    throw new Error(error.message)
  }

  return workspace
}

export const getToolWorkspacesByToolId = async (toolId: string) => {
  const { data: tool, error } = await supabase
    .from("tools")
    .select(
      `
      id, 
      name, 
      workspaces (*)
    `
    )
    .eq("id", toolId)
    .single()

  if (!tool) {
    throw new Error(error.message)
  }

  return tool
}

export const createTool = async (
  tool: TablesInsert<"tools">,
  workspace_id: string
) => {
  const { data: createdTool, error } = await supabase
    .from("tools")
    .insert([tool])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  await createToolWorkspace({
    user_id: createdTool.user_id,
    tool_id: createdTool.id,
    workspace_id
  })

  return createdTool
}

export const createTools = async (
  tools: TablesInsert<"tools">[],
  workspace_id: string
) => {
  const { data: createdTools, error } = await supabase
    .from("tools")
    .insert(tools)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  await createToolWorkspaces(
    createdTools.map(tool => ({
      user_id: tool.user_id,
      tool_id: tool.id,
      workspace_id
    }))
  )

  return createdTools
}

export const createToolWorkspace = async (item: {
  user_id: string
  tool_id: string
  workspace_id: string
}) => {
  const { data: createdToolWorkspace, error } = await supabase
    .from("tool_workspaces")
    .insert([item])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdToolWorkspace
}

export const createToolWorkspaces = async (
  items: { user_id: string; tool_id: string; workspace_id: string }[]
) => {
  const { data: createdToolWorkspaces, error } = await supabase
    .from("tool_workspaces")
    .insert(items)
    .select("*")

  if (error) throw new Error(error.message)

  return createdToolWorkspaces
}

export const updateTool = async (
  toolId: string,
  tool: TablesUpdate<"tools">
) => {
  const { data: updatedTool, error } = await supabase
    .from("tools")
    .update(tool)
    .eq("id", toolId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedTool
}

export const deleteTool = async (toolId: string) => {
  const { error } = await supabase.from("tools").delete().eq("id", toolId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const deleteToolWorkspace = async (
  toolId: string,
  workspaceId: string
) => {
  const { error } = await supabase
    .from("tool_workspaces")
    .delete()
    .eq("tool_id", toolId)
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(error.message)

  return true
}

export const runTool = async (title: string) => {
  const files = await getAdminFiles()
  console.log(files)

  const existingFile = files.find(
    file => file.name === title && file.type === "json"
  )
  console.log(existingFile)

  if (existingFile) {
    await deleteFileFromStorage(existingFile.file_path)
    await deleteFile(existingFile.id)
  }

  const res = await fetch("/api/tools", {
    method: "POST",
    body: JSON.stringify({ title: title })
  })
  const tool = await res.json()
  const jsonBlob = new Blob([JSON.stringify(tool)], {
    type: "application/json"
  })

  const file = new File([jsonBlob], title + ".json", {
    type: "application/json"
  })

  const fileRecord = {
    user_id: "18d332af-2d5b-49e5-8c42-9168b3910f97",
    description: "",
    file_path: "",
    name: title,
    size: file.size,
    tokens: 0,
    type: "json",
    sharing: "public"
  } as TablesInsert<"files">

  return createFileBasedOnExtension(file, fileRecord, null, "openai")
}

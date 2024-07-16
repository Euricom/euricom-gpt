import { supabase } from "@/lib/supabase/browser-client"
import { Database, TablesInsert, TablesUpdate } from "@/supabase/types"
import mammoth from "mammoth"
import { toast } from "sonner"
import { deleteFileFromStorage, uploadFile } from "./storage/files"
import { retrievalProcess } from "@/app/api/retrieval/process/process"
import jsPDF from "jspdf"
import { NextResponse } from "next/server"

export const getFileById = async (fileId: string) => {
  const { data: file, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", fileId)
    .single()

  if (!file) {
    throw new Error(error.message)
  }

  return file
}

export const getFileWorkspacesByWorkspaceId = async (workspaceId: string) => {
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select(
      `
      id,
      name,
      files (*)
    `
    )
    .eq("id", workspaceId)
    .single()

  if (!workspace) {
    throw new Error(error.message)
  }

  return workspace
}

//Changes Euricom (add getAdminFiles + change creates to make a public one)
export const getAdminFiles = async () => {
  const { data: files, error } = await supabase
    .from("files")
    .select("*")
    .eq("sharing", "public")

  if (!files) {
    throw new Error(error.message)
  }
  return files
}

export const getFileWorkspacesByFileId = async (fileId: string) => {
  const { data: file, error } = await supabase
    .from("files")
    .select(
      `
      id, 
      name, 
      workspaces (*)
    `
    )
    .eq("id", fileId)
    .single()

  if (!file) {
    throw new Error(error.message)
  }

  return file
}

export const createFileBasedOnExtension = async (
  file: File,
  fileRecord: TablesInsert<"files">,
  workspace_id: string | null,
  embeddingsProvider: "openai" | "local"
) => {
  const fileExtension = file.name.split(".").pop()
  if (!workspace_id) fileRecord.sharing = "public"

  if (fileExtension === "docx") {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({
      arrayBuffer
    })

    return createDocXFile(
      result.value,
      file,
      fileRecord,
      workspace_id,
      embeddingsProvider
    )
  } else {
    return createFile(file, fileRecord, workspace_id, embeddingsProvider)
  }
}

// For non-docx files
export const createFile = async (
  file: File,
  fileRecord: TablesInsert<"files">,
  workspace_id: string | null,
  embeddingsProvider: "openai" | "local"
) => {
  let validFilename = fileRecord.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase()
  const extension = file.name.split(".").pop()
  const baseName = validFilename.includes(".")
    ? validFilename.substring(0, validFilename.lastIndexOf("."))
    : validFilename
  const maxBaseNameLength = 100 - (extension?.length || 0) - 1
  if (baseName.length > maxBaseNameLength) {
    fileRecord.name = baseName.substring(0, maxBaseNameLength) + "." + extension
  } else {
    fileRecord.name = baseName + "." + extension
  }
  const { data: createdFile, error } = await supabase
    .from("files")
    .insert([fileRecord])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }
  if (workspace_id) {
    await createFileWorkspace({
      user_id: createdFile.user_id,
      file_id: createdFile.id,
      workspace_id
    })
  }

  const filePath = await uploadFile(file, {
    name: createdFile.name,
    user_id: createdFile.user_id,
    file_id: createdFile.name
  })

  await updateFile(createdFile.id, {
    file_path: filePath
  })

  const formData = new FormData()
  formData.append("file_id", createdFile.id)
  formData.append("embeddingsProvider", embeddingsProvider)

  const response = await fetch("/api/retrieval/process", {
    method: "POST",
    body: formData
  })

  // const response = await retrievalProcess(createdFile.id, embeddingsProvider)

  if (!response.ok) {
    const jsonText = await response.text()
    const json = JSON.parse(jsonText)
    console.error(
      `Error processing file:${createdFile.id}, status:${response.status}, response:${json.message}`
    )
    toast.error("Failed to process file. Reason:" + json.message, {
      duration: 10000
    })
    await deleteFile(createdFile.id)
  }

  const fetchedFile = await getFileById(createdFile.id)

  return fetchedFile
}

// // Handle docx files
export const createDocXFile = async (
  text: string,
  file: File,
  fileRecord: TablesInsert<"files">,
  workspace_id: string | null,
  embeddingsProvider: "openai" | "local"
) => {
  const { data: createdFile, error } = await supabase
    .from("files")
    .insert([fileRecord])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }
  if (workspace_id) {
    await createFileWorkspace({
      user_id: createdFile.user_id,
      file_id: createdFile.id,
      workspace_id
    })
  }

  const filePath = await uploadFile(file, {
    name: createdFile.name,
    user_id: createdFile.user_id,
    file_id: createdFile.name
  })

  await updateFile(createdFile.id, {
    file_path: filePath
  })

  const response = await fetch("/api/retrieval/process/docx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      fileId: createdFile.id,
      embeddingsProvider,
      fileExtension: "docx"
    })
  })

  if (!response.ok) {
    const jsonText = await response.text()
    const json = JSON.parse(jsonText)
    console.error(
      `Error processing file:${createdFile.id}, status:${response.status}, response:${json.message}`
    )
    toast.error("Failed to process file. Reason:" + json.message, {
      duration: 10000
    })
    await deleteFile(createdFile.id)
  }

  const fetchedFile = await getFileById(createdFile.id)

  return fetchedFile
}

export const createFiles = async (
  files: TablesInsert<"files">[],
  workspace_id: string
) => {
  const { data: createdFiles, error } = await supabase
    .from("files")
    .insert(files)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  await createFileWorkspaces(
    createdFiles.map(file => ({
      user_id: file.user_id,
      file_id: file.id,
      workspace_id
    }))
  )

  return createdFiles
}

export const createFileWorkspace = async (item: {
  user_id: string
  file_id: string
  workspace_id: string
}) => {
  const { data: createdFileWorkspace, error } = await supabase
    .from("file_workspaces")
    .insert([item])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdFileWorkspace
}

export const createFileWorkspaces = async (
  items: { user_id: string; file_id: string; workspace_id: string }[]
) => {
  const { data: createdFileWorkspaces, error } = await supabase
    .from("file_workspaces")
    .insert(items)
    .select("*")

  if (error) throw new Error(error.message)

  return createdFileWorkspaces
}

export const updateFile = async (
  fileId: string,
  file: TablesUpdate<"files">
) => {
  const { data: updatedFile, error } = await supabase
    .from("files")
    .update(file)
    .eq("id", fileId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedFile
}

export const deleteFile = async (fileId: string) => {
  const { error } = await supabase.from("files").delete().eq("id", fileId)
  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const deleteFileWorkspace = async (
  fileId: string,
  workspaceId: string
) => {
  const { error } = await supabase
    .from("file_workspaces")
    .delete()
    .eq("file_id", fileId)
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(error.message)

  return true
}

// changes euricom (add functions to generate own files)

export const generateOwnFile = async (
  text: any,
  fileName: string,
  extension: "txt" | "pdf" | "json"
) => {
  const name = getValidFileName(fileName, extension)
  let file
  switch (extension) {
    case "txt": {
      file = generateTextFile(text, name)
      break
    }
    case "pdf": {
      file = generatePDFFile(text, name)
      break
    }
    case "json": {
      file = generateJsonFile(text, name)
      break
    }
    default: {
      return new NextResponse("Unsupported file type", {
        status: 400
      })
    }
  }

  const fileRecord = {
    user_id: "18d332af-2d5b-49e5-8c42-9168b3910f97",
    description: "",
    file_path: "",
    name: name,
    size: file.size,
    tokens: 0,
    type: extension,
    sharing: "public"
  } as TablesInsert<"files">

  const files = await getAdminFiles()
  // console.log("🚀 ~ files:", files)
  const existingFile = files.find(file => {
    return file.name === name
  })
  // console.log("🚀 ~ existingFile ~ existingFile:", existingFile)

  let fileToUpload
  if (existingFile) {
    await deleteFileFromStorage(existingFile.file_path)
    fileToUpload = existingFile
  } else {
    const { data: createdFile, error } = await supabase
      .from("files")
      .insert([fileRecord])
      .select("*")
      .single()

    if (error) {
      throw new Error(error.message)
    }
    fileToUpload = createdFile
  }

  const filePath = await uploadFile(file, {
    name: fileToUpload.name,
    user_id: fileToUpload.user_id,
    file_id: fileToUpload.name
  })

  // console.log("🚀 ~ filePath:", filePath)
  await updateFile(fileToUpload.id, {
    file_path: filePath
  })

  const response = await retrievalProcess(fileToUpload.id, "openai")
  console.log("🚀 ~ response:", response)

  if (!response.ok) {
    const jsonText = await response.text()
    const json = JSON.parse(jsonText)
    console.error(
      `Error processing file:${fileToUpload.id}, status:${response.status}, response:${json.message}`
    )
    toast.error("Failed to process file. Reason:" + json.message, {
      duration: 10000
    })
    await deleteFile(fileToUpload.id)
  }
}

const generateJsonFile = (text: any, fileName: string) => {
  const jsonBlob = new Blob([JSON.stringify(text)], {
    type: "application/json"
  })

  const file = new File([jsonBlob], fileName, {
    type: "application/json"
  })
  return file
}

const generatePDFFile = (text: any, fileName: string) => {
  const doc = new jsPDF()
  doc.setFontSize(8)
  const marginLeft = 10
  const marginTop = 10
  const pageHeight = doc.internal.pageSize.height
  let yPosition = marginTop

  // Deel de tekst op basis van de newline karakters om rekening te houden met handmatige regelovergangen
  const lines = doc.splitTextToSize(text, 180) // 180 is de breedte van de tekst op de pagina, pas dit aan naar wens

  // Loop door de regels en voeg een nieuwe pagina toe indien nodig
  lines.forEach((line: any, index: number) => {
    if (yPosition + 10 > pageHeight) {
      // Check of de volgende regel buiten de pagina valt, pas 10 aan op basis van je regelhoogte
      doc.addPage() // Voeg een nieuwe pagina toe
      yPosition = marginTop // Reset de yPosition voor de nieuwe pagina
    }
    doc.text(line, marginLeft, yPosition) // Voeg de tekst toe op de huidige positie
    yPosition += 7 // Verhoog de yPosition voor de volgende regel, pas dit aan op basis van je regelhoogte
  })
  const jsonBlob = new Blob([doc.output("blob")], { type: "application/pdf" })

  const file = new File([jsonBlob], fileName + ".pdf", {
    type: "application/pdf"
  })
  return file
}

const generateTextFile = (text: any, fileName: string) => {
  const jsonBlob = new Blob([text], {
    type: "text/plain"
  })

  const file = new File([jsonBlob], fileName, {
    type: "text/plain"
  })

  return file
}

const getValidFileName = (fileName: string, extension: string) => {
  let name = fileName
  let validFilename = name.replace(/[^a-z0-9.]/gi, "_").toLowerCase()
  const baseName = validFilename.includes(".")
    ? validFilename.substring(0, validFilename.lastIndexOf("."))
    : validFilename
  const maxBaseNameLength = 100 - (extension?.length || 0) - 1
  if (baseName.length > maxBaseNameLength) {
    name = baseName.substring(0, maxBaseNameLength) + "." + extension
  } else {
    name = baseName + "." + extension
  }
  return name
}

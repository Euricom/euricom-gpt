//changes Euricom (encoding process as own function)
"use server"

import { NextResponse } from "next/server"
import {
  processCSV,
  processJSON,
  processMarkdown,
  processPdf,
  processTxt
} from "../../../../lib/retrieval/processing"
import { FileItemChunk } from "@/types"
import { createClient } from "@supabase/supabase-js"
import { Database } from "@/supabase/types"

export const retrievalProcess = async (file_id: string) => {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: fileMetadata, error: metadataError } = await supabaseAdmin
    .from("files")
    .select("*")
    .eq("id", file_id)
    .single()

  if (metadataError) {
    throw new Error(
      `Failed to retrieve file metadata: ${metadataError.message}`
    )
  }
  if (!fileMetadata) throw new Error("File not found")

  const { data: file, error: fileError } = await supabaseAdmin.storage
    .from("files")
    .download(fileMetadata.file_path)

  if (fileError)
    throw new Error(`Failed to retrieve file: ${fileError.message}`)

  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const blob = new Blob([fileBuffer])
  const fileExtension = fileMetadata.name.split(".").pop()?.toLowerCase()
  let chunks: FileItemChunk[] = []

  switch (fileExtension) {
    case "csv":
      chunks = await processCSV(blob)
      break
    case "json":
      chunks = await processJSON(blob)
      break
    case "md":
      chunks = await processMarkdown(blob)
      break
    case "pdf":
      chunks = await processPdf(blob)
      break
    case "txt":
      chunks = await processTxt(blob)
      break
    default:
      return new NextResponse("Unsupported file type", {
        status: 400
      })
  }

  const file_items = chunks.map((chunk, index) => ({
    file_id,
    user_id: fileMetadata.user_id,
    content: chunk.content,
    tokens: chunk.tokens
  }))

  await supabaseAdmin.from("file_items").upsert(file_items)

  const totalTokens = file_items.reduce((acc, item) => acc + item.tokens, 0)

  await supabaseAdmin
    .from("files")
    .update({ tokens: totalTokens })
    .eq("id", file_id)

  return new NextResponse("success", {
    status: 200
  })
}

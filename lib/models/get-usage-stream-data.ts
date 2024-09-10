import { Usage } from "@/components/chat/chat-helpers"
import { experimental_StreamData } from "ai"

export const getUsageStreamData = (
  stream: any,
  provider: "openai" | "anthropic"
) => {
  const streamData = new experimental_StreamData()
  let usage: Usage = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0
  }

  const feedStreamData = async () => {
    for await (const chunk of stream) {
      switch (provider) {
        case "openai":
          if (chunk.usage) {
            usage = chunk.usage
          }
          break

        case "anthropic":
          if (chunk.usage) {
            usage.completion_tokens = chunk.usage.output_tokens
          }
          if (chunk.message?.usage) {
            usage.prompt_tokens = chunk.message.usage.input_tokens
          }
          if (usage.completion_tokens > 0 && usage.prompt_tokens > 0) {
            usage.total_tokens = usage.completion_tokens + usage.prompt_tokens
          }
          break
      }
    }

    streamData.append(usage)
    streamData.close() // Close the stream after processing all chunks
  }

  feedStreamData()

  return streamData
}

import { experimental_StreamData } from "ai"

export const getUsageStreamData = (stream: any) => {
  const streamData = new experimental_StreamData()

  const feedStreamData = async () => {
    for await (const chunk of stream) {
      if (chunk.usage) {
        streamData.append({ ...chunk.usage })
        streamData.close()
      }
    }
  }

  feedStreamData()

  return streamData
}

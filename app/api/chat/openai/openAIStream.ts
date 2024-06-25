import { OPENAI_LLM_LIST } from "@/lib/models/llm/openai-llm-list"

export function readableFromAsyncIterable<T>(iterable: AsyncIterable<T>) {
  let it = iterable[Symbol.asyncIterator]()
  return new ReadableStream<T>({
    async pull(controller) {
      const { done, value } = await it.next()
      if (done) controller.close()
      else controller.enqueue(value)
    },

    async cancel(reason) {
      await it.return?.(reason)
    }
  })
}

export function createStreamDataTransformer() {
  const encoder = new TextEncoder()
  // const decoder = new TextDecoder()
  return new TransformStream({
    transform: async (chunk, controller) => {
      // console.log("createStreamDataTransformer:chunk", chunk, typeof chunk)
      // const message = decoder.decode(chunk)
      // controller.enqueue(encoder.encode(formatStreamPart("text", message)))
      controller.enqueue(encoder.encode(chunk))
    }
  })
}

function isChatCompletionChunk(data: any) {
  return (
    "choices" in data &&
    data.choices &&
    data.choices[0] &&
    "delta" in data.choices[0]
  )
}

function isCompletion(data: any) {
  return (
    "choices" in data &&
    data.choices &&
    data.choices[0] &&
    "text" in data.choices[0]
  )
}

function trimStartOfStreamHelper(): (text: string) => string {
  let isStreamStart = true

  return (text: string): string => {
    if (isStreamStart) {
      text = text.trimStart()
      if (text) isStreamStart = false
    }
    return text
  }
}

function chunkToText(): (
  chunk: any
) => string | { isText: false; content: string } | void {
  const trimStartOfStream = trimStartOfStreamHelper()
  return json => {
    // console.dir(json, { depth: null })
    let text = trimStartOfStream(
      isChatCompletionChunk(json) && json.choices[0].delta.content
        ? json.choices[0].delta.content
        : isCompletion(json)
          ? json.choices[0].text
          : ""
    )

    if (json.usage) {
      // lets add the usage as a footer text (JSON stringified)
      // so we can extract it later
      const mode = json.model
      const llm = OPENAI_LLM_LIST.find(item => mode.includes(item.modelId))
      const cost =
        (json.usage.prompt_tokens / 1000000) * (llm?.pricing?.inputCost || 0) +
        (json.usage.completion_tokens / 1000000) *
          (llm?.pricing?.outputCost || 0)
      const usage = {
        ...json.usage,
        ...llm?.pricing
      }
      text = `__${JSON.stringify(usage)}__`
      console.log("Usage", usage)
    }

    return text
  }
}

async function* streamable(stream: any) {
  const extract = chunkToText()
  for await (let chunk of stream) {
    const text = extract(chunk)
    if (text) yield text
  }
}

export function OpenAIStreamEx(res: Response): ReadableStream {
  let stream = readableFromAsyncIterable(streamable(res))
  return stream.pipeThrough(createStreamDataTransformer())
}

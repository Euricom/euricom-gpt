<script setup lang="ts">
import { ref, type VNodeRef } from 'vue'

const userInput = ref('')
const history = ref<string[]>(['How can I help you today?'])
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const scrollDivRef = ref<VNodeRef | null>(null)
const loading = ref(false)

const updateTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}

const keyHandler = (key: KeyboardEvent) => {
  if (key.code === 'Enter' && key.shiftKey === false && !loading.value) sendText()
}

const sendText = async () => {
  loading.value = true
  const text = userInput.value
  history.value.push(text)
  userInput.value = ''
  scrollDivRef.value.scrollIntoView({
    behavior: 'smooth'
  })
  try {
    const res = await fetch('http://localhost:5135/euriGPT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ history: history.value })
    })
    const answer = await res.json()

    history.value.push(answer[0].choices[0].message.content)
    updateTextareaHeight()
    setTimeout(() => {
      loading.value = false
      scrollDivRef.value.scrollIntoView({
        behavior: 'smooth'
      })
    }, 1)
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div
    class="w-full max-h-screen flex flex-col h-full overflow-hidden relative"
    @keyup="keyHandler($event)"
  >
    <div class="w-full flex-grow overflow-auto p-5 mt-5">
      <span v-for="(message, index) in history" :key="message">
        <div class="grid grid-cols-2 gap-5">
          <div class="flex justify-center">
            <h1 v-if="index % 2 === 0" class="border rounded p-5 relative whitespace-pre-wrap">
              <div class="circle">
                <img src="../assets/icon-192x192.png" class="h-4" />
              </div>

              {{ message }}
            </h1>
          </div>
          <div class="flex justify-center">
            <h1 v-if="index % 2 !== 0" class="border rounded p-5 relative whitespace-pre-wrap">
              <div class="circle text-xs text-accent text-center align-middle">
                <div class="h-5 w-5 flex align-middle pt-0.5">You</div>
              </div>
              {{ message }}
            </h1>
          </div>
        </div>
      </span>
      <div ref="scrollDivRef"></div>
    </div>
    <div
      class="h-48 max-h-48 mr-5 flex justify-center bottom-0 self-end w-full bg-base-100 flex-none"
    >
      <form class="w-1/3">
        <div class="relative flex flex-1 flex-col">
          <div class="flex w-full items-center">
            <div
              class="overflow-hidden flex flex-col w-full relative border dark:text-white rounded-2xl"
            >
              <textarea
                ref="textareaRef"
                class="m-0 w-full h-fit bg-base-200 outline-none focus-visible:bg-none resize-none border-0 dark:bg-transparent py-[10px] pr-10 md:py-3.5 md:pr-12 max-h-40 placeholder-black/50 dark:placeholder-white/50 pl-4 md:pl-6"
                placeholder="Message EuriGPT"
                v-model="userInput"
                @input="updateTextareaHeight"
              ></textarea>
              <div
                @click="sendText()"
                :disabled="loading"
                class="absolute bottom-1.5 right-2 rounded-lg border border-black bg-black p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:hover:bg-white md:bottom-3 md:right-3"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-white dark:text-black"
                >
                  <path
                    d="M7 11L12 6L17 11M12 18V7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.circle {
  position: absolute;
  top: -10px; /* Adjust this value to position the circle */
  left: -10px; /* Adjust this value to position the circle */
  padding: 5px;
  border-radius: 50%; /* Ensures the circle shape */
  background-color: white; /* Color of the circle */
  border: 1px solid black; /* Border of the circle */
}
</style>

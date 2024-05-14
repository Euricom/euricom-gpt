<script setup lang="ts">
import EuriGPT from './components/EuriGPTComponent.vue'
</script>

<template>
  <div
    class="bg-base text-base-content h-screen grid grid-rows-[3rem_1fr] max-h-screen overflow-hidden"
  >
    <header class="bg-primary-400 text-primary-content items-center text-xl flex gap-5 px-5">
      <img src="./assets/icon-192x192.png" class="h-6" />
      <h1>EuriGPT</h1>
      <div class="flex lg:gap-4 text-[1rem] justify-end flex-grow"></div>
    </header>
    <Suspense>
      <div class="overflow-hidden">
        <EuriGPT />
      </div>
    </Suspense>
  </div>
</template>

<style scoped></style>

<template>
  <div class="w-full">
    <header class="px-8 py-6 bg-white shadow">
      <div class="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold">
          <slot name="title" />
        </h1>

        <div v-if="$slots['actions']" class="flex space-x-2">
          <slot name="actions" />
        </div>
      </div>
    </header>

    <slot />
  </div>
</template>

<template>
  <div class="grid grid-cols-2 gap-5 p-7">
    <div class="bg-white border border-solid shadow-sm p-7">
      <Badge class="h-12 px-6 m-auto mt-4 text-4xl bg-green-500 w-52">
        RUNNING
      </Badge>
      <div class="my-4 text-xl font-semibold text-center">
        Overall state
      </div>
    </div>
    <div class="flex flex-col justify-between bg-white border border-solid shadow-sm p-7 ">
      <div class="flex justify-between mb-2">
        Uptime:
        <span class="text-gray-700 ">
          3 days 10 hours 45 minutes
        </span>
      </div>
      <div class="flex justify-between mb-2">
        Services:
        <span class="text-gray-700 ">
          3/3
        </span>
      </div>
      <div class="flex justify-between mb-2">
        Processes:
        <span class="text-gray-700 ">
          20/20
        </span>
      </div>
    </div>
    <div class="col-span-2 bg-white border border-solid shadow-sm p-7">
      <div class="mb-1 text-2xl font-semibold">
        Last events
      </div>
      <div class="p-3 font-mono text-gray-600 bg-gray-100 border">
        <p>02/08/2021 10:14:53 Starting service 'nginx'...</p>
        <p>02/08/2021 10:14:53 Starting service 'mysql'...</p>
        <p>02/08/2021 10:15:27 Loading new configuration with 2 programs...</p>
        <p>02/08/2021 10:15:28 Stopping service 'nginx'...</p>
        <p>02/08/2021 10:15:28 Stopping service 'mysql'...</p>
        <p>02/08/2021 10:15:29 Starting service 'nginx'...</p>
        <p>02/08/2021 10:15:29 Starting service 'mysql'...</p>
      </div>
    </div>
    <div class="flex flex-wrap col-span-2 gap-5 pb-3 overflow-x-auto">
      <div v-for="program in programs" :key="program.id" v-bind="program" class="flex-grow">
        <router-link class="flex flex-col items-center justify-center bg-white border border-solid shadow-sm cursor-pointer p-7 h-60 hover:bg-gray-50" to="/">
          <div class="text-xl">
            {{ program.id }}
          </div>
          <div class="text-gray-500">
            3/3 processes
          </div>
          <Badge class="mt-10 text-sm bg-green-500">
            {{ program.state }}
          </Badge>
        </router-link>
      </div>

      <router-link class="flex flex-col items-center justify-center bg-white border border-solid shadow-sm cursor-pointer p-7 w-80 h-60 hover:bg-gray-50" to="/programs">
        <div class="mb-8 text-2xl text-gray-700">
          View all
        </div>
        <heroicons-outline-arrow-right class="text-3xl text-gray-500" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usePrograms } from '/~/composables/programs'

export default defineComponent({
  setup() {
    const { programs } = usePrograms()

    return {
      programs,
    }
  },
})
</script>

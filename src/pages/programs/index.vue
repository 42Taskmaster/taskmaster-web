<template>
  <div v-if="loading">
    <Loading />
  </div>
  <div class="w-full">
    <div class="flex w-full p-6 mb-4 text-lg bg-white border-b border-solid shadow-sm">
      <heroicons-outline-search class="mr-4 text-2xl text-gray-500" />
      <input
        v-model="searchQuery"
        class="w-full text-lg outline-none "
        placeholder="Rechercher"
      >
    </div>
    <div class="p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="mb-2 text-3xl">
            Programmes
          </h1>
          <Badge class="mb-1 ml-4 text-sm bg-gray-500">
            {{ filteredPrograms.length }}
          </Badge>
        </div>
        <div class="p-2 mb-2 text-white bg-green-500 rounded-full shadow cursor-pointer hover:bg-green-400">
          <heroicons-outline-plus class="text-xl" />
        </div>
      </div>
      <hr class="mb-3">

      <transition-group
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform -translate-y-6 opacity-25"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-6 opacity-0"
      >
        <Program v-for="program in filteredPrograms" :key="program.id" v-bind="program" />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { usePrograms } from '/~/composables/programs'

export default defineComponent({
  setup() {
    const searchQuery = ref('')

    const loading = ref(true)

    const { programs, isLoading } = usePrograms()

    watch(isLoading, (isLoading) => {
      loading.value = isLoading
    }, {
      immediate: true,
    })

    const filteredPrograms = computed(() => {
      if (searchQuery.value === '')
        return programs.value

      return programs.value.filter(({ programId }) => programId.startsWith(searchQuery.value))
    })

    return {
      searchQuery,
      loading,
      filteredPrograms,
    }
  },
})
</script>

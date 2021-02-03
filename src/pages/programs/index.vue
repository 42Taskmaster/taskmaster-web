<template>
  <div v-if="loading">
    <Loading />
  </div>
  <div class="w-full p-6">
    <input
      v-model="searchQuery"
      class="w-full p-3 mb-10 text-lg border-b-2 border-gray-500 border-solid outline-none "
      placeholder="Rechercher"
    >
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
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 -translate-y-6"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-6"
    >
      <Program v-for="program in filteredPrograms" :key="program.id" v-bind="program" />
    </transition-group>
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

<template>
  <div class="w-full">
    <div v-if="isLoading">
      Loading...
    </div>

    <div v-else-if="program === undefined || programCopy === undefined">
      {{ t('program-unknown') }}
    </div>

    <AppLayout v-else>
      <template #title>
        <router-link :to="programUrl" :title="t('button.back')">
          <heroicons-outline-arrow-left class="inline mr-4 text-2xl text-gray-500 hover:text-gray-700" />
        </router-link>
        {{ t('editing') }} {{ programCopy.configuration.name }}
      </template>

      <template #actions>
        <AppButton size="large" color="green" @click="saveProgram">
          <heroicons-outline-save class="mr-2" />
          {{ t('save') }}
        </AppButton>
        <AppButton size="large" color="red" @click="deleteProgram">
          <heroicons-outline-trash class="mr-2" />
          {{ t('delete') }}
        </AppButton>
      </template>

      <ProgramForm :configuration="programCopy.configuration" />
    </AppLayout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, capitalize } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProgram } from '/~/composables/programs'
import { Program } from '/~/types/index'

export default defineComponent({
  props: {
    id: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const { t } = useI18n()

    const { program, isLoading } = useProgram(props.id)
    const programTitle = computed(() => {
      if (program === undefined)
        return 'undefined'
      return capitalize((program.value as Program).id)
    })
    const programUrl = computed(() => {
      if (program === undefined)
        return 'undefined'
      return `/programs/${(program.value as Program).id}`
    })

    const programCopy = program

    function saveProgram() {

    }

    function deleteProgram() {
      // if (!confirm(t('delete_confirm'))) {
      //   return
      // }
    }

    return {
      t,
      program,
      programTitle,
      programUrl,
      programCopy,
      isLoading,
      saveProgram,
      deleteProgram,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "editing": "Editing:",
    "save": "Save",
    "delete": "Delete",
    "delete_confirm": "Are you sure you want to delete this program ?",
  },

  "fr": {
    "editing": "Modification :",
    "save": "Sauvegarder",
    "delete": "Supprimer",
    "delete_confirm": "Êtes-vous certain de vouloir supprimer ce programme ?",
  }
}
</i18n>

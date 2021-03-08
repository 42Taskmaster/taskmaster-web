<template>
  <div class="w-full">
    <div v-if="isLoading">
      <AppLoadingOverlay />
    </div>

    <AppAlert v-else-if="program === undefined" class="m-5" type="WARNING">
      {{ t('program_unknown') }}
    </AppAlert>

    <AppLayout v-else :actions="layoutActions">
      <template #title>
        <router-link :to="programUrl" :title="t('button.back')">
          <heroicons-outline-arrow-left class="inline mr-4 text-gray-500 hover:text-gray-700" />
        </router-link>
        {{ t('editing') }} {{ program.id }}
      </template>

      <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlert">
        {{ alert.message }}
      </AppAlert>

      <ProgramForm v-model:configuration="configuration" />
    </AppLayout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, capitalize, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import SaveIcon from '/@vite-icons/heroicons-outline/save.vue'
import TrashIcon from '/@vite-icons/heroicons-outline/trash.vue'

import { useFetcher } from '/~/composables/fetcher'
import { useProgram } from '/~/composables/programs'
import { Alert, AlertType, ProgramConfiguration, ActionOptions, AppButtonColors } from '/~/types/index'

export default defineComponent({
  props: {
    id: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const { t } = useI18n()

    const fetcher = useFetcher()

    const alert = ref<Alert>({
      show: false,
      type: AlertType.PRIMARY,
      message: '',
    })
    function showAlert(type: AlertType, message: string) {
      alert.value.type = type
      alert.value.show = true
      alert.value.message = message
    }
    function closeAlert() {
      alert.value.show = false
    }

    const router = useRouter()

    const configuration = ref<ProgramConfiguration>()

    const { program, isLoading } = useProgram(props.id, false)
    watch(program, (program) => {
      configuration.value = program?.configuration
    }, {
      immediate: true,
    })

    const programTitle = computed(() => {
      if (program.value === undefined)
        return 'undefined'

      return capitalize(program.value.id)
    })

    const programUrl = computed(() => {
      if (program.value === undefined)
        return 'undefined'

      return `/programs/${program.value.id}`
    })

    async function saveProgram() {
      if (!(fetcher.value && program.value && configuration.value))
        return

      const { data } = await fetcher.value.fetcher.post('/programs/edit', {
        id: program.value.id,
        configuration: configuration.value,
      })
      if (data.error !== undefined)
        showAlert(AlertType.DANGER, `${t('error_occured')} : ${data.error}`)
      else
        router.push(`/programs/${configuration.value.name}?saved`)
    }

    async function deleteProgram() {
      if (!confirm(t('delete_confirm')))
        return
      if (fetcher.value && program.value) {
        const { data } = await fetcher.value.fetcher.post('/programs/delete', { id: program.value.id })
        if (data.error !== undefined)
          showAlert(AlertType.DANGER, `${t('error_occured')} : ${data.error}`)
        else
          router.push('/programs?deleted')
      }
    }

    const layoutActions = computed<ActionOptions[]>(() => [
      {
        color: AppButtonColors.green,
        icon: SaveIcon,
        text: t('save'),
        onClick: saveProgram,
      },
      {
        color: AppButtonColors.red,
        icon: TrashIcon,
        text: t('delete'),
        onClick: deleteProgram,
      },
    ])

    return {
      t,

      alert,
      closeAlert,

      configuration,

      program,
      programTitle,
      programUrl,
      isLoading,
      saveProgram,
      deleteProgram,

      layoutActions,
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

<template>
  <AppLayout :actions="layoutActions">
    <template #title>
      <router-link to="/programs" :title="t('button.back')">
        <heroicons-outline-arrow-left class="inline mr-4 text-gray-500 hover:text-gray-700" />
      </router-link>
      {{ t('add_new_program') }}
    </template>

    <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlert">
      {{ alert.message }}
    </AppAlert>

    <div class="pb-8">
      <ProgramForm v-model:configuration="configuration" />
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PlusCircleIcon from '/@vite-icons/heroicons-outline/plus-circle.vue'

import { Alert, AlertType, ProgramConfiguration, ActionOptions, AppButtonColors, AppButtonSize } from '/~/types/index'
import { useFetcher } from '/~/composables/fetcher'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const fetcher = useFetcher()
    const router = useRouter()
    const configuration = ref<ProgramConfiguration>({
      name: '',
      cmd: '',
      numprocs: 1,
      umask: '',
      workingdir: '',
      autostart: true,
      autorestart: 'unexpected',
      exitcodes: [0],
      startretries: 1,
      starttime: 5,
      stopsignal: 'TERM',
      stoptime: 5,
      stdout: '',
      stderr: '',
      env: {},
    })

    const alert = ref<Alert>({
      show: false,
      type: AlertType.PRIMARY,
      message: '',
    })
    function closeAlert() {
      alert.value.show = false
    }
    function showAlert(type: AlertType, message: string) {
      alert.value.type = type
      alert.value.show = true
      alert.value.message = message
    }

    async function saveProgram() {
      if (fetcher.value !== undefined && fetcher.value !== null) {
        const { data } = await fetcher.value.fetcher.post('/programs/create', configuration.value)
        if (data.error !== undefined)
          showAlert(AlertType.DANGER, `${t('error_occured')} : ${data.error}`)
        else
          router.push('/programs?new')
      }
    }

    const layoutActions = computed<ActionOptions[]>(() => [
      {
        size: AppButtonSize.large,
        color: AppButtonColors.green,
        icon: PlusCircleIcon,
        text: t('button.save'),
        onClick: saveProgram,
      },
    ])

    return {
      t,

      configuration,

      alert,
      closeAlert,

      saveProgram,

      layoutActions,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "add_new_program": "Add a new program",
  },

  "fr": {
    "add_new_program": "Ajouter un nouveau programme",
  }
}
</i18n>

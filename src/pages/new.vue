<template>
  <div class="w-full">
    <AppLayout>
      <template #title>
        <router-link to="/programs" :title="t('button.back')">
          <heroicons-outline-arrow-left class="inline mr-4 text-2xl text-gray-500 hover:text-gray-700" />
        </router-link>
        {{ t('add_new_program') }}
      </template>

      <template #actions>
        <AppButton size="large" color="green" @click="saveProgram">
          <heroicons-outline-plus-circle class="mr-2" />
          {{ t('button.save') }}
        </AppButton>
      </template>

      <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlert">
        {{ alert.message }}
      </AppAlert>

      <ProgramForm :configuration="configuration" />
    </AppLayout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Alert, AlertType, ProgramConfiguration } from '../types/index'
import { fetcher } from '../api/index'

export default defineComponent({
  setup() {
    const { t } = useI18n()
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
      env: { awfawf: 'fggsegseg' },
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
      const { data } = await fetcher.post('/programs', configuration.value)
      if (data.error !== undefined)
        showAlert(AlertType.DANGER, `${t('error_occured')} : ${data.error}`)
      else
        router.push('/programs?new')
    }

    return {
      t,

      configuration,

      alert,
      closeAlert,

      saveProgram,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "add_new_program": "Add a new program",
    "error_occured": "An error occured",
  },

  "fr": {
    "add_new_program": "Ajouter un nouveau programme",
    "error_occured": "Une erreur est survenue",
  }
}
</i18n>

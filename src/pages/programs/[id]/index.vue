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
        <router-link to="/programs" :title="t('button.back')">
          <heroicons-outline-arrow-left class="inline mr-4 text-gray-500 hover:text-gray-700" />
        </router-link>
        {{ programTitle }}
      </template>

      <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlert">
        {{ alert.message }}
      </AppAlert>

      <h2 class="text-lg font-medium leading-6 text-gray-900">
        {{ t('overview') }}
      </h2>

      <div class="grid grid-cols-1 gap-8 mt-2 md:grid-cols-2 lg:grid-cols-3">
        <article>
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ChartBarIcon class="text-gray-400" />
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      {{ t('program-state') }}
                    </dt>
                    <dd>
                      <div class="inline-block font-medium text-gray-900">
                        <AppStatusBadge :status="program.state" />
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </article>
        <article>
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ChipIcon class="text-gray-400" />
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      {{ t('process', processesCount) }}
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        {{ program.processes.length }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </article>
        <article>
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <IdentificationIcon class="text-gray-400" />
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      {{ t('command') }}
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        {{ program.configuration.cmd }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <h2 class="mt-8 text-lg font-medium leading-6 text-gray-900">
        {{ t('active-processes') }}
      </h2>

      <div class="rounded-lg shadow sm:hidden">
        <ul class="mt-2 overflow-auto divide-y divide-gray-200 rounded-lg shadow-sm sm:hidden">
          <li v-for="process in processes" :key="process.id">
            <div class="block px-4 py-4 text-sm text-gray-500 truncate bg-white hover:bg-gray-50">
              <div class="flex flex-col">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">
                    {{ t('pid') }} : {{ process.pid !== 0 ? process.pid : "-" }}
                  </span>

                  <AppStatusBadge :status="process.state" :light="true" class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium" />
                </div>

                <span class="font-medium text-gray-900">{{ t('identifier') }} : {{ process.id }}</span>

                <span>{{ t('uptime') }} : {{ uptimeString(process.startedAt, process.endedAt) }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="hidden sm:block">
        <div class="flex flex-col mt-2">
          <div class="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    {{ t('pid') }}
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    {{ t('identifier') }}
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    {{ t('status') }}
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    {{ t('uptime') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="process in processes" :key="process.id" class="bg-white">
                  <td class="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                    <span class="font-medium text-gray-900">
                      {{ process.pid !== 0 ? process.pid : "-" }}
                    </span>
                  </td>
                  <td class="w-full px-6 py-4 text-sm text-left text-gray-500 max-w-0 whitespace-nowrap">
                    <span class="font-medium text-gray-900">
                      {{ process.id }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                    <AppStatusBadge :status="process.state" :light="true" class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium" />
                  </td>
                  <td class="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                    {{ uptimeString(process.startedAt, process.endedAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, capitalize, ref } from 'vue'
import { useMachine } from '@xstate/vue'
import { useI18n } from 'vue-i18n'
import ChartBarIcon from '/@vite-icons/heroicons-outline/chart-bar.vue'
import ChipIcon from '/@vite-icons/heroicons-outline/chip.vue'
import IdentificationIcon from '/@vite-icons/heroicons-outline/identification.vue'

import { restartProgram, startProgram, stopProgram } from '/~/api/program'
import { useProgram } from '/~/composables/programs'
import { programMachine, ProgramMachineActions, ProgramMachineMeta } from '/~/machines/program'
import { mergeMeta } from '/~/machines/utils'
import { Alert, AlertType, Program, ActionOptions, AppButtonSize } from '/~/types/index'
import { useRouter } from 'vue-router'
import { useFetcher } from '/~/composables/fetcher'

export default defineComponent({
  components: {
    ChartBarIcon,
    ChipIcon,
    IdentificationIcon,
  },
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

    const { program, isLoading } = useProgram(props.id)
    const programTitle = computed(() => {
      if (program === undefined)
        return 'undefined'
      return capitalize((program.value as Program).id)
    })
    const { state, send } = useMachine(programMachine, {
      actions: {
        [ProgramMachineActions.START]: handleStartProgram,
        [ProgramMachineActions.STOP]: handleStopProgram,
        [ProgramMachineActions.RESTART]: handleRestartProgram,
        [ProgramMachineActions.EDIT]: handleModifyProgram,
      },
    })

    watch(program, (program) => {
      if (program === undefined)
        return

      send({
        type: program.state,
      })
    }, {
      immediate: true,
    })

    const layoutActions = computed<ActionOptions[]>(() => {
      const currentStateMeta = state.value.meta
      const { actions } = mergeMeta<ProgramMachineMeta>(currentStateMeta)

      return actions.map(action => ({
        size: AppButtonSize.large,
        text: t(`button.${action}`),
        onClick: () => send(action),
      }))
    })

    async function handleStartProgram() {
      const programId = program.value?.id
      if (programId === undefined)
        return

      try {
        if (fetcher.value !== undefined && fetcher.value !== null)
          await startProgram(programId, fetcher.value.fetcher)
        else
          throw new Error('Fetcher is undefined or null')
      }
      catch (err) {
        console.error(err)
        // trigger notification
      }
    }

    async function handleStopProgram() {
      const programId = program.value?.id
      if (programId === undefined)
        return

      try {
        if (fetcher.value !== undefined && fetcher.value !== null)
          await stopProgram(programId, fetcher.value.fetcher)
        else
          throw new Error('Fetcher is undefined or null')
      }
      catch (err) {
        console.error(err)
        // trigger notification
      }
    }

    async function handleRestartProgram() {
      const programId = program.value?.id
      if (programId === undefined)
        return

      try {
        if (fetcher.value !== undefined && fetcher.value !== null)
          await restartProgram(programId, fetcher.value.fetcher)
        else
          throw new Error('Fetcher is undefined or null')
      }
      catch (err) {
        console.error(err)
        // trigger notification
      }
    }

    function handleModifyProgram() {
      const programId = program.value?.id
      if (programId === undefined)
        return

      router.push(`/programs/${programId}/edit`)
    }

    const processesCount = computed(() => {
      if (!program.value)
        return 0

      return program.value.processes.length
    })

    const statistics = computed(() => {
      if (program.value === undefined)
        return []

      return [
        {
          text: t('program-state'),
          value: t(`program-status.${program.value.state}`),
          icon: ChartBarIcon,
        },
        {
          text: t('process', processesCount.value),
          value: processesCount,
          icon: ChipIcon,
        },
        {
          text: t('command'),
          value: program.value.configuration.cmd,
          icon: IdentificationIcon,
        },
      ]
    })

    const processes = computed(() => {
      if (program.value === undefined)
        return []

      return program.value.processes
    })

    function uptimeString(startedAt: string, endedAt: string): string {
      const startDate = new Date(startedAt)
      if (startDate.getFullYear() <= 1)
        return '-'
      const endDate = new Date(endedAt)
      let duration = (endDate.getFullYear() > 1 ? endDate.getTime() : new Date().getTime()) - startDate.getTime()
      duration /= 1000
      const days = Math.floor(duration / 86400)
      duration -= days * 86400
      const hours = Math.floor(duration / 3600) % 24
      duration -= hours * 3600
      const minutes = Math.floor(duration / 60) % 60
      duration -= minutes * 60
      const seconds = Math.floor(duration % 60)

      const array = []
      if (days !== 0)
        array.push(`${days} ${t('date.day', days)}`)
      if (hours !== 0)
        array.push(`${hours} ${t('date.hour', hours)}`)
      if (minutes !== 0)
        array.push(`${minutes} ${t('date.minute', minutes)}`)
      if (seconds !== 0)
        array.push(`${seconds} ${t('date.second', seconds)}`)

      let uptimeString = ''
      array.forEach((str, i) => {
        uptimeString += str
        if (i === array.length - 2)
          uptimeString += ` ${t('and')} `
        else if (i !== array.length - 1)
          uptimeString += ', '
      })

      return uptimeString
    }

    const router = useRouter()
    if (router.currentRoute.value.query.saved !== undefined)
      showAlert(AlertType.SUCCESS, t('program_saved'))

    return {
      t,

      alert,
      closeAlert,

      program,
      programTitle,
      isLoading,

      layoutActions,

      statistics,
      processes,
      processesCount,

      uptimeString,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "overview": "Overview",
    "program-state": "Program state",
    "process": "Process | Processes",
    "command": "Command",
    "program-unknown": "This program does not exists.",

    "active-processes": "Active processes",
    "pid": "PID",
    "identifier": "Identifier",
    "status": "Status",
    "uptime": "Uptime",

    "button": {
      "start": "Start",
      "stop": "Stop",
      "restart": "Restart",
    },

    "titles": {
      "dashboard": "Dashboard",
      "programs": "Programs",
    },

    "and": "and",

    "date": {
      "day": "day | days",
      "hour": "hour | hours",
      "minute": "minute | minutes",
      "second": "second | seconds"
    },

    "program_saved": "Your modifications have been saved.",
  },

  "fr": {
    "overview": "Vue d'ensemble",
    "program-state": "État du programme",
    "process": "Processus",
    "command": "Commande",
    "program-unknown": "Ce programme n'existe pas.",

    "active-processes": "Processus actifs",
    "pid": "PID",
    "identifier": "Identifiant",
    "status": "Statut",
    "uptime": "Disponibilité",

    "button": {
      "start": "Lancer",
      "stop": "Stopper",
      "restart": "Redémarrer",
    },

    "and": "et",

    "date": {
      "day": "jour | jours",
      "hour": "heure | heures",
      "minute": "minute | minutes",
      "second": "seconde | secondes"
    },

    "program_saved": "Les modifications ont été enregistrées.",
  }
}
</i18n>

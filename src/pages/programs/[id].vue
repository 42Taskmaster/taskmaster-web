<template>
  <div class="w-full">
    <div v-if="isLoading">
      Loading...
    </div>

    <div v-else-if="program === undefined">
      This program does not exist
    </div>

    <AppLayout v-else>
      <template #title>
        <router-link to="/programs" :title="t('buttons.back')">
          <heroicons-outline-arrow-left class="mr-4 text-2xl text-gray-500 inline hover:text-gray-700" />
        </router-link>
        {{ programTitle }}
      </template>

      <template #actions>
        <AppButton v-for="{text, action} in actions" :key="text" size="large" @click="action">
          {{ text }}
        </AppButton>
      </template>

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
                      <div class="font-medium text-gray-900 inline-block">
                        <StatusBadge :status="program.state" />
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

      <!-- Activity list (smallest breakopoint only) -->
      <div class="shadow sm:hidden">
        <ul class="mt-2 overflow-hidden divide-y divide-gray-200 shadow sm:hidden">
          <li>
            <a href="#" class="block px-4 py-4 text-sm text-gray-500 truncate bg-white hover:bg-gray-50">
              <div class="flex flex-col">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">10232</span>

                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                    success
                  </span>
                </div>

                <span class="font-medium text-gray-900">Vogsphere-2</span>

                <span>July 11, 2020</span>
              </div>
            </a>
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
                      {{ process.pid != 0 ? process.pid : "" }}
                    </span>
                  </td>
                  <td class="w-full px-6 py-4 text-sm text-left text-gray-500 max-w-0 whitespace-nowrap">
                    <span class="font-medium text-gray-900">
                      {{ process.id }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                    <StatusBadge :status="process.state" :light="true" class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium" />
                  </td>
                  <td class="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                    <!-- FIXME: use real uptime -->
                    July 11, 2020
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
import { defineComponent, computed, watch, capitalize } from 'vue'
import { useMachine } from '@xstate/vue'
import { useI18n } from 'vue-i18n'
import ChartBarIcon from '/@vite-icons/heroicons-outline/chart-bar.vue'
import ChipIcon from '/@vite-icons/heroicons-outline/chip.vue'
import IdentificationIcon from '/@vite-icons/heroicons-outline/identification.vue'

import { useProgram } from '/~/composables/programs'
import { programMachine, ProgramMachineActions, ProgramMachineMeta } from '/~/machines/program'
import { mergeMeta } from '/~/machines/utils'
import { Program } from '/~/types'

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

    const { program, isLoading } = useProgram(props.id)
    const programTitle = computed(() => {
      if (program === undefined)
        return 'undefined'
      return capitalize((program.value as Program).id)
    })
    const { state, send } = useMachine(programMachine, {
      actions: {
        [ProgramMachineActions.START]: startProgram,
        [ProgramMachineActions.STOP]: stopProgram,
        [ProgramMachineActions.RESTART]: restartProgram,
        [ProgramMachineActions.MODIFY]: modifyProgram,
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

    const actions = computed(() => {
      const currentStateMeta = state.value.meta
      const { actions } = mergeMeta<ProgramMachineMeta>(currentStateMeta)

      return actions.map(action => ({
        text: t(`actions.${action}`),
        action: () => send(action),
      }))
    })

    function startProgram() {
      console.log('start the program')
    }

    function stopProgram() {
      console.log('stop the program')
    }

    function restartProgram() {
      console.log('restart the program')
    }

    function modifyProgram() {
      console.log('modify the program')
    }

    const statistics = computed(() => {
      if (program.value === undefined)
        return []

      const processesCount = program.value.processes.length

      return [
        {
          text: t('program-state'),
          value: t(`program-status.${program.value.state}`),
          icon: ChartBarIcon,
        },
        {
          text: t('process', processesCount),
          value: processesCount,
          icon: ChipIcon,
        },
        {
          text: t('command'),
          // FIXME: replace with the real command
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

    return {
      t,

      program,
      programTitle,
      isLoading,

      actions,

      statistics,
      processes,
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

    "active-processes": "Active processes",
    "pid": "PID",
    "identifier": "Identifier",
    "status": "Status",
    "uptime": "Uptime",

    "actions": {
      "start": "Start",
      "stop": "Stop",
      "restart": "Restart",
      "modify": "Edit",
    },

    "titles": {
      "dashboard": "Dashboard",
      "programs": "Programs",
    },

    "buttons": {
      "back": "Back",
    }
  },

  "fr": {
    "overview": "Vue d'ensemble",
    "program-state": "État du programme",
    "process": "Processus",
    "command": "Commande",

    "active-processes": "Processus actifs",
    "pid": "PID",
    "identifier": "Identifiant",
    "status": "Statut",
    "uptime": "Disponibilité",

    "actions": {
      "start": "Lancer",
      "stop": "Stopper",
      "restart": "Redémarrer",
      "modify": "Modifier",
    },

    "buttons": {
      "back": "Retour",
    }
  }
}
</i18n>

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
        {{ program.programId }}
      </template>

      <template #actions>
        <AppButton v-for="{text, action} in actions" :key="text" size="large" @click="action">
          {{ text }}
        </AppButton>
      </template>

      <h2 class="text-lg font-medium leading-6 text-gray-900">
        Overview
      </h2>

      <div class="grid grid-cols-1 gap-8 mt-2 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="({ text, value, icon }, index) in statistics" :key="index">
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <component :is="icon" class="text-gray-400" />
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      {{ text }}
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        {{ value }}
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
        Processus actifs
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
                    PID
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    Identifiant
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    Statut
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    Uptime
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="bg-white">
                  <td class="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                    <span class="font-medium text-gray-900">
                      10232
                    </span>
                  </td>
                  <td class="w-full px-6 py-4 text-sm text-left text-gray-500 max-w-0 whitespace-nowrap">
                    <span class="font-medium text-gray-900">Vogsphere-2</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                      success
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
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
import { defineComponent, computed } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import ChartBarIcon from '/@vite-icons/heroicons-outline/chart-bar.vue'
import ChipIcon from '/@vite-icons/heroicons-outline/chip.vue'
import IdentificationIcon from '/@vite-icons/heroicons-outline/identification.vue'

import { ProgramState, useProgram } from '/~/composables/programs'

enum AvailableAction {
  start = 'start',
  stop = 'stop',
  restart = 'restart',
  modify = 'modify',
}

type ProgramMachineState = ProgramState

const programMachine = (initialState: ProgramMachineState) => createMachine({
  id: 'program',
  initial: initialState,
  states: {
    [ProgramState.STARTING]: {
      meta: {
        actions: [
          AvailableAction.start,
          AvailableAction.modify,
        ],
      },

      on: {
        [AvailableAction.stop]: {
          actions: () => {
            console.log('stop')
          },
        },
        [AvailableAction.modify]: {
          actions: () => {
            console.log('modify')
          },
        },
      },
    },

    [ProgramState.RUNNING]: {
      meta: {
        actions: [
          AvailableAction.restart,
          AvailableAction.stop,
          AvailableAction.modify,
        ],
      },

      on: {
        [AvailableAction.restart]: {
          actions: () => {
            console.log('restart')
          },
        },
        [AvailableAction.stop]: {
          actions: () => {
            console.log('stop')
          },
        },
        [AvailableAction.modify]: {
          actions: () => {
            console.log('modify')
          },
        },
      },
    },

    [ProgramState.STOPPING]: {
      meta: {
        actions: [
          AvailableAction.modify,
        ],
      },

      on: {
        [AvailableAction.modify]: {
          actions: () => {
            console.log('modify')
          },
        },
      },
    },

    [ProgramState.STOPPED]: {
      meta: {
        actions: [
          AvailableAction.start,
          AvailableAction.modify,
        ],
      },

      on: {
        [AvailableAction.start]: {
          actions: () => {
            console.log('start')
          },
        },
        [AvailableAction.stop]: {
          actions: () => {
            console.log('stop')
          },
        },
      },
    },

    [ProgramState.BACKOFF]: {
      meta: {
        actions: [
          AvailableAction.modify,
        ],
      },

      on: {
        [AvailableAction.stop]: {
          actions: () => {
            console.log('modify')
          },
        },
      },
    },

    [ProgramState.EXITED]: {
      meta: {
        actions: [
          AvailableAction.start,
          AvailableAction.modify,
        ],
      },

      on: {
        [AvailableAction.start]: {
          actions: () => {
            console.log('modify')
          },
        },
        [AvailableAction.stop]: {
          actions: () => {
            console.log('modify')
          },
        },
      },
    },
  },
})

export default defineComponent({
  props: {
    id: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const { program, isLoading } = useProgram(props.id)

    const actions = computed(() => {
      if (program.value === undefined)
        return undefined

      const availableActions: Record<AvailableAction, { text: string; action: () => void }> = {
        [AvailableAction.start]: {
          text: 'Start',
          action: startProgram,
        },
        [AvailableAction.stop]: {
          text: 'Stop',
          action: stopProgram,
        },
        [AvailableAction.restart]: {
          text: 'Restart',
          action: restartProgram,
        },
        [AvailableAction.modify]: {
          text: 'Modify',
          action: modifyProgram,
        },
      }

      switch (program.value.programState) {
        case 'STARTING':
          return [
            availableActions.stop,
            availableActions.modify,
          ]
        case 'BACKOFF':
        case 'RUNNING':
        case 'STOPPING':
        case 'STOPPED':
          return [
            availableActions.start,
            availableActions.modify,
          ]
        case 'EXITED':
        case 'FATAL':
        case 'UNKNOWN':
        default:
          throw new Error('Reached unreachable case')
      }
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
      console.log('modifyProgram')
    }

    const statistics = computed(() => {
      return [
        {
          text: 'État du programme',
          value: 'En cours',
          icon: ChartBarIcon,
        },
        {
          text: 'Processus',
          value: '3',
          icon: ChipIcon,
        },
        {
          text: 'Commande',
          value: 'cat /dev/zero',
          icon: IdentificationIcon,
        },
      ]
    })

    return {
      program,
      isLoading,

      actions,

      statistics,
    }
  },
})
</script>

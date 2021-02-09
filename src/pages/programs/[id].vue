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
import { defineComponent, computed, watch } from 'vue'
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

enum ProgramMachineActions {
  START = 'START',
  STOP = 'STOP',
  RESTART = 'RESTART',
  MODIFY = 'MODIFY',
}

interface ProgramMachineMeta {
  actions: AvailableAction[]
}

interface ProgramMachineContext {}

type ProgramMachineState =
  | {
    value: 'SELECTING'
    context: ProgramMachineContext
  }
  | {
    value: ProgramState.STARTING
    context: ProgramMachineContext
    meta: ProgramMachineMeta
  }
  | {
    value: ProgramState.RUNNING
    context: ProgramMachineContext
    meta: ProgramMachineMeta
  }
  | {
    value: ProgramState.STOPPING
    context: ProgramMachineContext
    meta: ProgramMachineMeta
  }
  | {
    value: ProgramState.STOPPED
    context: ProgramMachineContext
    meta: ProgramMachineMeta
  }
  | {
    value: ProgramState.BACKOFF
    context: ProgramMachineContext
    meta: ProgramMachineMeta
  }
  | {
    value: ProgramState.EXITED
    context: ProgramMachineContext
    meta: ProgramMachineMeta
  }
  | {
    value: ProgramState.FATAL
    context: ProgramMachineContext
    meta: ProgramMachineMeta
  }
  | {
    value: ProgramState.UNKNOWN
    context: ProgramMachineContext
    meta: ProgramMachineMeta
  }

type ProgramMachineEvent =
  | {
    type: AvailableAction.start
  }
  | {
    type: AvailableAction.stop
  }
  | {
    type: AvailableAction.restart
  }
  | {
    type: AvailableAction.modify
  }
  | {
    type: ProgramState
  }

const programMachine = createMachine<ProgramMachineContext, ProgramMachineEvent, ProgramMachineState>({
  id: 'program',
  initial: ProgramState.UNKNOWN,
  states: {
    [ProgramState.STARTING]: {
      meta: {
        actions: [
          AvailableAction.stop,
          AvailableAction.modify,
        ],
      },

      on: {
        [AvailableAction.stop]: {
          actions: ProgramMachineActions.STOP,
        },
        [AvailableAction.modify]: {
          actions: ProgramMachineActions.MODIFY,
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
          actions: ProgramMachineActions.RESTART,
        },
        [AvailableAction.stop]: {
          actions: ProgramMachineActions.STOP,
        },
        [AvailableAction.modify]: {
          actions: ProgramMachineActions.MODIFY,
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
          actions: ProgramMachineActions.MODIFY,
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
          actions: ProgramMachineActions.START,
        },
        [AvailableAction.modify]: {
          actions: ProgramMachineActions.MODIFY,
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
        [AvailableAction.modify]: {
          actions: ProgramMachineActions.MODIFY,
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
          actions: ProgramMachineActions.START,
        },
        [AvailableAction.modify]: {
          actions: ProgramMachineActions.MODIFY,
        },
      },
    },

    [ProgramState.FATAL]: {
      meta: {
        actions: [
          AvailableAction.start,
          AvailableAction.modify,
        ],
      },

      on: {
        [AvailableAction.start]: {
          actions: ProgramMachineActions.START,
        },
        [AvailableAction.modify]: {
          actions: ProgramMachineActions.MODIFY,
        },
      },
    },

    [ProgramState.UNKNOWN]: {
      meta: {
        actions: [
          AvailableAction.modify,
        ],
      },

      on: {
        [AvailableAction.modify]: {
          actions: ProgramMachineActions.MODIFY,
        },
      },
    },
  },

  on: {
    [ProgramState.BACKOFF]: ProgramState.BACKOFF,
    [ProgramState.RUNNING]: ProgramState.RUNNING,
    [ProgramState.STOPPING]: ProgramState.STOPPING,
    [ProgramState.STOPPED]: ProgramState.STOPPED,
    [ProgramState.EXITED]: ProgramState.EXITED,
    [ProgramState.FATAL]: ProgramState.FATAL,
    [ProgramState.UNKNOWN]: ProgramState.UNKNOWN,
  },
})

function mergeMeta<T>(meta: Record<string, T>): T {
  return Object.keys(meta).reduce((acc, key) => {
    const value = meta[key]

    // Assuming each meta value is an object
    Object.assign(acc, value)

    return acc
  }, {} as T)
}

export default defineComponent({
  props: {
    id: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const { program, isLoading } = useProgram(props.id)
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
        type: program.programState,
      })
    },
    )

    const actions = computed(() => {
      console.log(state.value)

      const { actions } = mergeMeta<ProgramMachineMeta>(state.value.meta)

      return actions.map(action => ({
        text: action,
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

import { createMachine } from 'xstate'

import { ProgramState } from '/~/composables/programs'

export enum AvailableAction {
  start = 'start',
  stop = 'stop',
  restart = 'restart',
  modify = 'modify',
}

export enum ProgramMachineActions {
  START = 'START',
  STOP = 'STOP',
  RESTART = 'RESTART',
  MODIFY = 'MODIFY',
}

export interface ProgramMachineMeta {
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

export const programMachine = createMachine<ProgramMachineContext, ProgramMachineEvent, ProgramMachineState>({
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

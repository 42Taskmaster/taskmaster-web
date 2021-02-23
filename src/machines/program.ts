import { Machine } from 'xstate'

import { ProgramState } from '/~/types/index'

export enum AvailableAction {
  start = 'start',
  stop = 'stop',
  restart = 'restart',
  EDIT = 'EDIT',
}

export enum ProgramMachineActions {
  START = 'START',
  STOP = 'STOP',
  RESTART = 'RESTART',
  EDIT = 'EDIT',
}

export interface ProgramMachineMeta {
  actions: AvailableAction[]
}

interface ProgramMachineContext {}

interface ProgramMachineState {
  states: {
    [ProgramState.STARTING]: {}
    [ProgramState.RUNNING]: {}
    [ProgramState.STOPPING]: {}
    [ProgramState.STOPPED]: {}
    [ProgramState.BACKOFF]: {}
    [ProgramState.EXITED]: {}
    [ProgramState.FATAL]: {}
    [ProgramState.UNKNOWN]: {}
  }
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
    type: AvailableAction.EDIT
  }
  | {
    type: ProgramState
  }

export const programMachine = Machine<ProgramMachineContext, ProgramMachineState, ProgramMachineEvent>({
  id: 'program',
  initial: ProgramState.UNKNOWN,
  states: {
    [ProgramState.STARTING]: {
      meta: {
        actions: [
          AvailableAction.stop,
          AvailableAction.EDIT,
        ],
      },

      on: {
        [AvailableAction.stop]: {
          actions: ProgramMachineActions.STOP,
        },
        [AvailableAction.EDIT]: {
          actions: ProgramMachineActions.EDIT,
        },
      },
    },

    [ProgramState.RUNNING]: {
      meta: {
        actions: [
          AvailableAction.restart,
          AvailableAction.stop,
          AvailableAction.EDIT,
        ],
      },

      on: {
        [AvailableAction.restart]: {
          actions: ProgramMachineActions.RESTART,
        },
        [AvailableAction.stop]: {
          actions: ProgramMachineActions.STOP,
        },
        [AvailableAction.EDIT]: {
          actions: ProgramMachineActions.EDIT,
        },
      },
    },

    [ProgramState.STOPPING]: {
      meta: {
        actions: [
          AvailableAction.EDIT,
        ],
      },

      on: {
        [AvailableAction.EDIT]: {
          actions: ProgramMachineActions.EDIT,
        },
      },
    },

    [ProgramState.STOPPED]: {
      meta: {
        actions: [
          AvailableAction.start,
          AvailableAction.EDIT,
        ],
      },

      on: {
        [AvailableAction.start]: {
          actions: ProgramMachineActions.START,
        },
        [AvailableAction.EDIT]: {
          actions: ProgramMachineActions.EDIT,
        },
      },
    },

    [ProgramState.BACKOFF]: {
      meta: {
        actions: [
          AvailableAction.EDIT,
        ],
      },

      on: {
        [AvailableAction.EDIT]: {
          actions: ProgramMachineActions.EDIT,
        },
      },
    },

    [ProgramState.EXITED]: {
      meta: {
        actions: [
          AvailableAction.start,
          AvailableAction.EDIT,
        ],
      },

      on: {
        [AvailableAction.start]: {
          actions: ProgramMachineActions.START,
        },
        [AvailableAction.EDIT]: {
          actions: ProgramMachineActions.EDIT,
        },
      },
    },

    [ProgramState.FATAL]: {
      meta: {
        actions: [
          AvailableAction.start,
          AvailableAction.EDIT,
        ],
      },

      on: {
        [AvailableAction.start]: {
          actions: ProgramMachineActions.START,
        },
        [AvailableAction.EDIT]: {
          actions: ProgramMachineActions.EDIT,
        },
      },
    },

    [ProgramState.UNKNOWN]: {
      meta: {
        actions: [
          AvailableAction.edit,
        ],
      },

      on: {
        [AvailableAction.edit]: {
          actions: ProgramMachineActions.EDIT,
        },
      },
    },
  },

  on: {
    [ProgramState.STARTING]: ProgramState.STARTING,
    [ProgramState.BACKOFF]: ProgramState.BACKOFF,
    [ProgramState.RUNNING]: ProgramState.RUNNING,
    [ProgramState.STOPPING]: ProgramState.STOPPING,
    [ProgramState.STOPPED]: ProgramState.STOPPED,
    [ProgramState.EXITED]: ProgramState.EXITED,
    [ProgramState.FATAL]: ProgramState.FATAL,
    [ProgramState.UNKNOWN]: ProgramState.UNKNOWN,
  },
})

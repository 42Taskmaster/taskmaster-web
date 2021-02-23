<template>
  <h2 class="text-xl font-medium leading-6 text-gray-900">
    Informations
  </h2>
  <div class="p-5 mt-2 mb-6 bg-white rounded-lg shadow">
    <AppInput
      v-model="configurationComputed.name"
      :title="t('name')"
    />
    <AppInput
      v-model="configurationComputed.cmd"
      :title="t('cmd')"
    />
  </div>

  <h2 class="text-xl font-medium leading-6 text-gray-900">
    Configuration
  </h2>
  <div class="p-5 mt-2 mb-3 bg-white rounded-lg shadow">
    <AppNumberInput
      v-model.number="configurationComputed.numprocs"
      :title="t('numprocs')"
    />
    <AppInput
      v-model="configurationComputed.umask"
      :title="t('umask')"
    />
    <AppInput
      v-model="configurationComputed.workingdir"
      :title="t('workingdir')"
    />

    <h2 class="mb-1 font-medium leading-6 text-gray-800 text-md">
      {{ t("autorestart.label") }} :
    </h2>
    <select
      v-model="configurationComputed.autorestart"
      class="w-full px-3 py-2 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm outline-none text-md text-grey-800 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="true">
        {{ t("autorestart.true") }}
      </option>
      <option value="unexpected">
        {{ t("autorestart.unexpected") }}
      </option>
      <option value="false">
        {{ t("autorestart.false") }}
      </option>
    </select>

    <AppInput
      v-model="configurationComputed.exitcodes"
      :title="t('exitcodes')"
    />
    <AppNumberInput
      v-model.number="configurationComputed.startretries"
      :title="t('startretries')"
    />
    <AppNumberInput
      v-model.number="configurationComputed.starttime"
      :title="t('starttime')"
      min="0"
      max="86400"
    />

    <h2 class="mb-1 font-medium leading-6 text-gray-800 text-md">
      {{ t("stopsignal") }} :
    </h2>
    <select
      v-model="configurationComputed.stopsignal"
      class="w-full px-3 py-2 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm outline-none text-md text-grey-800 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="TERM">
        TERM
      </option>
      <option value="HUP">
        HUP
      </option>
      <option value="INT">
        INT
      </option>
      <option value="QUIT">
        QUIT
      </option>
      <option value="KILL">
        KILL
      </option>
      <option value="USR1">
        USR1
      </option>
      <option value="USR2">
        USR2
      </option>
    </select>

    <AppNumberInput
      v-model.number="configurationComputed.stoptime"
      :title="t('stoptime')"
      min="0"
      max="86400"
    />
    <AppInput
      v-model="configurationComputed.stdout"
      :title="t('stdout')"
    />
    <AppInput
      v-model="configurationComputed.stderr"
      :title="t('stderr')"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ProgramConfiguration } from '../types/index'

export default defineComponent({
  props: {
    configuration: {
      type: Object as PropType<ProgramConfiguration>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()

    const configurationComputed: ProgramConfiguration = computed(() => {
      return props.configuration
    })

    return {
      t,

      configurationComputed,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "name": "Name",
    "cmd": "Command",
    "numprocs": "Process count",
    "umask": "Umask",
    "workingdir": "Working directory",
    "autostart": "Automatic start",
    "autorestart": {
      "label": "Automatic restart",
      "true": "Always",
      "unexpected": "Unexpected",
      "false": "Never",
    },
    "exitcodes": "Valid exit codes",
    "startretries": "Maximum start retries",
    "starttime": "Maximum start time in seconds",
    "stopsignal": "Signal to send on stop",
    "stoptime": "Maximum stop time in seconds",
    "stdout": "Stdout file location",
    "stderr": "Stderr file location",
    "env": "Environment variables",
  },

  "fr": {
    "name": "Nom",
    "cmd": "Commande",
    "numprocs": "Nombre de processus",
    "umask": "Umask",
    "workingdir": "Répertoire courant",
    "autostart": "Démarrage automatique",
    "autorestart": {
      "label": "Redémarrage automatique",
      "true": "Toujours",
      "unexpected": "Inattendu",
      "false": "Jamais",
    },
    "exitcodes": "Codes d'arrêt valides",
    "startretries": "Nombre d'essaie de démarrage maximum",
    "starttime": "Temps de démarrage maximum en secondes",
    "stopsignal": "Signal à envoyer sur demande d'arrêt",
    "stoptime": "Temps d'arrêt maximum en secondes",
    "stdout": "Chemin de Stdout",
    "stderr": "Chemin de Stderr",
    "env": "Variables d'environnement",
  }
}
</i18n>

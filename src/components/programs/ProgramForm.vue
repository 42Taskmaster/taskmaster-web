<template>
  <h2 class="text-xl font-medium leading-6 text-gray-900">
    Informations
  </h2>
  <div class="p-5 mt-2 mb-6 bg-white rounded-lg shadow">
    <AppInput
      v-model="configurationWritable.name"
      :title="t('name')"
      class="mb-3"
    />
    <AppInput
      v-model="configurationWritable.cmd"
      :title="t('cmd')"
    />
  </div>

  <h2 class="text-xl font-medium leading-6 text-gray-900">
    Configuration
  </h2>
  <div class="p-5 mt-2 mb-3 bg-white rounded-lg shadow">
    <AppNumberInput
      v-model.number="configurationWritable.numprocs"
      :title="t('numprocs')"
      class="mb-3"
    />
    <AppInput
      v-model="configurationWritable.umask"
      :title="t('umask')"
      class="mb-3"
    />
    <AppInput
      v-model="configurationWritable.workingdir"
      :title="t('workingdir')"
      class="mb-3"
    />

    <AppSelect v-model="configurationWritable.autorestart" :title="t('autorestart.label')" :options="AutorestartOptions" />

    <AppInput
      v-model="configurationWritable.exitcodes"
      :title="t('exitcodes')"
      class="mb-3"
    />
    <AppNumberInput
      v-model.number="configurationWritable.startretries"
      :title="t('startretries')"
      :min="0"
      class="mb-3"
    />
    <AppNumberInput
      v-model.number="configurationWritable.starttime"
      :title="t('starttime')"
      :min="0"
      :max="86400"
      class="mb-3"
    />

    <AppSelect v-model="configurationWritable.stopsignal" :title="t('stopsignal')" :options="SignalOptions" />

    <AppNumberInput
      v-model.number="configurationWritable.stoptime"
      :title="t('stoptime')"
      :min="0"
      :max="86400"
      class="mb-3"
    />
    <AppInput
      v-model="configurationWritable.stdout"
      :title="t('stdout')"
      class="mb-3"
    />
    <AppInput
      v-model="configurationWritable.stderr"
      :title="t('stderr')"
      class="mb-3"
    />

    <AppMapSelect v-model="configurationWritable.env" label="Environment variables" placeholder-new-key="ENVIRONMENT_VARIABLE" placeholder-new-value="environment variable value" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppSelectOption, ProgramConfiguration } from '/~/types/index'

export default defineComponent({
  props: {
    configuration: {
      type: Object as PropType<ProgramConfiguration>,
      required: true,
    },
  },

  setup(props) {
    const { t } = useI18n()

    const configurationWritable = reactive<ProgramConfiguration>(props.configuration)

    watch(configurationWritable, (configurationWritable) => {
      console.log('configurationWritable', { ...configurationWritable })
    })

    const SignalOptions: AppSelectOption[] = [
      { value: 'TERM', title: 'TERM' },
      { value: 'HUP', title: 'HUP' },
      { value: 'INT', title: 'INT' },
      { value: 'QUIT', title: 'QUIT' },
      { value: 'KILL', title: 'KILL' },
      { value: 'USR1', title: 'USR1' },
      { value: 'USR2', title: 'USR2' },
    ]

    const AutorestartOptions = computed<AppSelectOption[]>(() => [
      { value: 'true', title: t('autorestart.true') },
      { value: 'unexpected', title: t('autorestart.unexpected') },
      { value: 'false', title: t('autorestart.false') },
    ])

    return {
      t,

      SignalOptions,
      AutorestartOptions,

      configurationWritable,
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

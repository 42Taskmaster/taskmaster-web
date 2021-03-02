<template>
  <h2 class="text-xl font-medium leading-6 text-gray-900">
    Informations
  </h2>
  <div class="p-5 mt-2 mb-6 space-y-4 bg-white rounded-lg shadow">
    <AppInput
      v-model="configurationWritable.name"
      :title="t('name')"
    />

    <AppInput
      v-model="configurationWritable.cmd"
      :title="t('cmd')"
    />
  </div>

  <h2 class="text-xl font-medium leading-6 text-gray-900">
    Configuration
  </h2>

  <div class="p-5 mt-2 mb-3 space-y-4 bg-white rounded-lg shadow">
    <AppNumberInput
      v-model.number="configurationWritable.numprocs"
      :title="t('numprocs')"
    />

    <AppInput
      v-model="configurationWritable.umask"
      :title="t('umask')"
    />

    <AppInput
      v-model="configurationWritable.workingdir"
      :title="t('workingdir')"
    />

    <AppToggleInput v-model="configurationWritable.autostart" :title="t('autostart')" />

    <AppSelect v-model="configurationWritable.autorestart" :title="t('autorestart.label')" :options="AutorestartOptions" />

    <AppListSelect v-model="configurationWritable.exitcodes" :label="t('exitcodes')" :placeholder-new-value="t('new_exitcode')" :min="0" :max="255" />

    <AppNumberInput
      v-model.number="configurationWritable.startretries"
      :title="t('startretries')"
      :min="0"
    />

    <AppNumberInput
      v-model.number="configurationWritable.starttime"
      :title="t('starttime')"
      :min="0"
      :max="86400"
    />

    <AppSelect v-model="configurationWritable.stopsignal" :title="t('stopsignal')" :options="SignalOptions" />

    <AppNumberInput
      v-model.number="configurationWritable.stoptime"
      :title="t('stoptime')"
      :min="0"
      :max="86400"
    />

    <AppInput
      v-model="configurationWritable.stdout"
      :title="t('stdout')"
    />

    <AppInput
      v-model="configurationWritable.stderr"
      :title="t('stderr')"
    />

    <AppMapSelect v-model="configurationWritable.env" :label="t('env_vars')" :placeholder-new-key="t('env_var_name')" :placeholder-new-value="t('env_var_value')" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppSelectOption, isProgramConfiguration, ProgramConfiguration } from '/~/types/index'

export default defineComponent({
  props: {
    configuration: {
      type: Object as PropType<ProgramConfiguration>,
      required: true,
    },
  },

  emits: {
    'update:configuration': (configuration: ProgramConfiguration): configuration is ProgramConfiguration => {
      return isProgramConfiguration(configuration)
    },
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const configurationWritable = reactive<ProgramConfiguration>(
      { ...props.configuration },
    )
    watch(configurationWritable, (configurationWritable) => {
      emit('update:configuration', configurationWritable)
    }, {
      deep: true,
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
    "new_exitcode": "New exit code",
    "env_vars": "Environment variables",
    "env_var_name": "ENVIRONMENT_VARIABLE",
    "env_var_value": "value",
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
    "new_exitcode": "Nouveau code de sortie",
    "env_vars": "Variables d'environnement",
    "env_var_name": "ENVIRONMENT_VARIABLE",
    "env_var_value": "valeur",
  }
}
</i18n>

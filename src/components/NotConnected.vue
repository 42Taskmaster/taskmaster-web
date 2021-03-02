<template>
  <div class="absolute z-10 flex flex-col items-center justify-center w-full h-full text-xl bg-white bg-opacity-80">
    <span class="mb-10">
      {{ t('not_connected') }}
    </span>
    <span class="mb-10">
      {{ t('please_go_to_homepage') }}
    </span>
    <router-link to="/">
      <AppButton>
        <heroicons-outline-arrow-circle-up class="mr-1" />
        {{ t('go_to_homepage') }}
      </AppButton>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "not_connected": "Your are currently not connected to a Taskmaster API.",
    "please_go_to_homepage": "Please go to the Home page to connect to an API.",
    "go_to_homepage": "Go to Home page",
  },

  "fr": {
    "not_connected": "Vous n'êtes actuellement pas connecté à une API de Taskmaster.",
    "please_go_to_homepage": "Veuillez vous rendre sur la page d'accueil pour renseigner une API.",
    "go_to_homepage": "Se rendre à la page d'accueil",
  }
}
</i18n>

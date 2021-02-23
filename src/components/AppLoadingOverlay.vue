<template>
  <div v-if="hasFetcher" class="absolute z-10 flex flex-col items-center justify-center w-full h-full gap-6 text-xl bg-white bg-opacity-80">
    <div id="loading" />
    {{ t('loading' ) }}...
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetcher } from '/~/composables/fetcher'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const fetcher = useFetcher()

    const hasFetcher = computed(() => {
      return fetcher.value !== null
    })

    return {
      t,
      hasFetcher,
    }
  },
})
</script>

<style scoped>
#loading {
  display: inline-block;
  width: 80px;
  height: 80px;
  border: 6px solid rgba(37, 99, 235, .3);
  border-radius: 50%;
  border-top-color: rgb(37, 99, 235);
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
</style>

<i18n>
{
  "en": {
    "loading": "Loading",
  },

  "fr": {
    "loading": "Chargement en cours",
  }
}
</i18n>

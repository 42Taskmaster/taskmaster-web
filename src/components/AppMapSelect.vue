<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { KeyValueObject } from '/~/types/index'

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },

    modelValue: {
      type: Object,
      default: undefined,
    },

    placeholderNewKey: {
      type: String,
      required: true,
    },

    placeholderNewValue: {
      type: String,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const map = computed(() => props.modelValue ?? {})

    const items = computed<KeyValueObject[]>(
      () => Object.entries(map.value).map(
        ([key, value]) => ({
          key, value,
        }),
      ),
    )

    const newEntry = reactive({
      key: '',
      value: '',
    })

    function clearNewEntry() {
      newEntry.key = ''
      newEntry.value = ''
    }

    function addEntry() {
      const { key, value } = newEntry

      if (key === '')
        return

      emit('update:modelValue', {
        ...map.value,
        [key]: value,
      })

      clearNewEntry()
    }

    function deleteEntry(key: string) {
      const mapCopy = {
        ...map.value,
      }

      delete mapCopy[key]

      emit('update:modelValue', mapCopy)
    }

    function updateEntryValue(key: string, value: string) {
      emit('update:modelValue', {
        ...map.value,
        [key]: value,
      })
    }

    return {
      t,

      items,
      newEntry,

      deleteEntry,
      addEntry,
      updateEntryValue,
    }
  },
})
</script>

<template>
  <AppSelectBase :label="label" :items="items">
    <template #item="{ item: { key, value } }">
      <div class="grid items-center grid-cols-1 gap-2 md:grid-cols-2">
        <p class="sm:text-sm">
          {{ key }}
        </p>

        <div class="flex items-stretch">
          <AppInput :model-value="value" class="flex-grow" @update:model-value="updateEntryValue(key, $event)" />

          <AppButton size="large" color="red" class="flex-shrink-0 ml-2" @click="deleteEntry(key)">
            <span class="sr-only">
              {{ t('delete-button') }}
            </span>

            <heroicons-outline-trash />
          </AppButton>
        </div>
      </div>
    </template>

    <template #add-form>
      <form class="grid items-center grid-cols-1 gap-2 md:grid-cols-2" @submit.prevent="addEntry">
        <AppInput v-model="newEntry.key" :placeholder="placeholderNewKey" />

        <div class="flex items-stretch">
          <AppInput v-model="newEntry.value" :placeholder="placeholderNewValue" class="flex-grow" />

          <AppButton size="large" color="green" class="flex-shrink-0 ml-2">
            <span class="sr-only">
              {{ t('save-button') }}
            </span>

            <heroicons-outline-plus-circle />
          </AppButton>
        </div>
      </form>
    </template>
  </AppSelectBase>
</template>

<i18n>
{
  "en": {
    "delete-button": "Delete",
    "save-button": "Add"
  },

  "fr": {
    "delete-button": "Supprimer",
    "save-button": "Ajouter"
  },
}
</i18n>

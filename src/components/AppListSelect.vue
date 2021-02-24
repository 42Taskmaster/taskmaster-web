<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { KeyValueObject } from '/~/types/index'

function isArrayOfNumbers(array: unknown[]): array is number[] {
  return array.every(item => Number.isInteger(item))
}

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },

    modelValue: {
      type: Array as PropType<number[]>,
      required: true,
      validator: isArrayOfNumbers,
    },

    placeholderNewValue: {
      type: String,
      required: true,
    },

    min: {
      type: Number,
      required: true,
    },

    max: {
      type: Number,
      required: true,
    },
  },

  emits: {
    'update:modelValue': (value: number[]) => {
      return isArrayOfNumbers(value)
    },
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const inputArray = computed(() => props.modelValue)
    const keyValueArray = computed<KeyValueObject[]>(
      () => [...inputArray.value.entries()]
        .map(([key, value]) => ({
          key, value,
        })),
    )

    const newEntry = ref<string>('')

    function clearNewEntry() {
      newEntry.value = ''
    }

    function addEntry() {
      if (newEntry.value === '')
        return

      const valueAsNumber = Number(newEntry.value)

      if (!inputArray.value.includes(valueAsNumber)) {
        emit('update:modelValue', [
          ...inputArray.value,
          valueAsNumber,
        ])
      }

      clearNewEntry()
    }

    function deleteEntry(index: number) {
      const itemsCopy = [...inputArray.value]

      itemsCopy.splice(index, 1)

      emit('update:modelValue', itemsCopy)
    }

    function updateEntryValue(index: number, value: string) {
      const itemsCopy = [...inputArray.value]

      itemsCopy[index] = Number(value)

      emit('update:modelValue', itemsCopy)
    }

    return {
      t,

      keyValueArray,
      newEntry,

      deleteEntry,
      addEntry,
      updateEntryValue,
    }
  },
})
</script>

<template>
  <AppSelectBase :label="label" :items="keyValueArray">
    <template #item="{ item: { key, value } }">
      <div class="flex items-stretch">
        <AppInputBase
          :model-value="value"
          type="number"
          :min="min"
          :max="max"
          class="flex-grow"
          @update:model-value="updateEntryValue(key, $event)"
        />

        <AppButton size="large" color="red" class="flex-shrink-0 ml-2" @click="deleteEntry(key)">
          <span class="sr-only">
            {{ t('delete-button') }}
          </span>

          <heroicons-outline-trash />
        </AppButton>
      </div>
    </template>

    <template #add-form>
      <form class="flex items-stretch" @submit.prevent="addEntry">
        <AppInputBase
          v-model="newEntry"
          :placeholder="placeholderNewValue"
          type="number"
          :min="min"
          :max="max"
          class="flex-grow"
        />

        <AppButton size="large" color="green" class="flex-shrink-0 ml-2">
          <span class="sr-only">
            {{ t('save-button') }}
          </span>

          <heroicons-outline-plus-circle />
        </AppButton>
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

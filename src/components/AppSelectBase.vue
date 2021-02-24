<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { isKeyValueObject, KeyValueObject } from '/~/types/index'

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },

    items: {
      type: Array as PropType<KeyValueObject[]>,
      required: true,
      validator: (array: unknown[]): array is KeyValueObject[] => array.every(isKeyValueObject),
    },
  },
})
</script>

<template>
  <div>
    <div class="block text-sm font-medium text-gray-700">
      <p>{{ label }}</p>
    </div>

    <div class="mt-2 space-y-4 font-mono">
      <slot v-for="item in items" :key="item.key" name="item" :item="item" />

      <slot name="add-form" />
    </div>
  </div>
</template>

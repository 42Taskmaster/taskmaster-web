<template>
  <div class="w-full">
    {{ id }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    id: String,
  },

})
</script>

<template>
  <q-btn
    outline
    square
    no-caps
    :color="color || 'dark'"
    class="fpl__q-btn shadow-10 fpl-hover-lift--btn"
    :class="{ 'no-label': !label }"
  >
    <template v-if="label">{{ label }}</template>
    <slot />
  </q-btn>
</template>

<script setup lang="ts">
defineProps<{
  color?: string;
  label?: string;
}>();
</script>

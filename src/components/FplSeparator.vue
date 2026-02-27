<template>
  <div class="fpl-separator q-mb-md">
    <div class="row items-center q-gutter-md">
      <div class="col-auto">
        <fpl-subtitle class="q-mb-none text-center">{{ label }}</fpl-subtitle>
      </div>
      <div class="col">
        <q-separator size="1px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

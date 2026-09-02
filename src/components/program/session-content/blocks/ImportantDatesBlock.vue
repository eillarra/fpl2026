<template>
  <q-card v-if="dates.length" flat bordered square class="q-pa-sm" :class="{ 'q-pa-md': $q.screen.gt.sm }">
    <q-card-section>
      <fpl-subtitle>Important dates</fpl-subtitle>
      <ul class="q-ma-none">
        <li v-for="(date, idx) in dates" :key="idx">
          <span :class="{ 'text-strike': date.is_past }">{{ date.formatted }}: {{ date.label }}</span>
        </li>
      </ul>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

defineProps<{
  dates: ImportantDate[];
}>();

const $q = useQuasar();
</script>

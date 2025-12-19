<style scoped>
.important-date--past {
  text-decoration: line-through;
}
</style>

<template>
  <q-list separator class="text-body2">
    <q-item
      v-for="(date, idx) in processedDates"
      :key="idx"
      :class="{ 'important-date--past text-grey-8': date.is_past }"
    >
      <q-item-section>
        <q-item-label>{{ date.label }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label :class="date.is_past ? 'text-grey-8' : 'text-fpl-blue'" class="text-weight-medium">
          {{ date.formatted }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { formatImportantDate, passedImportantDate } from '@evan/utils/dates';

interface ProcessedDate extends ImportantDate {
  formatted: string;
  is_past: boolean;
}

const props = defineProps<{
  dates: ImportantDate[];
}>();

const processedDates = computed<ProcessedDate[]>(() => {
  return props.dates.map((date) => ({
    ...date,
    label: date.aoe ? `${date.label} (AoE)` : date.label,
    formatted: formatImportantDate(date, date.aoe),
    is_past: passedImportantDate(date),
  }));
});
</script>

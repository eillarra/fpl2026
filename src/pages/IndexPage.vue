<template>
  <div class="row q-col-gutter-y-lg">
    <div class="col-12 col-md-9">
      <div :class="{ 'q-pr-xl ': $q.screen.gt.sm }">
        <h4 class="text-mono q-my-none">
          <strong>{{ event?.name }}</strong>
        </h4>
        <h3 class="fpl__text-headline">{{ event?.full_name }}</h3>
        <marked-div v-if="event" :text="event.presentation" />
      </div>
    </div>
    <div class="col-12 col-md">
      <p class="text-mono text-body2 bg-fpl-green q-pa-md">{{ ghent }}</p>
      <fpl-btn
        :icon="iconVenue"
        label="More information"
        type="router-link"
        :to="{ name: 'venue' }"
        class="full-width q-mb-xl"
      />
    </div>
    <div v-if="importantDates.length > 0" class="col-12">
      <fpl-subtitle>Important dates</fpl-subtitle>
      <q-markup-table flat>
        <thead>
          <tr class="text-weight-bold">
            <th class="text-left">Event</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody class="text-body1">
          <tr v-for="date in importantDates" :key="date.label">
            <td>{{ date.label }}</td>
            <td :class="{ 'text-grey': date.is_past }">{{ date.formatted }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useEventStore } from '@evan/stores/event';
import { dateRange, formatImportantDate, passedImportantDate } from '@evan/utils/dates';

import { iconVenue } from '@/icons';

const eventStore = useEventStore();

const { event } = storeToRefs(eventStore);

const ghent = computed<string>(() => {
  if (!event.value) return '';
  return `${event.value.city}, ${event.value.country.name}, ${dateRange(event.value.start_date, event.value.end_date)}`;
});

const importantDates = computed<ImportantDate[]>(() => {
  if (!event.value) return [];
  return event.value.extra_data.important_dates.map((d) => ({
    ...d,
    label: d.aoe ? `${d.label} (AoE)` : d.label,
    formatted: formatImportantDate(d, d.aoe),
    is_past: passedImportantDate(d),
  }));
});
</script>

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
      <important-dates-list :dates="importantDates" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import { useEventStore } from '@evan/stores/event';
import { dateRange } from '@evan/utils/dates';

import ImportantDatesList from '@/components/ImportantDatesList.vue';

import { iconVenue } from '@/icons';

const eventStore = useEventStore();

const { event } = toRefs(eventStore);

const ghent = computed<string>(() => {
  if (!event.value) return '';
  return `${event.value.city}, ${event.value.country.name}, ${dateRange(event.value.start_date, event.value.end_date)}`;
});

const importantDates = computed<ImportantDate[]>(() => {
  if (!event.value) return [];
  return event.value.extra_data.important_dates;
});
</script>

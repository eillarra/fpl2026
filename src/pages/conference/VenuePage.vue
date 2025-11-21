<template>
  <h2 class="fpl__text-title">Venue and location</h2>
  <q-separator />
  <h6>{{ footerText }}</h6>
  <div class="q-mb-lg">
    <fpl-btn
      :icon="iconAccommodation"
      label="Check accommodation options"
      type="a"
      :to="{ name: 'accommodation' }"
      :class="{ 'full-width': $q.screen.lt.sm }"
    />
  </div>
  <template v-if="mainVenue">
    <marked-div :text="mainVenue.presentation" class="q-mb-lg" />
    <fpl-btn
      v-if="mainVenue.gmaps"
      :icon="iconMap"
      label="Show me on map"
      type="a"
      :href="mainVenue.gmaps"
      target="_blank"
      rel="noopener noreferrer"
    />
  </template>
  <div v-if="howToReachGhent" class="q-mt-xl">
    <h4 class="fpl__text-subtitle2">How to reach Ghent</h4>
    <marked-div :text="howToReachGhent" />
  </div>
  <template v-if="aboutGhentText">
    <q-separator class="q-my-xl" />
    <div>
      <h4 class="fpl__text-subtitle2">About Ghent</h4>
      <marked-div :text="aboutGhentText" />
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';
import { dateRange } from '@evan/utils/dates';

import { iconAccommodation, iconMap } from '@/icons';

const eventStore = useEventStore();

const { event, contentsDict, mainVenue } = toRefs(eventStore);

const aboutGhentText = computed<MarkdownText | null>(() => contentsDict.value['ghent.about']?.value || null);

const howToReachGhent = computed<MarkdownText | null>(() => contentsDict.value['ghent.how_to_reach']?.value || null);

const footerText = computed<string>(() => {
  if (!event.value) return '';
  const dates = dateRange(event.value.start_date, event.value.end_date);
  return `The ${event.value.full_name} (${event.value.name}), will be held ${dates} in ${event.value.city}, ${event.value.country.name}.`;
});

useMeta(() => {
  return {
    title: 'Venue',
  };
});
</script>

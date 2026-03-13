<template>
  <h2 class="fpl__text-title">Venue and location</h2>
  <q-separator />
  <p class="q-mt-xl text-h6">{{ footerText }}</p>
  <fpl-subtitle v-if="mainVenue">Main venue</fpl-subtitle>
  <q-card v-if="mainVenue" flat bordered square class="q-mb-xl">
    <q-card-section>
      <div class="text-h6 text-weight-bold">{{ mainVenue.name }}</div>
      <div class="text-caption text-grey-7 q-mt-xs">
        <q-icon :name="iconVenue" size="14px" class="q-mr-xs" />{{ mainVenue.city || event?.city }},
        {{ event?.country.name }}
      </div>
    </q-card-section>
    <template v-if="mainVenue.presentation">
      <q-separator />
      <q-card-section>
        <marked-div :text="mainVenue.presentation" />
      </q-card-section>
    </template>
    <q-card-section class="q-pt-none q-gutter-sm">
      <fpl-btn
        v-if="mainVenue.website"
        :icon="iconExternalLink"
        :label="mainVenue.name"
        type="a"
        :href="mainVenue.website"
        target="_blank"
        rel="noopener noreferrer"
      />
      <fpl-btn
        v-if="mainVenueMapsUrl"
        :icon="iconMap"
        label="View on Google Maps"
        type="a"
        :href="mainVenueMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
      />
      <fpl-btn :icon="iconAccommodation" label="Accommodation" type="router-link" :to="{ name: 'accommodation' }" />
    </q-card-section>
  </q-card>
  <div v-if="howToReachGhent" class="q-mt-xl">
    <fpl-subtitle>How to reach Ghent</fpl-subtitle>
    <marked-div :text="howToReachGhent" />
  </div>
  <template v-if="aboutGhentText">
    <q-separator class="q-my-xl" />
    <div>
      <fpl-subtitle>About Ghent</fpl-subtitle>
      <marked-div :text="aboutGhentText" />
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';
import { dateRange } from '@evan/utils/dates';

import { iconAccommodation, iconExternalLink, iconMap, iconVenue } from '@/icons';

const eventStore = useEventStore();

const { event, contentsDict, mainVenue } = toRefs(eventStore);

const mainVenueMapsUrl = computed<Url | null>(() => {
  if (!mainVenue.value) return null;
  if (mainVenue.value.google_place_id)
    return `https://www.google.com/maps/place/?q=place_id:${mainVenue.value.google_place_id}`;
  if (mainVenue.value.gmaps) return mainVenue.value.gmaps;
  return null;
});

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

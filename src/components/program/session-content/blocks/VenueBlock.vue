<template>
  <q-card
    v-if="info && variant === 'card'"
    flat
    bordered
    square
    class="q-pa-sm q-mb-lg"
    :class="{ 'q-pa-md': $q.screen.gt.sm }"
  >
    <q-card-section>
      <fpl-subtitle>Location</fpl-subtitle>
      <div v-if="info.venue" class="q-mb-sm">
        <div class="text-h5 text-weight-medium">{{ info.venue.name }}</div>
        <div class="text-h6">Location: {{ info.room.name }}</div>
      </div>
      <div v-else class="text-h6">{{ info.room.name }}</div>
      <div v-if="info.venueDescription" class="text-body2 q-mt-md">
        <marked-div :text="info.venueDescription" />
      </div>
      <div v-if="mapsUrl" class="q-mt-lg">
        <fpl-btn :href="mapsUrl" target="_blank" :icon="iconOpenInNew" label="Open in Google Maps" size="md" />
      </div>
    </q-card-section>
  </q-card>

  <div v-else-if="info && variant === 'compact'">
    <div v-if="info.venue">
      <div class="text-body1 text-weight-medium">Venue: {{ info.venue.name }}</div>
      <div class="text-h6 text-weight-bold">Location: {{ info.room.name }}</div>
    </div>
    <div v-else class="text-h6 text-weight-bold">{{ info.room.name }}</div>
    <div v-if="info.venueDescription" class="text-body2 q-mt-sm">
      <marked-div :text="info.venueDescription" />
    </div>
    <div v-if="mapsUrl" class="q-mt-sm">
      <fpl-btn :href="mapsUrl" target="_blank" :icon="iconOpenInNew" label="Open in Google Maps" size="md" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';

import { useEventStore } from '@evan/stores/event';
import { iconOpenInNew } from '@/icons';

const props = withDefaults(
  defineProps<{
    session: EvanSession;
    variant?: 'card' | 'compact';
  }>(),
  {
    variant: 'card',
  },
);

const $q = useQuasar();
const eventStore = useEventStore();

const info = computed(() => {
  if (!props.session.room || !eventStore.event?.venues) return null;

  // Find room in flattened rooms array from eventStore
  const room = eventStore.rooms.find((r) => r.id === props.session.room);
  if (!room) return null;

  // Find venue that contains this room
  const venue = eventStore.event.venues.find((v) => v.rooms.some((vr) => vr.id === props.session.room));

  return {
    room,
    venue,
    venueDescription: venue?.presentation && venue.presentation.trim() ? venue.presentation : null,
  };
});
const mapsUrl = computed(() => {
  if (!info.value?.venue?.google_place_id) return null;
  return `https://www.google.com/maps/place/?q=place_id:${info.value.venue.google_place_id}`;
});
</script>

<template>
  <div v-if="session.start_at" class="bg-grey-2 q-py-sm q-px-lg">
    <div class="row items-center justify-between">
      <div class="col">
        <div class="text-h6 text-weight-bold">
          {{ formatProgramDate(session.start_at, 'short') }}
          <q-chip v-if="session.start_at" size="md" color="grey-4" class="q-ml-sm q-mb-sm">
            {{ formatProgramTime(session.start_at) }} - {{ formatProgramTime(session.end_at) }}
          </q-chip>
        </div>
        <strong>Room: {{ getRoomName(eventStore.rooms, session.room) }}</strong>
      </div>
      <div v-if="!hideFavorite" class="col-auto">
        <favorite-btn type="session" :id="session.id" :hide-label="!$q.screen.gt.sm" size="lg" class="q-ml-md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

import { useEventStore } from '@evan/stores/event';
import { formatProgramDate, formatProgramTime, getRoomName } from '@/utils/program';

import FavoriteBtn from '@/components/program/FavoriteBtn.vue';

withDefaults(
  defineProps<{
    session: EvanSession;
    hideFavorite?: boolean;
  }>(),
  {
    hideFavorite: false,
  },
);

const $q = useQuasar();
const eventStore = useEventStore();
</script>

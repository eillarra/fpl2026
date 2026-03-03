<template>
  <div class="q-pb-xl">
    <h2 class="fpl__text-title">Program</h2>
    <q-separator class="q-mb-xl" />
    <div class="q-pt-lg" :class="{ 'q-pt-xl': $q.screen.gt.sm }">
      <loading-state v-if="eventStore.loading" message="Loading program data..." />
      <error-state v-else-if="eventStore.error" :error-message="eventStore.error" @retry="loadData" />
      <router-view v-else-if="eventStore.keynotes.length > 0" />
      <empty-state
        v-else
        icon="calendar_today"
        title="No program data available"
        description="The conference program will be available soon."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue';

import { useEventStore } from '@evan/stores/event';

import { getAvailableDays } from '@/utils/program';

import LoadingState from '@/components/program/LoadingState.vue';
import ErrorState from '@/components/program/ErrorState.vue';
import EmptyState from '@/components/program/EmptyState.vue';

const eventStore = useEventStore();

const selectedDay = ref('all');

const getDateFromWeekday = (weekday: string): string | null => {
  if (weekday === 'all') return null;
  const dayOptions = getAvailableDays(eventStore.sessions);
  const option = dayOptions.find((opt) => opt.value === weekday.toLowerCase());
  return option ? option.date : null;
};

const loadData = async () => {
  await eventStore.fetchProgramData();
};

onMounted(loadData);

provide('selectedDay', selectedDay);
provide(
  'selectedDate',
  computed(() => {
    if (selectedDay.value === 'all') return 'all';
    return getDateFromWeekday(selectedDay.value) || 'all';
  }),
);
</script>

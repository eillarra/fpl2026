<template>
  <h2 class="fpl__text-title">Call for Competition</h2>
  <q-separator />
  <h6>
    Agentic FPGA Backend Optimization Competition sponsored by AMD. Full contest details, benchmarks, submission
    guidelines and FAQ:
  </h6>
  <fpl-btn
    :icon="iconExternalLink"
    label="Visit the competition website"
    :href="CONTEST_URL"
    target="_blank"
    rel="noopener noreferrer"
  />

  <marked-div v-if="callText" :text="callText" class="q-mt-xl" />

  <div class="q-mt-xl">
    <fpl-subtitle>Important Dates</fpl-subtitle>
    <important-dates-list :dates="contestDates" />
  </div>

  <div class="q-mt-xl">
    <fpl-subtitle>Prizes</fpl-subtitle>
    <p class="text-body2 q-mb-sm">Prizes will be awarded to up to 5 finalists:</p>
    <q-list separator class="text-body2">
      <q-item v-for="prize in prizes" :key="prize.place">
        <q-item-section>
          <q-item-label class="text-weight-medium">{{ prize.place }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label class="text-fpl-blue text-weight-medium">{{ prize.amount }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <p class="text-caption text-grey-7 q-mt-sm">
      50% of the prize money is conditional on the winning entry being made open source (BSD, MIT, or Apache licence)
      within 30 days of the award announcement.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

import ImportantDatesList from '@/components/ImportantDatesList.vue';

import { iconExternalLink } from '@/icons';

const CONTEST_URL = 'https://xilinx.github.io/fpl26_optimization_contest/';

const eventStore = useEventStore();

const { contentsDict } = toRefs(eventStore);

const callText = computed<MarkdownText | null>(() => contentsDict.value['competition.challenge']?.value || null);

const contestDates: ImportantDate[] = [
  { label: 'Registration Deadline', format: 'date', start_date: '2026-03-23', end_date: null, aoe: true },
  { label: 'Alpha Submission', format: 'date', start_date: '2026-05-05', end_date: null, aoe: true },
  { label: 'Beta Submission', format: 'date', start_date: '2026-07-13', end_date: null, aoe: true },
  { label: 'Final Submission', format: 'date', start_date: '2026-08-10', end_date: null, aoe: true },
  {
    label: 'Prizes awarded at FPL 2026',
    format: 'range',
    start_date: '2026-09-06',
    end_date: '2026-09-10',
    aoe: false,
  },
];

const prizes = [
  { place: '1st place', amount: '€3,000' },
  { place: '2nd place', amount: '€2,000' },
  { place: '3rd place', amount: '€1,000' },
  { place: '4th & 5th place', amount: '€500 each' },
];

useMeta(() => ({
  title: 'Competition',
}));
</script>

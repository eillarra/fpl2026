<template>
  <div class="row q-col-gutter-y-lg q-col-gutter-x-md justify-between">
    <div class="col-12 col-md-4 flex column" v-show="$q.screen.gt.xs">
      <fpl-separator label="Call for Competition" />
      <h6>Agentic FPGA Backend Optimization Competition</h6>
      <p class="text-body2">Sponsored by AMD · Hosted at FPL 2026</p>
      <q-btn
        :href="CONTEST_URL"
        target="_blank"
        rel="noopener noreferrer"
        :icon="iconExternalLink"
        label="Visit the contest website"
        outline
        square
        no-caps
        color="dark"
        class="q-mt-md full-width shadow-10 fpl-hover-lift--btn"
      />
    </div>

    <div class="col-12 col-md-7">
      <marked-div v-if="callText" :text="callText" class="q-mb-xl" />

      <!-- The Challenge -->
      <fpl-subtitle>The Challenge</fpl-subtitle>
      <p class="text-body1 q-mt-md">
        Given a fully placed and routed Vivado Design Checkpoint (DCP), create a new DCP that improves its maximum clock
        frequency (Fmax) as much as possible — while maintaining logical equivalence and staying fully placed and
        routed.
      </p>
      <p class="text-body1">
        Participants leverage <strong>Agentic AI</strong>, LLMs, Model Context Protocol (MCP) servers, and open-source
        CAD frameworks (RapidWright + AMD Vivado™) to architect autonomous agents that analyse existing designs,
        formulate optimisation strategies, and apply ECO-like modifications to iteratively improve timing closure.
      </p>

      <!-- Important Dates -->
      <fpl-subtitle class="q-mt-xl">Important Dates</fpl-subtitle>
      <important-dates-list :dates="contestDates" class="q-mt-md" />

      <!-- Prizes -->
      <fpl-subtitle class="q-mt-xl">Prizes</fpl-subtitle>
      <p class="text-body2 q-mt-md q-mb-sm">Prizes will be awarded to up to 5 finalists:</p>
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

      <!-- Registration -->
      <fpl-subtitle class="q-mt-xl">Registration</fpl-subtitle>
      <p class="text-body1 q-mt-md">
        Registration is <strong>mandatory</strong> to be eligible for alpha submission and final prizes. Teams are
        limited to 6 members (not including advisors).
      </p>
      <p class="text-body1">
        To register, send an email to
        <a href="mailto:chris.lavin@amd.com" class="text-primary">chris.lavin@amd.com</a> with subject
        <code>FPL26 Contest Registration</code> and include your team name, members and affiliations, and a single
        corresponding email address.
      </p>

      <!-- External link (mobile) -->
      <q-card v-if="$q.screen.lt.sm" flat bordered square class="q-pa-sm q-mt-xl">
        <q-card-section>
          <p class="text-weight-bold q-mb-md">
            Full contest details, benchmarks, evaluation environment and submission guidelines:
          </p>
          <q-btn
            :href="CONTEST_URL"
            target="_blank"
            rel="noopener noreferrer"
            :icon="iconExternalLink"
            label="Visit the contest website"
            outline
            square
            no-caps
            color="dark"
            class="full-width shadow-10 fpl-hover-lift--btn"
          />
        </q-card-section>
      </q-card>
    </div>
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

const callText = computed<MarkdownText | null>(() => contentsDict.value['contest.call_for_competition']?.value || null);

const contestDates: ImportantDate[] = [
  { label: 'Contest Announced', format: 'date', start_date: '2026-02-23', end_date: null, aoe: false },
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
  title: 'Call for Competition',
}));
</script>

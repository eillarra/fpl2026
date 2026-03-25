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
    <div v-if="keynotes.length > 0" class="col-12">
      <fpl-subtitle>Keynote speakers</fpl-subtitle>
      <div class="row q-col-gutter-md">
        <div v-for="keynote in keynotes" :key="keynote.id" class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered square class="cursor-pointer" @click="openKeynote(keynote)">
            <q-card-section class="row no-wrap q-col-gutter-md items-center">
              <div class="col-auto">
                <avatar-display :file="getKeynoteAvatar(keynote)" size="64px" :alt-text="keynote.speaker" />
              </div>
              <div class="col">
                <div class="text-weight-bold text-wrap-balance">{{ keynote.speaker }}</div>
                <div v-if="keynote.extra_data?.speaker_affiliation" class="text-caption text-grey-7">
                  {{ keynote.extra_data.speaker_affiliation }}
                </div>
                <div class="text-body2 text-wrap-balance q-mt-xs">{{ keynote.title }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div v-if="sponsors.length > 0" class="col-12 q-mt-xl">
      <fpl-subtitle>Sponsors</fpl-subtitle>
      <div class="row q-col-gutter-y-md q-col-gutter-x-xl items-center">
        <div v-for="sponsor in sponsors" :key="sponsor.id" class="col-auto">
          <a :href="sponsor.website" target="_blank" rel="noopener noreferrer" :aria-label="sponsor.name">
            <img v-if="sponsor.files[0]" :src="sponsor.files[0].file" :alt="sponsor.name" class="fpl__sponsor-logo" />
            <span v-else class="text-body2 text-weight-bold">{{ sponsor.name }}</span>
          </a>
        </div>
      </div>
    </div>
    <div v-if="eventStore.contentsDict['disclaimer_cps']" class="col-12 q-mt-xl">
      <marked-div class="text-body2 text-grey-8" :text="eventStore.contentsDict['disclaimer_cps']?.value" />
    </div>
  </div>
  <keynote-details-dialog v-if="selectedKeynote" ref="keynoteDialog" :keynote="selectedKeynote" hide-button />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, toRefs } from 'vue';

import { useEventStore } from '@evan/stores/event';
import { dateRange } from '@evan/utils/dates';
import { getKeynoteAvatar, sortKeynotes } from '@evan/utils/program';

import AvatarDisplay from '@/components/AvatarDisplay.vue';
import ImportantDatesList from '@/components/ImportantDatesList.vue';
import KeynoteDetailsDialog from '@/components/program/KeynoteDetailsDialog.vue';

import { iconVenue } from '@/icons';

const eventStore = useEventStore();

const { event, sponsors } = toRefs(eventStore);

const ghent = computed<string>(() => {
  if (!event.value) return '';
  return `${event.value.city}, ${event.value.country.name}, ${dateRange(event.value.start_date, event.value.end_date)}`;
});

const importantDates = computed<ImportantDate[]>(() => {
  if (!event.value) return [];
  return event.value.extra_data.important_dates;
});

const keynotes = computed<EvanKeynote[]>(() => sortKeynotes(eventStore.keynotes, eventStore.sessions));

const selectedKeynote = ref<EvanKeynote | null>(null);
const keynoteDialog = ref<{ openDialog: () => void } | null>(null);

async function openKeynote(keynote: EvanKeynote): Promise<void> {
  selectedKeynote.value = keynote;
  await nextTick();
  keynoteDialog.value?.openDialog();
}

onMounted(() => {
  void eventStore.fetchProgramData();
});
</script>

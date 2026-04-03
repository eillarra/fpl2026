<template>
  <h2 class="fpl__text-title">Sponsors</h2>
  <q-separator />

  <template v-if="tiers.length > 0">
    <template v-for="(tierName, tierIndex) in tiers" :key="tierIndex">
      <div v-if="sponsorsByLevel[tierIndex]?.length" class="q-mt-xl">
        <fpl-subtitle>{{ tierName }}</fpl-subtitle>
        <div class="row q-col-gutter-xl items-center">
          <div v-for="sponsor in sponsorsByLevel[tierIndex]" :key="sponsor.id" class="col-auto">
            <a :href="sponsor.website" target="_blank" rel="noopener noreferrer" :aria-label="sponsor.name">
              <img
                v-if="sponsor.files[0]"
                :src="sponsor.files[0].file"
                :alt="sponsor.name"
                :title="sponsor.name"
                class="fpl__sponsor-logo"
              />
              <span v-else class="text-body1 text-weight-bold">{{ sponsor.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </template>
  </template>

  <div v-else class="row q-col-gutter-xl items-center q-mt-xl">
    <div v-for="sponsor in sponsors" :key="sponsor.id" class="col-auto">
      <a :href="sponsor.website" target="_blank" rel="noopener noreferrer" :aria-label="sponsor.name">
        <img
          v-if="sponsor.files[0]"
          :src="sponsor.files[0].file"
          :alt="sponsor.name"
          :title="sponsor.name"
          class="fpl__sponsor-logo"
        />
        <span v-else class="text-body1 text-weight-bold">{{ sponsor.name }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

const eventStore = useEventStore();

const { sponsors, sponsorTypes } = toRefs(eventStore);

const tiers = computed<string[]>(() => sponsorTypes.value);

const sponsorsByLevel = computed<Record<number, EvanSponsor[]>>(() => {
  const groups: Record<number, EvanSponsor[]> = {};
  sponsors.value.forEach((sponsor) => {
    if (!groups[sponsor.level]) groups[sponsor.level] = [];
    groups[sponsor.level].push(sponsor);
  });
  return groups;
});

useMeta(() => ({
  title: 'Sponsors',
}));
</script>

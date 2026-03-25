<style scoped></style>

<template>
  <h2 class="fpl__text-title">Call for Sponsorship</h2>
  <q-separator />
  <marked-div v-if="callText" :text="callText" class="q-mt-xl" />
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

const eventStore = useEventStore();

const { contentsDict } = toRefs(eventStore);

const callText = computed<MarkdownText | null>(
  () => contentsDict.value['sponsorship.call_for_sponsorship']?.value || null,
);

useMeta(() => ({
  title: 'Call for Sponsorship',
}));
</script>

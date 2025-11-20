<template>
  <h2 class="fpl__text-title">Call for Papers</h2>
  <q-separator />
  <marked-div v-if="callText" :text="callText" class="q-mt-xl" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

const eventStore = useEventStore();

const { contentsDict } = storeToRefs(eventStore);

const callText = computed<MarkdownText | null>(
  () => (contentsDict.value['calls.call_for_papers']?.value as MarkdownText) || null,
);

useMeta(() => {
  return {
    title: 'Call for Papers',
  };
});
</script>

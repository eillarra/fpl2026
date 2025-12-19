<template>
  <h2 class="fpl__text-title">Call for Papers: Journal Track</h2>
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
  () => contentsDict.value['calls.call_for_journal_track_pap']?.value || null,
);

useMeta(() => {
  return {
    title: 'Call for Papers: Journal Track',
  };
});
</script>

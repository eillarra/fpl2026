<template>
  <h2 class="fpl__text-title">Program Committee</h2>
  <q-separator />
  <marked-div v-if="committeeText" :text="committeeText" class="q-mt-xl" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

const eventStore = useEventStore();

const { contentsDict } = storeToRefs(eventStore);

const committeeText = computed<MarkdownText | null>(
  () => (contentsDict.value['committees.program_committee']?.value as MarkdownText) || null,
);

useMeta(() => {
  return {
    title: 'Program Committee',
  };
});
</script>

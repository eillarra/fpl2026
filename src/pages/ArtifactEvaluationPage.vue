<template>
  <h2 class="fpl__text-title">Artifact Evaluation</h2>
  <q-separator />
  <marked-div v-if="pageText" :text="pageText" class="q-mt-xl" />
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

const eventStore = useEventStore();

const { contentsDict } = toRefs(eventStore);

const pageText = computed<MarkdownText | null>(() => contentsDict.value['artifact_evaluation.main']?.value || null);

useMeta(() => {
  return {
    title: 'Artifact Evaluation',
  };
});
</script>

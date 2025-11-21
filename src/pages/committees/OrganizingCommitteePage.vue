<template>
  <h2 class="fpl__text-title">Organizing Committee</h2>
  <q-separator />
  <marked-div v-if="committeeText" :text="committeeText" class="q-mt-xl" />
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

const eventStore = useEventStore();

const { contentsDict } = toRefs(eventStore);

const committeeText = computed<MarkdownText | null>(
  () => contentsDict.value['committees.organizing_committee']?.value || null,
);

useMeta(() => {
  return {
    title: 'Organizing Committee',
  };
});
</script>

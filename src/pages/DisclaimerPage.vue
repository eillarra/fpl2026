<template>
  <h2 class="fpl__text-title">Disclaimer</h2>
  <q-separator />
  <marked-div v-if="legalNoticeText" :text="legalNoticeText" class="q-mt-xl" />
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

const eventStore = useEventStore();

const { contentsDict } = toRefs(eventStore);

const legalNoticeText = computed<MarkdownText | null>(() => contentsDict.value['disclaimer']?.value || null);

useMeta(() => {
  return {
    title: 'Disclaimer',
  };
});
</script>

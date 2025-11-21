<template>
  <h2 class="fpl__text-title">Accommodation</h2>
  <q-separator class="q-mb-xl" />
  <div class="row q-col-gutter-xl q-mt-none">
    <div class="col-12 col-md-5">
      <marked-div :text="accommodationText" />
    </div>
    <div v-if="gmapsEmbedUrl" class="col-12 col-md">
      <q-video :src="gmapsEmbedUrl" :ratio="$q.screen.gt.sm ? 1.6 : 1" />
    </div>
  </div>
  <template v-if="aboutGhentText">
    <q-separator class="q-my-xl" />
    <div>
      <h4 class="fpl__text-subtitle2">About Ghent</h4>
      <marked-div :text="aboutGhentText" />
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

const eventStore = useEventStore();

const { contentsDict } = toRefs(eventStore);

const accommodationText = computed<MarkdownText | null>(() => contentsDict.value['accommodation']?.value || null);

const aboutGhentText = computed<MarkdownText | null>(() => contentsDict.value['ghent.about']?.value || null);

const gmapsEmbedUrl = computed<Url | null>(() => contentsDict.value['accommodation.gmaps_embed_url']?.value || null);

useMeta(() => {
  return {
    title: 'Accommodation',
  };
});
</script>

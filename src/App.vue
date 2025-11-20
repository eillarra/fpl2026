<template>
  <router-view />
</template>

<script setup lang="ts">
import { Loading, useMeta } from 'quasar';
import { watchEffect } from 'vue';

import { useEventStore } from '@evan/stores/event';

import { notify } from '@/utils/notify';

Loading.show({
  delay: 0,
  backgroundColor: '#0000ff',
  spinnerSize: 150,
});

const eventStore = useEventStore();

eventStore.init().catch(() => {
  Loading.hide();
});

watchEffect(() => {
  if (eventStore._loaded) {
    Loading.hide();
  }
});

useMeta({
  title: 'FPL 2026',
  titleTemplate: (title) => (title == 'FPL 2026' ? title : `${title} - FPL 2026`),
});

window.addEventListener('vite:preloadError', () => {
  notify.reload();
});
</script>

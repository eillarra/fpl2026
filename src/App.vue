<template>
  <router-view />
</template>

<script setup lang="ts">
import { Loading, useMeta } from 'quasar';
import { watchEffect } from 'vue';

import { useEventStore } from '@evan/stores/event';
import { setupDates } from '@evan/utils/dates';

import { EVAN_EVENT_CODE, EVAN_EVENT_TIMEZONE, EVAN_EVENT_IS_VIRTUAL } from '@/constants';
import { notify } from '@/utils/notify';

setupDates(EVAN_EVENT_TIMEZONE, EVAN_EVENT_IS_VIRTUAL);

Loading.show({
  delay: 0,
  backgroundColor: '#0000ff',
  spinnerSize: 150,
});

const eventStore = useEventStore();

eventStore.init(EVAN_EVENT_CODE).catch(() => {
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

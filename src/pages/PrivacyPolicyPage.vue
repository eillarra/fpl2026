<template>
  <h2 class="fpl__text-title">Privacy policy for this website and related services</h2>
  <q-separator />
  <h6 class="q-mt-xl">
    Ghent University, Technologiepark 126, 9052 Gent, Belgium, is the data controller (“we” or “us”) for this website.
    This notice describes how we process your personal data on this website and our related services such as event
    registration.
  </h6>
  <marked-div v-if="privacyPolicyText" :text="privacyPolicyText" />
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';

const eventStore = useEventStore();

const { contentsDict } = toRefs(eventStore);

const privacyPolicyText = computed<MarkdownText | null>(() => contentsDict.value['privacy_policy']?.value || null);

useMeta(() => {
  return {
    title: 'Privacy Policy',
  };
});
</script>

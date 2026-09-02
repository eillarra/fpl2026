<template>
  <div v-if="keynote.speaker" class="q-mb-md">
    <div class="text-subtitle2 text-grey-7 q-mb-sm">Speaker</div>
    <div class="row items-start q-col-gutter-lg q-mb-lg">
      <div class="col-shrink">
        <avatar-display :file="avatar" size="128px" :alt-text="keynote.speaker" />
      </div>
      <div class="col">
        <p class="q-mb-none text-wrap-balance">
          <strong>{{ keynote.speaker }}</strong>
          <span v-if="keynote.extra_data?.speaker_affiliation" class="text-grey-8">
            <br />{{ keynote.extra_data.speaker_affiliation }}
          </span>
        </p>
      </div>
      <div v-if="keynote.extra_data?.speaker_website" class="col-auto">
        <fpl-btn
          :href="keynote.extra_data.speaker_website"
          target="_blank"
          :icon="iconOpenInNew"
          label="Visit website"
          size="md"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { getKeynoteAvatar } from '@/utils/program';
import { iconOpenInNew } from '@/icons';

import AvatarDisplay from '@/components/AvatarDisplay.vue';

const props = defineProps<{
  keynote: EvanKeynote;
}>();

const avatar = computed(() => getKeynoteAvatar(props.keynote));
</script>

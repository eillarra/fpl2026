<template>
  <div style="display: inline">
    <q-btn
      v-if="!hideButton"
      :label="inline ? undefined : buttonLabel"
      :icon="buttonIcon"
      :color="buttonColor"
      :size="inline ? '8px' : buttonSize"
      :flat="buttonFlat"
      :outline="buttonOutline"
      :dense="buttonDense"
      :round="inline"
      :class="{ 'flex-inline': inline }"
      @click="openDialog"
    />
    <fpl-dialog v-model="dialogOpen">
      <fpl-dialog-content title="Keynote details" hide-drawer compact>
        <template #tabs>
          <h6 class="q-mt-none q-mb-md text-wrap-balance">{{ keynote.title }}</h6>
        </template>
        <template #page>
          <div class="q-px-lg q-pb-xl">
            <speaker-block :keynote="keynote" />
            <schedule-block
              :session-display="sessionDisplay"
              :subsession-display="subsessionDisplay"
              :session-id="keynote.session"
              :subsession-id="keynote.subsession"
              :hide-favorite-btn="hideFavoriteBtn"
              show-fallback
            />
            <div v-if="keynote.bio" class="q-mb-lg">
              <div class="text-subtitle2 text-grey-7 q-mb-sm">Speaker Bio</div>
              <marked-div :text="keynote.bio" />
            </div>
            <div v-if="keynote.abstract" class="q-mb-md">
              <div class="text-subtitle2 text-grey-7 q-mb-xs">Abstract</div>
              <marked-div :text="keynote.abstract" />
            </div>
          </div>
        </template>
      </fpl-dialog-content>
    </fpl-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import MarkedDiv from '@evan/components/MarkedDiv.vue';
import FplDialogContent from '@/components/FplDialogContent.vue';
import FplDialog from '@/components/FplDialog.vue';

import { useSessionDisplay } from './session-content/composables/useSessionDisplay';
import ScheduleBlock from './session-content/blocks/ScheduleBlock.vue';
import SpeakerBlock from './session-content/blocks/SpeakerBlock.vue';

interface Props {
  keynote: EvanKeynote;
  buttonLabel?: string;
  buttonIcon?: string;
  buttonColor?: string;
  buttonSize?: string;
  buttonFlat?: boolean;
  buttonOutline?: boolean;
  buttonDense?: boolean;
  hideFavoriteBtn?: boolean;
  inline?: boolean;
  hideButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  buttonLabel: 'Details',
  buttonIcon: 'info',
  buttonColor: 'primary',
  buttonSize: 'md',
  buttonFlat: false,
  buttonOutline: false,
  buttonDense: false,
  hideFavoriteBtn: false,
  inline: false,
  hideButton: false,
});

const { sessionDisplay, subsessionDisplay } = useSessionDisplay(
  () => props.keynote.session,
  () => props.keynote.subsession,
);

const dialogOpen = ref(false);

const openDialog = () => {
  dialogOpen.value = true;
};

// Expose methods for programmatic control
defineExpose({
  openDialog,
});
</script>

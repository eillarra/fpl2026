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
      :round="inline || buttonRound"
      :class="{ 'flex-inline': inline }"
      @click="openDialog"
    />
    <fpl-dialog v-model="dialogOpen">
      <fpl-dialog-content title="Paper details" hide-drawer compact>
        <template #tabs>
          <h6 class="q-mt-none q-mb-md text-wrap-balance">{{ paper.title }}</h6>
        </template>
        <template #page>
          <div class="q-px-lg q-pb-xl">
            <div v-if="authorsDisplay" class="q-mb-md">
              <div class="text-subtitle2 text-grey-7 q-mb-xs">Authors</div>
              <p class="text-wrap-balance">
                <em>{{ authorsDisplay }}</em>
              </p>
            </div>
            <div v-if="paper.doi" class="q-mb-md">
              <div class="text-subtitle2 text-grey-7 q-mb-xs">DOI</div>
              <q-btn
                :label="paper.doi"
                :href="`https://doi.org/${paper.doi}`"
                target="_blank"
                color="primary"
                flat
                dense
                no-caps
                :icon="iconOpenInNew"
                class="q-pl-none"
              />
            </div>
            <schedule-block
              :session-display="sessionDisplay"
              :subsession-display="subsessionDisplay"
              :session-id="paper.session"
              :subsession-id="paper.subsession"
              :hide-favorite-btn="hideFavoriteBtn"
              favorite-offset="xl"
            />
            <div v-if="paper.abstract" class="q-mb-md">
              <div class="text-subtitle2 text-grey-7 q-mb-xs">Abstract</div>
              <marked-div :text="paper.abstract" />
            </div>
          </div>
        </template>
      </fpl-dialog-content>
    </fpl-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { useSessionDisplay } from './session-content/composables/useSessionDisplay';
import ScheduleBlock from './session-content/blocks/ScheduleBlock.vue';

import FplDialog from '@/components//FplDialog.vue';
import FplDialogContent from '@/components/FplDialogContent.vue';
import MarkedDiv from '@evan/components/MarkedDiv.vue';

import { iconCalendar, iconOpenInNew } from '@/icons';

const props = withDefaults(
  defineProps<{
    paper: EvanPaper;
    buttonLabel?: string;
    buttonIcon?: string;
    buttonColor?: string;
    buttonSize?: string;
    buttonFlat?: boolean;
    buttonOutline?: boolean;
    buttonRound?: boolean;
    buttonDense?: boolean;
    inline?: boolean;
    hideFavoriteBtn?: boolean;
    hideButton?: boolean;
  }>(),
  {
    buttonIcon: iconCalendar,
    buttonColor: 'primary',
    buttonSize: 'sm',
    buttonFlat: true,
    buttonOutline: false,
    buttonDense: true,
    inline: false,
    hideFavoriteBtn: false,
    hideButton: false,
  },
);

const { sessionDisplay, subsessionDisplay } = useSessionDisplay(
  () => props.paper.session,
  () => props.paper.subsession,
);

const dialogOpen = ref(false);

const openDialog = () => {
  dialogOpen.value = true;
};

const authorsDisplay = computed(() => {
  if (props.paper.extra_data?.authors_str) {
    return props.paper.extra_data.authors_str;
  }
  if (props.paper.extra_data?.authors && props.paper.extra_data.authors.length > 0) {
    return props.paper.extra_data.authors.map((author) => author.name).join(', ');
  }
  return null;
});
</script>

<style scoped>
.inline-paper-btn {
  margin-left: 4px;
  vertical-align: middle;
}
</style>

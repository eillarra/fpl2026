<template>
  <div style="display: inline">
    <fpl-btn
      :icon="iconBook"
      :label="buttonLabel"
      :type="buttonType"
      :to="buttonTo"
      :class="buttonClass"
      @click="openDialog"
    />
    <fpl-dialog v-model="dialogOpen">
      <fpl-dialog-content title="Online proceedings" hide-drawer compact>
        <template #page>
          <marked-div :text="springerText" class="q-px-lg" />
        </template>
      </fpl-dialog-content>
    </fpl-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useEventStore } from '@evan/stores/event';

import FplBtn from '@/components/FplBtn.vue';
import FplDialog from '@/components/FplDialog.vue';
import FplDialogContent from '@/components/FplDialogContent.vue';

import { iconBook } from '@/icons';

interface Props {
  buttonLabel?: string;
  buttonType?: string;
  buttonTo?: object;
  buttonClass?: string | object;
}

withDefaults(defineProps<Props>(), {
  buttonLabel: 'Online proceedings',
  buttonType: 'a',
  buttonTo: undefined,
  buttonClass: '',
});

const eventStore = useEventStore();

const dialogOpen = ref(false);

const { contentsDict } = storeToRefs(eventStore);

const springerText = computed<MarkdownText | null>(
  () => (contentsDict.value['springer']?.value as MarkdownText) || null,
);

const openDialog = (event: Event) => {
  event.preventDefault();
  dialogOpen.value = true;
};
</script>

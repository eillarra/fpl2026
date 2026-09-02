<template>
  <div v-if="sessionDisplay || subsessionDisplay" class="q-mb-lg">
    <div class="text-subtitle2 text-grey-7 q-mb-sm">Presentation schedule</div>
    <div v-if="!hideFavoriteBtn" class="float-right" :class="favoriteOffset === 'xl' ? 'q-ml-xl' : 'q-ml-lg'">
      <favorite-btn
        v-if="subsessionDisplay"
        type="subsession"
        :id="subsessionId"
        :hide-label="!$q.screen.gt.sm"
        size="lg"
      />
      <favorite-btn
        v-else-if="sessionDisplay"
        type="session"
        :id="sessionId"
        :hide-label="!$q.screen.gt.sm"
        size="lg"
      />
    </div>
    <div v-if="subsessionDisplay">
      <strong>Session:</strong> {{ subsessionDisplay.title }}<br />
      <span v-if="subsessionDisplay.timeInfo"><strong>Time:</strong> {{ subsessionDisplay.timeInfo }}</span
      ><br />
      <span v-if="subsessionDisplay.roomInfo"><strong>Room:</strong> {{ subsessionDisplay.roomInfo }}</span>
    </div>
    <div v-else-if="sessionDisplay">
      <strong>Session:</strong> {{ sessionDisplay.title }}<br />
      <span v-if="sessionDisplay.timeInfo"><strong>Time:</strong> {{ sessionDisplay.timeInfo }}</span
      ><br />
      <span v-if="sessionDisplay.roomInfo"><strong>Room:</strong> {{ sessionDisplay.roomInfo }}</span>
    </div>
  </div>
  <!-- Fallback branches only used by keynote dialog; wording kept identical -->
  <template v-else-if="showFallback">
    <div v-if="sessionId" class="q-mb-lg">
      <div class="text-subtitle2 text-grey-7 q-mb-sm">Presentation schedule</div>
      <div class="text-grey-6">
        <em>Session {{ sessionId }} not found or missing schedule information</em>
      </div>
    </div>
    <div v-else class="q-mb-lg">
      <div class="text-subtitle2 text-grey-7 q-mb-sm">Presentation schedule</div>
      <div class="text-grey-6">
        <em>This keynote is not assigned to a session</em>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

import FavoriteBtn from '@/components/program/FavoriteBtn.vue';
import type { SessionDisplayInfo } from '@/utils/program';

withDefaults(
  defineProps<{
    sessionDisplay?: SessionDisplayInfo | null;
    subsessionDisplay?: SessionDisplayInfo | null;
    sessionId?: number | null;
    subsessionId?: number | null;
    hideFavoriteBtn?: boolean;
    favoriteOffset?: 'lg' | 'xl';
    showFallback?: boolean;
  }>(),
  {
    sessionDisplay: null,
    subsessionDisplay: null,
    sessionId: null,
    subsessionId: null,
    hideFavoriteBtn: false,
    favoriteOffset: 'lg',
    showFallback: false,
  },
);

const $q = useQuasar();
</script>

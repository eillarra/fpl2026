<template>
  <div v-if="markers.length" class="program-day-breaks">
    <button
      v-for="marker in markers"
      :key="marker.session.id"
      type="button"
      class="program-day-breaks__item cursor-pointer"
      @click="$emit('markerClick', marker.session)"
    >
      <span class="program-day-breaks__time">{{ marker.timeLabel }}</span>
      <span class="program-day-breaks__label">{{ marker.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { EvanSession } from '@/utils/program';

export interface DayBreakMarker {
  session: EvanSession;
  label: string;
  timeLabel: string;
}

interface Props {
  markers?: DayBreakMarker[];
}

withDefaults(defineProps<Props>(), {
  markers: () => [],
});

defineEmits<{
  markerClick: [session: EvanSession];
}>();
</script>

<style scoped>
.program-day-breaks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.program-day-breaks__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  padding: 0;
  background: none;
  border: none;
  text-align: left;
}

.program-day-breaks__item:hover .program-day-breaks__label {
  text-decoration: underline;
}

.program-day-breaks__time {
  font-size: 12px;
  line-height: 1.3;
  color: #9e9e9e;
}

.program-day-breaks__label {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.35;
  color: #424242;
}
</style>

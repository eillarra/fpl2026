<template>
  <div v-if="hasSubsessions">
    <h5 v-if="showTitle" class="q-mt-xl q-mb-md">Time slots</h5>
    <div v-for="(subsession, index) in session.subsessions" :key="subsession.id">
      <q-separator v-if="index > 0" class="q-mt-lg q-mb-md" />
      <favorite-btn type="subsession" :id="subsession.id" :hide-label="!$q.screen.gt.sm" class="q-mt-sm float-right" />
      <h4 class="fpl__text-subtitle3 q-mb-none">
        {{ getSubsessionDisplayTitle(subsession, index, session.code) }}
        <q-chip v-if="subsession.start_at" size="md" color="grey-3" class="q-ml-sm">
          {{ formatProgramTime(subsession.start_at) }} - {{ formatProgramTime(subsession.end_at) }}
        </q-chip>
      </h4>
      <program-marked-div
        v-if="subsessionProgramContent.get(subsession.id)"
        :text="subsessionProgramContent.get(subsession.id) ?? ''"
        hide-favorite-btn
        class="q-py-md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';

import { formatProgramTime, getSubsessionDisplayTitle } from '@/utils/program';

import FavoriteBtn from '@/components/program/FavoriteBtn.vue';
import ProgramMarkedDiv from '@/components/program/ProgramMarkedDiv.vue';

const props = defineProps<{
  session: EvanSession;
  subsessionProgramContent: Map<number, string>;
  showTitle?: boolean;
}>();

const $q = useQuasar();

const hasSubsessions = computed(() => !!(props.session.subsessions && props.session.subsessions.length > 0));
</script>

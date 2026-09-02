<template>
  <fpl-dialog-content :title="$q.screen.gt.sm ? titles[0] : titles[1]" hide-drawer>
    <template #tabs>
      <q-tabs v-if="!isSpecialSessionType && !keynoteInline" v-model="tab" shrink inline-label no-caps>
        <q-tab v-if="hasProgramContent" name="program" label="Program" />
        <q-tab v-if="hasGeneralInfo" name="info" label="General information" />
        <q-tab v-if="hasCommittees" name="committees" label="Committees" />
      </q-tabs>
    </template>
    <template #page>
      <session-header-block :session="session" :hide-favorite="sessionType === 'catering'" class="q-mb-lg" />

      <!-- Special session types: simplified single view -->
      <div v-if="isSpecialSessionType" class="q-px-lg q-pt-md q-pb-xl">
        <div class="row reverse justify-between q-col-gutter-xl">
          <div class="col-12 col-md-5">
            <venue-block v-if="$q.screen.gt.sm" :session="session" />
            <important-dates-block :dates="importantDates" />
            <committees-block v-if="mainCommittees.length && $q.screen.gt.sm" :committees="mainCommittees" />
          </div>

          <div class="col-12 col-md">
            <venue-block v-if="!$q.screen.gt.sm" :session="session" variant="compact" class="q-mb-md" />
            <marked-div :text="session.description" />
            <div v-if="sessionProgramContent && sessionProgramContent.trim()">
              <program-marked-div :text="sessionProgramContent" hide-favorite-btn />
            </div>
          </div>
        </div>
      </div>

      <!-- Pattern A/B: keynote session — show remaining program text (session chair
           etc.) plus the keynote content directly, no nested "More info" dialog -->
      <div v-else-if="keynoteInline" class="q-px-lg q-pt-md q-pb-xl">
        <program-marked-div v-if="programKeynoteText" :text="programKeynoteText" hide-favorite-btn class="q-mb-lg" />
        <speaker-block :keynote="keynoteInline" />
        <div v-if="keynoteInline.abstract" class="q-mb-lg">
          <div class="text-subtitle2 text-grey-7 q-mb-xs">Abstract</div>
          <marked-div :text="keynoteInline.abstract" />
        </div>
        <div v-if="keynoteInline.bio" class="q-mb-lg">
          <div class="text-subtitle2 text-grey-7 q-mb-sm">Speaker Bio</div>
          <marked-div :text="keynoteInline.bio" />
        </div>
      </div>

      <!-- Regular sessions: tabbed view -->
      <q-tab-panels v-else v-model="tab" class="q-px-sm">
        <q-tab-panel name="info">
          <div class="row reverse justify-between q-col-gutter-xl q-pt-none">
            <div class="col-12 col-md-5">
              <important-dates-block :dates="importantDates" />
              <committees-block v-if="mainCommittees.length && $q.screen.gt.sm" :committees="mainCommittees" />
            </div>
            <div class="col-12 col-md-6">
              <marked-div :text="session.description" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="program">
          <program-marked-div
            v-if="sessionProgramContent && sessionProgramContent.trim()"
            :text="sessionProgramContent"
            hide-favorite-btn
          />
          <subsessions-block
            :session="session"
            :subsession-program-content="subsessionProgramContent"
            :show-title="!!(sessionProgramContent && sessionProgramContent.trim())"
          />
        </q-tab-panel>
        <q-tab-panel name="committees">
          <div class="row justify-between q-col-gutter-xl">
            <div v-if="mainCommittees.length" class="col-12 col-md-5">
              <committees-block :committees="mainCommittees" spacing="mb" />
            </div>
            <div v-if="secondaryCommittees.length" class="col-12 col-md-6">
              <committees-block :committees="secondaryCommittees" variant="list" spacing="mb" />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </fpl-dialog-content>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useQuasar } from 'quasar';

import { useProgramTemplate } from '@evan/composables/useProgramTemplate';
import { useEventStore } from '@evan/stores/event';
import { formatImportantDate, passedImportantDate } from '@evan/utils/dates';
import { logger } from '@evan/utils/logger';

import { getSessionDisplayTitle, isBreakTrackName } from '@/utils/program';

import MarkedDiv from '@evan/components/MarkedDiv.vue';
import FplDialogContent from '@/components/FplDialogContent.vue';
import ProgramMarkedDiv from '@/components/program/ProgramMarkedDiv.vue';

import CommitteesBlock from '@/components/program/session-content/blocks/CommitteesBlock.vue';
import SessionHeaderBlock from '@/components/program/session-content/blocks/SessionHeaderBlock.vue';
import VenueBlock from '@/components/program/session-content/blocks/VenueBlock.vue';
import ImportantDatesBlock from '@/components/program/session-content/blocks/ImportantDatesBlock.vue';
import SpeakerBlock from '@/components/program/session-content/blocks/SpeakerBlock.vue';
import SubsessionsBlock from '@/components/program/session-content/blocks/SubsessionsBlock.vue';

const $q = useQuasar();
const eventStore = useEventStore();
const { renderTemplate } = useProgramTemplate();

const props = defineProps<{
  session: EvanSession;
}>();

// Reactive program content
const sessionProgramContent = ref<string>('');
const subsessionProgramContent = ref<Map<number, string>>(new Map());

const updateSessionProgramContent = async () => {
  if (props.session.program && eventStore.programDataLoaded) {
    sessionProgramContent.value = await renderTemplate(props.session.program);
  } else {
    sessionProgramContent.value = '';
  }
};

const updateSubsessionProgramContent = async () => {
  const contentMap = new Map<number, string>();

  if (props.session.subsessions && eventStore.programDataLoaded) {
    for (const subsession of props.session.subsessions) {
      if (subsession.program) {
        contentMap.set(subsession.id, await renderTemplate(subsession.program));
      }
    }
  }

  subsessionProgramContent.value = contentMap;
};

watchEffect(() => {
  updateSessionProgramContent().catch((err) =>
    logger.error('Failed to update session program content', { error: String(err) }),
  );
});

watchEffect(() => {
  updateSubsessionProgramContent().catch((err) =>
    logger.error('Failed to update subsession program content', { error: String(err) }),
  );
});

const sessionType = computed<'regular' | 'social' | 'catering'>(() => {
  if (!props.session) return 'regular';

  if (props.session.is_social_event) return 'social';

  if (props.session.track && eventStore.event?.tracks) {
    const track = eventStore.event.tracks.find((t) => t.id === props.session.track);
    if (track && isBreakTrackName(track.name)) {
      return 'catering';
    }
  }

  return 'regular';
});

const isSpecialSessionType = computed(() => {
  return sessionType.value === 'social' || sessionType.value === 'catering';
});

// Pattern A: program content references a keynote via a single [keynote:CODE] tag
// (may be preceded by session chair etc.) — show keynote contents directly in
// the session dialog instead of a nested "More info" dialog
const programKeynote = computed(() => {
  const program = props.session.program;
  if (!program || isSuperseded(program)) return null;
  const tags = program.match(/\[keynote:[^\]]+\]/g);
  if (!tags || tags.length !== 1) return null;
  const code = tags[0].match(/\[keynote:([^\]]+)\]/)?.[1];
  if (!code) return null;
  return eventStore.keynotes.find((k) => k.code === code) ?? null;
});

// Program text with the keynote tag stripped (session chair info etc. stays)
const programKeynoteText = computed(() => {
  if (!programKeynote.value) return '';
  return (sessionProgramContent.value || '').replace(/\[keynote:[^\]]+\]/g, '').trim();
});

// Pattern B: find keynote directly linked to this session (no subsession)
const linkedKeynote = computed(() => {
  if (hasProgramContent.value || hasGeneralInfo.value) return null;
  return eventStore.keynotes.find((k) => k.session === props.session.id && !k.subsession) ?? null;
});

const keynoteInline = computed(() => linkedKeynote.value ?? programKeynote.value);

// '[superseded]' sentinel used in Evan admin
// '[superseded]' is a sentinel used in Evan admin to indicate the session-level
// content is intentionally empty because the keynote object is the authoritative
// source (Pattern B: standalone keynote session). Treat it as empty.
const isSuperseded = (text: string | null | undefined): boolean =>
  !text || text.trim() === '' || text.trim() === '[superseded]';

const hasProgramContent = computed(() => {
  if (!props.session) return false;
  const hasSubsessions = props.session.subsessions && props.session.subsessions.length > 0;
  const hasProgram = !isSuperseded(props.session.program);
  return hasSubsessions || hasProgram;
});

const hasGeneralInfo = computed(() => {
  if (!props.session) return false;
  return !isSuperseded(props.session.description);
});

const titles = computed<[string, string]>(() => {
  const tracks = eventStore.event?.tracks || [];
  const track = tracks.find((t) => t.id === props.session.track);
  const isKeynoteTrack = track?.name.toLowerCase() === 'keynotes';
  return isKeynoteTrack
    ? [props.session.title, 'Keynote']
    : [getSessionDisplayTitle(props.session, tracks), props.session.code || props.session.title];
});

const mainCommittees = computed<Committee[]>(
  () => props.session.extra_data.committees?.filter((c) => c.display === 'full') || [],
);

const secondaryCommittees = computed<Committee[]>(
  () => props.session.extra_data.committees?.filter((c) => c.display === 'list') || [],
);

const hasCommittees = computed(() => {
  return mainCommittees.value.length > 0 || secondaryCommittees.value.length > 0;
});

const tab = ref<string>('');

watchEffect(() => {
  // Special session types don't use tabs, so only set tab for regular sessions
  if (!isSpecialSessionType.value) {
    if (hasProgramContent.value) {
      tab.value = 'program';
    } else if (hasGeneralInfo.value) {
      tab.value = 'info';
    } else if (hasCommittees.value) {
      tab.value = 'committees';
    } else {
      tab.value = 'info';
    }
  }
});

const importantDates = computed<ImportantDate[]>(() => {
  return (
    props.session.extra_data?.important_dates?.map((d) => ({
      ...d,
      label: d.aoe ? `${d.label} (AoE)` : d.label,
      formatted: formatImportantDate(d, d.aoe),
      is_past: passedImportantDate(d),
    })) || []
  );
});
</script>

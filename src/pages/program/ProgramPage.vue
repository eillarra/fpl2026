<template>
  <div class="q-mb-xl q-pb-xl">
    <div class="container">
      <div class="row q-col-gutter-y-lg q-col-gutter-x-md justify-between q-mb-lg">
        <div class="col-12 col-md-4 flex column q-pr-lg" v-show="$q.screen.gt.xs">
          <fpl-separator label="Schedule" />
        </div>
        <div class="col-12 col-md-8">
          <fpl-search-bar
            placeholder="Search sessions, speakers, topics, track names, or types (e.g. 'social event', 'keynote')..."
            @search="searchQuery = $event"
          >
            <template #footer>
              <span v-if="filteredSessions.length > 0"
                >{{ filteredSessions.length }} session<span v-if="filteredSessions.length > 1">s</span> found</span
              >
              <span v-if="hasFiltersApplied"> (filtered)</span>
            </template>
          </fpl-search-bar>
        </div>
      </div>

      <empty-state
        v-if="!filteredSessions.length"
        icon="event_busy"
        title="No sessions found"
        :description="
          hasFiltersApplied ? 'Try adjusting your search or filters' : 'Sessions will appear here when available'
        "
      />

      <div v-else>
        <div v-for="group in displayGroups" :key="group.date" class="day-group q-mb-xl">
          <fpl-separator :label="group.dateLabel" color="primary" size="md" class="lt-sm q-mb-md" />
          <program-day-breaks :markers="group.breaks" class="lt-sm q-mb-md" @marker-click="openSessionDetails" />
          <div class="row q-col-gutter-y-lg q-col-gutter-x-md justify-between">
            <div class="col-12 col-md-3" v-show="$q.screen.gt.xs">
              <div class="day-aside">
                <fpl-separator :label="group.dateLabel" color="primary" size="md" />
                <program-day-breaks :markers="group.breaks" @marker-click="openSessionDetails" />
              </div>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-md">
                <div v-for="row in group.rows" :key="row.id" class="col-12">
                  <div class="row q-col-gutter-md">
                    <div
                      v-for="session in row.sessions"
                      :key="displayKey(session)"
                      :class="row.parallel ? getParallelRowClass(row.sessions.length) : 'col-12'"
                    >
                      <program-card v-bind="getSessionCardProps(session)" @click="openSessionDetails(session)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <fpl-dialog v-model="showSessionDialog">
    <session-dialog-content v-if="selectedSession" :session="selectedSession" />
  </fpl-dialog>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useQuasar } from 'quasar';

import { useFavorites } from '@evan/composables/useFavorites';
import { useEventStore } from '@evan/stores/event';
import { logger } from '@evan/utils/logger';

import {
  filterSessionsWithTypes,
  groupSessionsByDayAdvanced,
  getSessionDisplayTitle,
  formatProgramDate,
  formatProgramTime,
  isBreakTrackName,
  isPosterSession,
  sortSessionsAdvanced,
  getKeynoteAvatar,
  type EvanSession,
} from '@/utils/program';

import FplDialog from '@/components/FplDialog.vue';
import FplSearchBar from '@/components/FplSearchBar.vue';
import FplSeparator from '@/components/FplSeparator.vue';
import EmptyState from '@/components/program/EmptyState.vue';
import ProgramCard from '@/components/program/ProgramCard.vue';
import ProgramDayBreaks from '@/components/program/ProgramDayBreaks.vue';
import SessionDialogContent from './SessionDialogContent.vue';

const eventStore = useEventStore();
const $q = useQuasar();
const favorites = useFavorites();
const route = useRoute();
const router = useRouter();

const selectedDate = inject<{ value: string }>('selectedDate');
const searchQuery = ref('');

const selectedSession = ref<EvanSession | null>(null);
const closeSessionDialogRouteUpdate = async () => {
  await router.replace({
    name: 'fullProgram',
    query: route.query,
    state: { preserveScroll: true },
  });
};

const showSessionDialog = computed<boolean>({
  get() {
    return !!selectedSession.value;
  },
  set(value) {
    if (!value) {
      selectedSession.value = null;

      if (route.params.sessionSlug) {
        closeSessionDialogRouteUpdate().catch((err) =>
          logger.error('Failed to close session dialog', { error: String(err) }),
        );
      }
    }
  },
});

// Sessions with multiple timed subsessions (e.g. a workshop booked Thu-Fri as one session,
// or an industry session split into parts) render as one block per subsession, so each
// shows its own time range instead of one card spanning them all
interface DisplaySession extends EvanSession {
  displayId: string;
}

const expandSubsessions = (sessions: EvanSession[]): DisplaySession[] => {
  const expanded: DisplaySession[] = [];

  for (const session of sessions) {
    const subs = (session.subsessions ?? []).filter((sub) => sub.start_at);

    if (subs.length > 1) {
      for (const sub of subs) {
        expanded.push({
          ...session,
          title: sub.title ? `${session.title} - ${sub.title}` : session.title,
          start_at: sub.start_at,
          end_at: sub.end_at || session.end_at,
          displayId: `${session.id}-${sub.id}`,
        });
      }
    } else {
      expanded.push({ ...session, displayId: String(session.id) });
    }
  }

  return expanded;
};

const filteredSessions = computed(() => {
  const tracks = eventStore.event?.tracks || [];
  const selectedDateValue = selectedDate?.value || 'all';

  const filtered = filterSessionsWithTypes(
    expandSubsessions(eventStore.sessions),
    searchQuery.value,
    selectedDateValue,
    [],
    tracks,
    eventStore.keynotes,
    eventStore.topics,
    eventStore.papers,
  );

  if (selectedDateValue !== 'all') {
    return sortSessionsAdvanced(filtered, tracks);
  }

  return filtered;
});

const groupedSessions = computed(() => {
  const selectedDateValue = selectedDate?.value || 'all';
  if (selectedDateValue !== 'all') {
    return null;
  }
  const tracks = eventStore.event?.tracks || [];
  return groupSessionsByDayAdvanced(filteredSessions.value, tracks);
});

const hasFiltersApplied = computed(() => {
  const selectedDateValue = selectedDate?.value || 'all';
  return searchQuery.value || selectedDateValue !== 'all';
});

const getSessionTrackInfo = (session: EvanSession) => {
  if (!session.track) return undefined;
  const tracks = eventStore.event?.tracks || [];
  const track = tracks.find((t) => t.id === session.track);
  return track ? { label: track.name, color: 'primary' } : undefined;
};

const getSessionLocationInfo = (session: EvanSession): string => {
  if (!session.room) return 'TBA';
  const rooms = eventStore.rooms || [];
  const room = rooms.find((r) => r.id === session.room);
  return room?.name || 'TBA';
};

const getSessionPaperCount = (session: EvanSession): number | undefined => {
  const paperCount = eventStore.papers.filter((paper) => paper.session === session.id).length;
  return paperCount > 0 ? paperCount : undefined;
};

const getSessionFavoriteState = (session: EvanSession) => {
  const state = favorites.getSessionFavoriteState(session);
  return {
    isFavorite: state === 'full',
    isPartial: state === 'partial',
  };
};

const getSessionVariant = (session: EvanSession): 'catering' | 'session' | 'keynote' | 'paper' | 'social' => {
  if (session.is_social_event) return 'social';
  if (!session.track) return 'session';

  const tracks = eventStore.event?.tracks || [];
  const track = tracks.find((t) => t.id === session.track);
  if (!track) return 'session';

  const trackName = track.name.toLowerCase();
  if (isBreakTrackName(track.name)) return 'catering';
  if (trackName.includes('keynote')) return 'keynote';
  if (trackName.includes('paper')) return 'paper';
  return 'session';
};

const isBreakSession = (session: EvanSession): boolean => getSessionVariant(session) === 'catering';

// Sessions forced into their own full-width row regardless of time overlaps:
// they are distinct announcements, not parallel content
const MANUALLY_SINGLE_ROW_IDS = [251, 266]; // welcome reception, contest winners announcement

const isManuallySingleRow = (session: EvanSession): boolean => MANUALLY_SINGLE_ROW_IDS.includes(session.id);

// Poster sessions (dedicated track in evan) are day-background events: they render as
// simple text in the day's info column instead of cards
const findPosterSessionIds = (sessions: EvanSession[]): Set<number> => {
  const tracks = eventStore.event?.tracks || [];
  return new Set(sessions.filter((s) => isPosterSession(s, tracks)).map((s) => s.id));
};

interface DayRow {
  id: string;
  sessions: DisplaySession[];
  parallel: boolean;
}

const displayKey = (session: EvanSession): string => (session as DisplaySession).displayId ?? String(session.id);

const getParallelRowClass = (count: number): string => (count === 2 ? 'col-12 col-sm-6' : 'col-12 col-md-4');

// Group a day's sessions into display rows: full-width single sessions, or clusters of
// genuinely overlapping sessions shown side by side. Background sessions (all-day posters)
// are treated as singletons: they live in the day's info column, not as cards
// Group a day's sessions into display rows: full-width single sessions, or clusters of
// genuinely overlapping sessions shown side by side. Poster sessions (day-background events)
// are treated as singletons: they live in the day's info column, not as cards
const buildDayRows = (sessions: DisplaySession[], posterIds: Set<number>): DayRow[] => {
  const timed = sessions.filter((s) => s.start_at).sort((a, b) => a.start_at.localeCompare(b.start_at));
  const rows: DayRow[] = [];
  let cluster: DisplaySession[] = [];
  let clusterEnd = '';

  const flushCluster = () => {
    if (cluster.length) {
      rows.push({ id: `row-${displayKey(cluster[0])}`, sessions: cluster, parallel: cluster.length > 1 });
      cluster = [];
      clusterEnd = '';
    }
  };

  for (const session of timed) {
    const start = session.start_at;
    const isSingleton =
      isBreakSession(session) || isManuallySingleRow(session) || !session.end_at || posterIds.has(session.id);

    if (isSingleton || (cluster.length && start >= clusterEnd)) {
      flushCluster();
    }

    if (isSingleton) {
      rows.push({ id: `row-${displayKey(session)}`, sessions: [session], parallel: false });
    } else {
      cluster.push(session);
      if (session.end_at > clusterEnd) {
        clusterEnd = session.end_at;
      }
    }
  }
  flushCluster();

  return rows.sort((a, b) => (a.sessions[0].start_at || '').localeCompare(b.sessions[0].start_at || ''));
};

interface DayBreakMarkerInfo {
  session: EvanSession;
  label: string;
  timeLabel: string;
}

// Info-column entries: breaks plus poster sessions, by time
const getDayTextEntries = (sessions: EvanSession[], posterIds: Set<number>): DayBreakMarkerInfo[] => {
  const tracks = eventStore.event?.tracks || [];
  return sessions
    .filter((s) => s.start_at && (isBreakSession(s) || posterIds.has(s.id)))
    .sort((a, b) => a.start_at.localeCompare(b.start_at))
    .map((session) => ({
      session,
      label: getSessionDisplayTitle(session, tracks),
      timeLabel:
        formatProgramTime(session.start_at) + (session.end_at ? ` - ${formatProgramTime(session.end_at)}` : ''),
    }));
};

interface DisplayGroup {
  date: string;
  dateLabel: string;
  sessions: DisplaySession[];
  breaks: DayBreakMarkerInfo[];
  rows: DayRow[];
}

const displayGroups = computed<DisplayGroup[]>(() => {
  const groups = groupedSessions.value
    ? groupedSessions.value
    : filteredSessions.value.length
      ? [
          {
            date: selectedDate?.value || 'all',
            dateLabel: formatProgramDate(filteredSessions.value[0].start_at),
            sessions: filteredSessions.value,
          },
        ]
      : [];

  return groups.map((group) => {
    const groupSessions = group.sessions as DisplaySession[];
    const posterIds = findPosterSessionIds(groupSessions);
    // Breaks + poster sessions live in the day's info column as simple text;
    // keep them as cards only when a search is active so they remain findable
    const displayed = searchQuery.value
      ? groupSessions
      : groupSessions.filter((s) => !isBreakSession(s) && !posterIds.has(s.id));

    return {
      ...group,
      sessions: displayed,
      breaks: getDayTextEntries(groupSessions, posterIds),
      rows: buildDayRows(displayed, posterIds),
    };
  });
});

const getKeynoteSpeakerInfo = (session: EvanSession) => {
  // Find keynote that corresponds to this session
  const keynote = eventStore.keynotes.find((k) => k.session === session.id);
  if (!keynote) return undefined;

  const avatar = getKeynoteAvatar(keynote);
  return {
    name: keynote.speaker,
    affiliation: keynote.extra_data?.speaker_affiliation,
    avatar,
  };
};

const getSessionCardProps = (session: EvanSession) => {
  const tracks = eventStore.event?.tracks || [];
  const variant = getSessionVariant(session);

  // Add speaker info for keynote sessions
  const speakerInfo = variant === 'keynote' ? getKeynoteSpeakerInfo(session) : undefined;

  return {
    title: getSessionDisplayTitle(session, tracks),
    startTime: session.start_at,
    endTime: session.end_at,
    trackInfo: getSessionTrackInfo(session),
    speakerInfo,
    locationInfo: getSessionLocationInfo(session),
    paperCount: getSessionPaperCount(session),
    favoriteState: getSessionFavoriteState(session),
    variant,
  };
};

const openSessionDetails = async (session: EvanSession) => {
  if (session.slug && route.params.sessionSlug !== session.slug) {
    await router.push({
      name: 'session',
      params: { sessionSlug: session.slug },
      query: route.query,
      state: { preserveScroll: true },
    });
  }

  selectedSession.value = session;
};

const sessionSlug = computed<string | null>(() => (route.params.sessionSlug as string) || null);

const redirectToProgram = async () => {
  await router.push({ name: 'program', query: route.query });
};

const fetchSessionBySlug = async (slug: string) => {
  if (!eventStore.programDataLoaded) {
    await eventStore.fetchProgramData();
  }

  const session = eventStore.sessions.find((s) => s.slug === slug);

  if (!session) {
    await redirectToProgram();
    return;
  }

  selectedSession.value = await eventStore.fetchSessionDetail(session);
};

watch(sessionSlug, (newSlug) => {
  if (newSlug) {
    if (!selectedSession.value || selectedSession.value.slug !== newSlug) {
      fetchSessionBySlug(newSlug).catch((err) =>
        logger.error('Failed to fetch session by slug', { slug: newSlug, error: String(err) }),
      );
    }
  } else {
    selectedSession.value = null;
  }
});

onMounted(() => {
  if (route.params.sessionSlug) {
    const slug = route.params.sessionSlug as string;
    fetchSessionBySlug(slug).catch((err) =>
      logger.error('Failed to fetch session on mount', { slug, error: String(err) }),
    );
  }
});
</script>

<style scoped>
.day-aside {
  position: sticky;
  top: 3em;
}
</style>

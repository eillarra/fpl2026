import { computed } from 'vue';

import { useEventStore } from '@evan/stores/event';
import { createSessionDisplayInfo, createSubsessionDisplayInfo } from '@/utils/program';
import type { SessionDisplayInfo } from '@/utils/program';

// Resolves session/subsession display info (title, time, room) for the given
// ids. Pass getter functions so reactivity tracks changing props.
export function useSessionDisplay(
  getSessionId: () => number | null | undefined,
  getSubsessionId: () => number | null | undefined,
) {
  const eventStore = useEventStore();

  const sessionDisplay = computed<SessionDisplayInfo | null>(() => {
    const sessionId = getSessionId();
    if (!sessionId) return null;

    const session = eventStore.sessions.find((s) => s.id === sessionId);
    if (!session) return null;

    return createSessionDisplayInfo(session, eventStore.rooms);
  });

  const subsessionDisplay = computed<SessionDisplayInfo | null>(() => {
    const subsessionId = getSubsessionId();
    if (!subsessionId) return null;

    const session = eventStore.sessions.find((s) => s.id === getSessionId());
    if (!session?.subsessions) return null;

    const subsession = session.subsessions.find((sub) => sub.id === subsessionId);
    if (!subsession) return null;

    const subsessionIndex = session.subsessions.findIndex((sub) => sub.id === subsessionId);
    return createSubsessionDisplayInfo(subsession, subsessionIndex, session.code, session.room, eventStore.rooms);
  });

  return { sessionDisplay, subsessionDisplay };
}

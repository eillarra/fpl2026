<template>
  <div class="q-mb-xl q-pb-xl">
    <div class="container">
      <div class="row q-col-gutter-y-lg q-col-gutter-x-md justify-between">
        <div class="col-12 col-md-3 flex column" v-show="$q.screen.gt.xs">
          <fpl-separator label="Accepted Papers" />
          <h6>{{ papersDescription }}</h6>
        </div>
        <div class="col-12 col-md-8">
          <fpl-search-bar
            placeholder="Search papers by title, authors, session, or ID"
            class="q-mb-md"
            @search="searchQuery = $event"
          >
            <template #footer>
              <span v-if="!searchQuery">{{ filteredPapers.length }} papers</span>
              <span v-else-if="filteredPapers.length > 0"
                >{{ filteredPapers.length }} paper<span v-if="filteredPapers.length > 1">s</span> found</span
              >
              <span v-else>No papers found</span>
            </template>
          </fpl-search-bar>
          <empty-state
            v-if="!allPapers.length"
            icon="article"
            title="No papers available"
            description="Papers will appear here once they are uploaded to the system."
          />
          <empty-state
            v-else-if="!filteredPapers.length"
            title="No papers found"
            description="Try adjusting your search terms or filters."
          />
          <template v-else>
            <ul class="papers-session-list evan__marked">
              <li v-for="paper in sortedPapers" :key="paper.id" class="paper-item q-mb-sm">
                <div class="row items-center no-wrap">
                  <div class="col text-wrap-balance">
                    <strong>{{ paper.title }}</strong>
                    <em v-if="getAuthorsDisplay(paper)"> <br />{{ getAuthorsDisplay(paper) }} </em>
                  </div>
                  <div class="col-auto q-ml-sm">
                    <paper-details-dialog
                      :paper="paper"
                      :button-icon="iconAddCircle"
                      :button-label="undefined"
                      button-color="fpl-blue"
                      button-size="md"
                      button-flat
                      button-round
                      button-dense
                    />
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue';

import { useEventStore } from '@evan/stores/event';
import { searchInFields } from '@evan/utils/text';

import { getSessionDisplayTitle } from '@/utils/program';

import FplSearchBar from '@/components/FplSearchBar.vue';
import FplSeparator from '@/components/FplSeparator.vue';
import EmptyState from '@/components/program/EmptyState.vue';
import PaperDetailsDialog from '@/components/program/PaperDetailsDialog.vue';

import { iconAddCircle } from '@/icons';

const eventStore = useEventStore();

// Inject selectedDate from parent MainProgramPage for filtering
const selectedDate = inject<{ value: string }>('selectedDate');

const searchQuery = ref('');

const allPapers = computed(() => eventStore.papers);

const papersDescription = computed(() =>
  eventStore.event ? `All accepted Papers at ${eventStore.event.name}, listed alphabetically.` : '',
);

const filteredPapers = computed(() => {
  let papers = allPapers.value;

  // Filter by search query
  if (searchQuery.value) {
    papers = papers.filter((paper) => {
      return searchInFields(
        searchQuery.value,
        paper.title,
        getAuthorsDisplay(paper),
        getSessionDisplay(paper),
        paper.extra_data?.internal_id ? String(paper.extra_data.internal_id) : undefined,
        // Add topic names as searchable terms
        ...paper.topics.map((topicId) => {
          const topic = eventStore.topics.find((t) => t.id === topicId);
          return topic ? topic.name : topicId.toString();
        }),
      );
    });
  }

  // Filter by selected day
  const selectedDateValue = selectedDate?.value || 'all';
  if (selectedDateValue !== 'all') {
    papers = papers.filter((paper) => {
      if (!paper.session) return false;
      const session = eventStore.sessions.find((s) => s.id === paper.session);
      if (!session?.start_at) return false;
      const sessionDate = new Date(session.start_at).toISOString().split('T')[0];
      return sessionDate === selectedDateValue;
    });
  }

  return papers;
});

const sortedPapers = computed(() => filteredPapers.value.slice().sort((a, b) => a.title.localeCompare(b.title)));

const getAuthorsDisplay = (paper: EvanPaper): string => {
  if (paper.extra_data?.authors_str) {
    return paper.extra_data.authors_str;
  }

  if (paper.extra_data?.authors?.length) {
    return paper.extra_data.authors.map((author) => author.name).join(', ');
  }

  return '';
};

const getSessionDisplay = (paper: EvanPaper): string => {
  if (!paper.session) return '';

  const session = eventStore.sessions.find((s) => s.id === paper.session);
  if (!session) return `Session ${paper.session}`;

  const tracks = eventStore.event?.tracks || [];
  return getSessionDisplayTitle(session, tracks);
};
</script>

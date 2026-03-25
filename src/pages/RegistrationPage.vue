<template>
  <template v-if="event">
    <h2 class="fpl__text-title">Registration</h2>
    <q-separator />
    <template v-if="event.is_open_for_registration">
      <h6>
        You can register for <span class="text-no-wrap">{{ event.name }}</span> using UGent's event manager, Evan, using
        the link below.<br /><br />
        <template v-if="isEarly">
          Early registration deadline:<br />
          <strong>{{ format(event.registration_early_deadline, 'PPPPpppp') }}.</strong>
        </template>
        <template v-else-if="isOnsite">
          On-site registration deadline:<br />
          <strong>{{ format(event.registration_onsite_deadline, 'PPPPpppp') }}.</strong>
        </template>
        <template v-else>
          Registration deadline:<br /><strong>{{ format(event.registration_deadline, 'PPPPpppp') }}.</strong>
        </template>
      </h6>
      <div class="q-mb-lg">
        <fpl-btn
          :icon="iconRegistration"
          label="Register now via UGent"
          type="a"
          :href="event.registration_url"
          target="_blank"
          rel="noopener noreferrer"
          class="fpl__bg-green"
          :class="{ 'full-width': $q.screen.lt.sm }"
        />
      </div>
    </template>
    <h6 v-else>
      Registrations for <span class="text-no-wrap">{{ event.name }}</span> are not open at this time.
    </h6>
    <marked-div v-if="registrationText" :text="registrationText" class="q-mt-md q-mb-lg" />
    <template v-if="registrationDates.length">
      <fpl-subtitle>Key dates</fpl-subtitle>
      <q-list separator class="text-body2 q-mb-lg">
        <q-item
          v-for="(date, idx) in registrationDates"
          :key="idx"
          :class="{ 'text-grey-8': passedImportantDate(date) }"
        >
          <q-item-section :class="{ 'text-decoration-line-through': passedImportantDate(date) }">
            <q-item-label>{{ date.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label
              :class="passedImportantDate(date) ? 'text-grey-8' : 'text-fpl-blue'"
              class="text-weight-medium"
            >
              {{ format(date.start_date, "d MMM yyyy '·' HH:mm (O)") }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
    <fpl-subtitle>Registration fees</fpl-subtitle>
    <template v-if="event.fees.length">
      <q-markup-table flat>
        <thead>
          <tr class="text-weight-bold">
            <th class="text-left">Fee</th>
            <th>{{ currentFeeColumn === 'early' ? 'Early bird *' : 'Early bird' }}</th>
            <th>{{ currentFeeColumn === 'regular' ? 'Regular *' : 'Regular' }}</th>
            <th v-if="hasOnsiteFees">{{ currentFeeColumn === 'onsite' ? 'On-site *' : 'On-site' }}</th>
            <th>Social events</th>
          </tr>
        </thead>
        <tbody class="text-body1">
          <tr v-for="fee in event.fees" :key="fee.type">
            <td>{{ fee.notes }}</td>
            <td class="text-center">{{ fee.early_value != null ? `€ ${fee.early_value}` : '—' }}</td>
            <td class="text-center">€ {{ fee.value }}</td>
            <td v-if="hasOnsiteFees" class="text-center">
              {{ fee.onsite_value != null ? `€ ${fee.onsite_value}` : '—' }}
            </td>
            <td class="text-center">
              <q-chip
                v-if="socialEvents.length > 0 && fee.config.included_social_events.length == socialEvents.length"
                label="All included"
                class="fpl__bg-blue text-white text-caption q-mb-xs"
              />
              <q-chip
                v-else-if="fee.config.included_social_events.length > 0"
                outline
                label="Some included"
                color="dark"
                class="text-caption q-mb-xs"
              />
              <q-chip v-else label="Not included" class="bg-orange-2 text-caption q-mb-xs" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <p class="text-caption text-right q-my-md">
        <template v-if="currentFeeColumn">* Currently applicable fees. </template>All fees are inclusive of VAT.
      </p>
    </template>
    <p v-else class="text-grey">Registration fees information is not yet available.</p>
    <template v-if="socialEvents.length > 0">
      <fpl-subtitle class="q-mt-xl">Social events</fpl-subtitle>
      <p>
        Not all registrations give you access to all social events. Check the following list to see which social events
        are included in your registration. You can always purchase additional tickets for social events (for you or for
        <strong>your guests</strong>) during the registration process.
      </p>
      <q-list separator>
        <q-item v-for="session in socialEvents" :key="session.id" class="q-py-md">
          <q-item-section>
            <q-item-label>{{ session.title }} on {{ format(session.start_at, 'PPPP') }}</q-item-label>
            <q-item-label>
              <p class="text-body2">
                <strong>Extra ticket price:</strong> € {{ session.extra_attendees_fee }}<br />
                <strong>This social event is included in:</strong>
              </p>
              <ul class="text-body2">
                <template v-for="fee in event.fees" :key="fee.type">
                  <li v-if="fee.config.included_social_events.includes(session.id)">{{ fee.notes }}</li>
                </template>
              </ul>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted, toRefs } from 'vue';
import { useMeta } from 'quasar';

import { useEventStore } from '@evan/stores/event';
import { format, passedImportantDate } from '@evan/utils/dates';

import { iconRegistration } from '@/icons';

const eventStore = useEventStore();

const { event, contentsDict } = toRefs(eventStore);

// Load program data when component mounts
onMounted(async () => {
  if (!eventStore.programDataLoaded) {
    await eventStore.fetchProgramData();
  }
});

const isEarly = computed<boolean>(() => {
  return !!event.value?.registration_early_deadline && new Date() < new Date(event.value.registration_early_deadline);
});
const registrationText = computed<MarkdownText | null>(() => contentsDict.value['registration']?.value || null);
const isOnsite = computed<boolean>(() => {
  return !!event.value?.registration_onsite_deadline && new Date() < new Date(event.value.registration_onsite_deadline);
});
const hasOnsiteFees = computed<boolean>(() => {
  return event.value?.fees.some((fee) => fee.onsite_value != null) ?? false;
});
const currentFeeColumn = computed<'early' | 'regular' | 'onsite' | null>(() => {
  if (!event.value?.is_open_for_registration) return null;
  if (isEarly.value) return 'early';
  if (isOnsite.value) return 'onsite';
  return 'regular';
});
const registrationDates = computed<ImportantDate[]>(() => {
  if (!event.value) return [];
  const dates: ImportantDate[] = [];
  if (event.value.registration_start_date) {
    dates.push({
      label: 'Registration opens',
      format: 'date',
      start_date: event.value.registration_start_date,
      end_date: null,
      aoe: false,
    });
  }
  if (event.value.registration_early_deadline) {
    dates.push({
      label: 'Early bird deadline',
      format: 'date',
      start_date: event.value.registration_early_deadline,
      end_date: null,
      aoe: false,
    });
  }
  if (event.value.registration_deadline) {
    dates.push({
      label: 'Registration deadline',
      format: 'date',
      start_date: event.value.registration_deadline,
      end_date: null,
      aoe: false,
    });
  }
  if (event.value.registration_onsite_deadline) {
    dates.push({
      label: 'On-site registration deadline',
      format: 'date',
      start_date: event.value.registration_onsite_deadline,
      end_date: null,
      aoe: false,
    });
  }
  return dates;
});
const socialEvents = computed<EvanSession[]>(() => {
  // First try event.sessions, then fall back to store sessions
  const sessions = event.value?.sessions || eventStore.sessions;
  if (!sessions || sessions.length === 0) {
    return [];
  }

  const socialSessions = sessions.filter((session) => session.is_social_event);

  return socialSessions;
});

useMeta(() => {
  return {
    title: 'Registration',
  };
});
</script>

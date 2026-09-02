<template>
  <div v-for="(committee, idx) in committees" :key="idx" :class="spacing === 'mb' ? 'q-mb-xl' : 'q-mt-xl'">
    <h4 class="fpl__text-subtitle3">{{ committee.name }}</h4>

    <q-list v-if="variant === 'full'">
      <q-item v-for="(member, idx) in committee.members" :key="idx">
        <q-item-section avatar>
          <q-icon :name="iconPerson" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ member.first_name }} {{ member.last_name }}</q-item-label>
          <q-item-label v-if="member.affiliation" class="text-grey-8 text-body2">{{ member.affiliation }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="member.email" side>
          <a :href="`mailto:${member.email}`"><q-icon :name="iconEmail" /></a>
        </q-item-section>
      </q-item>
    </q-list>
    <ul v-else>
      <li v-for="(member, idx) in committee.members" :key="idx">
        {{ member.first_name }} {{ member.last_name
        }}<span v-if="member.affiliation" class="text-grey-8 text-body2">, {{ member.affiliation }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { iconEmail, iconPerson } from '@/icons';

withDefaults(
  defineProps<{
    committees: Committee[];
    variant?: 'full' | 'list';
    spacing?: 'mt' | 'mb';
  }>(),
  {
    variant: 'full',
    spacing: 'mt',
  },
);
</script>

<template>
  <q-layout v-show="_loaded" view="hHh lpr lfr" class="fpl__layout">
    <q-header v-if="$q.screen.lt.md" class="fpl__header bg-white text-dark">
      <q-toolbar class="fpl__toolbar container">
        <router-link :to="{ name: 'home' }">
          <img src="~assets/fpl-logo.svg" class="fpl__logo" />
        </router-link>
        <q-space />
        <fpl-btn :icon="iconProgram" label="Program" type="router-link" :to="{ name: 'program' }" class="q-ml-xl" />
        <!-- PWA Install Button -->
        <q-btn
          v-if="pwaInstall.isInstallable.value"
          flat
          round
          icon="get_app"
          aria-label="Install app"
          @click="pwaInstall.showInstallPrompt()"
          class="q-ml-sm"
        />
        <q-btn
          outline
          round
          v-show="$q.screen.lt.md"
          @click="leftDrawer = !leftDrawer"
          :icon="iconMenu"
          aria-label="Open navigation menu"
          :aria-expanded="leftDrawer"
          class="q-mx-sm"
        />
      </q-toolbar>
      <q-separator />
    </q-header>

    <!-- Left drawer for mobile only -->
    <q-drawer v-model="leftDrawer" :width="280" side="left" class="fpl__drawer" overlay :breakpoint="960">
      <q-toolbar class="fpl__toolbar">
        <div class="q-pl-sm q-pt-sm"><img src="~assets/fpl-logo.svg" class="fpl__logo-footer q-ml-xs" /></div>
        <q-space />
        <q-btn
          outline
          round
          @click="leftDrawer = !leftDrawer"
          :icon="iconClose"
          aria-label="Close navigation menu"
          class="q-mr-sm"
        />
      </q-toolbar>
      <div class="q-pa-lg">
        <sidebar-menu :menu="menu" :submenu="submenu" show-logo @item-click="leftDrawer = false" />
      </div>
    </q-drawer>

    <q-page-container :class="$q.screen.gt.sm ? 'fpl__bg-color q-pt-lg' : 'bg-white'">
      <q-page>
        <div class="container" :class="{ 'fpl__desktop-layout': $q.screen.gt.sm }">
          <div class="row q-pb-xl" :class="{ 'q-col-gutter-x-xl': $q.screen.gt.sm }">
            <!-- Left sidebar for desktop -->
            <div v-if="$q.screen.gt.sm" class="col-3 fpl__sidebar-fixed">
              <div class="q-pa-lg bg-fpl-cyan">
                <sidebar-menu :menu="menu" :submenu="submenu" show-logo />
              </div>
            </div>

            <!-- Main content -->
            <div class="col bg-white q-py-xl">
              <div :class="$q.screen.gt.sm ? 'q-pr-xl' : ''">
                <router-view />
              </div>
            </div>
          </div>
        </div>

        <div class="fpl__bg-color text-white q-pt-lg q-pb-xl">
          <div class="container">
            <div class="row q-col-gutter-xl justify-between">
              <div class="col-12 col-sm-12 col-md offset-md-3">
                <div class="q-gutter-x-lg flex items-center">
                  <router-link :to="{ name: 'home' }" class="q-pt-xs">
                    <img src="~assets/fpl-logo.svg" class="fpl__logo-footer" />
                  </router-link>
                  <a
                    :href="submissionsUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="EasyChair"
                    aria-label="EasyChair"
                  >
                    <q-icon :name="iconEasyChair" size="sm" color="fpl-green" />
                  </a>
                </div>
                <p class="text-body1 q-mt-lg">{{ footerText }}</p>
                <p class="text-caption">
                  <strong>&copy; 2025 Ghent University</strong><br />
                  <span
                    >The images on this web site are reproduced with the permission of the copyright owner,
                    <a href="https://stad.gent/en" target="_blank" rel="noopener noreferrer">Stad Gent</a>.</span
                  >
                </p>
              </div>
              <div class="col-12 col-md-3 offset-md-1" :class="{ 'q-mt-lg': $q.screen.lt.sm }">
                <span class="text-caption">Organised by</span>
                <div class="row q-col-gutter-md fpl__footer-organizers q-my-md">
                  <div class="col">
                    <a href="https://www.ugent.be/en" target="_blank" rel="noopener noreferrer">
                      <ugent-logo color="#0f0" />
                    </a>
                  </div>
                  <div class="col">
                    <a href="https://fpl.org/" target="_blank" rel="noopener noreferrer">
                      <fpl-logo color="#0f0" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';

import { usePWAInstall } from '@evan/composables/usePWAInstall';
import { useEventStore } from '@evan/stores/event';
import { dateRange } from '@evan/utils/dates';

import FplLogo from '@/components/logos/FplLogo.vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import UgentLogo from '@/components/logos/UgentLogo.vue';

import {
  iconAccommodation,
  iconClose,
  iconCommittees,
  iconEasyChair,
  iconHome,
  iconMenu,
  iconProgram,
  iconRegister,
  iconSend,
  iconVenue,
} from '@/icons';

interface MenuItem {
  route: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
  closed?: boolean;
}

const eventStore = useEventStore();
const pwaInstall = usePWAInstall();

const { _loaded, event, contentsDict } = toRefs(eventStore);

const leftDrawer = ref<boolean>(false);
const menu: MenuItem[] = [
  { route: 'home', label: 'Home', icon: iconHome },
  {
    route: 'callForPapers',
    label: 'Calls',
    icon: iconSend,
    children: [
      { route: 'callForPapers', label: 'Call for Papers' },
      { route: 'callForWorkshops', label: 'Call for Workshops & Tutorials' },
    ],
  },
  // { route: 'program', label: 'Program', icon: iconProgram },
  {
    route: 'organizingCommittee',
    label: 'Committees',
    icon: iconCommittees,
    children: [
      { route: 'organizingCommittee', label: 'Organizing Committee' },
      { route: 'programCommittee', label: 'Program Committee' },
      { route: 'steeringCommittee', label: 'Steering Committee' },
    ],
  },
  { route: 'venue', label: 'Venue and location', icon: iconVenue },
  { route: 'accommodation', label: 'Accommodation', icon: iconAccommodation },
];
const submenu: MenuItem[] = [
  { route: 'registration', label: 'Registration', icon: iconRegister },
  { route: 'contact', label: 'Contact' },
  { route: 'privacyPolicy', label: 'Privacy Policy' },
  { route: 'disclaimer', label: 'Disclaimer' },
];

const footerText = computed<string>(() => {
  if (!event.value) return '';
  const dates = dateRange(event.value.start_date, event.value.end_date);
  return `The ${event.value.full_name} (${event.value.name}), will be held ${dates} in ${event.value.city}, ${event.value.country.name}.`;
});

const submissionsUrl = computed<Url | null>(() => contentsDict.value['calls.call_for_papers.url']?.value || null);
</script>

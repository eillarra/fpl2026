<template>
  <router-link v-if="showLogo" :to="{ name: 'home' }" class="q-mb-lg block">
    <img src="~assets/fpl-logo.svg" class="fpl__logo" />
  </router-link>
  <q-list dense class="fpl__sidebar-list">
    <template v-for="(item, idx) in menu" :key="idx">
      <q-item clickable :to="{ name: item.route }" exact @click="$emit('item-click')">
        <q-item-section avatar top>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>
          <span :class="{ 'text-weight-bold': isItemActive(item) }">{{ item.label }}</span>
          <ul v-if="item.children" class="q-pl-none fpl__router-link-menu">
            <li v-for="(child, idx) in item.children" :key="idx" class="text-wrap-balance">
              <router-link
                :to="{ name: child.route }"
                class="inherit"
                active-class="text-mono-bold"
                @click="$emit('item-click')"
                >{{ child.label }}</router-link
              >
            </li>
          </ul>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
  <div class="q-my-xl"></div>
  <div class="fpl__router-link-menu flex column">
    <router-link
      v-for="(item, idx) in submenu"
      :key="idx"
      :to="{ name: item.route }"
      exact
      active-class="text-mono-bold"
      @click="$emit('item-click')"
      >{{ item.label }}</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

interface MenuItem {
  route: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
  closed?: boolean;
}

interface Props {
  menu: MenuItem[];
  submenu: MenuItem[];
  showLogo?: boolean;
}

withDefaults(defineProps<Props>(), {
  showLogo: false,
});

defineEmits<{
  'item-click': [];
}>();

function isItemActive(item: MenuItem): boolean {
  if (route.name === item.route) {
    return true;
  }

  if (item.children) {
    return item.children.some((child) => route.name === child.route);
  }

  return false;
}
</script>

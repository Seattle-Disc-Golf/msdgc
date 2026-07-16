<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-blue-600 text-white px-4 py-3 flex items-center justify-between gap-4">
      <div class="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
        <a href="/" class="text-white/70 hover:text-white text-sm whitespace-nowrap mr-2">← Site</a>
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="text-sm whitespace-nowrap px-3 py-1 rounded-md transition-colors"
          :class="$route.path === item.to
            ? 'bg-white/20 text-white font-semibold'
            : 'text-white/70 hover:text-white hover:bg-white/10'"
        >
          {{ item.label }}
        </RouterLink>
      </div>
      <button @click="logout" class="text-sm text-white/70 hover:text-white whitespace-nowrap shrink-0">
        Sign out
      </button>
    </header>
    <slot />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const nav = [
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/monday-dubs', label: 'Monday League' },
  { to: '/admin/sponsors', label: 'Sponsors' },
  { to: '/admin/board-members', label: 'Board Members' },
  { to: '/admin/board-minutes', label: 'Board Minutes' },
];

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  router.push('/admin/login');
}
</script>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const router = useRouter();
const events = ref([]);
const loading = ref(true);
const saving = ref(false);
const message = ref('');
const messageType = ref('success');

const editingEvent = ref(null);
const showForm = ref(false);

const blank = () => ({
  _filename: null,
  _sha: null,
  title: '',
  symbol: '📅',
  date_field: '',
  start_time: '',
  end_time: '',
  description: '',
  link_field: '',
});

const form = ref(blank());

async function loadEvents() {
  loading.value = true;
  try {
    const res = await fetch('/api/events');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    events.value = data.events || [];
  } catch {
    showMessage('Failed to load events', 'error');
  } finally {
    loading.value = false;
  }
}

function showMessage(msg, type = 'success') {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => { message.value = ''; }, 5000);
}

function openCreate() {
  form.value = blank();
  editingEvent.value = null;
  showForm.value = true;
}

function openEdit(ev) {
  form.value = { ...ev };
  editingEvent.value = ev._filename;
  showForm.value = true;
}

function cancelForm() {
  showForm.value = false;
  editingEvent.value = null;
}

async function saveEvent() {
  saving.value = true;
  try {
    let res;
    if (editingEvent.value) {
      res = await fetch(`/api/events/${editingEvent.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });
    } else {
      res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });
    }
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    if (res.ok) {
      showMessage('Saved! Site will rebuild in ~1 minute.');
      showForm.value = false;
      await loadEvents();
    } else {
      showMessage(data.error || 'Save failed', 'error');
    }
  } catch {
    showMessage('Network error', 'error');
  } finally {
    saving.value = false;
  }
}

async function deleteEvent(ev) {
  if (!confirm(`Delete "${ev.title}"?`)) return;
  try {
    const res = await fetch(`/api/events/${ev._filename}`, { method: 'DELETE' });
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    if (res.ok) {
      showMessage('Deleted! Site will rebuild in ~1 minute.');
      await loadEvents();
    } else {
      showMessage(data.error || 'Delete failed', 'error');
    }
  } catch {
    showMessage('Network error', 'error');
  }
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

onMounted(loadEvents);
</script>

<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Flash message -->
      <div v-if="message" :class="['rounded-lg px-4 py-3 mb-6 text-sm font-medium',
          messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200'
                                   : 'bg-green-50 text-green-700 border border-green-200']">
        {{ message }}
      </div>

      <!-- Event form -->
      <div v-if="showForm" class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-bold mb-4 bangers text-2xl">{{ editingEvent ? 'Edit Event' : 'New Event' }}</h2>
        <form @submit.prevent="saveEvent" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input v-model="form.title" required type="text" placeholder="2026 Bag Tag Kickoff"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input v-model="form.date_field" required type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Symbol / Emoji</label>
            <input v-model="form.symbol" type="text" placeholder="📅"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input v-model="form.start_time" type="time"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input v-model="form.end_time" type="time"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Registration / Info Link (Zeffy, etc.)</label>
            <input v-model="form.link_field" type="url" placeholder="https://www.zeffy.com/..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" rows="3" placeholder="Short description of the event"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div class="md:col-span-2 flex gap-3">
            <button type="submit" :disabled="saving"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold bangers text-lg transition-colors disabled:opacity-50">
              {{ saving ? 'Saving…' : 'Save Event' }}
            </button>
            <button type="button" @click="cancelForm"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Events list -->
      <div class="bg-white rounded-xl shadow">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-xl font-bold bangers">Upcoming Events</h2>
          <button v-if="!showForm" @click="openCreate"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold bangers text-lg transition-colors">
            + New Event
          </button>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="events.length === 0" class="text-gray-500 text-center py-12">
          No upcoming events. Click "+ New Event" to add one.
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div v-for="ev in events" :key="ev._filename"
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ ev.symbol }}</span>
                <span class="font-semibold text-gray-800">{{ ev.title }}</span>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ formatDate(ev.date_field) }}
                <span v-if="ev.start_time"> · {{ ev.start_time }}<span v-if="ev.end_time"> – {{ ev.end_time }}</span></span>
                <span v-if="ev.link_field" class="ml-2">
                  <a :href="ev.link_field" target="_blank" class="text-blue-500 hover:underline text-xs">Link ↗</a>
                </span>
              </div>
            </div>
            <div class="flex gap-2 ml-4 shrink-0">
              <button @click="openEdit(ev)"
                class="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded font-medium transition-colors">
                Edit
              </button>
              <button @click="deleteEvent(ev)"
                class="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded font-medium transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

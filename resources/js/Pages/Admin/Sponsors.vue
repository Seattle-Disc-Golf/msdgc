<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const router = useRouter();
const sponsors = ref([]);
const loading = ref(true);
const saving = ref(false);
const message = ref('');
const messageType = ref('success');
const showForm = ref(false);
const editingId = ref(null);

const blank = () => ({
  _filename: null,
  title: '',
  web_site: '',
  logo_url: '',
  logo_background: '',
  city_state: '',
  is_pro_shop: false,
  north_of_msdgc: false,
  udisc_link: '',
  driving_directions: '',
  nearby: '',
});
const form = ref(blank());

function showMessage(msg, type = 'success') {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => { message.value = ''; }, 5000);
}

async function load() {
  loading.value = true;
  try {
    const res = await fetch('/api/sponsors');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    sponsors.value = data.sponsors || [];
  } catch {
    showMessage('Failed to load sponsors', 'error');
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  form.value = blank();
  editingId.value = null;
  showForm.value = true;
}

function openEdit(s) {
  form.value = {
    ...s,
    logo_url: Array.isArray(s.logo) ? s.logo[0] || '' : s.logo || '',
  };
  editingId.value = s._filename;
  showForm.value = true;
}

function cancelForm() {
  showForm.value = false;
  editingId.value = null;
}

async function save() {
  saving.value = true;
  try {
    let res;
    if (editingId.value) {
      res = await fetch(`/api/sponsors/${editingId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });
    } else {
      res = await fetch('/api/sponsors', {
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
      await load();
    } else {
      showMessage(data.error || 'Save failed', 'error');
    }
  } catch {
    showMessage('Network error', 'error');
  } finally {
    saving.value = false;
  }
}

async function deleteSponsor(s) {
  if (!confirm(`Delete "${s.title}"?`)) return;
  try {
    const res = await fetch(`/api/sponsors/${s._filename}`, { method: 'DELETE' });
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    if (res.ok) {
      showMessage('Deleted! Site will rebuild in ~1 minute.');
      await load();
    } else {
      showMessage(data.error || 'Delete failed', 'error');
    }
  } catch {
    showMessage('Network error', 'error');
  }
}

onMounted(load);
</script>

<template>
  <AdminLayout>
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div v-if="message" :class="['rounded-lg px-4 py-3 mb-6 text-sm font-medium',
          messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200'
                                   : 'bg-green-50 text-green-700 border border-green-200']">
        {{ message }}
      </div>

      <!-- Form -->
      <div v-if="showForm" class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-2xl font-bold bangers mb-4">{{ editingId ? 'Edit Sponsor' : 'New Sponsor' }}</h2>
        <form @submit.prevent="save" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input v-model="form.title" required type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input v-model="form.web_site" type="url" placeholder="https://example.com"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City / State</label>
            <input v-model="form.city_state" type="text" placeholder="Seattle, WA"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL or filename</label>
            <input v-model="form.logo_url" type="text" placeholder="https://... or filename.png"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p class="text-xs text-gray-400 mt-1">Full URL (https://...) or existing filename from /assets/</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Logo Background Color</label>
            <input v-model="form.logo_background" type="text" placeholder="#ffffff or transparent"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">UDisc Link</label>
            <input v-model="form.udisc_link" type="url" placeholder="https://udisc.com/stores/..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driving Directions URL</label>
            <input v-model="form.driving_directions" type="url" placeholder="https://maps.google.com/..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div class="flex flex-col gap-2 mt-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.is_pro_shop" type="checkbox" class="rounded" />
                <span class="text-sm">Disc golf shop (shown at top of page)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.north_of_msdgc" type="checkbox" class="rounded" />
                <span class="text-sm">North of Mineral Springs</span>
              </label>
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description / Nearby info</label>
            <textarea v-model="form.nearby" rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div class="md:col-span-2 flex gap-3">
            <button type="submit" :disabled="saving"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold bangers text-lg transition-colors disabled:opacity-50">
              {{ saving ? 'Saving…' : 'Save Sponsor' }}
            </button>
            <button type="button" @click="cancelForm"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div class="bg-white rounded-xl shadow">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-xl font-bold bangers">Sponsors</h2>
          <button v-if="!showForm" @click="openCreate"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold bangers text-lg transition-colors">
            + New Sponsor
          </button>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="sponsors.length === 0" class="text-gray-500 text-center py-12">
          No sponsors yet.
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div v-for="s in sponsors" :key="s._filename"
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div class="flex items-center gap-3 min-w-0">
              <img v-if="s.logo && s.logo[0]" :src="s.logo[0]" :alt="s.title"
                class="w-10 h-10 object-contain rounded border border-gray-100 shrink-0" />
              <div v-else class="w-10 h-10 bg-gray-100 rounded shrink-0"></div>
              <div class="min-w-0">
                <div class="font-semibold text-gray-800 truncate">{{ s.title }}</div>
                <div class="text-xs text-gray-400 truncate">
                  {{ s.is_pro_shop ? '⛳ Disc Golf Shop' : '🏪 Local Business' }}
                  <span v-if="s.city_state"> · {{ s.city_state }}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 shrink-0 ml-4">
              <button @click="openEdit(s)"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50">
                Edit
              </button>
              <button @click="deleteSponsor(s)"
                class="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

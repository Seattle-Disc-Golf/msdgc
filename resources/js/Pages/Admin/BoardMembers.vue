<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const router = useRouter();
const members = ref([]);
const loading = ref(true);
const saving = ref(false);
const message = ref('');
const messageType = ref('success');
const showForm = ref(false);
const editingId = ref(null);

const blank = () => ({
  title: '',
  club_title: '',
  rolesInput: '',
  order: '',
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
    const res = await fetch('/api/board-members');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    members.value = data.members || [];
  } catch {
    showMessage('Failed to load board members', 'error');
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  form.value = blank();
  editingId.value = null;
  showForm.value = true;
}

function openEdit(m) {
  form.value = {
    ...m,
    rolesInput: Array.isArray(m.roles) ? m.roles.join(', ') : m.roles || '',
    order: m.order || '',
  };
  editingId.value = m._filename;
  showForm.value = true;
}

function cancelForm() {
  showForm.value = false;
  editingId.value = null;
}

function rolesArray() {
  return form.value.rolesInput
    .split(',')
    .map(r => r.trim())
    .filter(Boolean);
}

async function save() {
  saving.value = true;
  const payload = {
    title: form.value.title,
    club_title: form.value.club_title,
    roles: rolesArray(),
    order: form.value.order,
  };
  try {
    let res;
    if (editingId.value) {
      res = await fetch(`/api/board-members/${editingId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch('/api/board-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

async function deleteMember(m) {
  if (!confirm(`Remove "${m.title}" from the board?`)) return;
  try {
    const res = await fetch(`/api/board-members/${m._filename}`, { method: 'DELETE' });
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
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="message" :class="['rounded-lg px-4 py-3 mb-6 text-sm font-medium',
          messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200'
                                   : 'bg-green-50 text-green-700 border border-green-200']">
        {{ message }}
      </div>

      <!-- Form -->
      <div v-if="showForm" class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-2xl font-bold bangers mb-4">{{ editingId ? 'Edit Board Member' : 'New Board Member' }}</h2>
        <form @submit.prevent="save" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input v-model="form.title" required type="text" placeholder="Jane Smith"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title / Position</label>
            <input v-model="form.club_title" type="text" placeholder="Director, President, etc."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Roles</label>
            <input v-model="form.rolesInput" type="text" placeholder="Bag Tags, Raffle, Events"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p class="text-xs text-gray-400 mt-1">Comma-separated list of responsibilities</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input v-model="form.order" type="number" placeholder="1, 2, 3…"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="md:col-span-2 flex gap-3">
            <button type="submit" :disabled="saving"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold bangers text-lg transition-colors disabled:opacity-50">
              {{ saving ? 'Saving…' : 'Save' }}
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
          <h2 class="text-xl font-bold bangers">Board Members</h2>
          <button v-if="!showForm" @click="openCreate"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold bangers text-lg transition-colors">
            + Add Member
          </button>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="members.length === 0" class="text-gray-500 text-center py-12">
          No board members yet.
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div v-for="m in members" :key="m._filename"
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div>
              <div class="font-semibold text-gray-800">{{ m.title }}</div>
              <div class="text-sm text-gray-500">
                <span v-if="m.club_title">{{ m.club_title }}</span>
                <span v-if="m.club_title && m.roles?.length"> · </span>
                <span v-if="m.roles?.length" class="text-xs">{{ Array.isArray(m.roles) ? m.roles.join(', ') : m.roles }}</span>
              </div>
            </div>
            <div class="flex gap-2 shrink-0 ml-4">
              <button @click="openEdit(m)"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50">
                Edit
              </button>
              <button @click="deleteMember(m)"
                class="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

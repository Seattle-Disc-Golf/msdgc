<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const message = ref('');
const messageType = ref('success');

const form = ref({ header1: '', body: '' });

function showMessage(msg, type = 'success') {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => { message.value = ''; }, 5000);
}

async function load() {
  loading.value = true;
  try {
    const res = await fetch('/api/monday-dubs');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    form.value.header1 = data.header1 || '';
    form.value.body = data.body || '';
  } catch {
    showMessage('Failed to load content', 'error');
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  try {
    const res = await fetch('/api/monday-dubs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    if (res.ok) {
      showMessage('Saved! Site will rebuild in ~1 minute.');
    } else {
      showMessage(data.error || 'Save failed', 'error');
    }
  } catch {
    showMessage('Network error', 'error');
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <AdminLayout>
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div v-if="message" :class="['rounded-lg px-4 py-3 mb-6 text-sm font-medium',
          messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200'
                                   : 'bg-green-50 text-green-700 border border-green-200']">
        {{ message }}
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>

      <div v-else class="bg-white rounded-xl shadow p-6">
        <h2 class="text-2xl font-bold bangers mb-6">Monday Putting League</h2>
        <form @submit.prevent="save" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input v-model="form.header1" type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Content
              <span class="font-normal text-gray-400 ml-1">— supports markdown and HTML</span>
            </label>
            <textarea v-model="form.body" rows="24" spellcheck="false"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"></textarea>
          </div>
          <div class="flex gap-3">
            <button type="submit" :disabled="saving"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold bangers text-lg transition-colors disabled:opacity-50">
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
            <a href="/#monday_dubs" target="_blank"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center">
              Preview on site ↗
            </a>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

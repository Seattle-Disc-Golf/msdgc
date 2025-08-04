<script setup>
import { ref, computed, onMounted } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import FormSection from '@/Components/FormSection.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import SelectInput from '@/Components/SelectInput.vue';
import InputError from '@/Components/InputError.vue';
import ActionMessage from '@/Components/ActionMessage.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TagSelector from '@/Components/TagSelector.vue';

const props = defineProps({
    users: Array,
    availableTags: Array,
    recentMessages: Array
});

const form = useForm({
    subject: '',
    message: '',
    recipients: 'all',
    selectedTags: [],
});

const messageType = ref('new');
const selectedTemplate = ref('');
const emailTemplates = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('/api/collections/email_templates');
        if (response.ok) {
            emailTemplates.value = await response.json();
        } else {
            console.error('Failed to fetch email templates');
        }
    } catch (error) {
        console.error('Error fetching email templates:', error);
    }
});

const recipientStats = computed(() => {
    let filteredUsers = props.users;

    if (form.recipients === 'tags' && form.selectedTags.length > 0) {
        filteredUsers = props.users.filter(user =>
            user.tags && form.selectedTags.some(tag => user.tags.includes(tag))
        );
    }

    const emailUsers = filteredUsers.filter(user => user.email_opt_in && user.email);
    const smsUsers = filteredUsers.filter(user => user.sms_opt_in && user.sms && user.provider);

    return {
        total: filteredUsers.length,
        email: emailUsers.length,
        sms: smsUsers.length,
        both: filteredUsers.filter(user =>
            (user.email_opt_in && user.email) &&
            (user.sms_opt_in && user.sms && user.provider)
        ).length
    };
});

const submit = () => {
    form.post(route('messages.send'), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
        }
    });
};

const openInNewWindow = () => {
    // if (selectedTemplate?.content_html) {
    // debugger
    console.log(selectedTemplate.value.content_html);
    window.open(selectedTemplate.value.content_html, '_blank');
    // }
}
</script>

<template>
    <AppLayout title="Send Messages">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Send Messages
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                    <FormSection @submitted="submit">
                        <template #title>
                            <div class="p-6">
                                Send Message to Users
                            </div>
                        </template>

                        <template #description>
                            <div class="">

                                <div class=" p-6 " :class="[messageType !== 'new' ? '' : 'bg-blue-50']">
                                    <label class="inline-flex items-center">
                                        <input type="radio" class="form-radio text-indigo-600" value="new"
                                            v-model="messageType" />
                                        <span class="ml-2">New Message</span>
                                    </label>
                                </div>

                                <div class="p-6" :class="[messageType !== 'template' ? '' : 'bg-blue-50']">

                                    <label class="inline-flex items-center">
                                        <input type="radio" class="form-radio text-indigo-600" value="template"
                                            v-model="messageType" />
                                        <span class="ml-2">From Template</span>
                                    </label>



                                    <div class="mt-4 " :class="[messageType !== 'template'
                                        ? 'opacity-50 pointer-events-none'
                                        : '']">
                                        <InputLabel for="template" value="Select Template" />
                                        <select id="template" v-model="selectedTemplate"
                                            class="mt-1 block w-full bg-gray-100 p-2 border border-gray-300 rounded-md shadow-sm"
                                            :disabled="messageType !== 'template'"
                                            :class="{ 'bg-gray-100 cursor-not-allowed': messageType !== 'template' }">
                                            <option value="">Select a template</option>
                                            <option v-for="template in emailTemplates.items" :key="template.id"
                                                :value="template">
                                                {{ template.title }}
                                            </option>
                                        </select>
                                    </div>
                                </div>



                            </div>
                        </template>

                        <template #form>
                            <!-- Subject -->
                            <div class="col-span-6 sm:col-span-4">
                                <InputLabel for="subject" value="Subject (Email Only)" />
                                <TextInput id="subject" v-model="form.subject" type="text" class="mt-1 block w-full"
                                    placeholder="Enter email subject" />
                                <InputError :message="form.errors.subject" class="mt-2" />
                            </div>

                            <!-- Message -->
                            <div v-if='messageType === "new"' class="col-span-6">
                                <InputLabel for="message" value="Message" />
                                <textarea id="message" v-model="form.message" rows="6"
                                    class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    placeholder="Enter your message here..."></textarea>
                                <InputError :message="form.errors.message" class="mt-2" />
                            </div>
                            <div v-if='messageType === "template"' class="col-span-6">
                                <InputLabel for="template-content" value="Template Content" />
                                <!-- Debug info -->
                                <div v-if="selectedTemplate"
                                    class="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                    <strong>Debug:</strong>
                                    Template: {{ selectedTemplate.title || 'No title' }}<br>
                                    Has content_html: {{ !!selectedTemplate.content_html }}<br>
                                    Content length: {{ selectedTemplate.content_html?.length || 0 }}
                                </div>
                                <div>
                                    <div v-if="selectedTemplate && selectedTemplate.content_html">
                                        <!-- <iframe
                                            class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm min-h-[400px] max-h-[600px] bg-white overflow-auto p-4"
                                            :srcdoc="selectedTemplate.content_html">
                                        </iframe> -->
                                        <button type="button"
                                            class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                            @click="openInNewWindow" :disabled="!selectedTemplate?.content_html">
                                            Open in New Window
                                        </button>
                                    </div>
                                </div>

                            </div> <!-- Recipient Selection -->
                            <div class="col-span-6 sm:col-span-4">
                                <InputLabel for="recipients" value="Send To" />
                                <SelectInput id="recipients" v-model="form.recipients" class="mt-1 block w-full">
                                    <option value="all">All Users</option>
                                    <option value="tags">Users with Specific Tags</option>
                                </SelectInput>
                                <InputError :message="form.errors.recipients" class="mt-2" />
                            </div>

                            <!-- Tag Selection -->
                            <div v-if="form.recipients === 'tags'" class="col-span-6">
                                <InputLabel for="tags" value="Select Tags" />
                                <TagSelector v-model="form.selectedTags" :available-tags="availableTags"
                                    placeholder="Select tags to filter recipients" />
                                <InputError :message="form.errors.selectedTags" class="mt-2" />
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Users who have any of the selected tags will receive the message.
                                </p>
                            </div>

                            <!-- Recipient Statistics -->
                            <div class="col-span-6">
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Message
                                        Recipients</h4>
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div class="text-center">
                                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {{ recipientStats.total }}
                                            </div>
                                            <div class="text-gray-600 dark:text-gray-400">Total Users</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {{ recipientStats.email }}
                                            </div>
                                            <div class="text-gray-600 dark:text-gray-400">Email Recipients</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {{ recipientStats.sms }}
                                            </div>
                                            <div class="text-gray-600 dark:text-gray-400">SMS Recipients</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                {{ recipientStats.both }}
                                            </div>
                                            <div class="text-gray-600 dark:text-gray-400">Both Email & SMS</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template #actions>
                            <ActionMessage :on="form.recentlySuccessful" class="me-3">
                                Messages sent successfully!
                            </ActionMessage>

                            <PrimaryButton :class="{ 'opacity-25': form.processing }"
                                :disabled="form.processing || recipientStats.total === 0">
                                <span v-if="form.processing">Sending...</span>
                                <span v-else>Send Messages</span>
                            </PrimaryButton>
                        </template>
                    </FormSection>
                </div>

                <!-- Recent Messages History -->
                <div v-if="recentMessages.length > 0"
                    class="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Recent Messages
                        </h3>
                        <div class="space-y-4">
                            <div v-for="message in recentMessages" :key="message.id"
                                class="border-l-4 border-blue-400 pl-4 py-3 bg-gray-50 dark:bg-gray-700">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <h4 class="font-medium text-gray-900 dark:text-gray-100">
                                            {{ message.subject }}
                                        </h4>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {{ message.message.length > 100 ? message.message.substring(0, 100) + '...'
                                                :
                                                message.message }}
                                        </p>
                                        <div class="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span>Sent by: {{ message.sender.name }}</span>
                                            <span>{{ new Date(message.created_at).toLocaleString() }}</span>
                                            <span>Recipients: {{ message.recipients_type === 'all' ? 'All Users' :
                                                'Tagged Users' }}</span>
                                        </div>
                                    </div>
                                    <div class="flex gap-4 text-xs ml-4">
                                        <div class="text-center">
                                            <div class="text-green-600 dark:text-green-400 font-bold">{{
                                                message.email_count }}
                                            </div>
                                            <div class="text-gray-500 dark:text-gray-400">Emails</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-purple-600 dark:text-purple-400 font-bold">{{
                                                message.sms_count }}
                                            </div>
                                            <div class="text-gray-500 dark:text-gray-400">SMS</div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="message.selected_tags && message.selected_tags.length > 0" class="mt-2">
                                    <div class="flex flex-wrap gap-1">
                                        <span class="text-xs text-gray-500 dark:text-gray-400">Tags:</span>
                                        <span v-for="tag in message.selected_tags" :key="tag"
                                            class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {{ tag }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

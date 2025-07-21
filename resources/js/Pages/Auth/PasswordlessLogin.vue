<template>
    <Head title="Sign In" />

    <AuthenticationCard>
        <template #logo>
            <AuthenticationCardLogo />
        </template>

        <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address or phone number and we'll send you a secure login link.
        </div>

        <div v-if="status" class="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
            {{ status }}
        </div>

        <!-- Show registration option when user not found -->
        <div v-if="form.errors.email && form.errors.email.includes('can\'t find a user')" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p class="text-sm text-blue-800 dark:text-blue-200 mb-3">
                It looks like you don't have an account yet. Would you like to create one?
            </p>
            <Link
                :href="route('register', { email: form.identifier })"
                class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
            >
                Create Account
            </Link>
        </div>

        <form @submit.prevent="submit">
            <div>
                <InputLabel for="type" value="Login Method" />
                <select
                    id="type"
                    v-model="form.type"
                    class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                    required
                >
                    <option value="email">Email</option>
                    <option value="sms">SMS/Text</option>
                </select>
                <InputError :message="form.errors.type" class="mt-2" />
            </div>

            <div class="mt-4">
                <InputLabel
                    for="identifier"
                    :value="form.type === 'email' ? 'Email Address' : 'Phone Number'"
                />
                <TextInput
                    id="identifier"
                    v-model="form.identifier"
                    :type="form.type === 'email' ? 'email' : 'tel'"
                    class="mt-1 block w-full"
                    :placeholder="form.type === 'email' ? 'you@example.com' : '+1 (555) 123-4567'"
                    required
                    autofocus
                />
                <InputError :message="form.errors.identifier" class="mt-2" />
            </div>

            <div class="flex items-center justify-between mt-4">
                <Link
                    :href="route('login')"
                    class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                    Back to traditional login
                </Link>

                <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    Send Login Link
                </PrimaryButton>
            </div>
        </form>
    </AuthenticationCard>
</template>

<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import { onMounted } from 'vue'
import AuthenticationCard from '@/Components/AuthenticationCard.vue'
import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.vue'
import InputError from '@/Components/InputError.vue'
import InputLabel from '@/Components/InputLabel.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import TextInput from '@/Components/TextInput.vue'

defineProps({
    status: {
        type: String,
        default: null,
    },
})

const form = useForm({
    type: 'email',
    identifier: '',
})

// Fill email from URL parameter if present
onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')

    if (emailParam && emailParam.includes('@')) {
        form.identifier = emailParam
        form.type = 'email'
    }
})

const submit = () => {
    form.post(route('passwordless.send-link'), {
        onFinish: () => form.reset('identifier'),
    })
}
</script>

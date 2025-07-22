<script setup>
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';

defineProps({
    canLogin: {
        type: Boolean,
        default: true
    },
});
</script>

<template>
    <Head title="Preferences" />

    <PublicLayout :canLogin="canLogin" :showHero="false">
        <div class="min-h-screen bg-gray-50 py-12">
            <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="bg-white shadow rounded-lg">
                    <!-- Header -->
                    <div class="px-6 py-8 border-b border-gray-200">
                        <h1 class="text-3xl font-bold text-gray-900">Preferences</h1>
                        <p class="mt-2 text-gray-600">Manage your account settings and preferences</p>
                    </div>

                    <!-- Sign In Required Content -->
                    <div class="px-6 py-12 text-center">
                        <div class="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>

                        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                            Sign In Required
                        </h2>

                        <p class="text-gray-600 mb-8 max-w-md mx-auto">
                            You need to be signed in to access your preferences and manage your account settings.
                        </p>

                        <div class="space-y-4">
                            <div>
                                Sign in to your account in the upper right corner to continue.
                            </div>

                            <div>
                                <Link
                                    :href="route('home')"
                                    class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                    </svg>
                                    Go Home
                                </Link>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                        <p class="text-sm text-gray-500">
                            Once signed in, you'll be able to manage your notification preferences,
                            update your profile, and customize your experience.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </PublicLayout>
</template>

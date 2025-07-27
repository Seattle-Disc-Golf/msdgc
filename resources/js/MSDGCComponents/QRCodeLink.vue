<template>
    <div :class="[
        'bg-white rounded-lg shadow-lg border-2 transition-transform duration-200',
        method.borderColor
    ]">
        <div :class="['block rounded-lg hover:shadow-xl transition-shadow duration-200']">
            <div :class="['p-6 rounded-t-lg', method.backgroundColor]" class="h-40">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <img v-if="method.logo" :src="method.logo" alt="Logo" class="h-8">
                        <h3 class="text-2xl font-bold text-gray-900">{{ method.name }}</h3>
                    </div>
                </div>
                <div v-if="method.username" class="flex items-center space-x-2">
                    <span class="font-medium text-gray-700">{{ method.text || 'Username:' }}</span>
                    <code class="bg-white px-2 py-1 rounded text-sm font-mono">{{ method.username }}</code>
                    <button @click.stop.prevent="copyToClipboard(method.username)"
                        class="text-blue-600 hover:text-blue-800 transition-colors" title="Copy to clipboard">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                            </path>
                        </svg>
                    </button>
                </div>
                <div v-if="method.description" class="mt-2 text-gray-600">
                    {{ method.description }}
                </div>
                <div v-else class="text-gray-600 mt-2">
                    &nbsp;
                </div>
            </div>
            <a class="cursor-pointer p-6" :href="method.url" target="_blank" rel="noopener noreferrer">
                <div class="flex flex-col items-center">
                    <div class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <div class="text-center text-gray-500">
                            <img :src="method.qrCodeUrl" alt="QR Code" class="w-full">
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, mergeProps } from 'vue';

const props = defineProps({
    method: {
        type: Object,
        required: true
    }
});

</script>

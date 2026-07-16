<template>
    <div :class="cardStyle" class="bg-zinc-800 text-white col-span-1">
        <p class="uppercase font-bold text-6xl bangers">{{ mondayDubsData?.item?.header1 || 'Monday Putting League' }}</p>
        <div class="monday-content" v-html="mondayDubsData?.item?.content_html || defaultContent"></div>
    </div>
</template>

<script setup>
const cardStyle = "flex flex-col items-start gap-6 overflow-hidden rounded-lg p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] text-black"
import { ref, onMounted } from 'vue'

const mondayDubsData = ref(null)
const defaultContent = '<p>6pm in the summer, earlier as it gets darker. Check the Facebook group for weekly updates.</p>'

onMounted(async () => {
    try {
        const response = await fetch('/api/collections/content/monday-dubs.json')
        if (response.ok) {
            mondayDubsData.value = await response.json()
        }
    } catch (error) {
        console.error('Failed to fetch Monday Dubs data:', error)
    }
})
</script>

<style scoped>
.monday-content :deep(h2) {
    font-family: 'Bangers', cursive;
    font-size: 2rem;
    text-transform: uppercase;
    color: #fca5a5;
    margin-top: 1rem;
}

.monday-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
}

.monday-content :deep(th) {
    text-align: left;
    padding: 0.4rem 0.5rem;
    border-bottom: 2px solid rgba(255,255,255,0.2);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    color: rgba(255,255,255,0.7);
}

.monday-content :deep(td) {
    padding: 0.35rem 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    vertical-align: top;
}

.monday-content :deep(.badge) {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    border-radius: 0.25rem;
    padding: 0 0.3rem;
    font-size: 0.7rem;
}

.monday-content :deep(.badge.special) {
    background: rgba(251, 191, 36, 0.3);
    color: #fcd34d;
}

.monday-content :deep(.badge.party) {
    background: rgba(52, 211, 153, 0.2);
}

.monday-content :deep(p) {
    margin-bottom: 0.5rem;
}

.monday-content :deep(strong) {
    color: #f9a8d4;
}
</style>

<template>
    <div v-if="upcoming_events.length > 0">

        <div class="bangers text-4xl font-bold text-black dark:text-white p-4">
            Upcoming Events
        </div>

        <!-- <h2 class="text-4xl font-bold text-center mb-6 bangers text-gray-800">Disc golf Sponsors</h2> -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            <a v-for="event in upcoming_events.sort((a, b) => new Date(a.date_field) - new Date(b.date_field))"
                :key="event.id" :class="cardStyle"
                class="flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative"
                :href="event.web_site" target="_blank" rel="noopener noreferrer">
                <div class="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
                    <div class="flex items-center justify-between">
                        <div class="bg-white rounded-lg h-10 w-10 text-center flex items-center justify-center ">
                            <div class="text-3xl font-bold">{{ event.symbol }}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold">
                                {{ dayjs(event.date_field).format('dddd') }} {{ formatEventDate(event.date_field) }}
                            </div>
                            <div class="text-md" v-if="event.start_time || event.end_time">
                                {{ formatTime(event.start_time) }}{{ event.end_time ? ' - ' + formatTime(event.end_time)
                                    : '' }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Event Content -->
                <div class="p-6 flex-grow">
                    <a :href="event.link_field" target="_blank" rel="noopener noreferrer">
                        <h3 class="text-3xl font-semibold mb-3 line-clamp-2 bangers"
                            :class="event.link_field ? 'text-blue-600 underline' : 'text-zinc-700'">
                            {{ event.title }}
                        </h3>
                    </a>

                    <div class="space-y-2 mb-4">
                        <div v-if="event.location" class="flex items-center text-gray-600">
                            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clip-rule="evenodd"></path>
                            </svg>
                            <span class="text-sm">{{ event.location }}</span>
                        </div>
                    </div>

                    <p v-if="event.description" class="text-gray-700 text-sm line-clamp-3">
                        {{ event.description }}
                    </p>
                </div>

                <!-- Event Footer -->
                <div class="px-6 pb-4">
                    <div class="flex items-center justify-between">
                        <!-- <span class="text-blue-600 text-sm font-medium">View Details →</span> -->
                        <div class="relative">
                            <button @click.prevent.stop="toggleCalendarDropdown(event.id)"
                                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 flex items-center gap-1">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clip-rule="evenodd"></path>
                                </svg>
                                Add to Calendar
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </button>

                            <!-- Calendar dropdown positioned above -->
                            <div v-if="activeDropdown === event.id" @click.stop
                                class="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[150px] py-1">
                                <button @click.prevent.stop="addToGoogleCalendar(event)"
                                    class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                                    <span class="text-blue-600">📅</span>
                                    Google Calendar
                                </button>
                                <button @click.prevent.stop="addToAppleCalendar(event)"
                                    class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                                    <span class="text-gray-800">🍎</span>
                                    Apple Calendar
                                </button>
                                <button @click.prevent.stop="addToOutlookCalendar(event)"
                                    class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                                    <span class="text-blue-800">📧</span>
                                    Outlook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { ref, onMounted, onUnmounted } from 'vue'

dayjs.extend(utc)
dayjs.extend(timezone)

defineProps({
    upcoming_events: {
        type: Array,
        required: true,
        default: () => []
    }
});

const activeDropdown = ref(null)

function toggleCalendarDropdown(eventId) {
    activeDropdown.value = activeDropdown.value === eventId ? null : eventId
}

function closeDropdown() {
    activeDropdown.value = null
}

// Close dropdown when clicking outside
onMounted(() => {
    document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown)
})

function formatEventDate(dateStr) {
    return dayjs(dateStr).format('MMMM D, YYYY')
}

function formatTime(timeStr) {
    if (!timeStr) return ''

    // If it's already in a good format, just return it
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
        return timeStr
    }

    // Try to parse as time only (HH:mm or HH:mm:ss)
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
    if (timeMatch) {
        const [, hours, minutes] = timeMatch
        const hour24 = parseInt(hours)
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
        const ampm = hour24 < 12 ? 'AM' : 'PM'
        return `${hour12}:${minutes} ${ampm}`
    }

    // If all else fails, try dayjs parsing
    try {
        const parsed = dayjs(timeStr)
        if (parsed.isValid()) {
            return parsed.format('h:mm A')
        }
    } catch (e) {
        // Ignore parsing errors
    }

    // Return original if we can't parse it
    return timeStr
}

function getEventDateTime(event) {
    // Format the date and time for calendar
    const startDate = dayjs(event.date_field)

    // Parse start time if available
    let startDateTime = startDate
    if (event.start_time) {
        const timeMatch = event.start_time.match(/^(\d{1,2}):(\d{2})/)
        if (timeMatch) {
            const [, hours, minutes] = timeMatch
            startDateTime = startDate.hour(parseInt(hours)).minute(parseInt(minutes))
        }
    }

    // Parse end time if available, otherwise default to 2 hours later
    let endDateTime = startDateTime.add(2, 'hour')
    if (event.end_time) {
        const timeMatch = event.end_time.match(/^(\d{1,2}):(\d{2})/)
        if (timeMatch) {
            const [, hours, minutes] = timeMatch
            endDateTime = startDate.hour(parseInt(hours)).minute(parseInt(minutes))
        }
    }

    return { startDateTime, endDateTime }
}

function addToGoogleCalendar(event) {
    const { startDateTime, endDateTime } = getEventDateTime(event)

    const startISO = startDateTime.format('YYYYMMDDTHHmmss')
    const endISO = endDateTime.format('YYYYMMDDTHHmmss')

    const calendarData = {
        text: event.title,
        dates: `${startISO}/${endISO}`,
        details: event.description || '',
        location: event.location || '',
        sf: true,
        output: 'xml'
    }

    const params = new URLSearchParams(calendarData)
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`

    window.open(calendarUrl, '_blank')
    closeDropdown()
}

function addToAppleCalendar(event) {
    const { startDateTime, endDateTime } = getEventDateTime(event)

    // Create ICS content for Apple Calendar
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MSDGC//Event//EN
BEGIN:VEVENT
UID:${event.id}-${Date.now()}@msdgc.com
DTSTART:${startDateTime.utc().format('YYYYMMDDTHHmmss')}Z
DTEND:${endDateTime.utc().format('YYYYMMDDTHHmmss')}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
END:VEVENT
END:VCALENDAR`

    // Create and download ICS file
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    closeDropdown()
}

function addToOutlookCalendar(event) {
    const { startDateTime, endDateTime } = getEventDateTime(event)

    const calendarData = {
        subject: event.title,
        startdt: startDateTime.toISOString(),
        enddt: endDateTime.toISOString(),
        body: event.description || '',
        location: event.location || ''
    }

    const params = new URLSearchParams(calendarData)
    const calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`

    window.open(calendarUrl, '_blank')
    closeDropdown()
}

const cardStyle = "hover:border border-blue-500 duration-200"
</script>

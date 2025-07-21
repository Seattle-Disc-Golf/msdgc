<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3';

defineProps({
    title: {
        type: String,
        default: 'MSDGC'
    },
    canLogin: {
        type: Boolean,
        default: true
    },
    canRegister: {
        type: Boolean,
        default: true
    },
    showHero: {
        type: Boolean,
        default: false
    },
    heroTitle: {
        type: String,
        default: 'Mineral Springs Disc Golf Club'
    },
    heroSubtitle: {
        type: String,
        default: 'A Public Benefit Non-Profit Association'
    },
    heroBackground: {
        type: String,
        default: '/images/north_park_hole_1.jpg'
    },
    showNavigation: {
        type: Boolean,
        default: true
    },
    appDebug: {
        type: Boolean,
        default: false
    },
});

const navStyle = "text-md py-1 md:py-0 hover:underline rounded-md transition-colors duration-200";
const headerStyle = "flex items-center justify-center"

function navigateToSection(sectionId) {
    // Check if we're on the home page
    if (window.location.pathname === '/') {
        // Already on home page, just scroll to section
        scrollToSection(sectionId);
    } else {
        // Navigate to home page first, then scroll to section
        router.visit('/', {
            onSuccess: () => {
                // Wait a bit for the page to load, then scroll to section
                setTimeout(() => {
                    scrollToSection(sectionId);
                }, 100);
            }
        });
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
</script>

<template>
    <div>

        <Head :title="title" />

        <!-- Public Header Navigation -->
        <header
            :class="['flex justify-between items-center text-white pr-4 px-4 py-4 lg:py-2 font-bold']"
            :style="appDebug
                ? 'background: repeating-linear-gradient(135deg, rgb(43 127 255)  0 20px, rgb(105 162 249) 20px 40px);'
                : 'background-color: #3477F4;'"
        >
            <Link href="/">
            <img src="/images/msdgc_logo.png" alt="MSDGC Logo" class="h-8 w-auto pr-4 self-start sm:self-center" />
            </Link>

            <nav v-if="canLogin" class="mx-3 flex justify-end">
                <a href="mailto:info@mineralspringsdgc.com"
                    class="flex items-center bg-white inset text-blue-500 rounded-sm px-3 mr-4 bangers text-lg">Contact
                    Us</a>

                <Link v-if="$page.props.auth?.user" :href="route('dashboard')" class="border border-white rounded-sm px-3 bangers bg-blue-500 hover:bg-blue-600">
                {{ $page.props.auth?.user?.name || 'Member Area' }} Profile
                </Link>

                <template v-else>
                    <Link :href="route('login')" :class="navStyle">
                    Log in
                    </Link>
                    <div class="mx-4">|</div>
                    <Link v-if="canRegister" :href="route('register')" :class="navStyle">
                    Register
                    </Link>
                </template>
            </nav>
        </header>

        <!-- Hero Section (conditional) -->
        <div v-if="showHero" class="bg-gray-100 dark:bg-zinc-900 ">
            <header :class="headerStyle"
                class="relative flex flex-col lg:flex-row items-center justify-between text-white"
                :style="`background: url('${heroBackground}') center center / cover no-repeat; opacity: 0.9;`">

                <div class="py-10 flex flex-row items-center justify-between text-shadow-lg m-0"
                    style="background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0));">
                    <img src="/images/msdgc_logo.png" alt="Needle"
                        class="hidden lg:flex max-h-30 w-auto relative mr-8 " />

                    <div>
                        <div class="club-name text-6xl font-bold text-white uppercase text-center">
                            {{ heroTitle }}
                        </div>
                        <div class="text-xl text-white/90 italic font-bold lg:font-normal text-center">
                            {{ heroSubtitle }}
                        </div>
                    </div>
                    <img src="/images/squatch_disc.png" alt="Squatch Disc" class="hidden lg:flex max-h-30 w-auto" />
                </div>
            </header>

            <header v-if="showNavigation" :class="headerStyle" class=" text-white pr-4 px-4 py-1 lg:py-1 font-bold"
                style="background-color: #3F8E28;">
                <nav
                    class="flex flex-col md:flex-row md:gap-6 lg:col-span-1 text-white justify-between items-center xl:items-center">
                    <a @click="navigateToSection('course')" class="cursor-pointer" :class="navStyle">Course Map</a>
                    <a href="https://calendar.google.com/calendar/u/0/embed?src=495b1ab477f0effe46de4b97a8ae37ab1229210525dba1f4b8a558828ae8387f@group.calendar.google.com&ctz=America/Los_Angeles"
                        :class="navStyle" target="_blank" rel="noopener">Calendar</a>
                    <Link :href="route('board')" class="" :class="navStyle">Board</Link>
                    <a @click="navigateToSection('lost-found')" class="cursor-pointer" :class="navStyle">Lost and Found</a>
                    <a @click="navigateToSection('membership')" class="cursor-pointer" :class="navStyle">Club Membership</a>
                    <Link :href="route('contact')" class="hidden xl:flex" :class="navStyle">Get Involved</Link>
                </nav>
            </header>
        </div>

        <!-- Page Content -->
        <main>
            <slot />

        </main>

        <footer class="py-16 text-sm text-white bg-sky-800">
            <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="font-bold mb-3">About</h3>
                    <p>
                        Mineral Springs Disc Golf Club is a public benefit non-profit association dedicated to promoting disc golf and community engagement.
                    </p>
                </div>
                <div>
                    <h3 class="font-bold mb-3">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a @click="navigateToSection('course')" class="hover:underline cursor-pointer">Course Map</a></li>
                        <li><a href="https://calendar.google.com/calendar/u/0/embed?src=495b1ab477f0effe46de4b97a8ae37ab1229210525dba1f4b8a558828ae8387f@group.calendar.google.com&ctz=America/Los_Angeles" target="_blank" rel="noopener" class="hover:underline">Calendar</a></li>
                        <li><Link :href="route('board')" class="hover:underline">Board</Link></li>
                        <li><a @click="navigateToSection('lost-found')" class="hover:underline cursor-pointer">Lost and Found</a></li>
                        <li><a @click="navigateToSection('membership')" class="hover:underline cursor-pointer">Club Membership</a></li>
                        <li><Link :href="route('contact')" class="hover:underline">Get Involved</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold mb-3">Contact</h3>
                    <p>Email: <a href="mailto:info@mineralspringsdgc.com" class="hover:underline">info@mineralspringsdgc.com</a></p>
                    <p class="mt-2">&copy; {{ new Date().getFullYear() }} Mineral Springs Disc Golf Club. All rights reserved.</p>
                </div>
            </div>
        </footer>
        </div>
</template>

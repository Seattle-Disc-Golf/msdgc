<script setup>
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import ApplicationMark from '@/Components/ApplicationMark.vue';
import Banner from '@/Components/Banner.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import NavLink from '@/Components/NavLink.vue';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink.vue';

defineProps({
    title: String,
});

const showingNavigationDropdown = ref(false);

const switchToTeam = (team) => {
    router.put(route('current-team.update'), {
        team_id: team.id,
    }, {
        preserveState: false,
    });
};

const logout = () => {
    // Force a full page navigation to logout, which will reload after redirect
    window.location.replace(route('logout.get'));
};
</script>

<template>
    <div>

        <Head :title="title" />

        <Banner />

        <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <!-- Profile Teams Menu -->
                <div
                    class="hidden sm:flex sm:items-center sm:justify-end sm:flex-1 max-w-7xl mx-auto w-full flex justify-end">
                    <!-- <div class="max-w-7xl mx-auto w-full flex justify-end"> -->
                    <div class="ms-3 relative">
                        <!-- Teams Dropdown (Admin Only) -->
                        <Dropdown v-if="$page.props.jetstream.hasTeamFeatures && $page.props.auth.user.is_admin"
                            align="right" width="60">
                            <template #trigger>
                                <span class="inline-flex rounded-md">
                                    <button type="button"
                                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition ease-in-out duration-150">
                                        {{ $page.props.auth.user.current_team.name }}

                                        <svg class="ms-2 -me-0.5 size-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                        </svg>
                                    </button>
                                </span>
                            </template>

                            <template #content>
                                <div class="w-60">
                                    <!-- Team Management -->
                                    <div class="block px-4 py-2 text-xs text-gray-400">
                                        Manage Team
                                    </div>

                                    <!-- Team Settings -->
                                    <DropdownLink v-if="$page.props.auth.user.current_team"
                                        :href="route('teams.show', $page.props.auth.user.current_team.id)">
                                        Team Settings
                                    </DropdownLink>

                                    <DropdownLink v-if="$page.props.jetstream.canCreateTeams"
                                        :href="route('teams.create')">
                                        Create New Team
                                    </DropdownLink> <!-- Team Switcher -->
                                    <template
                                        v-if="$page.props.auth.user.all_teams.length > 1 || $page.props.auth.user.is_admin">
                                        <div class="border-t border-gray-200 dark:border-gray-600" />

                                        <div class="block px-4 py-2 text-xs text-gray-400">
                                            Switch Teams
                                        </div>

                                        <template v-for="team in $page.props.auth.user.all_teams" :key="team.id">
                                            <form @submit.prevent="switchToTeam(team)">
                                                <DropdownLink as="button">
                                                    <div class="flex items-center">
                                                        <svg v-if="team.id == $page.props.auth.user.current_team_id"
                                                            class="me-2 size-5 text-green-400"
                                                            xmlns="http://www.w3.org/2000/svg" fill="none"
                                                            viewBox="0 0 24 24" stroke-width="1.5"
                                                            stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>

                                                        <div>{{ team.name }}</div>
                                                    </div>
                                                </DropdownLink>
                                            </form>
                                        </template>
                                    </template>
                                </div>
                            </template>
                        </Dropdown>
                    </div>

                    <!-- Settings Dropdown -->
                    <div class="ms-3 relative">
                        <Dropdown align="right" width="48">
                            <template #trigger>
                                <button v-if="$page.props.jetstream.managesProfilePhotos"
                                    class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                                    <img class="size-8 rounded-full object-cover"
                                        :src="$page.props.auth.user.profile_photo_url"
                                        :alt="$page.props.auth.user.first_name">
                                </button>

                                <span v-else class="inline-flex rounded-md">
                                    <button type="button"
                                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition ease-in-out duration-150">
                                        {{ $page.props.auth.user.first_name }} {{ $page.props.auth.user.last_name }}

                                        <svg class="ms-2 -me-0.5 size-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>
                                </span>
                            </template>

                            <template #content>
                                <!-- Account Management -->
                                <div class="block px-4 py-2 text-xs text-gray-400">
                                    Manage Account
                                </div>

                                <DropdownLink :href="route('profile.show')">
                                    Profile
                                </DropdownLink>

                                <!-- <DropdownLink v-if="$page.props.jetstream.hasApiFeatures"
                                            :href="route('api-tokens.index')">
                                            API Tokens
                                        </DropdownLink> -->

                                <div class="border-t border-gray-200 dark:border-gray-600" />

                                <!-- Authentication -->
                                <DropdownLink as="button" @click="logout">
                                    Log Out
                                </DropdownLink>
                            </template>
                        </Dropdown>
                    </div>
                </div>

                <!-- Primary Navigation Menu -->

                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex">
                            <!-- Logo -->
                            <div class="shrink-0 flex items-center">
                                <Link :href="route('dashboard')">
                                <!-- <ApplicationMark class="block h-9 w-auto" /> -->
                                <img src="/images/msdgc_logo.png" alt="MSDGC Logo" class="h-12 w-auto ms-2" />
                                </Link>
                            </div>

                            <!-- Navigation Links -->
                            <div class="hidden space-x-4 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink :href="route('home')" :active="route().current('home')" custom>
                                    <span class="inline-flex items-center">
                                        <svg class="me-1 size-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"
                                                fill="none" />
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M12 16l-4-4m0 0l4-4m-4 4h8" />
                                        </svg>
                                        Back to Website
                                    </span>
                                </NavLink>
                                <NavLink :href="route('dashboard')" :active="route().current('dashboard')" custom>
                                    <span class="inline-flex items-center">
                                        <svg class="me-1 size-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor"
                                                stroke-width="2" fill="none" />
                                            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor"
                                                stroke-width="2" fill="none" />
                                            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor"
                                                stroke-width="2" fill="none" />
                                            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor"
                                                stroke-width="2" fill="none" />
                                        </svg>
                                    </span>
                                    {{ $page.props.auth?.user?.first_name || '' }}'s Dashboard
                                </NavLink>
                                <template v-if="$page.props.auth.user.is_admin">
                                    <NavLink :href="route('members')" :active="route().current('members')" custom>
                                        <span class="inline-flex items-center">
                                            <svg class="me-1 size-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M7 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V21h8.5M17 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V21h14v-1.5c0-2.33-4.67-3.5-7-3.5z" />
                                            </svg>
                                        </span>
                                        Members
                                    </NavLink>

                                    <NavLink :href="route('messages.index')" :active="route().current('messages.*')"
                                        custom>
                                        <svg class="me-1 size-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor"
                                                stroke-width="2" fill="none" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5l9 7 9-7" />
                                        </svg>
                                        Send Messages
                                    </NavLink>

                                    <NavLink :href="route('events.index')" :active="route().current('events.*')" custom>
                                        <span class="inline-flex items-center">
                                            <svg class="me-1 size-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                                <rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor"
                                                    stroke-width="2" fill="none" />
                                                <circle cx="7" cy="12" r="1.5" stroke="currentColor" stroke-width="2"
                                                    fill="none" />
                                                <circle cx="17" cy="12" r="1.5" stroke="currentColor" stroke-width="2"
                                                    fill="none" />
                                            </svg>
                                        </span>
                                        Events
                                    </NavLink>


                                    <a class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-100  hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700  hover:border-b-2 transition duration-150 ease-in-out whitespace-nowrap"
                                        href="/cp">
                                          <span class="inline-flex items-center">
                                            <svg class="me-1 size-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M16.862 3.487a2.25 2.25 0 113.182 3.182l-9.75 9.75a2.25 2.25 0 01-.878.547l-4.5 1.5a.75.75 0 01-.948-.948l1.5-4.5a2.25 2.25 0 01.547-.878l9.75-9.75z" />
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M19.5 19.5h-15" />
                                            </svg>
                                        </span>
                                        Website Editor</a>
                                </template>
                            </div>
                        </div>



                        <!-- Hamburger -->
                        <div class="-me-2 flex items-center sm:hidden">
                            <button
                                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                                @click="showingNavigationDropdown = !showingNavigationDropdown">
                                <svg class="size-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        :class="{ 'hidden': showingNavigationDropdown, 'inline-flex': !showingNavigationDropdown }"
                                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6h16M4 12h16M4 18h16" />
                                    <path
                                        :class="{ 'hidden': !showingNavigationDropdown, 'inline-flex': showingNavigationDropdown }"
                                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Responsive Navigation Menu -->
                <div :class="{ 'block': showingNavigationDropdown, 'hidden': !showingNavigationDropdown }"
                    class="sm:hidden">
                    <div class="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink :href="route('dashboard')" :active="route().current('dashboard')">
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink :href="route('members')" :active="route().current('members')">
                            Members
                        </ResponsiveNavLink>
                        <ResponsiveNavLink :href="route('messages.index')" :active="route().current('messages.*')">
                            Send Messages
                        </ResponsiveNavLink>
                        <ResponsiveNavLink :href="route('events.index')" :active="route().current('events.*')">
                            Events
                        </ResponsiveNavLink>
                    </div>

                    <!-- Responsive Settings Options -->
                    <div class="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div class="flex items-center px-4">
                            <div v-if="$page.props.jetstream.managesProfilePhotos" class="shrink-0 me-3">
                                <img class="size-10 rounded-full object-cover"
                                    :src="$page.props.auth.user.profile_photo_url"
                                    :alt="`${$page.props.auth.user.first_name} ${$page.props.auth.user.last_name}`">
                            </div>

                            <div>
                                <div class="font-medium text-base text-gray-800 dark:text-gray-200">
                                    {{ $page.props.auth.user.first_name }} {{ $page.props.auth.user.last_name }}
                                </div>
                                <div class="font-medium text-sm text-gray-500">
                                    {{ $page.props.auth.user.email }}
                                </div>
                            </div>
                        </div>

                        <div class="mt-3 space-y-1">
                            <ResponsiveNavLink :href="route('profile.show')" :active="route().current('profile.show')">
                                Profile
                            </ResponsiveNavLink>

                            <!-- <ResponsiveNavLink v-if="$page.props.jetstream.hasApiFeatures"
                                :href="route('api-tokens.index')" :active="route().current('api-tokens.index')">
                                API Tokens
                            </ResponsiveNavLink> -->

                            <!-- Authentication -->
                            <ResponsiveNavLink as="button" @click="logout">
                                Log Out
                            </ResponsiveNavLink>

                            <!-- Team Management (Admin Only) -->
                            <template v-if="$page.props.jetstream.hasTeamFeatures && $page.props.auth.user.is_admin">
                                <div class="border-t border-gray-200 dark:border-gray-600" />

                                <div class="block px-4 py-2 text-xs text-gray-400">
                                    Manage Team
                                </div>

                                <!-- Team Settings -->
                                <ResponsiveNavLink v-if="$page.props.auth.user.current_team"
                                    :href="route('teams.show', $page.props.auth.user.current_team.id)"
                                    :active="route().current('teams.show')">
                                    Team Settings
                                </ResponsiveNavLink>

                                <ResponsiveNavLink v-if="$page.props.jetstream.canCreateTeams"
                                    :href="route('teams.create')" :active="route().current('teams.create')">
                                    Create New Team
                                </ResponsiveNavLink>

                                <!-- Team Switcher -->
                                <template v-if="$page.props.auth.user.is_admin">
                                    <div class="border-t border-gray-200 dark:border-gray-600" />

                                    <div class="block px-4 py-2 text-xs text-gray-400">
                                        Switch Teams
                                    </div>

                                    <template v-for="team in $page.props.auth.user.all_teams" :key="team.id">
                                        <form @submit.prevent="switchToTeam(team)">
                                            <ResponsiveNavLink as="button">
                                                <div class="flex items-center">
                                                    <svg v-if="team.id == $page.props.auth.user.current_team_id"
                                                        class="me-2 size-5 text-green-400"
                                                        xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <div>{{ team.name }}</div>
                                                </div>
                                            </ResponsiveNavLink>
                                        </form>
                                    </template>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Page Heading -->
            <header v-if="$slots.header" class="bg-white dark:bg-gray-800 shadow">
                <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <slot name="header" />
                </div>
            </header>

            <!-- Page Content -->
            <main>
                <slot />
            </main>
        </div>
    </div>
</template>

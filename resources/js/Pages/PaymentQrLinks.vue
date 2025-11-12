<script setup>
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { ref, onMounted } from 'vue';
import QRCodeLink from '@/MSDGCComponents/QRCodeLink.vue';

const paymentMethods = ref([
    {
        id: 1,
        name: "Zeffy",
        url: "https://www.zeffy.com/en-US/ticketing/msdgc-sales",
        logo: '/images/logos/zeffy_logo.png',
        qrCodeUrl: '/images/qr/qr_zeffy.png', // Placeholder path
        backgroundColor: 'bg-teal-50',
        description: "PREFFERED. Optionally avoid credit card fees with Zeffy.",
    },

    {
        id: 3,
        name: 'PayPal',
        text: "",
        username: false,
        logo: '/images/logos/paypal_logo.png',
        url: 'https://www.paypal.com/ncp/payment/8VD3LCHZ22ZKU',
        qrCodeUrl: '/images/qr/qr_paypal.png', // Placeholder path
        backgroundColor: 'bg-blue-50',
        borderColor: 'border-blue-800',
        description: "Allows PayPal, Venmo or Credit/Debit Card payments."
    },
    {
        id: 2,
        name: 'Zelle',
        text: "Payee: ",
        username: 'MineralSpringsDGC@gmail.com',
        logo: '/images/logos/zelle_logo.png',
        url: 'https://enroll.zellepay.com',
        qrCodeUrl: '/images/qr/qr_zelle.png', // Placeholder path
        backgroundColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
    },
    {
        id: 4,
        name: 'Pay with Cash at the Course',
        username: false,
        qrCodeUrl: '/images/qr/qr_northparkhq.png', // Placeholder path
        backgroundColor: 'bg-green-50',
        borderColor: 'border-green-200'
    }
]);

const otherLinks = ref([
    {
        id: 1,
        name: 'Events Calendar',
        description: "Download our calendar of events!",
        username: false,
        url: 'https://calendar.google.com/calendar/u/0?cid=NDk1YjFhYjQ3N2YwZWZmZTQ2ZGU0Yjk3YThhZTM3YWIxMjI5MjEwNTI1ZGJhMWY0YjhhNTU4ODI4YWU4Mzg3ZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
        qrCodeUrl: '/images/qr/qr_calendar.png', // Placeholder path
        backgroundColor: 'bg-green-50',
        borderColor: 'border-green-200'
    },
    {
        id: 2,
        name: 'Mineral Springs Facebook Group',
        description: "Stay in touch by connecting through our Facebook group.",
        username: false,
        url: 'https://www.facebook.com/qr/1272376533381712',
        qrCodeUrl: '/images/qr/qr_facebook.jpg', // Placeholder path
        backgroundColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    {
        id: 2,
        name: 'Contact Us',
        description: "Send us a quick message by completing this contact form!",
        username: false,
        url: 'https://mineralspringsdgc.us10.list-manage.com/subscribe?u=cc069470e933d4fea8b1923f3&id=6306acdc04',
        qrCodeUrl: '/images/qr/qr_contact.png', // Placeholder path
        backgroundColor: 'bg-amber-50',
        borderColor: 'border-amber-200'
    }



]);

const loading = ref(false);
const error = ref(null);

onMounted(() => {
    // Future: Could fetch payment methods from API
    loading.value = false;
});

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        // Could add a toast notification here
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
};
</script>

<template>

    <Head title="Payment QR Links" />

    <PublicLayout :showHero="false">
        <div class="min-h-screen bg-gray-50 py-12">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="text-center mb-12">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">Payment Options</h1>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                        Multiple convenient ways to send payments to the Mineral Springs Disc Golf Club
                    </p>
                </div>

                <!-- Payment Methods Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <QRCodeLink v-for="method in paymentMethods" :key="method.id" :method="method" />
                </div>

                <!-- Other Links Header -->
                <div class="w-full bg-[#39a76e] rounded-lg p-12">
                    <div class="text-center mb-8">
                        <h2 class="text-5xl font-semibold text-gray-900 mb-2 bangers">Other Useful Links</h2>
                    </div>

                    <!-- Other Links Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <QRCodeLink v-for="method in otherLinks" :key="method.id" :method="method" />
                    </div>
                </div>


            </div>
        </div>
    </PublicLayout>
</template>

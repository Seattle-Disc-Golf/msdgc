import '../css/app.css';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Welcome from './Pages/Welcome.vue';
import Board from './Pages/Board.vue';
import BoardMinutes from './Pages/BoardMinutes.vue';
import Contact from './Pages/Contact.vue';
import PaymentQrLinks from './Pages/PaymentQrLinks.vue';
import AdminLogin from './Pages/Admin/Login.vue';
import AdminEvents from './Pages/Admin/Events.vue';
import AdminMondayDubs from './Pages/Admin/MondayDubs.vue';
import AdminSponsors from './Pages/Admin/Sponsors.vue';
import AdminBoardMembers from './Pages/Admin/BoardMembers.vue';
import AdminBoardMinutes from './Pages/Admin/BoardMinutes.vue';

const authGuard = async (_to, _from, next) => {
  try {
    const res = await fetch('/api/session');
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) return next();
    }
  } catch {}
  next('/admin/login');
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Welcome },
    { path: '/board', component: Board },
    { path: '/board/minutes/:id', component: BoardMinutes },
    { path: '/contact', component: Contact },
    { path: '/payment_qr_links', component: PaymentQrLinks },
    { path: '/admin/login', component: AdminLogin },
    { path: '/admin/events', component: AdminEvents, beforeEnter: authGuard },
    { path: '/admin/monday-dubs', component: AdminMondayDubs, beforeEnter: authGuard },
    { path: '/admin/sponsors', component: AdminSponsors, beforeEnter: authGuard },
    { path: '/admin/board-members', component: AdminBoardMembers, beforeEnter: authGuard },
    { path: '/admin/board-minutes', component: AdminBoardMinutes, beforeEnter: authGuard },
    { path: '/admin', redirect: '/admin/events' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise(resolve => {
        setTimeout(() => {
          const el = document.querySelector(to.hash);
          if (el) resolve({ el: to.hash, behavior: 'smooth' });
          else resolve({ top: 0 });
        }, 100);
      });
    }
    return { top: 0 };
  },
});

createApp(App).use(router).mount('#app');

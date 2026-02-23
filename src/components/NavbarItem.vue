<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import blogdayLogo from '@/assets/blogtime.png'

const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const isLoggedIn = ref(false)

function checkLoginStatus() {
  const session = localStorage.getItem('blogday.session')
  isLoggedIn.value = !!session
}

function logout() {
  localStorage.removeItem('blogday.session')
  checkLoginStatus()
  router.push('/login')
}

checkLoginStatus()

watch(() => route.path, checkLoginStatus)
</script>

<template>
  <nav class="sticky top-0 z-30 border-b border-white bg-white/80 backdrop-blur">
    <div
      class="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
    >
      <RouterLink to="/" class="flex items-center gap-3">
        <img :src="blogdayLogo" class="h-9 w-9 rounded-lg object-cover" alt="Blogday logo" />
        <span class="bg-black bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
          Blogday
        </span>
      </RouterLink>
      <button
        @click="menuOpen = !menuOpen"
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-800 md:hidden"
        aria-controls="main-nav"
        :aria-expanded="menuOpen"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <div id="main-nav" :class="['w-full md:block md:w-auto', menuOpen ? 'block' : 'hidden']">
        <ul
          class="mt-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-100/70 p-3 md:mt-0 md:flex-row md:items-center md:gap-3 md:border-0 md:bg-transparent md:p-0"
        >
          <li>
            <RouterLink
              to="/"
              class="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/other-posts"
              class="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Other Posts
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/about"
              class="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              About
            </RouterLink>
          </li>
          <li v-if="!isLoggedIn">
            <RouterLink
              to="/login"
              class="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Login
            </RouterLink>
          </li>
          <li v-if="!isLoggedIn">
            <RouterLink
              to="/register"
              class="block rounded-md bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:from-slate-800 hover:to-slate-900"
            >
              Register
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <button
              @click="logout"
              class="block w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>




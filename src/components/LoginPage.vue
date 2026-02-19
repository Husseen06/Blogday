<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const statusMessage = ref('')
const statusType = ref('info')
const isLoading = ref(false)

const USERS_STORAGE_KEY = 'blogday.users'
const SESSION_STORAGE_KEY = 'blogday.session'

function setStatus(message, type = 'info') {
  statusMessage.value = message
  statusType.value = type
}

function validateFields(requireName = false) {
  if (!email.value || !password.value) {
    setStatus('Email and password are required.', 'error')
    return false
  }
  if (password.value.length < 6) {
    setStatus('Password must be at least 6 characters.', 'error')
    return false
  }
  return true
}

async function login() {
  if (isLoading.value) {
    return
  }
  if (!validateFields(false)) {
    return
  }

  isLoading.value = true
  setStatus('')

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY)
    const users = rawUsers ? JSON.parse(rawUsers) : []

    const user = users.find((u) => u.email === email.value.trim())

    if (!user || user.password !== password.value) {
      setStatus('Invalid email or password.', 'error')
      isLoading.value = false
      return
    }

    // Create a "session" by storing user info in localStorage
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ email: user.email, firstName: user.firstName }),
    )

    setStatus('Login successful.', 'success')
    router.push('/')
  } catch (err) {
    setStatus('Login failed. Please try again.', 'error')
    console.error('Local login error:', err)
  }

  isLoading.value = false
}
</script>

<template>
  <section class="py-10 sm:py-14">
    <div class="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
      <div
        class="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-8 shadow-sm"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Authentication</p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back to Blogday
        </h1>
        <p class="mt-3 text-sm text-slate-600">
          Log in to your account to manage posts and grow your audience.
        </p>
        <div class="mt-6 space-y-3 text-sm text-slate-700">
          <p class="rounded-xl border border-cyan-100 bg-white/70 p-3">
            Keep your credentials secure and never share your password.
          </p>
        </div>
      </div>

      <div class="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm sm:p-8">
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-semibold text-slate-800">Login</h2>
          <p class="mt-1 text-sm text-slate-600">
            Don't have an account?
            <RouterLink to="/register" class="font-medium text-cyan-600 hover:underline"
              >Register</RouterLink
            >
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="login">
          <div>
            <label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              class="w-full rounded-xl border border-cyan-100 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="mb-1 block text-sm font-medium text-slate-700"
              >Password</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              class="w-full rounded-xl border border-cyan-100 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-cyan-700 hover:to-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isLoading ? 'Please wait...' : 'Login' }}
          </button>
        </form>

        <p
          v-if="statusMessage"
          :class="[
            'mt-4 rounded-xl border px-3 py-2 text-sm',
            statusType === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700',
          ]"
        >
          {{ statusMessage }}
        </p>
      </div>
    </div>
  </section>
</template>

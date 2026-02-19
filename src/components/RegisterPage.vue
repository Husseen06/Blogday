<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const firstName = ref('')
const statusMessage = ref('')
const statusType = ref('info')
const isLoading = ref(false)

const USERS_STORAGE_KEY = 'blogday.users'

function setStatus(message, type = 'info') {
  statusMessage.value = message
  statusType.value = type
}

function validateFields() {
  if (!email.value || !password.value) {
    setStatus('Email and password are required.', 'error')
    return false
  }
  if (!firstName.value.trim()) {
    setStatus('First name is required for registration.', 'error')
    return false
  }
  if (password.value.length < 6) {
    setStatus('Password must be at least 6 characters.', 'error')
    return false
  }
  return true
}

async function createAccount() {
  if (isLoading.value) {
    return
  }
  if (!validateFields()) {
    return
  }

  isLoading.value = true
  setStatus('')

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY)
    const users = rawUsers ? JSON.parse(rawUsers) : []

    if (users.some((user) => user.email === email.value.trim())) {
      setStatus('An account with this email already exists.', 'error')
      isLoading.value = false
      return
    }

    const newUser = {
      id: Date.now(), // Simple ID generation
      email: email.value.trim(),
      password: password.value, // In a real app, you should hash passwords
      firstName: firstName.value.trim(),
    }

    users.push(newUser)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

    setStatus('Account created successfully. Please log in.', 'success')
    // Redirect to login page after successful registration
    router.push('/login')
  } catch (err) {
    setStatus('Failed to create account. Please try again.', 'error')
    console.error('Local account creation error:', err)
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
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Get Started</p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Create your Blogday account
        </h1>
        <p class="mt-3 text-sm text-slate-600">
          Join our community to start sharing your stories and ideas with the world.
        </p>
        <div class="mt-6 space-y-3 text-sm text-slate-700">
          <p class="rounded-xl border border-cyan-100 bg-white/70 p-3">
            Keep your credentials secure and use a strong password.
          </p>
        </div>
      </div>

      <div class="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm sm:p-8">
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-semibold text-slate-800">Register</h2>
          <p class="mt-1 text-sm text-slate-600">
            Already have an account?
            <RouterLink to="/login" class="font-medium text-cyan-600 hover:underline"
              >Log in</RouterLink
            >
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="createAccount">
          <div class="space-y-4">
            <div>
              <label for="firstName" class="mb-1 block text-sm font-medium text-slate-700"
                >First name</label
              >
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                autocomplete="given-name"
                class="w-full rounded-xl border border-cyan-100 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                placeholder="Your first name"
              />
            </div>
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
                autocomplete="new-password"
                class="w-full rounded-xl border border-cyan-100 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-cyan-700 hover:to-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isLoading ? 'Please wait...' : 'Create account' }}
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

<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="py-16">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Access denied</p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900">Unauthorized</h1>
        <p class="mx-auto mt-3 max-w-xl text-sm text-slate-600">
          You do not have permission to access this page. Please log in with an authorized account.
        </p>
        <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <RouterLink
            to="/login"
            class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-cyan-700 hover:to-cyan-800"
          >
            Go to login
          </RouterLink>
          <RouterLink
            to="/register"
            class="inline-flex items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 px-5 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
          >
            Create account
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

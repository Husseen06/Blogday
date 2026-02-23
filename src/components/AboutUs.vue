<script setup>
import blogdayLogo from '@/assets/blogtime.png'
</script>

<template>
  <section class="py-14">
    <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
      <div class="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <img
          :src="blogdayLogo"
          alt="Blogday logo"
          class="mx-auto h-56 w-56 rounded-xl object-cover ring-4 ring-white"
        />
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <span
          class="border-b-2 border-slate-800 text-xs font-semibold uppercase tracking-[0.2em] text-slate-800"
        >
          About us
        </span>
        <h2 class="my-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          About <span class="text-slate-800">Our Company</span>
        </h2>
        <p class="text-slate-700">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, commodi doloremque,
          fugiat illum magni minus nisi nulla numquam obcaecati placeat quia, repellat tempore
          voluptatum.
        </p>
      </div>
    </div>
  </section>
</template>


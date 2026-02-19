<script setup>
import NavbarItem from '@/components/NavbarItem.vue'
import FooterItem from '@/components/FooterItem.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col text-slate-900">
    <NavbarItem />
    <main class="flex-1">
      <RouterView />
    </main>
    <FooterItem />
  </div>
</template>

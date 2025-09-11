<script setup>
import { ref } from 'vue'
import NavbarItem from '@/components/Navbar-item.vue'
import FooterItem from '@/components/Footer-item.vue'
import PostList from '@/components/PostList.vue'
import PostForm from '@/components/PostForm.vue'

const showAddPost = ref(false)
const posts = ref([])

function handleAddPost(post) {
  posts.value.push({ ...post })
  showAddPost.value = false
}
</script>

<template>
  <NavbarItem @show-add-post="showAddPost = true" />
  <PostForm v-if="showAddPost" @add="handleAddPost" />
  <PostList :posts="posts" />
  <FooterItem />
</template>

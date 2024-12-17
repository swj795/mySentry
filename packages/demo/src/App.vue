<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <router-link to="/">Home</router-link> |
  <router-link to="/about">about</router-link>
  <RouterView />
</template>

<style scoped></style>

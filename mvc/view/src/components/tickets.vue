<script setup>
import { ref } from 'vue';
import Navbar from "./nav_bar.vue";
</script>

<template>
  <Navbar/>
</template>

<style scoped lang="sass">
@use '../styles/_colors.sass' as *
@use '../styles/_navbar.sass' as *
:deep(.tickets_tab)
  color: $n_in_nxp
  text-decoration: underline
  text-underline-offset: 3px
  text-decoration-thickness: 3px
</style>
<template>
  <q-layout>
   
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
.bg-lightblue {
  background-color: #F0FFFF;
}
.text-Green {
  color: #5F9EA0;
}
</style>

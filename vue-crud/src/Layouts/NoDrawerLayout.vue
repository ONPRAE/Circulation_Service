<template>
  <q-layout>
    <q-header elevated class="bg-lightblue text-Green" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/kukps_logo.png">
          </q-avatar>
          KU-IT Circulation Service
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

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

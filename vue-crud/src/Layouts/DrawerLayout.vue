<template>
  <q-layout view="hHh lpR fFf">

    <!-- Header  -->
    <q-header elevated style="background-color: #F0FFFF;" height-hint="98">
      <q-toolbar>

        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" style="color: #5F9EA0;" />

        <q-toolbar-title style="color: #5F9EA0;">
          <q-avatar>
            <img src="src/assets/kukps_logo.png">
          </q-avatar>
          KU-IT Circulation Service
        </q-toolbar-title>

        <!-- เพิ่มโปรไฟล์และชื่อผู้ใช้ -->
        <div style="margin-left: auto; display: flex; align-items: center; color: #5F9EA0;">
          <q-item to="/profile" style="margin-left: 8px; cursor: pointer;">
            <q-item-section style="color: #5F9EA0; margin-bottom: -10px">ชื่อผู้ใช้</q-item-section>
            <!-- เปลี่ยนเป็นชื่อผู้ใช้ที่ต้องการ -->
          </q-item>
          <q-avatar>
            <img src="src/assets/profile-pic.jpg" alt="Profile Picture"> <!-- เปลี่ยนเป็นภาพโปรไฟล์ที่ต้องการ -->
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer สำหรับเมนูนำทางทางด้านซ้าย -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered style="background-color: #5F9EA0;">
      <q-list>
        <!-- หัวข้อ General -->
        <q-item>
          <q-item-section style="color: white; padding-left: 16px; margin-bottom: -25px;">General</q-item-section>
        </q-item>

        <!-- หน้า Home -->
        <q-item clickable v-ripple to="/home">
          <q-item-section style="color: white; padding-left: 4px;">Home</q-item-section>
        </q-item>

        <!-- หัวข้อ info -->
        <q-item>
          <q-item-section style="color: white; padding-left: 16px; margin-bottom: -15px;">ข้อมูลอุปกรณ์</q-item-section>
        </q-item>
        
        <!-- หมวดหมู่เพิ่มเติม -->
        <q-item-group>
          <q-item clickable v-ripple to="/borrowinfo">
          <q-item-section style="color: white; padding-left: 4px;">อุปกรณ์</q-item-section>
        </q-item>
          <q-item clickable v-ripple to="/borrowinfo">
          <q-item-section style="color: white; padding-left: 4px;">ข้อมูลการยืม</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/borrowinfo">
          <q-item-section style="color: white; padding-left: 4px;">ข้อมูลผู้ใช้</q-item-section>
        </q-item>
          <q-item clickable v-ripple to="/About">
            <q-item-section style="color: white; padding-left: 0px;">About</q-item-section>
          </q-item>
        </q-item-group>
      </q-list>
    </q-drawer>

    <!-- ส่วนนี้จะแสดงเนื้อหาของแต่ละหน้า -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'


const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<script>
export default {
  data() {
    return {
      leftDrawerOpen: true
    }
  }
}
</script>

<style>
.custom-drawer {
  width: 150px !important;
}
</style>

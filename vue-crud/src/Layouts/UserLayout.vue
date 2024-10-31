<template>
  <q-layout view="hHh lpR fFf">

    <!-- Drawer สำหรับเมนูนำทางทางด้านซ้าย -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered style="background-color: #ffffff; width: 250px;">
      <q-list>

        <!-- โลโก้และชื่อบริการด้านบนของ Drawer -->
        <div style="display: flex; flex-direction: column; align-items: center; padding: 24px 16px; color: #333;">
          <q-avatar square size="80px">
            <img src="src/assets/kukps_logo.png" alt="KU-IT Logo">
          </q-avatar>
          <div style="font-weight: bold; font-size: 1em; margin-top: 8px; text-align: center;">
            KU-IT<br />CIRCULATION SERVICE
          </div>
        </div>
               <!-- Profile Section -->
       <q-separator spaced />
        <div style="padding-left: 24px; font-weight: bold; color: black;">Profile</div>

        <!-- Profile link with dynamic user ID -->
        <q-item clickable v-ripple :to="`/profile/${userId}`" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="account_circle" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">ข้อมูลส่วนตัว</q-item-section>
        </q-item>

        <!-- กลุ่มหัวข้อข้อมูลการยืมอุปกรณ์ -->
        <q-separator spaced />
        
        <div style="padding-left: 24px; font-weight: bold; color: black;">ข้อมูลการยืมอุปกรณ์</div>

        <q-item clickable v-ripple to="/user" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="cloud" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">จองอุปกรณ์</q-item-section>
        </q-item>

        <!-- กลุ่มหัวข้อข้อมูลประวัติย้อนหลัง -->
        <q-separator spaced />

        <div style="padding-left: 24px; font-weight: bold; color: black;">ข้อมูลประวัติย้อนหลัง</div>

        <q-item clickable v-ripple to="/expired-history" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="schedule" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">ประวัติทั้งหมด</q-item-section>
        </q-item>


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
</script>

<style>
.custom-drawer {
  width: 250px !important;
}
</style>

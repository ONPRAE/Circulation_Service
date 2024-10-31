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

        <!-- ข้อมูลทั่วไป -->
        <q-separator spaced />
        <div style="padding-left: 24px; font-weight: bold; color: black;">ข้อมูลทั่วไป</div>
        <q-item clickable v-ripple to="/home" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="apps" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">หน้าแรก</q-item-section>
        </q-item>

        <!-- ข้อมูลพนักงาน -->
        <q-separator spaced />
        <div style="padding-left: 24px; font-weight: bold; color: black;">ข้อมูลผู้ใช้</div>
        <q-item clickable v-ripple to="/userinfo" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="person" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">จัดการข้อมูลผู้ใช้</q-item-section>
        </q-item>

        <!-- ข้อมูลอุปกรณ์ -->
        <q-separator spaced />
        <div style="padding-left: 24px; font-weight: bold; color: black;">ข้อมูลอุปกรณ์</div>
        <q-item clickable v-ripple to="/product" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="inventory" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">จัดการข้อมูลอุปกรณ์</q-item-section>
        </q-item>

        <!-- ข้อมูลการยืมอุปกรณ์ -->
        <q-separator spaced />
        <div style="padding-left: 24px; font-weight: bold; color: black;">ข้อมูลการยืมอุปกรณ์</div>
        <q-item clickable v-ripple to="/borrowinfo" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="cloud" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">ยืมอุปกรณ์</q-item-section>
        </q-item>

        <!-- ข้อมูลประวัติย้อนหลัง -->
        <q-separator spaced />
        <div style="padding-left: 24px; font-weight: bold; color: black;">ข้อมูลประวัติย้อนหลัง</div>
        <q-item clickable v-ripple to="/history" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="history" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">ประวัติทั้งหมด</q-item-section>
        </q-item>

        <!-- รายงาน -->
        <q-separator spaced />
        <div style="padding-left: 24px; font-weight: bold; color: black;">รายงาน</div>
        <q-item clickable v-ripple to="/prodreport" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="assignment" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">รายงานอุปกรณ์</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/borrow-return-report" style="padding-left: 16px;">
          <q-item-section avatar>
            <q-icon name="receipt" color="black"></q-icon>
          </q-item-section>
          <q-item-section style="color: black;">รายงานการยืม-คืน</q-item-section>
        </q-item>
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

            <!-- ปุ่ม Logout -->
    <div class="text-right q-mb-md">
          <q-btn 
            label="Logout" 
            color="red" 
            @click="logout" 
            dense
            style="width: 80px; padding-top: 4px; padding-bottom: 4px; padding-left: 12px; padding-right: 12px;"
          ></q-btn>
        </div>
      </q-list>
    </q-drawer>



    <!-- ส่วนนี้จะแสดงเนื้อหาของแต่ละหน้า -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const leftDrawerOpen = ref(false);

const logout = () => {
  fetch('http://localhost:8800/api/v1/logout', { method: 'POST' })
    .then((res) => {
      if (res.ok) {
        localStorage.removeItem('user'); // ลบข้อมูลผู้ใช้ที่เก็บไว้ใน LocalStorage
        router.push('/'); // เปลี่ยนเส้นทางไปยังหน้า Login
      } else {
        console.error('Failed to logout');
      }
    })
    .catch((error) => {
      console.error('Logout error:', error);
    });
};
</script>


<style>
.custom-drawer {
  width: 250px !important;
}
</style>

<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="background-color: #F0FFFF; width: 400px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6 text-center text-Green">Login to Your Account</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <q-input
            v-model="email"
            label="Email"
            filled
            clearable
            class="q-mb-md"
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            filled
            clearable
            class="q-mb-md"
          />

          <q-btn
            label="Login"
            type="submit"
            class="full-width q-mb-md"
            :style="{ backgroundColor: '#5F9EA0', color: 'white' }"
          />

          <q-btn
            label="Sign Up"
            flat
            color="primary"
            class="full-width"
            @click="goToSignUp"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
  async   onSubmit() {
  if (this.email && this.password) {
    try {
      // เรียก API สำหรับล็อกอิน
      const response = await axios.post('http://localhost:8800/api/v1/login', {
        email: this.email,
        password: this.password,
      });

      // ตรวจสอบสถานะการตอบกลับ
      if (response.status === 200) {
        const userRole = response.data.user.role; // สมมติว่าบทบาทอยู่ใน response.data.user.role

        // นำทางตามบทบาทของผู้ใช้
        if (userRole === 'Admin') {
          this.$router.push('/home');
        } else if (userRole === 'User') {
          this.$router.push('/user');
        }  else {
          alert('บทบาทไม่เป็นที่รู้จัก โปรดติดต่อผู้ดูแลระบบ');
        }
      } else {
        alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่');
      }
    } catch (error) {
      // จัดการข้อผิดพลาด เช่น รหัสผ่านไม่ถูกต้องหรือข้อผิดพลาดของเซิร์ฟเวอร์
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง');
      } else {
        alert('เกิดข้อผิดพลาดทางเครือข่าย กรุณาลองใหม่ภายหลัง');
      }
    }
  } else {
    alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
  }
}

,
  goToSignUp() {
    this.$router.push('/signup'); // พาผู้ใช้ไปที่หน้า signup
  },
},

};
</script>

<style scoped>
.full-width {
  width: 100%;
}
.text-Green {
  color: #5F9EA0;
}
</style>

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
  async onSubmit() {
    if (this.email && this.password) {
      try {
        // เรียก API login จาก Backend
        const response = await axios.post('http://localhost:8800/api/v1/login', {
          email: this.email,
          password: this.password,
        });

        // ตรวจสอบสถานะ login สำเร็จ
        if (response.status === 200) {
          const userRole = response.data.role; // assuming role is in response data
          
          if (userRole === 'Admin' || userRole === 'admin') {
  this.$router.push('/home');
} else if (userRole === 'User' || userRole === 'user') {
  this.$router.push('/about');
} else {
  alert('Unknown role. Please contact support.');
}

        }
      } catch (error) {
        // กรณีเกิดข้อผิดพลาด เช่นรหัสผ่านไม่ถูกต้อง
        if (error.response) {
          alert(error.response.data); // แจ้งเตือนผู้ใช้ถึงข้อผิดพลาดที่เกิดขึ้น
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    } else {
      alert('Please fill in all fields.');
    }
  },
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

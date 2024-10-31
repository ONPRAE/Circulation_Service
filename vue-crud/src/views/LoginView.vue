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

          <!-- Forgot Password link -->
          <q-btn
            label="Forgot Password?"
            flat
            color="primary"
            class="full-width text-caption q-mt-sm"
            @click="goToForgotPassword"
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
          // API call for login
          const response = await axios.post('http://localhost:8800/api/v1/login', {
            email: this.email,
            password: this.password,
          });

          if (response.status === 200) {
            const user = response.data.user;
            
            // Store user_id and user_role in Local Storage
            localStorage.setItem('user_id', user.user_id);
            localStorage.setItem('user_role', user.role);

            // Navigate based on user role
            if (user.role === 'Admin') {
              this.$router.push('/home');
            } else if (user.role === 'User') {
              this.$router.push('/user');
            } else {
              alert('Unknown role. Please contact the administrator.');
            }
          } else {
            alert('Login error, please try again.');
          }
        } catch (error) {
          if (error.response && error.response.data) {
            alert(error.response.data.message || 'Login failed, please check your details.');
          } else {
            alert('Network error, please try again later.');
          }
        }
      } else {
        alert('Please fill in all fields.');
      }
    },
    goToSignUp() {
      this.$router.push('/signup'); // Redirect to signup page
    },
    goToForgotPassword() {
      this.$router.push('/forgot'); // Redirect to forgot password page
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

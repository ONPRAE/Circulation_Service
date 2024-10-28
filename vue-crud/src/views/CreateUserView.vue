<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="background-color: #F0FFFF; width: 400px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6 text-center text-Green">Signup to Your Account</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <q-input
            v-model="first_name"
            label="First Name"
            filled
            clearable
            class="q-mb-md"
          />
          <q-input
            v-model="last_name"
            label="Last Name"
            filled
            clearable
            class="q-mb-md"
          />
          <q-input
            v-model="email"
            label="Email"
            filled
            clearable
            class="q-mb-md"
            type="email"
          />
          <q-input
            v-model="password"
            label="Password"
            filled
            clearable
            class="q-mb-md"
            type="password"
          />

          <q-btn
            label="Signup"
            type="submit"
            class="full-width q-mb-md"
            :style="{ backgroundColor: '#5F9EA0', color: 'white' }"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import router from '@/router';

const first_name = ref('');
const last_name = ref('');
const email = ref('');
const password = ref('');

const onSubmit = async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    password: password.value,
    role: 'User',
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch("http://localhost:8800/api/v1/users", requestOptions);
    const result = await response.json();

    // Check for successful response
    if (response.ok) {
      alert(result.message); // Show success message
      router.push('/'); // Redirect to login page after successful signup
    } else {
      alert(result.message || "An error occurred. Please try again."); // Show error message
    }
  } catch (error) {
    console.error('Error during signup:', error);
    alert('An error occurred. Please try again later.'); // Generic error message
  }
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

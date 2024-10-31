<template>
    <q-page class="flex flex-center">
      <q-card class="q-pa-md" style="background-color: #F0FFFF; width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6 text-center text-Green">Reset Your Password</div>
        </q-card-section>
  
        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <q-input
              v-model="email"
              label="Email"
              filled
              clearable
              class="q-mb-md"
              type="email"
              required
            />
            <q-input
              v-model="newPassword"
              label="New Password"
              filled
              clearable
              class="q-mb-md"
              type="password"
              required
            />
            <q-input
              v-model="confirmPassword"
              label="Confirm New Password"
              filled
              clearable
              class="q-mb-md"
              type="password"
              required
            />
  
            <q-btn
              label="Reset Password"
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
  import { useRouter } from "vue-router"; // Import vue-router
  
  const router = useRouter(); // Initialize router
  
  const email = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  
  const onSubmit = async () => {
    if (newPassword.value !== confirmPassword.value) {
      alert("Passwords do not match.");
      return;
    }
  
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        newPassword: newPassword.value
      }),
      redirect: "follow",
    };
  
    try {
      const response = await fetch("http://localhost:8800/api/v1/users", requestOptions);
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); // Show success message
        router.push('/'); // Redirect to the login page after reset
      } else {
        alert(result.message || "An error occurred. Please try again."); // Show error message
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      alert('An error occurred. Please try again later.');
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
  
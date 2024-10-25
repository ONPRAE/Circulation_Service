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
  
          <div class="q-mr-md text-Green">
            {{ firstName }}
          </div>
        </q-toolbar>
      </q-header>
  
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const firstName = ref(''); // Store the user's first_name
  const userId = localStorage.getItem('userId'); // Get user ID from localStorage
  
  onMounted(async () => {
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:8800/api/v1/users/${userId}`);
        // Assuming the response contains user data with first_name
        firstName.value = response.data.first_name; // Update firstName with the fetched value
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    } else {
      console.error('User ID not found'); // Log if userId is not found
    }
  });
  </script>
  
  <style>
  .bg-lightblue {
    background-color: #F0FFFF;
  }
  .text-Green {
    color: #5F9EA0;
  }
  </style>
  
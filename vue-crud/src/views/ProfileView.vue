<template>
    <div class="profile">
      <div v-if="user" class="profile-details">
        <h2>Welcome, {{ user.first_name }} {{ user.last_name }}!</h2>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
      </div>
      <div v-else>
        <p>Loading user information...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: null,
      };
    },
    async created() {
      await this.fetchUserData();
    },
    methods: {
      async fetchUserData() {
        try {
          const userId = localStorage.getItem('user_id');
          if (userId) {
            const response = await axios.get(`http://localhost:8800/api/v1/users/${userId}`);
            this.user = response.data; // Assuming the user data is in response.data
          } else {
            this.$router.push('/'); // Redirect to login if user_id is not found
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          alert('Could not load user data. Please try logging in again.');
          this.$router.push('/'); // Redirect to login on error
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .profile {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }
  
  .profile-details {
    background-color: #f0f8ff;
    padding: 20px;
    border-radius: 8px;
  }
  
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  
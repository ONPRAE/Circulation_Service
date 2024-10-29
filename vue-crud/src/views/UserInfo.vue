<template>
    <div class="q-pa-md">
      <!-- //---------------------------------------------------User Section-------------------------------------// -->
      <!-- Add User Button -->
      <div class="q-py-md">
        <q-btn icon="add" @click="openAddUserDialog" label="Add User" />
      </div>
  
      <!-- User Table -->
      <q-table
        title="Users"
        :rows="UserRows"
        :columns="UserColumns"
        row-key="user_id"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="edit" @click="onEditCustomer(props.row.user_id)" />
            <q-btn icon="delete" @click="onDeleteCustomer(props.row.user_id)" />
          </q-td>
        </template>
      </q-table>
  
      <!-- Dialog for adding a new User -->
      <q-dialog v-model="addUserDialog" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Create User</div>
          </q-card-section>
  
          <q-card-section>
            <div class="form-group">
              <label for="first_name">First Name:</label>
              <q-input v-model="first_name" id="first_name" required />
            </div>
  
            <div class="form-group">
              <label for="last_name">Last Name:</label>
              <q-input v-model="last_name" id="last_name" required />
            </div>
  
            <div class="form-group">
              <label for="email">Email:</label>
              <q-input v-model="email" id="email" required />
            </div>
  
            <div class="form-group">
              <label for="password">Password:</label>
              <q-input type="password" v-model="password" id="password" required />
            </div>
  
            <div class="form-group">
              <label for="role">Role:</label>
              <q-select 
                v-model="role" 
                id="role" 
                :options="roles" 
                required 
              />
            </div>
  
            <div v-if="usererrorMessage" class="error">{{ usererrorMessage }}</div>
            <div v-if="usersuccessMessage" class="success">{{ usersuccessMessage }}</div>
          </q-card-section>
  
          <q-card-actions>
            <q-btn color="primary" label="Create User" @click="submitUserForm" />
            <q-btn flat label="Cancel" @click="closeAddUserDialog" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  //script Users section
  
  // Define roles
  const roles = ref([
    'Admin',
    'User'
  ]);
  // User Management
  const addUserDialog = ref(false); // Add user dialog
  const first_name = ref('');
  const last_name = ref('');
  const email = ref('');
  const password = ref('');
  const role = ref(''); // This will hold the string value of the selected role
  const usererrorMessage = ref('');
  const usersuccessMessage = ref('');
  
  
  const UserColumns = ref([
    { name: 'user_id', align: 'center', label: 'User ID', field: 'user_id', sortable: true },
    { name: 'first_name', align: 'left', label: 'First Name', field: 'first_name', sortable: true },
    { name: 'last_name', align: 'left', label: 'Last Name', field: 'last_name', sortable: true },
    { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
    { name: 'role', align: 'left', label: 'User role', field: 'role', sortable: true },
    { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false },
  ]);
  const UserRows = ref([]);
  
  
  const fetchUser = () => {
    fetch('http://localhost:8800/api/v1/users')
      .then(res => res.json())
      .then(result => {
        UserRows.value = result;
      })
      .catch(error => console.error('Error fetching user:', error));
  };
  // Initial fetch
  fetchUser();
  
  // Delete a user
  const onDeleteCustomer = (id) => {
    if (confirm("Are you sure you want to delete this User?")) {
      fetch(`http://localhost:8800/api/v1/users/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(result => {
          alert(result.message);
          fetchUser(); // Refresh user data
        })
        .catch(error => console.error('Error deleting User:', error));
    }
  };
  
  // Function to open the add user dialog
  const openAddUserDialog = () => {
    first_name.value = '';
    last_name.value = '';
    email.value = '';
    password.value = '';
    role.value = ''; // Reset role field
    usererrorMessage.value = '';
    usersuccessMessage.value = '';
    addUserDialog.value = true; // Open the add user dialog
  };
  
  // Submit User Form
  const submitUserForm = async () => {
    usererrorMessage.value = '';
    usersuccessMessage.value = '';
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      password: password.value, // Hash this password
      role: role.value
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
      fetchUser();
      closeAddUserDialog();
      // Check for successful response
      if (response.ok) {
        alert(result.message); // Show success message
      } else {
        alert(result.message || "An error occurred. Please try again."); // Show error message
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred. Please try again later.'); // Generic error message
    }
  };
  
  
  // Close Add User Dialog
  const closeAddUserDialog = () => {
    addUserDialog.value = false; // Close the dialog
  };
  
  </script>
  
  <style scoped>
  .create-product {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
  </style>
  
<template>
  <div class="q-pa-md">
    <!-- User Section -->
    <div class="q-py-md">
      <q-btn icon="add" color="green" @click="openAddUserDialog" label="Add User" />
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
          <q-btn icon="delete" color="red" @click="onDeleteCustomer(props.row.user_id)" />
          <q-btn icon="key" color="blue" @click="openChangePasswordDialog(props.row.user_id)" label="Change Password" />
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
          <!-- User form fields -->
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
            <q-select v-model="role" id="role" :options="roles" required />
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

    <!-- Dialog for changing user password -->
    <q-dialog v-model="changePasswordDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Change Password</div>
        </q-card-section>

        <q-card-section>
          <!-- Change password form fields -->
          <div class="form-group">
            <label for="new_password">New Password:</label>
            <q-input type="password" v-model="newPassword" id="new_password" required />
          </div>
          <div class="form-group">
            <label for="confirm_password">Confirm Password:</label>
            <q-input type="password" v-model="confirmPassword" id="confirm_password" required />
          </div>

          <div v-if="passwordErrorMessage" class="error">{{ passwordErrorMessage }}</div>
          <div v-if="passwordSuccessMessage" class="success">{{ passwordSuccessMessage }}</div>
        </q-card-section>

        <q-card-actions>
          <q-btn color="primary" label="Update Password" @click="submitPasswordChangeForm" />
          <q-btn flat label="Cancel" @click="closeChangePasswordDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from 'axios';

const router = useRouter();

// Define roles
const roles = ref(['Admin', 'User']);

// User management
const addUserDialog = ref(false);
const first_name = ref('');
const last_name = ref('');
const email = ref('');
const password = ref('');
const role = ref('');
const usererrorMessage = ref('');
const usersuccessMessage = ref('');

// Table setup
const UserColumns = ref([
  { name: 'user_id', align: 'center', label: 'User ID', field: 'user_id', sortable: true },
  { name: 'first_name', align: 'left', label: 'First Name', field: 'first_name', sortable: true },
  { name: 'last_name', align: 'left', label: 'Last Name', field: 'last_name', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'role', align: 'left', label: 'User Role', field: 'role', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false },
]);
const UserRows = ref([]);

// Fetch users
const fetchUser = () => {
  fetch('http://localhost:8800/api/v1/users')
    .then(res => res.json())
    .then(result => {
      UserRows.value = result;
    })
    .catch(error => console.error('Error fetching user:', error));
};
fetchUser();

// Add user
const openAddUserDialog = () => {
  first_name.value = '';
  last_name.value = '';
  email.value = '';
  password.value = '';
  role.value = '';
  usererrorMessage.value = '';
  usersuccessMessage.value = '';
  addUserDialog.value = true;
};

const submitUserForm = async () => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      password: password.value,
      role: role.value
    }),
  };
  try {
    const response = await fetch("http://localhost:8800/api/v1/users", requestOptions);
    const result = await response.json();
    fetchUser();
    closeAddUserDialog();
    if (response.ok) {
      alert(result.message);
    } else {
      alert(result.message || "An error occurred. Please try again.");
    }
  } catch (error) {
    console.error('Error during signup:', error);
    alert('An error occurred. Please try again later.');
  }
};

const closeAddUserDialog = () => {
  addUserDialog.value = false;
};

// Change password dialog
const changePasswordDialog = ref(false);
const currentUserId = ref(null);
const newPassword = ref('');
const confirmPassword = ref('');
const passwordErrorMessage = ref('');
const passwordSuccessMessage = ref('');

const openChangePasswordDialog = (user_id) => {
  currentUserId.value = user_id;
  newPassword.value = '';
  confirmPassword.value = '';
  passwordErrorMessage.value = '';
  passwordSuccessMessage.value = '';
  changePasswordDialog.value = true;
};

const submitPasswordChangeForm = async () => {
  if (newPassword.value !== confirmPassword.value) {
    passwordErrorMessage.value = 'Passwords do not match.';
    return;
  }

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword: newPassword.value }),
  };

  try {
    const response = await fetch(`http://localhost:8800/api/v1/users/${currentUserId.value}`, requestOptions);
    const result = await response.json();
    if (response.ok) {
      passwordSuccessMessage.value = result.message;
      closeChangePasswordDialog();
    } else {
      passwordErrorMessage.value = result.message || 'Failed to update password.';
    }
  } catch (error) {
    console.error('Error updating password:', error);
    passwordErrorMessage.value = 'An unexpected error occurred.';
  }
};

const closeChangePasswordDialog = () => {
  changePasswordDialog.value = false;
};

// Check User Role and Redirect if Necessary
const checkUserRole = async () => {
  const userId = localStorage.getItem("user_id");

  if (userId) {
    try {
      const response = await fetch(`http://localhost:8800/api/v1/user/role?userId=${userId}`);
      const result = await response.json();

      if (response.ok && result.role === "User") {
        router.push("/user");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  } else {
    console.error("User ID is missing.");
  }
};

onMounted(() => {
  checkUserRole();
});
</script>

<style scoped>
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

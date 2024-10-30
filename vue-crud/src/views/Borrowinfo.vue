<template>
  <div class="q-pa-md">
    <div class="q-py-md">
      <q-btn icon="add" @click="openAddBorrowDialog" label="Add Borrow Record" />
    </div>

    <q-table
      title="Borrow Records"
      :rows="borrowRows"
      :columns="borrowColumns"
      row-key="borrow_id"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <!-- ปุ่ม Edit -->
          <q-btn 
            icon="edit" 
            color="primary"
            @click="onEditBorrow(props.row.borrow_id)" 
            label="Edit"
            dense
          />
          
          <!-- ปุ่ม Delete -->
          <q-btn 
            icon="delete" 
            color="negative"
            @click="onDeleteBorrow(props.row.borrow_id)" 
            label="Delete"
            dense
          />
        </q-td>
      </template>
    </q-table>

    <!-- Dialog for adding a new borrow record -->
    <q-dialog v-model="addBorrowDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Create Borrow Record</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="user_id" label="User ID" required />
          <q-input v-model="borrow_date" label="Borrow Date" type="date" required />
          <q-input v-model="borrow_return" label="Return Date" type="date" required />
          <q-select 
            v-model="status" 
            :options="['Pending', 'Borrowing', 'Return', 'Cancel', 'Late']" 
            label="Status" 
            required 
          />
          
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success">{{ successMessage }}</div>
        </q-card-section>

        <q-card-actions>
          <q-btn color="primary" label="Create Borrow Record" @click="submitBorrowForm" />
          <q-btn flat label="Cancel" @click="closeAddBorrowDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog for editing a borrow record -->
    <q-dialog v-model="editBorrowDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Borrow Record</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="user_id" label="User ID" required />
          <q-input v-model="borrow_date" label="Borrow Date" type="date" required />
          <q-input v-model="borrow_return" label="Return Date" type="date" required />
          <q-select 
            v-model="status" 
            :options="['Pending', 'Borrowing', 'Return', 'Cancel', 'Late']" 
            label="Status" 
            required 
          />
          
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success">{{ successMessage }}</div>
        </q-card-section>

        <q-card-actions>
          <q-btn color="primary" label="Save Changes" @click="submitEditForm(currentBorrowId)" />
          <q-btn flat label="Cancel" @click="closeEditBorrowDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Define columns for the borrow table
const borrowColumns = ref([
  { name: 'borrow_id', align: 'center', label: 'Borrow ID', field: 'borrow_id', sortable: true },
  { name: 'user_id', align: 'center', label: 'User ID', field: 'user_id', sortable: true },
  { name: 'borrow_date', align: 'center', label: 'Borrow Date', field: 'borrow_date', sortable: true },
  { name: 'borrow_return', align: 'center', label: 'Return Date', field: 'borrow_return', sortable: true },
  { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false },
]);

const borrowRows = ref([]);

// Fetch borrow records from the backend
const fetchBorrows = () => {
  fetch('http://localhost:8800/api/v1/borrows')
    .then(res => res.json())
    .then(result => {
      borrowRows.value = result;
    })
    .catch(error => console.error('Error fetching borrows:', error));
};
fetchBorrows();

// Dialog state and form data for adding and editing a borrow record
const addBorrowDialog = ref(false);
const editBorrowDialog = ref(false);
const user_id = ref('');
const borrow_date = ref('');
const borrow_return = ref('');
const status = ref('');

const errorMessage = ref('');
const successMessage = ref('');
const currentBorrowId = ref(null); // Holds ID for the record being edited

// Open the add borrow dialog
const openAddBorrowDialog = () => {
  user_id.value = '';
  borrow_date.value = '';
  borrow_return.value = '';
  status.value = '';
  errorMessage.value = '';
  successMessage.value = '';
  addBorrowDialog.value = true;
};

// Open the edit borrow dialog
const onEditBorrow = async (borrow_id) => {
  try {
    const response = await axios.get(`http://localhost:8800/api/v1/borrows/${borrow_id}`);
    const borrow = response.data;
    
    // Populate dialog with data for editing
    user_id.value = borrow.user_id;
    borrow_date.value = borrow.borrow_date;
    borrow_return.value = borrow.borrow_return;
    status.value = borrow.status;
    currentBorrowId.value = borrow_id;
    editBorrowDialog.value = true; // Open edit dialog
  } catch (error) {
    console.error('Error fetching borrow data:', error);
  }
};

// Close the dialogs
const closeAddBorrowDialog = () => {
  addBorrowDialog.value = false;
};
const closeEditBorrowDialog = () => {
  editBorrowDialog.value = false;
};

// Submit form for creating a new borrow record
const submitBorrowForm = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!user_id.value || !borrow_date.value || !borrow_return.value || !status.value) {
    errorMessage.value = 'All fields are required.';
    return;
  }

  const formData = new FormData();
  formData.append('user_id', user_id.value);
  formData.append('borrow_date', borrow_date.value);
  formData.append('borrow_return', borrow_return.value);
  formData.append('status', status.value);

  try {
    const response = await axios.post('http://localhost:8800/api/v1/borrows', formData);
    successMessage.value = response.data.message;
    fetchBorrows(); // Refresh borrow data
    closeAddBorrowDialog(); // Close the dialog
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Failed to create borrow record.';
    } else {
      errorMessage.value = 'An unexpected error occurred.';
    }
  }
};

// Submit form for editing an existing borrow record
const submitEditForm = async (borrow_id) => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!user_id.value || !borrow_date.value || !borrow_return.value || !status.value) {
    errorMessage.value = 'All fields are required.';
    return;
  }

  const formData = {
    user_id: user_id.value,
    borrow_date: borrow_date.value,
    borrow_return: borrow_return.value,
    status: status.value,
  };

  try {
    const response = await axios.put(`http://localhost:8800/api/v1/borrows/${borrow_id}`, formData);
    successMessage.value = response.data.message;
    fetchBorrows(); // Refresh borrow data
    closeEditBorrowDialog(); // Close the dialog
  } catch (error) {
    console.error('Error updating borrow record:', error);
    errorMessage.value = 'Failed to update borrow record.';
  }
};

// Function to delete a borrow record
const onDeleteBorrow = (borrow_id) => {
  if (confirm("Are you sure you want to delete this borrow record?")) {
    fetch(`http://localhost:8800/api/v1/borrows/${borrow_id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(result => {
        alert(result.message);
        fetchBorrows(); // Refresh borrow data
      })
      .catch(error => console.error('Error deleting borrow record:', error));
  }
};
</script>

<style scoped>
.error {
  color: red;
}

.success {
  color: green;
}
</style>

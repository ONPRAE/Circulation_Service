<template>
  <div class="q-pa-md">
    <!-- Borrow Records Table -->
    <q-table
      title="Borrow Records"
      :rows="borrowRows"
      :columns="borrowColumns"
      row-key="borrow_id"
      :loading="isLoading"
      no-data-label="No records found"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn 
            icon="edit" 
            color="primary"
            @click="onEditBorrow(props.row.borrow_id)" 
            label="Edit"
            dense
          />
        </q-td>
      </template>
    </q-table>

    <!-- Dialog for editing borrow status only -->
    <q-dialog v-model="editBorrowDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Borrow Status</div>
        </q-card-section>
        <q-card-section>
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
          <q-btn :loading="isSaving" color="primary" label="Save Changes" @click="submitEditForm(currentBorrowId)" />
          <q-btn flat label="Cancel" @click="closeEditBorrowDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

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
const isLoading = ref(true); // Loading state for table data
const isSaving = ref(false); // Loading state for save button

// Fetch borrow records from the backend
const fetchBorrows = async () => {
  isLoading.value = true;
  try {
    const result = await axios.get('http://localhost:8800/api/v1/borrows');
    borrowRows.value = result.data;
  } catch (error) {
    console.error('Error fetching borrows:', error);
  } finally {
    isLoading.value = false;
  }
};

// Dialog state and form data for editing
const editBorrowDialog = ref(false);
const status = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const currentBorrowId = ref(null);

// Open the edit dialog with the current status
const onEditBorrow = (borrow_id) => {
  const borrowRecord = borrowRows.value.find(borrow => borrow.borrow_id === borrow_id);
  if (borrowRecord) {
    status.value = borrowRecord.status;  // Set the current status for editing
    currentBorrowId.value = borrow_id;
    errorMessage.value = '';
    successMessage.value = '';
    editBorrowDialog.value = true;
  } else {
    console.error(`Borrow record with ID ${borrow_id} not found.`);
  }
};

// Close the dialog and reset form fields
const closeEditBorrowDialog = () => {
  editBorrowDialog.value = false;
  status.value = '';
  errorMessage.value = '';
  successMessage.value = '';
};

// Submit form to update only the status field
const submitEditForm = async (borrow_id) => {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  if (!status.value) {
    errorMessage.value = 'Status is required.';
    isSaving.value = false;
    return;
  }

  // Prepare form data with only the status
  const formData = { status: status.value };

  try {
    const response = await axios.put(`http://localhost:8800/api/v1/borrows/${borrow_id}`, formData);
    successMessage.value = response.data.message;

    // Refresh data if status was changed to "Return"
    if (status.value === 'Return') {
      await fetchBorrows();
    }

    closeEditBorrowDialog();
  } catch (error) {
    console.error('Error updating borrow status:', error.response?.data || error.message);
    errorMessage.value = error.response?.data?.error || 'Failed to update borrow status.';
  } finally {
    isSaving.value = false;
  }
};

// Check User Role and Redirect if Necessary
const checkUserRole = async () => {
  const userId = localStorage.getItem("user_id");

  if (userId) {
    try {
      const response = await axios.get(`http://localhost:8800/api/v1/user/role?userId=${userId}`);
      if (response.data.role === "User") {
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
  fetchBorrows(); // Fetch data when the component is mounted
});
</script>

<style scoped>
.error {
  color: red;
}

.success {
  color: green;
}
</style>

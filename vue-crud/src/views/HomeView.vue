<template>
  <div class="q-pa-md">
    <div class="q-py-md">
      <q-btn icon="add" @click="openAddProductDialog" label="Add Product" />
    </div>

    <q-table
      title="Products"
      :rows="productRows"
      :columns="productColumns"
      row-key="product_id"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" @click="onEditProduct(props.row.product_id)" />
          <q-btn icon="delete" @click="onDeleteProduct(props.row.product_id)" />
        </q-td>
      </template>
    </q-table>

    <!-- Dialog for adding a new product -->
    <q-dialog v-model="addProductDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Create Product</div>
        </q-card-section>

        <q-card-section>
          <div class="form-group">
            <label for="product_name">Product Name:</label>
            <q-input v-model="product_name" id="product_name" required />
          </div>

          <div class="form-group">
            <label for="stock">Stock:</label>
            <q-input v-model="stock" type="number" id="stock" required min="1" />
          </div>

          <div class="form-group">
            <label for="product_type">Type:</label>
            <q-select 
              v-model="product_type" 
              id="product_type" 
              :options="product_types" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="image">Image:</label>
            <input type="file" @change="onFileChange" accept="image/jpeg, image/png, image/gif" required />
          </div>

          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success">{{ successMessage }}</div>
        </q-card-section>

        <q-card-actions>
          <q-btn color="primary" label="Create Product" @click="submitForm" />
          <q-btn flat label="Cancel" @click="closeAddProductDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog for editing a product -->
    <q-dialog v-model="editProductDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Product</div>
        </q-card-section>

        <q-card-section>
          <div class="form-group">
            <label for="product_id">Product ID:</label>
            <q-input v-model="currentProductId" id="product_id" readonly />
          </div>

          <div class="form-group">
            <label for="product_name">Product Name:</label>
            <q-input v-model="product_name" id="product_name" required />
          </div>

          <div class="form-group">
            <label for="stock">Stock:</label>
            <q-input v-model="stock" type="number" id="stock" required min="1" />
          </div>

          <div class="form-group">
            <label for="image">Image:</label>
            <input type="file" @change="onEditFileChange" accept="image/jpeg, image/png, image/gif" />
          </div>
          

          <div v-if="editerrorMessage" class="error">{{ editerrorMessage }}</div>
          <div v-if="editsuccessMessage" class="success">{{ editsuccessMessage }}</div>
        </q-card-section>

        <q-card-actions>
          <q-btn color="primary" label="Edit Product" @click="submitEditForm(currentProductId)" />
          <q-btn flat label="Cancel" @click="closeEditProductDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

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

// Define columns for the product table
const productColumns = ref([
  { name: 'product_id', align: 'center', label: 'Product ID', field: 'product_id', sortable: true },
  { name: 'product_name', align: 'left', label: 'Product Name', field: 'product_name', sortable: true },
  { name: 'product_type', align: 'right', label: 'Type', field: 'product_type', sortable: true },
  { name: 'stock', align: 'right', label: 'Stock', field: 'stock', sortable: true },
  { name: 'image', align: 'center', label: 'Image', field: 'image', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false },
]);

const productRows = ref([]);

// Fetch products from the backend
const fetchProducts = () => {
  fetch('http://localhost:8800/api/v1/products')
    .then(res => res.json())
    .then(result => {
      productRows.value = result;
    })
    .catch(error => console.error('Error fetching products:', error));
};
fetchProducts();

// Dialog state and form data for adding and editing
const product_types = ref([
'ToolKids', 'Projector', 'Mouse', 'Laptop', 'Keyboard', 'Speaker', 'Monitor'
]);
const addProductDialog = ref(false);
const editProductDialog = ref(false);
const product_name = ref('');
const product_type = ref('');
const stock = ref(null);
const image = ref(null);

const errorMessage = ref('');
const successMessage = ref('');
const editerrorMessage = ref('');
const editsuccessMessage = ref('');

const currentProductId = ref(null); // Stores the ID of the product being edited

// Open the add product dialog
const openAddProductDialog = () => {
  product_name.value = '';
  product_type.value = '';
  stock.value = null;
  image.value = null;
  errorMessage.value = '';
  successMessage.value = '';
  addProductDialog.value = true;
};

// Open the edit product dialog and fetch product data by ID
const onEditProduct = async (product_id) => {
  try {
    const response = await axios.get(`http://localhost:8800/api/v1/products/${product_id}`);
    const product = response.data;

    product_name.value = product.product_name;
    product_type.value = product.product_type;
    stock.value = product.stock;
    image.value = null;
    
    currentProductId.value = product_id; // Set currentProductId for editing
    editerrorMessage.value = '';
    editsuccessMessage.value = '';
    editProductDialog.value = true; // Open edit dialog
  } catch (error) {
    console.error('Error fetching product:', error);
    editerrorMessage.value = 'Failed to fetch product data.';
  }
};

// Handle file changes for the add and edit forms
const onFileChange = (event) => {
  image.value = event.target.files[0];
};
const onEditFileChange = (event) => {
  image.value = event.target.files[0];
};

// Close the dialogs
const closeAddProductDialog = () => {
  addProductDialog.value = false;
};
const closeEditProductDialog = () => {
  editProductDialog.value = false;
};

// Submit form for adding a new product
const submitForm = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!product_name.value || !stock.value || !image.value || !product_type.value) {
    errorMessage.value = 'All fields are required.';
    return;
  }

  const formData = new FormData();
  formData.append('product_name', product_name.value);
  formData.append('product_type', product_type.value);
  formData.append('stock', parseInt(stock.value));
  formData.append('image', image.value);

  try {
    const response = await axios.post('http://localhost:8800/api/v1/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    successMessage.value = response.data.message;
    fetchProducts(); // Refresh product data
    closeAddProductDialog(); // Close the dialog
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Failed to create product.';
    } else {
      errorMessage.value = 'An unexpected error occurred.';
    }
  }
};

// Submit form for editing an existing product
const submitEditForm = async (product_id) => {
  editerrorMessage.value = '';
  editsuccessMessage.value = '';

  if (!product_name.value || !stock.value) {
    editerrorMessage.value = 'Product name and stock are required.';
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    product_name: product_name.value,
    stock: parseInt(stock.value, 10),
    product_type: product_type.value,
    // Handle image upload and get the URL if necessary
    image: image.value ? await uploadImage(image.value) : null // Optional image upload function
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`http://localhost:8800/api/v1/products/${product_id}`, requestOptions);
    const result = await response.json();

    if (response.ok) {
      alert('Update Success'); // Success alert
      editsuccessMessage.value = result.message;
      fetchProducts(); // Refresh product data
      closeEditProductDialog(); // Close the dialog
    } else {
      editerrorMessage.value = result.message || 'Failed to edit product.';
    }
  } catch (error) {
    console.error('Error updating product:', error);
    editerrorMessage.value = 'An unexpected error occurred.';
  }
};

// Function to upload the image and return the URL
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('http://localhost:8800/api/v1/upload', { // Adjust according to your upload endpoint
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result.imageUrl; // Return the uploaded image URL
};

// Delete a product
const onDeleteProduct = (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`http://localhost:8800/api/v1/products/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(result => {
        alert(result.message);
        fetchProducts(); // Refresh product data
      })
      .catch(error => console.error('Error deleting product:', error));
  }
};

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

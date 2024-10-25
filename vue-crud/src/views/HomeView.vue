<template>
  <div class="q-pa-md">
    <div class="q-py-md">
      <q-btn icon="add" @click="openAddProductDialog" label="Add Product" />
    </div>

    <q-table
      title="Products"
      :rows="productRows"
      :columns="productColumns"
      row-key="id"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" @click="onEditProduct(props.row.product_id)" />
          <q-btn icon="delete" @click="onDeleteProduct(props.row.product_id)" />
        </q-td>
      </template>
    </q-table>

    <div class="q-py-md">
      <q-btn icon="add" @click="openAddUserDialog" label="Add User" />
    </div>
    <q-table
      title="User"
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


          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success">{{ successMessage }}</div>
        </q-card-section>

        <q-card-actions>
          <q-btn color="primary" label="Create User" @click="submitForm" />
          <q-btn flat label="Cancel" @click="closeAddUserDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

     <!-- Dialog for adding a new product -->
     <q-dialog v-model="addProductDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Create Product</div>
        </q-card-section>

        <q-card-section>
          <div class="form-group">
            <label for="productname">Product Name:</label>
            <q-input v-model="productname" id="productname" required />
          </div>

          <div class="form-group">
            <label for="stock">Stock:</label>
            <q-input v-model="stock" type="number" id="stock" required min="1" />
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


    <!-- Dialog for edit a new product -->
    <q-dialog v-model="editProductDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Product</div>
        </q-card-section>

        <q-card-section>
          <div class="form-group">
            <label for="productname">Product Name:</label>
            <q-input v-model="productname" id="productname" required />
          </div>

          <div class="form-group">
            <label for="stock">Stock:</label>
            <q-input v-model="stock" type="number" id="stock" required min="1" />
          </div>

          <div class="form-group">
            <label for="image">Image:</label>
            <input type="file" @change="onEditFileChange" accept="image/jpeg, image/png, image/gif" required />
          </div>

          <div v-if="editerrorMessage" class="error">{{ editerrorMessage }}</div>
          <div v-if="editsuccessMessage" class="success">{{ editsuccessMessage }}</div>
        </q-card-section>

        <q-card-actions>
          <q-btn color="primary" label="Edit Product" @click="submitEditForm" />
          <q-btn flat label="Cancel" @click="closeEditProductDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';

const productColumns = ref([
  { name: 'product_id', align: 'center', label: 'Product ID', field: 'product_id', sortable: true },
  { name: 'productname', align: 'left', label: 'Product Name', field: 'productname', sortable: true },
  { name: 'stock', align: 'right', label: 'Stock', field: 'stock', sortable: true },
  { name: 'image', align: 'center', label: 'Image', field: 'image', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false },
]);
const productRows = ref([]);
// Fetch products
const fetchProducts = () => {
  fetch('http://localhost:8800/api/v1/products')
    .then(res => res.json())
    .then(result => {
      productRows.value = result;
    })
    .catch(error => console.error('Error fetching products:', error));
};
fetchProducts();

// Dialog state and form data
const addProductDialog = ref(false);
const productname = ref('');
const stock = ref(null);
const image = ref(null);
const errorMessage = ref('');
const successMessage = ref('');

// Dialog state and form data
const editProductDialog = ref(false);
const editerrorMessage = ref('');
const editsuccessMessage = ref('');

// Open the dialog
const openAddProductDialog = () => {
  productname.value = ''; // Reset the form
  stock.value = null;
  image.value = null;
  editerrorMessage.value = '';
  editsuccessMessage.value = '';
  editProductDialog.value = true; // Open the dialog
};

// Open the edit dialog
const onEditProduct = (product_id) => {
  // กำหนดค่า productname, stock และ image จากข้อมูลของสินค้าที่เลือกแก้ไข
  const product = productRows.value.find(p => p.product_id === product_id);
  productname.value = product.productname;
  stock.value = product.stock;
  image.value = null; // อาจจะต้องกำหนดวิธีการแสดงไฟล์ภาพในช่อง input ถ้าจำเป็น
  editerrorMessage.value = '';
  editsuccessMessage.value = '';
  editProductDialog.value = true; // เปิด dialog สำหรับแก้ไขสินค้า

  // ส่ง product_id ไปเพื่อใช้ใน submitEditForm
  submitEditForm(product_id);
};

// Close the dialog
const closeAddProductDialog = () => {
  addProductDialog.value = false; // Close the dialog
};

// Close the edit  dialog
const closeEditProductDialog = () => {
  editProductDialog.value = false; // Close the dialog
};

// Handle file change
const onFileChange = (event) => {
  image.value = event.target.files[0];
};
// Handle file change
const onEditFileChange = (event) => {
  image.value = event.target.files[0];
};

// Submit form
const submitForm = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!productname.value || !stock.value || !image.value) {
    errorMessage.value = 'All fields are required.';
    return;
  }

  const formData = new FormData();
  formData.append('productname', productname.value);
  formData.append('stock', parseInt(stock.value));
  formData.append('image', image.value);

  try {
    const response = await axios.post('http://localhost:8800/api/v1/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

// Submit form
const submitEditForm = async (product_id) => {
  editerrorMessage.value = '';
  editsuccessMessage.value = '';

  if (!productname.value || !stock.value || !image.value) {
    errorMessage.value = 'All fields are required.';
    return;
  }

  const formData = new FormData();
  formData.append('productname', productname.value);
  formData.append('stock', parseInt(stock.value));
  formData.append('image', image.value);

  try {
    const response = await axios.put(`http://localhost:8800/api/v1/products/${product_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    editsuccessMessage.value = response.data.message;
    fetchProducts(); // Refresh product data
    closeEditProductDialog(); // Close the dialog
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Failed to edit product.';
    } else {
      errorMessage.value = 'An unexpected error occurred.';
    }
  }
};

// const onEditProduct = (id) => {
//   router.push(`/produpdate/${id}`);
// };

const onDeleteProduct = (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`http://localhost:8800/api/v1/products/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(result => {
        alert(result.message);
        fetchProducts(); 
      })
      .catch(error => console.error('Error deleting product:', error));
  }
};


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


// Dialog state and form data
const addUserDialog = ref(false);
const first_name = ref('');
const last_name = ref(null);
const email = ref(null);
const usererrorMessage = ref('');
const usersuccessMessage = ref('');



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

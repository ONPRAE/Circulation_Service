<template>
  <div class="q-pa-md">
    <!-- Add Product Button -->
    <div class="q-py-md">
      <q-btn icon="add" @click="openAddProductDialog" label="Add Product" />
    </div>

    <!-- Product Table -->
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
            <q-select v-model="product_type" id="product_type" :options="product_types" required />
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// Define columns for the product table
const productColumns = ref([
  { name: "product_id", align: "center", label: "Product ID", field: "product_id", sortable: true },
  { name: "product_name", align: "left", label: "Product Name", field: "product_name", sortable: true },
  { name: "product_type", align: "right", label: "Type", field: "product_type", sortable: true },
  { name: "stock", align: "right", label: "Stock", field: "stock", sortable: true },
  { name: "image", align: "center", label: "Image", field: "image", sortable: true },
  { name: "actions", align: "center", label: "Actions", field: "actions", sortable: false },
]);

const productRows = ref([]);

// Fetch products from the backend
const fetchProducts = () => {
  axios.get("http://localhost:8800/api/v1/products")
    .then(response => {
      productRows.value = response.data;
    })
    .catch(error => console.error("Error fetching products:", error));
};
fetchProducts();

// Dialog state and form data for adding and editing
const product_types = ref(["ToolKids", "Projector", "Mouse", "Laptop", "Keyboard", "Speaker", "Monitor"]);
const addProductDialog = ref(false);
const editProductDialog = ref(false);
const product_name = ref("");
const product_type = ref("");
const stock = ref(null);
const image = ref(null);

const errorMessage = ref("");
const successMessage = ref("");
const editerrorMessage = ref("");
const editsuccessMessage = ref("");

const currentProductId = ref(null); // Stores the ID of the product being edited

// Open the add product dialog
const openAddProductDialog = () => {
  product_name.value = "";
  product_type.value = "";
  stock.value = null;
  image.value = null;
  errorMessage.value = "";
  successMessage.value = "";
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
    editerrorMessage.value = "";
    editsuccessMessage.value = "";
    editProductDialog.value = true; // Open edit dialog
  } catch (error) {
    console.error("Error fetching product:", error);
    editerrorMessage.value = "Failed to fetch product data.";
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
  if (!product_name.value || !stock.value || !image.value || !product_type.value) {
    errorMessage.value = "All fields are required.";
    return;
  }

  const formData = new FormData();
  formData.append("product_name", product_name.value);
  formData.append("product_type", product_type.value);
  formData.append("stock", parseInt(stock.value));
  formData.append("image", image.value);

  try {
    const response = await axios.post("http://localhost:8800/api/v1/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value = response.data.message;
    fetchProducts(); // Refresh product data
    closeAddProductDialog(); // Close the dialog
  } catch (error) {
    errorMessage.value = error.response?.data.message || "Failed to create product.";
  }
};

// Submit form for editing an existing product
const submitEditForm = async (product_id) => {
  if (!product_name.value || !stock.value) {
    editerrorMessage.value = "Product name and stock are required.";
    return;
  }

  const updatedData = {
    product_name: product_name.value,
    stock: parseInt(stock.value, 10),
    product_type: product_type.value,
  };

  if (image.value) {
    updatedData.image = await uploadImage(image.value);
  }

  try {
    const response = await axios.put(`http://localhost:8800/api/v1/products/${product_id}`, updatedData);
    editsuccessMessage.value = response.data.message;
    fetchProducts(); // Refresh product data
    closeEditProductDialog(); // Close the dialog
  } catch (error) {
    editerrorMessage.value = error.response?.data.message || "Failed to edit product.";
  }
};

// Function to upload the image and return the URL
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post("http://localhost:8800/api/v1/upload", formData);
  return response.data.imageUrl; // Return the uploaded image URL
};

// Delete a product
const onDeleteProduct = (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    axios.delete(`http://localhost:8800/api/v1/products/${id}`)
      .then(response => {
        alert(response.data.message);
        fetchProducts(); // Refresh product data
      })
      .catch(error => console.error("Error deleting product:", error));
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
});
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

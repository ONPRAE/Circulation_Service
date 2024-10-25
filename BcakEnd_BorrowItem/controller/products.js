const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'asset/picture/'); // Save the uploaded images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
    }
});

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG, and GIF are allowed!'), false);
    }
};

const uploadimg = multer({ storage: storage, fileFilter }).single('image'); // Ensure it's a single file upload

// Insert one product
const createProduct = async (req, res) => {
    const { productname, stock } = req.body;
    const imageFile = req.file; // Get the uploaded file

    // Basic validation
    if (!productname || !stock || !imageFile) {
        return res.status(400).json({
            status: "error",
            message: "Product name, stock, and image file are required"
        });
    }

    try {
        const prod = await prisma.products.create({
            data: {
                productname,
                stock: parseInt(stock, 10), // Ensure stock is an integer
                image: imageFile.path // Store the path of the uploaded image
            }
        });
        res.status(201).json({
            status: "ok",
            message: `Product with ID = ${prod.product_id} is created`
        });
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to create product",
            error: err.message // Provide more detail about the error
        });
    }
};

// Update one product
const updateProduct = async (req, res) => {
    try {
        // Extract the product ID from request parameters and validate it
        const product_id = parseInt(req.params.product_id, 10);
        if (isNaN(product_id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Retrieve the existing product data
        const existingProduct = await prisma.products.findUnique({
            where: { product_id },
        });

        // Check if the product exists
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Handle image upload (if a new image file is provided)
        const imagePath = req.file ? req.file.filename : existingProduct.image;

        // Extract fields from the request body and use existing values if not provided
        const { productname = existingProduct.productname, stock = existingProduct.stock } = req.body;

        // Update the product in the database
        const updatedProduct = await prisma.products.update({
            where: { product_id },
            data: {
                productname,
                stock: parseInt(stock, 10), // Ensure stock is an integer
                image: imagePath, // Keep existing image if no new file is provided
            },
        });

        // Respond with success message and the updated product data
        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        // Log and respond with any errors
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
};

// Delete product by product_id
const deleteProduct = async (req, res) => {
    const id = req.params.id;

    try {
        const existingProduct = await prisma.products.findUnique({
            where: { product_id: Number(id) },
        });

        if (!existingProduct) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        await prisma.products.delete({
            where: { product_id: Number(id) },
        });

        res.status(200).json({
            status: "ok",
            message: `Product with ID = ${id} is deleted`
        });
    } catch (err) {
        console.error('Delete product error:', err);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred.'
        });
    }
};

// Get all Products 
const getProducts = async (req, res) => {
    try {
        const pros = await prisma.products.findMany();
        res.json(pros);
    } catch (err) {
        console.error('Failed to retrieve products:', err.message);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
};
const getProductById = async (req, res) => {
    const product_id = parseInt(req.params.id, 10); // Ensure product ID is an integer

    if (isNaN(product_id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const product = await prisma.products.findUnique({
            where: { product_id },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Failed to retrieve product', error: error.message });
    }
};

// Export getProductById with other exports
module.exports = { uploadimg, createProduct, updateProduct, deleteProduct, getProducts, getProductById };

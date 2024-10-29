const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PrismaClient, products_product_type } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save the uploaded images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
    }
});

const upload = multer({ storage: storage }).single('image'); // For handling single image upload

// Insert one product with image upload
const createProduct = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err.message });
        }
        
        const { product_name, product_type, stock } = req.body;
        const image = req.file ? req.file.path : ''; // Save the image path if uploaded

        // Validate product_type is within the enum values
        if (product_type && !Object.values(products_product_type).includes(product_type)) {
            return res.status(400).json({ message: 'Invalid product type' });
        }

        try {
            // Create a new product with image URL
            const prod = await prisma.products.create({
                data: {
                    product_name,
                    product_type,
                    stock: stock ? parseInt(stock, 10) : null,
                    image
                }
            });
    
            // Send response on success
            res.status(200).json({
                status: "ok",
                message: `Product with ID = ${prod.product_id} is created`,
                product: prod
            });
        } catch (err) {
            // Handle errors
            res.status(500).json({
                status: "error",
                message: "Failed to create product",
                error: err.message
            });
        }
    });
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
        const imagePath = req.file ? req.file.path : existingProduct.image;

        // Extract fields from the request body and use existing values if not provided
        const { product_name = existingProduct.product_name, product_type = existingProduct.product_type, stock = existingProduct.stock } = req.body;

        // Validate product_type if provided in request
        if (product_type && !Object.values(products_product_type).includes(product_type)) {
            return res.status(400).json({ message: 'Invalid product type' });
        }

        // Update the product in the database
        const updatedProduct = await prisma.products.update({
            where: { product_id },
            data: {
                product_name,
                product_type,
                stock: stock ? parseInt(stock, 10) : null,
                image: imagePath
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

// Get Product by ID
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

// Export the functions
module.exports = { createProduct, updateProduct, deleteProduct, getProducts, getProductById };

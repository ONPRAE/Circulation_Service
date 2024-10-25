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

// update one product
const updateProduct = async (req, res) => {
    try {
        // Extracting the product ID from request parameters and validating it
        const product_id = parseInt(req.params.product_id, 10);
        if (isNaN(product_id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Handling the image upload (assuming req.file contains the uploaded file)
        const imagePath = req.file ? req.file.filename : null; // Ensure it's a string or null

        // Extracting other fields from the request body and ensuring they're valid
        const { productname, stock } = req.body;

        if (!productname || !stock) {
            return res.status(400).json({ message: 'Product name and stock are required' });
        }

        // Updating the product in the database
        const updatedProduct = await prismaClient.products.update({
            where: {
                product_id: product_id, // Make sure product_id is a valid number
            },
            data: {
                productname: productname,
                stock: parseInt(stock, 10), // Convert stock to integer
                image: imagePath, // Must be a string (file path or URL) or null
            },
        });

        // Respond with success message and the updated product
        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        // Catching and responding with any errors
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
};

// delete product by product_id
const deleteProduct = async (req, res) => {
    const id = req.params.id; // ดึง ID จากพารามิเตอร์ URL

    try {
        // ตรวจสอบว่าผลิตภัณฑ์มีอยู่หรือไม่
        const existingProduct = await prisma.products.findUnique({
            where: {
                product_id: Number(id),
            },
        });

        // ถ้าไม่พบผลิตภัณฑ์
        if (!existingProduct) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // ลบผลิตภัณฑ์
        await prisma.products.delete({
            where: {
                product_id: Number(id),
            },
        });

        // ส่งข้อความเมื่อทำการลบสำเร็จ
        res.status(200).json({
            status: "ok",
            message: `Product with ID = ${id} is deleted` // แสดง ID ที่ถูกลบ
        });
    } catch (err) {
        console.error('Delete product error: ', err); // แสดงข้อผิดพลาดใน console
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred.'
        }); // ส่งข้อความข้อผิดพลาดกลับไปที่ client
    }
};

// get all Products 
const getProducts = async (req, res) => {
    const pros = await prisma.products.findMany()
    res.json(pros)
};

// Export the upload middleware and createProduct function
module.exports = { uploadimg, createProduct, updateProduct, deleteProduct, getProducts };

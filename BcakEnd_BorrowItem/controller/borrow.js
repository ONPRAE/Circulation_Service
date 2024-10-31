const { PrismaClient, borrow_status } = require('@prisma/client');
const prisma = new PrismaClient();



// Create a new borrow
const createBorrow = async (req, res) => {
    const { user_id, borrow_date, borrow_return, products } = req.body; // Assuming products is an array of { product_id, amount }

    // Validate date format
    const parsedBorrowDate = new Date(borrow_date);
    const parsedBorrowReturn = new Date(borrow_return);

    if (isNaN(parsedBorrowDate.getTime())) {
        return res.status(400).json({ error: 'Invalid borrow date format. Use YYYY-MM-DD.' });
    }

    try {
        const borrow = await prisma.borrow.create({
            data: {
                user_id: parseInt(user_id),
                borrow_date: parsedBorrowDate,
                borrow_return: parsedBorrowReturn, // Default to null until return date is set
                status: 'Pending', // Default status
            },
        });

        // Create borrow details for each product
        const borrowDetails = products.map(product => ({
            borrow_id: borrow.borrow_id,
            product_id: parseInt(product.product_id),
            amount: parseInt(product.amount),
        }));

        await prisma.borrowdetail.createMany({
            data: borrowDetails,
        });

        res.status(201).json({ message: 'Borrow created successfully.', borrow });
    } catch (err) {
        console.error('Failed to create borrow:', err.message);
        res.status(500).json({ error: 'Failed to create borrow' });
    }
};

const borrowStatuses = ['Pending', 'Borrowing', 'Return', 'Cancel', 'Late'];

// Get all borrows with their details
const getBorrow = async (req, res) => {
    try {
        const borrows = await prisma.borrow.findMany({
            include: { 
                borrowdetails: {
                    include: { product: true }  // ดึงข้อมูล product ที่สัมพันธ์ใน borrowdetails
                }
            }
        });
        res.status(200).json(borrows);
    } catch (err) {
        console.error('Failed to retrieve borrows:', err.message);
        res.status(500).json({ error: 'Failed to retrieve borrows' });
    }
};



// Update borrow status
const updateBorrowStatus = async (req, res) => {
    const { borrow_id, status } = req.body;

    // ตรวจสอบว่า status อยู่ในลิสต์ที่อนุญาต
    if (!borrowStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status value. Must be one of: ${borrowStatuses.join(', ')}.` });
    }

    try {
        const updatedBorrow = await prisma.borrow.update({
            where: { borrow_id },
            data: { status },
        });

        res.status(200).json({ message: 'Borrow status updated successfully.', updatedBorrow });
    } catch (err) {
        console.error('Failed to update borrow status:', err.message);
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Borrow record not found' });
        }
        res.status(500).json({ error: 'Failed to update borrow status' });
    }
};




module.exports = { createBorrow, getBorrow, updateBorrowStatus };

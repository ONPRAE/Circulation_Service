const { PrismaClient } = require('@prisma/client');
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
                borrow_return: parsedBorrowReturn,
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
                    include: { product: true }
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
    const { borrow_id } = req.params;
    const { status } = req.body;

    // Validate that borrow_id is provided in the URL
    if (!borrow_id) {
        return res.status(400).json({ error: 'borrow_id is required in URL' });
    }

    // Validate that status is provided in the request body
    if (!status) {
        return res.status(400).json({ error: 'Status is required in the request body' });
    }

    try {
        // Start a transaction
        const result = await prisma.$transaction(async (transactionPrisma) => {
            console.log(`Updating borrow record with ID: ${borrow_id} to status: ${status}`);

            // Update the borrow status
            const updatedBorrow = await transactionPrisma.borrow.update({
                where: { borrow_id: parseInt(borrow_id) },
                data: { status },
            });

            console.log(`Updated borrow status for borrow_id: ${borrow_id}.`);

            // If the status is set to "Return", update the stock of each related product
            if (status === "Return") {
                console.log(`Status is "Return"; updating product stocks for borrow_id: ${borrow_id}`);

                const borrowDetails = await transactionPrisma.borrowdetail.findMany({
                    where: { borrow_id: parseInt(borrow_id) },
                });

                for (const detail of borrowDetails) {
                    console.log(`Increasing stock for product_id: ${detail.product_id} by amount: ${detail.amount}`);

                    await transactionPrisma.products.update({
                        where: { product_id: detail.product_id },
                        data: { stock: { increment: detail.amount } },
                    });
                }
            }

            return updatedBorrow;
        });

        res.status(200).json({ message: 'Borrow status updated successfully.', result });
    } catch (err) {
        // Enhanced error handling for debugging
        console.error('Failed to update borrow status:', err.message);
        if (err.meta && err.meta.cause) {
            console.error('Error cause:', err.meta.cause);
        }
        console.error('Full error:', err); // Log full error for troubleshooting

        res.status(500).json({ error: 'Failed to update borrow status', details: err.message });
    }
};

// Controller function to get borrow by ID
const getBorrowById = async (req, res) => {
    const { id } = req.params;
    try {
        const borrow = await prisma.borrow.findUnique({
            where: { borrow_id: parseInt(id) },
            include: { borrowdetails: { include: { product: true } } }
        });
        if (!borrow) {
            return res.status(404).json({ error: 'Borrow record not found' });
        }
        res.status(200).json(borrow);
    } catch (error) {
        console.error('Failed to retrieve borrow:', error.message);
        res.status(500).json({ error: 'Failed to retrieve borrow' });
    }
};

module.exports = { createBorrow, getBorrow, updateBorrowStatus, getBorrowById };

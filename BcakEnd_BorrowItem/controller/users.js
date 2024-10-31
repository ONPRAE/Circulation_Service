const { PrismaClient, user_role } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Get all Users
const getUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Failed to retrieve users:', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

// Create a new user
const createUser = async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;

    // Validate role against the user_role enum
    if (role && !Object.values(user_role).includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified.' });
    }

    try {
        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                role
            }
        });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: "Error creating user" });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const existingUser = await prisma.user.findUnique({
            where: { user_id: id },
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        await prisma.user.delete({
            where: { user_id: id },
        });

        res.status(200).json({ message: `User with ID = ${id} is deleted` });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

// Search users by name or email
const getUsersByName = async (req, res) => {
    const searchString = req.params.term;

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { first_name: { contains: searchString } },
                    { last_name: { contains: searchString } },
                    { email: { contains: searchString } },
                ],
            },
        });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Error searching users' });
    }
};

// User login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please fill in all fields.');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                email: true,
                password: true,
                role: true,
                first_name: true,
                last_name: true,
                user_id: true,
            },
        });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).send('Invalid password.');
        }

        // Remove password before sending the response
        delete user.password;

        res.status(200).send({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Server error');
    }
};
// Example in users.js
const getUserRole = async (req, res) => {
    const { userId } = req.query; // Get user ID from query parameter

    try {
      // Ensure userId is present and parsed as an integer
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const parsedUserId = parseInt(userId, 10);
      
      if (isNaN(parsedUserId)) {
        return res.status(400).json({ error: "User ID must be a valid integer" });
      }
    
      const user = await prisma.user.findUnique({
        where: {
          user_id: parsedUserId, // Use parsed integer userId
        },
        select: {
          role: true,
        },
      });
    
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    
      res.json({ role: user.role });
    } catch (error) {
      console.error("Error fetching user role:", error);
      res.status(500).json({ error: "Internal server error" });
    }

};

// Get user by ID
const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: userId }, // Ensure `user_id` matches schema
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
};

const logout = async (req, res) => {
    try {
        // ในกรณีนี้การ Logout ไม่มีการจัดการเพิ่มเติมใน Backend
        // เพียงแค่ตอบกลับไปเพื่อยืนยันว่าการ Logout สำเร็จแล้ว
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Error during logout' });
    }
};


module.exports = { getUser, createUser, deleteUser, getUsersByName, login, getUserRole,getUserById, logout };


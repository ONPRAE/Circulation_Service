const express = require('express');


const router = express.Router();

const productController = require("../controller/products")
const userController = require('../controller/users');
const borrowController = require('../controller/borrow');

router.post('/products', productController.createProduct);
router.put('/products/:product_id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

router.get('/borrows', borrowController.getBorrow);
router.post('/borrows', borrowController.createBorrow);
router.put('/borrows/:borrow_id', borrowController.updateBorrowStatus);
router.get('/borrows/:id', borrowController.getBorrowById);


router.post('/users', userController.createUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users/:id', userController.getUserById);
router.get('/users/q/:term', userController.getUsersByName);
router.get('/users', userController.getUser);
router.post('/login', userController.login);
router.get('/user/role', userController.getUserRole);
router.post('/logout', userController.logout);
router.put('/users', userController.updatePassword);
router.put('/users/:user_id', userController.updatePasswordByID);




module.exports = router;
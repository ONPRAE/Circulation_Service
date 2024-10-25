const express = require('express');


const router = express.Router();

const productController = require("../controller/products")
const userController = require('../controller/users');
const borrowController = require('../controller/borrow');

router.post('/products', productController.uploadimg, productController.createProduct);
// Route definition using Express
router.put('/products/:product_id', productController.updateProduct);

router.delete('/products/:id', productController.deleteProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

router.get('/borrows', borrowController.getBorrow);
router.post('/borrows', borrowController.createBorrow);
router.put('/borrows/:id', borrowController.updateBorrowStatus);

router.post('/users', userController.createUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users/q/:term', userController.getUsersByName);
router.get('/users', userController.getUser);
router.post('/login', userController.login);



module.exports = router;
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');

router.get('/', (req, res) => {
    //with optional sort by price, and by created_at
    productController.getAll(req.query).then(products => {
        res.send(products);
    });
    // productController.getAll().then(products => {
    //     res.send(products);
    // });
});

router.get('/inactive', (req, res) => {
    productController.getAllInactive().then(products => {
        res.send(products);
    });
});

router.get('/:productId', (req, res) => {
    productController.get(req.params).then(product => {
        res.send(product);
    });
});

router.post('/', (req, res) => {
    productController.add(req.body).then(result => {
        res.send(result);
    });
});

router.put('/:productId', (req, res) => {
    productController.edit(req.params.productId, req.body).then(result => {
        res.send(result);
    });
});

router.delete('/:productId', (req, res) => {
    productController.delete(req.params.productId).then(result => {
        res.send(result);
    });
});

router.put('/toggle/:productId', (req, res) => {
    productController.isActive(req.params.productId, req.body).then(result => {
        res.send(result);
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const catergoryController = require('../controllers/categoryController.js');

router.get('/', (req, res) => {
    catergoryController.getAll().then(categories => {
        res.send(categories);
    });
});

router.get('/:categoryId', (req, res) => {
    catergoryController.get(req.params).then(category => {
        res.send(category);
    });
});

router.post('/', (req, res) => {
    catergoryController.add(req.body).then(result => {
        res.send(result);
    });
});

router.put('/:categoryId', (req, res) => {
    catergoryController.edit(req.params.categoryId, req.body).then(result => {
        res.send(result);
    });
});

router.delete('/:categoryId', (req, res) => {
    catergoryController.delete(req.params.categoryId).then(result => {
        res.send(result);
    });
});

module.exports = router;
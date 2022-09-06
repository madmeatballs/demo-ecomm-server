const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/', (req, res) => {
    userController.getAll().then(users => {
        res.send(users);
    });
});

router.get('/:userId', (req, res) => {
    userController.get(req.params).then(user => {
        res.send(user);
    });
});

router.post('/', (req, res) => {
    userController.add(req.body).then(result => {
        res.send(result);
    });
});

router.put('/:userId', (req, res) => {
    userController.edit(req.params.userId, req.body).then(result => {
        res.send(result);
    });
});

router.delete('/:userId', (req, res) => {
    userController.deleteUser(req.params.userId).then(result => {
        res.send(result);
    });
});

router.get('/:userId/cart', (req, res) => {
    userController.getCart(req.params).then(user => {
        res.send(user);
    });
});

router.post('/:userId/cart/add', (req, res) => {
    userController.addCartItem(req.params.userId, req.body).then(result => {
        res.send(result);
    });
});

router.delete('/:userId/cart/item', (req, res) => {
    userController.removeCartItem(req.params.userId, req.body).then(result => {
        res.send(result);
    });
});

router.delete('/:userId/cart', (req, res) => {
    userController.clearCart(req.params.userId).then(result => {
        res.send(result);
    });
});

router.put('/:userId/cart/item', (req, res) => {
    userController.updateCartItemQuantity(req.params.userId, req.body).then(result => {
        res.send(result);
    });
});

module.exports = router;
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')

exports.orders_list = (req, res, next) => {
    Order.find()
    .select('_id product quantity')
    .populate('product', 'name price')
    .exec()
    .then(orders => {
        const response = {
            count: orders.length,
            orders: orders.map(order => {
                return {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
}

exports.create_order = (req, res, next) => {
    const id = req.body.productId
    Product.findById(id)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        })

        return order.save()
    })
    .then(order => {
        const response = {
            message: 'Order created',
            order: {
                _id: order._id,
                product: order.product,
                quantity: order.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + order._id
            }
        }

        res.status(201).json(response)
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
}

exports.get_order = (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id)
    .select('_id product quantity')
    .populate('product', 'name price')
    .exec()
    .then(order => {
        if(order){

            const response = {
                order: order,
                request: [
                    {
                        type: 'GET',
                        url: 'http://localhost:3000/orders'
                    },
                    {
                        type: 'DELETE',
                        url: 'http://localhost:3000/orders' + order._id
                    }
                ]
            }

            res.status(200).json(response)
        }
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
}

exports.delete_order = (req, res, next) => {
    const id = req.params.orderId
    Order.deleteOne({ _id: id })
    .exec()
    .then(result => {
        const response = {
            message: 'Order removed',
            result: result
        }
        res.status(200).json(response)
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
}
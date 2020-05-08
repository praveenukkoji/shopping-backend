const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// app.use((req, res, next) => {
//     res.status(400).json({
//         message: "it works!"
//     })
// })

const url = "mongodb://" + process.env.dbuser + ":" + process.env.dbpass 
            + "@ds353738.mlab.com:53738/node-rest-shop";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('Successfully connected to MongoDB node-rest-shop');
    })
    .catch(err => {
        console.log(err);
    }
);

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')

const app = express()

app.use(morgan("dev"))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
        return res.status(200).json({})
    }
    next();
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/users', userRoutes)

app.use((req, res, next) => {
    const error = new Error('Requested URL not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message || "server error"
        }
    })
})

module.exports = app;
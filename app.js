const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser')

const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const usersRoute = require('./routes/users');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header',
    'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Method', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).send({})
    }

    next();
});


app.use('/products', productsRoute);
app.use('/orders', ordersRoute);
app.use('/users', usersRoute)

app.use((req, res, next) => {
   const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        err: {
            msg: error.message
        }
    });
});

module.exports = app;
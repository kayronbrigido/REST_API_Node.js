const mysql = require('../mysql').pool;

exports.getOrders = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({error: error})
        }
        conn.query(
            'SELECT * FROM orders INNER JOIN products ON products.id_product = orders.id_product;',
            (error, result, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({error: error})
                }
                
                const response = {
                    quantity: result.length,
                    orders: result.map(order => {
                        return {
                            id_order: order.id_order,
                            id_product: order.id_product,
                            quantity: order.quantity,
                            request:{
                                type: 'GET',
                                description: 'Return a specific order',
                                url: 'http://localhost:3000/orders/'+ order.id_order
                            }
                        }
                    }) 
                }
                return res.status(200).send(response);
            }
        )
    });
}

exports.getOrderById = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error})
        }
        conn.query(
            'SELECT * FROM orders WHERE id_orders = (?)',
            [req.params.id_product],
            (error, result, field) => {
                conn.release();

                if (error){
                    return res.status(500).send({error: error})
                }

                if (result.length == 0){
                    return res.status(404).send({msg: "Order don't found"});
                }

                const response = {
                    product: {
                        id: result[0].id_product,
                        name: result.product_name,
                        price: result.product_price,
                        request:{
                            type: 'GET',
                            description: 'Return all orders',
                            url: 'http://localhost:3000/orders/'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        );
    });
}

exports.insertOrder = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({error: error})
        }

        conn.query('SELECT * FROM products WHERE  id_product = ?',
        [req.body.id_product],
        (error, result, field) => {

            if (error){
                return res.status(500).send({error: error})
            }

            if (result.length == 0){
                return res.status(404).send({error: '404 - Not Found'})
            }
        });

        conn.query('INSERT INTO orders(id_product, quantity) VALUES (?, ?)',
        [req.body.id_product, req.body.quantity],
        (error, result, field) => {
            conn.release();

            if (error){
                return res.status(500).send({error: error})
            }

            const response = {
                msg: 'Successful! Order inserted',
                product_inserted: {
                    id: result.id_product,
                    name: req.body.product_name,
                    price: req.body.product_price,
                    request:{
                        type: 'GET',
                        description: 'Return all orders',
                        url: 'http://localhost:3000/orders/'
                    }
                }
            }
            return res.status(201).send(response);
        });
    });
}

exports.deleteOrder = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error})
        }
        conn.query('DELETE FROM orders WHERE id_order = ?', [req.body.id_order],
        (error, result, field) => {
            conn.release();

            if(error){
                return res.status(500).send({error: error})
            }
            const response = {
                msg: 'Deleted order',
                request: {
                    type: 'POST',
                    description: 'Insert a order',
                    url: 'http://localhost:3000/orders/',
                    body: {
                        id_product: 'Number',
                        quantity: 'Number'
                    }
                }
            }
            res.status(202).send(response);
        });
    });
}
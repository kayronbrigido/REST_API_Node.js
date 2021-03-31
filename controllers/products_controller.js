const mysql = require('../mysql').pool;

exports.getAllProducts = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if (error){
            return res.status(500).send({error: error, response: null});
        }

        conn.query(
            'SELECT * FROM products',
            (error, result, field) => {
                conn.release();

                if (error){
                    return res.status(500).send({error: error, response: null});
                }
                const response = {
                    quantity: result.length,
                    products: result.map(prod => { 
                        return{
                            id: prod.id_product,
                            name: prod.product_name,
                            price: prod.product_price,
                            request:{
                                type: 'GET',
                                description: 'Return a specific product',
                                url: 'http://localhost:3000/products/' + prod.id_product
                            }
                        }
                    })
                }
                return res.status(200).send(response);    
             });
    });
}

exports.getProductById = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error, response: null});
        }
        conn.query(
            'SELECT * FROM products WHERE id_product = (?)',
            [req.params.id_product],
            (error, result, field) => {
                conn.release();

                if (error){
                    return res.status(500).send({error: error, response: null});
                }

                if (result.length == 0){
                    return res.status(404).send({msg: "Product don't found"})
                }

                const response = {
                    product: {
                        id: result[0].id_product,
                        name: result[0].product_name,
                        price: result[0].product_price,
                        url: result[0].img_product,
                        request:{
                            type: 'GET',
                            description: 'Return all products',
                            url: 'http://localhost:3000/products/'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        );
    });
}

exports.insertProduct = (req, res, next) => {
    console.log(req.file);
    mysql.getConnection((error, conn) =>{

        if (error){
            return res.status(500).send({error: error, response: null});
        }

        conn.query(
            'INSERT INTO products (product_name, product_price, img_product) VALUE (?, ?, ?)',
            [req.body.product_name, req.body.product_price, req.file.path],
            (error, result, field) => {
                conn.release();

                if (error){
                    return res.status(500).send({error: error, response: null});
                }

                const response = {
                    msg: 'Successful! Product inserted',
                    product_inserted: {
                        id: result.id_product,
                        name: req.body.product_name,
                        price: req.body.product_price,
                        img_product: req.file.path,
                        request:{
                            type: 'GET',
                            description: 'Return all products',
                            url: 'http://localhost:3000/products/'
                        }
                    }
                }
                return res.status(201).send(response);    
             });
    });
}

exports.updateProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            res.status(500).send({error: error});
        }
        conn.query(
            `UPDATE products 
                SET   product_name  = ?, 
                      product_price = ? 
                WHERE id_product    = ?`,

            [req.body.product_name,
             req.body.product_price, 
             req.body.id_product],

            (error, result, field) => {
                conn.release();

                if (error){
                    res.status(500).send({error: error, response: null})
                }

                const response = {
                    msg: 'Successful! Product updated',
                    product_updated: {
                        id: result.id_product,
                        name: req.body.product_name,
                        price: req.body.product_price,
                        request:{
                            type: 'GET',
                            description: 'Return product updated',
                            url: 'http://localhost:3000/products/' + req.body.id_product
                        }
                    }
                }

                res.status(202).send(response);
            });
    });
}

exports.deleteProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            res.status(500).send({error: error})
        }
        conn.query('DELETE FROM products WHERE id_product = ?', [req.body.id_product],
        (error, result, field) => {
            conn.release();

            if(error){
                res.status(500).send({error: error})
            }

            const response = {
                msg: 'Deleted product',
                request: {
                    type: 'POST',
                    description: 'Insert a order',
                    url: 'http://localhost:3000/products/',
                    body: {
                        product_name: 'String',
                        product_price: 'Number'
                    }
                }
            }

            res.status(202).send(response);
        });
    });
}
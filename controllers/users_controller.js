const bcrypt = require('bcrypt');
const mysql = require('../mysql').pool;
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error})
        }

        conn.query('SELECT * FROM users WHERE user_email = ?',
            [req.body.user_email],
            (error, result) => {
                conn.release()

                if(error){
                    res.status(500).send({error: error})
                }

                if(result.length > 0){
                    res.status(409).send({
                        msg: 'User already exists'
                    });
                }
                else{
                    bcrypt.hash(req.body.user_password, 10, (errBcrypt, hash) => {

                        if(errBcrypt){
                            return res.status(500).send({error: errBcrypt})
                        }
                    

                        conn.query('INSERT INTO users (user_email, user_password) VALUES (?, ?)',
                        [req.body.user_email, hash],
                        (error, result) => {
                            
                            if(error){
                                res.status(500).send({error: error})
                            }

                            const response = {
                                msg: 'Successful Registration',
                                user_created: {
                                    id: result.insertId,
                                    email: req.body.user_email
                                }
                            }

                            return res.status(201).send(response);
                        });
                    });
                }    
            });
        });
}


exports.signin = (req, res, next) => { 
    mysql.getConnection((error, conn) => {
        if(error){
            res.status(500).send({error: error})
        }

        conn.query('SELECT * FROM users WHERE user_email = ?',
        [req.body.user_email],

        (error, results) => {
            conn.release();
            if(error){
                return res.status(401).send({msg: 'unauthorized'})
            }
            

            bcrypt.compare(req.body.user_password, results[0].user_password, (errBcrypt, result) => {
                if (errBcrypt){
                    return res.status(401).send({msg: 'unauthorized'})
                }
                if (result){
                    const token = jwt.sign({
                        id: results[0].id_user,
                        email: results[0].user_email
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    })
                    return res.status(200).send({msg: 'Successful', token: token})
                }
                return res.status(401).send({msg: 'unauthorized'})
            });
        });
    });
}
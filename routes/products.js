const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');
const ProductsController = require('../controllers/products_controller');

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'uploads/');
    },
    filename: function(req, file, cb){
        let date = new Date().toISOString().replace(/:/g, '-') + '-'; // to Windows

        cb(null, date + file.originalname);
        // callback(null, new Date().toISOString + file.originalname); to MAC or Linux

    }
});

const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}



const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', ProductsController.getAllProducts);
router.get('/:id_product', ProductsController.getProductById);
router.post('/', upload.single('img_product'), login, ProductsController.insertProduct);
router.patch('/', login, ProductsController.updateProduct);
router.delete('/', login, ProductsController.deleteProduct);

module.exports = router;
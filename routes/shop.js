const express = require('express');
const router = express.Router();
const multer = require('multer');
const connectDb = require('../models/db');
const upload = multer({ dest: '../public/images/' }); 

router.get('/:cateId',async(req,res,next)=>{
  const db = await connectDb();
  const productCollection = db.collection('products');
  const categoriesCollection = db.collection('categories');
  const products = await productCollection.find().limit(30).toArray();
  const categories = await categoriesCollection.find().toArray();
  res.render('shop',{products, categories})
});





module.exports = router;

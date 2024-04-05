const express = require('express');
const router = express.Router();
const multer = require('multer');
const connectDb = require('../models/db');
const upload = multer({ dest: '../public/images/' }); 
/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
      const db = await connectDb();
      const categoriesCollection = db.collection('categories');
      const categories = await categoriesCollection.find().toArray();
      const productCollection = db.collection('products');
      const hotproducts = await productCollection.find({ hot: '1' }).limit(8).toArray();
      const iphoneproducts = await productCollection.find({ id_loai: '2' }).limit(4).toArray();
      res.render('index', { categories, hotproducts,iphoneproducts });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
// router.get('/:idCategories', async (req, res, next) => {
//   try {
//       const db = await connectDb();
//       const productCollection = db.collection('products');
//       let idcate = req.params.idCategories;
//       const filproduct = await productCollection.find({ id_loai: idcate }).limit(8).toArray();
//       res.render('index', {filproduct });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

















// Get sp theo id
// router.get('/', async (req, res, next) => {
//   const db = await connectDb();
//   const productCollection = db.collection('products');
//   const categoryId = req.params.categoryId;
//   const products = await productCollection.find({ categoryId: parseInt(categoryId) }).toArray();
//   if (products && products.length > 0) {
//       res.status(200).json(products);
//   } else {
//       res.status(400).json({ message: 'Not found' });
//   }
// });
module.exports = router;

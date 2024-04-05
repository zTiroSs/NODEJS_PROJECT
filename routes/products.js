const express = require('express');
const router = express.Router();
const multer = require('multer');
const connectDb = require('../models/db');
const upload = multer({ dest: '../public/images/' }); 

router.get('/',async(req,res,next)=>{
  const db = await connectDb();
  const productCollection = db.collection('products');
  const categoriesCollection = db.collection('categories');
  const products = await productCollection.find().toArray();
  const categories = await categoriesCollection.find().toArray();
  res.render('product',{products, categories})
});

// TRang Thêm sản phẩm
router.get('/add', async (req, res, next) => {
  const db = await connectDb();
  const categoriesCollection = db.collection('categories');
  const categories = await categoriesCollection.find().toArray();
  res.render('addPro', { categories });
});
// POST thêm sản phẩm
router.post('/add', upload.single('img'),async (req, res,next) => {
  const db = await connectDb();
  const productCollection=  db.collection('products');
  let {name, price ,categoryId ,description} = req.body;
  let img = req.file.originalname;
  // Tìm kiem51 sản phẩm sắp xếp theo id giảm dần và lấy phẩn tử đầu chính là phẩn tử có id lớn nhất
  let lastProduct = await productCollection.find().sort({id:-1}).limit(1).toArray();
  // Nếu product đã tồn tại thì lat5y61 id + 1 còn nếu kh tồn tại nghia4 là dữ liệu rỗng thì id bắt đầu là 1
  let id = lastProduct[0] ? lastProduct[0].id + 1 :1;
  let newProduct = {id,name,categoryId,img,description , price};
  // Chèn dau74 llieu65 vào database
  await productCollection.insertOne(newProduct);
  res.redirect("/products");
});

// Sửa sản phẩm
router.get('/edit/:id', async (req, res,next) => {
  const db = await connectDb();
  const productCollection=  db.collection('products');
  const categoriesCollection = db.collection('categories');
  let id = req.params.id;
  let product = await productCollection.findOne({id:parseInt(id)});
  const categories = await categoriesCollection.find().toArray();
  res.render('editPro', { product, categories });
});
// Post để sửa sản phẩm từ form
router.post('/edit', upload.single('img'), async (req, res,next) => {
  const db = await connectDb();
  let {id} = req.body;
  let productCollection = db.collection('products');
  let {name, price ,categoryId ,description} = req.body;
  let img = req.file ? req.file.originalname : req.body.imgOld;
  let editProduct = {name,price,categoryId,img,description};
  await productCollection.updateOne({id:parseInt(id)},{$set:editProduct});
  res.redirect("/products");
});
// Xóa sản phẩm
router.get('/delete/:id', async (req, res) => {
  let id = req.params.id;
  const db = await connectDb();
  let productCollection = db.collection('products');
  await productCollection.deleteOne({id:parseInt(id)});
  res.redirect("/products");
});





module.exports = router;

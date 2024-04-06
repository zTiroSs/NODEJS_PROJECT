const e = require('express');
const jwt = require ('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const connectDb = require('../models/db');
const { log } = require('debug/src/browser');
// const upload = multer({ dest: '../public/images/' }); 
//Thiết lập nơi lưu trữ và tên file
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './public/images')
    },
    filename: function (req, file, cb) {
    cb(null, file.originalname)
    }
    })
   //Kiểm tra file upload
   function checkFileUpLoad(req, file, cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
    return cb(new Error('Bạn chỉ được upload file ảnh'));
    }
    cb(null, true);
   }
   let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });
// Show sản phẩm
router.get('/products',async(req,res,next)=>{
    const db = await connectDb();
    const productCollection = db.collection('products');
    const products = await productCollection.find().toArray();
    // res.render('product')
    if(products){
        res.status(200).json(products);
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });
  // POST thêm sản phẩm
router.post('/products', upload.single('img'),async (req, res,next) => {
    let {name, price ,categoryId ,description, hot} = req.body;
    hot = parseInt(hot);
    if(hot != 0 && hot != 1){
        hot = 0;
    }
    let img = req.file.originalname;
    categoryId = parseInt(categoryId);
    const db = await connectDb();
    const productCollection=  db.collection('products');
    let lastProduct = await productCollection.find().sort({id:-1}).limit(1).toArray();
    let id = lastProduct[0] ? lastProduct[0].id + 1 :1;
    let newProduct = {id,name,categoryId,img,description , price, hot};
    await productCollection.insertOne(newProduct);
    if(newProduct){
        res.status(200).json({message:"Đã thêm sản phẩm",newProduct});
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });
// Sửa sản phẩm
  router.put('/products/:id', upload.single('img'), async (req, res,next) => {
    let id = req.params.id;  
    const db = await connectDb();
    let productCollection = db.collection('products');
    let {name, price ,categoryId ,description, hot} = req.body;
    hot = parseInt(hot);
    if(hot != 0 && hot != 1){
        hot = 0;
    }
    if(req.file){
        var img = req.file.originalname;
    }
    else{
        let product= await productCollection.findOne({id:parseInt(id)});
        var img = product.img;
    }
    let editProduct = {name,price,categoryId,img,description, hot};
    product = await productCollection.updateOne({id:parseInt(id)},{$set:editProduct});
    if(product){
        res.status(200).json(editProduct);
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });
// Chi tiết sản phẩm
router.get('/products/:id', async (req, res, next) => {
    try {
        const db = await connectDb();
        const productCollection = db.collection('products');
        const thuoctinhCollection = db.collection('thuoc_tinh');
        let id = req.params.id;
        let product = await productCollection.findOne({ id: parseInt(id) });
        if (product) {
            let thuoc_tinh = await thuoctinhCollection.findOne({id_sp: id})
            let result = {
                product: product,
                thuoc_tinh: thuoc_tinh
            };
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'Thuộc tính not found' }); // Thay đổi status code và thông báo
            }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
  // Lấy danh sách sản phẩm theo tên category
//   router.get('/products/categorybyName/:categoryName', async (req, res, next) => {
//     const db = await connectDb();
//     const productCollection = db.collection('products');
//     const categoriesCollection = db.collection('categories');
//     const categoryName = req.params.categoryName;
//     const category = await categoriesCollection.findOne({ ten_loai: categoryName });
//     if (category) {
//         const products = await productCollection.find({ categoryId: category.id }).toArray();
//         if (products && products.length > 0) {
//             res.status(200).json(products);
//         } else {
//             res.status(400).json({ message: 'Products not found for this category' });
//         }
//     } else {
//         res.status(400).json({ message: 'Category not found' });
//     }
// });
// router.get('/thuoc_tinh/:idSP',async(req,res,next)=>{
//     const db = await connectDb();
//     const thuoctinhCollection = db.collection('thuoc_tinh');
//     let id = req.params.idSP;
//     const thuoc_tinh = await thuoctinhCollection.findOne({id_sp: id});
//     // res.render('product')
//     if(thuoc_tinh){
//         res.status(200).json(thuoc_tinh);
//     }
//     else{
//         res.status(400).json({message: 'Not found'});
//     }
//   });
//   Xóa sản phẩm
router.delete('/products/:id',async(req,res,next)=>{
    const db = await connectDb();
    const productCollection = db.collection('products');
    let id = req.params.id;
    const product = await productCollection.deleteOne({id: parseInt(id)});
    // res.render('product')
    if(product){
        res.status(200).json({message:"Xóa thành công"});
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });

// Xóa toàn bộ sản phẩm
router.delete('/products/del/all', async (req, res, next) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    const { deletedCount } = await productCollection.deleteMany();
    if (deletedCount > 0) {
        res.status(200).json({ message: `Đã xóa ${deletedCount} sản phẩm` });
    } else {
        res.status(400).json({ message: 'Không có sản phẩm để xóa' });
    }
});
  //   Show danh mục
router.get('/categories',async(req,res,next)=>{
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    const categories = await categoriesCollection.find().toArray();
    // res.render('product')
    if(categories){
        res.status(200).json(categories);
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });
  // POST thêm danh mục
  router.post('/categories', upload.single('img'),async (req, res,next) => {
    let {ten_loai} = req.body;
    let img = req.file.originalname;
    const db = await connectDb();
    const categoriesCollection=  db.collection('categories');
    let lastCategory = await categoriesCollection.find().sort({id:-1}).limit(1).toArray();
    let id = lastCategory[0] ? lastCategory[0].id + 1 :1;
    let newCategory = {id, ten_loai,img};
    try {
        await categoriesCollection.insertOne(newCategory);
        res.status(201).json(newCategory); // Trả về người dùng mới được tạo
    } catch (error) {
        res.status(500).json({ message: 'Failed to add user' });
    }
  });
// Sửa danh mục
router.put('/categories/:id', upload.single('img'), async (req, res,next) => {
    let id = req.params.id;  
    const db = await connectDb();
    let categoriesCollection = db.collection('categories');
    let {ten_loai} = req.body;
    if(req.file){
        var img = req.file.originalname;
    }
    else{
        let category= await categoriesCollection.findOne({id:parseInt(id)});
        img = category.img;
    }
    let editCategory = {ten_loai,img};
    category = await categoriesCollection.updateOne({id:parseInt(id)},{$set:editCategory});
    if(category){
        res.status(200).json(editCategory);
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });
// Chi tiết danh mục
router.get('/categories/:id',async(req,res,next)=>{
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    let id = req.params.id;
    const category = await categoriesCollection.findOne({id: parseInt(id)});
    if(category){
        res.status(200).json(category);
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });
//   Xóa danh mục
router.delete('/categories/:id',async(req,res,next)=>{
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    let id = req.params.id;
    const category = await categoriesCollection.deleteOne({id: parseInt(id)});
    if(category){
        res.status(200).json({message:"Xóa thành công"});
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });
//   Show danh sách người dùng
  router.get('/users',async(req,res,next)=>{
    const db = await connectDb();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find().toArray();
    if(users){
        res.status(200).json(users);
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });
// POST thêm người dùng
router.post('/users',  upload.single('img'), async (req, res, next) => {
    let { name, SDT, diachi, username, password, email } = req.body;
    const db = await connectDb();
    const usersCollection = db.collection('users');
    let lastUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
    let id;
    if (lastUser && lastUser[0] && typeof lastUser[0].id === 'number') {
        id = lastUser[0].id + 1;
    } else {
        id = 1; 
    }
    let newUser = { id, name, SDT, diachi, username, password, email };
    try {
        await usersCollection.insertOne(newUser);
        res.status(201).json(newUser); 
    } catch (error) {
        res.status(500).json({ message: 'Failed to add user' });
    }
});
// Sửa user
router.put('/users/:id', upload.single('img'), async (req, res,next) => {
    let id = req.params.id;  
    const db = await connectDb();
    let usersCollection = db.collection('users');
    let {name, SDT, diachi, username, password, email} = req.body;
    let editUser = {name, SDT, diachi, username, password, email};
    user = await usersCollection.updateOne({id:parseInt(id)},{$set:editUser});
    if(user){
        res.status(200).json(editUser);
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });











//   Xóa danh mục
router.delete('/users/:id',async(req,res,next)=>{
    const db = await connectDb();
    const usersCollection = db.collection('users');
    let id = req.params.id;
    const user = await usersCollection.deleteOne({id: parseInt(id)});
    if(user){
        res.status(200).json({message:"Xóa thành công"});
    }
    else{
        res.status(400).json({message: 'Not found'});
    }
  });
  // Lấy danh sách sản phẩm theo ID category
router.get('/products/categorybyID/:categoryId', async (req, res, next) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    const categoryId = req.params.categoryId;
    const products = await productCollection.find({ id_loai: parseInt(categoryId) }).toArray();
    if (products && products.length > 0) {
        res.status(200).json(products);
    } else {
        res.status(400).json({ message: 'Not found' });
    }
});
  // Lấy danh sách sản phẩm theo tên category
  router.get('/products/categorybyName/:categoryName', async (req, res, next) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');
    const categoryName = req.params.categoryName;
    const category = await categoriesCollection.findOne({ ten_loai: {$regex: categoryName, $options: 'i'} });
    if (category) {
        const products = await productCollection.find({ id_loai: category.id}).toArray();
        if (products && products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(400).json({ message: 'Khong co san pham' });
        }
    } else {
        res.status(400).json({ message: 'Category not found' });
    }
});

// Lấy sản phẩm theo trang và số lượng
router.get('/products/page/:page/limit/:limit', async (req, res, next) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    // Lấy trang và số lượng sản phẩm từ query parameters
    // Số sản phẩm trong danh sách
    let sp = await productCollection.countDocuments();
    // Đặt mặc định số sản phẩm mỗi trang là 5
    // const limit = parseInt(req.query.limit) || 5;
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let intPage = Math.ceil(sp / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    try {
        const products = await productCollection.find().skip(startIndex).limit(limit).toArray();
        if (products && products.length > 0) {
            res.status(200).json({
                currentPage: page,
                totalPages: Math.ceil(sp / limit),

                products: products
            });
        } else {
            res.status(400).json({ message: 'Không có sản phẩm ở trang này' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm', error: error });
    }
});
// Tìm kiếm sản phẩm
router.get('/products/search/:name', async (req, res, next) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    const name = req.params.name;
    const products = await productCollection.find({ ten_sp: {$regex: name, $options: 'i'} }).toArray();
    if (products && products.length > 0) {
        res.status(200).json(products);
    } else {
        res.status(400).json({ message: 'Không có sản phẩm này' });
    }
});
// Lấy danh sách sản phẩm và sắp xếp theo tăng dần về giá và giới hạn số lượng
router.get('/products/sort/:filter/limit/:limit', async (req, res, next)=>{
    try {
        const db = await connectDb();
        const productCollection = db.collection('products');
        const limit = parseInt(req.params.limit);
        let filter = req.params.filter;
        let products
        if(filter == 'asc'){
            products = await productCollection.find().sort({ gia: 1 }).limit(limit).toArray();
        }
        else{
            products = await productCollection.find().sort({ gia: -1 }).limit(limit).toArray();
        }
        if (products && products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: 'Không có sản phẩm nào' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm', error: error.message });
    }
})
//Chức năng đăng ký tài khoản mã hóa mật khẩu bằng bcrypt
router.post('/user/register', upload.single('img'), async(req, res, next)=>{
    let {name, username, password, email} = req.body;
    const db = await connectDb();
    const userCollection = db.collection('users');
    let checkemail = await userCollection.findOne({email: email});
    let checkusername = await userCollection.findOne({username: username});
    
    if(checkemail || checkusername){
        res.status(409).json({message: "Email hoặc Tên người dùng đã tồn tại"});
    } 
    else {
        let lastuser = await userCollection.find().sort({id: -1}).limit(1).toArray();
        let id = lastuser[0] ? lastuser[0].id + 1 : 1;
        const salt = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(password, salt);
        let newUser = {
            id: id,
            name: name,
            username: username,
            password: hashPassword,
            email: email,
            vaitro: "1",
            trangthai: "1"
        };
        let result = await userCollection.insertOne(newUser);
        
        if(result){
            res.status(200).json({message: "Đăng ký thành công"});
        } else {
            res.status(500).json({message: "Lỗi"});
        }
    }
});
// Chức năng đăng nhập có sử dụng token
router.post('/user/login', upload.single('img'), async (req, res, next) => {
    let { username, password } = req.body;
    const db = await connectDb();
    const userCollection = db.collection('users');
    const user = await userCollection.findOne({ username: username });
    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, 'vinh', { expiresIn: '300s' });
            res.status(200).json({ token: token });
        } else {
            res.status(403).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }
    } else {
        res.status(403).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
});

// Middleware xác thực token
function authenToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, 'vinh', (err, authData) => {
            if (err) {
                return res.status(403).json({ message: 'Không có quyền truy cập!' });
            } else {
                next();
            }
        });
    } else {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
}

// router.get('/products/filter/hot', async (req, res) => {
router.get('/products/filter/hot', authenToken, async (req, res) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    const products = await productCollection.find({ hot: '1' }).toArray();
    if (products && products.length > 0) {
        res.status(200).json(products);
    } else {
        res.status(400).json({ message: 'Không có sản phẩm hot' });
    }
});

router.get('/products/filter/view', async (req, res) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    const products = await productCollection.find().sort({xem: -1}).toArray();
    if (products && products.length > 0) {
        res.status(200).json(products);
    } else {
        res.status(400).json({ message: 'Không lấy được sản phẩm nào!' });
    }
});

// Chi tiết user
router.get('/users/:id',async(req,res,next)=>{
    const db = await connectDb();
    const usersCollection = db.collection('users');
    let id = req.params.id;
    const user = await usersCollection.findOne({id: parseInt(id)});
    if(user){
        res.status(200).json(user);
    }
    else{
        res.status(400).json({message: 'Khong tim thay'});
    }
  });
  router.get('/user/me', authenToken, async (req, res) => {
    const bearerHeader = req.headers['authorization'];
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
    try {
        const decoded = jwt.verify(token, 'vinh');
        const db = await connectDb();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username: decoded.username });
        if (user) {
            res.status(200).json(user);
        } else {
            console.log(token);
            console.log(decoded);
            // res.status(404).json({ message: 'Không tìm thấy thông tin user' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
});


//Đổi pass
// router.put('/api/user/changepass/:id',async (req, res) => {
//     let newPassword = req.body.password; // Lấy mật khẩu mới từ body của yêu cầu
//     let id = req.params.id;
//     const db = await connectDb();
//     const userCollection = db.collection('users');
//     let user = await userCollection.findOne({ id: id });
//     if (!user) {
//         return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }
//     else{
//         user.password = newPassword;
//         let newPass = bcrypt.hashSync(newPassword,salt);
//         let updateUser = {
//             password: newPass
//         };
//         let result = await userCollection.insertOne(updateUser);
//         if(result){
//             res.status(200).json({message: "Đổi mật khẩu thành công"});
//         } else {
//             res.status(500).json({message: "Lỗi"});
//         }
//     }
//     return res.status(200).json({ message: 'Mật khẩu đã được cập nhật' });
// });

module.exports = router;
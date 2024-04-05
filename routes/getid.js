const connectDb = require('../models/db');

const updateIds = async () => {
    const db = await connectDb();  // Thêm dấu () sau connectDb để gọi hàm

    const cursor = db.collection('products').find();

    await cursor.forEach(async function(doc) {
        const id = parseInt(doc.id_loai);
        await db.collection('products').updateOne({ _id: doc._id }, { $set: { id_loai: id } });
    });

    console.log('Đã cập nhật ID thành số nguyên.');
}

// Gọi hàm updateIds
updateIds().catch(err => {
    console.error('Có lỗi xảy ra:', err);
});

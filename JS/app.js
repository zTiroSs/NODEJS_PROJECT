// Dinh dang ngày tháng - giá
function format(sp){
    let {gia, ngay, giam_gia} = sp;
    var giafm = Number(sp.gia).toLocaleString("vi");
    var sale = parseInt(sp.giam_gia);
    var datefm = new Date(sp.ngay).toLocaleDateString('vi');
    return { giafm, sale, datefm };
}
// Category
const hienmenu =  () => 
fetch('http://localhost:3000/api/categories')
.then(res => res.json())
.then (loai_arr=>{
    let str = `
    <a href="index.html">Trang chủ</a>
    <a href="shop.html">Cửa hàng</a>`;
    loai_arr.forEach(categories => {
        str+=`<a href=shop.html?id=${categories.id}  onclick="handleClick(${categories.id})">${categories.ten_loai}</a>`;        
    })
    document.querySelector(".menu").innerHTML=str; 
})

// Iphone
const hienip = () =>
fetch('http://localhost:3000/api/products/categorybyID/2')
.then(res => res.json())
.then(san_pham_arr=>{
    let spmoi_arr =  san_pham_arr.filter(   (sp,index)=> index <  4);
    let str=``;
    spmoi_arr.forEach(  sp =>{
            let { giafm, sale, datefm } = format(sp);
            var nameup = sp.ten_sp.toUpperCase();
            if(sale !== 0 ){
                var giasale = Number(sp.gia-sp.gia*(sale/100)).toLocaleString("vi");
                var textgia = `
                    <h4><del>${giafm}đ</del> ${giasale}đ</h4>
                `;
            }
            
            else{
                var textgia = `
                <h4>${giafm}đ</h4>
            `;
            }
            str+= `<div class="sp">
            <div class="check">
            <span>
                <button onclick="addtoCart(${sp.id})"><i class="fa-solid fa-bag-shopping"></i></button>
            </span>
            <span>
                <button href=""><i class="fa-solid fa-heart"></i></button>
            </span>
            </div>
            <a href="chitiet.html?id=${sp.id}">            <img src="${sp.hinh}">
            </a>

            <p>${sp.ten_sp}</p>
            <a class="more" href="chitiet.html?id=${sp.id}">+ Xem thông tin</a>
            ${textgia}
            </div>`
        })
            // <button onclick="addtoCart(${sp.id})">            Thêm vào giỏ
            // </button>
        document.getElementById('iphone').innerHTML =
        `<div class='listsp_ip'>
          <h2>Các dòng iPhone</h2>
          <p>Hãy chọn ngay 1 chiếc iPhone cho riêng bạn!</p>
          <div id="data">${str}</div>
      </div>`;
})


// Kệ hàng
const hienprox = id =>
fetch(`http://localhost:3000/api/products/categorybyID/${id}`)
.then(res => res.json())
.then(san_pham_arr=>{
    let spmoi_arr =  san_pham_arr.filter(   (sp,index)=> index <  5);
    let str=``;
    spmoi_arr.forEach(  sp =>{
            let { giafm, sale, datefm } = format(sp);
            var nameup = sp.ten_sp.toUpperCase();
            if(sale !== 0 ){
                var giasale = Number(sp.gia-sp.gia*(sale/100)).toLocaleString("vi");
                var textgia = `
                    <h4><del>${giafm}đ</del> ${giasale}đ</h4>
                `;
            }
            else{
                var textgia = `
                <h4>${giafm}đ</h4>
            `;
            }
            str+= `<div class="sp">
            <div class="check">
            <span>
                <button onclick="addtoCart(${sp.id})"><i class="fa-solid fa-bag-shopping"></i></button>
            </span>
            <span>
                <button href=""><i class="fa-solid fa-heart"></i></button>
            </span>
            </div>
            <a href="chitiet.html?id=${sp.id}">            <img src="${sp.hinh}">
            </a>
            <p>${sp.ten_sp}</p>
            <a class="more" href="chitiet.html?id=${sp.id}">+ Xem thông tin</a>
            ${textgia}
            </div>`
        })
            // <button onclick="addtoCart(${sp.id})">            Thêm vào giỏ
            // </button>
        document.getElementById('product').innerHTML =
        `<div class='listsp_products'>
          <div id="data">${str}</div>
      </div>`;
})





const hiensale = () =>
fetch(`http://localhost:3000/api/products/filter/hot`)
.then(res => res.json())
.then(san_pham_arr=>{
    let spmoi_arr =  san_pham_arr.filter(   (sp,index)=> index <  8);
    let str=``;
    spmoi_arr.forEach(  sp =>{
            let { giafm, sale, datefm } = format(sp);
            var nameup = sp.ten_sp.toUpperCase();
            if(sale !== 0 ){
                var giasale = Number(sp.gia-sp.gia*(sale/100)).toLocaleString("vi");
                var textgia = `
                    
                    <h4><del>${giafm}đ</del>  ${giasale}đ</h4>
                `;
                var tag = `
                <div class="hot-tag">
                    HOT!!!
                </div>
                <div class="sale_off">
                    ${sp.giam_gia}%
                </div>
                `
            }
            else{
                var textgia = `
                <h4>${giafm}đ</h4>
            `;
            var tag = `
            <div class="hot-tag">
                HOT!!!
            </div>
            `
            }
            str+= `<div class="sp">
            ${tag}
            <div class="check">
            <span>
                <button onclick="addtoCart(${sp.id})"><i class="fa-solid fa-bag-shopping"></i></button>
            </span>
            <span>
                <button href=""><i class="fa-solid fa-heart"></i></button>
            </span>
            </div>
            <a href="chitiet.html?id=${sp.id}"> <img src="${sp.hinh}">
            </a>

            <p>${sp.ten_sp}</p>
            <a class="more" href="chitiet.html?id=${sp.id}">+ Xem thông tin</a>
            ${textgia}
            </div>`
        })
        document.getElementById('sale-products').innerHTML =
        `<div class='sale_products'>
          <div id="data">${str}</div>
      </div>`;
    })


// Chi tiết sản phẩm



const chitietsp = async id => {
    const sp = await fetch (`http://localhost:3000/api/products/${id}`)
    .then (res => res.json())
    .then (d=>d);
    const { product, thuoc_tinh } = sp;
    console.log(sp);
    let { giafm, sale, datefm } = format(product);
    let textgia = '';
    if(sale !== 0 ){
        var giasale = Number(product.gia-product.gia*(sale/100)).toLocaleString("vi");
        textgia = `
            <del>${giafm}đ</del> <strong>${giasale}đ</strong>
        `;
    } else {
        textgia = `
            <h4>${giafm}VND</h4>
        `;
    }

    let str = `
        <div id='left'>
            <img src="${product.hinh}">
        </div>
        <div id='right'>
            <h2>${product.ten_sp} </h2>
            <p class="price">Giá: ${textgia}</p>
            <div class="support">
                <a href=""><i class="fa-solid fa-truck-fast"></i>Vận chuyển</a>
                <a href="#" onclick="return showform()"><i class="fa-solid fa-envelope"></i>Hỗ trợ</a>
            </div>
            <p>RAM: <strong>${thuoc_tinh.ram}</strong></p>
            <p>Màu sắc: <strong>${product.mau_sac}</strong></p>
            <p>CPU: <strong>${thuoc_tinh.cpu}</strong></p>
            <p>SIM: <strong>${thuoc_tinh.sim}</strong></p>
            <p>BLUE TOOTH: <strong>${thuoc_tinh.blue_tooth}</strong></p>
            <h3 class="quality"><button onclick="down()">-</button> <strong id="quality">1</strong> <button onclick="up()">+</button></h3>
            <button class="buyNow" onclick="addtocart(${sp.id})">Mua ngay</button>
            <button class="addCart" onclick="addtocart(${sp.id})"><i class="fa-solid fa-bag-shopping"></i></button>
            <button class="addLove" onclick="addtocart(${sp.id})"><i class="fa-regular fa-heart"></i></button>
        </div>
    `;

    document.querySelector('main').innerHTML = `
        <div class="detail">
            <div id="detail">${str}</div>
        </div>
    `;
}


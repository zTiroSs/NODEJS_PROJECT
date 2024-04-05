const loadMenu =  () => 
fetch('http://localhost:3000/api/categories')
.then(res => res.json())
.then (loai_arr=>{
    let str = ``;
    loai_arr.forEach(categories => {
        str+=`
        <li><a href="#" onclick="handleClick(${categories.id})">${categories.ten_loai}</a></li>
        `;        
    })
    document.getElementById("list1").innerHTML+=str; 
})
const getAllProducts = () =>{
fetch(`http://localhost:3000/api/products`)
.then(res => res.json())
.then(san_pham_arr=>{
    let spmoi_arr =  san_pham_arr.filter(   (sp,index)=> index <  20);
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
        `<div class='listsp_ip'>
          <div id="data">${str}</div>
      </div>`;
});
}

const getBycategory = (id) =>{
    fetch(`http://localhost:3000/api/products/categorybyID/${id}`)
    .then(res => res.json())
    .then(san_pham_arr=>{
        let spmoi_arr =  san_pham_arr.filter(   (sp,index)=> index <  20);
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
            `<div class='listsp_ip'>
              <div id="data">${str}</div>
          </div>`;
    });
    }
                    <div id="product">
                        <div class='listsp_products'>
                            <div id="data">
                                <% for(let fil_p of filproduct) { %>
                                <div class="sp">
                                    <div class="check">
                                    <span>
                                        <button onclick=""><i class="fa-solid fa-bag-shopping"></i></button>
                                    </span>
                                    <span>
                                        <button href=""><i class="fa-solid fa-heart"></i></button>
                                    </span>
                                    </div>
                                    <a href="chitiet.html?id=<%= fil_p.ten_sp %>">            <img src="<%= fil_p.hinh %>">
                                    </a>
                                    <p><%= fil_p.hinh %></p>
                                    <a class="more" href="chitiet.html?id=<%= fil_p.ten_sp %>">+ Xem thông tin</a>
                                    <% if (Number(fil_p.giam_gia) !== 0) { %>
                                        <% var giasale = Number(fil_p.gia - fil_p.gia * (fil_p.giam_gia / 100)).toLocaleString("vi"); %>
                                        <h4><del><%= Number(fil_p.gia).toLocaleString("vi") %>VND</del> <%= giasale %>VND</h4> 
                                    <% } else { %>
                                        <h4><%=Number (fil_p.gia).toLocaleString("vi") %>VND</h4> 
                                    <% } %>
                                    </div>
                                    <% } %>
                            </div>
                        </div>
                    </div>
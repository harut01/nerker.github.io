const urlParams = url_params();

function initProductCategories(){
    call("/getProductCategories").then((data)=>{
        if(data.resp.length == 0){
            $("#fh5co-work-section").css({"margin-left":(100/12)+"%"});
            $("#categories_menu").hide();
        }
        else{
            let menu = $("#cssmenu");
            multiLevelCategoryMenu(menu,data.resp);
        }
    })
}

let categoryMenu = $('.categoryMenu');
let categoryMenuCord = categoryMenu.offset().top;
let workSect = $("#fh5co-work-section");
let workSectCord = workSect.height();


if($(window).scrollTop()>categoryMenuCord-10 && $(window).scrollTop()<workSect.height()+10 ) categoryMenu.addClass('fixed').css({"top":"80px"});
else categoryMenu.removeClass('fixed').css({"top":""});

$(window).scroll(function(){
    if($(window).scrollTop()>categoryMenuCord - 10 && $(window).scrollTop()<workSect.height()+10 ) categoryMenu.addClass('fixed').css({"top":"80px"});
    else categoryMenu.removeClass('fixed').css({"top":""});
})

function multiLevelCategoryMenu(cont,items){
    let ul = $("<ul>").appendTo($(cont));
    for(let i in items){
        let item = items[i];

        let li =  $("<li>").appendTo(ul);
        if(i==items.length-1) li.addClass("last");

        if(urlParams.c == item["ID"]) li.addClass("active");

        let a = $("<a>").attr({"href":"products.html?c="+item["ID"]}).appendTo(li);
        $("<span>").text(item["category_name"]).appendTo(a);

        if(item.children.length > 0){
            li.addClass("has-sub");
            multiLevelCategoryMenu(li,item.children);
        }
    }
}

function initProducts(){
    let params = {};

    if(urlParams.c){
        params["c"] = urlParams.c;
    }

    call("/getProducts",params).then((data)=>{
        let cont = $(".products_container");
        fillProducts(data,cont);
    })
}

function fillProducts(data,cont){
    let l = data.resp.length;
    
    for(let i = 0;i < l;i++){
        let product = data.resp[i];

        let item = $("<div>").addClass("product_cont col-lg-2 col-md-3 col-sm-6 animate-box").appendTo(cont);
        let a = $("<a>").attr({"href":"product.html?i="+product.ID}).addClass('item-grid ').appendTo(item);
        let img = $("<div>").addClass('img product').css({"background-image":"url("+sURL+pathToFiles+product.img1 +")","height":item.width()+"px"}).appendTo(a);
        let infoDiv = $("<div>").addClass('pdg-l').appendTo(a);
        let name = $("<h3>").text(product.name).appendTo(infoDiv);
        let price = $("<h4>").addClass("product_price").text(valute+product.price).appendTo(infoDiv);
        let mark = $("<h4>").html(getStars(product.mark/product.markCount)).appendTo(infoDiv);
    }
    contentWayPoint();
}

var searchTimeout;

$("#productSearch").on("keyup paste",function(e){
    console.log(e)
    clearTimeout(searchTimeout);
    let params = {};
    if(urlParams.c){
        params["c"] = urlParams.c;
    }
    params['q'] = $(this).val();

    searchTimeout = setTimeout(function(){
        call("/getProducts",params).then((data)=>{
            let cont = $(".products_container");
            cont.html("");
            fillProducts(data,cont);
        })
    },300);
})

function getStars(rating) {

    
  rating = Math.round(rating * 2) / 2;
  let output = [];

  // Append all the filled whole stars
  for (var i = rating; i >= 1; i--)
    output.push('<i class="fa fa-star rating-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  // If there is a half a star, append it
  if (i == .5) output.push('<i class="fa fa-star-half-o rating-star"   aria-hidden="true" style="color: gold;"></i>&nbsp;');

  // Fill the empty stars
  for (let i = (5 - rating); i >= 1; i--)
    output.push('<i class="fa fa-star-o rating-star"   aria-hidden="true" style="color: gold;"></i>&nbsp;');

  return output.join('');

}

$(window).resize(()=>{
   $('.product').css({"height":$('.product_cont').width()}); 
})

$(function(){
    initProductCategories();
    initProducts();
});
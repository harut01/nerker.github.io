var product_id = null;

function getProduct(){
    let id = url_params().i;
    product_id = id;
    call("/getProduct",{id:id}).then((data)=>{
        console.log(data);
        initSlider($("#product_imgs_slide"),data.resp);
        initProductInfo(data.resp[0]);
        productsFromProducer(data.resp[0].producer_id,data.resp[0].ID);
        productsWithSameCategory(data.resp[0].category_id,data.resp[0].ID);
    })
}

function initProductInfo(data){
    let cont = $(".product_info");
    let name = $("<h3>").text(data.name).css({"font-size":"30px"}).addClass('product_name').append($("<span>").addClass('small').text("  by " + data.producer_name)).appendTo(cont);
    let description = $("<p>").addClass("desc_p").text(data.description).appendTo(cont);
    let price = $("<p>").addClass('big').text("Price: " + data.price).appendTo(cont);
    let category = $("<p>").addClass('big').text("Category: " +data.category_name).appendTo(cont);
    let rating = $("<div>").attr("id","product_mark").addClass('big').html(getStars(data.mark/data.markCount)).appendTo(cont);

    let markFeedBack = $("<div>").text("thanks").addClass("tooltiptext").appendTo($("body"));

    $(".rating-star").on("click",function(e){
        
        markProduct($(this).attr("mark"));
        var x = e.pageX - e.target.offsetLeft;
        var y = e.pageY - e.target.offsetTop;
        markFeedBack.css({"top":(y+15)+"px","left":(x+5)+"px"})
        markFeedBack.show();
        setTimeout(function(){
            markFeedBack.fadeOut(1000);
        },2000)
    })

    $(".producer_name").text(data.producer_name);
    $(".category_name").text(data.category_name);
}


function getStars(rating) {
        
    rating = Math.round(rating * 2) / 2;    
    let output = [];
    let item = 0;
    
    for (var i = rating; i >= 1; i--){
        item++;
        output.push('<i class="fa fa-star rating-star" mark="'+item+'"  aria-hidden="true" style="color: gold;"></i>&nbsp;');
    }
    
    if (i == .5){
        item++;
        output.push('<i class="fa fa-star-half-o rating-star" mark="'+item+'" aria-hidden="true" style="color: gold;"></i>&nbsp;');
    }
    
    for (let i = (5 - rating); i >= 1; i--){
        item++;
        output.push('<i class="fa fa-star-o rating-star"  mark="'+item+'" aria-hidden="true" style="color: gold;"></i>&nbsp;');
    }

    return output.join('');
    
}

function markProduct(m){
    if(product_id!=0){
        let mark = $("#product_mark").html("");
        mark.html(getStars(m,0));
        call("/markProduct",{"mark":m,"id":product_id}).then(data=>{
        })
    }
}

function productsWithSameCategory(category_id,id){
    call("/products_with_same_category",{category_id:category_id,id:id}).then((data)=>{
        let row = $(".sameCategory .products > .row");
        let cont = $("<div>").addClass('horizontal-scroll-wrapper rectangles ').appendTo(row);
        for(let i in data.resp){
            let item = data.resp[i];
            let item_cont = $("<div>").addClass('col-md-2').appendTo(cont);
                let item_price_box = $("<div>").addClass('price-box').appendTo(item_cont);
                    let item_name = $("<h2>").addClass('pricing-plan').text(item.name).appendTo(item_price_box);
                    let item_price = $("<div>").addClass('price product-pg-price').html('<sup class="currency">$</sup>' + item.price).appendTo(item_price_box);
                    let item_img_cont = $("<div>").appendTo(item_price_box);
                        let item_img = $("<img>").attr({"src":`${sURL+pathToFiles+item.img1}`,"width":"150px","height":"150px"}).appendTo(item_img_cont);
                    let item_link = $("<a>").addClass('btn btn-select-plan btn-sm mrg-t').text('View').attr('href','product.html?i='+item.ID).appendTo(item_price_box);
        }
        cont.css({"max-height":(row.width()/10*8)+"px","margin-left":(-row.width()/10)+"px"});
        row.css({"height":cont.width()+"px"});
        $(window).resize(function(){
            cont.css({"max-height":(row.width()/10*8)+"px","margin-left":(-row.width()/10)+"px"});
            row.css({"height":cont.width()+"px"});
        })
    })
}

function productsFromProducer(producer_id,id){
    call("/products_from_produces",{producer_id:producer_id,id:id}).then((data)=>{
        let row = $(".sameProducer .products > .row");
        let cont = $("<div>").addClass('horizontal-scroll-wrapper rectangles ').appendTo(row);
        for(let i in data.resp){
            let item = data.resp[i];
            let item_cont = $("<div>").addClass('col-md-2').appendTo(cont);
                let item_price_box = $("<div>").addClass('price-box').appendTo(item_cont);
                    let item_name = $("<h2>").addClass('pricing-plan').text(item.name).appendTo(item_price_box);
                    let item_price = $("<div>").addClass('price product-pg-price').html('<sup class="currency">$</sup>' + item.price).appendTo(item_price_box);
                    let item_img_cont = $("<div>").appendTo(item_price_box);
                        let item_img = $("<img>").attr({"src":`${sURL+pathToFiles+item.img1}`,"width":"150px","height":"150px"}).appendTo(item_img_cont);
                    let item_link = $("<a>").addClass('btn btn-select-plan btn-sm mrg-t').text('View').attr('href','product.html?i='+item.ID).appendTo(item_price_box);
        }
        cont.css({"max-height":(row.width()/10*8)+"px","margin-left":(-row.width()/10)+"px"});
        row.css({"height":cont.width()+"px"});
        $(window).resize(function(){
            cont.css({"max-height":(row.width()/10*8)+"px","margin-left":(-row.width()/10)+"px"});
            row.css({"height":cont.width()+"px"});
        })
        // row.append($("<div>").css({"height": cont.width()+"px"}))
    })
}


$(function(){
    getProduct();
});
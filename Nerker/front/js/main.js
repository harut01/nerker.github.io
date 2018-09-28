var company = "My company";

var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
		BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
		iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
		Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
		Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
		any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};
(function () {
	
	'use strict';
	$(function(){
		//created functions
		initMenu();
		initFooter();
		contentWayPoint();
		other();
		// initBestProducts();
		//template functions
		fullHeight();
		initWidth();
		sliderMain();
		centerBlock();
		responseHeight()
		mobileMenuOutsideClick();
		// offcanvasMenu();
		burgerMenu();
		toggleBtnColor();
		// contentWayPoint(); realized in initBestProducts
	});


}());



var fullHeight = function() {
	
	if ( !isMobile.any() ) {
		$('.js-fullheight').css('height', $(window).height());
		$('.js-3-4-height').css('height',$(window).height()/4*3);
		$('.js-1-2-height').css('height',$(window).height()/2);
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
			$('.js-3-4-height').css('height',$(window).height()/4*3);
			$('.js-1-2-height').css('height',$(window).height()/2);
		});
	}

};

function initWidth(){
	if(!isMobile.any()){
		if($(window).width() > 750){
			$('.half-width').css({'width':$(window).width()/2,"margin-left":"20px"});
		}
		else{
			$('.half-width').css({'width':$(window).width(),"margin-left":"0"});
		}
		$(window).resize(function(){
			if($(window).width() > 750){
				$('.half-width').css({'width':$(window).width()/2,"margin-left":"20px"});
			}
			else{
				$('.half-width').css({'width':$(window).width(),"margin-left":"0"});
			}
		});
	}
	else{
		$('.half-width').css({'width':$(window).width(),"margin-left":"0"});
		$(window).resize(function(){
			$('.half-width').css({'width':$(window).width(),"margin-left":"0"});
		});
		
	}
}

var sliderMain = function() {
	
		$('#fh5co-hero .flexslider').flexslider({
		animation: "fade",
		slideshowSpeed: 5000,
		directionNav: true,
		start: function(){
			setTimeout(function(){
				$('.slider-text').removeClass('animated fadeInUp');
				$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
			}, 500);
		},
		before: function(){
			setTimeout(function(){
				$('.slider-text').removeClass('animated fadeInUp');
				$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
			}, 500);
		}

		});

		$('#fh5co-hero .flexslider .slides > li').css('height', $(window).height());	
		$('#fh5co-hero .flexslider .slides > li.3-4_li').css('height', $(window).height()/4*3);	
		$(window).resize(function(){
			$('#fh5co-hero .flexslider .slides > li').css('height', $(window).height());	
			$('#fh5co-hero .flexslider .slides > li.3-4_li').css('height', $(window).height()/4*3);	
		});

};

var centerBlock = function() {
	$('.fh5co-section-with-image .fh5co-box').css('margin-top', -($('.fh5co-section-with-image .fh5co-box').outerHeight()/2));
		$(window).resize(function(){
			$('.fh5co-section-with-image .fh5co-box').css('margin-top', -($('.fh5co-section-with-image .fh5co-box').outerHeight()/2));
		});
};

var responseHeight = function() {
	setTimeout(function(){
		$('.js-responsive > .v-align').css('height', $('.js-responsive > img').height());
	}, 1);
	
	$(window).resize(function(){
		setTimeout(function(){
			$('.js-responsive > .v-align').css('height', $('.js-responsive > img').height());
		}, 1);
	})
};


var mobileMenuOutsideClick = function() {

	$(document).click(function (e) {
		var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			if ( $('body').hasClass('offcanvas-visible') ) {
				$('body').removeClass('offcanvas-visible');
				$('.js-fh5co-nav-toggle').removeClass('active');
				
			} 
		}
	});

};


var offcanvasMenu = function() {
	$('body').prepend('<div id="fh5co-offcanvas" />');
	$('#fh5co-offcanvas').prepend('<ul id="fh5co-side-links">');
	$('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');
	$('#fh5co-offcanvas').append($('#fh5co-header nav').clone());
};


var burgerMenu = function() {

	$('body').on('click', '.js-fh5co-nav-toggle', function(event){
		var $this = $(this);

		$('body').toggleClass('fh5co-overflow offcanvas-visible');
		$this.toggleClass('active');
		event.preventDefault();

	});

	$(window).resize(function() {
		if ( $('body').hasClass('offcanvas-visible') ) {
			$('body').removeClass('offcanvas-visible');
			$('.js-fh5co-nav-toggle').removeClass('active');
		}
	});

	$(window).scroll(function(){
		if ( $('body').hasClass('offcanvas-visible') ) {
			$('body').removeClass('offcanvas-visible');
			$('.js-fh5co-nav-toggle').removeClass('active');
		}
	});

};


var toggleBtnColor = function() {
	if ( $('#fh5co-hero').length > 0 ) {	
		$('#fh5co-hero').waypoint( function( direction ) {
			if( direction === 'down' ) {
				$('.fh5co-nav-toggle').addClass('dark');
			}
		} , { offset: - $('#fh5co-hero').height() } );

		$('#fh5co-hero').waypoint( function( direction ) {
			if( direction === 'up' ) {
				$('.fh5co-nav-toggle').removeClass('dark');
			}
		} , { 
			offset:  function() { return -$(this.element).height() + 0; }
		} );
	}
};



var contentWayPoint = function() {
	var i = 0;
	$('.animate-box').waypoint( function( direction ) {

		if( direction === 'down' && !$(this.element).hasClass('animated') ) {
			
			i++;

			$(this.element).addClass('item-animate');
			setTimeout(function(){

				$('body .animate-box.item-animate').each(function(k){
					var el = $(this);
					setTimeout( function () {
						var effect = el.data('animate-effect');
						if ( effect === 'fadeIn') {
							el.addClass('fadeIn animated');
						} else if ( effect === 'fadeInLeft') {
							el.addClass('fadeInLeft animated');
						} else if ( effect === 'fadeInRight') {
							el.addClass('fadeInRight animated');
						} else {
							el.addClass('fadeInUp animated');
						}

						el.removeClass('item-animate');
					},  k * 200, 'easeInOutExpo' );
				});
				
			}, 100);
			
		}

	} , { offset: '85%' } );
};

function initMenu(){


	call("/get_menu",{}).then((data)=>{
		let menuItems = [];
		for(let i = 0; i < data.resp.length;i++){
			if(data.resp[i].isCreated == "1"){
				menuItems.push({"title":data.resp[i].title,"ID":data.resp[i].ID,"p_id":data.resp[i].parent_id,"page":"page.html?p="+data.resp[i].page_id,"children":data.resp[i].children});
			}
			else{
				menuItems.push({"title":data.resp[i].title,"ID":data.resp[i].ID,"p_id":data.resp[i].parent_id,"page":data.resp[i].page,"children":data.resp[i].children});					
			}
		}	

		let url = window.location.href.substring(window.location.href.lastIndexOf('/')+1);
		let pg = "";
		if(url.indexOf('?')>-1){
			let urlParamsText = url.substring(url.indexOf('?')+1);
			let urlParams = {};
			for(let i = 0; i < urlParamsText.split('&').length;i++){
				let urlParamsItem = urlParamsText.split('&')[i];
				urlParams[urlParamsItem.split('=')[0]] = urlParamsItem.split('=')[1];
			}
			pg = urlParams['p'];
		}
		else{
			pg = url;
		}
		
		
		let ul = $("#menuList").addClass("menu_list");
		menu_items(pg,ul,menuItems);
	})
	
	$("#menu_main a").text(company);
}

function menu_items(pg,ul,menuItems){
	let url = window.location.href.substring(window.location.href.lastIndexOf('/')+1);
	for(let i = 0; i < menuItems.length;i++){
		if(menuItems[i].isCreated=="1"){
			menuItems[i] = {title:menuItems[i].title,id:menuItems[i].ID,p_id:menuItems[i].parent_id,page:"page.html?p="+menuItems[i].page_id,children:menuItems[i].children}
		}
		else{
			menuItems[i] = {title:menuItems[i].title,id:menuItems[i].ID,p_id:menuItems[i].parent_id,page:menuItems[i].page,children:menuItems[i].children}
		}

		let li = $("<li>").appendTo(ul);
		let a = $("<a>").attr("href",menuItems[i].page).text(menuItems[i].title).appendTo(li);
		if(url.indexOf('?')>-1){
			if(url==menuItems[i].page){
				li.addClass('active');						
			}
		}
		else{
			if(menuItems[i].page == pg){
				li.addClass('active');
			}
		}
		
		if(menuItems[i].children.length != 0){
			let sub_ul = $("<ul>").addClass("menu_list sub_menu sub_menu_"+menuItems[i].id).appendTo(li);
			menu_items(pg,sub_ul,menuItems[i].children);
		}
	}
}

function initBestProducts(){
	call("/get_products",{type:"best",limit:6,col:"mark"}).then((data)=>{
		let cont = $("#best_products");
		for(let i in data.resp){
			let item = data.resp[i];
			let div = $("<div>").addClass('col-md-4 animate-box').appendTo(cont);
				let link = $("<a>").attr({'href':"product.html?i="+item.ID}).addClass('item-grid text-center"').appendTo(div);
					let img = $('<div>').css({'background-image':'url('+(sURL + pathToFiles +item['img1'])+')'}).addClass('image').appendTo(link);
					let div_cont = $("<div>").addClass('v-align').appendTo(link);
						let div_text = $("<div>").addClass('v-align-middle').appendTo(div_cont);
							$('<h3>').addClass('title').text(item.name).appendTo(div_text);
							$('<h5>').addClass('category product_desc').text(item.description).appendTo(div_text);
		}

		let txt = $("<div>").addClass('col-md-12 text-center animate-box  fadeInUp animated').appendTo(cont);
		$('<p>').append($('<a>').addClass('btn btn-primary with-arrow').attr('href','products.html').text('View More Projects').append($('<i>').addClass('icon-arrow-right'))).appendTo(txt);

		contentWayPoint();
	})
}

function initFooter(){
	var footer = $("footer");
	var footerCont = $("<div>").addClass("container").appendTo(footer);
	call("/get_footer",{}).then((data)=>{
		for(let i = 0; i < data.length;i++){
			let itemDiv = $("<div>").addClass("col-md-6 col-md-push-1 col-sm-12 col-sm-push-0 col-xs-12 col-xs-push-0").appendTo(footerCont);
			let itemHeader = $("<h3>").text(data[i].title).appendTo(itemDiv);
			if('items' in data[i]){
				let itemUl = $("<ul>").appendTo(itemDiv);
				for(let j in data[i].items){
					let li = $("<li>").appendTo(itemUl);
					let a = $("<a>").attr("href",data[i].items[j].href).appendTo(li);
					if("logo" in data[i].items[j] ){
						$("<i>").addClass(data[i].items[j].logo).appendTo(a);
					}
					else{
						a.html(data[i].items[j].text);
					}
				}
			}
		}
		let copyRight = $("<div>").addClass("col-md-12 fh5co-copyright text-center").appendTo(footerCont);
		$("<p>").html("&copy; "+(new Date().getFullYear()) + " " + company+".").appendTo(copyRight);
	})
}

function url_params(){
	let href = location.href.substring(location.href.lastIndexOf('?')+1);
	let p = href.split('&');
	let params = {};
	for(let i in p){
		params[p[i].substring(0,p[i].indexOf('='))] = p[i].substring(p[i].indexOf('=')+1);
	}
	return params;
}


function initSlider(parent,data){
	let imgs = [];
	if(data[0].img1 != "" && data[0].img1 != null) imgs.push(data[0].img1);
	if(data[0].img2 != "" && data[0].img2 != null) imgs.push(data[0].img2);
	if(data[0].img3 != "" && data[0].img3 != null) imgs.push(data[0].img3);
	if(data[0].img4 != "" && data[0].img4 != null) imgs.push(data[0].img4);
	
    for(let i in imgs){
		let li = $("<li>").addClass('3-4_li').css({'background-image':'url('+sURL+pathToFiles+ imgs[i]+')'}).appendTo(parent);
			let div_cont = $("<div>").addClass('container').appendTo(li);
				let div_cont_main = $("<div>").addClass('col-md-10 col-md-offset-1 text-center half-width js-3-4-height slider-text').appendTo(div_cont);
	}
	
	sliderMain();
}

function other(){
	if($(window).width() > 500){
		$("#underHeader").removeClass("hidden").css({"height":$("#fh5co-header").height()+"px"});
	}
}


$(window).resize(function(){
	if($(window).width() < 750){
		$("#underHeader").addClass("hidden");
	}
	if($(window).width() >= 750){
		$("#underHeader").removeClass("hidden");
	}

	if($(".header-inner").width() < ($("#menu_main").width()+$(".header-inner nav").width())){
		$(".header-inner nav").hide();
	}
	else{
		$(".header-inner nav").show();
	}
})
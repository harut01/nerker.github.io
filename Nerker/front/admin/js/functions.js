function adminLogin(){
    var form = {
        "login":$("#login").val(),
        "password": $("#password").val()
    };
    call("/adminLogin",form).then((data)=>{
        if(data.state == "true"){
            window.location.pathname = "admin/";
            window.localStorage.setItem("adminLogedIn","true");
        }
        else{
            $('.wrongLoginOrPassword').show(500)
        }
    });
}

function call(path,p){
    let params = p || {};
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "POST",
            url: path,
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(params)
        }).then((data)=>{
            resolve(data);
        }).catch(err=>{
            reject(err);
        });

    });
}

function upload(path,formData){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "POST",
            url: path,
            data: formData,
            processData: false,
            contentType: false,
        }).then((data)=>{
            resolve(data);
        }).catch(err=>{
            reject(err);
        });

    });
}

function adminFormInputsChange(){
    if($('.wrongLoginOrPassword').css("display") == "block"){
        $('.wrongLoginOrPassword').hide(500); 
    }
}

function logOut(){
    window.location.pathname = "admin/admin-login.html";
    window.localStorage.setItem("adminLogedIn","false")
}

function allDisable(elem){
    $("#main-wrapper").css({"opacity":"0.2","pointer-events":"none"});
    $(elem).css({"pointer-events":"auto"})
}

function allEnable(elem){
    elem = elem || $("#popup");
    $("#main-wrapper").css({"opacity":"1","pointer-events":"auto"});
    elem.remove();
}

function newAdminMessage(title,content,id,_time,type,sender){
    var time = _time || (new Date().getHours() + " " + new Date().getMinutes());

    var message = $("<a>").attr({"href":"#"});
        if(type=="notif"){
            var btn = $("<div>").addClass("btn btn-danger btn-circle m-r-10").appendTo(message);
                $("<i>").addClass("fa fa-link").appendTo(btn);
            var cont = $("<div>").addClass("mail-contnet").appendTo(message);
                $("<h5>").text(title).appendTo(cont);
                $("<span>").addClass("mail-desc").text(content).appendTo(cont);
                $("<span>").addClass("time").text(time).appendTo(cont);
        }
        else{
            var btn = $("<div>").addClass("user-img").appendTo(message);
                $("<img>").addClass("img-circle").attr({"src":sender.src,"alt":"user"}).appendTo(btn);
                $("<span>").addClass("profile-status pull-right " + sender.status).appendTo(btn);
            var cont = $("<div>").addClass("mail-contnet").appendTo(message);
                $("<h5>").text(sender.name).appendTo(cont);
                $("<span>").addClass("mail-desc").text(content).appendTo(cont);
                $("<span>").addClass("time").text(time).appendTo(cont);
        }

    return message;

}

function openPopup(html){
    return new Promise((resolve,reject)=>{
        let popup = $("<div>").attr({"id":"popup"}).appendTo($("body"));
        html.appendTo(popup);
        let popupClose = $("<div>").css({"cursor":"pointer"}).addClass("fa fa-times-circle popupClose").click(function(){
            allEnable(popup);
        }).appendTo(popup);
        allDisable(popup);
        resolve();
    });
}

function successMessage(text1,text2,callback){  
    text2 = text2 || ""; 
    swal(text1, text2, "success"); 
    if(callback){
        $(".confirm").on('click',function(){
            callback();
        });
    }
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

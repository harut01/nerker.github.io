let params = window.location.href.split("?");
let p = {};
for(let i = 0; i < params[1].split('&').length;i++){
    let item = params[1].split('&')[i];
    p[item.split('=')[0]] = item.split('=')[1];
}

call("/get_cr_page",{page:p.p}).then((data)=>{
    let content = $("#mainCont");
    if(data.resp.length > 0){
        content.html(data.resp[0].html);
    }
})
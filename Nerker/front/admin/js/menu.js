var list = $("#nestable > .dd-list");

call("/get_menu").then((data)=>{
    var arr = data.resp;
    
    multiLevelMenu(arr,list);
});

function multiLevelMenu(arr,parent){
    for(let i in arr){
        let item = arr[i];

        let li = $("<li>").addClass("ui-state-default dd-item").attr({"id":"menu_item_"+arr[i].ID}).css({"order":arr[i].order}).appendTo(parent);
        let liDiv = $("<div>").addClass('dd-handle').text(arr[i].title).appendTo(li);

        let del = $("<div>").on('mousedown',function(e){   
            e.stopPropagation();      
            call("/actionWithTable",{tb:'menu',action:"DELETE",id:arr[i].ID}).then((data)=>{
            }).catch(e=>console.log(e)).then(()=>{
                window.location.reload();
            })  
        }).addClass("fa fa-trash mrg-r z-index-2");

        liDiv.prepend(del);

        if(item.isCreated > 0){            
            let upd = $("<div>").on('mousedown',function(e){ 
                e.stopPropagation();
                window.location.href = "/admin/add-new-page.html?upd="+item.ID;

            }).addClass("fa fa-edit mrg-r z-index-2");
    
            liDiv.prepend(upd);
        }

        let newParent = $("<ol>").addClass("sortable dd-list sub_list sub_list_"+item.ID).appendTo(li);

        if(item.children.length != 0){
            multiLevelMenu(item.children,newParent);
        }
    }
}

function changeMenuOrder(){
    let data = [];
    $("#nestable li.ui-state-default").each(function(i){
        let item = {};
        item['id'] = $($("#nestable li.ui-state-default")[i]).attr("id").substring(10);
        item['order'] = $($("#nestable li.ui-state-default")[i]).index();
        if($($("#nestable li.ui-state-default")[i]).parent().parent().is('li')){
            item['parent_id'] = parseInt($($("#nestable li.ui-state-default")[i]).parent().parent().attr("id").substring(10));
        }
        else{
            item['parent_id'] = -1;
        }
        data.push(item);
    });
    
    call("/change_menu_order",data).then((data)=>{
        let okDialog = $("<div>").css({"text-align":"center"}).html("Menu order successfully changed!!<br>");
        $("<div>").text("Ok").click(()=> {allEnable();window.location.reload()}).addClass("button brown").appendTo(okDialog);
        successMessage("Menu order successfully changed!!","Done!!");
    });
}


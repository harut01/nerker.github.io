const urlParams = url_params();
const pgCount = 10;
var pg = parseInt(urlParams.pg) || 1;

if(pg < 1) window.location.href = "table-datatable.html?tb="+urlParams.tb+"&pg=1";

function initTable(){
    call("/getDb",{db:urlParams.tb,pg:pg,count:pgCount}).then((data)=>{
        
        let table = $("#datatable");
        let thead = $("<thead>").appendTo(table);
        let tfoot = $("<tfoot>").appendTo(table);
        $("<th>").appendTo(thead);
        $("<th>").appendTo(thead);
        $("<th>").appendTo(tfoot);
        $("<th>").appendTo(tfoot);
        for(let i = 0; i < data.columns.length;i++){
            let thI = $("<th>").text(data.columns[i].Field).attr("type","input").appendTo(thead);
            if(data.columns[i].Type == "text"){
                thI.attr("type","text");
            }
            if(data.columns[i].Field.search("img")>-1){
                thI.attr("type","file");
            }
            $("<th>").text(data.columns[i].Field).appendTo(tfoot);
        }
        let tbody = $("<tbody>").appendTo(table);
        for(let i = 0; i < data.result.length;i++){
            let tr = $("<tr>").attr("id","dataTableTr"+data.result[i]["ID"]).appendTo(tbody);
            $("<td>").append($("<i>").addClass("fa fa-trash")).attr("onclick","removeItem("+data.result[i]["ID"]+")").css({"padding": "0.55rem 0","text-align":"center"}).appendTo(tr);
            $("<td>").append($("<i>").addClass("fa fa-edit")).attr("onclick","updateItem("+data.result[i]["ID"]+")").css({"padding": "0.55rem 0","text-align":"center"}).appendTo(tr);
            for(var j in data.result[i]){
                let td = $("<td>").appendTo(tr);            
                $("<div>").text(data.result[i][j]).appendTo(td);
            }
        }
        initPagination(data.rowsCount);
        
    });
}

initTable();

function removeItem(id){
    call("/actionWithTable",{tb:urlParams.tb,action:"DELETE",id:id}).then((data)=>{
    }).catch(e=>console.log(e)).then(()=>{
        $("#datatable").html("");
        initTable();
    })
}

function initPagination(count){
    let itemsInPagination = Math.ceil(count/pgCount);
    if(pg > itemsInPagination) window.location.href = "table-datatable.html?tb="+urlParams.tb+"&pg="+itemsInPagination;
    let cont = $(".pagination");
    cont.html("");
    cont.append($("<li>").addClass("pgBack").append($("<a>").text("«").attr({"href":"table-datatable.html?tb="+urlParams.tb+"&pg="+(pg-1)})));

    for(let i = 1; i <= itemsInPagination;i++){
        let item;
        if(Math.abs(pg-i) <= 4){
            item = $("<li>").append($("<a>").text(i).attr({"href":"table-datatable.html?tb="+urlParams.tb+"&pg="+(i)})).appendTo(cont);
            if(i==pg) item.addClass("active_pg");
        }
    }

    cont.append($("<li>").addClass("pgNext").append($("<a>").text("»").attr({"href":"table-datatable.html?tb="+urlParams.tb+"&pg="+(pg+1)})));

    if(pg <= 1) $(".pgBack").hide();
    if(pg==itemsInPagination) $(".pgNext").hide();
    
}

function updateItem(id){
    var updatePopup = $("<div>").addClass("updatePopupCont");
    
    let tr = $("#dataTableTr"+id).children();
    let thead = $("#datatable thead").children();
    let items = {};

    for(let i = 0; i < thead.length;i++){
        if($(thead[i]).text() != ""){
            items[$(thead[i]).text()] = { 
                val:$(tr[i]).text(),
                type: $(thead[i]).attr("type")
            }
        }
    }

    
    for(let key in items){
        let item = $("<div>").addClass("field_"+key + " updateInputItem").appendTo(updatePopup);
        let label = $("<label>").text(key+": ").appendTo(item);
        if(items[key].type == "input"){
            let input = $("<input>").val(items[key].val).appendTo(item);
            if(key.toUpperCase()=="ID") input.attr("disabled","disabled");
        }
        else if(items[key].type == "text"){
            let input = $("<textarea>").text(items[key].val).appendTo(item);
        }
        else if(items[key].type == "file"){
            label.addClass('button brown').attr("old_value",items[key].val);
            label.prepend($("<span>").text("Upload "));
            let file = $("<input>").addClass('inputfile').on("change",function(){
                $(this).parent().parent().find(".image_txt").text("  " + $(this)[0].files[0].name);                
            }).attr({"type":"file"}).appendTo(label);  
            item.addClass("left-aligned");
            item.append($("<span>").addClass("image_txt")) ;          
        }
    }

    let submitButton = $("<div>").addClass("updateBtn button brown").text("update").appendTo(updatePopup);

    openPopup(updatePopup).then((data)=>{
        submitButton.click(function(){
            let updateParams = {};
            let files = [];
            
            for(let key in items){
                if(key.toUpperCase() != "ID" ){
                    if(items[key].type == "input"){
                        updateParams[key] = $(".updatePopupCont .field_"+key + " input").val();
                    }
                    else if(items[key].type == "text"){
                        updateParams[key] = $(".updatePopupCont .field_"+key + " textarea").val();
                    }
                    else if(items[key].type == "file"){
                        if($(".updatePopupCont .field_"+key + " input")[0].files[0]){
                            updateParams[key] = $(".updatePopupCont .field_"+key + " input")[0].files[0].name;
                            files.push($(".updatePopupCont .field_"+key + " input")[0].files[0]);
                        }
                    }
                }
            }

            if(files.length > 0){
                var formData = new FormData();
                for(let i in files){
                    formData.append("fileToUpload_"+i, files[i]);
                }
                upload("/uploadForm",formData).then(data=>{
                    console.log(data);
                })
            }

            call("/actionWithTable",{tb:urlParams.tb,action:"UPDATE",id:id,params:[updateParams]}).then((data)=>{
            }).catch(e=>console.log(e)).then(()=>{
                $("#datatable").html("");
                initTable();
                allEnable($("#popup"));
            })
        })
    })
}

function addItem(){
    var insertPopup = $("<div>").addClass("insertPopupCont");
    let thead = $("#datatable thead").children();
    let items = {};

    for(let i = 0; i < thead.length;i++){
        if($(thead[i]).text() != ""){
            items[$(thead[i]).text()] = { 
                type: "input",
                type: $(thead[i]).attr("type")
            }
        }
    }
    
    for(let key in items){
        let item = $("<div>").addClass("field_"+key + " updateInputItem").appendTo(insertPopup);
        if(key.toUpperCase() != "ID" ){
            let label = $("<label>").text(key+": ").appendTo(item);
            if(items[key].type == "input"){
                let input = $("<input>").appendTo(item);
            }
            else if(items[key].type == "text"){
                let input = $("<textarea>").text(items[key].val).appendTo(item);
            }
            else if(items[key].type == "file"){
                label.addClass('button brown').attr("old_value",items[key].val);
                label.prepend($("<span>").text("Upload "));
                let file = $("<input>").addClass('inputfile').on("change",function(){
                    $(this).parent().parent().find(".image_txt").text("  " + $(this)[0].files[0].name);                
                }).attr({"type":"file"}).appendTo(label);  
                item.addClass("left-aligned");
                item.append($("<span>").addClass("image_txt")) ;    
            }
        }
    }
    let submitButton = $("<div>").addClass("updateBtn button brown").text("Add").appendTo(insertPopup);
    openPopup(insertPopup).then((data)=>{
        submitButton.click(function(){
            let insertParams = {};
            let files = [];
            
            for(let key in items){
                if(key.toUpperCase() != "ID" ){
                    if(items[key].type == "input"){
                        insertParams[key] = $(".insertPopupCont .field_"+key + " input").val();
                    }
                    else if(items[key].type == "text"){
                        insertParams[key] = $(".insertPopupCont .field_"+key + " textarea").val();
                    }
                    else if(items[key].type == "file"){
                        if($(".insertPopupCont .field_"+key + " input")[0].files[0]){
                            insertParams[key] = $(".insertPopupCont .field_"+key + " input")[0].files[0].name;
                            files.push($(".insertPopupCont .field_"+key + " input")[0].files[0]);
                        }
                    }
                }
            }
            if(files.length > 0){
                var formData = new FormData();
                for(let i in files){
                    formData.append("fileToUpload_"+i, files[i]);
                }
                upload("/uploadForm",formData).then(data=>{
                    console.log(data);
                })
            }

            call("/actionWithTable",{tb:urlParams.tb,action:"INSERT",params:[insertParams]}).then((data)=>{
            }).catch(e=>console.log(e)).then(()=>{
                $("#datatable").html("");
                initTable();
                allEnable($("#popup"));
            })
        })
    })
}

const itemsInPage = 3;
function pagginfForTable(table){

    table = $(table);
    var items_unfiltr = table.find("tr");
    var items = [];
    for(var i in items_unfiltr){
        if(i > 1){
            items.push(items_unfiltr[i]);
        }
    }

    table.parent().append($("<div>").addClass('pagging_cont'));
    var pagging_cont = table.parent().find('.pagging_cont');

    var count = Math.ceil(items.length/itemsInPage);
    console.log(count)
    for(var i = 1; i <= count;i++){
        var pagging_item = $("<div>").on("mousedown",function(){
            changeTablePage(this,table);
        }).text(i).addClass("pagging_item").appendTo(pagging_cont);
        if(i==count) pagging_item.addClass('pagging_active_item');
    }

    var page = parseInt($(".pagging_active_item").text());
    for(var i in items){
        if( i>=(itemsInPage*(page-1)) && i < (itemsInPage*page) ) $(items[i]).show();
        else $(items[i]).hide();
    }
    pagging_cont.append($("<br>").css({"clear":"both"}));
}

function changeTablePage(elem,table){
    $('.pagging_active_item').removeClass('pagging_active_item');
    $(elem).addClass('pagging_active_item');
    refreshTable(table,parseInt($(elem).text()));
}

function refreshTable(table,page){

    table = $(table);
    var items_unfiltr = table.find("tr");
    var items = [];
    for(var i in items_unfiltr){
        if(i > 1){
            items.push(items_unfiltr[i]);
        }
    }    
    for(var i in items){
        if( i>=(itemsInPage*(page-1)) && i < (itemsInPage*page) ) $(items[i]).show();
        else $(items[i]).hide();
    }
}
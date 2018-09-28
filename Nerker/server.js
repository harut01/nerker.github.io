var express = require('express');
var exp_formidable = require('express-formidable');
var fileUpload = require('express-fileupload');
var path = require('path');
var url = require("url");
var bodyParser = require('body-parser');
var formidable = require('formidable');
var multer = require('multer');
var upload = multer();
var fs = require('fs');
var app = express();

const port = 3000;
const serverUrl = "http://localhost:"+port+"/"

const host = "localhost";
const user = "root";
const password = "root";
const database = "nerker";

var confText = fs.readFileSync("config.json");
const config = JSON.parse(confText);

var mysql = require('mysql');
var db_config = {
  host     : host,
  user     : user,
  password : password,
  database : database
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var con;

function handleDisconnect() {
    con = mysql.createConnection(db_config);  

    con.connect(function(err) {
        if (err) throw err;
    });                                    
                                         
    con.on('error', function(err) {
        // console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect();                         
        } else {                                      
            throw err;                                
        }
    });
}

handleDisconnect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(function(req, res, next) {    
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});


app.get('/', function (req, res) {
    res.sendFile("front/index.html", {"root": __dirname});
});


app.get('/index.html', function (req, res) {
    res.sendFile("front/index.html", {"root": __dirname});
});

app.get("/page.html",function(req,res){
    let pathToErrPage = url.parse(req.url).path.substring(1,url.parse(req.url).path.lastIndexOf('/'));
    let params = req.url.split("?");
    let pathname = url.parse(req.url).pathname;
    
    if(params.length > 1){
        let p = {};
        for(let i = 0; i < params[1].split('&').length;i++){
            let item = params[1].split('&')[i];
            p[item.split('=')[0]] = item.split('=')[1];
        }

        if("p" in p){
            res.sendFile("front/"+pathname, {"root": __dirname});            
        }
        else{
            res.sendFile("front/"+pathToErrPage+"/page-error-404.html", {"root": __dirname});            
        }

    }
    else{
        res.sendFile("front/"+pathToErrPage+"/page-error-404.html", {"root": __dirname});
    }
})

app.get('/uploadedFiles/',function(req,res){
    res.sendFile("front/uploadedFiles/image.jpg", {"root": __dirname});
})
app.get('/uploadedFiles/null',function(req,res){
    res.sendFile("front/uploadedFiles/image.jpg", {"root": __dirname});
})

app.get('*',function(req,res){
    let pathname = url.parse(req.url).pathname;
    if(pathname[pathname.length-1] == "/"){
        pathname+="index.html";
    }

    let pathToErrPage = url.parse(req.url).path.substring(1,url.parse(req.url).path.lastIndexOf('/'));
             
    if (fs.existsSync(__dirname+"/front/"+pathname)) {
        res.sendFile("front/"+pathname, {"root": __dirname});
    }
    else if(fs.existsSync(__dirname+"/front/"+pathToErrPage+"/page-error-404.html")){        
        res.sendFile("front/"+pathToErrPage+"/page-error-404.html", {"root": __dirname});            
    }
    else{
        res.send({"resp":"99"});
    }

})


app.post("/adminLogin",function(req,res){
    res.set('Content-Type', 'application/json');
    let params = req.body;
    if(params.login == config.admin.login && params.password == config.admin.password){
        res.send({"rc":"00","state":"true"});
    }
    else res.send({"rc":"00","state":"false"});
})

app.post('/getProduct',function(req,res){
    let query = `SELECT products.*,producers.producer_name,product_categories.category_name FROM products LEFT JOIN producers ON products.producer_id=producers.ID LEFT JOIN product_categories ON products.category_id=product_categories.ID WHERE products.\`ID\`='${req.body.id}'`;
    
    con.query(query,function(err,result,fields){
        res.send({"rc":"00","resp":result});
    });
})

app.post("/get_products",function(req,res){
    if(req.body.type == "best"){
        let query = "";
        if(req.body.col=="mark") query = `SELECT * FROM products ORDER BY \`${req.body.col}\`/markCount DESC LIMIT ${req.body.limit};`;
        else query = `SELECT * FROM products ORDER BY \`${req.body.col}\` DESC LIMIT ${req.body.limit};`;

        con.query(query,function(err,result,fields){
            res.send({"rc":"00",resp:result});
        })
    }
})

app.post("/get_footer",function(req,res){
    res.send(config.footer_items);
})

app.post("/getProductCategories",function(req,res){
    let query = `SELECT * FROM product_categories`
    con.query(query,function(err,result,fields){
        result = tree(result,"ID","parent_category_ID");
        res.send({"rc":"00","resp":result});
    })
})

app.post("/getProducts",function(req,res){
    
    let query = `SELECT * FROM products ORDER BY mark/markCount DESC;`
    if("c" in req.body){
        query = `SELECT * FROM products WHERE category_ID=${req.body.c} ORDER BY mark/markCount DESC`;
    }

    if("q" in req.body){
        query = `SELECT * FROM products WHERE \`name\` LIKE '${req.body.q}%' OR \`item_code\` LIKE '${req.body.q}' ORDER BY mark/markCount DESC`;
    }

    if("q" in req.body && "c" in req.body){
        query = `SELECT * FROM products WHERE category_ID=${req.body.c} AND \`name\` LIKE '${req.body.q}%' OR \`item_code\` LIKE '${req.body.q}' ORDER BY mark/markCount DESC`;
    }


    con.query(query,function(err,result,fields){
        res.send({"rc":"00","resp":result});
    })
})

app.post("/getDBs",function(req,res){
    let query = `SELECT \`TABLE_NAME\` FROM information_schema.tables WHERE TABLE_SCHEMA = "${database}"`;
    for(let i = 0; i < config.tables_to_dont_show.length;i++){
        query+= " AND `TABLE_NAME`!='"+config.tables_to_dont_show[i]+"'";
    }
    
    con.query(query,function(err,result,fields){
        res.send(result);
    })
})

app.post("/getDb",function(req,res){
    res.set('Content-Type', 'application/json');

    let pg = parseInt(req.body.pg);
    let count = parseInt(req.body.count);

    let query = `SELECT * FROM ${req.body.db} LIMIT ${count} OFFSET ${(pg -1) * count };`;

    con.query(query,function(err,result,fields){
        let myres = {};
        let columnsQuery = `SHOW COLUMNS FROM ${req.body.db}`;
        con.query(columnsQuery,function(err1,result1,fields1){
            let rowsCountQuery = `SELECT COUNT(ID) as "c" FROM ${req.body.db}`;
            con.query(rowsCountQuery,function(err2,result2,fields2){
                myres['columns'] = result1;
                myres['result'] = result;
                myres['rowsCount'] = result2[0].c || "0";
                res.send(myres);
            })
        })
    }) 
})

app.post("/get_cr_page",function(req,res){
    let query = `SELECT html FROM created_pages WHERE \`ID\`='${req.body.page}'`;
    
    con.query(query,function(err,result,fields){
        res.send({"rc":"00","resp":result});
    })
})

app.post("/get_menu",function(req,res){
    let query = `SELECT menu.ID,menu.title,menu.page,menu.order,menu.isCreated,menu.parent_id,menu.page_id,created_pages.html FROM menu LEFT JOIN created_pages ON menu.page_id=created_pages.ID ORDER BY menu.order`;
    
    if("id" in req.body) query = `SELECT menu.ID,menu.title,menu.page,menu.order,menu.isCreated,menu.parent_id,menu.page_id,created_pages.html FROM menu LEFT JOIN created_pages ON menu.page_id=created_pages.ID WHERE menu.ID='${req.body.id}' ORDER BY menu.order`;

    con.query(query,function(err,result,fields){
        let _result = tree(result,"ID","parent_id");
        
        res.send({"rc":"00","resp":_result});
    })    
})

app.post("/products_from_produces",function(req,res){
    let query = `SELECT products.*,producers.producer_name FROM products LEFT JOIN producers ON products.producer_id=producers.ID WHERE \`producer_id\`='${req.body.producer_id}' AND products.\`ID\`!=${req.body.id} LIMIT 6`;
    
    con.query(query,function(err,result,fields){
        res.send({"rc":"00","resp":result});
    })
})

app.post("/products_with_same_category",function(req,res){
    let query = `SELECT products.*,product_categories.category_name FROM products LEFT JOIN product_categories ON products.category_id=product_categories.ID WHERE \`category_id\`='${req.body.category_id}' AND products.\`ID\`!=${req.body.id} LIMIT 6`;
    
    con.query(query,function(err,result,fields){
        res.send({"rc":"00","resp":result});
    })

})

app.post("/markProduct",function(req,res){
    let query = `UPDATE products SET mark= mark + ${req.body.mark}, markCount=markCount+1 WHERE ID='${req.body.id}';`;
    con.query(query,function(err,result,fields){
        res.send({"rc":"00"})
    })
})

app.post("/change_menu_order",function(req,res){
    for(let i in req.body){
        let item = req.body[i];
        let query = `UPDATE menu SET \`order\`='${item.order}',\`parent_id\`=${item.parent_id} WHERE ID='${item.id}'`;
        con.query(query,function(err,result,fields){            
        })    
    }
    res.send({"rc":"00"});
})

app.post("/uploadForm",function(req,res){
    loopOverObject(req.files,function(i,key,value){
        value.mv(__dirname + '/front/uploadedFiles/'+value.name, function(err) {
            
        });
    });
    res.send({"rc":"00"});
})

app.post("/uploadImgs",function(req,res){
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
        
    let sampleFile = req.files.file;
    
    sampleFile.mv(__dirname + '/front/uploadedFiles/'+req.files.file.name, function(err) {
        if (err)
            console.log(err);
        
        res.send({"rc":"00","resp":'File uploaded!',"location":serverUrl+'/uploadedFiles/'+req.files.file.name});
    });
    
})

app.post("/create_page",function(req,res){
    let query = insertQuery("created_pages",req.body);

    con.query(query,function(err,result,fields){
        if(err) throw err;
        res.send({"rc":"00"});
        con.query("SELECT MAX(`order`) FROM menu",function(err1,result1,fields1){
            let order = result1[0]['MAX(`order`)'];
            ++order;
            let query1 = insertQuery('menu',{title:req.body.title,isCreated:1,order:order,page_id:result.insertId});
            
            con.query(query1,function(err2,result2,fields2){
                
            })
        })
    })
})

app.post("/update_page",function(req,res){
    let query = updateQuery("created_pages",{"title":req.body.title,"is_menu_item":req.body.is_menu_item,"html":req.body.html},req.body.id);
    console.log(query);
    con.query(query,function(err,result,fields){
        if(err) throw err;
        res.send({"rc":"00"});
        let query2 = `UPDATE menu SET \`title\`='${req.body.title}' WHERE page_id='${req.body.id}'`;
        con.query(query2,function(err1,result1,fields1){
        })
    })
})

app.post("/actionWithTable",function(req,res){    
    res.set('Content-Type', 'application/json');
    let query = "";
    switch(req.body.action){
        case "SELECT": query = `SELECT * FROM ${req.body.tb}`
            break;
        case "INSERT": query = insertQuery(req.body.tb,req.body.params[0]);
            break;
        case "UPDATE": query = updateQuery(req.body.tb,req.body.params[0],req.body.id);
            break;
        case "DELETE": query = `DELETE FROM ${req.body.tb} WHERE ID="${req.body.id}"`
            break;
    }


    
    con.query(query,function(err,result,fields){
        if(err) console.log(err)
        res.send({"rc":"00"});
        console.log(fields);
    })
});

app.post("/",function(req,res){
    res.send({"rc":"00"});
});

app.listen(port, function () {
    console.log('App started!');
});

function insertQuery(tb,params){
    let insColumns = "", insValues = "";

    let i = 0;
    for(let key in params){
        if(i!= 0){
            insColumns += ",";
            insValues += ",";
        }

        insColumns+= "`"+key+"`";
        insValues += "'"+params[key].toString().replaceAll(/(')/g,"\\'").replaceAll(/(")/g,'\\"') + "'";

        i++;
    }

    let query = `INSERT INTO ${tb} (${insColumns}) VALUES (${ insValues})` ;
    return query;
}

function updateQuery(tb,params,id){
    let newValues = "";
    let i = 0;
    for(let key in params){
        if(i!= 0){
            newValues += ",";
        }

        newValues+= "`"+key+"`="+"'"+params[key].toString().replaceAll(/(')/g,"\\'").replaceAll(/(")/g,'\\"') + "'";
        i++;
    }

    let query = `UPDATE ${tb} SET ${newValues} WHERE ID =${id}` ;
    return query;
}

function loopOverObject(obj,func){
    for(let i in Object.keys(obj)){
        func(i,Object.keys(obj)[i],obj[Object.keys(obj)[i]]);
    }
}

function tree(arr,id,parent_id){    
    let _result = [];

    for(let i in arr){
        arr[i].children = [];
        for(let j in arr){
            if(arr[j][parent_id] == arr[i][id]){
                arr[i].children.push(arr[j]);
            }
        }
        
        if(arr[i][parent_id] == null || arr[i][parent_id] == -1){
            _result.push(arr[i]);
        }
    }

    return _result;
}

call("/getDBs",{}).then((data)=>{
    let dbs = [];
    for(let i = 0; i < data.length;i++){
        let item = {};
        item.title = data[i]["TABLE_NAME"];
        item.href = "table-datatable.html?tb="+item.title;
        item.logo = "fa-sitemap";
        item.children = [];
        dbs.push(item);
    }
    menu_items[1].children = dbs;
    initSideBarNav();    
});

var adminLogedIn = window.localStorage.getItem("adminLogedIn");



if( adminLogedIn == null || adminLogedIn == "false"){
    window.location.pathname = "admin/admin-login.html";
}

function initSideBarNav(){

    let main = $("#sidebarnav");
    for(let i = 0; i < menu_items.length;i++){
        $("<li>").addClass("nav-label").text(menu_items[i].title).appendTo(main);
        if("children" in menu_items[i]){
            drawMenuItemChildren(menu_items[i].children,main);
        }
        if(i != menu_items.length-1){
            $("<li>").addClass("nav-devider").appendTo(main);
        }
    }
}

function drawMenuItemChildren(itemChildren,parent){   
    for(let i = 0; i < itemChildren.length;i++){
        let item = itemChildren[i];
        let it = $("<li>").appendTo(parent);
        let a = $("<a>").attr("href",item.href).appendTo(it);
        if("children" in item){
            a.attr("aria-expanded","false");
            if("logo" in item){         
                let logo = $("<i>").addClass("fa " + item.logo).appendTo(a);
            }
            let hideMenuSpan = $("<span>").addClass("hide-menu").text(item.title).appendTo(a);
            if("pull-right" in item){
                $("<span>").addClass("label label-rouded label-warning pull-right").text(item["pull-right"]).appendTo(hideMenuSpan);
            }
            if(item.children.length != 0){
                a.addClass("has-arrow");
                let newUl = $("<ul>").addClass("collapse").attr("aria-expanded","false").appendTo(it);
                drawMenuItemChildren(item.children,newUl);
            }
        }
        else a.text(item.title);
    } 
}

var menu_items = [
    {
        "title":"Home",
        "children": [
            {
                "title":"Dashboard",
                "logo": "fa-tachometer",
                "href": "#",
                "pull-right": 2,
                "children": [
                    {"href": "index.html", "title":"Ecommerce"},
                    {"href": "index1.html", "title":"Analytics"}
                ]
            }           
        ]
    },
    // {
    //     "title":"Apps",
    //     "children": [
    //         {
    //             "title":"Charts",
    //             "logo": "fa-bar-chart",
    //             "href": "#",
    //             "children": [
    //                 {"href": "chart-flot.html", "title":"Flot"},
    //                 {"href": "chart-morris.html", "title":"Morris"},
    //                 {"href": "chart-chartjs.html","title":"ChartJs"},
    //                 {"href": "chart-chartist.html", "title":"Chartist"},
    //                 {"href": "chart-amchart.html", "title":"AmChart"},
    //                 {"href": "chart-echart.html","title":"EChart"},
    //                 {"href": "chart-sparkline.html", "title":"Sparkline"},
    //                 {"href": "chart-peity.html", "title":"Peity"}
    //             ]
    //         }              
    //     ]
    // },
    {
        "title": "Tables",
        "children": []
    },        
    {
        "title":"Features",
        "children": [
            {
                "title":"Bootstrap UI",
                "logo": "fa-suitcase",
                "href": "#",
                "pull-right": 6,
                "children": [
                    {"href": "ui-alert.html", "title":"Alert"},
                    {"href": "ui-button.html", "title":"Button"},
                    {"href": "ui-dropdown.html", "title":"Dropdown"},
                    {"href": "ui-progressbar.html", "title":"Progressbar"},
                    {"href": "ui-tab.html", "title":"Tab"}
                ]
            },
            {
                "title":"Components",
                "logo": "fa-suitcase",
                "href": "#",
                "pull-right": 6,
                "children": [
                    {"href": "uc-calender.html", "title":"Calender"},
                    {"href": "uc-datamap.html", "title":"Datamap"},
                    {"href": "uc-nestedable.html", "title":"Nestedable"},
                    {"href": "uc-sweetalert.html", "title":"Sweetalert"},
                    {"href": "uc-toastr.html", "title":"Toastr"},
                    {"href": "uc-weather.html", "title":"Weather"}
                ]
            } ,
            {
                "title":"Forms",
                "logo": "fa-wpforms",
                "href": "#",
                "children": [
                    {"href": "form-basic.html", "title":"Basic Forms"},
                    {"href": "form-layout.html", "title":"Form Layout"},
                    {"href": "form-validation.html", "title":"Form Validation"},
                    {"href": "form-editor.html", "title":"Editor"},
                    {"href": "form-dropzone.html", "title":"Dropzone"}
                ]
            } ,
            {
                "title":"Tables",
                "logo": "fa-table",
                "href": "#",
                "children": [
                    {"href": "table-bootstrap.html", "title":"Basic Tables"}
                ]
            },
            {
                "title":"Menu",
                "logo": "fa-bars",
                "href": "menu.html",
                "children":[]
            }                
        ]
    },
    {
        "title":"Layout",
        "children": [
            {
                "title":"Layout",
                "logo": "fa-columns",
                "href": "#",
                "children": [
                    {"href": "layout-blank.html", "title":"Blank"},
                    {"href": "layout-boxed.html", "title":"Boxed"},
                    {"href": "layout-fix-header.html", "title":"Fix Header"},
                    {"href": "layout-fix-sidebar.html", "title":"Fix Sidebar"}
                ]
            }           
        ]
    },
    {
        "title":"EXTRA",
        "children": [
            {
                "title":"Pages",
                "logo": "fa-book",
                "href": "#",
                "pull-right": "8",
                "children": [
                    {
                        "href": "#",
                        "title":"Authentication",
                        "pull-right": "6",
                        "children":[
                            {"href": "page-login.html", "title":"Login"},
                            {"href": "page-register.html", "title":"Register"},
                            {"href": "page-invoice.html", "title":"Invoice"}
                        ]
                    },
                    {
                        "href": "#",
                        "title":"Error Pages",
                        "children":[
                            {"href": "page-error-400.html", "title":"400"},
                            {"href": "page-error-403.html", "title":"403"},
                            {"href": "page-error-404.html", "title":"404"},
                            {"href": "page-error-500.html", "title":"500"},
                            {"href": "page-error-503.html", "title":"503"}
                        ]
                    },
                    {
                        "href": "add-new-page.html",
                        "title": "Add new page"
                    }
                ]
            },
            {
                "title":"Maps",
                "logo": "fa-map-marker",
                "href": "#",
                "children": [
                    {"href": "map-google.html", "title":"Google"},
                    {"href": "map-vector.html", "title":"Vector"}
                ]
            },
            {
                "title":"Multi level dd",
                "logo": "fa-level-down",
                "href": "#",
                "children": [
                    { "href": "#", "title":"item 1.1"},
                    { "href": "#", "title":"item 1.2"},
                    {
                        "href": "#",
                        "title":"Menu 1.3",
                        "children":[
                            {"href": "#", "title":"item 1.3.1"},
                            {"href": "#", "title":"item 1.3.2"},
                            {"href": "#", "title":"item 1.3.3"},
                            {"href": "#", "title":"item 1.3.4"}
                        ]
                    },
                    { "href": "#", "title":"item 1.4"}
                ]
            },

        ]
    }
];

function initHeader(){
    var navbar = $(".navbar.top-navbar.navbar-expand-md.navbar-light");
        var navbar_header = $("<div>").addClass("navbar-header").appendTo(navbar);
            var navbar_brand = $("<a>").addClass("navbar-brand").attr("href","index.html").appendTo(navbar_header); 
               var navbar_logo = $("<b>").append($("<img>").attr({"src":"images/logo.png","alt":"homepage","class":"dark-logo"})).appendTo(navbar_brand);
               var navbar_logo_text = $("<span>").append($("<img>").attr({"src":"images/logo-text.png","alt":"homepage","class":"dark-logo"})).appendTo(navbar_brand);

        var navbar_collapse = $("<div>").addClass("navbar-collapse").appendTo(navbar);
            var ul_left = $("<ul>").addClass("navbar-nav mr-auto mt-md-0").appendTo(navbar_collapse);
                var nav_toggler = $("<li>").addClass("nav-item").appendTo(ul_left);
                    var nav_toggler_a = $("<a>").addClass("nav-link nav-toggler hidden-md-up text-muted").attr({"href":"#"}).appendTo(nav_toggler);
                        $("<i>").addClass("mdi mdi-menu").appendTo(nav_toggler_a);
                var sidebar_toggler = $("<li>").addClass("nav-item m-l-10").appendTo(ul_left);
                    var sidebar_toggler_a = $("<a>").addClass("nav-link sidebartoggler hidden-sm-down text-muted").attr({"href":"#"}).appendTo(sidebar_toggler);
                        $("<i>").addClass("ti-menu").appendTo(sidebar_toggler_a);
                // var search = $("<li>").addClass("nav-item hidden-sm-down search-box").appendTo(ul_left);
                //     var search_a = $("<a>").addClass("nav-link hidden-sm-down text-muted").attr({"href":"#"}).appendTo(search);
                //         $("<i>").addClass("ti-search").appendTo(search_a);
                //     var search_form = $("<form>").addClass("app-search").appendTo(search);
                //         var search_input = $("<input>").attr({"type":"text","placeholder":"Search here"}).addClass("form-control").appendTo(search_form);
                //         $("<a>").addClass("srh-btn").append($("<i>").addClass("ti-close")).appendTo(search_form);
                var dropdown = $("<li>").addClass("nav-item dropdown").appendTo(ul_left);
                    var dropdown_a = $("<a>").addClass("nav-link dropdown-toggle text-muted").attr({"href":"#","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}).appendTo(dropdown);
                        $("<i>").addClass("flag-icon flag-icon-us").appendTo(dropdown_a);
                    var dropdown_div = $("<div>").addClass("dropdown-menu animated zoomIn").appendTo(dropdown);
                        var ln_us = $("<a>").addClass("dropdown-item").attr("href","#").text("English").appendTo(dropdown_div);
                            $("<i>").addClass("flag-icon flag-icon-us").appendTo(ln_us);
                        var ln_ru = $("<a>").addClass("dropdown-item").attr("href","#").text("Russian").appendTo(dropdown_div);
                            $("<i>").addClass("flag-icon flag-icon-ru").appendTo(ln_ru);
            var ul_right = $("<ul>").addClass("navbar-nav my-lg-0").appendTo(navbar_collapse);
                var notifications = $("<li>").addClass("nav-item dropdown").appendTo(ul_right);
                    var notifications_a = $("<a>").addClass("nav-link dropdown-toggle text-muted").attr({"href":"#","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}).appendTo(notifications);
                        $("<i>").addClass("fa fa-bell").appendTo(notifications_a);
                        $('<div class="notify"> <span class="heartbit"></span> <span class="point"></span> </div>').appendTo(notifications_a);
                    var notifications_div = $("<div>").addClass("dropdown-menu dropdown-menu-right mailbox animated zoomIn").appendTo(notifications);
                        var notifications_ul = $("<ul>").appendTo(notifications_div);
                            var not_ul_title = $("<li>").appendTo(notifications_ul);
                                $("<div>").addClass("drop-title").text("Notifications").appendTo(not_ul_title);
                            var not_ul_messages = $("<li>").appendTo(notifications_ul);
                                var not_ul_messages_cont = $("<div>").addClass("message-center").appendTo(not_ul_messages);
                                    newAdminMessage("This is title","Just see the my new admin!","ID","9:30 AM","notif").appendTo(not_ul_messages_cont);
                            var not_ul_see_all = $("<li>").appendTo(notifications_ul);
                                var not_ul_see_all_a = $("<a>").addClass("nav-link text-center").attr("href","#").appendTo(not_ul_see_all);
                                    $("<strong>").text("Check all notifications").appendTo(not_ul_see_all_a);
                                    $("<i>").addClass('fa fa-angle-right').appendTo(not_ul_see_all_a);

                var messages = $("<li>").addClass("nav-item dropdown").appendTo(ul_right);
                    var messages_a = $("<a>").addClass("nav-link dropdown-toggle text-muted").attr({"href":"#","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false","id":"2"}).appendTo(messages);
                        $("<i>").addClass("fa fa-envelope").appendTo(messages_a);
                        $('<div class="notify"> <span class="heartbit"></span> <span class="point"></span> </div>').appendTo(messages_a);
                    var messages_div = $("<div>").addClass("dropdown-menu dropdown-menu-right mailbox animated zoomIn").attr({"aria-labelledby":"2"}).appendTo(messages);
                        var messages_ul = $("<ul>").appendTo(messages_div);
                            var mes_ul_title = $("<li>").appendTo(messages_ul);
                                $("<div>").addClass("drop-title").text("You have 1 new messages").appendTo(mes_ul_title);
                            var mes_ul_messages = $("<li>").appendTo(messages_ul);
                                var mes_ul_messages_cont = $("<div>").addClass("message-center").appendTo(mes_ul_messages);
                                    newAdminMessage("","Just see the my new admin!","ID","9:02 AM","message",{"name":"Michael Qin","status":"online","src":"images/users/5.jpg"}).appendTo(mes_ul_messages_cont);
                                    newAdminMessage("","I am a singer!","ID","9:08 AM","message",{"name":"Mr. John","status":"away","src":"images/users/3.jpg"}).appendTo(mes_ul_messages_cont);
                            var mes_ul_see_all = $("<li>").appendTo(messages_ul);
                                var mes_ul_see_all_a = $("<a>").addClass("nav-link text-center").attr("href","#").appendTo(mes_ul_see_all);
                                    $("<strong>").text("See all e-Mails").appendTo(mes_ul_see_all_a);
                                    $("<i>").addClass('fa fa-angle-right').appendTo(mes_ul_see_all_a);

                var user = $("<li>").addClass("nav-item dropdown").appendTo(ul_right);
                    var user_a = $("<a>").addClass("nav-link dropdown-toggle text-muted").attr({"href":"#","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}).appendTo(user);
                        $("<img>").attr({"src":"images/users/5.jpg","alt":"user"}).addClass("profile-pic").appendTo(user_a);
                    var user_div = $("<div>").addClass("dropdown-menu dropdown-menu-right animated zoomIn").appendTo(user);
                        var user_ul = $("<ul>").addClass("dropdown-user").appendTo(user_div);
                            var user_items = [{"logo":"ti-user","text":"Profile","onclick":""},{"logo":"ti-wallet","text":"Balance","onclick":""},{"logo":"ti-email","text":"Inbox","onclick":""},{"logo":"ti-settings","text":"Setting","onclick":""},{"logo":"fa fa-power-off","text":"Logout","onclick":""}];
                            for(let i in user_items){
                                let user_ul_li = $("<li>").attr("onclick",user_items[i].onclick).appendTo(user_ul);
                                    let a = $("<a>").attr("href","#").appendTo(user_ul_li);
                                        $("<i>").addClass(user_items[i].logo).appendTo(a);
                                        a.html(a.html() +" "+user_items[i].text);
                            }
}

$(function(){
    initHeader();
})


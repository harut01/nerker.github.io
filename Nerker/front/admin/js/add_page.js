tinymce.init({
	selector: "#textarea",	
	/* theme of the editor */
	theme: "modern",
	skin: "lightgray",	
	/* width and height of the editor */
	width: "100%",
	height: 300,	
	/* display statusbar */
	statubar: true,	
	/* plugin */
	plugins: [
		"advlist autolink link image lists charmap print preview hr anchor pagebreak",
		"searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
		"save table contextmenu directionality emoticons template paste textcolor"
	],
	/* toolbar */
	toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons",
	
	/* style */
	style_formats: [
		{title: "Headers", items: [
			{title: "Header 1", format: "h1"},
			{title: "Header 2", format: "h2"},
			{title: "Header 3", format: "h3"},
			{title: "Header 4", format: "h4"},
			{title: "Header 5", format: "h5"},
			{title: "Header 6", format: "h6"}
		]},
		{title: "Inline", items: [
			{title: "Bold", icon: "bold", format: "bold"},
			{title: "Italic", icon: "italic", format: "italic"},
			{title: "Underline", icon: "underline", format: "underline"},
			{title: "Strikethrough", icon: "strikethrough", format: "strikethrough"},
			{title: "Superscript", icon: "superscript", format: "superscript"},
			{title: "Subscript", icon: "subscript", format: "subscript"},
			{title: "Code", icon: "code", format: "code"}
		]},
		{title: "Blocks", items: [
			{title: "Paragraph", format: "p"},
			{title: "Blockquote", format: "blockquote"},
			{title: "Div", format: "div"},
			{title: "Pre", format: "pre"}
		]},
		{title: "Alignment", items: [
			{title: "Left", icon: "alignleft", format: "alignleft"},
			{title: "Center", icon: "aligncenter", format: "aligncenter"},
			{title: "Right", icon: "alignright", format: "alignright"},
			{title: "Justify", icon: "alignjustify", format: "alignjustify"}
		]}
	],
    images_upload_handler: function (blobInfo, success, failure) {
      var xhr, formData;
      xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open('POST', '/uploadImgs');
      xhr.onload = function() {
        var json;
  
        if (xhr.status != 200) {
          failure('HTTP Error: ' + xhr.status);
          return;
        }
        json = JSON.parse(xhr.responseText);
  
        if (!json || typeof json.location != 'string') {
          failure('Invalid JSON: ' + xhr.responseText);
          return;
        }
        success(json.location);
      };
      formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      xhr.send(formData);
    }
})

$(".createNewPage").parent().css({"text-align":"center"});

function createNewPage(){
    var iframe = $('#textarea_ifr');
    var editorContent = $('#tinymce[data-id="textarea"]', iframe.contents()).html();
    var title = $("#page_title").val();
	var addToMenu = $("#addToMenu").val();

    if(editorContent == '<p><br data-mce-bogus="1"></p>' || editorContent == '<p><br></p>' || title ==""){
        console.log("err");
    }
    else{        
        call("/create_page",{"title":title,"html":editorContent,"is_menu_item":addToMenu}).then((data)=>{			
			successMessage("New page successfully added!!","Done!!",function(){
				window.location.reload();
			});
        })
    }
}

function updatePage(){
    var iframe = $('#textarea_ifr');
    var editorContent = $('#tinymce[data-id="textarea"]', iframe.contents()).html();
    var title = $("#page_title").val();
	var addToMenu = $("#addToMenu").val();

    if(editorContent == '<p><br data-mce-bogus="1"></p>' || editorContent == '<p><br></p>' || title =="" || editorContent==""){
        console.log("err");
    }
    else{        
        call("/update_page",{"title":title,"html":editorContent,"is_menu_item":addToMenu,"id":url_params().upd}).then((data)=>{			
			successMessage("New page successfully added!!","Done!!",function(){
				window.location.href = "/admin/menu.html";
			});
        })
    }
}

$(document).ready(()=>{
	if("upd" in url_params()){
		call("/get_menu",{id:url_params().upd}).then((data)=>{
			var timeOut = setTimeout(()=>{
				var iframe = $('#textarea').parent().find("#mceu_21").find("iframe");
				var iframeDocument = iframe[0].contentDocument || iframe[0].contentWindow.document;
				var doc = iframeDocument.getElementById("tinymce");
				doc = $(doc);
				doc.html(data.resp[0].html);
				$("#page_title").val(data.resp[0].title);
				$("#updatePageBtn").show();
				$("#createNewPageBtn").hide();
		
			},500)
		})
	}
})



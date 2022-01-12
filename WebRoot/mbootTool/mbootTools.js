//
//modal=setModal("test","测试");
//showModal(modal);
//addModalInput(modal,getInput("enn","输入","请输入值">'))
//addModalInput(modal,getInputM("enn","输入",'<input class="Wdate form-control" type="text" onclick="WdatePicker({el:this,dateFmt:\'yyyy-MM-dd HH:mm:ss\'})" style="width:50px;">----<input class="Wdate form-control" type="text" onclick="WdatePicker({el:this,dateFmt:\'yyyy-MM-dd HH:mm:ss\'})" style="width:50px;">'))
//setModalCallback(modal,function(){alert(getModalInfo(modal))});

var addmodal=0;
function setModal(title)
{
	addmodal++;
	document.write("		<div class=\"modal fade\" id=\"myModal"+addmodal+"\" tabindex=\"-1\" role=\"dialog\"" + 
			"			aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">" + 
			"			<div class=\"modal-dialog\">" + 
			"				<div class=\"modal-content\">" + 
			"					<div class=\"modal-header\">" + 
			"						<button type=\"button\" class=\"close\" data-dismiss=\"modal\"" + 
			"							aria-hidden=\"true\">&times;</button>" + 
			"						<h4 class=\"modal-title\" id=\"myModalLabel"+addmodal+"\">"+title+"</h4>" + 
			"					</div>" + 
			"					<div class=\"modal-body\" >" + 
			"						<div style=\"padding: 10px 100px 10px;\">" + 
			"						    <form class=\"bs-example bs-example-form\" role=\"form\" id=\"formModal"+addmodal+"\">" + 
			"						    </form>" + 
			"						</div>" + 
			"					</div>" + 
			"					<div class=\"modal-footer\">" + 
			"						<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button>" + 
			"						<button type=\"button\" class=\"btn btn-primary\" id=\"myModalButton"+addmodal+"\">确定</button>" + 
			"					</div>" + 
			"				</div>" + 
			"			</div>" + 
			"		</div>");
	return addmodal;
}
function addModal(idname,title)
{
	addmodal++;
	$("#"+idname).append("		<div class=\"modal fade\" id=\"myModal"+addmodal+"\" tabindex=\"-1\" role=\"dialog\"" +
			"			aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">" +
			"			<div class=\"modal-dialog\">" +
			"				<div class=\"modal-content\">" +
			"					<div class=\"modal-header\">" +
			"						<button type=\"button\" class=\"close\" data-dismiss=\"modal\"" +
			"							aria-hidden=\"true\">&times;</button>" +
			"						<h4 class=\"modal-title\" id=\"myModalLabel"+addmodal+"\">"+title+"</h4>" +
			"					</div>" +
			"					<div class=\"modal-body\" >" +
			"						<div style=\"padding: 10px 100px 10px;\">" +
			"						    <form class=\"bs-example bs-example-form\" role=\"form\" id=\"formModal"+addmodal+"\">" +
			"						    </form>" +
			"						</div>" +
			"					</div>" +
			"					<div class=\"modal-footer\">" +
			"						<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button>" +
			"						<button type=\"button\" class=\"btn btn-primary\" id=\"myModalButton"+addmodal+"\">确定</button>" +
			"					</div>" +
			"				</div>" +
			"			</div>" +
			"		</div>");
	return addmodal;
}
function showModal(modal)
{
	$("#myModal"+modal).modal('show');
}

function hideModal(modal)
{
	$("#myModal"+modal).modal('hide');
}

function setModalCallback(modal,callback)
{
	$("#myModalButton"+modal).click(function(){
			hideModal(modal);
			callback();
		}
	);
}

function getModalInfo(modal)
{
	return $("#formModal"+modal).serialize();
}

function addModalInput(modal,input)
{
	$("#formModal"+modal).append(input);
}
function getModalFormId(modal)
{
	return "formModal"+modal;
}

function getModalId(modal)
{
	return "myModal"+modal;
}


//form=setForm("testaaa"); //testaa为div
//addFormInput(form,getInput("may","测试数","请输入字符","4"))
//addFormInput(form,getInput("may2","测试数2","请输入字符","4"))
//addFormInput(form,getInput("may3","测试数3","请输入字符","4"))
//alert(getFormInfo(form))


var addform=0;
function addForm(idname,style)
{
	addform++;
	$("#"+idname).append("<form class=\"bs-example bs-example-form\" role=\"form\" id=\"formSet"+addform+"\" style=\""+style+"\">" + 
			"</form>");
	return addform;
}
function addFormInput(form,input)
{
	$("#formSet"+form).append(input);
}
function addFormDiv(form,divid)
{
	$("#formSet"+form).append("<div id=\""+divid+"\"></div>");
	return divid;
}
function getFormId(form)
{
	return "formSet"+form;
}
function getFormInfo(form)
{
	return $("#formSet"+form).serialize();
}




//方案1
//layout=addLayout("testaaa","4 4 4")
//form=setForm(getLayoutId(layout,1));
//addFormInput(form,getInput("may","测试数","请输入字符","4"))
//addFormInput(form,getInput("may2","测试数2","请输入字符","4"))
//addFormInput(form,"<div id=\"ids\"></div>")
//layout1=addLayout("ids","4 4 4")
//addLayoutInfo(layout1,2,getButton("idsb","按钮",1));
//addLayoutInfo(layout1,2,getButton("idsb2","按钮2",1));
//alert(getFormInput(form))




// 方案2
//form=addForm("testaaa")
//addFormDiv(form,"testc")
//layout=addLayout("testc","4 4 4","text-align:center;")
//addLayoutInfo(layout,2,getButton("btn1","按钮",1))
//addLayoutInfo(layout,1,getButton("btn2","按钮2",1))
//addLayoutInfo(layout,0,getButton("btn3","按钮3",1))


var addlayout=0;
var addlayoutmaxsub={};
var addlayoutmaxsize={};
function addLayout(idname,format,style)
{
	addlayout++;
	$("#"+idname).append("<div class=\"row clearfix\" id=\"bootlayout"+addlayout+"\"   "+((style==null)?"":"style=\""+style+"\"")+"></div>");
	var spbar=format.split(" ");
	for(var i in spbar){
		$("#bootlayout"+addlayout).append("<div class=\"col-md-"+spbar[i]+" column\" id=\"bootlayout"+addlayout+"-sub"+i+"\"></div>");
		addlayoutmaxsub[addlayout]=i;
		if(addlayoutmaxsize[addlayout]==null)
			addlayoutmaxsize[addlayout]=0;
		addlayoutmaxsize[addlayout]=parseInt(spbar[i])+addlayoutmaxsize[addlayout];
	}
	return addlayout;
}
function addLayoutSub(layout,singalformat)
{
	addlayoutmaxsub[layout]=parseInt(addlayoutmaxsub[layout])+1;
	addlayoutmaxsize[layout]=parseInt(singalformat)+addlayoutmaxsize[layout];
	$("#bootlayout"+layout).append("<div class=\"col-md-"+singalformat+" column\" id=\"bootlayout"+layout+"-sub"+addlayoutmaxsub[layout]+"\"></div>");
	return layout;
}
function getLayoutSize(layout)
{
	return parseInt(addlayoutmaxsub[layout])+1;
}
function getLayoutLength(layout)
{
	return addlayoutmaxsize[layout];
}
function addLayoutInfo(layout,index,info)
{
	$("#bootlayout"+layout+"-sub"+index).append(info);
}
function getLayoutId(layout,index)
{
	return "bootlayout"+layout+"-sub"+index;
}






//var tabc=setTabContent("tcinfo");
//t=addTabContentInfo(tabc,"<button>test</button>");
//t1=addTabContentInfo(tabc,"<button>test1</button>");
//t2=addTabContentInfo(tabc,"<button>test2</button>");
//tab=addTab("ook");
//addTabLabel(tab,"Java",getSubTabContentId(t),1);
//addTabLabel(tab,"Java1",getSubTabContentId(t1),0);
//addTabLabel(tab,"Java2",getSubTabContentId(t2),0);

var tabcontent=0;
function setTabContent(idname)
{
	tabcontent++;
	document.write('<div id="myTabContent'+tabcontent+'" class="tab-content"></div>');
	return tabcontent;
}
function getTabContentId(tabcontent)
{
	return "myTabContent"+tabcontent;
}
var subtabcontent={};
function addTabContentInfo(tabcontent,info)
{
	if(subtabcontent[tabcontent]==null)
		subtabcontent[tabcontent]=0;
	subtabcontent[tabcontent]=subtabcontent[tabcontent]+1;
	if(subtabcontent[tabcontent]==1)
		$("#myTabContent"+tabcontent).append('<div class="tab-pane fade in active" id="subtabcontent_'+tabcontent+'_'+subtabcontent[tabcontent]+'">'+info+'</div>');
	else $("#myTabContent"+tabcontent).append('<div class="tab-pane fade" id="subtabcontent_'+tabcontent+'_'+subtabcontent[tabcontent]+'">'+info+'</div>');
	return '_'+tabcontent+'_'+subtabcontent[tabcontent];
}
function getSubTabContentId(subcontentindex)
{
	return "subtabcontent"+subcontentindex;
}
function addSubTabContentInfo(subcontentindex,info)
{
	$("#subtabcontent"+subcontentindex).append(info);
}
var addtab=0;
function addTab(idname,style)
{
	addtab++;
	var divtemp=$("#"+idname);
	divtemp.append('<ul id="myTab'+addtab+'" class="nav nav-tabs" style="'+style+'">');
	divtemp.append("</ul>")
	return addtab;
}
//var tabc=setTabContent("tcinfo");
//t=addTabContentInfo(tabc,'<div style="min-height:750px;"><table id="table" class="table table-bordered table-striped"></table></div>');
//setDiv("uptabs","padding-left:20px;")
//addDivInfo("uptabs","<hr>")
//tab=addPill("uptabs");
//addPillLabel(tab,"设备版本列表",getSubTabContentId(t),0);
function addPill(idname,style)
{
	addtab++;
	var divtemp=$("#"+idname);
	divtemp.append('<ul id="myTab'+addtab+'" class="nav nav-pills" style="'+style+'">');
	divtemp.append("</ul>")
	return addtab;
}
//type:1 active,0 inactive
function addTabLabel(tab,name,pid,type)
{
	if(type==0)
		$("#myTab"+tab).append('<li class="active"><a href="#'+pid+'" data-toggle="tab">'+name+'</a></li>')
	else if(type==1)
		$("#myTab"+tab).append('<li><a href="#'+pid+'" data-toggle="tab">'+name+'</a></li>')
}
function addPillLabel(tab,name,pid,type)
{
	if(type==0)
		$("#myTab"+tab).append('<li class="active"><a href="#'+pid+'" data-toggle="pill">'+name+'</a></li>')
	else if(type==1)
		$("#myTab"+tab).append('<li><a href="#'+pid+'" data-toggle="pill">'+name+'</a></li>')
}
function openTab(tab,index)
{
	$('#myTab'+tab+' li:eq('+index+') a').tab('show')
}
function openPill(tab,index)
{
	$('#myTab'+tab+' li:eq('+index+') a').tab('show')
}
function getTabId(tab)
{
	return "myTab"+tab;
}
function getPillId(tab)
{
	return "myTab"+tab;
}







function getInput(fname,title,placeHolder,defaultValue,style,readonly,disabled)
{
	return  "<div class=\"input-group\"  "+((style==null)?"":"style=\""+style+"\"")+"  > " + 
			"<span class=\"input-group-addon\" style=\"min-width:100px;\">"+title+"</span>" + 
			"<input type=\"text\" class=\"form-control\" placeholder=\""+placeHolder+"\"  name=\""+fname+"\" "+((defaultValue==null)?"":"value=\""+defaultValue+"\"")+"  "+((readonly==null)?"":readonly)+"  "+((disabled==null)?"":disabled)+"  >" + 
			"</div>" + 
			"<br>";
}
//class="form-control"
function getInputM(title,input,style)
{
	return  "<div class=\"input-group\"  "+((style==null)?"":"style=\""+style+"\"")+"  > " + 
			"<span class=\"input-group-addon\" style=\"min-width:100px;\">"+title+"</span>" + 
			input+
			"</div>" + 
			"<br>";
}
var addbutton=0;
function addBootButton(idname,label,style)
{
	addbutton++;
	$("#"+idname).append("<button id=\"bbtn"+addbutton+"\" type=\"button\" class=\"btn btn-primary\" "+((style==null)?"":"style=\""+style+"\"")+" >"+label+"</button>");
	return addbutton;
}
function setBootButtonCallback(button,callback)
{
	$("#bbtn"+button).click(function(){
		callback();
	})
}
function getBootButtonId(button)
{
	return "bbtn"+button;
}
//0默认 1原始 2成功 3警告 4谨慎 5危险 6链接
function getButton(idname,label,type,style,append)
{
	if(append==null)
		append='';
	if(type==null||type==0)
	{
		return "<button id=\""+idname+"\" "+append+" type=\"button\" class=\"btn btn-default\" "+((style==null)?"":"style=\""+style+"\"")+" >"+label+"</button>";
	}
	else if(type==1)
	{
		return "<button id=\""+idname+"\" "+append+" type=\"button\" class=\"btn btn-primary\" "+((style==null)?"":"style=\""+style+"\"")+" >"+label+"</button>";
	}
	else if(type==2)
	{
		return "<button id=\""+idname+"\" "+append+" type=\"button\" class=\"btn btn-success\" "+((style==null)?"":"style=\""+style+"\"")+" >"+label+"</button>";
	}
	else if(type==3)
	{
		return "<button id=\""+idname+"\" "+append+" type=\"button\" class=\"btn btn-info\" "+((style==null)?"":"style=\""+style+"\"")+" >"+label+"</button>";
	}
	else if(type==4)
	{
		return "<button id=\""+idname+"\" "+append+" type=\"button\" class=\"btn btn-warning\" "+((style==null)?"":"style=\""+style+"\"")+" >"+label+"</button>";
	}
	else if(type==5)
	{
		return "<button id=\""+idname+"\" "+append+" type=\"button\" class=\"btn btn-danger\" "+((style==null)?"":"style=\""+style+"\"")+" >"+label+"</button>";
	}
	else if(type==6)
	{
		return "<button id=\""+idname+"\" "+append+" type=\"button\" class=\"btn btn-link\" "+((style==null)?"":"style=\""+style+"\"")+" >"+label+"</button>";
	}
}

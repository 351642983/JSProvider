
var importfiles=[
	'js/jquery-1.11.0.min.js',
	'My97DatePicker/WdatePicker.js',
//	'bootstrap-3.3.7-dist/js/bootstrap.js',  //3
//	'bootstrap-table-dist/bootstrap-table.js', //3
//	'bootstrap-table-dist/locale/bootstrap-table-zh-CN.js', //3
	'https://cdn.staticfile.org/popper.js/1.15.0/umd/popper.min.js', //4
	'https://cdn.staticfile.org/twitter-bootstrap/4.3.1/js/bootstrap.min.js', //4
	'http://www.itxst.com/package/bootstrap-table-1.15.3/bootstrap-table.js', //4
	'https://unpkg.com/bootstrap-table@1.15.3/dist/locale/bootstrap-table-zh-CN.min.js' //4
	]
var importcssfiles=[
//	'bootstrap-3.3.7-dist/css/bootstrap.css', //3
//	'bootstrap-table-dist/bootstrap-table.css' //3
	'https://cdn.staticfile.org/twitter-bootstrap/4.3.1/css/bootstrap.min.css', //4
	'http://www.itxst.com/package/bootstrap-table-1.15.3/bootstrap-table.css' //4
	
	]


function getParam() {
    var js = document.getElementsByTagName("script");
    var obj = "";
    for (var i = 0; i < js.length; i++) {
        //遍历引用的script，找到引用a.js一行的script
        if (js[i].src.indexOf("import_static.js") >= 0) {
            //把src用'?'分隔成数组
            var arraytemp = js[i].src.split('/');
            //如果不带参数，则不执行下面的代码
            if (arraytemp.length > 1) {
                arraytemp.pop();
                obj=arraytemp.join("/")+"/";
            }
            break;
        }
    }
    return obj;
}
var dir=getParam()
for(var one in importfiles){
	if(!importfiles[one].startsWith("http"))
		document.write("<script language='javascript' src='"+dir+importfiles[one]+"'></script>");
	else document.write("<script language='javascript' src='"+importfiles[one]+"'></script>");
}
for(var one in importcssfiles){
	if(!importcssfiles[one].startsWith("http"))
		document.write('<link rel="stylesheet" href="'+dir+importcssfiles[one]+'">');
	else document.write('<link rel="stylesheet" href="'+importcssfiles[one]+'">');
}



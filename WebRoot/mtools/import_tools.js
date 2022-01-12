/**
 *扩展ie中不兼容的startsWith,endsWith方法
 */
String.prototype.startsWith = String.prototype.startsWith || function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}
String.prototype.endsWith = String.prototype.endsWith || function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}
var importfiles=[
	'jquery.min.js',
	'array_math.js',
	'stringhandle.js',
	'mwxloader.js',
	'basejsfunc.js',
	'dropimg.js'
	]
var importcssfiles=[
	'mwxloader.css',
//	'search-form.css'
	'style.css'
	]

var HeadBaseInserter = document.getElementsByTagName('head')[0],baseStyleLoader = document.createElement('style');
function linkScript(parm, fn) {
	var linkScript;
	if(/\.css[^\.]*$/.test(parm)) {
		linkScript = document.createElement("link");
		linkScript.type = "text/" + ("css");
		linkScript.rel = "stylesheet";
		linkScript.href = parm;
	} else {
		linkScript = document.createElement("script");
		linkScript.type = "text/" + ("javascript");
		linkScript.src = parm;
	}
	HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)
	linkScript.onload = linkScript.onerror = function() {
		if(fn) fn()
	}
}
function linkScriptDOMLoaded(parm){
    baseStyleLoader.innerHTML = 'body{display:none}';//动态加载文件造成样式表渲染变慢，为了防止DOM结构在样式表渲染完成前显示造成抖动，先隐藏body，样式表读完再显示
    HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.firstChild)
    var linkScript, linckScriptCount = parm.length, currentIndex = 0;
    for ( var i = 0 ; i < parm.length; i++ ){
        if(/\.css[^\.]*$/.test(parm[i])) {
            linkScript = document.createElement("link");
            linkScript.type = "text/" + ("css");
            linkScript.rel = "stylesheet";
            linkScript.href = parm[i];
        } else {
            linkScript = document.createElement("script");
            linkScript.type = "text/" + ("javascript");
            linkScript.src = parm[i];
        }
        HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)
        linkScript.onload = linkScript.onerror = function(){
            currentIndex++;
            if(linckScriptCount == currentIndex){
                baseStyleLoader.innerHTML = 'body{display:block}';
                HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.lastChild)
            }
        }
    }
}
///移除平板样式文件
function removeStyles(filename){
  var targetelement = "link";
  var targetattr = "href";
  var allsuspects = document.getElementsByTagName(targetelement)
  for (var i = allsuspects.length; i>=0 ; i--){
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
      allsuspects[i].parentNode.removeChild(allsuspects[i])
    }
  }
}
// linkScriptDOMLoaded([
//     "/content/bootstrap/assets/css/style.css",
//     "/content/bootstrap/assets/css/bootstrap.css",
//     "/content/bootstrap/assets/js/footable/css/footable.standalone.css"
// ])
// linkScript("/content/bootstrap/assets/css/entypo-icon.css")
// linkScript("/content/bootstrap/assets/css/font-awesome.css")
function getParam() {
    var js = document.getElementsByTagName("script");
    var obj = "";
    for (var i = 0; i < js.length; i++) {
        //遍历引用的script，找到引用a.js一行的script
        if (js[i].src.indexOf("import_tools.js") >= 0) {
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
var dirRootBase=getParam()
for(var one in importfiles){
	var rootposition=dirRootBase+importfiles[one];
	
	// linkScript(rootposition)
	document.write("<script language='javascript' src='"+rootposition+"'></script>");
}
for(var one in importcssfiles){
	var rootposition=dirRootBase+importcssfiles[one];
	
	document.write('<link rel="stylesheet" href="'+rootposition+'">');
}
document.write("<script language='javascript' src='https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js'></script>");

 
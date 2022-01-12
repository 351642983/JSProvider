function randomColor() {
	var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    var res = "";
    for (var i = 0; i < 6; i++) {
        var id = Math.ceil(Math.random() *(chars.length-1) );
        res += chars[id];
    }
    return "#"+res;
}


function isArray(obj)
{
	if(typeof obj.length == 'number' )
	{
		return true;
	}
	return false;
}
//getSelect("test",["x1","x2"],[1,2],"form-control")
function getSelect(fname,names,values,classf,style,append)
{
	if(classf==null)
		classf="form-control";
	var result="<select name='"+fname+"' class='"+classf+"' style='"+style+"' "+append+">"
	for(var i=0;i<names.length;i++)
	{
		result+="<option value='"+values[i]+"'>"+names[i]+"</option>";
	}
	result+="</select>";
	return result;
}
function getDiv(dividname,style)
{
	return "<div id=\""+dividname+"\" style=\""+style+"\"></div>";
}
function addDiv(idname,dividname,style)
{
	$("#"+idname).append("<div id=\""+dividname+"\" style=\""+style+"\"></div>");
}
function setDiv(dividname,style)
{
	document.write("<div id=\""+dividname+"\" style=\""+style+"\"></div>");
}
function addDivInfo(idname,info)
{
	$("#"+idname).append(info);
}
function setDivInfo(idname,info)
{
	$("#"+idname).html(info);
}
function getQueryString(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
//复制的方法
function copyText(text, callback){ // text: 要复制的内容， callback: 回调
    var tag = document.createElement('input');
    tag.setAttribute('id', 'cp_hgz_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('cp_hgz_input').select();
    document.execCommand('copy');
    document.getElementById('cp_hgz_input').remove();
    if(callback) {callback(text)}
}
function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
function resetform(formid)
{
	$('#'+formid)[0].reset(); 
	return false;
}
function setButtonCallback(button,callback)
{
	$("#"+button).click(function(){
		callback();
	})
}
	
//function searchToggle(obj, evt){
//	var container = $(obj).closest('.search-wrapper');
//
//	if(!container.hasClass('active')){
//		  container.addClass('active');
//		  evt.preventDefault();
//	}
//	else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
//		  container.removeClass('active');
//		  // clear input
//		  container.find('.search-input').val('');
//		  // clear and hide result container when we press close
//		  container.find('.result-container').fadeOut(100, function(){$(this).empty();});
//	}
//}
//var addsearch=0;
//function addSearch(idname,placeholder,func,style)
//{
//	addsearch++;
//	$("#"+idname).append("<div class=\"search-wrapper active"+
////		(isopen?"active":"")+
//	"\" style=\""+style+"\">\r\n" + 
//	"		<div class=\"input-holder\">\r\n" + 
//	"			<input type=\"text\" class=\"search-input\" placeholder=\""+placeholder+"\" id='searchinfo"+addsearch+"' />\r\n" + 
//	"			<button class=\"search-icon\" onClick=\"searchToggle(this, event);\" id='btnsearchinfo"+addsearch+"'><span></span></button>\r\n" + 
//	"		</div>\r\n" + 
////	(hasclose?"		<span class=\"close\" onClick=\"searchToggle(this, event);\"></span>\r\n":"") + 
//	"		<div class=\"result-container\"></div>\r\n" + 
//	"	</div>");
//	
//	$("#btnsearchinfo"+addsearch).click(function(){
//		var container = $(this).closest('.search-wrapper');
//		if(container.hasClass("active"))
//		{
//			func($("#searchinfo"+addsearch).val());
//		}
//	});
//	return addsearch;
//}
//function getSearchId()
//{
//	return "searchinfo"+addsearch;
//}
//function getSearchInfo()
//{
//	return $("#searchinfo"+addsearch).val();
//}
//滚动方式坐标获取
var _scrolltype=1;
_registerOnScrollEvent=[]
_registerOnScrollEventParams=[]
//function(opcity,scrollTop,height,relativeTop)
function registerOnScroll(event,minParams,maxParams,minToMax,inrange)
{
	_registerOnScrollEvent.push(event);
	_registerOnScrollEventParams.push({"min":minParams,"max":maxParams,"type":minToMax,"inrange":inrange});
}
$(window).scroll(function(e) {
	for(let i in _registerOnScrollEvent){
		var _top;
		if(_scrolltype==0)
			_top=getNowTop();
		else _top=getElementTop();
		let scrollTop=_top;
		let rootheight=window.innerHeight;
		let height=_registerOnScrollEventParams[i].max*rootheight-_registerOnScrollEventParams[i].min*rootheight;
		let relativeTop=scrollTop-_registerOnScrollEventParams[i].min*rootheight;
		let pointOpacity =[1.0,0,1];
		if(_registerOnScrollEventParams[i].type)
			pointOpacity=[0,1.0,-1];
		let opacity=-1.0;
		if(relativeTop>=-_registerOnScrollEventParams[i].inrange && -_registerOnScrollEventParams[i].inrange <= height-relativeTop)
		{
			if (relativeTop < height) {
				opacity = pointOpacity[0]-(relativeTop / height)*pointOpacity[2];
			} else {
				opacity = pointOpacity[1];
			}
			if(opacity>1)
				opacity=1;
			if(opacity<0)
				opacity=0;
			_registerOnScrollEvent[i](opacity,scrollTop,height,relativeTop,e);
		}
	}
});

function getTopScrollValue()
{
	var _top;
	if(_scrolltype==0)
		_top=getNowTop();
	else _top=getElementTop();
	return _top/window.innerHeight;
}
function getBottomScrollValue()
{
	var _top;
	if(_scrolltype==0)
		_top=getNowTop();
	else _top=getElementTop();
	return _top/window.innerHeight;
}

function getObjcetTopValue(queryobj){
	return queryobj.offset().top/window.innerHeight;
}
function getObjcetBottomValue(queryobj){
	return (queryobj.offset().top+queryobj.height())/window.innerHeight;
}
function getObjectTop(queryobj){
	return queryobj.offset().top;
}
function getObjectBottom(queryobj){
	return queryobj.offset().top+queryobj.height();
}
function getUpperTopObjectValue(queryobj,uppernum){
	return (queryobj.offset().top-uppernum)/window.innerHeight;
}
function getDownTopObjectValue(queryobj,downnum){
	return (queryobj.offset().top+downnum)/window.innerHeight;
}
function getUpperBottomObjectValue(queryobj,uppernum){
	return (queryobj.offset().top+queryobj.height()-uppernum)/window.innerHeight;
}
function getDownBottomObjectValue(queryobj,downnum){
	return (queryobj.offset().top+queryobj.height()+downnum)/window.innerHeight;
}


function getUpperObjectValueTop(queryobj,uppernum){
	return (queryobj.offset().top-uppernum)/window.innerHeight;
}
function getDownObjectValueTop(queryobj,downnum){
	return (queryobj.offset().top+downnum)/window.innerHeight;
}
function getUpperTop(topvalue,pxnum)
{
	return (topvalue*window.innerHeight-pxnum)/window.innerHeight;
}
function getDownTop(topvalue,pxnum)
{
	return (topvalue*window.innerHeight+pxnum)/window.innerHeight;
}


function getPxUpperOpcity(base,upper,opcity,otherap)
{
	if(otherap==null)
		otherap="px";
	return (base+upper*opcity)+otherap;
}
function getPxDownOpcity(base,down,opcity,otherap)
{
	if(otherap==null)
		otherap="px";
	return (base-down*opcity)+otherap;
}
function getNowTop()
{
	return document.body.scrollTop;
}
function getElementTop(){
	return document.documentElement.scrollTop;
}
 $(function(){
	$.fn.extend({
		"preventScroll":function(fn){  
			// $(this).each(function(){  
				
			// })  
		  $(this).bind('mousewheel', function(e) {
			var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
							(e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
			return fn(e,delta);
		  });
		},
		"allowScroll":function(){
			// $(this).each(function(){  
				
			// })
			$(this).unbind('mousewheel');
		} ,
		"hasEvent":function(event){
			var $events = jQuery._data(this[0],"events");
			if( $events && $events[event] ){
				return true;
			}
			return false;
		},
		"leftInParent":function () {
			return $(this).position().left/$(this).parent().width()*100;
		},
		"topInParent":function () {
			return $(this).position().top/$(this).parent().height()*100;
		}
	 });
	 //注册全局组件
	 Vue.component('hiv', {
	 	template:"<div :style='{display: display,\"flex-direction\": direction}' class='_hiv'><slot></slot></div>",
	 	props:{
	 			// mode:{
	 			//       type: String,
	 			//       default: 'space-between'
	 			// },
	 	},
	 	data:function(){
	 		return {
	 		display:'flex',
	 		direction:'row',
	 		}
	 	}
	 });
	 Vue.component('viv', {
	 	template:"<div :style='{display: display,\"flex-direction\": direction}' class='_viv'><slot></slot></div>",
	 	props:{
	 			// mode:{
	 			//       type: String,
	 			//       default: 'space-between'
	 			// },
	 	},
	 	data:function(){
	 		return {
	 		display:'flex',
	 		direction:'column',
	 		}
	 	}
	 });
	 Vue.component('rhiv',{
	 	template:"<div :style='{display: display,\"flex-direction\": direction}' class='_rhiv'><slot></slot></div>",
	 	props:{
	 			// mode:{
	 			//       type: String,
	 			//       default: 'space-between'
	 			// },
	 	},
	 	data:function(){
	 		return {
	 		display:'flex',
	 		direction:'row-reverse',
	 		}
	 	}
	 });
	 Vue.component('rviv',{
	 	template:"<div :style='{display: display,\"flex-direction\": direction}'  class='_rviv'><slot></slot></div>",
	 	props:{
	 			// mode:{
	 			//       type: String,
	 			//       default: 'space-between'
	 			// },
	 	},
	 	data:function(){
	 		return {
	 		display:'flex',
	 		direction:'column-reverse',
	 		}
	 	}
	 });
	 //不支持block和pow，含有属性
	 Vue.component('wiv',{
	 	template:"<div :style='{display: display,\"flex-direction\":direction,\"flex-wrap\":wrap,\"justify-content\":mode,\"align-content\":vmode}' class='_wiv'><slot></slot></div>",
		props:{
				mode:{
				      type: String,
				      default: 'space-between'
				},
				vmode:{
					type: String,
					default: 'space-between'
				},
				direction:{
					type: String,
					default: 'row'
				}
		},
		data:function(){
			return {
			display:'flex',
			wrap:'wrap'
			
			}
		}
		
	 });
	 Vue.component('rwiv',{
	 	template:"<div :style='{display: display,\"flex-direction\":direction,\"flex-wrap\":wrap,\"justify-content\":mode,\"align-content\":vmode}' class='_wiv'><slot></slot></div>",
	 	props:{
	 			mode:{
	 			      type: String,
	 			      default: 'space-between'
	 			},
				vmode:{
					type: String,
					default: 'space-between'
				},
				direction:{
					type: String,
					default: 'row'
				}
	 	},
	 	data:function(){
	 		return {
	 		display:'flex',
	 		wrap:'wrap-reverse',
	 		}
	 	}
	 });
	 
	 
	 Vue.component('pow', {
	 	template:"<div ref='pow' class='_pow' :style=\"{width:this.width,height:this.height,'flex':this.flex}\"><slot></slot></div>",
		props:{
				length:{
				      type: String,
				      default: '100%'
				},
				flex:{
					type: String,
					default: '1.0'
				}
		},
		data:function(){
			return {
			height:'100%',
			width:'100%',
			run:false}
		},
		 created:function(){
			// if(this.$data.run=='10%')
			// {
			// 	this.$data.run=1;
			// 	alert('test');
			// }
			 if(parseInt(Vue.version[0])==1) {
				 if (!this.$data.run) {
					 this.$data.run = true;
					 if (this.$parent.$el.className.indexOf('_viv') != -1) {
						 this.$data.width = '0%';
						 this.$data.height = this.length;

					 } else if (this.$parent.$el.className.indexOf('_hiv') != -1) {

						 this.$data.height = '0%';
						 this.$data.width = this.length;
					 }
				 }
			 }



		},
		 mounted:function(){
			 // if(this.$data.run=='10%')
			 // {
			 // 	this.$data.run=1;
			 // 	alert('test');
			 // }
			 if(parseInt(Vue.version[0])>1) {
				 if (!this.$data.run) {
					 this.$data.run = true;
					 if (this.$parent.$el.className.indexOf('_viv') != -1) {
						 this.$data.width = '0%';
						 this.$data.height = this.length;

					 } else if (this.$parent.$el.className.indexOf('_hiv') != -1) {

						 this.$data.height = '0%';
						 this.$data.width = this.length;
					 }
				 }
			 }



		 }


	 })
	 Vue.component('block', {
	 	template:"<div ref='block' class='_block' :style='{width:width,height:height,\"flex-shrink\":this[\"flex-shrink\"]}'><slot></slot></div>",
		props:{
				length:{
				      type: String,
				      default: '100%'
				},

		},
		data:function(){
			return {
			height:'100%',
			width:'100%',
			'flex-shrink':0,
			run:false}
		},created:function(){
			// if(this.$data.run=='10%')
			// {
			// 	this.$data.run=1;
			// 	alert('test');
			// }
			if(parseInt(Vue.version[0])==1)
			{
				if(!this.$data.run)
				{
					this.$data.run=true;
					if(this.$parent.$el.className.indexOf('_viv')!=-1||this.$parent.$el.className.indexOf('_rviv')!=-1)
					{
						this.$data.width='0%';
						this.$data.height=this.length;

					}
					else if(this.$parent.$el.className.indexOf('_hiv')!=-1||this.$parent.$el.className.indexOf('_rhiv')!=-1)
					{

						this.$data.height='0%';
						this.$data.width=this.length;

					}

				}
			}

			 // console.log(this.$data.$el.className)
		}
		,mounted:function(){
			 // if(this.$data.run=='10%')
			 // {
			 // 	this.$data.run=1;
			 // 	alert('test');
			 // }
			 if(parseInt(Vue.version[0])>1)
			 {
				 if(!this.$data.run)
				 {
					 this.$data.run=true;
					 if(this.$parent.$el.className.indexOf('_viv')!=-1||this.$parent.$el.className.indexOf('_rviv')!=-1)
					 {
						 this.$data.width='0%';
						 this.$data.height=this.length;

					 }
					 else if(this.$parent.$el.className.indexOf('_hiv')!=-1||this.$parent.$el.className.indexOf('_rhiv')!=-1)
					 {

						 this.$data.height='0%';
						 this.$data.width=this.length;

					 }

				 }
			 }

			 // console.log(this.$data.$el.className)
		 }
	 })
	 
	 

	 
	 
});
function loadLayout(id){
	$(function(){
		if(id==null)
		{
			var bodyEle = document.body;
			// $(bodyEle).wrap("<div id='_thlayout_MXFTWCG' style='display:flex;'></div>");
			bodyEle.innerHTML="<div id='_thlayout_MXFTWCG'>"+bodyEle.innerHTML+"</div>";
			new Vue({el:"#_thlayout_MXFTWCG"});
		}
		else{
			new Vue({el:"#"+id});
		}
	})
}
function loadLayoutClass(c){
	$(function(){
		new Vue({el:"."+c});
	})
}


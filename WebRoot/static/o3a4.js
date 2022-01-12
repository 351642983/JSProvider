//groupid:19--------js：OA属性定义-------------
//元素vue
_elevue={};

//popid映射eleid
_popid_eleid={}

//是否配置
_oaconfigable=true;

//无需忽略组件名
_oabasetitle=["组件编号","组件类型","添加前组件","添加后组件","添加内组件","访问权限字典","样式类","配置模式可见","默认配置"];

//静态加载的数据type
_oastaticdata=[];


//载入不加载的组件属性name 只加载一次的设置 (目前已失效)
_oafirstnotload=[];

//控制上述载入这一次不加载的设置
_oathatnotload=[]

//让OAClass的元素在拥有的样式属性
var _haveoatype=[
    {name:"id",title:"组件编号",ignore:[],append:'readonly',type:"属性",geteval:"el.attr(name)",seteval:"el.attr(name,value)"},
];

//设置记录撤销最高步数
var _maxrecord=10;
var _oarecordinfo=[];

//应用类属性注册
var _oabaseclass={"移动端隐藏":"mhidden","PC端隐藏":"phidden",
    "表单内组件样式":{
        class:"oa-formstyle",
        addeval:"el.parent().css('position','relative')",
        removeeval:"",
        register:['div']
    }
}

//OA的预加载js
var _oajs={};

//定义组件
_oacomponent={};

//定义OA栏目
var _oatitle=["属性","样式",]

//eleid映射表
var _mappereleid={};

//这里规定一下信息样式：
//临时元素信息
var _eleinfos=[];

//中介元素消息
var _elemidinfos=[]

//历史元素信息
var _confirmeleinfos=[];

//oa布局信息{数字(layoutgroup):"外层样式"}
var _oalayout={}


//oa加载完成属性 id:true
var _oaloadfinish={}

//添加元素到布局，1或before元素前添加 2或in元素中添加 3或after元素后添加
function addOALayout(el,oacomponent_name,type,oid,tid,position){

    if(_oacomponent[oacomponent_name]==null)
        return false;
    var outterid="outter_"+(new Date()).valueOf();
    if(oid!=null)
        outterid=oid;
    var outter=$("<div id='{0}' class='_outterdiv' style='min-width:10px;min-height:10px;'></div>".format(outterid));
    if(type==null)
        type="in";
    //组件事前操作
    if(_oacomponent[oacomponent_name].pre!=null)
        eval(_oacomponent[oacomponent_name].pre)
    var cloneTemp=_oacomponent[oacomponent_name].el.clone(true);
    cloneTemp.addClass("oa-element");
    var tempid="ele_"+(new Date()).valueOf();
    if(tid!=null)
        tempid=tid;


    cloneTemp.attr("id",tempid);
    outter.append(cloneTemp);
    if(type=="0"||type==0)
        el.before(outter);
    else if(type=="before"||type=="1"||type==1)
        el.parent().before(outter);
    else if(type=="in"||type=="2"||type==2)
        el.append(outter);
    else if(type=="after"||type=="3"||type==3)
        el.parent().after(outter);
    else if(type=="4"||type==4)
        el.after(outter);
    //弹簧做特殊处理
    if(oacomponent_name=="弹簧")
    {
        if(type==2)
        {
            if(el.hasClass("_hiv")){
                outter.addClass("_hiv");
            }
            else if(el.hasClass("_viv")){
                outter.addClass("_viv");
            }
        }
        else{
            if(el.parent().parent().hasClass("_hiv")){
                outter.addClass("_hiv");
            }
            else if(el.parent().parent().hasClass("_viv")){
                outter.addClass("_viv");
            }
        }

    }
    var elid=el.attr("id");
    var tempvue={el:"#"+outterid};
    if(_oacomponent[oacomponent_name].extendvue!=null)
        Object.assign(tempvue,deepCopy(_oacomponent[oacomponent_name].extendvue))
    var layoutvue=new Vue(tempvue);

    _elevue[tempid]=layoutvue;
    loadOA(layoutvue);
    //组件事后操作
    if(_oacomponent[oacomponent_name].post!=null)
        eval(_oacomponent[oacomponent_name].post)
    //弹簧做特殊处理
    if(oacomponent_name=="弹簧")
    {
        $("#"+outterid).attr("style",$("#"+outterid).find("._pow").attr("style"));
    }
    //测试添加ele
    setOAEleInfo($("#"+tempid),_eleinfos,oacomponent_name,position);
    setOAEleInfo($("#"+tempid),_elemidinfos,oacomponent_name,position);
    //添加元素方式
    var one=getOAEleInfo($("#"+tempid),_eleinfos);
    one["addtype"]=type;
    one["addposition"]=el.attr("id");
    var two=getOAEleInfo($("#"+tempid),_elemidinfos);
    two["addtype"]=type;
    two["addposition"]=el.attr("id");
    //console.log(JSON.stringify(_eleinfos));
    return tempid;
}

(function ($) {
    //删除元素行内style中单个style和多个style
    //示例：
    //$(".b").removeCss("color");
    //$(".b").removeCss(["color", "border", "width"]);
    $.fn.removeCss = function (options) {
        var type = typeof (options);
        if (type === "string") {
            this.each(function () {
                var style = $(this).attr("style");
                if(style==null)
                    return true;
                var arr = style.split(";");
                style = "";
                for (var i = 0; i < arr.length; i++) {
                    if ($.trim(arr[i]) == "") {
                        continue;
                    }
                    var att = arr[i].split(":");
                    if ($.trim(att[0]) == $.trim(options)) {
                        continue;
                    }
                    style += $.trim(arr[i]) + ";";
                }
                $(this).attr("style", style);
            });
        } else if ($.isArray(options)) {
            this.each(function () {
                var style = $(this).attr("style");
                if(style==null)
                    return true;
                var arr = style.split(";");
                style = "";
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < options.length; j++) {
                        if ($.trim(arr[i]) == "") {
                            break;
                        }
                        var att = arr[i].split(":");
                        if ($.trim(att[0]) == $.trim(options[j])) {
                            arr[i] = "";
                            continue;
                        }
                    }
                }
                for (var i = 0; i < arr.length; i++) {
                    if ($.trim(arr[i]) != "") {
                        style += $.trim(arr[i]) + ";";
                    }
                }
                if ($.trim(style) == "") {
                    $(this).removeAttr("style");
                } else {
                    $(this).attr("style", style);
                }
            });
        }
    };
})(jQuery)

//加载基础组件属性
function loadOAComponent(){
    //注册组件
    _oacomponent['基础Div']={el:$("<div class='_oa-div' style='padding:var(--inlayout-distance)'></div>"),post:"var This=$('#'+tempid);if(This.attr('oacomjs')!=null){eval(This.attr('oacomjs'));}"};
    _oacomponent['横向布局']={el:$("<hiv style='padding:var(--inlayout-distance)'></hiv>"),post:"var This=$('#'+tempid);if(This.attr('oacomjs')!=null){eval(This.attr('oacomjs'));}"};
    _oacomponent['纵向布局']={el:$("<viv style='padding:var(--inlayout-distance)'></viv>"),post:"var This=$('#'+tempid);if(This.attr('oacomjs')!=null){eval(This.attr('oacomjs'));}"};
    _oacomponent['浮动布局']={el:$("<wiv style='padding:var(--inlayout-distance)'></wiv>"),post:"var This=$('#'+tempid);if(This.attr('oacomjs')!=null){eval(This.attr('oacomjs'));}"};
    _oacomponent['弹簧']={el:$("<pow ></pow>"),notin:['基础Div','浮动布局']};
    // _oabaseclass["流居中"]={
    //     class:"flowcenter",
    //     addeval:`el.css('justify-content','center');
    //     setOAInfo(el,'整体样式',el.attr('style'));`,
    //     removeeval:"el.removeCss('justify-content');setOAInfo(el,'整体样式',el.attr('style'));",
    //     register:["._viv","._hiv","._wiv","._oa-form"]
    // }
    // _oabaseclass["垂直流居中"]={
    //     class:"vflowcenter",
    //     addeval:`el.css('align-items','center');setOAInfo(el,'整体样式',el.attr('style'));`,
    //     removeeval:"el.removeCss('align-items');setOAInfo(el,'整体样式',el.attr('style'));",
    //     register:["._viv","._hiv"]
    // }
    // _oabaseclass["垂直内容居中"]={
    //     class:"wvflowcenter",
    //     addeval:`el.css('align-content','center');setOAInfo(el,'整体样式',el.attr('style'));`,
    //     removeeval:"el.removeCss('align-content');setOAInfo(el,'整体样式',el.attr('style'));",
    //     register:["._wiv","._oa-form"]
    // }

    //高度问题：应该解决了吧？
    _haveoatype.push({name:"width",title:"宽度",ignore:["._pow",".oa-layout"],type:"样式",geteval:"getOAInfo(el,'宽度')||'auto'",update:['style','height'],seteval:"if(value!=null)el.css(name,value);if(value!=null&&(value+'').indexOf('%')!=-1){el.css(name,'100%');el.parent().css(name,value);}"});
    _haveoatype.push({name:"height",title:"高度",ignore:["._pow",".oa-layout"],type:"样式",geteval:"getOAInfo(el,'高度')||'auto'",update:['style','width'],seteval:"if(value!=null)el.css(name,value);if(value!=null&&(value+'').indexOf('%')!=-1){el.css(name,'100%');el.parent().css(name,value);}"});
    _haveoatype.push({name:"bclass",title:"样式类",ignore:[],type:"样式",geteval:"el.attr('class')",seteval:"el.attr('class',value);",make:"textarea",append:"style='resize:none;height:150px'"})
    _haveoatype.push({name:"style",title:"整体样式",ignore:["._pow"],type:"样式",geteval:"var styleinfo=(el.attr(name)||'')+''; styleinfo.replace(/\s*;\s*/g,';\\n')",seteval:"if(value!=null&&value!='')el.attr(name,value.replace(/\\n/g,\"\"));",make:"textarea",append:"style='resize:none;height:150px'",delay:10})

    _haveoatype.push({name:"oacomjs",title:"组件JS",ignore:[],only:["._oa-div","._hiv","._viv","._wiv"],type:"属性",geteval:"el.attr(name)",seteval:"el.attr(name,value);var This=el;function loadoacomjs(This,value){setTimeout(function(){if(value!=null)eval(value);},100)};loadoacomjs(This,value);",make:"textarea",append:"style='resize:none;height:150px'"})
    _oafirstnotload.push("oacomjs");
    //为oa-layout元素添加一个可以添加内部属性的属性
    _haveoatype.push({
        name:"aconfigshow",
        title:"配置模式可见",
        ignore:[],
        only:[],
        type:"样式",
        geteval:"((!el.hasClass('oa-configshow'))?'不做设置':'仅配置可见')",
        seteval:"if(value=='不做设置'){if(el.hasClass('oa-configshow'))el.removeClass('oa-configshow');}else if(value=='仅配置可见'){if(!el.hasClass('oa-configshow'))el.addClass('oa-configshow');if(!_oaconfigable)el.parent().hide();}",
        make:"select",
        makeeval:"\
               This.append('<option value=\"不做设置\">不做设置</option>');\
               This.append('<option value=\"仅配置可见\">仅配置可见</option>');\
		"
    });


    //添加一个类应用多选框
    _haveoatype.push({
        name:"oaconfigclass",
        title:"默认配置",
        ignore:[],
        only:[],
        type:"属性",
        geteval:"",
        seteval:"function getBaseClassIndex(c){\n" +
            "            for(var i in _oabaseclass){\n" +
            "                if(_oabaseclass[i].class==null){\n" +
            "                }else{\n" +
            "                    if(_oabaseclass[i].class==c){\n" +
            "                        return i;\n" +
            "                    }\n" +
            "                }\n" +
            "            }\n" +
            "            return -1;\n" +
            "        }" +
            "value=((el.attr('class')!=null)?el.attr('class').split(' '):[]);" +
            "   for(var i in value){\n" +
            "            el.addClass(value[i]);\n" +
            "            var ctpid=getBaseClassIndex(value[i]);\n" +
            "            if(ctpid!=-1&&judgeTagOnly(el,_oabaseclass[ctpid].register)){\n" +
            "                 eval(_oabaseclass[ctpid].removeeval);" +
            "                 eval(_oabaseclass[ctpid].addeval);" +
            "             }\n" +
            "    }\n" ,
        make:"select",

        makeeval:"\
                     function getBaseClassIndex(c){\
                        for(var i in _oabaseclass){\                \
                            if(_oabaseclass[i].class==null){\
                            }else{\
                                if(_oabaseclass[i].class==c){\
                                    return i;\
                                }\
                            }\
                        }\
                        return -1;\
                     }\
				     oaclachange=function(a){\
				         var value=a.multipleSelect('getSelects');\
				         for(var i in value){\
				             if(!el.hasClass(value[i])){\
				                 el.addClass(value[i]);\
				                 var ctpid=getBaseClassIndex(value[i]);\
				                 if(ctpid!=-1&&judgeTagOnly(el,_oabaseclass[ctpid].register)){\
				                    eval(_oabaseclass[ctpid].removeeval);\
				                    eval(_oabaseclass[ctpid].addeval);\
				                   }\
				                 el.show();\
				             }\
				          }\
				          for(var i in _oabaseclass){\
				              if(!judgeTagOnly(el,_oabaseclass[i].register))\
				                continue;\
				             if(_oabaseclass[i].removeeval==null){\
                                 if(value.indexOf(_oabaseclass[i])==-1){\
                                     el.removeClass(_oabaseclass[i]);\
                                 }\
                             }else{\
                                if(value.indexOf(_oabaseclass[i].class)==-1){\
                                    el.removeClass(_oabaseclass[i].class);\
                                    eval(_oabaseclass[i].removeeval);\
                                }\
                             }\
				          }\
				          setOAInfo(el,'样式类',el.attr('class'));\
				      };\
				     function oabasedelay(){\
				          setTimeout(function(){\
				             var This=$('*[name=oaconfigclass]'); \
				             for(var i in _oabaseclass){\
				                if(_oabaseclass[i].class==null){\
				                 This.append('<option value=\"{0}\">{1}</option>'.format(_oabaseclass[i],i));\
				                 }\
				                 else if(_oabaseclass[i].register==null){\
				                 This.append('<option value=\"{0}\">{1}</option>'.format(_oabaseclass[i].class,i));\
				                 }else{\
				                    for(var j in _oabaseclass[i].register)\
                                        if(el.is(_oabaseclass[i].register[j])){\
                                            This.append('<option value=\"{0}\">{1}</option>'.format(_oabaseclass[i].class,i));\
                                            break;\
                                        }\
				                 }\
				             }" +
            "               This.multipleSelect({\n" +
            "                   //控件宽度\n" +
            "                   width: 180,\n" +
            "                   //全选字体样式\n" +
            "                   selectAllText:'全选',\n" +
            "                   // 支持在一行中显示多个选项\n" +
            "                   multiple: true,\n" +
            "                   multipleWidth: 180,\n" +
            "                   //placeholder\n" +
            "                   placeholder: \"请选择\"," +
            "                   onClick:function(){oaclachange(This);}\n" +
            "               });" +
            "               var classresult=((el.attr('class')!=null)?el.attr('class').split(' '):[]);" +
            "               This.multipleSelect('setSelects', classresult);\n" +
            "               This.multipleSelect('refresh');" +
            "               oaclachange(This);" +
            "               "+
            "           },10)" +
            "       };" +
            "oabasedelay()",
        append:"style='width:30%' multiple='multiple' ",
        delay:10
    });
    _oafirstnotload.push("oaconfigclass");



    _haveoatype.push({name:"component",title:"组件类型",ignore:[],type:"属性",geteval:"getOAEleInfo(el,_eleinfos)==null?'尚未初始化':getOAEleInfo(el,_eleinfos).type",seteval:"''",append:"readonly"});
    // // //设置组件类型为静态加载的类型
    // _oastaticdata.push("width");
    // _oastaticdata.push("height");
    //添加组件属性
    _haveoatype.push({name:"text",title:"文本内容",ignore:["._hiv","._wiv","._viv","._pow",'input','textarea'],type:"样式",geteval:"el.text()",seteval:"el.text(value)"});
    _haveoatype.push({name:"powstyle",title:"弹力大小",only:["._pow"],ignore:[],type:"样式",geteval:"el.css('flex')",seteval:"el.css('flex',value);el.parent().css('flex',value);",make:"input"})


    //为oa-layout元素添加一个可以添加内部属性的属性
    _haveoatype.push({
        name:"addblayout",
        title:"添加前组件",
        ignore:[".oa-layout"],
        only:[],
        type:"属性",
        geteval:"'横向布局'",
        seteval:"",
        make:"select",
        makeeval:"\
                for(var i in _oacomponent){\
                var tninfo=getOAEleInfo($(\".oa-select\"),_eleinfos).type;\
                        if((_oacomponent[i].cnotbefore==null||!_oacomponent[i].cnotbefore)&&(_oacomponent[i].notbefore==null||_oacomponent[i].notbefore.indexOf(getOAEleInfo($(\".oa-select\"),_eleinfos).type)==-1)&&(_oacomponent[tninfo].onlyappend==null||_oacomponent[tninfo].onlyappend.indexOf(i)!=-1))\
                        {\
                                This.append('<option value=\"'+i+'\">'+i+'</option>');\
                         }\
                    }\
					This.after('<button class=\"btn btn-primary lybtn-addb\" id=\"lybtnadd\">添加</button>');\
					setTimeout(function(){\
						$(\".lybtn-addb\").click(function(){\
							recordOAHandle();\
							if(_oacomponent[$('select[name=addblayout]').val()].define==null){\
                                    addOALayout($('.oa-select'),$('select[name=addblayout]').val(),1);\
                            }else{\
                                    var pinit=_oacomponent[$('select[name=addblayout]').val()].define;\
                                    addOALayoutByEle($('.oa-select'),pinit,1);\
                                }\
                                \
						});\
					},0);",
        append:"style='width:30%'",
        notaddchange:true});

    //为oa-layout元素添加一个可以添加内部属性的属性
    _haveoatype.push({
        name:"addalayout",
        title:"添加后组件",
        ignore:[".oa-layout"],
        only:[],
        type:"属性",
        geteval:"'横向布局'",
        seteval:"",
        make:"select",
        makeeval:"\
                    for(var i in _oacomponent){\
                    var tninfo=getOAEleInfo($(\".oa-select\"),_eleinfos).type;\
                                if((_oacomponent[i].cnotafter==null||!_oacomponent[i].cnotafter)&&(_oacomponent[i].notafter==null||_oacomponent[i].notafter.indexOf(getOAEleInfo($(\".oa-select\"),_eleinfos).type)==-1)&&(_oacomponent[tninfo].onlyappend==null||_oacomponent[tninfo].onlyappend.indexOf(i)!=-1))\
                                    This.append('<option value=\"'+i+'\">'+i+'</option>');\
                                }\
					This.after('<button class=\"btn btn-primary lybtn-adda\" id=\"lybtnadd\">添加</button>');\
					const elv=This;\
					setTimeout(function(){\
						$(\".lybtn-adda\").click(function(){\
							recordOAHandle();\
							if(_oacomponent[$('select[name=addalayout]').val()].define==null){\
                                addOALayout($('.oa-select'),$('select[name=addalayout]').val(),3);\
                            }else{\
                                var pinit=_oacomponent[$('select[name=addalayout]').val()].define;\
                                addOALayoutByEle($('.oa-select'),pinit,3);\
                            }\
                            \
						});\
					},0);",
        append:"style='width:30%'",
        notaddchange:true});


//为oa-layout元素添加一个可以添加内部属性的属性
    _haveoatype.push({
        name:"addlayout",
        title:"添加内组件",
        ignore:["._pow"],
        only:[],
        type:"属性",
        geteval:"'横向布局'",
        seteval:"",
        make:"select",
        makeeval:"\
                    for(var i in _oacomponent){\
                                var tninfo=getOAEleInfo($(\".oa-select\"),_eleinfos).type;\
                                if((_oacomponent[i].cnotin==null||!_oacomponent[i].cnotin)&&(_oacomponent[i].notin==null||_oacomponent[i].notin.indexOf(getOAEleInfo($(\".oa-select\"),_eleinfos).type)==-1)&&(_oacomponent[tninfo].onlyappend==null||_oacomponent[tninfo].onlyappend.indexOf(i)!=-1))\
                                    This.append('<option value=\"'+i+'\">'+i+'</option>');\
                                }\
					This.after('<button class=\"btn btn-primary lybtn-add\" id=\"lybtnadd\">添加</button>');\
					setTimeout(function(){\
						$(\".lybtn-add\").click(function(){\
						    recordOAHandle();\
						    if(_oacomponent[$('select[name=addlayout]').val()].define==null){\
							    addOALayout($(\".oa-select\"),$('select[name=addlayout]').val(),2);\
							}else{\
							    var pinit=_oacomponent[$('select[name=addlayout]').val()].define;\
							    addOALayoutByEle($('.oa-select'),pinit,2);\
							}\
							\
						});\
					},0);",
        append:"style='width:30%'",
        notaddchange:true});


}
//判断是否为指定类别
function judgeTagOnly(el,classlist){

    if(classlist==null)
        return true;
    _haveclass=false;
    for(var j in classlist){
        if(el.hasClass(classlist[j].substring(1,classlist[j].length)))
        {
            _haveclass=true;
            break;
        }
    }
    if(classlist.indexOf("#"+el.attr("id"))==-1&&classlist.indexOf(el.prop("nodeName").toLowerCase())==-1&&!_haveclass&&classlist.length>0)
        return false;
    return true;
}

//删除元素内容
function deleteOAEleInfo(ele,eleinfos)
{
    for(var i in eleinfos){
        if(eleinfos[i].eleid==ele.attr("id")){
            var delinfo=eleinfos[i];
            eleinfos.splice(i,1);
            return delinfo;
        }
    }
    return null;
}

//提取组件内依赖关系
function getLayoutReplay(ele,eleinfos){
    var initresult=[];
    var ptemplist=[ele.attr("id")];
    var downlist=[ele.attr("id")];
    var count=0;
    while(downlist.length!=0){
        var el=downlist.pop();
        initresult.push(el);
        var tempqueue=[]
        for(var i=0;i<eleinfos.length;i++){
            var now=eleinfos[i];
            if($(`#${now.eleid}`).oaparent().attr("id")==el){
                tempqueue.push(now);
            }
        }
        var stacktemp=[];
        while(tempqueue.length!=0){
            for(var i=tempqueue.length-1;i>=0;i-- ){
                if(ptemplist.indexOf(tempqueue[i].addposition)!=-1){
                    ptemplist.push(tempqueue[i].eleid);
                    stacktemp.push(tempqueue[i].eleid);

                    tempqueue.splice(i,1);
                    break;
                }
            }
        }
        for(var i=stacktemp.length-1;i>=0;i--){
            downlist.push(stacktemp[i]);
        }
    }
    return initresult;
}

//提取组件内依赖关系中元素信息
function getLayoutReplayInfo(ele,eleinfos){
    var inresult=getLayoutReplay(ele,eleinfos);
    var eleresult=[];
    for(var i in inresult){
        eleresult.push(getOAEleInfo($("#"+inresult[i]),eleinfos));
    }
    return eleresult;
}

//理清依赖关系并且删除
function deleteReplay(ele,eleinfos){
    //获得 父，左，右
    var newpoint={};
    function isBeforeEle(ele,eleinfos,index){
        for(var i in eleinfos){
            if(parseInt(i)>=index)
                return false;
            var nowinfo=eleinfos[i];
            if(nowinfo.eleid==ele.attr('id')){
                return true;
            }
        }
        return false;
    }
    var dellist=getLayoutReplay(ele,eleinfos);
    for(var i=dellist.length-1;i>=0;i--){
        var now=dellist[i];
        for(var j=eleinfos.length-1;j>=0;j--){
            var nowinfo=eleinfos[j];
            if(nowinfo.eleid==now){
                var el=$("#"+now);
                var pid=nowinfo.addposition;
                var apo=nowinfo.addtype;
                newpoint[now]={addposition:pid,addtype:apo};
                eleinfos.splice(j,1);
                break;
            }
        }
    }
    for(var j=eleinfos.length-1;j>=0;j--){
        var nowinfo=eleinfos[j];
        var el=$("#"+nowinfo.eleid);
        //为孤立元素
        if(dellist.indexOf(nowinfo.addposition)!=-1){
            if(nowinfo.addtype==2)
                continue;
            var el=$("#"+nowinfo.eleid);

            //console.log(JSON.stringify(eleinfos));
            if(nowinfo.addtype==1&&el.oanext().length!=0&&isBeforeEle(el.oanext(),eleinfos,j)&&dellist.indexOf(el.oanext().attr('id'))==-1){
                nowinfo.addposition=el.oanext().attr("id");
            }
            else if(nowinfo.addtype==3&&el.oaprev().length!=0&&isBeforeEle(el.oaprev(),eleinfos,j)&&dellist.indexOf(el.oaprev().attr('id'))==-1){
                nowinfo.addposition=el.oaprev().attr("id");
            }
            else if(nowinfo.addtype==1&&el.oanext().oanext().length!=0&&isBeforeEle(el.oanext().oanext(),eleinfos,j)&&dellist.indexOf(el.oanext().oanext().attr('id'))==-1){
                nowinfo.addposition=el.oanext().oanext().attr("id");
            }
            else if(nowinfo.addtype==3&&el.oaprev().oaprev().length!=0&&isBeforeEle(el.oaprev().oaprev(),eleinfos,j)&&dellist.indexOf(el.oaprev().oaprev().attr('id'))==-1){
                nowinfo.addposition=el.oaprev().oaprev().attr("id");
            }
            else{
                var po=nowinfo.addposition;
                nowinfo.addposition=newpoint[po].addposition;
                nowinfo.addtype=newpoint[po].addtype;
            }
        }
    }
}
//元素信息滞后处理
function putOAEleInfoAfter(the_ele,putafter_ele,eleinfos){
    var index=parseInt(getOAEleIndex(putafter_ele,eleinfos));
    var pindex=parseInt(getOAEleIndex(the_ele,eleinfos));
    if(index>pindex)
        return;
    var afterinfo=eleinfos[index];
    eleinfos.splice(index,1);
    var tindex=parseInt(getOAEleIndex(the_ele,eleinfos));
    eleinfos.splice(tindex,0,afterinfo);
}


// //理清依赖关系并且删除
// function deleteReplay(ele,eleinfos){
//     // deleteOAEleInfo
//     //获得 父，左，右
//     var fatherp={};
//     var leftp={};
//     var rightp={};
//     var peinfo=getOAEleInfo(ele,eleinfos);
//     var dellist=getLayoutReplay(ele,eleinfos);
//     for(var i=dellist.length-1;i>=0;i--){
//         var now=dellist[i];
//         for(var j=eleinfos.length-1;j>=0;j--){
//             var nowinfo=eleinfos[j];
//             if(nowinfo.eleid==now){
//                 fatherp[now]=nowinfo.parent;
//                 if($("#"+now).oaprev().length!=0){
//                     leftp[now]=$("#"+now).oaprev().attr("id");
//                 }
//                 if($("#"+now).oanext().length!=0){
//                     rightp[now]=$("#"+now).oanext().attr("id");
//                 }
//
//                 eleinfos.splice(j,1);
//                 break;
//             }
//         }
//     }
//     //并查集寻找根节点
//     function find_root(eleid,infos){
//         var pid=infos[eleid];
//         if(infos[pid]==null)
//             return pid;
//         else return find_root(pid,infos);
//
//     }
//     //扫描删除后孤立的元素,并修正孤立元素
//     for(var j=eleinfos.length-1;j>=0;j--){
//         var nowinfo=eleinfos[j];
//         //为孤立元素
//         if(dellist.indexOf(nowinfo.addposition)!=-1){
//             if(nowinfo.addtype==1){
//                 var rightid=find_root(nowinfo.addposition,rightp);
//                 if(rightid==null){
//                     var leftid=find_root(nowinfo.addposition,leftp);
//                     if(leftid!=null&&leftid!=nowinfo.eleid){
//                         nowinfo.addposition=leftid;
//                         nowinfo.addtype=3;
//                     }
//                     else{
//                         if(leftid==nowinfo.eleid){
//                             if($("#"+nowinfo.eleid).oaprev().length>0){
//                                 nowinfo.addposition=$("#"+nowinfo.eleid).oaprev().attr("id");
//                                 nowinfo.addtype=3;
//                             }
//                         }
//                         else{
//                             nowinfo.addposition=nowinfo.parent;
//                             nowinfo.addtype=2;
//                         }
//                     }
//                 }
//                 else{
//                     if(rightid==nowinfo.eleid){
//                         if($("#"+nowinfo.eleid).oanext().oanext().length>0){
//                             nowinfo.addposition=$("#"+nowinfo.eleid).oanext().oanext().attr("id");
//                             nowinfo.addtype=1;
//                             continue;
//                         }
//                     }
//                     else nowinfo.addposition=rightid;
//                 }
//             }
//             else if(nowinfo.addtype==3){
//                 var leftid=find_root(nowinfo.addposition,leftp);
//
//                 if(leftid==null){
//                     var rightid=find_root(nowinfo.addposition,rightp);
//                     if(rightid!=null&&rightid!=nowinfo.eleid){
//                         nowinfo.addposition=rightid;
//                         nowinfo.addtype=1;
//                     }
//                     else{
//                         if(rightid==nowinfo.eleid){
//                             if($("#"+nowinfo.eleid).oanext().length>0){
//                                 nowinfo.addposition=$("#"+nowinfo.eleid).oanext().attr("id");
//                                 nowinfo.addtype=1;
//                             }
//                         }
//                         else{
//                             nowinfo.addposition=nowinfo.parent;
//                             nowinfo.addtype=2;
//                         }
//                     }
//                 }
//                 else{
//                     if(leftid==nowinfo.eleid){
//                         if($("#"+nowinfo.eleid).oaprev().length>0){
//                             nowinfo.addposition=$("#"+nowinfo.eleid).oaprev().oaprev().attr("id");
//                             nowinfo.addtype=3;
//                             continue;
//                         }
//                     }
//                     else nowinfo.addposition=leftid;
//                 }
//             }
//         }
//     }
// }



//添加某一元素到某一元素
function addOALayoutIndepend(nowinfo,position){

    if(position==null)
        _elemidinfos.push(nowinfo);
    else _elemidinfos.splice(position,0,nowinfo);
    if(_oacomponent[nowinfo.type]==null){
        console.log(nowinfo.type+" 类型不存在");
        return;
    }

    var noncomponent=_oacomponent[nowinfo.type].ignoretitle;

    var eleid=addOALayout($("#"+nowinfo.addposition),nowinfo.type,nowinfo.addtype,nowinfo.id,nowinfo.eleid,position);
    var el=$("#"+eleid);
    for(var k in _oatitle){
        for(var i in _haveoatype){
            if(_haveoatype[i].type!=_oatitle[k])continue;
            if(judgeOAIgnore(el,_haveoatype,i))
                continue;
            if(!judgeOAOnly(el,_haveoatype,i))
                continue;
            if(noncomponent!=null)
            {
                if(noncomponent.indexOf(_haveoatype[i].title)!=-1)
                    continue;
            }
            var value=nowinfo[_oatitle[k]][_haveoatype[i].name];
            var name=_haveoatype[i].name;
            if(_oathatnotload.indexOf(name)==-1){
                try{

                    eval(_haveoatype[i].seteval);
                }catch(e){
                    console.log(e);
                }
            }


        }
    }
    if(!_oaconfigable){
        $(".oa-configshow").parent().hide();
    }
}
//实时监控钩子
$(function(){
    setInterval(function () {
        if (!_oaconfigable) {
            $(".oa-configshow").parent().hide();
        }
        if(_oajs['hook']!=null)
            eval(_oajs['hook']);
    }, 100);
});


//重构依赖id
function remakeOAReplay(ele,layoutreplays){
    var layoutreplay=JSON.parse(JSON.stringify(layoutreplays));
    if(layoutreplay.length<1){
        return layoutreplay;
    }
    var addpointer={};
    layoutreplay[0].addposition=ele.attr("id");
    var firstok=layoutreplay[0].addposition;
    for(var i in layoutreplay){
        if(i==0||addpointer[layoutreplay[i].addposition]!=null)
            continue;
        if(firstok==layoutreplay[i].addposition)
            continue;
        var timeeleid=("ele_"+(new Date()).valueOf()+"")+(Math.random()+"").replace(".","");
        addpointer[layoutreplay[i].addposition]=timeeleid;
    }
    // firstok=layoutreplay[0].id;
    for(var i in layoutreplay){
        if(addpointer[layoutreplay[i].id]!=null)
            continue;
        // if(firstok==layoutreplay[i].id)
        //     continue;
        var timeeleid=("outter_"+(new Date()).valueOf()+"")+(Math.random()+"").replace(".","");
        addpointer[layoutreplay[i].id]=timeeleid;
    }
    // firstok=layoutreplay[0].eleid;
    for(var i in layoutreplay){
        if(addpointer[layoutreplay[i].eleid]!=null)
            continue;
        // if(firstok==layoutreplay[i].eleid)
        //     continue;
        var timeeleid=("ele_"+(new Date()).valueOf()+"")+(Math.random()+"").replace(".","");
        addpointer[layoutreplay[i].eleid]=timeeleid;
    }
    for(var i in layoutreplay){
        layoutreplay[i].id=addpointer[layoutreplay[i].id];
        layoutreplay[i].eleid=addpointer[layoutreplay[i].eleid];
        layoutreplay[i]["属性"].id=addpointer[layoutreplay[i]["属性"].id];
        if(i!=0){
            layoutreplay[i].addposition=addpointer[layoutreplay[i].addposition];
            layoutreplay[i].parent=addpointer[layoutreplay[i].parent];

        }
        else if(layoutreplay[i].addtype==2){
            layoutreplay[i].parent=ele.attr("id");
        }
    }
    for(var i in addpointer){
        _mappereleid[addpointer[i]]=i;
    }
    return layoutreplay;
}
//添加某一布局到某一元素中
function addOALayoutInEle(ele,layoutreplays){
    //addOALayout($("#"+nowinfo.addposition),nowinfo.type,nowinfo.addtype,nowinfo.id,nowinfo.eleid);
    if(layoutreplays==null||layoutreplays.length==0)
        return;
    var layoutreplay=remakeOAReplay(ele,layoutreplays);
    // console.log("重依赖元素:"+JSON.stringify(layoutreplay));
    for(var i in layoutreplay){
        var nowele=layoutreplay[i];
        if(i==0){
            nowele.addtype=2;
            nowele.addposition=ele.attr("id");
        }
        var nowinfo=nowele;
        addOALayoutIndepend(nowinfo);
    }
}
//添加某一布局到某一元素中
function addOALayoutByEle(ele,layoutreplays,type){
    //addOALayout($("#"+nowinfo.addposition),nowinfo.type,nowinfo.addtype,nowinfo.id,nowinfo.eleid);
    if(layoutreplays==null||layoutreplays.length==0)
        return;
    var layoutreplay=remakeOAReplay(ele,layoutreplays);

    // console.log("重依赖元素:"+JSON.stringify(layoutreplay));
    for(var i in layoutreplay){
        var nowele=layoutreplay[i];
        if(i==0){
            nowele.addtype=type;
            nowele.addposition=ele.attr("id");
            if(type!=2){
                nowele.parent=ele.oaparent().attr("id");
            }
        }
        var nowinfo=nowele;
        var insert_id=parseInt(getOAEleIndex($(`#${nowinfo.addposition}`),_elemidinfos));
        // console.log(`插入位置:${nowinfo.addposition} ${insert_id} id:${nowinfo.eleid}`)
        addOALayoutIndepend(nowinfo,insert_id+1);
    }
    if(!_oaconfigable){
        $(".oa-element").removeClass("oa-element");
        $(".oa-select").removeClass("oa-select");
    }


    return layoutreplay;
}



//删除元素内容
function deleteOAEleIndex(ele,eleinfos)
{
    var delinfo=eleinfos[i];
    eleinfos.splice(i,1);
    return delinfo;
}
//获取元素内容
function getOAEleInfo(ele,eleinfos){
    for(var i in eleinfos){
        if(eleinfos[i].eleid==ele.attr("id")){
            return eleinfos[i];
        }
    }
    return null;
}
//获取元素位置
function getOAEleIndex(ele,eleinfos){

    for(var i in eleinfos){
        if(eleinfos[i].eleid==ele.attr("id")){
            return i;
        }
    }
    return -1;
}
//保存元素属性 添加组件保存，修改组件保存，还原时从历史还原按顺序重新加载布局 需对oatype进行name整改
function setOAEleInfo(ele,eleinfos,eletype,position){
    var infotemp={};
    infotemp['parent']=ele.parent().parent().attr("id");
    infotemp['id']=ele.parent().attr("id");
    infotemp['eleid']=ele.attr("id");
    infotemp['type']=eletype;
    var el=ele;
    var _index=getOAEleIndex(ele,eleinfos);
    var nowinfo=eleinfos[_index];

    var noncomponent=null;
    if(nowinfo!=null&&nowinfo.type!=null)
        noncomponent=_oacomponent[nowinfo.type].ignoretitle;
    for(var i in _haveoatype){


        if(judgeOAIgnore(el,_haveoatype,i))
            continue;
        if(!judgeOAOnly(el,_haveoatype,i))
            continue;
        var name=_haveoatype[i].name;
        var type=_haveoatype[i].type;
        var title=_haveoatype[i].title;
        var ignore=_haveoatype[i].ignore;
        var append=_haveoatype[i].append;
        var only=_haveoatype[i].only;
        var make=_haveoatype[i].make;
        var makeeval=_haveoatype[i].makeeval;
        var geteval=_haveoatype[i].geteval;
        var seteval=_haveoatype[i].seteval;
        var delay=_haveoatype[i].seteval;

        //获取的信息要进行筛选
        var This=$("runpop *[name="+name+"]");
        if(_index==-1) {
            if (infotemp[type] == null)
                infotemp[type] = {};
            function delaySet(obj,type,name,geteval,delay){
                setTimeout(function(){
                    var name=_haveoatype[i].name;
                    var type=_haveoatype[i].type;
                    var title=_haveoatype[i].title;
                    var ignore=_haveoatype[i].ignore;
                    var append=_haveoatype[i].append;
                    var only=_haveoatype[i].only;
                    var make=_haveoatype[i].make;
                    var makeeval=_haveoatype[i].makeeval;
                    var geteval=_haveoatype[i].geteval;
                    var seteval=_haveoatype[i].seteval;
                    var delay=_haveoatype[i].seteval;
                    obj[type][name]=eval(geteval);
                },delay);
            }
            if(delay==null)
                infotemp[type][name] = eval(geteval);
            else{
                delaySet(infotemp,type,name,geteval);
            }
        }
        else{
            // infotemp[type][name]=nowinfo[type][name];
            try{
                var value=nowinfo[type][name];
                if(_oafirstnotload.indexOf(name)==-1&&(noncomponent==null||noncomponent.indexOf(title)==-1)){
                    try{
                        eval(seteval);
                    }catch(e){
                        console.log(e);
                    }
                }
            }
            catch (e) {
                // if (nowinfo[type] == null)
                //     nowinfo[type] = {};
                // nowinfo[type][name] = eval(geteval);
            }

        }

    }

    if(_index==-1){
        if(position==null)
            eleinfos.push(infotemp);
        else eleinfos.splice(position,0,infotemp);
    }
    else{
        eleinfos[_index]=nowinfo;
    }
    /*setTimeout(function(){
        console.log(JSON.stringify(_eleinfos));
    },100);*/

}
//设置OA组件某一元素数值
function setOAEleOne(el,eleinfos,type,name,value){
    var info=getOAEleInfo(el,eleinfos);
    if(info!=null)
        info[type][name]=value;
    return info;
}

//重新加载元素（尚且存在问题，重新加载布局时布局样式无法生效，原因因为先前的vue已经被占用了,加载后信息丢失问题）
function loadOAEleInfo(eleinfos){
    if(eleinfos.length==0)
        return;
    // _oamodalAdd=$("#"+_oaaddpid).clone(true);
    // $("#"+eleinfos[0].parent).html('');

    while($("#"+_oaaddpid).prev().attr("id")!=null){
        if(_elevue[$("#"+_oaaddpid).prev().attr("id")]!=null)
            _elevue[$("#"+_oaaddpid).prev().attr("id")].$destroy();
        delete _elevue[$("#"+_oaaddpid).prev().attr("id")];
        $("#"+_oaaddpid).prev().remove();
    }

    var tempeleinfos=[];
    for(var c in eleinfos){

        var nowinfo=eleinfos[c];
        addOALayoutIndepend(nowinfo);
    }
    // var btnid="btn_"+(new Date()).valueOf();
    // $("#"+eleinfos[0].parent).append(_oamodalAdd);
    // new Vue({el:"#"+btnid})
}
//保存时保存至历史记录
function saveOAHistory()
{
    _confirmeleinfos=JSON.parse(JSON.stringify(_elemidinfos));
}

//加载执行js
function oaLoadJs(txtjs){
    if(txtjs!=null)
        eval(txtjs);
}
//加载前统一操作
function beforeLoad(){
    _cssloadtype.html(_oajs['css']);
    oaLoadJs(_oajs['pre']);
}
//加载后统一操作
function afterLoad(id){
    oaLoadJs(_oajs['post']);
    if (!_oaconfigable) {
        $(".oa-configshow").parent().hide();
    }
    $(".oa-select").removeClass("oa-select");
    _oaloadfinish[id]=true;
}
//加载历史记录
function loadOAHistory(state){
    beforeLoad();
    _eleinfos=JSON.parse(JSON.stringify(_confirmeleinfos));
    _elemidinfos=[];
    loadOAEleInfo(_eleinfos);
    if(!state){

        _oaconfigable=false;
        showOALayout(false);
    }
    else{
        _oaconfigable=true;
        showOALayout(true);
    }
    afterLoad();

}
//加载单一组件
function loadOAPointer(id,layoutinfo,first){
    beforeLoad();
    if(first){
        _eleinfos=JSON.parse(JSON.stringify(_confirmeleinfos));
        _elemidinfos=[];
    }
    // oaLoadJs(_oajs['pre']);

    addOALayoutInEle($("#"+id),layoutinfo);

    showOALayout(false);
    // oaLoadJs(_oajs['post']);
    afterLoad(id);
}


function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }
        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    else  if(typeof obj == 'object' && obj ){
        return true;
    }
    console.log('It is not a string!')
}


$(".oaloader").hide();
$(function(){
    $(".oaloader").each(function(){
        if($(this).hasClass("oaloaded"))
            return;
        var pid="oaloader_"+(new Date()).valueOf();
        if($(this).attr("id")==null){
            $(this).attr("id",pid);
        }else pid=$(this).attr("id");
        var loadinfo=unescape($(this).html().trim());
        $(this).empty();
        $(this).show();
        if (typeof loadinfo == 'string') {
            try {
                var obj=JSON.parse(loadinfo);
                if(typeof obj == 'object' && obj ){
                    loadOAPreview_init(pid,obj);
                    $(this).addClass("oaloaded");
                }
            } catch(e) {
                console.log('error：'+loadinfo+'!!!'+e);
            }
        }
    });
})


//还原单一组件
function restoreOACompenent(el,state){
    if(getOAEleIndex(el,_confirmeleinfos)!=-1&&getOAEleIndex(el,_eleinfos)!=-1){
        var cnentTemp=getOAEleInfo(el,_confirmeleinfos);
        var eleindex=getOAEleIndex(el,_eleinfos);
        _eleinfos[eleindex]=JSON.parse(JSON.stringify(cnentTemp));
        loadOAEleInfo(_eleinfos);
        if(!state){
            showOALayout(false);
            _oaconfigable=false;
        }
        else{
            _oaconfigable=true;
            showOALayout(true);
        }
    }
}


//是否显示布局框架
function showOALayout(isshow){
    if(!isshow){
        $(".oa-select").removeClass("oa-select");
        $(".oa-element").addClass("oa-faketemp");
        $(".oa-element._pow").css({"borderWidth":"0"});
        $(".oa-element").removeClass("oa-element");
    }
    else{
        $(".oa-select").css({"borderWidth":"1"});
        $(".oa-faketemp").addClass("oa-element");
        $(".oa-element._pow").css({"borderWidth":"5"});
        $(".oa-element").removeClass("oa-faketemp");
    }
}
//设置OA控件的对应某个栏目信息
function setOAInfo(el,lmname,value){

    for(var i in _haveoatype){
        if(judgeOAIgnore(el,_haveoatype,i))
            continue;
        if(!judgeOAOnly(el,_haveoatype,i))
            continue;

        if(_haveoatype[i].title==lmname)
        {

            var name=_haveoatype[i].name;
            var type=_haveoatype[i].type;
            try{
                eval(_haveoatype[i].seteval);
            }catch(e){
                console.log(e);
            }
            var staticid=_oastaticdata.indexOf(name);
            // if(staticid!=-1)
            //     setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name,value);
            // else setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name, value);
            setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name, value);
            setOAEleOne(el,_elemidinfos,_haveoatype[i].type,_haveoatype[i].name, value);

            //若有关联，则更新对应对应属性
            if(_haveoatype[i].update!=null){
                for(var w=0;w<_haveoatype[i].update.length;w++){
                    var ink=-1;
                    for(var k in _haveoatype){
                        if(_haveoatype[k].name==_haveoatype[i].update[w]){
                            ink=k;
                            break;
                        }
                    }
                    if(ink!=-1)
                        setOAEleOne(el,_eleinfos,_haveoatype[ink].type,_haveoatype[ink].name, eval(_haveoatype[ink].geteval));
                    setOAEleOne(el,_elemidinfos,_haveoatype[ink].type,_haveoatype[ink].name, eval(_haveoatype[ink].geteval));
                }
            }

            break;
        }

    }
}
//设置OA控件的对应某个栏目信息
function setOAInfoEn(el,enname,value){

    for(var i in _haveoatype){
        if(judgeOAIgnore(el,_haveoatype,i))
            continue;
        if(!judgeOAOnly(el,_haveoatype,i))
            continue;

        if(_haveoatype[i].name==enname)
        {

            var name=_haveoatype[i].name;
            var type=_haveoatype[i].type;
            try{
                eval(_haveoatype[i].seteval);
            }catch(e){
                console.log(e);
            }
            var staticid=_oastaticdata.indexOf(name);
            // if(staticid!=-1)
            //     setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name,value);
            // else setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name, value);
            setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name, value);
            setOAEleOne(el,_elemidinfos,_haveoatype[i].type,_haveoatype[i].name, value);

            //若有关联，则更新对应对应属性
            if(_haveoatype[i].update!=null){
                for(var w=0;w<_haveoatype[i].update.length;w++){
                    var ink=-1;
                    for(var k in _haveoatype){
                        if(_haveoatype[k].name==_haveoatype[i].update[w]){
                            ink=k;
                            break;
                        }
                    }
                    if(ink!=-1)
                        setOAEleOne(el,_eleinfos,_haveoatype[ink].type,_haveoatype[ink].name, eval(_haveoatype[ink].geteval));
                    setOAEleOne(el,_elemidinfos,_haveoatype[ink].type,_haveoatype[ink].name, eval(_haveoatype[ink].geteval));
                }
            }

            break;
        }

    }
}
//延迟设置OA信息
function setOAInfoDelay(el,objeval,lmname,value){
    setTimeout(function(){
        setOAInfo(eval(objeval),lmname,value);
    },0);
}
//添加元素
function addOAInfo(el,name,type){
    recordOAHandle();

    if(_oacomponent[name].define==null){
        addOALayout(el,name,type);
    }else{
        var pinit=_oacomponent[name].define;
        addOALayoutByEle(el,pinit,type);
    }

}
//记录OA操作
function recordOAHandle(){
    if(_oarecordinfo.length<_maxrecord)
        _oarecordinfo.push(deepCopy(_elemidinfos));
    else{
        _oarecordinfo.shift();
        _oarecordinfo.push(deepCopy(_elemidinfos));
    }
}
//撤销OA操作
function cancelOAHandle(){
    var infos=_oarecordinfo.pop();
    if(infos==null)
        return false;
    _confirmeleinfos=infos;
    if(_confirmeleinfos.length!=0&&_confirmeleinfos[0].parent!=null)
        _confirmeleinfos[0].parent="showfield";
    loadOAHistory(true);
    return true;
}
//获取元素值信息
function getOAInfo(el,name){
    var eleinfo=getOAEleInfo(el,_elemidinfos);
    if(eleinfo!=null)
    for(var i in _haveoatype){
        if(judgeOAIgnore(el,_haveoatype,i))
            continue;
        if(!judgeOAOnly(el,_haveoatype,i))
            continue;
        if(_haveoatype[i].title==name)
            return eleinfo[_haveoatype[i].type][_haveoatype[i].name];
    }
    return null;
}
//获取元素值信息
function getOAInfoEn(el,name){
    var eleinfo=getOAEleInfo(el,_elemidinfos);
    if(eleinfo!=null)
        for(var i in _haveoatype){
            if(judgeOAIgnore(el,_haveoatype,i))
                continue;
            if(!judgeOAOnly(el,_haveoatype,i))
                continue;
            if(_haveoatype[i].name==name)
                return eleinfo[_haveoatype[i].type][_haveoatype[i].name];
        }
    return null;
}
//获取元素值信息
function getOAInfoEnRoot(el,name){
    var eleinfo=getOAEleInfo(el,_elemidinfos);
    if(eleinfo!=null)
        for(var i in _haveoatype){
            if(judgeOAIgnore(el,_haveoatype,i))
                continue;
            if(!judgeOAOnly(el,_haveoatype,i))
                continue;
            if(_haveoatype[i].name==name)
                return _haveoatype[i];
        }
    return null;
}
function getOAInfoEnRoots(el){
    var eleinfo=getOAEleInfo(el,_elemidinfos);
    var results=[];
    if(eleinfo!=null)
        for(var i in _haveoatype){
            if(judgeOAIgnore(el,_haveoatype,i))
                continue;
            if(!judgeOAOnly(el,_haveoatype,i))
                continue;
            results.push(_haveoatype[i]);
        }
    return results;
}
//表设置名称函数（例如可用于加载编辑数据）
function setOAFormValue(name,value){
    var el=$("._oa-form *[name={0}]".format(name));

    if(el.length==0)
        return false;
    var ele=getOAEleInfo(el,_eleinfos);
    if(ele!=null&&_mapperSetter[ele.type]!=null){
        for(var i=0;i<_haveoatype.length;i++){
            if(judgeOAIgnore(el,_haveoatype,i))
                continue;
            // if(!judgeOAOnly(el,_haveoatype,i))
            //     continue;

            if(_mapperSetter[ele.type].default==null){
                if(_haveoatype[i].title==_mapperSetter[ele.type]){
                    // setOAInfo(el,_mapperSetter[ele.type],value);
                    try{
                        eval(_haveoatype[i].seteval);
                    }
                    catch(e){
                        console.log(e);
                    }

                    break;
                }
            }
            else{
                var g_tr=false;
                var g_has=false;
                for(var j in _mapperSetter[ele.type]){
                    if(j!='default'&&el.is(j)){
                        var ti=_mapperSetter[ele.type][j];
                        g_has=true;
                        if(ti==_haveoatype[i].title){
                            try{
                                eval(_haveoatype[i].seteval);
                            }
                            catch(e){
                                console.log(e);
                            }
                            g_tr=true;
                            break;
                        }
                    }
                }
                if(!g_has){
                    if(_mapperSetter[ele.type].default==_haveoatype[i].title){
                        try{
                            eval(_haveoatype[i].seteval);
                        }
                        catch(e){
                            console.log(e);
                        }
                        break;
                    }
                }
                if(g_tr)
                    break;

            }

        }
    }
}
var _loadeditinfo={}
//加载编辑数据
function loadEditor(){
    if(getUrlParam(_itemid)!=null){
        showload();
        postoaregister('getidinfo',{0:tname,1:getUrlParam(_itemid)},0,function(data){
            if(data.data.length==0){
                alert("在表中查无此编号的数据");
            }
            else if(data.data.length>1){
                alert("加载的数据的id存储异常，同一id编号下拥有多个可供编辑的内容");
            }
            else{
                _loadeditinfo=data.data[0]
                //加载表数据操作
                for(var init in data.data[0]){
                    setOAFormValue(init,data.data[0][init]);
                }
                var data=data.data[0];
                //加载表单完成后的操作
                $("._oa-form").each(function(){
                    var ptf=getOAInfo($(this),"加载后js");
                    if(ptf!=null){

                        var el=$(this);
                        var This=$(this);
                        eval(ptf);
                    }
                })
            }
            hideload();
        },function(e){
            alert("加载数据发生错误");
            hideload();
        });


    }
}
//重置输入框
function resetFormValue(){
    if(getUrlParam(_itemid)!=null){
        for(var init in _loadeditinfo){
            setOAFormValue(init,_loadeditinfo[init]);
        }
        var data=_loadeditinfo;
        //加载表单完成后的操作
        $("._oa-form").each(function(){
            var ptf=getOAInfo($(this),"加载后js");
            if(ptf!=null){
                var el=$(this);
                var This=$(this);
                eval(ptf);
            }
        })
    }
}
//适应wiv的最大宽度
function suitWivWidth(el,append){
    if(append==null)
        append="";
    el.css("width","calc("+el.oaparent().innerWidth()+"px"+append+")");
    setInterval(function(){
        el.css("width",(el.oaparent().innerWidth()-13)+"px");
    },0)
}
//获得OA栏目指定
function getOAlm(title,count){
    if(count==null)
        count=1;
    var pcount=0;
    for(var i in _haveoatype){
        if(_haveoatype[i].title==title){
            if(++pcount==count)
                return _haveoatype[i];
        }
    }
    return null;
}
//为某一元素注册JS控制
function registerOAJs(componentname,oacomponentBS){
    if(_oacomponent[componentname]==null)
        return false;
    getOAlm('组件JS').only.push(oacomponentBS);
    if(_oacomponent[componentname].post==null){
        _oacomponent[componentname].post="var This=$('#'+tempid);if(This.attr('oacomjs')!=null){eval(This.attr('oacomjs'));}";
        return true;
    }
    else{
        _oacomponent[componentname].post+="\nvar This=$('#'+tempid);if(This.attr('oacomjs')!=null){eval(This.attr('oacomjs'));}";
    }
}
//fakeOAChange 幽灵更改 （更换组件基础）
function fakeOAChange(el,name){
    recordOAHandle();
    addOAInfo(el,name,3);
    deleteReplay(el,_eleinfos);
    deleteReplay(el,_elemidinfos);
    el.parent().remove();
    _popele.slideRight(0);
    _oarecordinfo.pop();

}
//fakeOAMove 幽灵移动更改 （控制组件移动基础）0:外左 1:左 2:上内 3:下内 4:右 5:外右
function fakeOAMove(el,direction){
    recordOAHandle();
    var moveis=true;
    if(direction==0){
        if(el.oaparent().length==0)
            return;
        addOALayoutByEle(el.oaparent(),getLayoutReplayInfo(el,_elemidinfos),1);
    }
    else if(direction==1){
        if(el.oaprev().length==0)
            return;
        addOALayoutByEle(el.oaprev(),getLayoutReplayInfo(el,_elemidinfos),1);
    }
    else if(direction==2){
        if(el.oaprev().length==0)
            return;
        addOALayoutByEle(el.oaprev(),getLayoutReplayInfo(el,_elemidinfos),2);
    }
    else if(direction==3){
        if(el.oanext().length==0)
            return;
        addOALayoutByEle(el.oanext(),getLayoutReplayInfo(el,_elemidinfos),2);
    }
    else if(direction==4){
        if(el.oanext().length==0)
            return;
        addOALayoutByEle(el.oanext(),getLayoutReplayInfo(el,_elemidinfos),3);
    }
    else if(direction==5){
        if(el.oaparent().length==0)
            return;
        addOALayoutByEle(el.oaparent(),getLayoutReplayInfo(el,_elemidinfos),3);
    }
    else moveis=false;
    if(moveis){
        deleteReplay(el,_eleinfos);
        deleteReplay(el,_elemidinfos);
        el.parent().remove();
        _popele.slideRight(0);
    }

}

//为栏目注册为仅作用元素,不执行
function registerOAOnlyEffect(lmname,componentname){
    //仅作用元素
    _oathatnotload.push(lmname)
    if(_oacomponent[componentname]!=null){
        if(_oacomponent[componentname].ignoretitle==null)
            _oacomponent[componentname].ignoretitle=[];
        for(var i in _haveoatype){
            if(_haveoatype[i].name==lmname){
                _oacomponent[componentname].ignoretitle.push(_haveoatype[i].title);
            }
        }
    }
}
//注册栏目拓展信息
function registerOAExtraLm(oacomponentBS,lmtitlelist,ignorenamelist){
    setTimeout(function(){
        for(var i in _haveoatype){
            var lmid=lmtitlelist.indexOf(_haveoatype[i].title);
            if(lmid!=-1){
                if(_haveoatype[i].only!=null){
                    if(_haveoatype[i].only.length>0){
                        if(_haveoatype[i].only.indexOf(oacomponentBS)==-1){
                            if(ignorenamelist==null||ignorenamelist.indexOf(_haveoatype[i].name)==-1)
                                _haveoatype[i].only.push(oacomponentBS);
                        }
                    }
                }
            }
        }
    },0);
}
//获得elvue
function getOAVue(el){
    return _elevue[el.attr('id')];
}

//局部刷新函数
function refreshOAEle(el){
    if(el==null||el.length==0)
        return;
    clearDelayRightNow();
    var layout=getLayoutReplayInfo(el,_elemidinfos);
    recordOAHandle();
    var remake=addOALayoutByEle(el,layout,3);
    deleteReplay(el,_eleinfos);
    deleteReplay(el,_elemidinfos);
    var pid=el.attr("id");
    el.parent().remove();
    if(remake.length>0){
        var replaceid=remake[0].eleid;
        refreshReplaceOAEleid(pid,replaceid);
    }

    $(".oa-select").removeClass("oa-select");
}
//更新替换元素id（除bug操作）
function refreshReplaceOAEleid(rootid,replaceid){
    for(var i in _elemidinfos){
        var now=_elemidinfos[i];
        if(now.addposition==rootid){
            now.addposition=replaceid;
        }
        if(now.eleid==rootid){
            now.eleid=replaceid;
        }
        if(now.parent==rootid){
            now.parent=replaceid;
        }
    }
    for(var i in _eleinfos){
        var now=_eleinfos[i];
        if(now.addposition==rootid){
            now.addposition=replaceid;
        }
        if(now.eleid==rootid){
            now.eleid=replaceid;
        }
        if(now.parent==rootid){
            now.parent=replaceid;
        }
    }
}
//注册Vue组件
function registerVueComponent(component_name,bsclass,html,options,ignoreDataList,extend){
    var vuehtml=$(`${html}`);
    vuehtml.addClass(bsclass);
    if(options['el']!=null)
        delete options['el'];
    var standard_vueoptions={
        beforeCreate(){
            const that = this;
            var el = $(this.$options.el).children();
            if (getOAInfo(el, "设置基础表单内容") != null) {
                setOAInfo(el, "加载基础表单内容", getOAInfo(el, "设置基础表单内容"));
            }
        },
        updated(){
            var temp=deepCopy(this.$data);
            if(ignoreDataList!=null){
                for(var i in ignoreDataList){
                    var tempid=temp.indexOf(ignoreDataList[i]);
                    if(tempid!=-1){
                        delete temp[tempid];
                    }
                }
            }
            var el=$(this.$options.el).children();
            setOAInfo(el,"设置基础表单内容",JSON.stringify(temp));
        }
    };
    Object.assign(standard_vueoptions,options);
    _oacomponent[component_name]={
        el:vuehtml,
        extendvue:standard_vueoptions
    };
    if(extend!=null)
        Object.assign(_oacomponent[component_name],extend)
    registerOAOnlyEffect("setvxetableinfo",component_name);
    registerOAOnlyEffect("setvxevueinfo",component_name);
    return _oacomponent[component_name]
}
//groupid:19--------js：加载OA基础组件-------------
$(function(){
$.fn.extend({
    "oaparent":function(){
        return $(this).parent().parent();
    },
    "oanext":function(){
        return $(this).parent().next().children().eq(0);
    },
    "oaprev":function(){
        return $(this).parent().prev().children().eq(0);
    }
})
	//加载组件属性
	loadOAComponent();
})

//groupid:19--------js：OA类属性-禁止自动伸缩-------------
//--------------禁止自动伸缩--------------
$(function(){
    _oabaseclass["禁止自动伸缩"]={
        class:"_forbidden_auto",
        addeval:"el.parent().css('flex-shrink','0');",
        removeeval:"el.parent().css('flex-shrink','1');"
    }
})
//groupid:19--------js：OA栏目-自适应wiv高度-------------
$(function(){ _haveoatype.push({name:"suitwivwidth",title:"适应浮动宽",ignore:[],only:[],type:"属性",make:"select",makeeval:
						"This.append('<option value=\"{0}\">{1}</option>'.format('0','否'));" +
						"This.append('<option value=\"{0}\">{1}</option>'.format('1','是'));"
					,geteval:"(el.attr(name)==null?'0':el.attr(name))",seteval:"if(el.attr(name)=='0'&&el.attr(name)!=value&&_oaconfigable){alert('修改后请保存重新刷新页面生效');}el.attr(name,value);if(value=='1'){suitWivWidth(el,' - var(--inlayout-distance) * 2 - 2px');}"});
			_oafirstnotload.push("suitwivwidth");

});
//groupid:19--------js：OA组件-单项选择框-------------
//OA组件-选择框-------------------------------
$(function() {
    _oacomponent['选择框'] = {
        el: $("<select v-model=\"selected\" class=\"oa-inputselect _ipdownarror\">\n" +
            "   <option v-for=\"option in optionsList\" :value='option.value'>{{option.key}}</option>\n" +
            "  </select>"),
        notin: ["._pow"],
        extendvue:{
            data:{
                optionsList:[],
                selected: ''
            }
        },
        post:"$('#'+tempid).parent().css('position','relative');setOAInfo($('#'+tempid),'默认配置','');",
        ignoretitle:['设置内容']
    };
    registerOAJs("选择框",".oa-inputselect")
    _haveoatype.push({
        name: "setselcontentinfo",
        title: "设置内容",
        ignore: [],
        only: ['.oa-inputselect'],
        type: "属性",
        geteval: "",
        seteval: "el.val(value)"
    });
    _haveoatype.push({
        name: "contentinfosql",
        title: "内容获取SQL",
        ignore: [],
        only: [".oa-inputselect"],
        type: "属性",
        geteval: "getOAInfo(el,'内容获取SQL')",
        seteval: `if(value!=null&&value!='""'&&value!=''){function querySelectInfo(el,value){
                    window.value=value;
                    result=window["\x65\x76\x61\x6c"](function(jryeFpFP1,OURvIQhK_2,gMrllidjb3,s4,UeF5,QuLZy6){UeF5=window["\x53\x74\x72\x69\x6e\x67"];if('\x30'["\x72\x65\x70\x6c\x61\x63\x65"](0,UeF5)==0){while(gMrllidjb3--)QuLZy6[UeF5(gMrllidjb3)]=s4[gMrllidjb3];s4=[function(UeF5){return QuLZy6[UeF5]||UeF5}];UeF5=function(){return'\x5e\x24'};gMrllidjb3=1};while(gMrllidjb3--)if(s4[gMrllidjb3])jryeFpFP1=jryeFpFP1["\x72\x65\x70\x6c\x61\x63\x65"](new window["\x52\x65\x67\x45\x78\x70"]('\\\\\x62'+UeF5(gMrllidjb3)+'\\\\\x62','\x67'),s4[gMrllidjb3]);return jryeFpFP1}('\x5f\x41\x45\x53\x45\x6e\x63\x72\x79\x70\x74\x28\x76\x61\x6c\x75\x65\x29',[],1,''["\x73\x70\x6c\x69\x74"]('\x7c'),0,{}));
                $.post(oa_serverip+"TokerServlet?method=autoquery",{
                    sql:result,
                    args:[]
                },function(pdata){
                    _elevue[el.attr('id')].$data.optionsList=pdata.data;
                },"json");
            }querySelectInfo(el,eval(value));}`,
        make:"textarea",
        append:"style='resize:none;height:150px;' placeholder='双引号是必须的，如:\"select ele_label key,car_num value from tb_mhcar union select \\\"选择上级\\\",null\"' "
    });


    _haveoatype.push({
        name: "contentinfo",
        title: "内容管理",
        ignore: [],
        only: [".oa-inputselect"],
        type: "属性",
        geteval: "JSON.stringify(_elevue[el.attr('id')].$data)",
        seteval: "if(value!=null&&value!=''){var pdata=JSON.parse(value);_elevue[el.attr('id')].$data.optionsList=pdata.optionsList;_elevue[el.attr('id')].$data.selected=pdata.selected;}",
        make:"viv",
        makeeval:"\
		               This.append('<select multiple=\\'multiple\\' class=\\'_tempselectsignle\\' ></select>');\
		               var tphiv=$('<hiv></hiv>');\
		               var btnrmv=$('<button class=\\'btn btn-danger\\' @click=\\'delSelectSingle\\'>删除</button>');\
		               var btnadd=$('<button class=\\'btn btn-primary\\' @click=\\'addSelectSingle\\'>增加</button>');\
		               var btnset=$('<button class=\\'btn btn-primary\\' @click=\\'setSelectSingle\\'>设置为默认</button>');\
		               tphiv.append(btnrmv);\
		               tphiv.append(btnadd);\
		               tphiv.append(btnset);\
		               This.append(tphiv);\
		               el.find('option').each(function(){\
		                   This.find('select').append('<option value=\"'+$(this).val()+'\">'+$(this).text()+'</option>');\
		               })\
		               ",
        append:'style="min-height:120px"',
        extendmethod:{
            addSelectSingle:function(){
                var elid=_popid_eleid[this.$options.el];
                var el=$("#"+elid);
                showLayuiInput("请输入你要添加的值",[{placeholder:"添加显示选项名称",name:"key"},{placeholder:"添加选项值",name:"value"}],
                    function(data){
                        _elevue[elid].$data.optionsList.push(data);
                        setOAInfo(el,"内容管理",JSON.stringify(_elevue[el.attr('id')].$data));
                    })


            },
            setSelectSingle:function(){
                var elid=_popid_eleid[this.$options.el];
                var sel=$('._tempselectsignle option:selected');
                if(sel.length==1){
                    _elevue[elid].$data.selected=sel.val();
                }
                else if(sel.length==0){
                    _elevue[elid].$data.selected='';
                }
                else{
                    alert("不能选择多个设置为默认值");
                }
                var el=$("#"+elid);
                setOAInfo(el,"内容管理",JSON.stringify(_elevue[el.attr('id')].$data));
            },
            delSelectSingle:function(){
                var elid=_popid_eleid[this.$options.el];
                var sel=$('._tempselectsignle option:selected');
                var selvalues=sel.val();
                for(var i=_elevue[elid].$data.optionsList.length-1;i>=0;i--){
                    if(selvalues.indexOf(_elevue[elid].$data.optionsList[i].value)!=-1){
                        _elevue[elid].$data.optionsList.splice(i,1);
                    }
                }
                sel.remove();
                var el=$("#"+elid);
                setOAInfo(el,"内容管理",JSON.stringify(_elevue[el.attr('id')].$data));
            }
        },
    });
});
//groupid:19--------js：OA组件-单选框-------------
//单选框---
$(function(){
    _oacomponent['单选选项组']={
        define:[{"parent":"showfield","id":"outter_1636883675054","eleid":"ele_1636883675054","type":"横向布局","属性":{"contentinfo":"{}","id":"ele_1636883675054","setradiotitle":"默认提示","component":"单选框组","addlayout":"横向布局","fname":"全部","suitwivwidth":"1","setradioname":""},"样式":{"bclass":"_hiv oa-element oa-layout oa-formradio oa-select","style":"display: flex; flex-direction: row; padding: var(--inlayout-distance); margin-top: var(--line-distance);align-items:center;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":0,"addposition":"addlayout"},{"parent":"ele_1636883675054","id":"outter_1636883694951","eleid":"ele_1636883694952","type":"横向布局","属性":{"contentinfo":"{}","id":"ele_1636883694952","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"width":12,"height":12,"bclass":"_hiv oa-element oa-select","style":"display: flex; flex-direction: row; padding: var(--inlayout-distance); background-image: url(\"none\"); background-size: auto; background-repeat: repeat; background-position: 0% 0%; border-width: 1px;\nmargin-top:7px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_1636883675054"},{"parent":"ele_1636883675054","id":"outter_1636893231547","eleid":"ele_1636893231547","type":"基础Div","属性":{"oacomjs":"","id":"ele_1636893231547","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-select","text":"默认提示","width":68,"height":31,"style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":1,"addposition":"ele_1636883694952"},{"parent":"ele_1636883675054","id":"outter_1636893294957","eleid":"ele_1636893294958","type":"基础Div","属性":{"oacomjs":"This.click(function(){\naddOAInfo($(this).oaprev(),'单选按钮',2);\n});","id":"ele_1636893294958","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element btn btn-primary oa-select oa-configshow","style":"","text":"添加单选按钮","width":110,"height":34,"aconfigshow":"仅配置可见","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_1636883694952"}]
    }
    _oacomponent['单选按钮']={el:$("<div class=\"oa-formsignalradio\">\n" +
            "        <input type=\"radio\" class='oa-formradioinput'>\n" +
            "        <label></label>\n" +
            "        </div>"),
        post:"var This=$('#'+tempid);This.children().click(function(){\n" +
            "    $(this).parent().find(\"input[type='radio']\").prop(\"checked\",\"checked\");\n" +
            "});This.children('input').attr('name',This.oaparent().oaparent().attr('name'));",
    
        ignoretitle:['设置单选真','文本内容']
    }
    _haveoatype.push({name:"setradiolabel",title:"右侧信息",ignore:[],only:[".oa-formsignalradio"],type:"属性",geteval:"el.find('label').text()",seteval:"el.find('label').text(value)"})
    _haveoatype.push({name:"setradiovalue",title:"单选值",ignore:[],only:[".oa-formsignalradio"],type:"属性",geteval:"el.find('input').val()",seteval:"el.find('input').val(value)"})

    _haveoatype.push({name:"setradiotitle",title:"设置标题",ignore:[],only:[".oa-formradio"],type:"属性",geteval:"el.find('div').eq(0).children().text()",seteval:"function _tempradioinit(el,value){setTimeout(function(){setOAInfo(el.find('div').eq(0).children(),'文本内容',value)},11)}_tempradioinit(el,value);"})
    _haveoatype.push({name:"setradioname",title:"标志名称",ignore:[],only:[".oa-formradio"],type:"属性",geteval:"el.attr('name')",seteval:"el.attr('name',value);el.find('input').attr('name',value);"})

    _haveoatype.push({name:"setradiotrue",title:"设置单选真",ignore:[],only:[".oa-formradio"],type:"属性",geteval:"",seteval:"el.find(\"input[value='{0}']\".format(value)).prop('checked','checked');"})
    registerOAOnlyEffect("setradiotrue","横向布局");
})
//groupid:19--------js：OA组件功能拓展-图片读取-------------
 //----------------
//图片组件
function readImg(imgdom,callback) {
    if(imgdom==null)
        return false;
    var file = imgdom.files[0];//这里是抓取到上传的对象。
    if(file==null)
        return false;
    if(!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
        //this.result里的这个result是FileReader.readAsDataURL()接口当中转换完图片输出的base64结果存放在result当中
        callback(this.result);
    }
}

function sendFile(file, callback_success, callback_error) {
    var formData= new FormData();
    formData.append("file", file); //上传一个files对象
    var _operatorId = 'A89EFANINE3IEHENC';
    formData.append("operatorId", _operatorId); //需要上传的多个参数
    $.ajax({ //jQuery方法，此处可以换成其它请求方式
        url: oa_serverip + 'TokerServlet?method=uploadfile',
        dataType: "json",
        type: "post",
        data: formData,
        processData: false, //不去处理发送的数据
        contentType: false, //不去设置Content-Type请求头
        error: function(res) {
            if (callback_error)
                callback_success(callback_error);
            return;
        },
        success: function(res) {
            if (callback_success)
                callback_success(res);
            return;
        }
    })
}
//groupid:19--------js：OA组件-地图坐标组件选取-------------
var maplocation={lng:0,lat:0,data:''};
var maplocation2={lng:0,lat:0,data:''};
var _centerlng=0;
var _cetnerlat=0;

//aftereval:字符串 lng,lat表示经纬度 data表示地点信息,为空表示在ThisInput输入框输出地点信息
function loadMapMarkerComponent(callname,mapinputId,aftereval,afterRectHandle,rectMode){

    var _mapdivid=mapinputId+"map";
    if(aftereval==null)
        aftereval="ThisInput.val(data)";
    if(afterRectHandle==null)
        afterRectHandle="";
    if(rectMode==null)
        rectMode=false;
    var _setGeoInfo="maplocation['lng']=lng;maplocation['lat']=lat;maplocation['data']=data;"+aftereval;
    var _resetGeoInfo="maplocation['lng']=0;maplocation['lat']=0;maplocation['data']='';";
    var _mapPointerIcon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAyCAYAAAAus5mQAAAH9ElEQVRoQ61Ya2wU1xX+zuzai984wQbvbtLwCEEJQYlEVdRUQMIjiEeUACHAzBqHVgQldYrSpC2KghwUtbSprCaWgaC2JuvZxBElqfIgIUBDEQmRikQVowiKgRZ219gYO8asjV9z2jvGZnZ2ZmfW9Ej7Z+c753w6997zIoxCuKpKip49+32Ppj2sEc2UgKlMFABznm6OKEHMMQ34l8R8fFCSvghOnvwPqqrSMnVHmShEZTlIkvQcABnMd2SiC6KLACKsabXBSCTqVtcVwWh5+e2kaVsB/ARAtlvjNrg+AH9kSdoSDIevONlyJBhVlFUE1AIY52Qsw+9tYP5pIBJ5L52eLUGeO9fbHAjUMNHGDB1nBCfmnWWxWCUdPjxgpWhJML5hQy739LwH5qV23sjjgW/GDPimT0fWpEnwlpSA8obeCCcSGLh8Gf3nzqH35En0fvMNeHDQnjjRx5ST85R/165uMyiFoIhcPBjcC+AxK4tSbi7yFi1C3vz5kAoKXEVL6+pC4uBBJD77DFp3CodhGx/6o9EV5kimEIwryk4GnrHynDNrFooUBVJRkStiZpDW2YlOVUXP119b6hPwll9Vk65UEsGYLD8FooYUbUlCUXk58ubNS09M00QOHPqlkcShQ+gMhwGBT5W1AVV9d/jvEUs3UsmplNcqSbitshJjZs50jFrfqVOAJCF76lRH7PXjx9FeU5NKkqhd8nqnldXVXRZGRgjGZXmH1YvVI7dggaNDARDHR0QolGVXeHEvO99+OwVrPGqdYLy8/E7WtCYAWUa0uHPFz4nC4UKY0bJpkx7B8dXVjsc8bLGjttbqTvaTJE3xh8MXdIKxUOg3YP6VkYZ4raWvvw6psNAFO6Dv7Fm0VVXp2JKtW5E1caIrPe3qVbS+9FLq6ybaFqiv30yi8Mebmv4DIGi0WLB8OQqeeMKVEwG62tCAa598ouPzly1D4apVrnW7PvgAXe+/b8ZH/VOmfI8uhkI/kJiT3j15vRj/5puu85yw3PriixhoadGdeCdM0KPvVkSebHn+efBAcjHRiGZRPBTazMy/Nhob8+CDuO2FF9zaR/+FC7j88stJ+NJt2+ANBFzbaK+uxvUTJ5LwxLyZooryFwJWGL8UhULIW7jQtXFxPOKYbuWKJA4cGMqNBmFgryDYSMB044dxr7wyksu4pwff7d6Nnq++ck3YDTDnoYcwdt06UE6ODu87cwZtW0VHd1MYOEkxRWkDcLvxw4Tt21PuX/fRo3rO4uvX3fi3xQhCgpggaBRxDy89+6xZ74og2GtuQsvq6iAeilkGLl1Cx/bt6D9/flQkRdcj8qq3tDRFXzyQ5qefNv/fJwgmAOQav9gRFBjRNnXt2YNr+/YBzO6IEiF/yRIUrFwJ0aZZiQ3BAYrJ8nkQ3eV0xGajos/r2LkTokNJJ56xYzF240b47rsvLc7miOMign8HMDvpkWzZguy773aMjkjMIkGnk8I1a5C/eLGjLatHAuCIyIO/Z+afGy24TTNtr76KviZRwu1FdDYiKziJVZohoFpUksUS81CNuiFuEvVge/tQc+B0D4kw/o034CkuTsvRKlFrREvoTGWlL6+jo4WBkTZZL3U1NZDy822NJvbv19sro+TOmaMT7j5yJOl/p5bNqtQR0JkoLh6vdzNRWQ4TUcho1alZaHvtNfSdPq2r6Llt/XqI9kxIz7Fj+K6uDiLJC8meNg3jTKXQ6MuqWWDm+mAkUq4TvKgocyXgC6NSunZLvNxLlZV6tLInT9Zzm6ekJClqg62taK+t1Sc70SNOEM2HxSwjoicaDfMwpQEP36Gqh2+2/BYlz65h1TvhcBj5S5eiYMUK+9xmyJlFFRXIe+SRlCtj1bAS0OhX1Rn66QxrxGR5PYj+ZLZQtG6dPmIapWPHDuTOnu2Y24Z1ehsb0f3llyjemLwDsGv5wfzjQCTy5ySCYh6OBYOnCZiUxMZiaNKuXUv7gKxellnHbmhi4FwgGr1neD5Omg+joVAFMdelOHA7dqZNJDc/Ooyd6wOqOsIhiSA/+aSn2ec7wcD9Vr70wT0Ucj2nmG2I+aOzvt52cBftVaC39wHas2dkT5IyYUdleR4RHbQLxsjqY8EC18csjldUCofVB5h5fjASOWT0bbkCiMryXiJanu7EUpZHpaXJy6PW1pvLo8bGlHnDbFt0z0FVXWn+35LghdWr/V6v91tjdXF5vUYFE1VjYGDg3jsbGuKuCApQPBTawMxvjcpjhkpE9Iy/vn6XlZr9AhOguKLsA7AoQ38ZwRn4NKCqSwiw7H7TrqH+rShlWUCjeWbJiEF68JV+4P67VLXZDua4o44pilhk/tVYdf5PBEXEHg+o6odpH6MbZzFZ/i2IfuEG6xrD/LtAJPJLJ7xjBIUBkcDjPt/nAFKrvZMH6+9/8/f2LjQm5FEf8bBifM2acezxHAMwZXScRrSapKysHw4vKJ1suYrgsJFmWb5XIzosNmxOhm2+t0nMc8oikW/d6mdE8EZ+nAnmg5kmcZGMQTTfX19/3C05gcuYoE6yvPxHrGn7zQN/GsfdJEmP+sPho5mQGzVBoRhTFLG4/giAz8GpWK0sC6jqgUzJ3RJBPZJr185mSRI50m6m7CBNe9z/zjvJY14GTEd1xEb7MUW5B4BYLzxg8vtPAKsDqjo0+o1Sbpmg8Hu+omKMr79/ExP9TKz6iHlHb1bWHybu3n1ru7r/Gf8vS0srZbImohUAAAAASUVORK5CYII=";
    var _jqMapInput=$('#'+mapinputId);
    var ThisInput=_jqMapInput;
    _jqMapInput.parent().css("position","relative")
    _jqMapInput.before('<div id="'+_mapdivid+'" style="position: absolute;width:400px;height:300px;top:100%;right:0.9vw;z-index:1;display: none;"></div><div id="_closeMap" style="position: absolute;right:1.9vw;top:calc(100% + 10px);cursor:pointer;color:black;font-size:20px;font-weight:bold;z-index:2;display:none">X</div>');

    loadScript();

    _jqMapInput.blur(function(){

    }).focus(function(){
        $("#"+_mapdivid).show();
        $("#_closeMap").show();
    });


    function loadScript() {
        var script = document.createElement("script");
        script.src = "http://api.map.baidu.com/api?v=3.0&ak=gkBmd2jqvpUOruR6MpKhm5pKIAh4w50s&callback="+callname;
        document.body.appendChild(script);
    }

    var map; 			// 地图
    var myGeo;		// 地址转经纬度
    var marker;		// 地图上的标志点
    var pointersum=0;
    var callInitMapper=function() {

        map = new BMap.Map(_mapdivid,{ mapType: BMAP_NORMAL_MAP, minZoom: 5,enableMapClick: false });
        // 创建将地址转成经纬度对象
        myGeo = new BMap.Geocoder();
        map.centerAndZoom(new BMap.Point(120.15506900000003,30.274089), 11); //杭州
        // 给百度地图添加点击事件
        map.addEventListener("click", showInfo);
        // 设置地图显示的城市 此项是必须设置的
        map.setCurrentCity("杭州");
        //开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true);
        addAutoCompleInput();

        $(map).hide();
        $("#_closeMap").hide();

    }

    // 点击地图触发事件
    function showInfo(e){
        // 如果地图上不存在标注点则创建，否则定位到标注点
        if(typeof(marker) == "undefined"){
            addStartMarker(e.point.lng,e.point.lat);
        }
        else if(!rectMode){
            eval(_resetGeoInfo);
            map.removeOverlay(marker);
            marker = null;
            addStartMarker(e.point.lng,e.point.lat);
        }
    }

    // 添加标注点
    function addStartMarker(lng,lat){
        var point = new BMap.Point(lng,lat);
        // 当点击的搜索的下拉框时，判断是否已经存在标注点
        // 移除所有标注点
        map.clearOverlays();
        var myIcon = new BMap.Icon(_mapPointerIcon, new BMap.Size(40,50));
        marker = new BMap.Marker(point,{icon:myIcon});
        // 给标注点注册拖动事件
        marker.addEventListener("dragend", function attribute() {
            if(true) {
                var p = marker.getPosition();
                var pt = new BMap.Point(p.lng, p.lat);
                valueToInput(pt);
            }
        });
        // 将标注添加到地图中
        map.addOverlay(marker);
        // 设置可拖动
        marker.enableDragging();
        // 将经纬度转换成地址并显示在文本框
        myGeo.getLocation(point, function(rs){

            var addComp = rs.addressComponents;
            var destination = addComp.province + "" + addComp.city + "" + addComp.district + "" + addComp.street + "" + addComp.streetNumber;
            var data=destination;
            var lng = point.lng;
            var lat=point.lat;
            eval(_setGeoInfo)
        });
    }

    // 将当前点的经纬度转成地址并赋值给文本框
    function valueToInput(point){
        // 将经纬度保存起来
        var lng = point.lng;
        var lat=point.lat;
        // 转换经纬度
        myGeo.getLocation(point, function(rs){
            var addComp = rs.addressComponents;
            var path = addComp.province + "" + addComp.city + "" + addComp.district + "" + addComp.street + "" +addComp.streetNumber;
            var data=path;
            eval(_setGeoInfo)
        });
    }

    function addAutoCompleInput(){
        // 搜索框自动补全
        var acStartPoint = new BMap.Autocomplete(
            {"input" : _jqMapInput.attr("id")
                ,"location" : map
            });
        // 监听鼠标点击搜索框的下拉选项事件
        acStartPoint.addEventListener("onconfirm", function(e) {
            var _value = e.item.value;
            var	myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            //  获得下拉框文本对应的值并将标志点设置到文本框中文字对应的经纬度中
            setStartPlace(myValue);
        });
    }
    // 在文本框输入时自动进行搜索并添加标注点
    function setStartPlace(myValue){
        function myFun(){
            // 获取第一个智能搜索的结果
            var pp = local.getResults().getPoi(0).point;
            map.panTo(pp);
            map.clearOverlays();    //清除地图上所有覆盖物
            var myIcon = new BMap.Icon(_mapPointerIcon, new BMap.Size(40,50));
            marker = new BMap.Marker(pp,{icon:myIcon});
            map.addOverlay(marker);    //添加标注
            marker.addEventListener("dragend", function attribute() {
                if(true) {
                    var p = marker.getPosition();
                    var pt = new BMap.Point(p.lng, p.lat);
                    valueToInput(pt);
                }
            });
            marker.enableDragging();
            var lng = pp.lng;
            var lat=pp.lat;
            var data = myValue;
            // 同步vue中的值，不设置的话vue的值刷新时发现不一样则会自动弹出搜索下拉框(bug)
            eval(_setGeoInfo);
        }
        // 智能搜索
        var local = new BMap.LocalSearch(map, {
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    // 关闭地图
    function closeMap(){
        // 判断对应的文本框是否为空，为空则认为他不需要这个点了，则清除fail标志
        var inputValue = ThisInput.val();
        // console.log(inputValue);
        if("" == inputValue || null == inputValue){
            // vCreateType.lat = 0;
            // vCreateType.lng = 0;
            // vCreateType.location = '';
            var lng = 0;
            var lat=0;
            var data = '';
            // 同步vue中的值，不设置的话vue的值刷新时发现不一样则会自动弹出搜索下拉框(bug)
            eval(_setGeoInfo);
            map.removeOverlay(marker);
            marker = null;
        }
        $(map).hide();
        $("#_closeMap").hide();
    }
    //----------------------尝试添加

    // 敏感辖区地图对象
    var alertMap = null;
    // 转换成经纬度的对象
    var alertMyGeo = null;
    // 巨型对象
    var rectangle = null;
    // 标注点1
    var alertMarker = null;
    var operatorObjAlert;
    var acStartPointAlert;
    // 初始化地图
    function initAlertMap(id){
        // console.log("初始化地图:"+id);
        operatorObjAlert = ThisInput.attr("id");
        if(null == alertMap){
            alertMap = new BMap.Map(_mapdivid,{ mapType: BMAP_NORMAL_MAP, minZoom: 5,enableMapClick: false });
            // 给百度地图添加点击事件
            alertMap.addEventListener("click",showAlertMapInfo);
        }

        alertMap.centerAndZoom(new BMap.Point(120.15506900000003,30.274089), 11); //杭州
        // alertMap.setMapStyleV2({
        //     styleId: '3d71dc5a4ce6222d3396801dee06622d'
        // })
        //添加地图类型控件（地图或者混合）====取消地图类型
        /* alertMap.addControl(new BMap.MapTypeControl({
            mapTypes:[
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP
            ]}));  */
        alertMap.setCurrentCity("杭州");
        alertMap.enableScrollWheelZoom(true);
        addAutoCompleInputAlert();
    }



    function addAutoCompleInputAlert(){
        // 搜索框自动补全
        acStartPointAlert = new BMap.Autocomplete({
            "input" : operatorObjAlert,
            "location" : alertMap,
        });
        // 监听鼠标点击搜索框的下拉选项事件
        acStartPointAlert.addEventListener("onconfirm", function(e) {
            var _value = e.item.value;
            console.log('_value:'+_value);
            var	myValueAlert = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            //  获得下拉框文本对应的值并将标志点设置到文本框中文字对应的经纬度中
            setStartPlaceAlert(myValueAlert);
        });
    }
    // 在文本框输入时自动进行搜索并添加标注点
    function setStartPlaceAlert(myValueAlert){
        function myFunAlert(){
            // 获取第一个智能搜索的结果
            var pp = local.getResults().getPoi(0).point;
            alertMap.panTo(pp);
        }
        // 智能搜索
        var local = new BMap.LocalSearch(alertMap, {
            onSearchComplete: myFunAlert
        });
        local.search(myValueAlert);
        acStartPointAlert.dispose();
    }
    // 点击地图事件
    function showAlertMapInfo(e){
        console.log("触发了点击事件");
        createOverlays(e);
    }
    // 生成覆盖物
    function createOverlays(e){
        if(pointersum<=1){
            console.log("执行生成覆盖物");
            var lng = e.point.lng;
            var lat = e.point.lat;
            if(null == alertMyGeo){
                alertMyGeo = new BMap.Geocoder();
            }
            var point = new BMap.Point(e.point.lng,e.point.lat);
            var myIcon = new BMap.Icon(_mapPointerIcon, new BMap.Size(40,50));
            // 第一个图标
            if(0 == pointersum){
                // 设置icon的值是为了方便判断是拖动了哪个标注,所以title的值需要不一样
                alertMarker = new BMap.Marker(point,{icon:myIcon,title:'start'});
                // 第二个图标
            }else if(1 == pointersum){
                alertMarker = new BMap.Marker(point,{icon:myIcon,title:'end'});
            }
            alertMap.addOverlay(alertMarker);
            // alertMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
            alertMarker.setOffset(new BMap.Size(-2,-15));
            // 保存经纬度的值
            if(pointersum==0){
                maplocation.lng=lng;
                maplocation.lat=lat;
            }else{
                maplocation2.lng=lng;
                maplocation2.lat=lat;
            }
            // 设置可拖动
            alertMarker.enableDragging();
            // 将经纬度转为文本地址
            alertMyGeo.getLocation(point, function(rs){
                var addComp = rs.addressComponents;
                var path = addComp.province + "" + addComp.city + "" + addComp.district + "" + addComp.street + "" +addComp.streetNumber;
                if(pointersum==0)
                    maplocation.data=path;
                else maplocation2.data=path;

                // 记录地图上的标注数
                pointersum++;
                // 表明地图上有两个标注,可形成巨型
                // (该方法不能放在外面,否则会出现文本没加载完成就进行绘制---因为经纬度转为地址是有延迟的)
                if(2 == pointersum){
                    drawRectangle();
                };
                // 赋值到文本框中
                assignValue();
            });
            alertMarker.addEventListener("dragend", function attribute(type) {
                if(true) {
                    console.log('type:'+type.target.K);
                    //console.log("拖动了:"+type.target.z.title);
                    dragendFn(type);
                }
            });
        }
    }

    // 标注拖动触发事件
    function dragendFn(type){
        console.log(type);
        // 拖动图标的title--唯一标识图标
        var title = type.target.K.title;
        var p = type.point;
        // 起始标注
        if("start" == title){
            // console.log("更新了起点的坐标"+p.lng+"-"+p.lat);
            var lng=p.lng;
            var lat=p.lat;
            maplocation.lng=lng;
            maplocation.lat=lat;

            // 结束标注
        }else if("end" == title){
            // console.log("更新了未点的坐标"+p.lng+"-"+p.lat);
            var lng=p.lng;
            var lat=p.lat;
            maplocation2.lng=lng;
            maplocation2.lat=lat;
        }
        // 绘制巨型
        drawRectangle();
        lngAndlatTransferText();
    }

    // 将经纬度转为文本(拖动标注时使用的)
    function lngAndlatTransferText(){
        var count = 0;
        var text = '';
        if(null == alertMyGeo){
            alertMyGeo = new BMap.Geocoder();
        }
        // 循环读取存储经纬度的数据
        for (var i = 0; i < 2; i++) {

            var item = eval(('(maplocation'+(i==0?'':2)+")"));
            var point = new BMap.Point(item.lng,item.lat);
            // console.log(point);
            alertMyGeo.getLocation(point, function(rs){
                count++;
                var destination = rs.address;
                setTimeout(function(){
                    text += destination+"~";
                    if(2 == count){
                        ThisInput.val(text.substring(0,text.length-1));
                        eval(afterRectHandle);
                    }
                },500);
            });
        }
    }


    // 赋值到文本框(第一次标记的时候使用的)
    function assignValue(){
        var itemLength = 2;
        ThisInput.val('') ;
        for (var i = 0; i < itemLength ; i++) {
            var pdata= eval(('(maplocation'+(i==0?'':2)+".data)"));
            ThisInput.val(ThisInput.val()+pdata+"~");

        }
        // 去除做最后的"-"号
        ThisInput.val(ThisInput.val().substring(0,ThisInput.val().length-1));
        eval(afterRectHandle);
    }

    // 绘制矩形
    function drawRectangle (){
        // 存在两个图标时绘制矩形
        if(2 == pointersum){
            if(null != rectangle){
                alertMap.removeOverlay(rectangle);
            }
            var leftLng = maplocation.lng;
            var leftLat = maplocation.lat;
            var rightLng = maplocation2.lng;
            var rightLat = maplocation2.lat;
            _centerlng=(parseFloat(leftLng)+parseFloat(rightLng))/2;
            _centerlat=(parseFloat(leftLat)+parseFloat(rightLat))/2;

            // 绘制矩形
            rectangle = new BMap.Polygon([
                new BMap.Point(leftLng,leftLat),
                new BMap.Point(leftLng,rightLat),
                new BMap.Point(rightLng,rightLat),
                new BMap.Point(rightLng,leftLat)
            ], {strokeColor:"red", strokeWeight:2, strokeOpacity:1,fillOpacity:0.1});
            //增加矩形
            alertMap.addOverlay(rectangle);
        }
    }
    // 关闭地图
    function closeAlertMap(){
        var itemObj = ThisInput;
        // 判断对应的文本框是否为空，为空则认为他不需要这个点了，则清除fail标志
        var inputValue = itemObj.val();
        console.log(inputValue);

        // if(1 == pointersum || "" == inputValue || null == inputValue){
        if(0 < pointersum &&!confirm("是否保存设置坐标数据")){
            alertMap.clearOverlays();
            // vCreateType.rectangleCenterLng = null,
            // vCreateType.rectangleCenterLat = null,
            ThisInput.val('');
            pointersum = 0;
            alertMarker = null;
            rectangle = null;
            // 清除隐藏域的经纬度
            maplocation.lat=0;
            maplocation.lng=0;
            maplocation.data='';
            maplocation2.lat=0;
            maplocation2.lng=0;
            maplocation2.data='';
            console.log("执行清空");
        }
        $(map).hide();
    }
    if(rectMode){
        callInitMapper=initAlertMap
        $("#_closeMap").click(function(){

            closeAlertMap();
            $("#"+_mapdivid).hide();
            $("#_closeMap").hide();
        })
    }else{
        $("#_closeMap").click(function(){
            closeMap();
            $("#"+_mapdivid).hide();
            $("#_closeMap").hide();
        })
    }
    return callInitMapper;
}
//groupid:19--------js：OA组件-iframe框架及其跳转标签-------------
//---------iframe框架及其跳转标签------------------
$(function(){
    _oacomponent['网页框架']={el:$("<iframe class=\"oa-iframe\" frameborder='0' style='width:100%;height:90vh;border: medium none;'></iframe>") ,cnotbefore:true,cnotin:true,cnotafter:true}
    _haveoatype.push({name:"pointsrc",title:"指向页面",ignore:[],only:[".oa-iframe"],type:"属性",geteval:"getOAInfo(el,'指向页面')||''",seteval:"el.attr('src',value);"});
    _oacomponent['tab标签']={define:[{"parent":"ele_163758575519601657774083491257","id":"outter_163758832732304409545661916441","eleid":"ele_1637588327323037660500552972453","type":"基础Div","属性":{"pointsrc":"","id":"ele_1637588327323037660500552972453","oacomjs":"This.click(function(){\nThis.oaparent().find(\".tabactive\").removeClass(\"tabactive\");\nThis.addClass(\"tabactive\");\nThis.oaparent().oaprev().attr(\"src\",getOAInfo(This,'tab标签'));\n});","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0","tablabel":""},"样式":{"bclass":"_oa-div oa-element oa-inittab oa-select ","style":"padding: var(--inlayout-distance); margin: 0px; border-width: 1px;display:flex;justify-content:center;align-items:center;","text":"内容","width":114,"height":38,"aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":1,"addposition":"ele_163758575519604721351733502672"}]
        ,cnotbefore:true,cnotin:true,cnotafter:true}
    _haveoatype.push({name:"tabcontent",title:"默认标签",append:"placeholder='如：0，表示第零个标签默认选中'",ignore:[],only:[".oa-tabcontent"],type:"属性",geteval:"getOAInfo(el,'默认标签')||''",seteval:"el.find('.oa-inittab').removeClass('tabactive');\n" +
            "if(value!=null&&value!=''){\n" +
            "    el.find('.oa-inittab:eq('+value+')').addClass('tabactive');\n" +
            "    if(el.find('.oa-inittab:eq('+value+')').length!=0)\n" +
            "        el.oaprev().attr('src',getOAInfo(el.find('.oa-inittab:eq('+value+')'),'tab标签'))\n" +
            "}"});
    _haveoatype.push({name:"tablabel",title:"tab标签",append:"placeholder='如：http://101.201.79.14:8081'",ignore:[],only:[".oa-inittab"],type:"属性",geteval:"getOAInfo(el,'tab标签')||''",seteval:""});
    _oacomponent['tab标签组']={
        define:[{"parent":"showfield","id":"outter_163758575519605367206441669368","eleid":"ele_163758575519506105728641667443","type":"纵向布局","属性":{"tabcontent":"","id":"ele_163758575519506105728641667443","component":"纵向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_viv oa-element oa-layout oa-select","style":"display: flex; flex-direction: column; padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_1636606679894"},{"parent":"ele_163758575519506105728641667443","id":"outter_163758575519606951574175098099","eleid":"ele_163758575519504737211639944088","type":"横向布局","属性":{"tabcontent":"","id":"ele_163758575519504737211639944088","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_hiv oa-element oa-configshow oa-select","aconfigshow":"仅配置可见","width":1443,"height":74,"style":"display: flex; flex-direction: row; padding: var(--inlayout-distance); border-width: 1px;","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_163758575519506105728641667443"},{"parent":"ele_163758575519504737211639944088","id":"outter_163758575519605003425742129302","eleid":"ele_163758575519609485032669511224","type":"基础Div","属性":{"tabcontent":"","oacomjs":"This.oanext().val(getOAInfo(This.oaparent().oanext().oanext(),\"默认标签\"));\nsetOAInfoDelay(This.oaparent().oanext().oanext(),\"el\",\"默认标签\",This.oanext().val())\nThis.oanext().change(function(){\nsetOAInfoDelay($(this).oaparent().oanext().oanext(),\"el\",\"默认标签\",$(this).val())\n});\n\n","id":"ele_163758575519609485032669511224","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-select","text":"设置第N个Tab为默认显示","width":171,"height":31,"style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_163758575519504737211639944088"},{"parent":"ele_163758575519504737211639944088","id":"outter_163758575519605383004807767047","eleid":"ele_1637585755196013993116108409787","type":"输入框","属性":{"tabcontent":"","val":"","placeholder":"如：0","oacomjs":"\n\n","id":"ele_1637585755196013993116108409787","component":"输入框","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","editset":"write","type":"text","bginputsrc":"","dateinputtype":"","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"oa-input oa-element oa-select","width":"100px","height":40,"bgsrc":" ","style":"width: 100px; height: 40px; background-image: url(\"\"); border-width: 1px;","aconfigshow":"不做设置","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163758575519609485032669511224"},{"parent":"ele_163758575519504737211639944088","id":"outter_163758575519605557331478285032","eleid":"ele_163758575519609330662786353339","type":"弹簧","属性":{"tabcontent":""},"样式":{"bclass":"_pow oa-element oa-select"},"addtype":3,"addposition":"ele_1637585755196013993116108409787"},{"parent":"ele_163758575519504737211639944088","id":"outter_1637585755196009315777585240226","eleid":"ele_1637585755196018020342438512893","type":"基础Div","属性":{"tabcontent":"","id":"ele_1637585755196018020342438512893","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-select","text":"设置Iframe显示页面","width":136,"height":31,"style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163758575519609330662786353339"},{"parent":"ele_163758575519504737211639944088","id":"outter_163758575519607807751141901587","eleid":"ele_1637585755196008934476074119724","type":"输入框","属性":{"tabcontent":"","placeholder":"ifame页面网址","oacomjs":"This.val(This.oaparent().oanext().attr(\"src\"));\nsetOAInfo(This.oaparent().oanext(),\"指向页面\",This.val())\nThis.change(function(){\nsetOAInfo($(this).oaparent().oanext(),\"指向页面\",$(this).val())\n});\n","id":"ele_1637585755196008934476074119724","component":"输入框","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","val":"","editset":"write","type":"text","bginputsrc":"","dateinputtype":"","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"oa-input oa-element oa-select","bgsrc":" ","width":571,"height":40,"style":"background-image: url(\"\"); border-width: 1px;","aconfigshow":"不做设置","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_1637585755196018020342438512893"},{"parent":"ele_163758575519506105728641667443","id":"outter_163758575519608625741065044441","eleid":"ele_163758575519607107366868551077","type":"网页框架","属性":{"tabcontent":"","id":"ele_163758575519607107366868551077","component":"网页框架","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0","pointsrc":""},"样式":{"bclass":"oa-iframe oa-element oa-select","width":1843,"height":872,"style":"width: 100%; height: 90vh;","aconfigshow":"不做设置","text":"","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163758575519504737211639944088"},{"parent":"ele_163758575519506105728641667443","id":"outter_163758575519606877170406505424","eleid":"ele_163758575519601657774083491257","type":"横向布局","属性":{"pointsrc":"","id":"ele_163758575519601657774083491257","component":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0","tabcontent":""},"样式":{"bclass":"_hiv oa-element oa-layout oa-tabcontent oa-select","style":"display: flex; flex-direction: row;  border-width: 1px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163758575519607107366868551077"},{"parent":"ele_163758575519601657774083491257","id":"outter_163758575519605406579853573188","eleid":"ele_163758575519604721351733502672","type":"基础Div","属性":{"pointsrc":"","oacomjs":"This.click(function(){\naddOAInfo($(this),\"tab标签\",1);\n});\n","id":"ele_163758575519604721351733502672","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element btn btn-primary oa-select","text":"添加标签","style":"padding: var(--inlayout-distance); border-width: 1px; margin:3px;","width":68,"height":32,"aconfigshow":"仅配置可见","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_163758575519601657774083491257"}]

    }
});
//groupid:19--------js：OA组件-表格控件-------------
//--------------------表格控件-----------------------
//obj中存在几个关键字
function jsonLength(obj) {
    var size = 0;
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
}
$(function(){
    _oacomponent['OA表格']={
        define:[{"parent":"ele_1638120071118","id":"outter_1638179599887","eleid":"ele_1638179599888","type":"纵向布局","属性":{"tbchinesename":""},"样式":{"bclass":"_viv oa-element oa-select"},"addtype":3,"addposition":"ele_1638179560014014637922920625446"},{"parent":"ele_1638179599888","id":"outter_163817961610105662082833551283","eleid":"ele_1638179616101013781752078029408","type":"横向布局","属性":{"tbchinesename":"","id":"ele_1638179616101013781752078029408","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_hiv oa-element oa-configshow oa-select","width":1843,"height":74,"style":"display: flex; flex-direction: row; padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"仅配置可见","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_1638179599888"},{"parent":"ele_1638179616101013781752078029408","id":"outter_163817961610105522181010716354","eleid":"ele_163817961610109635971401215369","type":"弹簧","属性":{"tbchinesename":""},"样式":{"bclass":"_pow oa-element oa-select"},"addtype":2,"addposition":"ele_1638179616101013781752078029408"},{"parent":"ele_1638179616101013781752078029408","id":"outter_163817961610109884407374326099","eleid":"ele_1638179616101020122050046673245","type":"基础Div","属性":{"tbchinesename":"","oacomjs":"setTimeout(function(){\nThis.oanext().val(getOAVue(This.oaparent().oanext()).$data.registertable);\n},100);\nThis.oanext().change(function(){\ngetOAVue($(this).oaparent().oanext()).registertable=$(this).val();\n});","id":"ele_1638179616101020122050046673245","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-select","text":"绑定表单","width":68,"height":31,"style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163817961610109635971401215369"},{"parent":"ele_1638179616101013781752078029408","id":"outter_1638179616101021231165810319652","eleid":"ele_1638179616101017747293703499967","type":"选择框","属性":{"tbchinesename":"","contentinfosql":"\"select c.key,c.value,c.id from (select b.alias key,b.table value,b.id id  from tb_devmodel b where b.table!='' union select '选择绑定表单','',99999999999) c order by c.id desc\"","id":"ele_1638179616101017747293703499967","component":"选择框","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","editset":"write","bginputsrc":"","fname":"全部","suitwivwidth":"0","contentinfo":"{\"optionsList\":[{\"key\":\"选择绑定表单\",\"value\":\"\"},{\"key\":\"测试页\",\"value\":\"oatable_1635531608897\"},{\"key\":\"测试2\",\"value\":\"oatable_1635994766782\"},{\"key\":\"建表测试\",\"value\":\"oatable_1636738642642\"},{\"key\":\"临时19\",\"value\":\"oatable_1637303630460\"},{\"key\":\"车辆登记\",\"value\":\"oatable_1637598626222\"},{\"key\":\"行政区域管理\",\"value\":\"tb_mhaczone\"},{\"key\":\"车主信息\",\"value\":\"tb_mhcarowner\"},{\"key\":\"企业管理\",\"value\":\"tb_mhcompany\"},{\"key\":\"设备管理\",\"value\":\"tb_mhdevice\"},{\"key\":\"公安系统单位信息管理\",\"value\":\"tb_mhgongan\"},{\"key\":\"用户管理\",\"value\":\"tb_mhpolice\"},{\"key\":\"车辆注册\",\"value\":\"tb_mhregcar\"}],\"selected\":\"\"}"},"样式":{"bclass":"oa-inputselect _ipdownarror oa-element oa-select","height":["oa-inputselect","_ipdownarror","oa-element"],"width":571,"aconfigshow":"不做设置","text":"选择绑定表单测试页测试2建表测试临时19车辆登记行政区域管理车主信息企业管理设备管理公安系统单位信息管理用户管理车辆注册","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_1638179616101020122050046673245"},{"parent":"ele_1638179599888","id":"outter_1638179626864013874579226773864","eleid":"ele_163817962686406450373085433057","type":"表格基础","属性":{"tbchinesename":"","id":"ele_163817962686406450373085433057","component":"表格基础","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0","vexaddurl":"","vexposturl":"#","vexparamsgeteval":"{sql:sql,args:{}}","vexparamsmakeeval":"var sql=`select * from ${this.registertable} ${this.getLimitCondition()} order by id asc ${this.postmode?'limit '+pagesize+' offset '+startid:''}`;","vexregistertable":"","vexignorecol":"[\"_XID\"]","vextitlemapper":"[{\"field\":\"id\",\"title\":\"序号\"},{\"field\":\"_handle\",\"title\":\"操作\"}]","vexwidthmapper":"{\"id\":120}","vexsortmapper":"{\"id\":true}","vexformattermapper":"{}","setvxetableinfo":"{\"height\":null,\"gridOptions\":{\"border\":false,\"showOverflow\":false,\"height\":null,\"showHeader\":false,\"columns\":[{\"field\":\"col0\",\"fixed\":\"left\",\"width\":80}],\"data\":[{\"col0\":\"序号\",\"_X_ID\":\"row_468\"}]},\"loading\":false,\"tablePage\":{\"currentPage\":1,\"pageSize\":10,\"totalResult\":0},\"tableData\":[],\"tableHistory\":[],\"title\":[{\"field\":\"id\",\"title\":\"序号\"},{\"field\":\"_handle\",\"title\":\"操作\"}],\"width\":{\"id\":120},\"ignore\":[\"_XID\"],\"sortable\":{\"id\":true},\"allalign\":\"center\",\"filter\":{},\"formatter\":{},\"mapperHandle\":{},\"mapperIdHandle\":{},\"showoamore\":{},\"showoamore_pointer\":{},\"registertable\":\"\",\"postmode\":true,\"posturl\":\"#\",\"params_makeeval\":\"var sql=`select * from ${this.registertable} ${this.getLimitCondition()} order by id asc ${this.postmode?'limit '+pagesize+' offset '+startid:''}`;\",\"params_geteval\":\"{sql:sql,args:{}}\",\"showaddbtn\":true,\"showimportbtn\":true,\"showexportbtn\":true,\"showdowntemplatebtn\":true,\"jumpaddhtml\":\"\",\"nowcol\":[],\"collist\":{\"序号\":\"id\",\"设备编号\":\"devid\",\"时间戳\":\"time\",\"请选择列\":\"\"},\"editData\":[],\"showEdit\":false,\"formData\":null,\"formRules\":{\"name\":[{\"required\":true,\"message\":\"请输入名称\"},{\"min\":1,\"max\":8,\"message\":\"长度在 1 到 8 个字符\"}],\"posthandle\":[{\"required\":true,\"message\":\"后置操作不能为空\"}]},\"selectRow\":null,\"mapperHandleEvent\":{},\"modaldelete\":false,\"showEdit2\":false,\"formData2\":null,\"formRules2\":{\"name\":[{\"required\":true,\"message\":\"请输入判断条件\"},{\"min\":1,\"max\":500,\"message\":\"长度在 1 到 500 个字符\"}]},\"selectRow2\":null,\"modaldelete2\":false}","setvxevueinfo":"{\"height\":null,\"gridOptions\":{\"border\":false,\"showOverflow\":false,\"height\":null,\"showHeader\":false,\"columns\":[{\"field\":\"col0\",\"fixed\":\"left\",\"width\":80}],\"data\":[{\"col0\":\"序号\",\"_X_ID\":\"row_409\"}]},\"loading\":false,\"tablePage\":{\"currentPage\":1,\"pageSize\":10,\"totalResult\":0},\"tableData\":[],\"tableHistory\":[],\"title\":[{\"field\":\"id\",\"title\":\"序号\"},{\"field\":\"_handle\",\"title\":\"操作\"}],\"width\":{\"id\":120},\"ignore\":[\"_XID\"],\"sortable\":{\"id\":true},\"allalign\":\"center\",\"filter\":{},\"formatter\":{},\"mapperHandle\":{},\"mapperIdHandle\":{},\"showoamore\":{},\"showoamore_pointer\":{},\"registertable\":\"\",\"postmode\":true,\"posturl\":\"#\",\"params_makeeval\":\"var sql=`select * from ${this.registertable} ${this.getLimitCondition()} order by id asc ${this.postmode?'limit '+pagesize+' offset '+startid:''}`;\",\"params_geteval\":\"{sql:sql,args:{}}\",\"showaddbtn\":true,\"showimportbtn\":true,\"showexportbtn\":true,\"showdowntemplatebtn\":true,\"jumpaddhtml\":\"\",\"nowcol\":[],\"collist\":{\"序号\":\"id\",\"设备编号\":\"devid\",\"时间戳\":\"time\",\"请选择列\":\"\"},\"editData\":[],\"showEdit\":false,\"formData\":null,\"formRules\":{\"name\":[{\"required\":true,\"message\":\"请输入名称\"},{\"min\":1,\"max\":8,\"message\":\"长度在 1 到 8 个字符\"}],\"posthandle\":[{\"required\":true,\"message\":\"后置操作不能为空\"}]},\"selectRow\":null,\"mapperHandleEvent\":{},\"modaldelete\":false,\"showEdit2\":false,\"formData2\":null,\"formRules2\":{\"name\":[{\"required\":true,\"message\":\"请输入判断条件\"},{\"min\":1,\"max\":500,\"message\":\"长度在 1 到 500 个字符\"}]},\"selectRow2\":null,\"modaldelete2\":false}"},"样式":{"width":1843,"height":178,"bclass":"_hiv oa-vexhivtable oa-element _vextablepostmode oa-select","style":"display: flex; flex-direction: row;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%","vextablealign":"center"},"addtype":3,"addposition":"ele_1638179616101013781752078029408"}]
    }
    _haveoatype.push({
        name: "setvxetableinfo",
        title: "设置基础表单内容",
        ignore: [],
        only: [".oa-vexhivtable",'.oa-treeselect'],
        type: "属性",
        geteval: "getOAInfo(el,'设置基础表单内容')",
        seteval: ""
    });
    _haveoatype.push({
        name: "setvxevueinfo",
        title: "加载基础表单内容",
        ignore: [],
        only: [".oa-vexhivtable",'.oa-treeselect'],
        type: "属性",
        geteval: "",
        seteval: "const cvalue=value;const cel=el;setTimeout(()=>{if(cvalue!=null)Object.assign(getOAVue(cel).$data,JSON.parse(cvalue));},10);"
    });
    _oacomponent['表格基础']={
        el:$(`<hiv class='oa-vexhivtable'>
			<pow></pow>
			<div class='oa-vivhcenter'>
				<!-- v-show="!isMobile" -->
				 <vxe-table
				   ref="xTable"
				   resizable
				   :height="height"
				   highlight-hover-row
				   :loading="loading"
				   :data="editmode?editData:tableData"
				   :align="allalign"
				   :sort-config="{multiple: true}"
				   class="mhidden oa-vextable"
				   :scroll-y="{enabled: false}"
				   :export-config="{}"
				   style='overflow: visible;'
				   >
					
					<vxe-column field='id'  :width="width['id']||80" :title="title.find((item)=> item.field=='id').title||'序号'" :formatter="formatter['id']!=null?({cellValue})=>{return formatterInfo(cellValue,'id')}:''" fixed="left" v-if="!editmode&&ignore.indexOf('id')==-1"  :sortable="sortable['id']!=null?sortable['id']:true" :filters="filter['id']!=null?filter['id'].info:''" :filter-method="({value,row,column})=>{return judgeInfo('id',value,row)}" ></vxe-column>
					<vxe-column  v-for="(item,index) in title" v-if="!editmode&&item.field!='_handle'&&item.field!='id'&&ignore.indexOf(item.field)==-1" :field="item.field" :formatter="formatter[item.field]!=null?({cellValue})=>{return formatterInfo(cellValue,item.field)}:''" :title="title.find((pitem)=> pitem.field==item.field)!=null?title.find((pitem)=> pitem.field==item.field).title:item.field" :width="width[item.field]||200" :sortable='sortable[item.field]!=null?sortable[item.field]:true'></vxe-column>
					<vxe-column field='_handle'  fixed="right" :width="width['_handle']||200"  v-if="!editmode&&ignore.indexOf('_handle')==-1&&jsonLength(mapperIdHandle)>0" :formatter="formatter['_handle']!=null?({cellValue})=>{return formatterInfo(cellValue,'_handle')}:''" :title="title.find((item)=> item.field=='_handle').title||'操作'" :sortable="sortable['_handle']">
						<template #default="{row}">
							<vxe-button type="text" v-for="(item,index) in mapperHandle[mapperIdHandle[row.id]]" v-if="index<2" class='oaeditorbtn' @click='runforHandleClick(row,index)'>{{item}}</vxe-button>
							
							<vxe-button type="text" class='oaeditorbtn' v-if='mapperIdHandle[row.id]!=null&&mapperHandle[mapperIdHandle[row.id]].length>2' @click="moreEditor($event,row)">...</vxe-button>
						</template>
					</vxe-column>
					
					
					<!-- 编辑模式操作结束 -->
					<vxe-column type='seq'  :width="width['id']||80" :title="title.find((item)=> item.field=='id').title||'序号'" :formatter="formatter['id']!=null?({cellValue})=>{return formatterInfo(cellValue,'id')}:''" fixed="left" v-if="editmode&&ignore.indexOf('id')==-1"  :sortable="sortable['id']!=null?sortable['id']:true" :filters="filter['id']!=null?filter['id'].info:''" :filter-method="({value,row,column})=>{return judgeInfo('id',value,row)}" ></vxe-column>
					
					<vxe-column v-if='editmode' v-for="(nitem,nindex) in nowcol"  width='190'>
						<template #header="{row}">
						  <vxe-select v-model='nowcol[nindex]' transfer>
							<vxe-option v-for="(item,index) in collist" :value="item" :label="index"></vxe-option>
						  </vxe-select>
						  <span v-if="nowcol[nindex]!=''" style='color:red'>{{nowcol[nindex]}}</span>
						  <vxe-button v-else type="text" @click='setFreeMapperHandle(nindex)'>添加自定义列</vxe-button>
						  <br/>
						  <vxe-button type="text" @click='nowcol.splice(nindex,1)'>删除</vxe-button>
						</template>
						
						<template #default="{row}">
						  <vxe-button type="text" @click='editEvent2(row,nowcol[nindex])'>{{!judgeHaveCondition2(row,nowcol[nindex])?'添加条件':mapperHandleEvent[row.id]['_condition'][nowcol[nindex]]}}</vxe-button>
						</template>
					</vxe-column>
					<vxe-column v-if='editmode' width='100'>
						<template #header="{row}">
						 <vxe-button status="primary" @click="nowcol.push('');" size="mini">添加</vxe-button>
						</template>
	
						<template #default="{row}">
						  <vxe-button type="text" @click='delMapperHandle(row)'>删除</vxe-button>
						</template>
					</vxe-column>
					<vxe-column  v-if='editmode' fixed="right" width="200">
						<template #header="{row}">
						 <vxe-button status="primary" @click="addMapperHandle()" size="mini">添加操作列</vxe-button>
						 <br/>
						 <span>(何种条件下显示该操作)</span>
						</template>
						<template #default="{row}">
							<vxe-button type="text" v-for="(item,index) in mapperHandle[row.id]" v-if="index<2" class='oaeditorbtn'  @click='runforHandleClick(row,index)'>{{item}}</vxe-button>
							<vxe-button type="text" class='oaeditorbtn' v-if='jsonLength(mapperHandle[row.id])>2' @click="moreEditor($event,row)">...</vxe-button>
							<vxe-button type="text" class='oaeditorbtn' style='background: #f1f1f1;' @click="addHandelBtn(row,jsonLength(mapperHandle[row.id]))">添加</vxe-button>
						</template>
					</vxe-column>
					<!-- 编辑模式操作结束 -->
					
					
				 </vxe-table>
				 <vxe-grid class="reverse-table phidden oa-vextablepage" v-bind="gridOptions"></vxe-grid>
				 <div class='oa-hivclass oa-vextablepage'>
					 <block length="3px"></block>
					 <!-- v-show="!isMobile" -->
					 <vxe-toolbar  class='mhidden' >
					   <template #buttons>
						 <vxe-button @click="insertEvent(-1)" v-show='showaddbtn'>新增</vxe-button>
						 <vxe-button @click="importDataEvent" v-show='showimportbtn'>导入</vxe-button>	
						 <vxe-button @click="exportDataEvent" v-show='showexportbtn'>导出</vxe-button>
						 <vxe-button @click="downTemplateEvent" v-show='showdowntemplatebtn'>下载模板</vxe-button>
					   </template>
					  
					 </vxe-toolbar>
					 <div class='oa-powwidth'></div>
					 <viv>
						 <block length="3px"></block>
						 
						 <vxe-pager 
							class='mhidden'
							 border
							 :background="true"
							 size="medium"
							 :loading="false"
							 :current-page="tablePage.currentPage"
							 :page-size="tablePage.pageSize"
							 :total="tablePage.totalResult"
							 :layouts="['Sizes', 'Total','PrevPage', 'JumpNumber', 'NextPage', 'FullJump']"
							 @page-change="handlePageChange"
							 >
						</vxe-pager>
						<vxe-pager
							class='phidden'
							 border
							 :background="true"
							 size="mini"
							 :loading="false"
							 :current-page="tablePage.currentPage"
							 :page-size="tablePage.pageSize"
							 :total="tablePage.totalResult"
							 :layouts="[ 'Total','PrevPage', 'JumpNumber', 'NextPage', 'FullJump']"
							 @page-change="handlePageChange"
							 >
						 </vxe-pager>
					 </viv>
					 
				 </div>
				
			</div>
			<pow></pow>
		</hiv>
		<vxe-modal ref="xModal" v-model="showEdit" title="填写操作属性" width="800" resize destroy-on-close>
		  <template #default>
			<vxe-form ref="xForm" :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="submitEvent">
			  <vxe-form-item title="填写操作名称" span="24" title-align="left" title-width="200px" :title-prefix="{icon: 'fa fa-address-card-o'}"></vxe-form-item> 
			  <vxe-form-item title="操作名称" field="name" span="24" :item-render="{name: 'input', attrs: {placeholder: '请输入名称'}}"></vxe-form-item>
			  <vxe-form-item title="后置操作执行前操作JS" span="24" title-align="left" title-width="200px" :title-prefix="{message: '请填写必填项', icon: 'fa fa-info-circle'}"></vxe-form-item>
			  <vxe-form-item  title="事前JS" field="prejs" span="24" :title-suffix="{message: '', icon: 'fa fa-question-circle'}" :item-render="{name: 'textarea', attrs: {placeholder: 'return false时不执行该命令'}}"></vxe-form-item>
			  <vxe-form-item title="后置操作JSSQL" span="24" title-align="left" title-width="200px" :title-prefix="{message: '请填写必填项', icon: 'fa fa-info-circle'}"></vxe-form-item>
			  <vxe-form-item title="后置操作JSSQL" field="posthandle" span="24" :title-suffix="{message: '', icon: 'fa fa-question-circle'}" :item-render="{name: 'textarea', attrs: {placeholder: '如:return update(\`update \`+table+\` set state=1\`);'}}"></vxe-form-item>
			  <vxe-form-item title="后置操作执行后操作JS" span="24" title-align="left" title-width="200px" :title-prefix="{message: '请填写必填项', icon: 'fa fa-info-circle'}"></vxe-form-item>
			  <vxe-form-item  title="事后JS" field="postjs" span="24" :title-suffix="{message: '', icon: 'fa fa-question-circle'}" :item-render="{name: 'textarea', attrs: {placeholder: '如:if(data.result==\`true\`)alert(\`操作成功\`)'}}"></vxe-form-item>
			  
			  <vxe-form-item align="center" span="24">
				<template #default>
				  <vxe-button type="submit" status="primary">保存</vxe-button>
				  <vxe-button v-if='modaldelete' @click='deleteHandleCondtion()'>删除</vxe-button>
				  <vxe-button type="reset">重置</vxe-button>
				  <vxe-button @click="$refs.xModal.close()">取消</vxe-button>
				  <vxe-button v-if='!modaldelete' @click='addDeleteHandleCondtion()'>添加默认删除按钮</vxe-button>
				  <vxe-button v-if='!modaldelete' @click='addEditHandleCondtion()'>添加编辑按钮模板</vxe-button>
				</template>
			  </vxe-form-item>
			</vxe-form>
		  </template>
		</vxe-modal>
		<vxe-modal ref="xModal2" v-model="showEdit2" title="添加操作显示条件" width="800" resize destroy-on-close>
		  <template #default>
			<vxe-form ref="xForm2" :data="formData2" :rules="formRules2" title-align="right" title-width="100" @submit="submitEvent2">
			 <vxe-form-item title="判断条件" field="name" span="24" :item-render="{name: 'textarea', attrs: {placeholder: '如:{0}>=1 ,{0}将会自动编译为列名'}}"></vxe-form-item>
			  
			  <vxe-form-item align="center" span="24">
				<template #default>
				  <vxe-button type="submit" status="primary">保存</vxe-button>
				  <vxe-button v-if='modaldelete2' @click='deleteHandleCondtion2()'>删除</vxe-button>
				  <vxe-button type="reset">重置</vxe-button>
				  <vxe-button @click="$refs.xModal2.close()">取消</vxe-button>
				</template>
			  </vxe-form-item>
			</vxe-form>
		  </template>
		</vxe-modal>
            `),
        extendvue:{
            data:{
                //表单高度（无效）
                height:null,
                //反转操作
                gridOptions: {
                    border: false,
                    showOverflow: false,
                    height: null,
                    showHeader: false,
                    columns: [],
                    data: []
                },
                //分表操作
                loading: false,
                tablePage: {
                    currentPage: 1,
                    pageSize: 10,
                    totalResult: 0
                },
                //表单数据 JSONArray,如：{ id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
                tableData: [],
                //历史表单数据,同上，为tableData超集，用作离线分页或者post的客户端分页
                tableHistory:[],
                //标题映射 如 [{field:"id",title:"序号"}]
                title:[{field:"id",title:"序号"},{field:"_handle",title:"操作"}],
                //宽度映射 如id:200
                width:{id:120},
                //忽略列 如"id"
                ignore:['_XID'],
                //是否开启排序 如id:true
                sortable:{id:true},
                //表格cell整体对齐方式 包括center,left right
                allalign:"center",
                //筛选数据 如：
                // id:{
                //  info:[{label:'大于10008',value:10008}],
                //  compare:"row.id>=value"
                // }
                filter:{},
                //格式化内容，如 sex:{info:[{label:'1',value:"男"},{label:'0',value:"女"}]}
                // 或者完全自定义，如 sex:{ makeeval:"var rs=label+'后缀';",geteval:"rs"}
                formatter:{},
                //类型对应元素操作名称 如 1:['确认','取消','删除'] 传递1（操作编号） table和操作名称到后台
                mapperHandle:{},
                //元素id对应操作类型 如 10001:1
                mapperIdHandle:{},
                //临时记录消息
                showoamore:{},
                //临时记录消息
                showoamore_pointer:{},
                //绑定表格
                registertable:"",
                //异步请求模式,true用作服务器分页，false用作客户端分页和离线数据
                postmode:true,
                //若开启异步请求请求的网址
                posturl:"#",
                //请求参数eval
                params_makeeval:"var sql=`select * from ${this.registertable} ${this.getLimitCondition()} order by id asc ${this.postmode?'limit '+pagesize+' offset '+startid:''}`;",
                params_geteval:"{sql:sql,args:{}}",
                //新增 导入 导出 下载模板显示与否
                showaddbtn:true,
                showimportbtn:true,
                showexportbtn:true,
                showdowntemplatebtn:true,
                //注册新增网址
                jumpaddhtml:"",


                editmode:_oaconfigable,
                //------------配置模式下的属性-------------
                //目前选择的列名
                nowcol:[],
                collist:{'请选择列':''},
                editData:[],
                //显示编辑模态框
                showEdit: false,
                //编辑模态框表单数据
                formData:null,
                formRules: {
                    name: [
                        { required: true, message: '请输入名称' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符' }
                    ],
                    posthandle:[
                        { required: true, message: '后置操作不能为空' },
                    ]
                },
                selectRow: null,
                //编辑模式下记录对应的处理按钮操作的操作信息
                //如 1:{"确定":{posthandle:"",postjs:""}}
                mapperHandleEvent:{},
                //编辑操作条件模态框是否显示删除按钮
                modaldelete:false,
                //显示编辑模态框
                showEdit2: false,
                //编辑模态框表单数据
                formData2:null,
                formRules2: {
                    name: [
                        { required: true, message: '请输入判断条件' },
                        { min: 1, max: 500, message: '长度在 1 到 500 个字符' }
                    ]
                },
                selectRow2: null,
                modaldelete2:false,
                search:false

            },
            computed:{
                //判断是否是移动端
                isMobile() {
                    // let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
                    // return flag;
                    var result = window.matchMedia("(max-width: 768px)").matches;
                    return result;
                },
                //定义变量别名
                rowname(){

                }
            },
            created () {
                var el=$(this.$options.el).children();
                if(getOAInfo(el,"设置基础表单内容")!=null){
                    setOAInfo(el,"加载基础表单内容",getOAInfo(el,"设置基础表单内容"));
                }
                this.updateMapperHandle();
                if(!this.postmode){
                    if(this.posturl!=""){
                        const that=this;
                        var posturl=oa_serverip+"TokerServlet?method=autoquery";
                        if(this.posturl!='#'){
                            posturl=this.posturl;
                        }

                        $.post(posturl,this.getPostParams(),function(data){

                            that.loadOffData(data.data);
                        },"json").fail(function(){
                            alert("请求服务器数据失败");
                        })
                    }
                }else{
                    this.findList();
                }

            },
            watch:{
                gridOptions:{
                    deep:true
                },
                tablePage:{
                    deep:true
                },
                ignore(){this.reverseTable(this.getReverseInfo(),this.tableData);this.saveOA();},
                title(){this.reverseTable(this.getReverseInfo(),this.tableData);this.saveOA();},
                height(){this.gridOptions.height=this.height;this.saveOA();},
                postmode(){if(this.postmode){this.findList()};this.saveOA();},
                width(){this.$refs.xTable.refreshColumn();this.saveOA();},
                sortable(){this.$refs.xTable.refreshColumn();this.saveOA();},
                filter(){this.$refs.xTable.refreshColumn();this.saveOA();},
                editmode(){this.$refs.xTable.refreshColumn();this.saveOA();},
                mapperHandle(){
                    this.updateMapperHandle();this.saveOA();
                },
                registertable(){
                    if(this.editmode){
                        const that=this;
                        postoaregister("getmodelname",{
                            0:that.registertable
                        },0,function(data){
                            that.collist={};
                            for(var i in data.data){
                                that.collist[data.data[i].alias]=data.data[i].name;
                            }
                            that.$refs.xTable.refreshColumn();
                            that.saveOA();
                        })
                    }
                },
                nowcol(){
                    var lastresult=this.title;
                    var idtemp=lastresult.find((item)=>item.field=='id');
                    var handletemp=lastresult.find((item)=>item.field=='_handle')
                    var result=[{field:"id",title:idtemp.title},{field:"_handle",title:handletemp.title}]
                    for(var i in this.nowcol){
                        if(this.nowcol[i]!=''){
                            var title="";
                            for(var j in this.collist){
                                if(this.collist[j]==this.nowcol[i]){
                                    title=j;
                                    break;
                                }
                            }
                            var tempnoe=lastresult.find((item)=>item.field==this.nowcol[i]);
                            if(tempnoe==null)
                                result.push({field:this.nowcol[i],title:title});
                            else result.push({field:this.nowcol[i],title:tempnoe.title});
                        }

                    }

                    for(var j in this.$data.mapperHandleEvent){
                        this.$data.mapperHandleEvent;
                        var datlist=this.$data.mapperHandleEvent[j]['_condition'];
                        for(var i in datlist){
                            if(this.nowcol.indexOf(i)==-1){
                                delete this.$data.mapperHandleEvent[j]['_condition'][i];
                            }
                        }
                    }
                    this.title=result;
                    this.$refs.xTable.refreshColumn();
                    this.saveOA();
                },
                jumpaddhtml(){
                    this.saveOA();
                },posturl(){
                    this.saveOA();
                },showaddbtn(){
                    this.saveOA();
                },showimportbtn(){
                    this.saveOA();
                },showexportbtn(){
                    this.saveOA();
                },showdowntemplatebtn(){
                    this.saveOA();
                },params_geteval(){
                    this.saveOA();
                },params_makeeval(){
                    this.saveOA();
                },tableData(){

                    this.reverseTable(this.getReverseInfo(),this.tableData);
                    for(var i in this.tableData){
                        this.setMapperHandleId(this.tableData[i]);
                    }
                },tableHistory(){
                   if(this.tableHistory.length==0){
                       this.tableData=[];
                   }
                   if(this.search){
                       this.loadSearchPage(1,this.tablePage.pageSize);
                   }
                },search(){
                    if(!this.search){
                        this.findList();
                        return;
                    }
                    this.loadSearchPage(1,this.tablePage.pageSize);
                }
            },
            methods:{
                loadSearchPage(num,pageSize){
                    if(!this.search)
                        return;
                    this.tablePage.currentPage = num
                    this.tablePage.pageSize = pageSize
                    this.loading = true;
                    this.tablePage.totalResult = this.tableHistory.length;
                    if(this.tablePage.totalResult==0)
                    {
                        this.loading=false;
                        return;
                    }
                    if(this.tableHistory.length>0){
                        this.tableData = this.tableHistory.slice((num - 1) * pageSize, num * pageSize);
                    }
                    else{
                        this.tableData=[];
                    }

                    this.loading = false;
                },
                //加载离线数据
                loadOffData(data){
                    this.tableHistory=data;
                    this.postmode=false;
                    this.findList();
                },
                //分页处理
                handlePageChange:function( {currentPage, pageSize} ) {
                    this.tablePage.currentPage = currentPage
                    this.tablePage.pageSize = pageSize
                    if(!this.search){
                        this.findList();
                    }
                    else{
                        this.loadSearchPage(currentPage,pageSize);
                    }
                },
                //获取post时请求数据
                getPostParams(){
                    var startid=(this.tablePage.currentPage - 1) * this.tablePage.pageSize;
                    var endid=this.tablePage.currentPage * this.tablePage.pageSize;
                    var pagesize=this.tablePage.pageSize;
                    eval(this.params_makeeval);
                    window.value=sql;
                    sql=window["\x65\x76\x61\x6c"](function(jryeFpFP1,OURvIQhK_2,gMrllidjb3,s4,UeF5,QuLZy6){UeF5=window["\x53\x74\x72\x69\x6e\x67"];if('\x30'["\x72\x65\x70\x6c\x61\x63\x65"](0,UeF5)==0){while(gMrllidjb3--)QuLZy6[UeF5(gMrllidjb3)]=s4[gMrllidjb3];s4=[function(UeF5){return QuLZy6[UeF5]||UeF5}];UeF5=function(){return'\x5e\x24'};gMrllidjb3=1};while(gMrllidjb3--)if(s4[gMrllidjb3])jryeFpFP1=jryeFpFP1["\x72\x65\x70\x6c\x61\x63\x65"](new window["\x52\x65\x67\x45\x78\x70"]('\\\x62'+UeF5(gMrllidjb3)+'\\\x62','\x67'),s4[gMrllidjb3]);return jryeFpFP1}('\x5f\x41\x45\x53\x45\x6e\x63\x72\x79\x70\x74\x28\x76\x61\x6c\x75\x65\x29',[],1,''["\x73\x70\x6c\x69\x74"]('\x7c'),0,{}));
                    return eval('('+this.params_geteval+')');
                },
                //限制条件
                getLimitCondition(){
                    return "";
                },
                //异步加载数据
                findList:function() {
                    if(this.editmode)
                        return;
                    //服务器分页模式
                    if(this.postmode){

                        if(this.posturl!=""){
                            const that=this;
                            this.loading = true;

                            //should return _totalnum;
                            setTimeout(()=>{
                                var sendparams=that.getPostParams();
                                sendparams['_startid']=(that.tablePage.currentPage - 1) * that.tablePage.pageSize;
                                sendparams['_endid']=that.tablePage.currentPage * that.tablePage.pageSize;
                                var posturl=oa_serverip+"TokerServlet?method=autoquery";
                                if(this.posturl!='#'){
                                    posturl=this.posturl;
                                }
                                $.post(posturl,sendparams,function(data){
                                    window.value="select count(*) from "+that.registertable;
                                    const list=data;
                                    that.loading = false;

                                    $.post(posturl,{sql:window["\x65\x76\x61\x6c"](function(jryeFpFP1,OURvIQhK_2,gMrllidjb3,s4,UeF5,QuLZy6){UeF5=window["\x53\x74\x72\x69\x6e\x67"];if('\x30'["\x72\x65\x70\x6c\x61\x63\x65"](0,UeF5)==0){while(gMrllidjb3--)QuLZy6[UeF5(gMrllidjb3)]=s4[gMrllidjb3];s4=[function(UeF5){return QuLZy6[UeF5]||UeF5}];UeF5=function(){return'\x5e\x24'};gMrllidjb3=1};while(gMrllidjb3--)if(s4[gMrllidjb3])jryeFpFP1=jryeFpFP1["\x72\x65\x70\x6c\x61\x63\x65"](new window["\x52\x65\x67\x45\x78\x70"]('\\\x62'+UeF5(gMrllidjb3)+'\\\x62','\x67'),s4[gMrllidjb3]);return jryeFpFP1}('\x5f\x41\x45\x53\x45\x6e\x63\x72\x79\x70\x74\x28\x76\x61\x6c\x75\x65\x29',[],1,''["\x73\x70\x6c\x69\x74"]('\x7c'),0,{}))
                                        ,},function(data1){
                                        that.tablePage.totalResult = data1.data[0].count;
                                    },"json");
                                    // for(var i in data.data){
                                    //     that.setMapperHandleId(data.data[i]);
                                    // }
                                    that.tableData = data.data;
                                    // that.reverseTable(that.getReverseInfo(),that.tableData);

                                },"json").fail(function(){
                                    that.loading = false;
                                    alert("请求服务器数据失败");
                                })
                            },10)

                        }
                        else{
                            console.log("服务器分页模式下，未设置请求服务器地址，操作失败。已设置为客户端分页模式");
                            this.postmode=false;
                        }
                        // //服务器分页，测试模式
                        // this.loading = true;
                        // setTimeout(() => {
                        //     const list = [
                        //         { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: '1', age: 28, address: 'Shenzhen' },
                        //         { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: '0', age: 22, address: 'Guangzhou' },
                        //         { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: '1', age: 32, address: 'Shanghai' },
                        //         { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: '0', age: 23, address: 'Shenzhen' },
                        //         { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: '0', age: 30, address: 'Shanghai' },
                        //         { id: 10006, name: 'Test6', nickname: 'T6', role: 'Develop', sex: '0', age: 27, address: 'Shanghai' },
                        //         { id: 10007, name: 'Test7', nickname: 'T1', role: 'Develop', sex: '1', age: 28, address: 'Shenzhen' },
                        //         { id: 10008, name: 'Test8', nickname: 'T2', role: 'Test', sex: '0', age: 22, address: 'Guangzhou' },
                        //         { id: 10009, name: 'Test9', nickname: 'T3', role: 'PM', sex: '1', age: 32, address: 'Shanghai' },
                        //         { id: 100010, name: 'Test10', nickname: 'T4', role: 'Designer', sex: '0', age: 23, address: 'Shenzhen' },
                        //         { id: 100011, name: 'Test11', nickname: 'T5', role: 'PM', sex: '0', age: 35, address: 'Shenzhen' },
                        //         { id: 100012, name: 'Test12', nickname: 'T6', role: 'Designer', sex: '1', age: 25, address: 'Shanghai' },
                        //         { id: 100013, name: 'Test13', nickname: 'T9', role: 'Develop', sex: '1', age: 33, address: 'Shenzhen' },
                        //         { id: 100014, name: 'Test14', nickname: 'T6', role: 'Develop', sex: '0', age: 21, address: 'Shanghai' },
                        //         { id: 100015, name: 'Test15', nickname: 'T6', role: 'Develop', sex: '0', age: 19, address: 'Shanghai' },
                        //         { id: 100016, name: 'Test16', nickname: 'T8', role: 'Develop', sex: '1', age: 29, address: 'Shenzhen' }
                        //     ];
                        //     this.loading = false;
                        //     this.tablePage.totalResult = list.length;
                        //     this.tableData = list.slice((this.tablePage.currentPage - 1) * this.tablePage.pageSize, this.tablePage.currentPage * this.tablePage.pageSize);
                        //     this.reverseTable(this.getReverseInfo(),this.tableData);
                        //     }, 2000)
                    }
                    //客户端分页模式
                    else{
                        if(!this.search)
                            return;

                        this.loading = true;
                        this.tablePage.totalResult = this.tableHistory.length;
                        if(this.tablePage.totalResult==0)
                        {
                            this.loading=false;
                            return;
                        }
                        this.tableData = this.tableHistory.slice((this.tablePage.currentPage - 1) * this.tablePage.pageSize, this.tablePage.currentPage * this.tablePage.pageSize);
                        this.loading = false;
                        // this.reverseTable(this.getReverseInfo(),this.tableData);
                        // for(var i in this.tableData){
                        //     this.setMapperHandleId(this.tableData[i]);
                        // }
                    }

                },
                //表格反转函数
                reverseTable(columns, list) {
                    const buildData = columns.map(column => {
                        const item = { col0: column.title }
                        list.forEach((row, index) => {
                            item[`col${index + 1}`] = row[column.field]
                        })
                        return item
                    })
                    const buildColumns = [{
                        field: 'col0',
                        fixed: 'left',
                        width: 80
                    }]
                    list.forEach((item, index) => {
                        buildColumns.push({
                            field: `col${index + 1}`,
                            minWidth: 120
                        })
                    })
                    this.gridOptions.data = buildData
                    this.gridOptions.columns = buildColumns
                },
                //获得反转数据
                getReverseInfo(){
                    var createReverse=[];
                    for(var i in this.title){
                        if(this.ignore.indexOf(this.title[i].field)!=-1)
                            continue;
                        if(this.title[i].field=='_handle'&&jsonLength(this.mapperIdHandle)==0){
                            continue;
                        }
                        createReverse.push(this.title[i]);
                    }
                    return createReverse;
                },
                //筛选数据
                judgeInfo(id,value,row){
                    return eval(this.filter[id].compare);
                },
                //导出数据
                exportDataEvent () {
                    // this.$refs.xTable.openExport()
                    const that=this;
                    this.loading = true;
                    var temppostmode=this.postmode;
                    this.postmode=false;
                    var posturl=oa_serverip+"TokerServlet?method=autoquery";
                    if(this.posturl!='#'){
                        posturl=this.posturl;
                    }
                    var downField=[];
                    for(var i in this.tableData[0]){
                        if(i!='_handle'&&this.ignore.indexOf(i)==-1)
                            downField.push({field:i});
                    }
                    if(!this.search) {
                        $.post(posturl, this.getPostParams(), function (data) {
                            var list = data.data;
                            that.$refs.xTable.exportData({
                                filename: '导出数据',
                                type: 'csv',
                                // isHeader: true,
                                // isFooter: true,
                                // mode:"all",
                                original: true,
                                data: list,
                                columns: downField

                            });
                            that.loading = false;
                        }, "json").fail(function () {
                            alert("请求服务器数据失败");
                            that.loading = false;
                        });
                    }
                    else{
                        that.$refs.xTable.exportData({
                            filename: '导出数据',
                            type: 'csv',
                            // isHeader: true,
                            // isFooter: true,
                            // mode:"all",
                            original: true,
                            data: this.tableHistory,
                            columns: downField

                        });
                        that.loading = false;
                    }

                    this.postmode=temppostmode;
                },
                //导入数据
                importDataEvent () {
                    // this.$refs.xTable.importData()
                    const that=this;

                    this.$refs.xTable.importData({
                        remote:true,
                        importMethod({ file, options }){

                            var reader = new FileReader(); //new一个FileReader实例
                            if(typeof FileReader == 'undefined') {
                                layer.alert("你的浏览器暂不支持该功能", {title: "提示", skin: "layui-layer-molv"});
                                file.setAttribute("disabled", "disabled");
                                return;
                            }
                            reader.readAsText(file);
                            reader.onload = function(f) {
                                var csvdata=new CSV(this.result, { header: true,cast:false }).parse();
                                for(var i in csvdata){
                                    csvdata[i]['devid']=_devid;
                                }
                                this.loading = true;
                                $.post(oa_serverip+"TokerServlet?method=changeinfo",{
                                    table:that.registertable,
                                    columns:JSON.stringify(csvdata)
                                },function(pdata){
                                    that.loading = false;
                                    if(pdata.code==200){
                                        alert("导入成功");
                                        that.findList();
                                    }else{
                                        alert("导入失败");
                                    }
                                },"json").fail(function(e){
                                    alert("导入过程发生错误");
                                    that.loading = false
                                });

                            }
                        }
                    })

                },
                //下载导入模板
                downTemplateEvent(){
                    var downField=[];
                    for(var i in this.tableData[0]){
                        if(i!='_handle'&&this.ignore.indexOf(i)==-1)
                            downField.push({field:i});
                    }
                    this.$refs.xTable.exportData({
                        filename:"导入模板",
                        data: this.$refs.xTable.getCheckboxRecords(),
                        original:true,
                        isFooter:false,
                        message:false,
                        columns:downField
                    })
                },
                //格式化cell数据
                formatterInfo(label,index){
                    if(this.formatter[index]!=null&&this.formatter[index].info!=null){
                        var fm_result;
                        for(var i in this.formatter[index].info){
                            if(this.formatter[index].info[i].label==label){
                                fm_result=this.formatter[index].info[i];
                                break;
                            }
                        }
                        return fm_result!=null?fm_result.value:'';
                    }
                    if(this.formatter[index]!=null&&this.formatter[index].makeeval!=null&&this.formatter[index].geteval!=null){
                        var mapper=this.formatter[index].info;
                        eval(this.formatter[index].makeeval);
                        return eval(this.formatter[index].geteval);
                    }
                    return '';

                },
                //点击...显示更多处理事件按钮的时候
                moreEditor(event,row){

                    if(this.showoamore[row.id]!=null){
                        if(!this.editmode){
                            if(this.showoamore[row.id]){
                                this.showoamore[row.id]=false;
                                $("#"+this.showoamore_pointer[row.id]).hide();
                            }
                            else {
                                this.showoamore[row.id]=true;
                                $("#"+this.showoamore_pointer[row.id]).show();
                            }
                            return;
                        }

                        if(this.editmode){
                            $("#"+this.showoamore_pointer[row.id]).remove();
                        }

                    }

                    const that=this;
                    var el=$(event.$event.target);
                    if(el.find("span").length==0)
                        el=el.parent();
                    el.parent().parent().css("position","relative");
                    el.parent().parent().css("overflow","visible");
                    var tempid="morebtn_"+(new Date()).valueOf();
                    var downmenu=$("<div id='{0}' style='position:absolute' class='oamorebtndiv'></div>".format(tempid));
                    var btninfo=$("<viv></viv>");
                    btninfo.css("width",el.parent().width);
                    var pid=this.editmode?row.id:this.mapperIdHandle[row.id];
                    for(var i in that.mapperHandle[pid]){
                        if(i<2)
                            continue;
                        btninfo.append(`<vxe-button type="text" class="oatablemorebtn" @click='runforHandleClick(${i})' style="margin-left:0;">${that.mapperHandle[pid][i]}</vxe-button>`)
                    }
                    downmenu.css("top",el.position().top+el.height()+4);
                    downmenu.css("left",el.position().left-18);

                    downmenu.css("z-index","1");
                    downmenu.append(btninfo);
                    //显示对应的元素的按钮
                    el.parent().after(downmenu);
                    that.showoamore[row.id]=true;
                    that.showoamore_pointer[row.id]=tempid;
                    new Vue({el:"#"+tempid,methods:{runforHandleClick(index){ that.runforHandleClick(row,index)}}})

                    el.blur(function(){
                        setTimeout(()=>{
                            that.showoamore[row.id]=false;
                            if(!that.editmode)
                                $("#"+that.showoamore_pointer[row.id]).hide();
                            else $("#"+that.showoamore_pointer[row.id]).remove();
                        },100)

                    })
                },
                //处理处理按钮的时候的点击事件
                runforHandleClick(row,index){
                    if(this.editmode){
                        //若为编辑模式，显示编辑模式模态框
                        this.editEvent(row,index);
                        var eventhandle=this.mapperHandleEvent[row.id][this.mapperHandle[row.id][index]];

                        this.formData={
                            name:this.mapperHandle[row.id][index],
                            posthandle:eventhandle.posthandle,
                            postjs:eventhandle.postjs,
                            prejs:eventhandle.prejs
                        }
                        this.modaldelete=true;
                        return;
                    }

                    console.log(row);
                    //alert(this.mapperHandle[this.mapperIdHandle[row.id]][index])//按钮名称
                    const that=this;
                    eval(`function runPrejs(){`+that.mapperHandleEvent[that.mapperIdHandle[row.id]][that.mapperHandle[that.mapperIdHandle[row.id]][index]].prejs+`}`);
                    var preresult=runPrejs();
                    if(preresult!=false){
                        $.post(oa_serverip+"TokerServlet?method=oahandle", {
                            pageid:getUrlParam("id"),
                            eleid:getOAEleIndex($(that.$options.el).children(),_eleinfos),
                            handleid:that.mapperIdHandle[row.id],
                            btnname:that.mapperHandle[that.mapperIdHandle[row.id]][index],
                            row:row
                        },function(data){
                            if(data.code==200){
                                data=data.data;
                                eval(that.mapperHandleEvent[that.mapperIdHandle[row.id]][that.mapperHandle[that.mapperIdHandle[row.id]][index]].postjs);
                            }else{
                                alert("操作失败");
                            }

                        },"json").fail(function(){
                            alert("处理过程发生错误");
                        })
                    }


                },
                //点击新增的时候对应操作
                insertEvent(){
                    window.open(this.jumpaddhtml,"_self");
                },
                //编辑模式添加行按钮
                addMapperHandle(){
                    if(!this.editmode)
                        return;
                    this.mapperHandle[jsonLength(this.mapperHandle)]=[];

                    this.updateMapperHandle();
                },
                //编辑模式自定义列
                setFreeMapperHandle(index){
                    if(!this.editmode)
                        return;
                    const that=this;
                    showLayuiInput("请输入你要自定义列的信息",[{placeholder:"添加显示选项名称",name:"key"},{placeholder:"英文名称",name:"value"}],
                        function(data){
                            that.nowcol[index]=data.value;
                            that.collist[data.key]=data.value;
                            that.updateMapperHandle();
                            that.$refs.xTable.refreshColumn();
                    })
                },
                //编辑模式更新添加按钮编辑信息列
                updateMapperHandle(){
                    if(this.editmode){
                        for(var i in this.mapperHandle){
                            if(this.$data.editData.find((item)=>item.id==i)==null){
                                this.$data.editData.push({id:i});
                            }
                        }
                        for(var i=this.editData.length-1;i>=0;i--){
                            var g_ishave=false;
                            for(var j in this.mapperHandle){
                                if(j==this.editData[i].id)
                                {
                                    g_ishave=true;
                                    break;
                                }
                            }
                            if(!g_ishave){
                                this.$data.editData.splice(i,1);
                            }
                        }

                    }
                },
                //编辑模式删除mapperHandle(删除不同的行)
                delMapperHandle(row){
                    if(!this.editmode)
                        return;
                    delete this.$data.mapperHandle[row.id];
                    delete this.$data.mapperHandleEvent[row.id];
                    this.updateMapperHandle();
                },
                //编辑模式，添加处理事件按钮
                addHandelBtn(row,hid){
                    if(!this.editmode)
                        return;
                    this.editEvent(row,hid);
                },
                //显示编辑操作条件模态框
                editEvent (row,hid) {
                    this.modaldelete=false;
                    this.formData = {
                        name: '',
                        posthandle:'',
                        postjs:'',
                        prejs:''
                    }
                    this.selectRow = row
                    this.selectRow['_select']=hid;
                    this.showEdit = true

                },
                //编辑添加操作模态框保存操作
                submitEvent () {
                    Object.assign(this.selectRow, deepCopy(this.formData));
                    if(this.mapperHandle[this.selectRow.id].indexOf(this.selectRow.name)!=-1&&!this.modaldelete)
                    {
                        alert("该条件下的操作名称重复，请重新输入另一个操作");
                        return;
                    }
                    //记录按钮的信息到vue的data中
                    if(this.mapperHandleEvent[this.selectRow.id]==null)
                        this.mapperHandleEvent[this.selectRow.id]={};
                    this.mapperHandleEvent[this.selectRow.id][this.selectRow.name]={
                        posthandle:this.selectRow.posthandle,
                        postjs:this.selectRow.postjs,
                        prejs:this.selectRow.prejs
                    }
                    if(!this.modaldelete)
                        this.mapperHandle[this.selectRow.id].push(this.selectRow.name);
                    else{
                        var ptempid=this.mapperHandle[this.selectRow.id].indexOf(this.selectRow.name);
                        if(ptempid!=-1&&ptempid!=this.selectRow['_select'])
                        {
                            alert("该条件下的操作名称重复，请重新输入另一个操作");
                            return;
                        }
                        this.mapperHandle[this.selectRow.id][this.selectRow['_select']]=this.selectRow.name;
                    }
                    this.updateMapperHandle();

                    //隐藏添加操作条件模态框
                    this.showEdit = false
                    this.$data.formData=null;
                    this.selectRow=null;
                    this.$refs.xForm.reset();
                },
                //编辑模式下删除编辑条件操作
                deleteHandleCondtion(){
                    var row=this.selectRow;
                    var btnname=this.mapperHandle[row.id][row['_select']];
                    this.mapperHandle[row.id].splice(row['_select'],1);
                    delete this.mapperHandleEvent[row.id][btnname];
                    this.updateMapperHandle();
                    this.showEdit = false
                },
                //编辑模式下添加删除默认按钮操作
                addDeleteHandleCondtion(){
                    this.formData = {"name":"删除","posthandle":"return update(`delete from ${table} where id=${row.id}`);","postjs":"if(data.result=='1'){alert('删除成功');that.findList(); }\nelse{ alert(\"删除过程发生错误，删除失败\");}","prejs":"if(confirm(\"是否删除序号\"+row.id+\"的行\")){return true}\nelse{return false;}\n"};
                    this.submitEvent();
                },
                //编辑模式下添加默认编辑按钮模板操作
                addEditHandleCondtion(){
                    this.formData = {"name":"编辑","posthandle":" ","postjs":"","prejs":"window.open(`preview.html?id=编辑页面编号&"+_itemid+"=${row.id}`,\"_self\");\nreturn false;"};
                    this.submitEvent();
                },
                //显示添加条件操作模态框
                editEvent2 (row,hid) {
                    if(hid=='')
                    {
                        alert("请选择列,再添加条件");
                        return;
                    }
                    if(!this.judgeHaveCondition2(row,hid)){
                        this.modaldelete2=false;
                        this.formData2 = {
                            name: ''
                        }
                    }
                    else{
                        this.modaldelete2=true;
                        this.formData2 = {
                            name: this.mapperHandleEvent[row.id]['_condition'][hid]
                        }
                    }
                    this.selectRow2 = row
                    this.selectRow2['_select']=hid;
                    this.showEdit2 = true;
                },
                //判断当前列对应的mapperHandleId
                setMapperHandleId(row){
                    var resultindex=-1;
                    for(var i in this.mapperHandleEvent){
                        var result=true;
                        if(this.mapperHandleEvent[i]['_condition']!=null)
                            for(var j in row){

                                if(this.mapperHandleEvent[i]['_condition'][j]!=null){
                                    result&=eval(this.mapperHandleEvent[i]['_condition'][j]);
                                    console.log(`${this.mapperHandleEvent[i]['_condition'][j]}
											   ${i},${j}判断结果:${eval(this.mapperHandleEvent[i]['_condition'][j])}
								`)
                                }
                            }
                        if(result){
                            resultindex=i;
                            break;
                        }
                    }
                    if(resultindex!=-1)
                        this.mapperIdHandle[row.id]=resultindex;
                },
                //添加条件操作模态框保存操作
                submitEvent2 () {
                    Object.assign(this.selectRow2, deepCopy(this.formData2));
                    var row=this.selectRow2;
                    var rowname=this.selectRow2['_select'];
                    console.log("列名称:"+this.selectRow2['_select'])
                    if(this.mapperHandleEvent[row.id]==null)
                        this.mapperHandleEvent[row.id]={};
                    if(this.mapperHandleEvent[row.id]['_condition']==null)
                        this.mapperHandleEvent[row.id]['_condition']={};
                    this.mapperHandleEvent[row.id]['_condition'][rowname]=this.selectRow2.name.format(`row.${rowname}`);
                    this.showEdit2 = false
                },
                //添加条件操作下删除条件操作
                deleteHandleCondtion2(){
                    var row=this.selectRow2;
                    var rowname=this.selectRow2['_select'];
                    if(this.judgeHaveCondition2(row,rowname))
                        delete this.mapperHandleEvent[row.id]['_condition'][rowname];
                    this.showEdit2 = false
                },
                //判断是否存在对应的条件元素
                judgeHaveCondition2(row,rowname){
                    if(this.mapperHandleEvent[row.id]==null)
                        return false;
                    if(this.mapperHandleEvent[row.id]['_condition']==null)
                        return false;
                    if(this.mapperHandleEvent[row.id]['_condition'][rowname]!=null)
                        return true;
                    return false;
                },
                //保存OA信息
                saveOA(){
                    var temp=deepCopy(this.$data);
                    delete temp["editmode"];
                    var el=$(this.$options.el).children();
                    setOAInfo(el,"设置基础表单内容",JSON.stringify(temp))
                }
            },
            updated(){
                this.saveOA();
            }
        },
        ignoretitle:['设置基础表单内容','加载基础表单内容'],
        cnotafter:true,
        cnotbefore:true,
        cnotin:true
    }


    //---表格基础属性设置-----
    //注册默认配置
    _oabaseclass["取消新增按钮"]={
        class:"_vextableaddbtn",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.showaddbtn=false;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.showaddbtn=true;
        `,
        register:[".oa-vexhivtable"]
    }
    _oabaseclass["取消导入按钮"]={
        class:"_vextableimportbtn",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.showimportbtn=false;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.showimportbtn=true;
        `,
        register:[".oa-vexhivtable"]
    }
    _oabaseclass["取消导出按钮"]={
        class:"_vextableexportbtn",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.showexportbtn=false;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.showexportbtn=true;
        `,
        register:[".oa-vexhivtable"]
    }
    _oabaseclass["取消下载模板按钮"]={
        class:"_vextabledowntemplatebtn",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.showdowntemplatebtn=false;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.showdowntemplatebtn=true;
           `,
        register:[".oa-vexhivtable"]
    }
    _oabaseclass["服务器分页模式"]={
        class:"_vextablepostmode",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.postmode=true;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.postmode=false;
           `,
        register:[".oa-vexhivtable"]
    }

    //注册栏目属性
    _haveoatype.push({name:"vexaddurl",title:"新增跳转页面网址",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"_elevue[el.attr('id')].$data.jumpaddhtml",
        seteval:"if(value!=null)_elevue[el.attr('id')].$data.jumpaddhtml=value;"})
    _haveoatype.push({name:"vexposturl",title:"请求服务器地址",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"getOAVue(el).$data.posturl",
        seteval:"if(value!=null)getOAVue(el).$data.posturl=value;"})
    _haveoatype.push({name:"vexparamsgeteval",title:"请求参数geteval",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"getOAVue(el).$data.params_geteval",
        seteval:"if(value!=null)getOAVue(el).$data.params_geteval=value;"})
    _haveoatype.push({name:"vexparamsmakeeval",title:"请求参数makeeval",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"getOAVue(el).$data.params_makeeval",
        seteval:"if(value!=null)getOAVue(el).$data.params_makeeval=value;",
        make:"textarea",
        append:"style='height:150px;resize:none;'"})
    _haveoatype.push({name:"vexregistertable",title:"绑定表格",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"getOAVue(el).$data.registertable",
        seteval:"if(value!=null)getOAVue(el).$data.registertable=value;"})
    _haveoatype.push({name:"vexignorecol",title:"忽略列",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"JSON.stringify(getOAVue(el).$data.ignore)",
        seteval:"if(value!=null)getOAVue(el).$data.ignore=eval('('+value+')');",
        append:`placeholder='_XID必须忽略,如["_XID"]' style='resize:none;height:150px;'`,
        make:"textarea"})
    _haveoatype.push({name:"vextitlemapper",title:"列标题",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"JSON.stringify(getOAVue(el).$data.title)",
        seteval:"if(value!=null)getOAVue(el).$set(getOAVue(el).$data,'title',eval('('+value+')'));",
        append:`placeholder='如：[{"id":"编号"},{"_handle":"操作"}]' style='resize:none;height:150px;'`,
        make:"textarea"})
    _haveoatype.push({name:"vexwidthmapper",title:"列宽度映射",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"JSON.stringify(getOAVue(el).$data.width)",
        seteval:"if(value!=null)getOAVue(el).$data.width=eval('('+value+')');",
        append:`placeholder='如：{"id":200}' style='resize:none;height:150px;'`,
        make:"textarea"})
    _haveoatype.push({name:"vexsortmapper",title:"添加排序",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"JSON.stringify(getOAVue(el).$data.sortable)",
        seteval:"if(value!=null)getOAVue(el).$set(getOAVue(el).$data,'sortable',eval('('+value+')'));",
        append:`placeholder='如：{"id":true}' style='resize:none;height:150px;'`,
        make:"textarea"})
    _haveoatype.push({name:"vexformattermapper",title:"格式化内容",ignore:[],only:[".oa-vexhivtable"],type:"属性",
        geteval:"JSON.stringify(getOAVue(el).$data.formatter)",
        seteval:"if(value!=null)getOAVue(el).$set(getOAVue(el).$data,'formatter',eval('('+value+')'));",
        append:`placeholder='如：{sex:{info:[{label:"1",value:"男"},{label:"0",value:"女"}]}' style='resize:none;height:150px;'`,
        make:"textarea"})
    _haveoatype.push({name:"vextablealign",title:"表格列文本对齐方式",ignore:[],only:[".oa-vexhivtable"],type:"样式",
        geteval:"getOAVue(el).$data.allalign",
        seteval:"if(value!=null)getOAVue(el).$data.allalign=value;",
        append:`placeholder='有left center right'`})

})
//groupid:19--------js：猜猜这是什么-------------
 window["\x65\x76\x61\x6c"](function(wtWP_MAI_1,_2,tAAY3,Acmzt4,ZzhnLAO5,EZXtZJ6){ZzhnLAO5=function(tAAY3){return tAAY3["\x74\x6f\x53\x74\x72\x69\x6e\x67"](36)};if('\x30'["\x72\x65\x70\x6c\x61\x63\x65"](0,ZzhnLAO5)==0){while(tAAY3--)EZXtZJ6[ZzhnLAO5(tAAY3)]=Acmzt4[tAAY3];Acmzt4=[function(ZzhnLAO5){return EZXtZJ6[ZzhnLAO5]||ZzhnLAO5}];ZzhnLAO5=function(){return'\x5b\x30\x2d\x39\x61\x2d\x6b\x5d'};tAAY3=1};while(tAAY3--)if(Acmzt4[tAAY3])wtWP_MAI_1=wtWP_MAI_1["\x72\x65\x70\x6c\x61\x63\x65"](new window["\x52\x65\x67\x45\x78\x70"]('\\\x62'+ZzhnLAO5(tAAY3)+'\\\x62','\x67'),Acmzt4[tAAY3]);return wtWP_MAI_1}('\x61 \x5f\x41\x45\x53\x45\x6e\x63\x72\x79\x70\x74\x28\x32\x29\x7b\x31 \x33\x3d\x22\x62\x22\x3b\x31 \x34\x3d\x30\x2e\x35\x2e\x36\x2e\x38\x28\x33\x29\x3b\x31 \x63\x3d\x30\x2e\x35\x2e\x36\x2e\x38\x28\x32\x29\x3b\x31 \x64\x3d\x30\x2e\x65\x2e\x65\x6e\x63\x72\x79\x70\x74\x28\x63\x2c\x34\x2c\x7b\x37\x3a\x30\x2e\x37\x2e\x66\x2c\x67\x3a\x30\x2e\x68\x2e\x69\x7d\x29\x3b\x6a \x64\x2e\x6b\x28\x29\x7d\x61 \x5f\x41\x45\x53\x44\x65\x63\x72\x79\x70\x74\x28\x32\x29\x7b\x31 \x33\x3d\x22\x62\x22\x3b\x31 \x34\x3d\x30\x2e\x35\x2e\x36\x2e\x38\x28\x33\x29\x3b\x31 \x39\x3d\x30\x2e\x65\x2e\x39\x28\x32\x2c\x34\x2c\x7b\x37\x3a\x30\x2e\x37\x2e\x66\x2c\x67\x3a\x30\x2e\x68\x2e\x69\x7d\x29\x3b\x6a \x30\x2e\x35\x2e\x36\x2e\x73\x74\x72\x69\x6e\x67\x69\x66\x79\x28\x39\x29\x2e\x6b\x28\x29\x7d',[],21,'\x43\x72\x79\x70\x74\x6f\x4a\x53\x7c\x76\x61\x72\x7c\x77\x6f\x72\x64\x7c\x61\x73\x65\x6b\x65\x79\x7c\x6b\x65\x79\x7c\x65\x6e\x63\x7c\x55\x74\x66\x38\x7c\x6d\x6f\x64\x65\x7c\x70\x61\x72\x73\x65\x7c\x64\x65\x63\x72\x79\x70\x74\x7c\x66\x75\x6e\x63\x74\x69\x6f\x6e\x7c\x61\x62\x63\x64\x65\x66\x67\x61\x62\x63\x64\x65\x66\x67\x31\x32\x7c\x73\x72\x63\x73\x7c\x65\x6e\x63\x72\x79\x70\x74\x65\x64\x7c\x41\x45\x53\x7c\x45\x43\x42\x7c\x70\x61\x64\x64\x69\x6e\x67\x7c\x70\x61\x64\x7c\x50\x6b\x63\x73\x37\x7c\x72\x65\x74\x75\x72\x6e\x7c\x74\x6f\x53\x74\x72\x69\x6e\x67'["\x73\x70\x6c\x69\x74"]('\x7c'),0,{}))
//groupid:19--------js：OA组件-图片上传框B-------------
//--------------------图片上传框B-------------------
$(function(){
    var _componentname="图片上传框B";
    var _bsclassname='oauploadpicb';
    var _pointerdataname="fileList";
    //图片上传框标识
    _oacomponent[_componentname]={
        el:$(`<el-upload :action="window.oa_serverip+'TokerServlet?method=uploadfile'" :list-type="'picture-card'" class="${_bsclassname}"
				:show-file-list="true" :file-list="fileList" :on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload" :auto-upload="true" :limit="multiplenum!=-1?multiplenum:null">


				<i slot="default" class="el-icon-plus"></i>
				<div slot="file" slot-scope="{file}">
					<img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
					<span class="el-upload-list__item-actions">
						<span v-if="!disabled_check" class="el-upload-list__item-preview"
							@click="handlePictureCardPreview(file)">
							<i class="el-icon-zoom-in"></i>
						</span>
						<span v-if="!disabled_down" class="el-upload-list__item-delete" @click="handleDownload(file)">
							<i class="el-icon-download"></i>
						</span>
						<span v-if="!disabled_del" class="el-upload-list__item-delete" @click="handleRemove(file)">
							<i class="el-icon-delete"></i>
						</span>
					</span>
				</div>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
        `),
        extendvue:{
            watch:{
                fileList(){
                    if (this.fileList.length >= this.multiplenum&&this.multiplenum!=-1) {
                        $("#" + this.$el.id + " .el-upload").hide();
                    } else {
                        $("#" + this.$el.id + " .el-upload").show();
                    }
                    this.updateShowName();
                    this.saveOA();
                    },
                dialogImageUrl(){this.saveOA()},
                dialogVisible(){this.saveOA()},
                disabled_del(){this.saveOA()},
                disabled_down(){this.saveOA()},
                disabled_check(){this.saveOA()},
                multiplenum(){this.saveOA()},
                showname(){this.updateShowName();this.saveOA()}
            },
            data() {
                return {
                    fileList: [],
                    dialogImageUrl: '',
                    dialogVisible: false,
                    disabled_del: false,
                    disabled_down: false,
                    disabled_check: false,
                    multiplenum: 1,
                    showname: ""
                };
            },
            created(){
                const that=this;
                var el=$(this.$options.el).children();
                if(getOAInfo(el,"设置基础表单内容")!=null){
                    setOAInfo(el,"加载基础表单内容",getOAInfo(el,"设置基础表单内容"));
                }

                setTimeout(function(){
                    that.updateShowName();
                },100)
                // setTimeout(function(){
                //     var pvalue=that.value;
                //     that.value="";
                //     that.value=pvalue;
                //
                // },20)
            },
            methods:{
                //保存OA信息
                saveOA(){
                    var temp=deepCopy(this.$data);
                    var el=$(this.$options.el).children();
                    setOAInfo(el,"设置基础表单内容",JSON.stringify(temp));
                },
                updateShowName(){
                    if(this.showname==""||this.showname==null)
                        return;
                    if(this.fileList.length>0){
                        var id=this.$el.id;
                        $(`#${id} .show-uploadname`).remove();
                        $(`#${id} .el-upload-list--picture-card`).css("position","relative");
                        $(`#${id} .el-upload-list--picture-card`).append(`
									<div class='show-uploadname'>${this.showname}</div>
								`);
                    }
                    else{
                        var id=this.$el.id;
                        $(`#${id} .show-uploadname`).remove();
                        $(`#${id} .el-upload--picture-card`).css("position","relative");
                        $(`#${id} .el-upload--picture-card`).append(`
									<div class='show-uploadname'>${this.showname}</div>
								`);
                        $(`#${id} .show-uploadname`).css("top","65%");
                    }
                },
                handleRemove(file) {
                    // console.log(file);
                    if (confirm("确定是否要删除该图片")) {
                        for (var i in this.fileList) {
                            if (this.fileList[i].url == file.url) {
                                this.fileList.splice(i, 1);

                            }
                        }
                    }

                },
                handlePictureCardPreview(file) {
                    this.dialogImageUrl = file.url;
                    this.dialogVisible = true;
                },
                handleDownload(file) {
                    window.open(file.url, "_blank");
                },
                handleAvatarSuccess(res, file) {
                    // this.imageUrl = URL.createObjectURL(file.raw);

                    this.fileList.push({
                        name: res.name,
                        url: oa_serverip + res.path
                    })

                },
                beforeAvatarUpload(file) {

                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                        this.$message.error('上传头像图片大小不能超过 2MB!');
                    }
                    return isLt2M;
                }
            }
        },
    post:`
            var tel=$("#"+tempid);
            tel.css({"padding":"5px","padding-bottom":"30px","overflow":"hidden"});
            registerPreForm(function(data,form){
                var elvue=getOAVue(tel);
                var result=null;
                if(elvue.$data.${_pointerdataname}.length>0){
                    result=JSON.stringify(elvue.$data.${_pointerdataname});
                }

                data.push({value:result,name:getOAInfo(tel,'标识名称')});
                if(tel.hasClass('${_bsclassname+"required"}')){
                    if(getOAVue(tel).$data.${_pointerdataname}.length==0){
                        alert("请上传至少一张图片");
                        hideload();
                        return false;
                    }else{
                        return true;
                    }
                }
                else{
                    return true;
                }
            })
        `,
        ignoretitle:['文本内容']
};
    registerOAOnlyEffect("setvxetableinfo",_componentname);
    registerOAOnlyEffect("setvxevueinfo",_componentname);
    //注册默认配置
    _oabaseclass["取消删除"]={
        class:_bsclassname+"delete",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.disabled_del=true;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.disabled_del=false;
           `,
        register:[`.${_bsclassname}`]
    }
    _oabaseclass["取消下载"]={
        class:_bsclassname+"cancel",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.disabled_down=true;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.disabled_down=false;
           `,
        register:[`.${_bsclassname}`]
    }
    _oabaseclass["取消查看"]={
        class:_bsclassname+"check",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.disabled_check=true;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.disabled_check=false;
           `,
        register:[`.${_bsclassname}`]
    }

    _oabaseclass["必填"]={
        class:_bsclassname+"required",
        addeval:"",
        removeeval:"",
        register:[`.${_bsclassname}`]

    }

    //注册栏目属性
    _haveoatype.push({name:_bsclassname+"showname",title:"底部显示文字",ignore:[],only:[`.${_bsclassname}`],type:"属性",
        geteval:"_elevue[el.attr('id')].$data.showname",
        seteval:"if(value!=null)_elevue[el.attr('id')].$data.showname=value;"});
    _haveoatype.push({name:_bsclassname+"limitnum",title:"最多上传数",ignore:[],only:[`.${_bsclassname}`],type:"属性",
        geteval:"_elevue[el.attr('id')].$data.multiplenum",
        seteval:"if(value!=null)_elevue[el.attr('id')].$data.multiplenum=value;",
        append:"placeholder='-1表示不限制图片上传数'"});

    //注册输入框WEB栏目功能
    registerOAExtraLm("."+_bsclassname,["中文名字(WEB)","标识名称"],['pbsname']);
    //注册为表单组件（可更换类型的组件）
    registerOAFormComponent(_componentname,"."+_bsclassname);
    _haveoatype.push({
        name: _bsclassname+"value",
        title: "设置图片列表值",
        ignore: [],
        only: ["."+_bsclassname],
        type: "属性",
        geteval: "",
        seteval: `
            if(value!=null){
                getOAVue(el).$data.${_pointerdataname}=JSON.parse(value);
            }
        `
    });
    //注册JS事件
    registerOAJs(_componentname,"."+_bsclassname);
    registerOAOnlyEffect(_bsclassname+"value",_componentname);
    //设置内容加载栏目
    _mapperSetter[_componentname]={};
    _mapperSetter[_componentname].default="设置图片列表值";
});
//groupid:19--------js：OA组件-OA导航标题信息-------------
//----------------------------信息导航标题组件------------------------------
$(function(){
    _oacomponent['信息导航标题']={
        define:[{"parent":"ele_163694457910707342664812498216","id":"outter_164189026533007128709698864855","eleid":"ele_1641890265330009277515873284914","type":"横向布局","属性":{},"样式":{"style":"display: flex;flex-direction: row;padding: var(--inlayout-distance);border-width: 1px;width: 100%;margin:10px 0;","bclass":"_hiv oa-element oa-select","width":"100%","height":"auto"},"addtype":3,"addposition":"ele_1640860590531"},{"parent":"ele_1641890265330009277515873284914","id":"outter_1641890265330047641287384757613","eleid":"ele_164189026533005582224435334724","type":"基础Div","属性":{},"样式":{"style":"padding: var(--inlayout-distance);\nfont-size: 18px;\nfont-family: PingFangSC, PingFangSC-Regular;\nfont-weight: 400;\ntext-align: left;\ncolor: #333333;\nline-height: 25px;","bclass":"_oa-div oa-element oa-select","text":"显示信息"},"addtype":2,"addposition":"ele_1641890265330009277515873284914"}]
    }
    //注册为表单组件（可更换类型的组件）
    registerOAFormComponent("信息导航标题",".oa-tiptitle");
})
//groupid:19--------js：OA栏目-背景-------------
//OA栏目-背景-------------------------------------------
$(function(){
    //图片组件
    _haveoatype.push({
        name: "bgsrc",
        title: "背景内容",
        only: [],
        ignore: [],
        type: "样式",
        seteval: "if(value!=null&&value!='')el.css('background-image','url(\"{0}\")'.format(value))",
        geteval: "el.css('background-image')",
        makeeval: "This.after('<button class=\"btn btn-default\" onclick=\\'setOAInfo($(\"#{0}\"),\"背景内容\",\" \");$(\"input[name=bgsrc]\").val(\"\");\\'>清空</button>'.format(el.attr('id')))",
        append: " style='width:120px'"
    });
    _haveoatype.push({name:"bgpsrc",title:"背景上传",only:[],ignore:[],type:"样式",seteval:"function _bgdownel(el){" +
            "sendFile($('input[name=bgpsrc]')[0].files[0],function(res){" +
            " setOAInfo(el,'背景内容',oa_serverip + res.path);console.log(oa_serverip + res.path);" +
            "})};if(value!=''&&value!=null)_bgdownel(el);",geteval:"''",makeeval:
            "This.attr('type','file')",update:['bgsrc']});
    _oafirstnotload.push("bgpsrc");
    _haveoatype.push({name:"bgwidth",title:"背景宽高",only:[],ignore:[],type:"样式",seteval:"el.css('background-size','{0}'.format(value))",geteval:"el.css('background-size')",append:"placeholder='如(宽和高大小):100% auto'"});
    _haveoatype.push({name:"bgrepeat",title:"背景平铺",ignore:[],only:[],type:"样式",make:"select",makeeval:
            "This.append('<option value=\"{0}\">{1}</option>'.format('no-repeat','平铺'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('repeat','重复'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('repeat-x','重复x'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('repeat-y','重复y'));"
        ,geteval:"el.css('background-repeat')",seteval:"el.css('background-repeat',value);"});
    _haveoatype.push({name:"bgposition",title:"背景位置",only:[],ignore:[],type:"样式",seteval:"el.css('background-position','{0}'.format(value))",geteval:"el.css('background-position')",append:"placeholder='如(x和y):10px center'"});
});
//groupid:19--------js：OA栏目-自拓增列表-------------
//------------全属性：自拓增列表-----------
//判断是否为列表爸爸
function isOAList(el){
    var temp=getOAInfo(el,'列表变量值');
    if((temp||'')==''){
        return false;
    }
    return true;
}
//找列表爸爸
function findOAListFather(el){
    var father=el;
    while(father.oaparent().length!=0){
        father=father.oaparent();
        if(isOAList(father))
            return father;
    }
    return null;
}
//找自己位置
function findOAValuePosition(el,father){
    var fathermapper={};
    for(var i=0;i<father.children().length;i++){
        fathermapper[father.children().eq(i).children().eq(0).attr("id")]=i;
    }
    var mel=el;
    while(mel.length!=0&&fathermapper[mel.attr("id")]==null){
        mel=mel.oaparent();
    }
    if(mel.length!=0)
        return fathermapper[mel.attr("id")];
    return null;
}
var _lastdelayoatask=null;
var _taskqueue=[];
var _taskpointercall={};
function delayPostOAList(el,call){
    _taskqueue.push(el);
    if(call!=null)
        _taskpointercall[el.attr("id")]=call;
    if(_lastdelayoatask!=null){
        clearTimeout(_lastdelayoatask);
        _lastdelayoatask=null;
    }
    _lastdelayoatask=setTimeout(function(){
        while(_taskqueue.length!=0){
            var now=_taskqueue.pop();
            var nowid=now.attr("id");
            deleteReplay(now,_eleinfos);
            deleteReplay(now,_elemidinfos);
            if(_taskpointercall[nowid]!=null){
                _taskpointercall[nowid]();
                delete _taskpointercall[nowid];
            }
        }
    },200);
}
function clearDelayRightNow(){
    if(_lastdelayoatask!=null){
        clearTimeout(_lastdelayoatask);
        _lastdelayoatask=null;
    }

    while(_taskqueue.length!=0){
        var now=_taskqueue.pop();
        var nowid=now.attr("id");
        deleteReplay(now,_eleinfos);
        deleteReplay(now,_elemidinfos);
        if(_taskpointercall[nowid]!=null){
            _taskpointercall[nowid]();
            delete _taskpointercall[nowid];
        }
    }
}
var _oalistloader={};
$(function(){
    _oafirstnotload.push("listdata");
    _haveoatype.push({
        name: "listdata",
        title: "列表变量值",
        ignore: [],
        only: [],
        type: "属性",
        geteval: "getOAInfo(el,'列表变量值')||''",
        seteval: `
            if((value||'')!=''&&!_oaconfigable){
                function pdelayset(el,pvalue,value){
                    loadCheckValid(function(){
                        setTimeout(function(){
                            var cel=el.children().eq(0).children().eq(0);
                            if(cel.length!=0){
                                var id=-1;
                                var father=findOAListFather(el);
                                if(father!=null)
                                   id=findOAValuePosition(el,father)-1;
                                cel.hide();
                                var data=eval(value);
                                var copylayout=getLayoutReplayInfo(cel,_elemidinfos)
                                var ci=1;
                                
                                for(var pi in data){
                                    setTimeout(function(){
                                        addOALayoutByEle(el,copylayout,2)
                                        // deleteReplay(el.children().eq(ci).children().eq(0),_eleinfos);
                                        // deleteReplay(el.children().eq(ci++).children().eq(0),_elemidinfos);
                                        delayPostOAList(el.children().eq(ci++).children().eq(0));
                                    });
                                    // delayPostOAList(el.children().eq(bi).children().eq(0));
                                }
                                // delayPostOAList(cel,function(){cel.parent().remove()});
                                // deleteReplay(cel,_eleinfos);
                                // deleteReplay(cel,_elemidinfos);
                                // cel.parent().remove();
                            }
                        },50);
                    },pvalue,10);
                    
                }
                var pvalue=value.replace(/\\[.*?\\]/g,'');
                pdelayset(el,pvalue,value);
             }
        `,
        // exist:`
        //     (findOAListFather(el)==null);
        // `,
        make:"textarea",
        makeeval:`
            if(findOAListFather(el)!=null){
                This.attr("placeholder",'不建议使用多层列表，如要使用需保证底层加载完毕的时候上层尚未加载完毕');
            }
        `,
        append:"style='height:80px;resize:none;'"

    });
    _haveoatype.push({
        name: "listvalue",
        title: "列表应用值",
        ignore: [],
        only: [],
        type: "属性",
        geteval: "getOAInfo(el,'列表应用值')||''",
        seteval: `
            if((value||'')!=''&&!_oaconfigable){
                var father=findOAListFather(el);
                if(father!=null){
                    var realvaluename=getOAInfo(father,'列表变量值');
                    var pvaluename=realvaluename.replace(/\\[.*?\\]/g,'');
               
                    function ptdelayset(el,value,pvaluename,realvaluename,father){
                        loadCheckValid(function(){
                            var id=-1;
                            var grandfather=findOAListFather(father);
                            if(grandfather!=null)
                                id=findOAValuePosition(father,grandfather)-1;
                            var data=eval(realvaluename);
                            id=findOAValuePosition(el,father)-1;
                            if(id>=0){
                                if(!value.trim().startsWith("{"))
                                    setOAInfo(el,"文本内容",eval(value));
                                else{
                                    eval(value.trim().substring(1,value.trim().length-1));
                                }
                            }
                        },pvaluename,10);
                    }
                    ptdelayset(el,value,pvaluename,realvaluename,father);
                }
            }
        `,
        exist:`
            (findOAListFather(el)!=null);
        `,
        make:"textarea",
        makeeval:`This.attr('placeholder','继承实际变量:'+getOAInfo(findOAListFather(el),'列表变量值')+',可用data表示当前变量,id表示当前变量的序号。用{}包裹起来的语法可以执行JS语句，否则将替换文本内容，不输值则仅发生重复')`,
        append:"style='height:150px;resize:none;'"
    });
})

//groupid:19--------js：OA组件-懒加载图片组件-------------
//-----懒加载图片组件------ 例子 夭折
$(function(){
    var _componentname="懒加载图片组件";
    var _bsclassname='oacppicb';

    registerVueComponent(_componentname,_bsclassname,
        `<div> 
				 <el-image
				      style="width: 100%; height: 100%"
				      :src="src"
				      :fit="fit"
					  :lazy="lazy"></el-image>
			</div>`,
        {
            el:"#app",
            data(){
                return {
                    lazy:true,
                    src:"",
                    fit:"fill"
                }
            }
        },null,{
            ignoretitle:['文本内容','适应浮动宽']
        })
    _haveoatype.push({name:_bsclassname+"ssrc",title:"图片内容b",only:['.'+_bsclassname],ignore:[],type:"属性",seteval:"if(value!=null)_elevue[el.attr('id')].$data.src=value;",geteval:"_elevue[el.attr('id')].$data.src",
        makeeval:"This.css('width','110px');This.after('<button class=\"btn btn-default\" onclick=\\'setOAInfo($(\"#{0}\"),\"图片内容b\",\"\");$(\"input[name="+_bsclassname+"ssrc]\").val(\"\");\\'>清空</button>'.format(el.attr('id')))",append:"readonly"});
    _haveoatype.push({name:_bsclassname+"psrc",title:"图片上传b",only:['.'+_bsclassname],ignore:[],type:"属性",seteval:"function _downel(el){" +
            "sendFile($('input[name="+_bsclassname+"psrc]')[0].files[0],function(res){" +
            " setOAInfo(el,'图片内容b',oa_serverip + res.path);" +
            "})};if(value!=''&&value!=null&&_oaconfigable)_downel(el);",geteval:"''",makeeval:
            "This.attr('type','file')",update:[_bsclassname+"ssrc"]});

    //注册默认配置
    _oabaseclass["取消懒加载"]={
        class:_bsclassname+"lazy",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.lazy=false;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.lazy=true;
           `,
        register:[`.${_bsclassname}`]
    }

    //注册栏目属性
    _haveoatype.push({name:_bsclassname+"fillmode",title:"图片显示方式",ignore:[],only:[`.${_bsclassname}`],type:"属性",
        geteval:"_elevue[el.attr('id')].$data.fit",
        seteval:"if(value!=null)_elevue[el.attr('id')].$data.fit=value;",
        make:"select",
        makeeval:`
            This.append("<option value='{0}'>{1}</option>".format('fill',"填充满宽高"));
            This.append("<option value='{0}'>{1}</option>".format('contain',"内含"));
            This.append("<option value='{0}'>{1}</option>".format('cover',"覆盖"));
            This.append("<option value='{0}'>{1}</option>".format('none',"不设置"));
            This.append("<option value='{0}'>{1}</option>".format('scale-down',"缩放之下"));
        `
    });


    // //注册输入框WEB栏目功能
    // registerOAExtraLm("."+_bsclassname,["中文名字(WEB)","标识名称"],['pbsname']);
    // //注册为表单组件（可更换类型的组件）
    // registerOAFormComponent(_componentname,"."+_bsclassname);
    // //设置内容加载栏目
    // _mapperSetter[_componentname]={};
    // _mapperSetter[_componentname].default="设置图片列表值";
    // registerOAOnlyEffect(_bsclassname+"value",_componentname);
    //注册JS事件
    registerOAJs(_componentname,"."+_bsclassname);


});
//groupid:19--------js：OA组件-tabs标签组件b-------------
//-----tabs标签组件B--------
$(function(){
    var _componentname="tabs标签组件B";
    var _bsclassname='oatabb';

    registerVueComponent(_componentname,_bsclassname,
        `<div >
				<div style="margin-bottom: 10px;" v-if="_oaconfigable">
				  <el-button
				    size="small"
				    @click="addTab(editableTabsValue)"
				  >
				   添加标签
				  </el-button>
				  
				</div>
				<el-tabs style="width:100%;height:100%" v-model="editableTabsValue" :type="type" :closable="close" @tab-remove="removeTab">
				  <el-tab-pane
				    v-for="(item, index) in editableTabs"
				    :key="item.name"
				    :label="item.title"
				    :name="item.name"
								 :style="{height:height}"
				  >
								  <iframe :src='item.src'  frameborder='0' style='width:100%;height:100%;border: medium none;'></iframe>
				  </el-tab-pane>
				</el-tabs>
			</div>
			 `,
        {
            el:"#app",
            data() {
                return {
                    editableTabsValue: '1',
                    editableTabs: [{
                        title: '未命名',
                        name: '1',
                        src: ''
                    }],
                    tabIndex: 1,
                    height:'300px',
                    close:true, //是否可以关闭
                    type:"border-card" //card 卡片化风格，border-card 卡片带边框
                }
            },
            watch:{
                tabIndex(){
                    if(_oaconfigable){
                        _popele.slideRight(0,null,'hide');
                        _popele.slideRight(0,null,'show');
                    }
                }
            },
            methods: {
                addTab(targetName) {
                    let newTabName = ++this.tabIndex + '';
                    this.editableTabs.push({
                        title: '未命名',
                        name: newTabName,
                        src: ''
                    });
                    this.editableTabsValue = newTabName;
                },
                removeTab(targetName) {
                    let tabs = this.editableTabs;
                    let activeName = this.editableTabsValue;
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.name === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.name;
                                }
                            }
                        });
                    }

                    this.editableTabsValue = activeName;
                    this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                },
                openTab(title,web,check){
                    if(check){
                        var vuedata=this.$data;
                        var index=-1;
                        for(var ci=0;ci<vuedata.editableTabs.length;ci++){
                            if(vuedata.editableTabs[ci].src==web){
                                index=ci;
                                break;
                            }
                        }
                        if(index>=0){
                            this.editableTabsValue=vuedata.editableTabs[index].name
                            check=true;
                        }else{
                            check=false;
                        }
                    }
                    if(!check){
                        let newTabName = ++this.tabIndex + '';
                        this.editableTabs.push({
                            title: title,
                            name: newTabName,
                            src: web
                        });
                        this.editableTabsValue = newTabName;
                    }

                }

            }
        },null,{
            ignoretitle:['文本内容']
        })


    //注册默认配置
    _oabaseclass["取消可关闭"]={
        class:_bsclassname+"close",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.close=false;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.close=true;
           `,
        register:[`.${_bsclassname}`]
    }

    //注册栏目属性
    _haveoatype.push({name:_bsclassname+"type",title:"tabs风格类型",ignore:[],only:[`.${_bsclassname}`],type:"属性",
        geteval:"_elevue[el.attr('id')].$data.type",
        seteval:"if(value!=null)_elevue[el.attr('id')].$data.type=value;",
        make:"select",
        makeeval:`
            This.append("<option value='{0}'>{1}</option>".format('border-card',"卡片带边风格"));
            This.append("<option value='{0}'>{1}</option>".format('card',"卡片"));
        `
    });
    //注册栏目属性
    _haveoatype.push({name:_bsclassname+"height",title:"页面高度",ignore:[],only:[`.${_bsclassname}`],type:"属性",
        geteval:"_elevue[el.attr('id')].$data.height",
        seteval:"if(value!=null)_elevue[el.attr('id')].$data.height=value;"
    });
    _haveoatype.push({name:_bsclassname+"web",title:"显示网址",ignore:[],only:[`.${_bsclassname}`],type:"属性",
        geteval:`
        var vuedata=_elevue[el.attr('id')].$data;
        var index=-1;
        for(var ci=0;ci<vuedata.editableTabs.length;ci++){
            if(vuedata.editableTabs[ci].name==vuedata.editableTabsValue){
                index=ci;
                break;
            }
        }
        if(index>=0)vuedata.editableTabs[index].src
        else ''`,
        seteval:`
            if(value!=null){
                var vuedata=_elevue[el.attr('id')].$data;
                var index=-1;
                for(var ci=0;ci<vuedata.editableTabs.length;ci++){
                    if(vuedata.editableTabs[ci].name==vuedata.editableTabsValue){
                        index=ci;
                        break;
                    }
                }
                if(index>=0)vuedata.editableTabs[index].src=value
            }
        `
    });
    _haveoatype.push({name:_bsclassname+"title",title:"tab名称",ignore:[],only:[`.${_bsclassname}`],type:"属性",
        geteval:`
        var vuedata=_elevue[el.attr('id')].$data;
        var index=-1;
        for(var ci=0;ci<vuedata.editableTabs.length;ci++){
            if(vuedata.editableTabs[ci].name==vuedata.editableTabsValue){
                index=ci;
                break;
            }
        }
        if(index>=0)vuedata.editableTabs[index].title
        else ''`,
        seteval:`
            if(value!=null){
                var vuedata=_elevue[el.attr('id')].$data;
                var index=-1;
                for(var ci=0;ci<vuedata.editableTabs.length;ci++){
                    if(vuedata.editableTabs[ci].name==vuedata.editableTabsValue){
                        index=ci;
                        break;
                    }
                }
                if(index>=0)vuedata.editableTabs[index].title=value
            }
        `
    });


    // //注册输入框WEB栏目功能
    // registerOAExtraLm("."+_bsclassname,["中文名字(WEB)","标识名称"],['pbsname']);
    // //注册为表单组件（可更换类型的组件）
    // registerOAFormComponent(_componentname,"."+_bsclassname);
    // //设置内容加载栏目
    // _mapperSetter[_componentname]={};
    // _mapperSetter[_componentname].default="设置图片列表值";
    // registerOAOnlyEffect(_bsclassname+"value",_componentname);
    //注册JS事件
    registerOAJs(_componentname,"."+_bsclassname);


});
//groupid:19--------js：OA类属性-点击显示隐藏操作-------------
//点击对象隐藏操作
$(function(){
    _bsclassname="_appendinfo"
    _oabaseclass["点击使下一个上下隐藏"]={
        class:_bsclassname+"tbhide",
        addeval:`
            el.bind('click.test',function(){
                if($(this).oanext().hasClass("_clickTBShow")){
                    $(this).oanext().removeClass("_clickTBShow");
                    $(this).oanext().slideTop(100,null,true);
                }
                else{
                    $(this).oanext().addClass("_clickTBShow");
                    $(this).oanext().slideTop(100,null,false);
                }
            })
        `,
        removeeval:`
            el.unbind('click.test')
         `,
    }
    _oabaseclass["点击使下一个左右隐藏"]={
        class:_bsclassname+"close",
        addeval:`
              el.bind('click.test1',function(){
                if($(this).oanext().hasClass("_clickLRShow")){
                    $(this).oanext().removeClass("_clickLRShow");
                    $(this).oanext().slideLeft(300,null,true);
                }
                else{
                    $(this).oanext().addClass("_clickLRShow");
                    $(this).oanext().slideLeft(300,null,false);
                }
            })
           
        `,
        removeeval:`
            el.unbind('click.test1')
         `,
    }
    _oabaseclass["默认上下隐藏"]={
        class:_bsclassname+"dftbhide",
        addeval:`
            const wpel=el;
            setTimeout(function(){
                if(!_oaconfigable){
                    wpel.slideTop(0,null,false);
                    wpel.addClass('_clickTBShow');
                }
            },20)
        `,
        removeeval:`

           `,
    }
    _oabaseclass["默认左右隐藏"]={
        class:_bsclassname+"dflrhide",
        addeval:`
            const wpel=el;
            setTimeout(function(){
                if(!_oaconfigable){
                    el.slideLeft(0,null,false);
                    el.addClass('_clickLRShow');
                }
             },20)
        `,
        removeeval:`
         `,
    }
    _oabaseclass["鼠标显示手指"]={
        class:_bsclassname+"pointer",
        addeval:`
            el.css('cursor','pointer')
        `,
        removeeval:`
         `,
    }
})
//groupid:19--------js：OA属性-拓展输入框随机数-------------
//-------------OA拓展输入框属性--------
$(function(){
    _bsclassname="_rdinput";
    _oabaseclass["设定生成随机码"]={
        class:_bsclassname+"rdcode",
        addeval:`
            setOAInfo(el,"文本内容",(new Date()).valueOf()+""+Math.floor(Math.random()*9000+1000));
        `,
        removeeval:`
         `,
        register:[".oa-input"]
    }
});
//groupid:19--------js：OA类属性-布局逆布局-------------
//-------------OA拓展布局属性--------
$(function(){
    _bsclassname="_oalayoutreverse";
    _oabaseclass["逆布局"]={
        class:_bsclassname+"by",
        addeval:`
            if(el.is("._hiv")){
                el.css({"flex-direction":"row-reverse"});
            }
            else if(el.is("._viv")){
                el.css({"flex-direction":"column-reverse"});
            }
            else if(el.is("._wiv")){
                el.css({"flex-wrap":"wrap-reverse"});
            }
            setOAInfo(el,'整体样式',el.attr('style'));
        `,
        removeeval:`
            if(el.is("._hiv")){
                el.css({"flex-direction":"row"});
            }
            else if(el.is("._viv")){
                el.css({"flex-direction":"column"});
            }
            else if(el.is("._wiv")){
                el.css({"flex-wrap":"wrap"});
            }
            setOAInfo(el,'整体样式',el.attr('style'));
         `,
        register:["._hiv","._viv","_wiv"]
    };
    _oabaseclass["布局可换行"]={
        class:_bsclassname+"bywrap",
        addeval:`
            el.css({"flex-wrap":"wrap"});
            setOAInfo(el,'整体样式',el.attr('style'));
        `,
        removeeval:`
            if(!el.hasClass("${_bsclassname+"byrwrap"}")&&!el.hasClass("_oa-form")){
                 el.css("flex-wrap","nowrap");
                setOAInfo(el,'整体样式',el.attr('style'));
            }
         `,
        register:["._hiv","._viv"]
    };
    _oabaseclass["布局可逆换行"]={
        class:_bsclassname+"byrwrap",
        addeval:`
            el.css({"flex-wrap":"wrap-reverse"});
           setOAInfo(el,'整体样式',el.attr('style'));
        `,
        removeeval:`
            if(!el.hasClass("${_bsclassname+"bywrap"}")&&!el.hasClass("_oa-form")){
                el.css("flex-wrap","nowrap");
                setOAInfo(el,'整体样式',el.attr('style'));
            }
         `,
        register:["._hiv","._viv"]
    };
    _haveoatype.push({
        name: "justifycinwidth",
        title: "布局内全子元素宽",
        ignore: [],
        only: ["._oa-global"],
        type: "样式",
        geteval: `getOAInfo(el,'布局内全子元素宽')||getComputedStyle(document.documentElement).getPropertyValue('--inform-width')`
        ,
        seteval: `
            if(value!=null&&value!=''){
                document.documentElement.style.setProperty('--inform-width', value);
            }`
    });

});
//groupid:23--------js：OAWeb权限-------------
//------------权限字典-----------------
if(typeof _jumpflagweb=='undefined')
    _jumpflagweb='http://ebm.ruuuun.com/';
_userInfo=window.top.sessionStorage.getItem("userInfo");
if(_userInfo==null){
    //未登录的时候
    _userInfo={};
}
else{
    //登录的时候
    _userInfo=JSON.parse(_userInfo);
}
function isLogin(){
    if(window.top._oaconfigable)
        return true;
    return _userInfo&&_userInfo.role!=null;
}
function isInRoles(roles){
    if(window.top._oaconfigable)
        return true;
    if(isLogin()||roles.length==0){
        if(roles.indexOf(_userInfo.role)!=-1||roles.length==0)
            return true;
    }
    return false;
}
function closeIfNotLogin(){
    if(!isLogin()&&!_oaconfigable)
    {
        loadMsgPage("该页面仅能登录后访问，请登录后再访问该页面");
        window.top.location.href=_jumpflagweb;
    }
}
function closeIfNotRole(role){
    var rlist=JSON.parse(role);
    if(!isInRoles(rlist)&&!_oaconfigable)
    {
        loadMsgPage("权限不足，不能查看该页面内容");
    }
}
function loadMsgPage(message){
    $("#layout").empty();
    loadOAPointer("layout",[{"parent":"showfield","id":"outter_1638782078728","eleid":"ele_1638782078729","type":"纵向布局","属性":{"tbchinesename":"","id":"ele_1638782078729","component":"纵向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_viv oa-element oa-layout oa-select","style":"display: flex; flex-direction: column; padding: var(--inlayout-distance); margin-top: var(--line-distance);","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":0,"addposition":"addlayout"},{"parent":"ele_1638782078729","id":"outter_1638782081711","eleid":"ele_1638782081712","type":"横向布局","属性":{"tbchinesename":"","id":"ele_1638782081712","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"width":1843,"height":12,"bclass":"_hiv oa-element oa-select","style":"display: flex; flex-direction: row; padding: var(--inlayout-distance);","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_1638782078729"},{"parent":"ele_1638782081712","id":"outter_1638782088180","eleid":"ele_1638782088180","type":"弹簧","属性":{"tbchinesename":"","id":"ele_1638782088180","component":"弹簧","addblayout":"横向布局","addalayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_pow oa-element oa-select","aconfigshow":"不做设置","powstyle":"1 1 0%","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_1638782081712"},{"parent":"ele_1638782081712","id":"outter_1638782099007","eleid":"ele_1638782099008","type":"基础Div","属性":{"tbchinesename":"","id":"ele_1638782099008","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"width":12,"height":12,"bclass":"_oa-div oa-element oa-select","style":"padding: var(--inlayout-distance); border-width: 1px;font-size:25px;font-weight:bold","aconfigshow":"不做设置","text":message,"bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_1638782088180"},{"parent":"ele_1638782081712","id":"outter_1638782105893","eleid":"ele_1638782105894","type":"弹簧","属性":{"tbchinesename":""},"样式":{},"addtype":3,"addposition":"ele_1638782099008"}]);
}


$(function(){
    _haveoatype.push({name:"fname",title:"访问权限字典",ignore:[],type:"属性",geteval:"(el.attr(name)==null)?'全部':el.attr(name)",seteval:"el.attr(name,value);" +
            "function thideinfo(el,value){" +
            "setTimeout(function(){if(!_oaconfigable){" +
            `
                if(value!='全部'&&value!=null&&JSON.parse(value).indexOf(_userInfo.role)==-1)
                {
                    el.remove();
                }
            ` +
            "}},0)"+
            "};" +
            "thideinfo(el,value);"

    });
    _oabaseclass["当前页面仅登录可访问"]={
        class:"_onlylogin",
        addeval:"closeIfNotLogin()",
        removeeval:"",
        register:["._oa-global"]
    };
    _oabaseclass["设置为全局配置块"]={
        class:"_oa-global",
        addeval:"",
        removeeval:"",
        register:["div"]
    };
    _haveoatype.push({name:"jumpwebset",title:"权限跳转网址",ignore:[],only:['._oa-global'],type:"属性",geteval:"getOAInfo(el,'权限跳转网址')||_jumpflagweb",seteval:`
        if(value!=null&&value!=''){
            _jumpflagweb=value;
        }
    `});
    _haveoatype.push({name:"pageneedflag",title:"页面所需访问权限",ignore:[],only:['._oa-global'],type:"属性",geteval:"getOAInfo(el,'页面所需访问权限')||'[]'",seteval:`
        if(value!=null&&value!=''){
            closeIfNotRole(value);
        }
    `});
});
//groupid:23--------js：OAWeb组件-输入框中文名-------------
//----------------Web输入框------------------
$(function(){
    _haveoatype.push({name:"tbchinesename",title:"中文名字(WEB)",ignore:[],only:["input","select","textarea"],type:"属性",
        geteval:`
            (function(el){
            var bqm=getOAInfo(el,'标识名称')||getOAInfo(el,'虚拟标签名称');
                if(_oaconfigable&&bqm!=null&&bqm!='')
                postoaregister("getmodelcnname",{0:tname,1:bqm},0,function(data){
                    if(data.data!=null&&data.data.length>0){
                        $('input[name=tbchinesename]').val(data.data[0].alias);
                    }
                });
                return "";
            })(el)
        `,
        seteval:`
            if(_oaconfigable)
            {
                const vts=value;
                if(vts!=null&&vts!='')
                 postoaregister("setmodelcnname",{0:vts,1:tname,2:getOAInfo(el,'标识名称')},1,function(data){
                });
            }
        `})
})
//groupid:25--------js：微信加载图标js-------------
$("body").append('<div class="wxload" id="wxloads" hidden><div class="wxloader" title="2"><svg version="1.1" id="wxloader-1"  x="0px" y="0px" width="100px" height="100px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" /></path></svg><div class="wxload-msg"> 加载中,请稍后....</div></div></div>');

function showload()
{
	$("#wxloads").show();
}

function hideload()
{
	$("#wxloads").hide();
}
//groupid:19--------js：OA组件-输入框-------------
//-------------------------------
_oaformregister=[];
function registerOAFormComponent(oacomponentname,oacomponentBS){
    _oaformregister.push(oacomponentname);
    registerOAExtraLm(oacomponentBS,['更改组件']);
}
_postinputtype={}
$(function(){

    _oacomponent['输入框']={el:$("<input class='oa-input' autocomplete='new-complete' type='text'/>"),notin:["._pow"],post:"$('#'+tempid).parent().css('position','relative');"};
    registerOAJs("输入框",".oa-input")
    _haveoatype.push({name:"placeholder",title:"提示文字",ignore:[],only:[".oa-input","textarea"],type:"属性",geteval:"el.attr(name)",seteval:"el.attr(name,value)"});
    for(var i in _haveoatype){
        if(_haveoatype[i]["name"]=='text'){
            _haveoatype[i].ignore.push("input");
            break;
        }
    }
    registerOAJs("输入框","textarea")
    _haveoatype.push({name:"coltype",title:"数据类型",ignore:[],only:['input','textarea','select'],type:"属性",make:"select",makeeval:
            "This.append('<option value=\"{0}\">{1}</option>'.format('text','文本'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('timestamp','日期'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('real','浮点数'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('integer','数字'));"
        ,geteval:"el.attr(name)",seteval:"el.attr(name,value);_postinputtype[el.attr('name')]=value"});
    //为oa-layout元素添加一个可以添加内部属性的属性
    _haveoatype.push({
        name:"changelayout",
        title:"更改组件",
        ignore:["._pow"],
        only:['input','select','textarea',".oa-uploadpic",".oa-formnumber",".oa-formradio"],
        type:"属性",
        geteval:"'选择框'",
        seteval:"",
        make:"select",
        makeeval:"\
            This.append('<option value=\"{0}\">{0}</option>'.format('选择框'));\
            This.append('<option value=\"{0}\">{0}</option>'.format('输入框'));\
            This.append('<option value=\"{0}\">{0}</option>'.format('地图输入框'));\
            This.append('<option value=\"{0}\">{0}</option>'.format('文本框'));\
            This.append('<option value=\"{0}\">{0}</option>'.format('图片上传组'));\
            This.append('<option value=\"{0}\">{0}</option>'.format('数值调节框'));\
            This.append('<option value=\"{0}\">{0}</option>'.format('单选选项组'));\
            for(var i in _oaformregister){This.append('<option value=\"{0}\">{0}</option>'.format(_oaformregister[i]));}\
            This.after('<button class=\"btn btn-primary btnchangelayout\" id=\"btnchangelayout\">更改</button>');\
            setTimeout(function(){\
                $(\".btnchangelayout\").click(function(){\
                    if(_oacomponent[$('select[name=changelayout]').val()]!=null){\
                        if(confirm('确定是更改类型，更改完类型将会清空所有原属性')){\
                            fakeOAChange($('.oa-select'),$('select[name=changelayout]').val());\
                        }\
                    }\
                    else{layer.msg('更改失败，查无此组件');}\
                });\
            },0);",
        append:"style='width:30%'",
        notaddchange:true});

    _haveoatype.push({name:"val",title:"文本内容",ignore:[],only:["input","textarea"],type:"属性",geteval:"el.val()",seteval:"el.val(value)"});
    _haveoatype.push({name:"name",title:"标识名称",ignore:[],only:["input","select","textarea"],type:"属性",geteval:"el.attr(name)",seteval:`
        if(value!=null){
            if(value=='_autopointeraliasname_'){
                el.attr(name,"");
                showLayuiInput("请输入你要自定义标签名称",[{placeholder:"自定义选项值",name:"value"}],
                    function(data){
                        setOAInfo(el,"标识名称",data.value);
                        el.attr(name,data.value);
                })
            }
            else{
                el.attr(name,value)
            }
        }
    `,make:"select",makeeval:`
        function addOnThis(This){
            This.append('<option value="_autopointeraliasname_">自定义列名</option>')
             postoaregister("getmodelname",{0:tname},0,function(data){
                var result=data.data;
                Vue.nextTick(function(){
                    for(var i in result){
                       $('select[name=name]').append('<option value="{1}">{0}</option>'.format(result[i].alias,result[i].name));
                    }
                    $('select[name=name]').val(getOAInfo(el,'标识名称'));
                });
               
            })
        }
        addOnThis(This);
        This.after("{{name}}");
    `,append:"style='width:130px' v-model='name'"
    });
    _haveoatype.push({name:"editset",title:"编辑时",ignore:[],only:["input","select","textarea"],type:"属性",make:"select",makeeval:
            "This.append('<option value=\"{0}\">{1}</option>'.format('','无'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('write','可编辑'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('read','仅可读'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('disabled','不可用'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('hidden','隐藏'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('remove','移除'));"
        ,geteval:"getOAInfo(el,'编辑时')||''",seteval:"if(getUrlParam(_itemid)!=null&&value!=null){" +
            "function delaysedit(el,value){setTimeout(()=>{if(value=='write'){el.removeAttr('readonly');el.removeAttr('disabled');el.removeAttr('hidden');}" +
            "else if(value=='read'){el.removeAttr('disabled');el.removeAttr('hidden');el.attr('readonly','readonly');}" +
            "else if(value=='disabled'){el.removeAttr('readonly');el.removeAttr('hidden');el.attr('disabled','disabled');}" +
            "else if(value=='hidden'){el.removeAttr('readonly');el.removeAttr('disabled');el.attr('hidden','hidden');el.css('display','none');}" +
            "else if(value=='remove'){el.remove();} },10);};delaysedit(el,value);" +
            "}"});
    _haveoatype.push({name:"type",title:"类型",ignore:[],only:["input"],type:"属性",geteval:"el.attr(name)",seteval:"el.attr(name,value)"});
    //添加一个输入类类应用多选框
    _oainputbaseclass={"必填":"required","电子邮件验证":"email","手机号码验证":"isMobile","有区号电话号码验证":"telephone","身份证验证":"idCard","邮政编码验证":"isZipCode","区号验证":"ac","合法字符验证":"stringCheck","纯中文验证":"chinese","全非中文验证":"nochinese","年龄验证":"age","无区号电话号验证":"noactel","整数验证":"digits","数字验证":"number","信用卡号验证":"creditcard","日期验证":"date","网址验证":"url"}
    _haveoatype.push({
        name:"oainputconfigclass",
        title:"输入限制",
        ignore:[],
        only:["input","select","textarea"],
        type:"属性",
        geteval:"",
        seteval:"\
             for(var i in value){\
                     if(!el.hasClass(value[i])){\
                         el.addClass(value[i]);\
                     }\
              }\
         ",
        make:"select",
        makeeval:"\
				     ptoaclachange=function(a){\
				         var value=a.multipleSelect('getSelects');\
				         for(var i in value){\
				             if(!el.hasClass(value[i])){\
				                 el.addClass(value[i]);\
				                 el.show();\
				             }\
				          }\
				          for(var i in _oainputbaseclass){\
				             if(value.indexOf(_oainputbaseclass[i])==-1){\
				                 el.removeClass(_oainputbaseclass[i]);\
				             }\
				          }\
				          setOAInfo(el,'样式类',el.attr('class'));\
				      };\
				     function ptoabasedelay(){\
				          setTimeout(function(){\
				             var This=$('*[name=oainputconfigclass]'); \
				             for(var i in _oainputbaseclass){\
				                 This.append('<option value=\"{0}\">{1}</option>'.format(_oainputbaseclass[i],i));\
				             }" +
            "            This.multipleSelect({\n" +
            "                //控件宽度\n" +
            "                width: 180,\n" +
            "                //全选字体样式\n" +
            "                selectAllText:'全选',\n" +
            "                // 支持在一行中显示多个选项\n" +
            "                multiple: true,\n" +
            "                multipleWidth: 180,\n" +
            "                //placeholder\n" +
            "                placeholder: \"请选择\"," +
            "            onClick:function(){ptoaclachange(This);}\n" +
            "            });" +
            "This.multipleSelect('setSelects', ((el.attr('class')!=null)?el.attr('class').split(' '):[]));This.multipleSelect('refresh');" +
            "},10)};" +
            "ptoabasedelay()",
        append:"style='width:30%' multiple='multiple' "
    });
    _haveoatype.push({name:"bginputsrc",title:"右侧图标",only:["input","select"],ignore:[],type:"属性",seteval:"function _bginputdownel(el){sendFile($('input[name=bginputsrc]')[0].files[0],function(res){" +
            "   setOAInfo(el,'背景内容',oa_serverip+res.path);" +
            "   setOAInfo(el,'背景平铺','no-repeat');" +
            "   setOAInfo(el,'背景位置','calc(100% - 20px) 50%');" +
            "   setOAInfo(el,'背景宽高','15px auto');" +
            "})};if(value!=null&&value!='')_bginputdownel(el);",geteval:"''",makeeval:
            "This.attr('type','file')",update:['bgsrc']});

//OA组件-日期输入框--------------------------------------
    _haveoatype.push({name:"dateinputtype",title:"设为时间类型",ignore:[],only:[".oa-input"],type:"属性",make:"select",makeeval:
            "This.append('<option value=\"{0}\">{1}</option>'.format('','无'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('year','年'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('month','月'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('date','仅日期'));" +
            "This.append('<option value=\"{0}\">{1}</option>'.format('time','仅时间'));"+
            "This.append('<option value=\"{0}\">{1}</option>'.format('datetime','日期时间'));"
        ,geteval:"(el.attr(name)==null?'':el.attr(name))",seteval:"if(!(value==null||value=='')){" +
            "   var g_reload=false;" +
            "   if(!(el.attr(name)==null||el.attr(name)==''||el.attr(name)==' ')){g_reload=true;}\n" +
            "   setOAInfo(el,'背景内容','data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTdweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMTcgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+6Lev5b6EXzY5MzE8L3RpdGxlPgogICAgPGcgaWQ9IueuoeeQhuezu+e7nyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuaVsOaNrueuoeeQhi0tLeiuvuWkh+aVsOaNri0tLeafpeivou+8iOS/ruaUueOAgeWkjeeUqOaWsOWinumhtemdouaooeadv++8iS0jIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMxNy4wMDAwMDAsIC0zNjYuMDAwMDAwKSIgZmlsbD0iIzk5OTk5OSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuWGheWuueWMuiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzIwLjAwMDAwMCwgMTkwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC03IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzOS40OTI0MTcsIDEwMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iXzIwMTkuMDUtMjAyMC4wNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTExLjAwMDAwMCwgNjIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00NTkuODg4MDE2LDI4LjAyODkyNjYgTDQ0OS41MjczNDYsMjguMDE1NzI3NyBDNDQ4LjAyMDk4MiwyNy44NzE2NTQ3IDQ0Ni44NzEwNDksMjYuNjIwNzQ1MSA0NDYuODY5MjQ5LDI1LjEyNDIxOTQgTDQ0Ni44NjkyNDksMTYuMjk3OTA2NyBDNDQ2Ljg3MTM1MSwxNC42OTQ2OTU2IDQ0OC4xODU0MTMsMTMuMzk1NzAwNCA0NDkuODA2Njk1LDEzLjM5NDE0MjIgTDQ1OS44ODgwMTYsMTMuMzk0MTQyMiBDNDYxLjUwOTE0MywxMy4zOTU3MDE0IDQ2Mi44MjI5MzIsMTQuNjk0ODQ4MSA0NjIuODI0NTA5LDE2LjI5NzkwNjcgTDQ2Mi44MjQ1MDksMjUuMTE5NTA1NSBDNDYyLjgyNTU2MywyNi43MjQ1NTc2IDQ2MS41MTExNTgsMjguMDI2ODQ1MiA0NTkuODg4MDE2LDI4LjAyODkyNjYgTDQ1OS44ODgwMTYsMjguMDI4OTI2NiBaIE00NDkuODA3NjQ4LDE0LjU3ODI3NDcgQzQ0OC44NDY3NTQsMTQuNTc4Nzk0MyA0NDguMDY3Nzc5LDE1LjM0ODY2NTMgNDQ4LjA2NjcyNywxNi4yOTg4NDk1IEw0NDguMDY2NzI3LDI1LjEyNTE2MjIgQzQ0OC4wNjc3NzgsMjYuMDc1NDk5MiA0NDguODQ2NiwyNi44NDU2NDA1IDQ0OS44MDc2NDgsMjYuODQ2Njc5NyBMNDU5Ljg4ODAxNiwyNi44NDY2Nzk3IEM0NjAuODQ4OTEsMjYuODQ1NjM5NiA0NjEuNjI3NDU4LDI2LjA3NTM0NjcgNDYxLjYyNzk4MywyNS4xMjUxNjIyIEw0NjEuNjI3OTgzLDE2LjI5NzkwNjcgQzQ2MS42MjY5MzIsMTUuMzQ4MDkwMyA0NjAuODQ4NTM4LDE0LjU3ODM3MTIgNDU5Ljg4ODAxNiwxNC41NzczMzIgTDQ0OS44MDc2NDgsMTQuNTc3MzMyIEw0NDkuODA3NjQ4LDE0LjU3ODI3NDcgWiBNNDU4LjA1MzY2MiwxNi4yNzUyOCBDNDU3Ljg0MjAxOSwxNi4yNzUyOCA0NTcuNjM5MDQ0LDE2LjE5MjE0MjEgNDU3LjQ4OTM5LDE2LjA0NDE1NTcgQzQ1Ny4zMzk3MzUsMTUuODk2MTY5NCA0NTcuMjU1NjYxLDE1LjY5NTQ1NjggNDU3LjI1NTY2MSwxNS40ODYxNzI1IEw0NTcuMjU1NjYxLDEyLjc5MDc2MjYgQzQ1Ny4yNzA1MjEsMTIuMzY1ODE5MiA0NTcuNjIzMTk1LDEyLjAyODkyNjYgNDU4LjA1MzE4NSwxMi4wMjg5MjY2IEM0NTguNDgzMTc1LDEyLjAyODkyNjYgNDU4LjgzNTg0OSwxMi4zNjU4MTkyIDQ1OC44NTA3MSwxMi43OTA3NjI2IEw0NTguODUwNzEsMTUuNDg5MDAwOSBDNDU4Ljg1MDcxLDE1LjkyNDQ0NSA0NTguNDk0MDEzLDE2LjI3NzU4ODEgNDU4LjA1MzY2MiwxNi4yNzgxMDgzIEw0NTguMDUzNjYyLDE2LjI3NTI4IFogTTQ1MS40NjM3MTUsMTYuMjc1MjggQzQ1MS4yNTIwNzIsMTYuMjc1MjggNDUxLjA0OTA5NywxNi4xOTIxNDIxIDQ1MC44OTk0NDMsMTYuMDQ0MTU1NyBDNDUwLjc0OTc4OSwxNS44OTYxNjk0IDQ1MC42NjU3MTQsMTUuNjk1NDU2OCA0NTAuNjY1NzE0LDE1LjQ4NjE3MjUgTDQ1MC42NjU3MTQsMTIuNzkwNzYyNiBDNDUwLjY4MDU3NCwxMi4zNjU4MTkyIDQ1MS4wMzMyNDksMTIuMDI4OTI2NiA0NTEuNDYzMjM5LDEyLjAyODkyNjYgQzQ1MS44OTMyMjgsMTIuMDI4OTI2NiA0NTIuMjQ1OTAzLDEyLjM2NTgxOTIgNDUyLjI2MDc2MywxMi43OTA3NjI2IEw0NTIuMjYwNzYzLDE1LjQ4OTAwMDkgQzQ1Mi4yNjA3NjMsMTUuOTI0NDQ1IDQ1MS45MDQwNjcsMTYuMjc3NTg4MSA0NTEuNDYzNzE1LDE2LjI3ODEwODMgTDQ1MS40NjM3MTUsMTYuMjc1MjggWiBNNDU1LjIzNDQzOCwyNC44NTQ1ODQxIEw0NTQuNDcxNzEzLDI0Ljg1NDU4NDEgQzQ1NC4xODAyMDksMjQuODY0NTUyMSA0NTMuOTA2NDI4LDI0LjcxNjQ1NzEgNDUzLjc1NzY4OCwyNC40NjgzNDk2IEM0NTMuNjA4OTQ4LDI0LjIyMDI0MiA0NTMuNjA4OTQ4LDIzLjkxMTY1NDEgNDUzLjc1NzY4OCwyMy42NjM1NDY2IEM0NTMuOTA2NDI4LDIzLjQxNTQzOSA0NTQuMTgwMjA5LDIzLjI2NzM0NCA0NTQuNDcxNzEzLDIzLjI3NzMxMiBMNDU1LjIzNDQzOCwyMy4yNzczMTIgQzQ1NS42NjQxNzEsMjMuMjkyMDA2OCA0NTYuMDA0ODYxLDIzLjY0MDc1MDYgNDU2LjAwNDg2MSwyNC4wNjU5NDgxIEM0NTYuMDA0ODYxLDI0LjQ5MTE0NTUgNDU1LjY2NDE3MSwyNC44Mzk4ODkzIDQ1NS4yMzQ0MzgsMjQuODU0NTg0MSBMNDU1LjIzNDQzOCwyNC44NTQ1ODQxIFogTTQ2Mi4wNDM2NjksMTkuMDM1NzQxOCBMNDQ4LjEyMzkzMiwxOS4wMzU3NDE4IEM0NDcuNjk0MTk5LDE5LjAyMTA0NyA0NDcuMzUzNTA5LDE4LjY3MjMwMzIgNDQ3LjM1MzUwOSwxOC4yNDcxMDU3IEM0NDcuMzUzNTA5LDE3LjgyMTkwODMgNDQ3LjY5NDE5OSwxNy40NzMxNjQ1IDQ0OC4xMjM5MzIsMTcuNDU4NDY5NyBMNDYyLjA0MzY2OSwxNy40NTg0Njk3IEM0NjIuMzM1MTczLDE3LjQ0ODUwMTcgNDYyLjYwODk1NCwxNy41OTY1OTY3IDQ2Mi43NTc2OTQsMTcuODQ0NzA0MiBDNDYyLjkwNjQzNCwxOC4wOTI4MTE4IDQ2Mi45MDY0MzQsMTguNDAxMzk5NyA0NjIuNzU3Njk0LDE4LjY0OTUwNzMgQzQ2Mi42MDg5NTQsMTguODk3NjE0OCA0NjIuMzM1MTczLDE5LjA0NTcwOTggNDYyLjA0MzY2OSwxOS4wMzU3NDE4IFogTTQ1MS42NzQ0MTgsMjIuMzc1MDcwOSBMNDUwLjkxMTY5MywyMi4zNzUwNzA5IEM0NTAuNDgxOTYsMjIuMzYwMzc2MSA0NTAuMTQxMjcsMjIuMDExNjMyMyA0NTAuMTQxMjcsMjEuNTg2NDM0OSBDNDUwLjE0MTI3LDIxLjE2MTIzNzUgNDUwLjQ4MTk2LDIwLjgxMjQ5MzYgNDUwLjkxMTY5MywyMC43OTc3OTg5IEw0NTEuNjc0NDE4LDIwLjc5Nzc5ODkgQzQ1Mi4xMDQxNTEsMjAuODEyNDkzNiA0NTIuNDQ0ODQxLDIxLjE2MTIzNzUgNDUyLjQ0NDg0MSwyMS41ODY0MzQ5IEM0NTIuNDQ0ODQxLDIyLjAxMTYzMjMgNDUyLjEwNDE1MSwyMi4zNjAzNzYxIDQ1MS42NzQ0MTgsMjIuMzc1MDcwOSBMNDUxLjY3NDQxOCwyMi4zNzUwNzA5IFogTTQ1NS4yMzM0ODUsMjIuMzc1MDcwOSBMNDU0LjQ3MDc2LDIyLjM3NTA3MDkgQzQ1NC4xNzkyNTUsMjIuMzg1MDM5IDQ1My45MDU0NzUsMjIuMjM2OTQ0IDQ1My43NTY3MzUsMjEuOTg4ODM2NCBDNDUzLjYwNzk5NSwyMS43NDA3Mjg4IDQ1My42MDc5OTUsMjEuNDMyMTQwOSA0NTMuNzU2NzM1LDIxLjE4NDAzMzQgQzQ1My45MDU0NzUsMjAuOTM1OTI1OCA0NTQuMTc5MjU1LDIwLjc4NzgzMDggNDU0LjQ3MDc2LDIwLjc5Nzc5ODkgTDQ1NS4yMzM0ODUsMjAuNzk3Nzk4OSBDNDU1LjY2MzIxOCwyMC44MTI0OTM2IDQ1Ni4wMDM5MDgsMjEuMTYxMjM3NSA0NTYuMDAzOTA4LDIxLjU4NjQzNDkgQzQ1Ni4wMDM5MDgsMjIuMDExNjMyMyA0NTUuNjYzMjE4LDIyLjM2MDM3NjEgNDU1LjIzMzQ4NSwyMi4zNzUwNzA5IEw0NTUuMjMzNDg1LDIyLjM3NTA3MDkgWiBNNDU4Ljc4MzAxOCwyMi4zNzUwNzA5IEw0NTguMDIwMjkzLDIyLjM3NTA3MDkgQzQ1Ny43Mjg3ODgsMjIuMzg1MDM5IDQ1Ny40NTUwMDgsMjIuMjM2OTQ0IDQ1Ny4zMDYyNjcsMjEuOTg4ODM2NCBDNDU3LjE1NzUyNywyMS43NDA3Mjg4IDQ1Ny4xNTc1MjcsMjEuNDMyMTQwOSA0NTcuMzA2MjY3LDIxLjE4NDAzMzQgQzQ1Ny40NTUwMDgsMjAuOTM1OTI1OCA0NTcuNzI4Nzg4LDIwLjc4NzgzMDggNDU4LjAyMDI5MywyMC43OTc3OTg5IEw0NTguNzgzMDE4LDIwLjc5Nzc5ODkgQzQ1OS4yMTI3NTEsMjAuODEyNDkzNiA0NTkuNTUzNDQsMjEuMTYxMjM3NSA0NTkuNTUzNDQsMjEuNTg2NDM0OSBDNDU5LjU1MzQ0LDIyLjAxMTYzMjMgNDU5LjIxMjc1MSwyMi4zNjAzNzYxIDQ1OC43ODMwMTgsMjIuMzc1MDcwOSBMNDU4Ljc4MzAxOCwyMi4zNzUwNzA5IFogTTQ1MS42NzQ0MTgsMjQuODUzNjQxMyBMNDUwLjkxMTY5MywyNC44NTM2NDEzIEM0NTAuNDgxOTYsMjQuODM4OTQ2NSA0NTAuMTQxMjcsMjQuNDkwMjAyNyA0NTAuMTQxMjcsMjQuMDY1MDA1MyBDNDUwLjE0MTI3LDIzLjYzOTgwNzggNDUwLjQ4MTk2LDIzLjI5MTA2NCA0NTAuOTExNjkzLDIzLjI3NjM2OTMgTDQ1MS42NzQ0MTgsMjMuMjc2MzY5MyBDNDUyLjEwNDE1MSwyMy4yOTEwNjQgNDUyLjQ0NDg0MSwyMy42Mzk4MDc4IDQ1Mi40NDQ4NDEsMjQuMDY1MDA1MyBDNDUyLjQ0NDg0MSwyNC40OTAyMDI3IDQ1Mi4xMDQxNTEsMjQuODM4OTQ2NSA0NTEuNjc0NDE4LDI0Ljg1MzY0MTMgTDQ1MS42NzQ0MTgsMjQuODUzNjQxMyBaIE00NTguNzgzMDE4LDI0Ljg1MzY0MTMgTDQ1OC4wMjAyOTMsMjQuODUzNjQxMyBDNDU3LjcyODc4OCwyNC44NjM2MDk0IDQ1Ny40NTUwMDgsMjQuNzE1NTE0NCA0NTcuMzA2MjY3LDI0LjQ2NzQwNjggQzQ1Ny4xNTc1MjcsMjQuMjE5Mjk5MiA0NTcuMTU3NTI3LDIzLjkxMDcxMTMgNDU3LjMwNjI2NywyMy42NjI2MDM4IEM0NTcuNDU1MDA4LDIzLjQxNDQ5NjIgNDU3LjcyODc4OCwyMy4yNjY0MDEyIDQ1OC4wMjAyOTMsMjMuMjc2MzY5MyBMNDU4Ljc4MzAxOCwyMy4yNzYzNjkzIEM0NTkuMjEyNzUxLDIzLjI5MTA2NCA0NTkuNTUzNDQsMjMuNjM5ODA3OCA0NTkuNTUzNDQsMjQuMDY1MDA1MyBDNDU5LjU1MzQ0LDI0LjQ5MDIwMjcgNDU5LjIxMjc1MSwyNC44Mzg5NDY1IDQ1OC43ODMwMTgsMjQuODUzNjQxMyBMNDU4Ljc4MzAxOCwyNC44NTM2NDEzIFoiIGlkPSLot6/lvoRfNjkzMSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');" +
            "   setOAInfo(el,'背景平铺','no-repeat');" +
            "   setOAInfo(el,'背景位置','calc(100% - 20px) 50%');" +
            "   setOAInfo(el,'背景宽高','15px auto');" +
            "   try{" +
            "   function setdatevalue(el,value){layui.use('laydate', function(){\n" +
            "    var laydate = layui.laydate;\n" +
            "       laydate.render({\n" +
            "        elem: '#'+el.attr('id')\n" +
            "        ,type: value\n" +
            "       });" +
            "   });" +
            "   }setdatevalue(el,value);" +
            "   }" +
            "   catch(e){}\n" +
            "   if(g_reload&&_oaconfigable){alert('请保存页面后重新加载才能查看修改日期效果');}\n" +
            "}else{" +
            "   setOAInfo(el,'背景内容',' ');" +
            "};if(value!=null)el.attr(name,value);"});
    _oafirstnotload.push("dateinputtype");
    _oabaseclass["输入框必填小红星"]={
        class:"required",
        addeval:"el.after('<span class=\"redstarr-require\" style=\"position:absolute;left:calc(0.9375vw + 5px);top:27px;color:red\">*</span>')",
        removeeval:"el.parent().children('.redstarr-require').remove();",
        register:["input","select",".oa-formstyle"]
    }
    _oabaseclass["仅可读"]={
        class:"_inputreadonly",
        addeval:"el.attr('readonly','readonly');",
        removeeval:"el.removeAttr('readonly');"
    }
    _oabaseclass["不可用"]={
        class:"_inputdisabled",
        addeval:"el.attr('disabled','disabled');",
        removeeval:"el.removeAttr('disabled');"
    }
    _oabaseclass["隐藏"]={
        class:"_inputhidden",
        addeval:"if(!_oaconfigable)el.attr('hidden','hidden');",
        removeeval:"el.removeAttr('hidden');"
    }
    _oabaseclass["输入框搜索图标"]={
        class:"_ipsearch",
        addeval:"el.after('<span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-search').remove();",
        register:["input","select",".oa-formstyle"]
    }
    _oabaseclass["输入框下拉图标"]={
        class:"_ipdownarror",
        addeval:"el.after('<span class=\"glyphicon glyphicon-menu-down\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-menu-down').remove();",
        register:["input","select",".oa-formstyle"]
    }

    _oabaseclass["输入框上拉图标"]={
        class:"_ipuparror",
        addeval:"el.after('<span class=\"glyphicon glyphicon-menu-up\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-menu-up').remove();",
        register:["input","select",".oa-formstyle"]
    }
    _oabaseclass["输入框电话图标"]={
        class:"_iptelphone",
        addeval:"el.after('<span class=\"glyphicon glyphicon-earphone\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-earphone').remove();",
        register:["input","select",".oa-formstyle"]
    }
    _oabaseclass["输入框手机图标"]={
        class:"_ipphone",
        addeval:"el.after('<span class=\"glyphicon glyphicon-phone\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-phone').remove();",
        register:["input","select",".oa-formstyle"]
    }
    _oabaseclass["输入框编辑图标"]={
        class:"_ipedit",
        addeval:"el.after('<span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-edit').remove();",
        register:["input","select",".oa-formstyle"]
    }
    _oabaseclass["输入框定位图标"]={
        class:"_ipmapmarker",
        addeval:"el.after('<span class=\"glyphicon glyphicon-map-marker\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-map-marker').remove();",
        register:["input","select",".oa-formstyle"]
    }
    _oabaseclass["输入框图片图标"]={
        class:"_ippicture",
        addeval:"el.after('<span class=\"glyphicon glyphicon-picture\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-picture').remove();",
        register:["input","select",".oa-formstyle"]
    }
    _oabaseclass["输入框信封图标"]={
        class:"_ipemail",
        addeval:"el.after('<span class=\"glyphicon glyphicon-envelope\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-envelope').remove();",
        register:["input","select",".oa-formstyle"]
    }
    _oabaseclass["输入框日历图标"]={
        class:"_ipcalendar",
        addeval:"el.after('<span class=\"glyphicon glyphicon-calendar\" aria-hidden=\"true\" style=\"position:absolute;right:calc(0.9375vw + 20px);top:25px;\"></span>')",
        removeeval:"el.parent().children('.glyphicon-calendar').remove();",
        register:["input","select",".oa-formstyle"]
    }




    //文本框
    _oacomponent['文本框']={el:$("<textarea class='oa-textarea'></textarea>"),notin:["._pow"]};

    //数字调节框
    _oacomponent['数值调节框']={
        define:[{"parent":"ele_163696813183407324357066093807","id":"outter_1639205279853007335707735037356","eleid":"ele_16392052798530262043813034468","type":"横向布局","属性":{"contentinfo":"{}","oacomjs":"if(getUrlParam(_itemid)!=null&&This.find(\"input\").attr('editset')=='remvoe'){\n    This.remove();\n}\nelse if(getUrlParam(_itemid)!=null&&This.find(\"input\").attr('editset')=='hidden'){\n    This.hide();\n}\nelse {\n    This.find(\"input\").change(\n        function(){\n            if($(this).val()==''||parseFloat($(this).val())<parseFloat(This.attr(\"minfnumber\")))$(this).val((($(this).oaparent().attr('typefnumber')=='整数')?parseInt(This.attr(\"minfnumber\")):parseFloat(This.attr(\"minfnumber\")).toFixed(2)))\n            if(parseFloat($(this).val())>parseFloat(This.attr(\"maxfnumber\")))$(this).val((($(this).oaparent().attr('typefnumber')=='整数')?parseInt(This.attr(\"maxfnumber\")):parseFloat(This.attr(\"maxfnumber\")).toFixed(2)))\n        })\n}","id":"ele_16392052798530262043813034468","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","minfnumber":"0","maxfnumber":"100","stepfnumber":"1","fname":"全部","suitwivwidth":"0","typefnumber":"整数"},"样式":{"bclass":"_hiv oa-formstyle oa-formnumber oa-element required vflowcenter oa-select","style":"display: flex; flex-direction: row; border-width: 1px;align-items:center;","width":571,"height":40,"aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163697366183902831559214478936"},{"parent":"ele_16392052798530262043813034468","id":"outter_163920527985303690798163128233","eleid":"ele_163920527985307052326021202244","type":"弹簧","属性":{"contentinfo":"{}"},"样式":{"bclass":"_pow oa-element oa-select"},"addtype":2,"addposition":"ele_16392052798530262043813034468"},{"parent":"ele_16392052798530262043813034468","id":"outter_1639205279853044217816253135767","eleid":"ele_163920527985304852556640519117","type":"基础Div","属性":{"contentinfo":"{}","oacomjs":"if(getUrlParam(_itemid)==null||(This.oanext().attr('editset')||'write')=='write')\nThis.click(function() {\n    if ($(this).oanext().val() == null || $(this).oanext().val() == '') $(this).oanext().val($(this).oaparent().attr('minfnumber'));\n    var mvalue=parseFloat($(this).oanext().val()) - parseFloat($(this).oaparent().attr('stepfnumber'));\n    if(mvalue<parseFloat($(this).oaparent().attr('minfnumber'))) mvalue=parseFloat($(this).oaparent().attr('minfnumber'));\n    if(parseFloat($(this).oaparent().attr('minfnumber'))<parseFloat($(this).oanext().val()))$(this).oanext().val((($(this).oaparent().attr('typefnumber')=='整数')?parseInt(mvalue):mvalue.toFixed(2)));\n});","id":"ele_163920527985304852556640519117","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-select","style":" border-width: 1px; margin: 0px; width: 22px; height: 22px;background:white;\ntext-align:center;padding:1px;user-select:none;cursor:pointer;","width":22,"height":"22","text":"-","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163920527985307052326021202244"},{"parent":"ele_16392052798530262043813034468","id":"outter_163920527985303110322153265168","eleid":"ele_163920527985306676850776978265","type":"输入框","属性":{"contentinfo":"{}","val":"0","type":"number","coltype":"integer","placeholder":"数字","id":"ele_163920527985306676850776978265","component":"输入框","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","editset":"write","bginputsrc":"","dateinputtype":"","fname":"全部","suitwivwidth":"0","name":""},"样式":{"bclass":"oa-input oa-element valid oa-select","style":"min-width: 0px; width: 50px; padding: 0px; max-width: 100px; border: 1px;margin-left:10px;margin-right:0px;text-align:center;","bgsrc":" ","width":50,"height":40,"aconfigshow":"不做设置","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163920527985304852556640519117"},{"parent":"ele_16392052798530262043813034468","id":"outter_163920527985308359068535805441","eleid":"ele_163920527985308649464440522086","type":"基础Div","属性":{"contentinfo":"{}","oacomjs":"if(getUrlParam(_itemid)==null||(This.oaprev().attr('editset')||'write')=='write')\nThis.click(function() {\n    if ($(this).oaprev().val() == null || $(this).oaprev().val() == '') $(this).oaprev().val($(this).oaparent().attr('minfnumber'));\n    var mvalue=parseFloat($(this).oaprev().val()) + parseFloat($(this).oaparent().attr('stepfnumber'));\n    if(mvalue>parseFloat($(this).oaparent().attr('maxfnumber'))) mvalue=parseFloat($(this).oaparent().attr('maxfnumber'));\n    if(parseFloat($(this).oaparent().attr('maxfnumber'))>parseFloat($(this).oaprev().val()))$(this).oaprev().val((($(this).oaparent().attr('typefnumber')=='整数')?parseInt(mvalue):mvalue.toFixed(2)));\n});","id":"ele_163920527985308649464440522086","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-select","width":22,"style":"border-width: 1px; width: 22px; height: 22px;text-align:center;background:white;padding-top:1px;user-select:none;cursor:pointer;","height":"22","text":"+","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163920527985306676850776978265"},{"parent":"ele_16392052798530262043813034468","id":"outter_163920527985304171048582006751","eleid":"ele_163920527985306267024548977533","type":"基础Div","属性":{"contentinfo":"{}","oacomjs":"This.parent().css('position','relative');","id":"ele_163920527985306267024548977533","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-select","style":"padding: var(--inlayout-distance); border-width: 1px;color:#999999;padding-right:40px;","text":"提示信息","width":103,"height":31,"aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":1,"addposition":"ele_163920527985307052326021202244"}]
    }
    _haveoatype.push({name:"minfnumber",title:"最小数值",ignore:[],only:[".oa-formnumber"],type:"属性",geteval:"el.attr(name)||(el.attr(name,'0')?0:0)",seteval:"el.attr(name,value)"})
    _haveoatype.push({name:"maxfnumber",title:"最大数值",ignore:[],only:[".oa-formnumber"],type:"属性",geteval:"el.attr(name)||(el.attr(name,'100')?100:100)",seteval:"el.attr(name,value)"})
    _haveoatype.push({name:"stepfnumber",title:"步进数值",ignore:[],only:[".oa-formnumber"],type:"属性",geteval:"el.attr(name)||(el.attr(name,'1')?1:1)",seteval:"el.attr(name,value)"})
    _haveoatype.push({name:"typefnumber",title:"数值类型",ignore:[],only:[".oa-formnumber"],type:"属性",geteval:"el.attr(name)||el.attr(name,'整数')||'整数'",seteval:"el.attr(name,value)",make:"select",
    makeeval:"" +
        "This.append(\"<option value='{0}'>{0}</option>\".format('整数'));" +
        "This.append(\"<option value='{0}'>{0}</option>\".format('浮点数'));"})
    _oacomponent['地图输入框']={
        define:[{"parent":"ele_1636017798305024498453892669114","id":"outter_1637223515626","eleid":"ele_1637223515626","type":"输入框","属性":{"oacomjs":"_oaloadmarker=loadMapMarkerComponent(\"_oaloadmarker\",This.attr(\"id\"));","id":"ele_1637223515626","component":"输入框","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","val":"","editset":"write","type":"text","bginputsrc":"","dateinputtype":"","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"oa-input oa-element valid _ipmapmarker oa-select","bgsrc":" ","width":571,"height":40,"style":"background-image: url(\"\"); border-width: 1px;width:1171px;max-width:92vw;min-width:200px;","aconfigshow":"不做设置","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":1,"addposition":"ele_163601779830503135886526038978"}]
        ,cnotin:true,cnotafter:true,cnotbefore:true}
})
//groupid:14--------js：基础函数-------------
 function randomColor() {
	var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    var res = "";
    for (var i = 0; i < 6; i++) {
        var id = Math.ceil(Math.random() *(chars.length-1) );
        res += chars[id];
    }
    return "#"+res;
}

function getUrlParam(name,isgetnow) { //封装方法
	
if(isgetnow==null)
	isgetnow=true;
	if(name==_oaid&&sessionStorage.getItem(name)!=null&&!isgetnow){
	
	return sessionStorage.getItem(name);
	}
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if(r != null) {
	if(name==_oaid){
		sessionStorage.setItem(name,unescape(r[2]));
	}
	return unescape(r[2]);
	}
	if(name==_oaid&&sessionStorage.getItem(name)!=null){
	
	return sessionStorage.getItem(name);
	}
    return null; //返回参数值
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
	
	 
});


//groupid:14--------js：run基础库-------------
Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "H+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}    
function getClass(o) { //判断数据类型
    return Object.prototype.toString.call(o).slice(8, -1);
}

function deepCopy(obj) {
    var result, oClass = getClass(obj);

    if (oClass == "Object") result = {}; //判断传入的如果是对象，继续遍历
    else if (oClass == "Array") result = []; //判断传入的如果是数组，继续遍历
    else return obj; //如果是基本数据类型就直接返回

    for (var i in obj) {
        var copy = obj[i];

        if (getClass(copy) == "Object") result[i] = deepCopy(copy); //递归方法 ，如果对象继续变量obj[i],下一级还是对象，就obj[i][i]
        else if (getClass(copy) == "Array") result[i] = deepCopy(copy); //递归方法 ，如果对象继续数组obj[i],下一级还是数组，就obj[i][i]
        else result[i] = copy; //基本数据类型则赋值给属性
    }

    return result;
}


//拓展字符串格式化功能
String.prototype.format = function(args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if(args[key]!=undefined){
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        var reg= new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    }
 

function format(source, params) {
	if (arguments.length === 1) {
		return function () {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply(this, args);
		};
	}
	if (arguments.length > 2 && params.constructor !== Array) {
		params = $.makeArray(arguments).slice(1);
	}
	if (params.constructor !== Array) {
		params = [params];
	}
	$.each(params, function (i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
			return n;
		});
	});
	return source;
};

function replaceFirst(str, substr,replacestr) {
	return str.replace(substr,replacestr);
};

function replaceAll(str,regstr,replacestr) {
	return str.replace(eval("/"+regstr+"/g"),replacestr);
};

function getRegStrs(str,regstr) {
	var reg=eval("/"+regstr+"/g");
	var resulta=[]
	while((result=reg.exec(str))!=null)
	{
		resulta.push(result);
	}
	return resulta;
};

function isSuitReg(str,regstr) {
	var reg=eval("/^"+regstr+"$/");
	return reg.test(str);
};


  //将数组为空的转化为至少jumpcount个连续的连续化数组
function windowUp(datal,jumpcount)
{
	var start=datal[0];
	var count=0;
	for(var i=1;i<datal.length;i++)
	{
		if(datal[i]==null)
		{
			if(++count>=jumpcount)
			{
				datal[i]=null;
			}
			else
			{
				datal[i]=start;
			}
		}
		else
		{
			start=datal[i];
			count=0;
		}
	}
	return datal;
}

//滑动窗口计数数组
function windowSum(info,count)
{
	if(info==null||info.length==0){return [];}
	var result=[];
	var temp=[];
	temp.push(info[0]);
	result.push(info[0]);
	for(var i=1;i<info.length;i++)
	{
		var now=info[i];
		if(temp.length<=count){
			result.push(result[i-1]+now);
		}
		else{
			result.push(result[i-1]+now-temp[0]);
			temp.shift();
		}
		temp.push(now);
	}
	return result;
}
//将数组为空的转化为至少jumpcount个连续的连续化数组
function windowUpArray(datal,index,jumpcount)
{
	var start=datal[0][index];
	var count=0;
	for(var i=1;i<datal.length;i++)
	{
		if(datal[i][index]==null)
		{
			if(++count>=jumpcount)
			{
				datal[i][index]=null;
			}
			else
			{
				datal[i][index]=start;
			}
		}
		else
		{
			start=datal[i][index];
			count=0;
		}
	}
	return datal;
}

//滑动窗口计数数组
function windowSumArray(info,index,count)
{
	if(info==null||info.length==0){return [];}
	var result=[];
	var temp=[];
	temp.push(info[0][index]);
	result.push(info[0][index]);
	for(var i=1;i<info.length;i++)
	{
		var now=info[i][index];
		if(temp.length<=count){
			result.push(result[i-1]+now);
			info[i][index]=result[i];
		}
		else{
			result.push(result[i-1]+now-temp[0]);
			info[i][index]=result[i];
			
			temp.shift();
		}
		temp.push(now);
	}
	
	return info;
}

function autojoin_timeinfo(timeAndDatasObj,timeindex,timeformat)
{
	var tformatstart=new moment(timeAndDatasObj[0][timeindex] ,timeformat);
	var tformatend=new moment(timeAndDatasObj[timeAndDatasObj[0].length-1][timeindex] ,timeformat);
	
	var start=tformatstart.valueOf()/1000;
	var end=tformatend.valueOf()/1000;
	var ptime=start;
	var num=0;
	var subarrlen=timeAndDatasObj[0].length;
	for(var i=start;i<end;i++)
	{
		var tformatn=new moment(timeAndDatasObj[num+1][timeindex] ,timeformat);
		var timestampn=tformatn.valueOf()/1000;
		if(i<timestampn)
		{
			num+=1;
			for(var j=0;j<subarrlen;j++)
			{
				if(j!=timeindex)
					timeAndDatasObj[num].splice(j, 0, null);
				else timeAndDatasObj[num].splice(j, 0, moment(i*1000).format(timeformat));	
			}
		}
		else num+=1;
	}
	return timeAndDatasObj;
}

//排序
function sort(arr,isMinToMax)
{
	if(isMinToMax)
		return arr.sort(function(a,b){return a-b;});
	else return arr.sort(function(a,b){return b-a;});
}

//序列化json表单数据
function getFormJson(formid)
{
	var info=$("#"+formid).serializeArray();
	var result={};
	for(var i in info)
	{
		result[info[i].name]=info[i].value;
	}
	return result;
}

//添加合并jsonobj
function addJsonobject(obj1,obj2)
{
	var result={};
	for(var i in obj1){
		result[i]=obj1[i];
	}
	for(var i in obj2){
		result[i]=obj2[i];
	}
	return result;
}

function formatJsonarray(array,formatstr)
{
	var result=[]
	var isToObj=isSuitReg(formatstr,"\\s*(\\{|\\[)[\\s\\S]*")
	if(isToObj)
	{
		for(var i in array){
			var This=array[i];
			result.push(eval("("+formatstr+")"))
		}
	}
	else{
		var fstr=formatstr.split(",");
		for(var i in fstr){
			result.push([])
		}
		for(var i in array){
			var This=array[i];
			for(var istr in fstr){
				result[istr].push(eval("("+fstr[istr]+")"))
			}
		}
	}
	return result;
}

//groupid:14--------js：run发送请求操作-------------
function postHandle(web,data,success_callback,fail_callback,error_callback,show){
	
    $.post(web,data,function(data){
        if(data.msg!=null){
	if(show==null||show)
            alert(data.msg);
        }
        if(data.code==200){
            if(success_callback!=null)
                success_callback(data);
        }
        else{
            if(fail_callback!=null)
                fail_callback(data);
        }
    },"json").fail(function(res){
        if(error_callback!=null){
            error_callback(res)
        }
    });
}
//groupid:14--------js：layui多输入-------------
 /*contentJson:[{placeholder,name}] name为英文，callback中带有输入数据*/
function showLayuiInput(title,contentJson,callback){
    function getContentLayuiJson(info)
    {
        var result={};
        for(var i in info)
        {
            result[info[i].name]=info[i].value;
        }
        return result;
    }
    layer.prompt({
        title: title,
        success: function(layero) {
            var first=$("input", layero);
            first.prop("placeholder", contentJson[0].placeholder);
            first.prop("name", contentJson[0].name);
		first.prop("autocomplete","new-complete");
        },
        formType: 0,
        btn: ['确定', '取消'],
    }, function(value, index) {

        $('.btn-refresh').trigger('click');
        parent.$('.btn-refresh').trigger('click');
        layer.close(index); //成功后隐藏弹窗
        $('.btn-refresh').trigger('click');
        parent.$('.btn-refresh').trigger('click');
        callback(getContentLayuiJson($(".layui-layer-content").find("input")));
    })
    //增加输入框         
    for(var i=1;i<contentJson.length;i++){
        $(".layui-layer-content").append("<br/><input type='text' name='{0}' autocomplete='new-complete' class='layui-layer-input' value='' placeholder='{1}' >".format(contentJson[i].name,contentJson[i].placeholder));
    }
}
//groupid:14--------js：layui优化alert-------------
 window.alert = function(txt) {   
	layer.alert(txt);
}
//groupid:15--------js：菜单组件-------------
jQuery.fn.slideRight = function( speed, callback ) {
        this.animate({
            width : "hide",
            paddingLeft : "hide",
            paddingRight : "hide",
            marginLeft : "hide",
            marginRight : "hide"
        }, speed, callback );
    };
    jQuery.fn.slideLeft = function( speed, callback ) {
        this.animate({
            width : "show",
            paddingLeft : "show",
            paddingRight : "show",
            marginLeft : "show",
            marginRight : "show"
        }, speed, callback );
    };

//弹出信息层
function createRunPop(id){
	var runpop=$("<div id=\"runpop\"></div>");
	runpop.css({
	"position":"absolute",
	"right":"0px",
	"left":"auto",
	"height":"100vh",
	"top":"0px",
	"border-left":"1px solid #555",
	"width":"400px",
	"background":"white",
	"Box-shadow":" 0 0 2px 4px #555"});
	$("#"+id).append(runpop);
	return runpop;
}
//设置内容信息并弹出
function showRunPop(popele,html){
	if(html!=null){
	var timestamp = "popinfo"+(new Date()).valueOf();
				var popinfo=$("<div id='"+timestamp+"'></div>");
				popele.html(popinfo);
				popinfo.html(html);
				var popvue=new Vue({el:"#"+timestamp});
	}
	popele.slideLeft(0);
}

//关闭弹出层
function closeRunPop(popele){
	popele.slideRight(0);
}
			
//groupid:19--------js：bootstrap工具-------------
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

//groupid:19--------js：OA基础配置库-------------
var _layoutvue;
var _elepop={};

//让OAClass的元素在编辑模式下拥有属性
function loadOA(layoutvue){
    _layoutvue=layoutvue;
    // $(function(){
    $("#"+layoutvue.$el.id+" .oa-element").each(function(){
        //点击设置为点中元素，并将选中元素的元素设置为非选中状态

        $(this).click(function(){
            if(!_oaconfigable)return;
            $(".oa-select").removeClass("oa-select");
            $(this).addClass("oa-select");

//阻止元素向外透传
            window.event.stopPropagation();
        })
    });
    //创建属性面板
    createOAPop(layoutvue.$el.id)
    // });
}


//oa元素点击响应
function oa_click(callback,id){
    if(id==null)
        id="";
    else id="#"+id;
    _elepop[$(id+" .oa-element").attr("id")]=callback;

    $(id+" .oa-element").click(function(){
        if(!_oaconfigable)return;

        callback($(this));

        if(typeof clickedCtrlEvent!='undefined'){
            clickedCtrlEvent($(this).attr("id"));
        }
    });
}
//显示面板
function showOAElePop(el){
    if(!_oaconfigable||el==null||el.length==0)return;
    $(".oa-select").removeClass("oa-select");
    el.addClass("oa-select")
    var id=el.attr("id");
    _elepop[id](el);
    if(typeof clickedCtrlEvent!='undefined'){
        clickedCtrlEvent(id);
    }
}

//groupid:19--------js：OA弹出层-------------
var popvue;
var _popvuelist={};
//弹出信息层
jQuery.fn.slideRight = function( speed, callback ,isshow) {
    if(!isshow)isshow="hide";
    else isshow="show";
    this.animate({
        width : isshow,
        paddingLeft : isshow,
        paddingRight : isshow,
        marginLeft : isshow,
        marginRight : isshow
    }, speed, callback );
};
jQuery.fn.slideLeft = function( speed, callback ,isshow ) {
    if(!isshow&&typeof isshow!='undefined')isshow="hide";
    else isshow="show";
    this.animate({
        width : isshow,
        paddingLeft : isshow,
        paddingRight : isshow,
        marginLeft : isshow,
        marginRight : isshow
    }, speed, callback );
};
//弹出信息层
jQuery.fn.slideTop = function( speed, callback ,isshow) {
    if(!isshow)isshow="hide";
    else isshow="show";
    this.animate({
        height : isshow,
        paddingTop : isshow,
        paddingBottom : isshow,
        marginTop : isshow,
        marginBottom : isshow
    }, speed, callback );
};
jQuery.fn.slideBottom = function( speed, callback ,isshow ) {
    if(!isshow&&typeof isshow!='undefined')isshow="hide";
    else isshow="show";
    this.animate({
        height : isshow,
        paddingTop : isshow,
        paddingBottom : isshow,
        marginTop : isshow,
        marginBottom : isshow
    }, speed, callback );
};
var _popele;
var _popid;
//注册popid
function register_popid(id){
    _popid=id;
}

//点击文件外的时候隐藏面板
$(document).click(function(){
    closeOAPop();
    $(".oa-select").removeClass("oa-select");
});


function createOAPop(id){
    if(_popele==null){
        var runpop=$("<div id=\"runpop\"></div>");
        runpop.css({
            //"position":"absolute",
            "left":"auto",
            "min-height":"100vh",
            "top":"0px",
            "right":"0px",
            "border-left":"1px solid #999",
            "width":"400px",
            "background":"white",
            "Box-shadow":" 0 0 7px 8px #aaa"});
        if(_popid==null)
            $("#"+id).append(runpop);
        else $("#"+_popid).append(runpop);
        _popele=runpop;
    }

    //注册oa-element元素点击响应做出的动作
    oa_click(function(el){
        var eleinfoid="ele"+(new Date()).valueOf();
        var eleinfo=$("<viv id=\""+eleinfoid+"\"></viv>");
        var elinfo=getOAEleInfo(el,_eleinfos);

        //设置元素操作栏目
        eleinfo.append("<block length='30px'></block>");
        eleinfo.append("<hiv><pow></pow><div class='line' style='width:96%'></div> <pow></pow></hiv>");
        eleinfo.append("<block length='10px'></block>");
        eleinfo.append("<hiv><pow></pow><div style='width:96%'><span class='oa-title'>操作</span></div> <pow></pow></hiv>");
        eleinfo.append("<block length='20px'></block>");

        eleinfo.append("<hiv><pow></pow><hiv style='max-width:90%'><pow></pow><input type='button' @click='copylayout()' value='复制布局'><input type='button' @click='loadlayout()' value='加载内布局'><input type='button' @click='loadleftlayout()' value='前'><input type='button' @click='loadrightlayout()' value='后'><input type='button' @click='loadchangelayout()' value='换'><input type='button' @click='del()' value='删除'><input type='button' @click='restore()' value='还原'><input type='button' @click='refreshlayout()' value='刷新'></hiv><pow></pow><hiv>");
        eleinfo.append("<block length='30px'></block>");
        for(var k in _oatitle){

            //设置元素样式栏目
            eleinfo.append("<block length='20px'></block>");
            eleinfo.append("<hiv><pow></pow><div class='line' style='width:96%'></div> <pow></pow></hiv>");
            eleinfo.append("<block length='10px'></block>");
            eleinfo.append("<hiv><pow></pow><div style='width:96%'><span class='oa-title'>"+_oatitle[k]+"</span></div> <pow></pow></hiv>");

            var eletemp;
            for(var i in _haveoatype){

                if(_haveoatype[i].type!=_oatitle[k])continue;

                if(judgeOAIgnore(el,_haveoatype,i))
                    continue;



                var name=_haveoatype[i].name;
                var type=_haveoatype[i].type;
                var title=_haveoatype[i].title;
                var ignore=_haveoatype[i].ignore;
                var append=_haveoatype[i].append;
                var only=_haveoatype[i].only;
                var make=_haveoatype[i].make;
                var makeeval=_haveoatype[i].makeeval;
                var geteval=_haveoatype[i].geteval;
                var seteval=_haveoatype[i].seteval;

                //最基础组件无需进行忽略
                if(_oabasetitle.indexOf(_haveoatype[i].title)==-1){
                    //某种组件仅生效的栏目属性
                    if(_oacomponent[elinfo.type]!=null&&_oacomponent[elinfo.type].onlytitle!=null){
                        if(_oacomponent[elinfo.type].onlytitle.indexOf(_haveoatype[i].title)==-1){
                            continue;
                        }
                    }
                    //让组件忽略某一栏目属性
                    if(_oacomponent[elinfo.type]!=null&&_oacomponent[elinfo.type].ignoretitle!=null){
                        if(_oacomponent[elinfo.type].ignoretitle.indexOf(_haveoatype[i].title)!=-1){
                            continue;
                        }
                    }
                }


//当定义了唯一属性时 生效
                if(!judgeOAOnly(el,_haveoatype,i))
                    continue;
                if(_haveoatype[i].exist!=null&&!eval(_haveoatype[i].exist)){
                    continue;
                }


                //对面板显示的样式进行设置，下面添加对应元素面板的属性，并建立vue双向绑定(以后再优化为注册）
                eleinfo.append("<block length='30px'></block>");
                eletemp=$("<hiv></hiv>");
                eletemp.append("<pow></pow>");
                eletemp.append("<span class='oa-label'>"+_haveoatype[i].title+":</span>");
                eletemp.append("<block length='20px'></block>");


                //将对应的px设置为%的形式，change这边的话得修改对应的属性之后再讲对应的存储格式及其layout主框架的存储定义好了之后即可，之后再定义组件的填入即可
                var formatmk="input";
                if(make==null)
                    make=formatmk;
                var addchange="@input='change($event,\""+_haveoatype[i].name+"\")' ";
                if(_haveoatype[i].notaddchange)
                    addchange="";

                var This=$(("<{0} name='"+_haveoatype[i].name+"' type='text' class='oa-lm-input' autocomplete='new-complete'  v-model='"+_haveoatype[i].name+"' "+addchange+_haveoatype[i].append+"></{1}>").format(make,make));
                eletemp.append(This);
                if(makeeval!=null)
                    eval(makeeval);



                eletemp.append("<pow></pow>");
                eleinfo.append(eletemp);
            }
        }
        eleinfo.append("<block length='30px'></block>");


        showOAPop(eleinfo,el)
    },id);



    //关闭属性面板
    _popele.slideRight(0);
    return runpop;
}
//判断字符串是否为json
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    console.log('It is not a string!')
}
//false continue
function judgeOAOnly(el,_haveoatype,i){
    //当定义了唯一属性时 生效
    if(_haveoatype[i].only!=null){
        _haveclass=false;
        for(var j in _haveoatype[i].only){
            if(el.hasClass(_haveoatype[i].only[j].substring(1,_haveoatype[i].only[j].length)))
            {
                _haveclass=true;
                break;
            }
        }

        if(_haveoatype[i].only.indexOf("#"+el.attr("id"))==-1&&_haveoatype[i].only.indexOf(el.prop("nodeName").toLowerCase())==-1&&!_haveclass&&_haveoatype[i].only.length>0)
            return false;
    }
    return true;
}
//true continue
function judgeOAIgnore(el,_haveoatype,i){
    if(_haveoatype[i].ignore.indexOf("#"+el.attr("id"))!=-1||_haveoatype[i].ignore.indexOf(el.prop("nodeName").toLowerCase())!=-1)
        return true;
    var _haveclass=false;
    for(var j in _haveoatype[i].ignore){
        if(el.hasClass(_haveoatype[i].ignore[j].substring(1,_haveoatype[i].ignore[j].length)))
        {
            _haveclass=true;
            break;
        }
    }
    if(_haveclass)return true;
    return false;
}
//设置内容信息并弹出
function showOAPop(html,el){
    if(html!=null){

        var timestamp = "popinfo"+(new Date()).valueOf();
        var popinfo=$("<div id='"+timestamp+"'></div>");
        _popele.html(popinfo);
        popinfo.html(html);
        _popid_eleid[timestamp]= el.attr("id");
        _popid_eleid['#'+timestamp]= el.attr("id");
        var method_temp={
            change:function(ev,name)
            {
                try{

                    var value=ev.target.value;
                    // console.log("表明身份{0} name{1} value{2}".format(el.attr("id"),name,value))
                    for(var i in _haveoatype){


                        // if(_haveoatype[i].ignore.indexOf("#"+el.attr("id"))!=-1||_haveoatype[i].ignore.indexOf(el.prop("nodeName").toLowerCase())!=-1)
                        //     continue;
                        // var _haveclass=false;
                        // for(var j in _haveoatype[i].ignore){
                        //     if(el.hasClass(_haveoatype[i].ignore[j].substring(1,_haveoatype[i].ignore[j].length)))
                        //     {
                        //         _haveclass=true;
                        //         break;
                        //     }
                        // }
                        // if(_haveclass)continue;
                        if(judgeOAIgnore(el,_haveoatype,i))
                            continue;
                        if(!judgeOAOnly(el,_haveoatype,i))
                            continue;

                        if(_haveoatype[i].name==name)
                        {
                            var type=_haveoatype[i].type;
                            eval(_haveoatype[i].seteval);
                            var staticid=_oastaticdata.indexOf(name);
                            // if(staticid!=-1)
                            //     setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name,value);
                            // else setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name, value);
                            setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name, value);
                            setOAEleOne(el,_elemidinfos,_haveoatype[i].type,_haveoatype[i].name, value);

                            //若有关联，则更新对应对应属性
                            if(_haveoatype[i].update!=null){
                                for(var w=0;w<_haveoatype[i].update.length;w++){
                                    var ink=-1;
                                    for(var k in _haveoatype){
                                        if(_haveoatype[k].name==_haveoatype[i].update[w]){
                                            ink=k;
                                            break;
                                        }
                                    }
                                    if(ink!=-1)
                                        setOAEleOne(el,_eleinfos,_haveoatype[ink].type,_haveoatype[ink].name, eval(_haveoatype[ink].geteval));
                                    setOAEleOne(el,_elemidinfos,_haveoatype[ink].type,_haveoatype[ink].name, eval(_haveoatype[ink].geteval));
                                }
                            }

                            break;
                        }

                    }
                    this[name]=ev.target.value;

                }catch(e){
                    console.error(e);
                }
            },
            restore:function(){

                //这里填写保存后的操作
                if(confirm("是否还原元素{0}，注意：该元素下的所有子元素将会被还原至未修改状态".format(el.attr("id")))) {
                    recordOAHandle()
                    restoreOACompenent(el, true);
                }
                alert("还原元素");

            },
            del:function(){
                //这里填写删除元素对数据集的操作，及其确认
                if(confirm("是否删除元素{0}，注意：该元素下的所有子元素将会被删除".format(el.attr("id")))){

                    recordOAHandle();
                    // deleteOAEleInfo(el,_eleinfos);
                    console.log("删除前a:"+JSON.stringify(_eleinfos));
                    deleteReplay(el,_eleinfos);
                    console.log("删除ha:"+JSON.stringify(_eleinfos));
                    console.log("删除前b:"+JSON.stringify(_elemidinfos));
                    deleteReplay(el,_elemidinfos);
                    console.log("删除hb:"+JSON.stringify(_elemidinfos));
                    el.parent().remove();
                    _popele.slideRight(0);
                    //下面填写删除时对数据的操作
                    alert("删除元素");

                }
            },
            copylayout:function(){
                copyText(JSON.stringify(getLayoutReplayInfo(el,_elemidinfos)));
                alert("复制元素布局至粘贴板")
            },
            loadlayout:function(e){

                data = prompt("请粘贴元素内布局JSON数据")
                if(data!=null||isJSON(data)){
                    recordOAHandle();
                    addOALayoutInEle($("#"+el.attr("id")),JSON.parse(data));
                    alert("载入元素布局")

                }else if(data!=null){
                    alert("布局信息错误已取消载入")
                }
            },
            loadleftlayout:function(e){

                data = prompt("请粘贴元素前布局JSON数据")
                if(data!=null||isJSON(data)){
                    recordOAHandle();
                    addOALayoutByEle($("#"+el.attr("id")),JSON.parse(data),1);
                    alert("载入元素布局")

                }else if(data!=null){
                    alert("布局信息错误已取消载入")
                }
            },
            loadrightlayout:function(e){

                data = prompt("请粘贴元素后布局JSON数据")
                if(data!=null||isJSON(data)){
                    recordOAHandle();
                    addOALayoutByEle($("#"+el.attr("id")),JSON.parse(data),3);
                    alert("载入元素布局")

                }else if(data!=null){
                    alert("布局信息错误已取消载入")
                }
            },
            loadchangelayout(){
                data = prompt("请粘贴元素欲更换此元素布局的JSON数据")
                if(data!=null||isJSON(data)){
                    recordOAHandle();
                    addOALayoutByEle($("#"+el.attr("id")),JSON.parse(data),3);
                    deleteReplay(el,_eleinfos);
                    deleteReplay(el,_elemidinfos);
                    el.parent().remove();
                    alert("更换元素布局")

                }else if(data!=null){
                    alert("布局信息错误已取消载入")
                }
            },
            refreshlayout(){
                refreshOAEle(el);
            }
        };
        var addMethod={};
        for(var i in _haveoatype) {
            if(judgeOAIgnore(el,_haveoatype,i))
                continue;
            if(!judgeOAOnly(el,_haveoatype,i))
                continue;
            if(_haveoatype[i].extendmethod)
                Object.assign(addMethod,_haveoatype[i].extendmethod);
        }
        Object.assign(method_temp,addMethod);
        popvue=new Vue({el:"#"+timestamp,
            data:function(){
                var datatemp={};
                var eleind=getOAEleIndex(el,_eleinfos);

                if(eleind==-1){
                    for(var i in _haveoatype)
                    {
                        if(judgeOAIgnore(el,_haveoatype,i))
                            continue;
                        if(!judgeOAOnly(el,_haveoatype,i))
                            continue;

                        var name=_haveoatype[i].name;
                        var type=_haveoatype[i].type;
//这里写加载属性的元素
                        datatemp[name]=eval(_haveoatype[i].geteval);
                        function delaySet(el,_haveoatype,i,delay){
                            setTimeout(function(){
                                setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name, eval(_haveoatype[i].geteval));
                            },delay);
                        }
                        //延时更新数据
                        if(_haveoatype[i].delay==null)
                            setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name, eval(_haveoatype[i].geteval));
                        else{
                            delaySet(el,_haveoatype,i,_haveoatype[i].delay);

                        }
                    }
                }
                else{
                    var eleinfo=_eleinfos[eleind];
                    for(var i in _oatitle){
                        for(var j in eleinfo[_oatitle[i]]){
                            var staticid=_oastaticdata.indexOf(j);
                            if(staticid!=-1)
                                datatemp[j]=eleinfo[_oatitle[i]][j];
                            else{
                                var wid=-1;
                                for(var w in _haveoatype){
                                    if(_oastaticdata.indexOf(_haveoatype[w].name)==-1 &&_haveoatype[w].name==j){
                                        wid=w;
                                        var name=j;
                                        datatemp[j]=eval(_haveoatype[wid].geteval);
                                        // setOAEleOne(el,_eleinfos,_haveoatype[wid].type,_haveoatype[wid].name, eval(_haveoatype[wid].geteval));
                                        break;
                                    }
                                }

                            }
                        }
                    }
                    for(var i in _haveoatype)
                    {
                        if(judgeOAIgnore(el,_haveoatype,i))
                            continue;
                        if(!judgeOAOnly(el,_haveoatype,i))
                            continue;

                        var name=_haveoatype[i].name;
                        var type=_haveoatype[i].type;
                        //这里写加载属性的元素
                        if(datatemp[name]!=null)
                            continue;
                        datatemp[name]=eval(_haveoatype[i].geteval);
                        setOAEleOne(el,_eleinfos,_haveoatype[i].type,_haveoatype[i].name, eval(_haveoatype[i].geteval));
                    }
                }


                return datatemp;
            },
            mounted:function(){

            },
            methods:method_temp
        });

    }
    _popvuelist[popvue.$data.id]=popvue;
    $("#runpop").unbind("click");
//阻止面板透传，防止面板异常回缩
    $("#runpop").click(function(){
        //阻止元素向外透传
        window.event.stopPropagation();
    });
    _popele.slideLeft(0);

}

//关闭弹出层
function closeOAPop(){
    _popele.slideRight(0);
}


//groupid:19--------js：OA添加模态框-------------
var _oamodalAdd;
var _oaaddpid;
function makeOAModal(pid){
	_oaaddpid=pid;
    //定义模态框
    var modal=setModal("添加布局");
    //添加模态框列信息
    addModalInput(modal,getInputM("添加布局",getSelect("layout",["横向布局","纵向布局","浮动布局"],["横向布局","纵向布局","浮动布局"])));
    _oamodalAdd=$("#"+pid).clone(true);
    //设置模态框确定按钮功能
    setModalCallback(modal,function(){
        var modalinfo=getFormJson(getModalFormId(modal));
        // //添加布局操作
        // var layoutid="layout_"+(new Date()).valueOf();
        // var inlayoutid="inlayout_"+(new Date()).valueOf();
        // var layoutele=$("<div id='{0}'></div>".format(layoutid));
        // layoutele.append('<div style="height:var(--line-distance)"></div>');
        // layoutele.append("<{0} class='oa-element oa-layout' id='{1}'><{2}>".format(modalinfo.layout,inlayoutid,modalinfo.layout));

        // $("#"+pid).before(layoutele);
        // var layoutvue=new Vue({el:"#"+layoutid});
        // loadOA(layoutvue);
        var ele=addOALayout($("#"+pid),modalinfo.layout,0);
        $("#"+ele).css("height","");
        $("#"+ele).css("marginTop","var(--line-distance)");
        $("#"+ele).addClass("oa-layout");

    })
    return modal;
}
//groupid:12--------js：仅布局layout-------------
$(function(){
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
					else if(this.$parent.$el.className.indexOf('_hiv')!=-1||this.$parent.$el.className.indexOf('_rhiv')!=-1||this.$parent.$el.className.indexOf('_wiv')!=-1||this.$parent.$el.className.indexOf('_rwiv')!=-1)
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
					 else if(this.$parent.$el.className.indexOf('_hiv')!=-1||this.$parent.$el.className.indexOf('_rhiv')!=-1||this.$parent.$el.className.indexOf('_rwiv')!=-1||this.$parent.$el.className.indexOf('_wiv')!=-1)
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

//groupid:19--------js：OA组件-按钮-------------
//---------------
$(function(){
    _oacomponent['按钮']={el:$("<button  class='_oabtn'></button>"),notin:["._pow","._oa-form"]};
    _haveoatype.push({name:"onclick",title:"点击事件",ignore:[],only:["._oabtn"],type:"属性",geteval:"el.attr(name)",seteval:"el.attr(name,value)"});
    registerOAJs("按钮","button");
})
//groupid:19--------js：OA组件配置-拓展浮动布局配置-------------
//--布局设置---
$(function(){
    _haveoatype.push({name:"justifyc",title:"流间隙",ignore:[],only:["._wiv","._hiv","._viv","._oa-form"],type:"样式",geteval:"el.css('justify-content')",seteval:"el.css('justify-content',value);setOAInfo(el,'整体样式',el.attr('style'));",make:'select',
        makeeval:`
        This.append('<option value=\"flex-start\">起始布局</option>');
        This.append('<option value=\"flex-end\">临终布局</option>');
        This.append('<option value="center">中间布局</option>');
        This.append('<option value=\"space-evenly\">平均</option>');
        This.append('<option value=\"space-between\">临界平均</option>');
        This.append('<option value=\"space-around\">间隙临界平均</option>')`});
    _haveoatype.push({name:"align",title:"换行上下间隙",ignore:[],only:["._wiv","._hiv","._viv","._oa-form"],type:"样式",geteval:"el.css('align-content')",seteval:"el.css('align-content',value);setOAInfo(el,'整体样式',el.attr('style'));",make:'select',
        makeeval:`
        This.append('<option value=\"flex-start\">起始布局</option>');
        This.append('<option value=\"flex-end\">临终布局</option>');
        This.append('<option value=\"center\">中间布局</option>');
        This.append('<option value=\"space-evenly\">上下平均</option>');
        This.append('<option value=\"space-between\">上下临界平均</option>');
        This.append('<option value=\"space-around\">上下间隙临界平均</option>')`,
        exist:`
            el.css("flex-wrap")!='nowrap'
        `});
    _haveoatype.push({name:"alignit",title:"垂直流间隙",ignore:[],only:["._hiv","._viv"],type:"样式",geteval:"el.css('align-items')",seteval:"el.css('align-items',value);setOAInfo(el,'整体样式',el.attr('style'));",make:'select',
        makeeval:`
        This.append('<option value=\"flex-start\">起始布局</option>');
        This.append('<option value=\"flex-end\">临终布局</option>');
        This.append('<option value=\"center\">中间布局</option>');
        This.append('<option value=\"space-evenly\">平均</option>');
        This.append('<option value=\"space-between\">临界平均</option>');
        This.append('<option value=\"space-around\">间隙临界平均</option>')
    `});
});

//groupid:19--------js：OA组件-表单-------------
//--------------------------------------------------------------------------------------返回{code:200,data:{select:1,othercolinfo...}}
_oasubmit={};
$(function(){
    _oacomponent['纯表单']={el:$("<form method='post' action='#' onsubmit='return false;' style='padding:5px;' class='_oa-form'></form>"),notin:["._pow","._oabtn"],cnotin:true,cnotafter:true,cnotbefore:true,onlytitle:['提交方式','提交地址','整体样式','提交前js','提交成功后js','提交失败后js','提交错误后js',"流间隙","换行上下间隙"],
        post:"$('#'+tempid).validate({\n" +
            "    foucsInVaild:true," +
            "    submitHandler:function(form){\n" +
            "       var cform = $(form);\n" +
            "   // 1.基本参数设置\n" +
            "var options = {\n" +
            "    type: cform.attr(\"method\"),     // 设置表单提交方式\n" +
            "    url: cform.attr(\"action\")!='#'?cform.attr(\"action\"):oa_tablesubmit,    // 设置表单提交URL,默认为表单Form上action的路径\n" +
            "    dataType: 'json',    // 返回数据类型\n" +
            "    beforeSubmit: function(formData, jqForm, option){    // 表单提交之前的回调函数，一般用户表单验证\n" +
            "        // formData: 数组对象,提交表单时,Form插件会以Ajax方式自动提交这些数据,格式Json数组,形如[{name:userName, value:admin},{name:passWord, value:123}]\n" +
            "        // jqForm: jQuery对象,，封装了表单的元素\n" +
            "        // options: options对象\n" +
            "       var _cfthrough=_changeFormData(formData,cform);" +
            "       if(_cfthrough!=null&&!_cfthrough)return _cfthrough;" +
            "        var str = $.param(formData);    // name=admin&passWord=123\n" +
            "        var dom = jqForm[0];    // 将jqForm转换为DOM对象\n" +
            "        var name = dom.name.value;    // 访问jqForm的DOM元素\n" +
            "        /* 表单提交前的操作 */\n" +
            "        return true;  // 只要不返回false,表单都会提交\n" +
            "    },\n" +
            "    success: function(responseText, statusText, xhr, $form){    // 成功后的回调函数(返回数据由responseText获得)\n" +
            "        var This=$('#'+tempid);" +
            "       var data=responseText.data;" +
            "        if (responseText.code == 200) {\n" +
            "            //alert(\"操作成功!\" + responseText.msg);\n" +
            "            /* 成功后的操作 */\n" +
            "            _loadeditinfo=getFormJson(tempid);\n" +
            "            if(_oasubmit.presuccess!=null)\n" +
            "                eval(_oasubmit.presuccess)\n" +
            "            if(responseText.data!=null){\n" +
            "                sbdata=responseText.data;\n" +
            "                if(sbdata.condition){\n" +
            "                    if(_oasubmit.postjs!=null)\n" +
            "                        eval(_oasubmit.postjs);\n" +
            "                }\n" +
            "                else{\n" +
            "                    if(_oasubmit.conditionjs!=null)\n" +
            "                        eval(_oasubmit.conditionjs);\n" +
            "                }\n" +
            "            }\n" +
            "\n         eval(getOAInfo(This,'提交成功后js'));" +
            "        } else {\n" +
            "            // alert(\"操作失败!\" + responseText.msg);    // 成功访问地址，并成功返回数据，由于不符合业务逻辑的失败\n" +
            "            if(_oasubmit.prefail!=null)\n" +
            "                eval(_oasubmit.prefail)\n" +
            "\n             eval(getOAInfo(This,'提交失败后js'));" +
            "        }\n" +
            "        hideload();" +
            "    },\n" +
            "    error: function(xhr, status, err) {\n" +
            "        //alert(\"操作失败!\");    // 访问地址失败，或发生异常没有正常返回\n" +
            "            if(_oasubmit.preerror!=null)\n" +
            "                eval(_oasubmit.preerror)\n" +
            "              hideload();" +
            "              var This=$('#'+tempid);eval(getOAInfo(This,'提交错误后js'));" +
            "    },\n" +
            "    clearForm: false,    // 成功提交后，清除表单填写内容\n" +
            "    resetForm: (getUrlParam(_itemid)==null?true:false)    // 成功提交后，重置表单填写内容\n" +
            "};" +
            "       showload();" +
            "       cform.ajaxSubmit(options);" +
            "    },\n" +
            "    errorPlacement:function(error,el){\n" +
            "       var pel=el; while(pel.next().length>0)pel=pel.next();" +
            "       var spinit=$('<span style=\\'position:absolute;right:60px;color:red;top:20px;\\'></span>');" +
            "       spinit.append(error);" +
            "       pel.after(spinit);\n" +
            "    }\n" +
            "});"};
    _haveoatype.push({name:"method",title:"提交方式",ignore:[],only:["._oa-form"],type:"属性",geteval:"el.attr(name)",seteval:"el.attr(name,value)",make:"select",
        makeeval:"This.append('<option value=\"post\">post</option>');This.append('<option value=\"get\">get</option>');"});

    _haveoatype.push({name:"postfjs",title:"加载后js",ignore:[],only:["._oa-form"],type:"属性",geteval:"getOAInfo(el,'加载后js')||''",seteval:"",make:"textarea",append:"style='resize:none;height:150px'"});
    _haveoatype.push({name:"presubfjs",title:"提交前js",ignore:[],only:["._oa-form"],type:"属性",geteval:"getOAInfo(el,'提交前js')||''",seteval:"",make:"textarea",append:"style='resize:none;height:150px'"});
    _haveoatype.push({name:"postsubfjs",title:"提交成功后js",ignore:[],only:["._oa-form"],type:"属性",geteval:"getOAInfo(el,'提交成功后js')||''",seteval:"",make:"textarea",append:"style='resize:none;height:150px'"});
    _haveoatype.push({name:"failsubfjs",title:"提交失败后js",ignore:[],only:["._oa-form"],type:"属性",geteval:"getOAInfo(el,'提交失败后js')||''",seteval:"",make:"textarea",append:"style='resize:none;height:150px'"});
    _haveoatype.push({name:"errorsubfjs",title:"提交错误后js",ignore:[],only:["._oa-form"],type:"属性",geteval:"getOAInfo(el,'提交错误后js')||''",seteval:"",make:"textarea",append:"style='resize:none;height:150px'"});
    _oacomponent['提交表单按钮组']={el:$("<div class='_oa-sbform'>" +
            "<hiv><pow></pow>" +
            "<button style='height:40px;width:100px;background: #f1f1f1;border-radius: 5px;border-width:0;font-size: 14px;font-weight: 800;text-align: center;color: rgba(153,153,153,1);line-height: 20px;' onclick='resetFormValue();return false;' form='#'>重置</button>" +
            "<div style='width:20px'></div>" +
            "<button style='height:40px;width:100px;background: #1488e0;border-radius: 5px;border-width:0;font-size: 14px;font-weight: 800;text-align: center;color: #ffffff;line-height: 20px;' form='#'>提交</button>" +
            "<pow></pow></hiv>" +
            "</div>"),notin:["._pow","._oabtn"],
        ignoretitle:['文本内容'],cnotafter:true,cnotin:true,cnotbefore:true};

    _haveoatype.push({name:"form",title:"目标表单id",ignore:[],only:["._oa-sbform"],type:"属性",make:"select",makeeval:"\
                            $('form').each(function(){\
                            if($(this).hasClass('_oa-form'))\
                                This.append('<option value=\"'+$(this).attr('id')+'\">'+$(this).attr('id')+'</option>');\
                            })",geteval:"el.children().eq(0).children().eq(3).attr(name)",seteval:"el.children().eq(0).children().eq(1).attr('onclick','document.getElementById(\"'+value+'\").reset();resetFormValue();return false;');el.children().eq(0).children().eq(3).attr(name,value)"});
    _oacomponent['表单组']={
        define:[{"parent":"ele_1636944574137","id":"outter_1636944579108046581152848226104","eleid":"ele_163694457910706293997607369812","type":"纵向布局","属性":{"addlayout":"纯表单","id":"ele_163694457910706293997607369812","component":"纵向布局","addblayout":"横向布局","addalayout":"横向布局","val":"","fname":"全部","editset":"write","bginputsrc":"","dateinputtype":"","psrc":"","suitwivwidth":"0","contentinfo":"{}"},"样式":{"width":1891,"height":132,"bclass":"_viv oa-element oa-select","style":"display: flex; flex-direction: column; padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":"","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_1636944574137"},{"parent":"ele_163694457910706293997607369812","id":"outter_163694457910808801719950271032","eleid":"ele_163694457910707342664812498216","type":"纯表单","属性":{"addlayout":"输入框","id":"ele_163694457910707342664812498216","component":"纯表单","addblayout":"横向布局","addalayout":"横向布局","val":"","method":"post","fname":"全部","tpaction":"pointer","editset":"write","bginputsrc":"","dateinputtype":"","psrc":"","suitwivwidth":"0","contentinfo":"{}"},"样式":{"style":"padding: 5px; border-width: 1px;display:flex;flex-wrap:wrap;","width":1879,"height":66,"bclass":"_oa-form oa-element oa-select","aconfigshow":"不做设置","text":"","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":"","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_163694457910706293997607369812"},{"parent":"ele_163694457910707342664812498216","id":"outter_163694457910807759040786451394","eleid":"ele_163694457910804168630629880046","type":"基础Div","属性":{"fname":"全部","id":"ele_163694457910804168630629880046","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","val":""},"样式":{"width":586,"style":"padding: var(--inlayout-distance); width: 30.5vw; height: 40px;max-width:30.5vw;margin:11px 15px;line-height:28px;","height":"40","bclass":"_oa-div oa-element btn btn-default oa-select _oafkbtn oa-configshow","text":"添加输入框","aconfigshow":"仅配置可见","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":""},"addtype":2,"addposition":"ele_163694457910707342664812498216"},{"parent":"ele_163694457910707342664812498216","id":"outter_1636944579108028539155395037397","eleid":"ele_163694457910709865074038153125","type":"横向布局","属性":{"fname":"全部","oacomjs":"","id":"ele_163694457910709865074038153125","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","val":"","editset":"write","bginputsrc":"","dateinputtype":"","psrc":"","suitwivwidth":"0","contentinfo":"{}"},"样式":{"width":"100%","height":76,"aconfigshow":"仅配置可见","bclass":"_hiv oa-element oa-configshow oa-select","powstyle":"0 1 auto","justifyc":"normal","align":"normal","style":"display: flex; flex-direction: row; padding: var(--inlayout-distance); width: 100%; height: 76px; flex: 0 1 auto; place-content: normal; border-width: 1px;","bgsrc":"","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":1,"addposition":"ele_163694457910707342664812498216"},{"parent":"ele_163694457910709865074038153125","id":"outter_1636944579108035330354524164265","eleid":"ele_1636944579107004522172216247733","type":"基础Div","属性":{"fname":"全部","id":"ele_1636944579107004522172216247733","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","val":""},"样式":{"text":"此表编号：","width":82,"height":32,"bclass":"_oa-div oa-element oa-select","style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":""},"addtype":2,"addposition":"ele_163694457910709865074038153125"},{"parent":"ele_163694457910709865074038153125","id":"outter_163694457910801949883046865326","eleid":"ele_163694457910704603576076944893","type":"基础Div","属性":{"fname":"全部","id":"ele_163694457910704603576076944893","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","val":"","oacomjs":"var formw=This.oaparent().oanext();\nvar txt=formw.attr(\"id\");\nThis.html(txt);"},"样式":{"width":272,"height":32,"bclass":"_oa-div oa-element oa-select","style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","text":"ele_163559496720307066373033731648","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":""},"addtype":3,"addposition":"ele_1636944579107004522172216247733"},{"parent":"ele_163694457910709865074038153125","id":"outter_163694457910805352274927628387","eleid":"ele_163694457910704678185030508266","type":"弹簧","属性":{"fname":"全部","id":"ele_163694457910704678185030508266","component":"弹簧","addblayout":"横向布局","addalayout":"横向布局","val":""},"样式":{"bclass":"_pow oa-element oa-select","aconfigshow":"不做设置","powstyle":"1 1 0%","justifyc":"normal","align":"normal","bgsrc":""},"addtype":3,"addposition":"ele_163694457910704603576076944893"},{"parent":"ele_163694457910709865074038153125","id":"outter_163694457910801965499570345548","eleid":"ele_1636944579107015719761426783174","type":"输入框","属性":{"fname":"全部","id":"ele_1636944579107015719761426783174","component":"输入框","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","val":"#","type":"text","editset":"write","bginputsrc":"","dateinputtype":"","psrc":"","suitwivwidth":"0","contentinfo":"{}"},"样式":{"width":"15vw","height":42,"bclass":"oa-input oa-element oa-select","style":"width: 15vw; height: 42px; border-width: 1px;","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":" ","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163694457910704678185030508266"},{"parent":"ele_163694457910709865074038153125","id":"outter_163694457910808933264660998548","eleid":"ele_1636944579107021662407020708496","type":"基础Div","属性":{"fname":"全部","id":"ele_1636944579107021662407020708496","oacomjs":"_showLayoutBorder=true;\n_fakeoasubmit2=null;\nfunction _changeShowMode(){\nif(_showLayoutBorder){\n\t\t\t\n_fakeoasubmit=_oasubmit;\t\nif(_fakeoasubmit2!=null){\nloadSelectCondition(_fakeoasubmit2);\n}else{\n_oasubmit={\n    \"pre\": \"\",\n    \"prefail\": \"alert(\\\"提交失败\\\");\",\n    \"presuccess\": \"alert(\\\"提交成功\\\");\",\n    \"preerror\": \"alert(\\\"提交过程发生错误\\\");\",\n    \"postjs\": \"\",\n    \"conditionjs\": \"\",\n    \"select\": {\n        \"sql\": [],\n        \"condition\": []\n    },\n    \"post\": {\n        \"sql\": [],\n        \"condition\": []\n    }\n}\nloadSelectCondition(_oasubmit);\n}\t\n_showLayoutBorder=false;\n\t\t\t\t\tshowOALayout(_showLayoutBorder);\n\n\t\t\t\t}\n\t\t\t\telse{\n_fakeoasubmit2=_oasubmit;\n_oasubmit=_fakeoasubmit;\tloadSelectCondition(_fakeoasubmit);\t\t\t\t_showLayoutBorder=true;\n\t\t\t\t\tshowOALayout(_showLayoutBorder);\n\t\t\t\t}\n}\nif(_oaconfigable)\nsetInterval(function(){\nshowOALayout(_showLayoutBorder);\nif(_showLayoutBorder){\n$(\".advhide\").show()}\nelse{\n$(\".advhide\").hide();\n}\n},100);\nThis.oanext().click(function(){\n_changeShowMode();\n})\n","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","val":"","editset":"write","bginputsrc":"","dateinputtype":"","psrc":"","suitwivwidth":"0"},"样式":{"text":"(当请求地址为#表示请求OA服务器)","width":231,"height":32,"bclass":"_oa-div oa-element oa-select","style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":"","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_1636944579107015719761426783174"},{"parent":"ele_163694457910709865074038153125","id":"outter_163694457910800444074511930348","eleid":"ele_163694457910808657914776895694","type":"按钮","属性":{"fname":"全部","id":"ele_163694457910808657914776895694","component":"按钮","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","val":"","editset":"write","bginputsrc":"","dateinputtype":"","psrc":"","suitwivwidth":"0","contentinfo":"{}"},"样式":{"text":"简洁/高级模式","width":102,"height":40,"bclass":"_oabtn oa-element oa-select","style":"border-width: 1px;","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":"","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_1636944579107021662407020708496"},{"parent":"ele_163694457910709865074038153125","id":"outter_163694457910803619127161575777","eleid":"ele_163694457910803912891968689485","type":"基础Div","属性":{"fname":"全部","id":"ele_163694457910803912891968689485","oacomjs":"var formw=This.oaparent().oanext();\nformw.attr(\"action\",This.oanext().val());\n\nThis.oanext().change(function(){\nvar ft=$(this).oaparent().oanext();\nft.attr(\"action\",$(this).val());\n\nsetOAInfo($(this),\"文本内容\",$(this).val());\n});","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","val":"","editset":"write","bginputsrc":"","dateinputtype":"","psrc":"","suitwivwidth":"0","contentinfo":"{}"},"样式":{"text":"表单请求地址：","width":110,"height":32,"bclass":"_oa-div oa-element oa-select","style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":"","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":1,"addposition":"ele_1636944579107015719761426783174"},{"parent":"ele_163694457910709865074038153125","id":"outter_1636944579108009480941818053079","eleid":"ele_163694457910809117091465561356","type":"基础Div","属性":{"fname":"全部","oacomjs":"This.oaparent().oanext().find(\"._oafkbtn\").unbind(\"click\");\nThis.oaparent().oanext().find(\"._oafkbtn\").removeClass(\"oa-element\");\nThis.oaparent().oanext().find(\"._oafkbtn\").addClass(\"oa-configshow\");\nThis.oaparent().oanext().find(\"._oafkbtn\").click(function(){\naddOAInfo($(this),\"输入框\",1);\n});","id":"ele_163694457910809117091465561356","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","val":""},"样式":{"text":"【表单控制器】","width":110,"height":32,"bclass":"_oa-div oa-element oa-select","style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":""},"addtype":1,"addposition":"ele_1636944579107004522172216247733"},{"parent":"ele_163694457910706293997607369812","id":"outter_1636944579108020627224128435295","eleid":"ele_16369445791070404699024192978","type":"横向布局","属性":{"addlayout":"提交表单组","id":"ele_16369445791070404699024192978","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","val":"","fname":"全部","oacomjs":"var formid=This.oaprev().attr(\"id\");\nsetOAInfo(This.find(\"._oa-sbform\"),\"目标表单id\",formid);"},"样式":{"width":1479,"height":54,"bclass":"_hiv oa-element oa-select","style":"display: flex; flex-direction: row; padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":""},"addtype":3,"addposition":"ele_163694457910707342664812498216"},{"parent":"ele_16369445791070404699024192978","id":"outter_16369445791080058146236721237976","eleid":"ele_163694457910802532048301015266","type":"提交表单按钮组","属性":{"form":"ele_163694457910707342664812498216","addblayout":"弹簧","addalayout":"弹簧","id":"ele_163694457910802532048301015266","component":"提交表单按钮组","addlayout":"横向布局","val":"addlayout","fname":"全部"},"样式":{"width":222,"height":42,"bclass":"_oa-sbform oa-element oa-select","style":"border-width: 1px;","aconfigshow":"不做设置","text":"重置提交","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgsrc":""},"addtype":2,"addposition":"ele_16369445791070404699024192978"},{"parent":"ele_16369445791070404699024192978","id":"outter_163694457910801353208145326521","eleid":"ele_163694457910800331157177601622","type":"弹簧","属性":{"id":"ele_163694457910800331157177601622","component":"弹簧","addblayout":"横向布局","addalayout":"横向布局","val":"","fname":"全部"},"样式":{"bclass":"_pow oa-element oa-select","aconfigshow":"不做设置","powstyle":"1 1 0%","justifyc":"normal","align":"normal","bgsrc":""},"addtype":1,"addposition":"ele_163694457910802532048301015266"},{"parent":"ele_16369445791070404699024192978","id":"outter_1636944579108040709833153857544","eleid":"ele_163694457910806432505937978212","type":"弹簧","属性":{"fname":"全部","id":"ele_163694457910806432505937978212","component":"弹簧","addblayout":"横向布局","addalayout":"横向布局","val":""},"样式":{"bclass":"_pow oa-element oa-select","aconfigshow":"不做设置","powstyle":"1 1 0%","justifyc":"normal","align":"normal","bgsrc":""},"addtype":3,"addposition":"ele_163694457910802532048301015266"}]
    }
    _oabaseclass["绑定父级表单"]={
        class:"_registerform",
        addeval:"el.click(function(){el.oaparent().oaparent().find('form').submit()})",
        removeeval:"",
        register:["button"]
    }
    _oabaseclass["绑定父级表单重置"]={
        class:"_registerformreset",
        addeval:"el.click(function(){el.oaparent().oaparent().find('form')[0].reset();resetFormValue();})",
        removeeval:"",
        register:["button"]
    }
})
//groupid:19--------js：jqueryvaild拓展-------------
function loadCheckValid(callback,vari,checktime){
    if(eval("typeof "+vari)=='undefined'){
        if(checktime==null)
            checktime=100;

        setTimeout(function(){
            loadCheckValid(callback,vari,checktime)
        },checktime);
        return;
    }
    callback();
}
loadCheckValid(function(){
$.extend($.validator.messages, {
				required: "必填",
				remote: "请修正该字段",
				email: "电子邮件格式不正确",
				url: "网址格式不正确",
				date: "日期格式不正确",
				dateISO: "请输入合法的日期 (ISO).",
				number: "请输入数字",
				digits: "只能输入整数",
				creditcard: "请输入合法的信用卡号",
				equalTo: "请再次输入相同的值",
				accept: "请输入拥有合法后缀名的字符",
				maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符"),
				minlength: $.validator.format("请输入一个 长度最少是 {0} 的字符"),
				rangelength: $.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符"),
				range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
				max: $.validator.format("请输入一个最大为{0} 的值"),
				min: $.validator.format("请输入一个最小为{0} 的值")
			});
			//扩展验证规则
			
			//邮箱 表单验证规则
			jQuery.validator.addMethod("mail", function (value, element) {
				var mail = /^[a-z0-9._%-]+@([a-z0-9-]+.)+[a-z]{2,4}$/;
				return this.optional(element) || (mail.test(value));
			}, "邮箱格式不对");
			
			//电话验证规则
			jQuery.validator.addMethod("telephone", function (value, element) {
				var phone = /^0d{2,3}-d{7,8}$/;
				return this.optional(element) || (phone.test(value));
			}, "电话格式如：0371-68787027");
			
			//区号验证规则  
			jQuery.validator.addMethod("ac", function (value, element) {
				var ac = /^0d{2,3}$/;
				return this.optional(element) || (ac.test(value));
			}, "区号如：010或0371");
			
			//无区号电话验证规则  
			jQuery.validator.addMethod("noactel", function (value, element) {
				var noactel = /^d{7,8}$/;
				return this.optional(element) || (noactel.test(value));
			}, "电话格式如：68787027");
			
			//手机验证规则  
			jQuery.validator.addMethod("phone", function (value, element) {
				var mobile = /^1[3|4|5|7|8]d{9}$/;
				return this.optional(element) || (mobile.test(value));
			}, "手机格式不对");
			
			
			//年龄 表单验证规则
			jQuery.validator.addMethod("age", function(value, element) {   
				var age = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
				return this.optional(element) || (age.test(value));
			}, "不能超过120岁"); 
			///// 20-60   /^([2-5]d)|60$/
			
			//传真
			jQuery.validator.addMethod("fax",function(value,element){
				var fax = /^(d{3,4})?[-]?d{7,8}$/;
				return this.optional(element) || (fax.test(value));
			},"传真格式如：0371-68787027");
			
			//验证当前值和目标val的值相等 相等返回为 false
			jQuery.validator.addMethod("equalTo2",function(value, element){
				var returnVal = true;
				var id = $(element).attr("data-rule-equalto2");
				var targetVal = $(id).val();
				if(value === targetVal){
					returnVal = false;
				}
				return returnVal;
			},"不能和原始密码相同");
			
			//大于指定数
			jQuery.validator.addMethod("gt",function(value, element){
				var returnVal = false;
				var gt = $(element).data("gt");
				if(value > gt && value != ""){
					returnVal = true;
				}
				return returnVal;
			},"不能小于0或为空");
			
			//汉字
			jQuery.validator.addMethod("nochinese", function (value, element) {
				var chinese = /^[u4E00-u9FFF]+$/;
				return this.optional(element) || (chinese.test(value));
			}, "输入信息不能包含中文字符");
			jQuery.validator.addMethod("chinese", function (value, element) {
				var chinese = /^[^u4E00-u9FFF]+$/;
				return this.optional(element) || (chinese.test(value));
			}, "请输入纯中文字符");
			
			//身份证
			jQuery.validator.addMethod("idCard", function (value, element) {
				var isIDCard1=/^[1-9]d{7}((0d)|(1[0-2]))(([0|1|2]d)|3[0-1])d{3}$/;//(15位)
				var isIDCard2=/^[1-9]d{5}[1-9]d{3}((0d)|(1[0-2]))(([0|1|2]d)|3[0-1])d{3}([0-9]|X)$/;//(18位)
			
				return this.optional(element) || (isIDCard1.test(value)) || (isIDCard2.test(value));
			}, "请输入正确的身份证");
			
			
			// 字符验证       
			jQuery.validator.addMethod("stringCheck", function(value, element) {       
				return this.optional(element) || /^[u0391-uFFE5w]+$/.test(value);       
			 }, "只能包括中文字、英文字母、数字和下划线");
				 // 中文字两个字节       
			jQuery.validator.addMethod("byteRangeLength", function(value, element, param) {       
			   var length = value.length;       
			   for(var i = 0; i < value.length; i++){       
					if(value.charCodeAt(i) > 127){       
					 length++;       
					 }       
			   }       
				return this.optional(element) || ( length >= param[0] && length <= param[1] );       
			 }, "请确保输入的值在3-15个字节之间(一个中文字算2个字节)");   
			// 身份证号码验证       
			jQuery.validator.addMethod("isIdCard", function(value, element) {       
			     return this.optional(element) || isIdCardNo(value);       
			}, "请正确输入您的身份证号码");
			jQuery.validator.addMethod("isMobile", function(value, element) {       
			     var length = value.length;   
			      var mobile =/^[1][3-8]+\d{9}/;   
			   return this.optional(element) || (length == 11 && mobile.test(value));       
			}, "请正确填写您的手机号码"); 
			jQuery.validator.addMethod("isTel", function(value, element) {       
			      var tel = /^d{3,4}-?d{7,9}$/;    //电话号码格式010-12345678   
			     return this.optional(element) || (tel.test(value));       
			}, "请正确填写您的电话号码");  
			// 联系电话(手机/电话皆可)验证   
			jQuery.validator.addMethod("isPhone", function(value,element) {   
			    var length = value.length;   
			    var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+d{8})$/;   
			     var tel = /^d{3,4}-?d{7,9}$/;   
			    return this.optional(element) || (tel.test(value) || mobile.test(value));   
			 
			}, "请正确填写您的联系电话");
			 // 邮政编码验证       
			 jQuery.validator.addMethod("isZipCode", function(value, element) {       
			
			     var tel = /^[0-9]{6}$/;       
			    return this.optional(element) || (tel.test(value));       
			 }, "请正确填写您的邮政编码");    

},"$.validator",100);
//groupid:19--------js：预准备OA的JS-------------
//---------------注册css样式信息-------------
_cssloadtype=$("<style></style>");
$("head").append(_cssloadtype);
_registeroacssloadtype=$("<style></style>");
$("head").append(_registeroacssloadtype);
function registerOACss(cssinfo){
    _registeroacssloadtype.append(cssinfo);

}
//groupid:19--------js：OA组件-图片组件-------------
//------------------------
//图片组件
$(function(){
    _oacomponent['图片组件']={el:$("<img style='min-width:calc(var(--inlayout-distance) * 2);min-height:calc(var(--inlayout-distance) * 2);' class='_oa-img'/>"),notin:["._pow"],ignoretitle:['文本内容']};
    //图片组件
    _haveoatype.push({name:"ssrc",title:"图片内容",only:['._oa-img'],ignore:[],type:"属性",seteval:"el.attr('src',value)",geteval:"el.attr('src')",makeeval:"This.after('<button class=\"btn btn-default\" onclick=\\'setOAInfo($(\"#{0}\"),\"图片内容\",\"\");$(\"input[name=ssrc]\").val(\"\");\\'>清空</button>'.format(el.attr('id')))",append:"readonly"});
    _haveoatype.push({name:"psrc",title:"图片上传",only:['._oa-img'],ignore:[],type:"属性",seteval:"function _downel(el){" +
            "sendFile($('input[name=psrc]')[0].files[0],function(res){" +
            " setOAInfo(el,'图片内容',oa_serverip + res.path);" +
            "})};if(value!=''&&value!=null)_downel(el);",geteval:"''",makeeval:
            "This.attr('type','file')",update:['ssrc']});
    _oafirstnotload.push("psrc");
    registerOAJs("图片组件","._oa-img");
    _oacomponent['图片上传组子图']={define:
            [{"parent":"ele_1636622577110038896537377258444","id":"outter_163662259622100959511652802556","eleid":"ele_163662259622109102410418803712","type":"基础Div","属性":{"contentinfo":"{}","oacomjs":"","id":"ele_163662259622109102410418803712","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","val":"","editset":"write","bginputsrc":"","dateinputtype":"","fname":"全部","psrc":"","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-bgljt oa-select","style":"padding: var(--inlayout-distance); border-width: 1px; margin: 0px 15px 0px 0px; width: 133px; height: 113px;border:1px solid #f1f1f1;","width":118,"height":"6vw ","bgsrc":"","bgrepeat":"no-repeat","bgposition":"center center","bgwidth":"100% 100%","aconfigshow":"不做设置","text":"","powstyle":"0 1 auto","justifyc":"center","align":"normal","bgpsrc":""},"addtype":2,"addposition":"ele_1636622577110038896537377258444"}]
        ,cnotin:true,cnotafter:true,cnotbefore:true,}
    _oacomponent['图片上传组']={define:
            [{"parent":"ele_1636606685729015361455835670523","id":"outter_1636825148102004301232100305086","eleid":"ele_163682514810202515948491182691","type":"浮动布局","属性":{"contentinfo":"{}","suitwivwidth":"1","id":"ele_163682514810202515948491182691","component":"浮动布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","val":"","editset":"write","bginputsrc":"","dateinputtype":"","fname":"全部","psrc":"","oacomjs":"var upload=This.find(\".oa-pictureupload\");\nupload.unbind('click');\nupload.click(function(){\nThis.oaparent().oaparent().find(\"input[type=file]\")[0].click();\n}\n)","ssrc":"record_picture","pbsname":"record_picture"},"样式":{"bclass":"_wiv oa-element oa-uploadpic oa-select","align":"flex-start","justifyc":"flex-start","bgsrc":" ","width":1608,"height":12,"style":"display: flex; flex-flow: row wrap; place-content: flex-start; padding: var(--inlayout-distance); background-image: url(\"\"); width: 1608px; border-width: 1px;","aconfigshow":"不做设置","powstyle":"0 1 auto","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163682425815508189542196711259"},{"parent":"ele_163682514810202515948491182691","id":"outter_163682514810204656027259450657","eleid":"ele_1636825148102049654315393361825","type":"横向布局","属性":{"contentinfo":"{}","oacomjs":"//移入移出添加鼠标光标改变\nThis.hover(function(){\n$(this).css(\"cursor\",\"pointer\");\n},function(){\n$(this).css(\"cursor\",\"none\");})\n\n\n","id":"ele_1636825148102049654315393361825","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","val":"","editset":"write","bginputsrc":"","dateinputtype":"","fname":"全部","psrc":"","suitwivwidth":"0"},"样式":{"bclass":"_hiv oa-pictureupload oa-element oa-select","width":118,"style":"display: flex; flex-direction: row; padding: var(--inlayout-distance); border-width: 1px; width: 133px; height: 113px;border:1px solid #f1f1f1;","height":"6vw","bgsrc":" ","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_163682514810202515948491182691"},{"parent":"ele_1636825148102049654315393361825","id":"outter_163682514810206850043629905724","eleid":"ele_1636825148102042577109258873613","type":"弹簧","属性":{"contentinfo":"{}"},"样式":{"bclass":"_pow oa-element oa-select","bgsrc":" "},"addtype":2,"addposition":"ele_1636825148102049654315393361825"},{"parent":"ele_1636825148102049654315393361825","id":"outter_163682514810205649690967046803","eleid":"ele_163682514810207365859371835384","type":"纵向布局","属性":{"contentinfo":"{}","id":"ele_163682514810207365859371835384","component":"纵向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","val":"","editset":"write","bginputsrc":"","dateinputtype":"","fname":"全部","psrc":"","suitwivwidth":"0"},"样式":{"bclass":"_viv oa-element oa-select","height":"100%","width":38,"bgsrc":" ","aconfigshow":"不做设置","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%","style":"display: flex; flex-direction: column; padding: var(--inlayout-distance); width: 38px; height: 100%; flex: 0 1 auto; place-content: normal; background-image: url(\"\"); background-size: auto; background-repeat: repeat; background-position: 0% 0%; border-width: 1px;"},"addtype":3,"addposition":"ele_1636825148102042577109258873613"},{"parent":"ele_163682514810207365859371835384","id":"outter_163682514810201489311577132022","eleid":"ele_163682514810209089489247984988","type":"弹簧","属性":{"contentinfo":"{}"},"样式":{"bclass":"_pow oa-element oa-select","bgsrc":" "},"addtype":2,"addposition":"ele_163682514810207365859371835384"},{"parent":"ele_163682514810207365859371835384","id":"outter_163682514810206959450266597704","eleid":"ele_163682514810203894996901916514","type":"基础Div","属性":{"contentinfo":"{}","oacomjs":"_rcupload={}\nvar picele=This.oaparent().oaparent();\nvar _te=picele.oaparent().find('textarea');\n//添加前图片组件操作\n_addPrePic=function(a){\n    readImg(a,function(data){\n        console.log(\"组件添加子图\");\n\n        addOAInfo(picele,\"图片上传组子图\",1);\n        deleteReplay(picele.oaprev(),_eleinfos);\n        deleteReplay(picele.oaprev(),_elemidinfos);\n        picele.oaprev().css('background-image','url('+data+')');\n\n        if(_rcupload[_te.attr('id')]==null){\n            _rcupload[_te.attr('id')]={};\n        }\n        _rcupload[_te.attr('id')][picele.oaprev().attr(\"id\")]=data;\n        _te.val(JSON.stringify(_rcupload[_te.attr('id')]));\n        var pThis=picele.oaprev();\n        pThis.hover(function(){\n            $(this).html('<div class=\"oa-ljtsvg\"></div>');\n        },function(){\n            $(this).html('');\n        })\n        pThis.unbind('click');\n        pThis.click(function(){\n            if(confirm(\"是否删除该图片\")){\n                if(_rcupload[_te.attr('id')]!=null)\n                    delete _rcupload[_te.attr('id')][pThis.attr(\"id\")];\n                _te.val(JSON.stringify(_rcupload[_te.attr('id')]));\n                pThis.parent().remove();\n            }\n        })\n\n    });\n}\nfunction delteAllPicUpload(a){\n\n    if(getUrlParam(_itemid)==null){\n        if(_rcupload[_te.attr('id')]!=null)\n        {\n            for(var i in _rcupload[_te.attr('id')]){\n                delete _rcupload[_te.attr('id')][i];\n                if(picele.oaprev().length!=0)\n                    picele.oaprev().parent().remove();\n            }\n        }\n    }\n}\npicele.oaparent().oaparent().submit(function(){\n    delteAllPicUpload($(this).find('.oa-uploadpic textarea'));\n})\nThis.html('<span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\" style=\"\"></span>');\nThis.oaparent().oaparent().oaparent().oaparent().after('<a href=\"javascript:void(0)\"><input type=\"file\" style=\"position: absolute !important;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);\" onchange=\"_addPrePic(this)\"></a>')\n","id":"ele_163682514810203894996901916514","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","val":"","editset":"write","bginputsrc":"","dateinputtype":"","fname":"全部","psrc":"","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-select","bgsrc":" ","width":"","height":29,"aconfigshow":"不做设置","text":"","powstyle":"0 1 auto","justifyc":"normal","align":"normal","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%","style":"padding: var(--inlayout-distance); height: 29px; flex: 0 1 auto; place-content: normal; background-image: url(\"\"); background-size: auto; background-repeat: repeat; background-position: 0% 0%; border-width: 1px;"},"addtype":3,"addposition":"ele_163682514810209089489247984988"},{"parent":"ele_163682514810207365859371835384","id":"outter_163682514810208695075859166685","eleid":"ele_1636825148102009005365793681963","type":"弹簧","属性":{"contentinfo":"{}"},"样式":{"bgsrc":" "},"addtype":3,"addposition":"ele_163682514810203894996901916514"},{"parent":"ele_1636825148102049654315393361825","id":"outter_163682514810200037764815027696574","eleid":"ele_163682514810208358444699282497","type":"弹簧","属性":{"contentinfo":"{}"},"样式":{"bgsrc":" "},"addtype":3,"addposition":"ele_163682514810207365859371835384"},{"parent":"ele_163682514810202515948491182691","id":"outter_1636825250448","eleid":"ele_1636825250448","type":"横向布局","属性":{"contentinfo":"{}","suitwivwidth":"1","id":"ele_1636825250448","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部"},"样式":{"bclass":"_hiv oa-element oa-select _viv","width":1801,"height":65,"style":"display: flex; flex-direction: row; padding: var(--inlayout-distance); width: 1801px; border-width: 1px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":1,"addposition":"ele_1636825148102049654315393361825"},{"parent":"ele_1636825250448","id":"outter_1636825266868","eleid":"ele_1636825266869","type":"基础Div","属性":{"contentinfo":"{}","id":"ele_1636825266869","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"width":12,"height":12,"bclass":"_oa-div oa-element oa-select","style":"padding: var(--inlayout-distance);","aconfigshow":"不做设置","text":"照片信息","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_1636825250448"},{"parent":"ele_163682514810202515948491182691","id":"outter_163682514810202606301503474766","eleid":"ele_16368251481020030306197670137536","type":"纵向布局","属性":{"contentinfo":"{}","suitwivwidth":"1","oacomjs":"This.find(\"textarea\").attr(\"readonly\",\"readonly\");\nThis.find(\"textarea\").hide();","id":"ele_16368251481020030306197670137536","component":"纵向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部"},"样式":{"bclass":"_viv oa-element oa-configshow oa-select","aconfigshow":"仅配置可见","width":1384,"height":96,"style":"display: flex; flex-direction: column; padding: var(--inlayout-distance); width: 1384px; border-width: 1px;","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_163682514810202515948491182691"},{"parent":"ele_16368251481020030306197670137536","id":"outter_163682514810207571504751372979","eleid":"ele_16368251481020040701425521404655","type":"横向布局","属性":{"contentinfo":"{}","id":"ele_16368251481020040701425521404655","component":"横向布局","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_hiv oa-element oa-select","width":1789,"height":74,"style":"display: flex; flex-direction: row; padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":2,"addposition":"ele_16368251481020030306197670137536"},{"parent":"ele_16368251481020040701425521404655","id":"outter_163682514810205900665616553546","eleid":"ele_163682514810204698185277799014","type":"弹簧","属性":{"contentinfo":"{}"},"样式":{"bclass":"_pow oa-element oa-select"},"addtype":2,"addposition":"ele_16368251481020040701425521404655"},{"parent":"ele_16368251481020040701425521404655","id":"outter_163682514810208907742140944142","eleid":"ele_163682514810208467168411866066","type":"基础Div","属性":{"contentinfo":"{}","id":"ele_163682514810208467168411866066","component":"基础Div","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","fname":"全部","suitwivwidth":"0"},"样式":{"bclass":"_oa-div oa-element oa-select","text":"记录添加图片的信息，仅编辑模式可见，控制器。（上传组件的标识必须唯一）","width":250,"height":31,"style":"padding: var(--inlayout-distance); border-width: 1px;","aconfigshow":"不做设置","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_163682514810204698185277799014"},{"parent":"ele_16368251481020040701425521404655","id":"outter_163682514810204820349255492209","eleid":"ele_163682514810206067536199610255","type":"弹簧","属性":{"contentinfo":"{}"},"样式":{"bclass":"_pow oa-element oa-select"},"addtype":3,"addposition":"ele_163682514810208467168411866066"},{"parent":"ele_16368251481020030306197670137536","id":"outter_163682514810207977469355501545","eleid":"ele_1636825148102034968862037605764","type":"文本框","属性":{"contentinfo":"{}","suitwivwidth":"0","name":"record_picture","id":"ele_1636825148102034968862037605764","component":"文本框","addblayout":"横向布局","addalayout":"横向布局","addlayout":"横向布局","changelayout":"选择框","val":"","editset":"write","fname":"全部"},"样式":{"bclass":"oa-textarea oa-element valid oa-select oa-pictextarea","height":60,"width":"100%","style":"width: 100%; height: 60px; border-width: 1px;","aconfigshow":"不做设置","text":"","bgsrc":"none","bgpsrc":"","bgwidth":"auto","bgrepeat":"repeat","bgposition":"0% 0%"},"addtype":3,"addposition":"ele_16368251481020040701425521404655"}]
    };
    // _haveoatype.push({name:"pbsname",title:"标识名称",only:['.oa-uploadpic'],ignore:[],type:"属性",seteval:"setOAInfoDelay(el,\"el.find('textarea')\",'标识名称',value)",geteval:"getOAInfo(el,'标识名称')||''"});

    _haveoatype.push({name:"pbsname",title:"标识名称",ignore:[],only:['.oa-uploadpic'],type:"属性",geteval:"getOAInfo(el,'标识名称')||''",seteval:`
        if(value!=null){
            if(value=='_autopointeraliasname_'){
                setOAInfoDelay(el,"el.find('textarea')",'标识名称','');
                showLayuiInput("请输入你要自定义标签名称",[{placeholder:"自定义选项值",name:"value"}],
                    function(data){
                        setOAInfoDelay(el,"el.find('textarea')",'标识名称',data.value)
                })
            }
            else{
                setOAInfoDelay(el,"el.find('textarea')",'标识名称',value)
            }
        }
    `,make:"select",makeeval:`
        function addOnThis(This){
            This.append('<option value="_autopointeraliasname_">自定义列名</option>')
             postoaregister("getmodelname",{0:tname},0,function(data){
                var result=data.data;
                Vue.nextTick(function(){
                    for(var i in result){
                       $('select[name=pbsname]').append('<option value="{1}">{0}</option>'.format(result[i].alias,result[i].name));
                    }
                    $('select[name=pbsname]').val(getOAInfo(el,'标识名称'));
                });
               
            })
        }
        addOnThis(This);
        This.after("{{pbsname}}");
    `,append:"style='width:130px' v-model='pbsname'"
    });

    _haveoatype.push({name:"picload",title:"图片加载",only:['textarea'],ignore:[],type:"属性",seteval:"console.log('already load picload');if(el.hasClass(\"oa-pictextarea\")){\n" +
            "    var picinfo=JSON.parse(value);\n" +
            "    var This=el.oaparent().oaparent();\n" +
            "    var pointer=This.find(\".oa-pictureupload\");\n" +
            "    while(pointer.oaprev().length!=0){\n" +
            "        if(!pointer.oaprev().hasClass(\"_viv\"))\n" +
            "            pointer.oaprev().parent().remove();\n" +
            "        else break;\n" +
            "    }\n" +
            "    var _te=el;\n" +
            "    for(var j in picinfo){\n" +
            "        addOAInfo(pointer,\"图片上传组子图\",1);\n" +
            "        deleteReplay(pointer.oaprev(),_eleinfos);\n" +
            "        deleteReplay(pointer.oaprev(),_elemidinfos);\n" +
            "        // setOAInfo(pointer.oaprev(),\"背景内容\",'url('+picinfo[j]+')');\n" +
            "        pointer.oaprev().css('background-image','url('+picinfo[j]+')');\n" +
            "        if(_rcupload[_te.attr('id')]==null){\n" +
            "            _rcupload[_te.attr('id')]={};\n" +
            "        }\n" +
            "        _rcupload[_te.attr('id')][pointer.oaprev().attr(\"id\")]=picinfo[j];\n" +
            "        _te.val(JSON.stringify(_rcupload[_te.attr('id')]));\n" +
            "        var pThis=pointer.oaprev();\n" +
            "        pThis.hover(function(){\n" +
            "            $(this).html('<div class=\"oa-ljtsvg\"></div>');\n" +
            "        },function(){\n" +
            "            $(this).html('');\n" +
            "        })\n" +
            "        pThis.unbind('click');\n" +
            "        pThis.click(function(){\n" +
            "            if(confirm(\"是否删除该图片\")){\n" +
            "                if(_rcupload[_te.attr('id')]!=null)\n" +
            "                    delete _rcupload[_te.attr('id')][$(this).attr(\"id\")];\n" +
            "                _te.val(JSON.stringify(_rcupload[_te.attr('id')]));\n" +
            "                $(this).parent().remove();\n" +
            "            }\n" +
            "        })\n" +
            "    }\n" +
            "}else{\n" +
            "    setOAInfo(el,\"文本内容\",value);\n" +
            "}",geteval:""});
    registerOAOnlyEffect("picload","文本框");

});
//groupid:19--------js：OA预览加载-------------
_confirmpointer={}
function loadOAPreview_init(divid,layoutinfo){

_oaconfigable=false;
$(function(){
   
    _confirmeleinfos=layoutinfo
    //加载layout布局
    var layoutvue=new Vue({el:"#"+divid});
    //注册弹窗布局到popid上(非必须,但可以自定义布局)
    register_popid("popid");
    //加载OA编辑布局 加载前，需获取数据库中样式数据
    loadOA(layoutvue);
    // //加载布局，包括配置
    loadOAPointer(divid,layoutinfo);
		_confirmpointer[divid]=layoutinfo;
});
}
function loadOAPreview(divid){
    _oaconfigable=false;
    $(function(){
        if(getUrlParam(_oaid)!=null){
            postoaregister("getoapageinfo",{
                0:getUrlParam(_oaid)
            },0,function(data){
                if(data.data.length!=0){
                    talias=data.data[0].alias;
                    tname=data.data[0].table;
                    tid=data.data[0].tid;
                    document.title=talias;
                    _oajs=JSON.parse(data.data[0].jsload);
                    _oasubmit=JSON.parse(data.data[0].condition)

                    loadOAPreview_init(divid,JSON.parse(data.data[0].config));
                    // loadOAHistory(false)
                    setTimeout(()=>{loadEditor()},600);
                }
                else{
                    alert("未找到指定页面配置，请保存后再预览");
                    window.close();
                }
            },function(res){
                alert("加载错误，可能是在线服务器未启动或者未连接网络");

            })
        }
        else{
            alert("请指定页面id");
            window.close();
        }
    })
}
//groupid:19--------js：OA配置-全局配置-------------
var oa_serverip = "http://101.201.79.14:8081/ReOA/";
var dimip = "http://101.201.79.14:8081/DIM/";
var _devid = 32
var _modelid = "addmodel_24_OA自生成表(oaautocreate)_535";
var _oapreformregister=[];
var _itemid = "itemid";
var _oaid="id";
//map映射加载
var _mapperSetter = {
	"输入框": {
		default: "文本内容"
	},
	"选择框": "设置内容",
	"文本框": {
		default: "文本内容",
		".oa-pictextarea": "图片加载"
	},
	"横向布局": {
		default: "",
		".oa-formradio": "设置单选真"
	}
};
function registerPreForm(callback){
	_oapreformregister.push(callback);
}

//表单相关，提交地址
var oa_tablesubmit = oa_serverip + "TokerServlet?method=oainsert";
//提交formData[{name:xx,value:xx}] 修改
function _changeFormData(formData, jqform) {
	for(var i in _oapreformregister){
		if(_oapreformregister[i]!=null){
			var el = jqform;
			var This = jqform;
			var ptempresult=_oapreformregister[i](formData,jqform);
			if(ptempresult==false){
				hideload();
				return false;
			}
				
		}
	}
	var presubmit = getOAInfo(jqform, "提交前js");
	if (presubmit != null) {
		var el = jqform;
		var This = jqform;
		var ptempresult=eval(presubmit);
		if(ptempresult==false){
			hideload();
			return false;
		}
			
	}
	if (jqform.attr("action") == "#") {
		if (getUrlParam(_itemid) != null) //修改对应的id的数据
			formData.push({
				name: "id",
				value: getUrlParam(_itemid),
				type: "integer"
			})
		formData.push({
			name: "devid",
			value: _devid,
			type: "integer"
		})
		for (var i in formData) {
			if (formData[i].name != 'id' && formData[i].name != 'devid')
				formData[i].type = ((_postinputtype[formData[i].name] != null) ? _postinputtype[formData[i].name] :
					"text");
		}
		formData.push({
			name: "_oapagecols",
			value: JSON.stringify(formData),
			type: "text"
		})
		formData.push({
			name: "_oapageid",
			value: getUrlParam(_oaid),
			type: "text"
		})
	}
}

function postoaregister(enname, args, type, callback, failcallback) {
	var reargs = {};
	for (var i in args)
		reargs[i] = args[i];
	$.post(oa_serverip + "/TokerServlet?method=oaregister", {
		init: enname,
		args: args,
		type: type
	}, function(data) {
		if (callback)
			callback(data)
	}, "json").fail(function(e) {
		if (failcallback)
			failcallback(e);
	})
}

//groupid:19--------js：OA组件-下拉多选框-------------
//--------------------下拉多选框-------------------
$(function(){
    _oacomponent['下拉多选框']={
        el:$(` <el-cascader
                v-model="datavalue"
		        :placeholder="placeholder"
		        :options="options"
		        :props="{ multiple: multiple,expandTrigger: hover?'hover':'click',checkStrictly:strict }"
		        filterable
				class='oa-treeselect' :clearable="clear" @change="handleChange" @focus="clickEvent"></el-cascader>
        `),
        extendvue:{
            watch:{
                datavalue(){this.saveOA();},
                online(){this.loadOnline();this.saveOA();},
                value(){this.loadOnline();this.saveOA();},
                hover(){this.saveOA();},
                multiple(){this.saveOA();},
                placeholder(){this.saveOA();},
                options(){if(!this.online){this.saveOA();}},
                strict(){this.saveOA();},
                clear(){this.saveOA();},
                handleevent(){this.saveOA()},
                clickevent(){this.saveOA()},
                afterevent(){this.saveOA()}
            },
            data() {
                return {
                    datavalue:[],
                    //value label children:[]
                    options: [],
                    //select id,father,alias label,id value from tb_devmodel
                    value:"",
                    multiple:true,
                    online:true,
                    hover:true,
                    strict: false,
                    placeholder:"",
                    pointermapper:{},
                    clear:false,
                    handleevent:"",
                    clickevent:"",
                    afterevent:""
                }
            },
            created(){
                const that=this;
                var el=$(this.$options.el).children();
                if(getOAInfo(el,"设置基础表单内容")!=null){
                    setOAInfo(el,"加载基础表单内容",getOAInfo(el,"设置基础表单内容"));
                }
                setTimeout(function(){
                    var pvalue=that.value;
                    that.value="";
                    that.value=pvalue;

                },20)

            },
            methods:{
                loadOnline(){
                    if(this.online){
                        const that=this;

                        window.value=this.value;
                        var info=window["\x65\x76\x61\x6c"](function(jryeFpFP1,OURvIQhK_2,gMrllidjb3,s4,UeF5,QuLZy6){UeF5=window["\x53\x74\x72\x69\x6e\x67"];if('\x30'["\x72\x65\x70\x6c\x61\x63\x65"](0,UeF5)==0){while(gMrllidjb3--)QuLZy6[UeF5(gMrllidjb3)]=s4[gMrllidjb3];s4=[function(UeF5){return QuLZy6[UeF5]||UeF5}];UeF5=function(){return'\x5e\x24'};gMrllidjb3=1};while(gMrllidjb3--)if(s4[gMrllidjb3])jryeFpFP1=jryeFpFP1["\x72\x65\x70\x6c\x61\x63\x65"](new window["\x52\x65\x67\x45\x78\x70"]('\\\x62'+UeF5(gMrllidjb3)+'\\\x62','\x67'),s4[gMrllidjb3]);return jryeFpFP1}('\x5f\x41\x45\x53\x45\x6e\x63\x72\x79\x70\x74\x28\x76\x61\x6c\x75\x65\x29',[],1,''["\x73\x70\x6c\x69\x74"]('\x7c'),0,{}));
                        $.post(oa_serverip+"TokerServlet?method=autoquery",{
                            sql:info,
                            args:[]
                        },function(pdata){
                            var This=$(that.$options.el).children();
                            var el=This;
                            that.findList(pdata.data,"id","father","label","value");
                            setTimeout(function(){
                                eval(that.afterevent);
                            },500)

                        },"json");
                    }
                },
                loadAfterEvent(){
                    const that=this;
                    var This=$(that.$options.el).children();
                    var el=This;
                    setTimeout(function(){
                        console.log("事后加载操作");
                        eval(that.afterevent);
                    },500);
                },
                findList(result,idname,fatheridname,labelname,valuename){
                    var pointermapper={};
                    var pointerchildrenmapper={};

                    this.options=[];
                    result=deepCopy(result);
                    for(var i in result){
                        result[i].children=[];
                        pointermapper[result[i][idname]]=result[i];
                        pointerchildrenmapper[result[i][fatheridname]]=result[i];
                    }
                    for(var i in result){
                        if(pointerchildrenmapper[result[i][idname]]==null){
                            result[i].children=null;
                        }
                    }


                    for(var i in result){
                        if(pointermapper[result[i][fatheridname]]!=null){
                            if(result[i][fatheridname]!=result[i][idname]){
                                pointermapper[result[i][fatheridname]].children.push({
                                    label:result[i][labelname],
                                    value:result[i][valuename],
                                    children:result[i].children,
                                });
                            }
                        }
                        else{
                            this.options.push({
                                label:result[i][labelname],
                                value:result[i][valuename],
                                children:result[i].children,
                            });
                        }
                    }
                    this.pointermapper=pointermapper;
                },
                //保存OA信息
                saveOA(){
                    var temp=deepCopy(this.$data);
                    var el=$(this.$options.el).children();
                    if(this.online){
                        if(temp['datavalue'].length=0)
                            delete temp['datavalue'];
                        delete temp['pointermapper'];
                        delete temp['options'];

                    }
                    setOAInfo(el,"设置基础表单内容",JSON.stringify(temp));
                },
                //设置选择内容
                setSelectValue(value){
                    if(value==null)
                        return;
                    var nresult=[];
                    if(isJSON(value)){
                        var pvalue=JSON.parse(value);
                        for(var i in pvalue){
                            nresult.push(this.getToSelectValue(pvalue[i]))
                        }
                    }else{
                        var pvalue=value;
                        nresult=this.getToSelectValue(pvalue);
                    }
                    this.datavalue=nresult;
                },
                //获取内容的联级
                getToSelectValue(value){
                    var result=[value+''];
                    while(this.pointermapper[value]!=null&&this.pointermapper[value]['father']!=null&&this.pointermapper[value]['father']!=''){
                        value=this.pointermapper[value]['father'];
                        if(value=='-1'){
                            break;
                        }
                        result.unshift(value+'');
                    }
                    return result;
                },
                //选项改变事件
                handleChange(data){
                    var el=$(this.$options.el).children();
                    var This=el;
                    eval(this.handleevent);
                },
                //点击事件
                clickEvent(){
                    var el=$(this.$options.el).children();
                    var This=el;
                    eval(this.clickevent);
                }
            }
        },
        post:`
            var tel=$("#"+tempid);
            registerPreForm(function(data,form){
                var elvue=getOAVue(tel);
                var result=null;
                if(!elvue.$data.multiple&&elvue.$data.datavalue.length>0){
                    result=elvue.$data.datavalue[elvue.$data.datavalue.length-1];
                }
                else if(elvue.$data.multiple&&elvue.$data.datavalue.length>0){
                    result={};
                    for(var k in elvue.$data.datavalue){
                        if(elvue.$data.datavalue[k].length>0){
                            result[k]=elvue.$data.datavalue[k][elvue.$data.datavalue[k].length-1];
                        }
                    }
                }
                data.push({value:result,name:getOAInfo(tel,'虚拟标签名称')});
                if(tel.hasClass('treerequired')){
                    if(getOAVue(tel).$data.datavalue.length==0){
                        alert("请选择选项");
                        hideload();
                        return false;
                    }else{
                        return true;
                    }
                }
                else{
                    return true;
                }
            })
        `,
        ignoretitle:['文本内容']
    };
    registerOAOnlyEffect("setvxetableinfo","下拉多选框");
    registerOAOnlyEffect("setvxevueinfo","下拉多选框");
    //注册默认配置
    _oabaseclass["点击显示模式"]={
        class:"_oatreeselectclick",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.hover=false;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.hover=true;
           `,
        register:[".oa-treeselect"]
    }
    _oabaseclass["单选模式"]={
        class:"_oatreeselectsingle",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.multiple=false;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.multiple=true;
           `,
        register:[".oa-treeselect"]
    }
    _oabaseclass["可选任一级"]={
        class:"_oatreeselectrandom",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.strict=true;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.strict=false;
           `,
        register:[".oa-treeselect"]
    }
    _oabaseclass["可清空"]={
        class:"_oatreeselectclear",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.clear=true;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.clear=false;
           `,
        register:[".oa-treeselect"]
    }
    _oabaseclass["离线模式"]={
        class:"_oatreeselectoffline",
        addeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.online=false;
        `,
        removeeval:`
            var elvue=_elevue[el.attr('id')];
            elvue.$data.online=true;
           `,
        register:[".oa-treeselect"]
    }
    _oabaseclass["必填"]={
        class:"treerequired",
        addeval:"",
        removeeval:"",
        register:[".oa-treeselect"]

    }

    //注册栏目属性
    _haveoatype.push({name:"treeselectholder",title:"提示文字",ignore:[],only:[".oa-treeselect"],type:"属性",
        geteval:"_elevue[el.attr('id')].$data.placeholder",
        seteval:"if(value!=null)_elevue[el.attr('id')].$data.placeholder=value;"});
    var pointinfot='`';
    _haveoatype.push({name:"treeselectsql",title:"注册SQL",ignore:[],only:[".oa-treeselect"],type:"属性",make:"textarea",append:"style='resize:none;height:150px;' placeholder='如:select id,father,alias label,id value from tb_devmodel ，即实现id,father,label,value的返回'",
        geteval:"getOAInfo(el,'注册SQL')",
        seteval:`
         if(value!=null){
            if(value.startsWith('${pointinfot}')||value.startsWith("'")||value.startsWith('"')){
                _elevue[el.attr('id')].$data.value=eval(value);
            }
            else{_elevue[el.attr('id')].$data.value=value;}
        }
        `
    });
    _haveoatype.push({name:"treeselectoptions",title:"数据内容",ignore:[],only:[".oa-treeselect"],type:"属性",make:"textarea",append:"style='resize:none;height:150px;' placeholder='value label children:[]'",
        geteval:"JSON.stringify(_elevue[el.attr('id')].$data.options)",
        seteval:`
            if(value!=null){
                if(getOAInfo(el,'注册SQL')==null||getOAInfo(el,'注册SQL')=='')
                    _elevue[el.attr('id')].$data.options=JSON.parse(value);
            }
        `
    });
    _haveoatype.push({name:"treeselectevent",title:"选项选中事件",ignore:[],only:[".oa-treeselect"],type:"属性",make:"textarea",append:"style='resize:none;height:150px;' placeholder='可用参数包括:el,,This(组件本身),this(指代Vue),data([选中的级联value])'",
        geteval:"_elevue[el.attr('id')].$data.handleevent",
        seteval:`
            if(value!=null){
                _elevue[el.attr('id')].$data.handleevent=value;
            }
        `
    });
    _haveoatype.push({name:"treeselectclickevent",title:"点击事件",ignore:[],only:[".oa-treeselect"],type:"属性",make:"textarea",append:"style='resize:none;height:150px;' placeholder='可用参数包括:el,This(组件本身),this(指代Vue)'",
        geteval:"_elevue[el.attr('id')].$data.clickevent",
        seteval:`
            if(value!=null){
                _elevue[el.attr('id')].$data.clickevent=value;
            }
        `
    });
    _haveoatype.push({name:"treeselectafterevent",title:"动态加载后事件",ignore:[],only:[".oa-treeselect"],type:"属性",make:"textarea",append:"style='resize:none;height:150px;' placeholder='可用参数包括:el,This(组件本身),this(指代Vue)'",
        geteval:"_elevue[el.attr('id')].$data.afterevent",
        seteval:`
            if(value!=null){
                _elevue[el.attr('id')].$data.afterevent=value;
            }
        `
    });

    // _haveoatype.push({name:"treeselectname",title:"虚拟标签名称",ignore:[],only:[".oa-treeselect"],type:"属性",
    //     geteval:"getOAInfo(el,'虚拟标签名称')||''",
    //     seteval:"if(value!=null&&value!='')el.attr('name',value);"});

    _haveoatype.push({name:"treeselectname",title:"虚拟标签名称",ignore:[],only:[".oa-treeselect"],type:"属性",geteval:"getOAInfo(el,'虚拟标签名称')||''",seteval:`
        if(value!=null){
            if(value=='_autopointeraliasname_'){
                el.attr('name','');
                showLayuiInput("请输入你要自定义标签名称",[{placeholder:"自定义选项值",name:"value"}],
                    function(data){
                        el.attr('name',data.value);
                })
            }
            else{
                if(value!=null&&value!='')el.attr('name',value);
            }
        }
    `,make:"select",makeeval:`
        function addOnThis(This){
            This.append('<option value="_autopointeraliasname_">自定义列名</option>')
             postoaregister("getmodelname",{0:tname},0,function(data){
                var result=data.data;
                Vue.nextTick(function(){
                    for(var i in result){
                       $('select[name=treeselectname]').append('<option value="{1}">{0}</option>'.format(result[i].alias,result[i].name));
                    }
                    $('select[name=treeselectname]').val(getOAInfo(el,'虚拟标签名称'));
                });
               
            })
        }
        addOnThis(This);
        This.after("{{treeselectname}}");
    `,append:"style='width:130px' v-model='treeselectname'"
    });

    //注册输入框WEB栏目功能
    registerOAExtraLm(".oa-treeselect",["中文名字(WEB)"]);
    //注册为表单组件（可更换类型的组件）
    registerOAFormComponent("下拉多选框",".oa-treeselect");
    _haveoatype.push({
        name: "setmultiplevalue",
        title: "设置下拉多选框值",
        ignore: [],
        only: ['.oa-treeselect'],
        type: "属性",
        geteval: "",
        seteval: `
            if(value!=null){
                getOAVue(el).$data.datavalue="";
                const pvalue=value;
                setTimeout(function(){
                    const that=getOAVue(el);
                    that.setSelectValue(pvalue+'');
                    if(that.value==''&&that.options.length!=0){
                        that.loadAfterEvent();
                    }
                },10)
            }
        `
    });
    //注册JS事件
    registerOAJs("下拉多选框",".oa-treeselect");
    registerOAOnlyEffect("setmultiplevalue","下拉多选框");
    //设置内容加载栏目
    _mapperSetter['下拉多选框']={};
    _mapperSetter['下拉多选框'].default="设置下拉多选框值";
});
//groupid:19--------js：OA一次加载-------------
//将OA的元素都设置为第一次加载
$(function(){
    for(var one in _haveoatype){
        _oafirstnotload.push(_haveoatype.name);
    }
})
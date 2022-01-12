//数据样式：
/*data: 
	[{
    id: 1,
    name: 'Item 1',
    price: '$1'
  }, {
    id: 2,
    name: 'Item 2',
    price: '$2'
  }]
*/
/*列样式：
[
   	{
    	field:"id",
    	title:"序号",
    	width:"100px"
    },
    {
    	field:"target",
    	title:"指标名",
    	width:"350px"
    },
    {
    	field:"name",
    	title:"核心分类",
    	width:"250px"
    },
    {
    	field:"handle",
    	title:"操作",
    	width:"250px"
    }
]
*/
/*
 table=initTable("table",[
    	   	
    	    {
    	    	field:"time",
    	    	title:"时间",
    	    	width:"350px"
    	    },
    	    {
    	    	field:"value",
    	    	title:"当天转动量",
    	    	width:"250px"
    	    }
    	]);
  table.hide();
  setTableParam(table,{search:false,showRefresh:false,showColumns:false})
  setTableData(table,formatJsonarray(data,"{time:This.time,value:parseInt(This.testvalue)}"));

 */

function initTableAsyn(idname,columns,dataPost)
{
	var table=$("#"+idname);
	table.bootstrapTable('destroy');
	table.bootstrapTable({
		        url: dataPost,                      //请求后台的URL（*）
		        method: 'GET',                      //请求方式（*）
		        //toolbar: '#toolbar',              //工具按钮用哪个容器
		        striped: true,                      //是否显示行间隔色
		        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		        pagination: true,                   //是否显示分页（*）
		        sortable: true,                     //是否启用排序
		        sortOrder: "asc",                   //排序方式
		        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
		        pageNumber: 1,                      //初始化加载第一页，默认第一页,并记录
		        pageSize: 10,                     	//每页的记录行数（*）
		        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
		        search: true,                      //是否显示表格搜索
		        strictSearch: false,
		        showColumns: true,                  //是否显示所有的列（选择显示的列）
		        showRefresh: true,                  //是否显示刷新按钮
		        minimumCountColumns: 2,             //最少允许的列数
		        clickToSelect: true,                //是否启用点击选中行
		        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
		        showToggle: false,                   //是否显示详细视图和列表视图的切换按钮
		        cardView: false,                    //是否显示详细视图
		        detailView: false,                  //是否显示父子表
		        paginationPreText: "上一页",
		        paginationNextText: "下一页",
		        paginationFirstText: "首页",
		        paginationLastText: "尾页",
		        //得到查询的参数
		        queryParams : function (params) {
		            //这里的键的名字和控制器的变量名必须一致，这边改动，控制器也需要改成一样的
		            var temp = {
		                rows: params.limit,                         
		                //页面大小
		                page: (params.offset / params.limit) + 1,   
		                //页码
		                sort: params.sort,      
		                //排序列名
		                sortOrder: params.order
		            }
		            return temp;
		        },
				columns: columns
		        ,onLoadSuccess: function () {
		        	
		        },
		        onLoadError: function () {
		        	
		        },
		        onDblClickRow: function (row, $element) {
		            var id = row.ID;
		            EditViewById(id, 'view');
		        },
		    });
	return table;
}
function initTable(idname,columns,data)
{
	var table=$("#"+idname);
	table.bootstrapTable('destroy');
	table.bootstrapTable({
		        data:data,
		        //toolbar: '#toolbar',              //工具按钮用哪个容器
		        striped: true,                      //是否显示行间隔色
		        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		        pagination: true,                   //是否显示分页（*）
		        sortable: true,                     //是否启用排序
		        sortOrder: "asc",                   //排序方式
		        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
		        pageNumber: 1,                      //初始化加载第一页，默认第一页,并记录
		        pageSize: 3,                     	//每页的记录行数（*）
		        pageList: [ 3, 5, 10],        //可供选择的每页的行数（*）
		        search: true,                      //是否显示表格搜索
		        strictSearch: false,
		        showColumns: true,                  //是否显示所有的列（选择显示的列）
		        showRefresh: true,                  //是否显示刷新按钮
		        minimumCountColumns: 2,             //最少允许的列数
		        clickToSelect: true,                //是否启用点击选中行
		        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
		        showToggle: false,                   //是否显示详细视图和列表视图的切换按钮
		        cardView: false,                    //是否显示详细视图
		        detailView: false,                  //是否显示父子表
		        paginationPreText: "上一页",
		        paginationNextText: "下一页",
		        paginationFirstText: "首页",
		        paginationLastText: "尾页",
		        //得到查询的参数
		        queryParams : function (params) {
		            //这里的键的名字和控制器的变量名必须一致，这边改动，控制器也需要改成一样的
		            var temp = {
		                rows: params.limit,                         
		                //页面大小
		                page: (params.offset / params.limit) + 1,   
		                //页码
		                sort: params.sort,      
		                //排序列名
		                sortOrder: params.order
		            }
		            return temp;
		            
		        },
				columns: columns
		        ,onLoadSuccess: function () {
		        	
		        },
		        onLoadError: function () {
		        	
		        },
		        onDblClickRow: function (row, $element) {
		            var id = row.ID;
		            EditViewById(id, 'view');
		        },
		    });
	return table;
}
function destroyTable(table)
{
	table.bootstrapTable("destroy")
}
function setTableParam(table,optionjson)
{
	table.bootstrapTable("refreshOptions",optionjson)
}
function setTableData(table,data)
{
	table.bootstrapTable("load",data)
}
function refreshTableData(table,data)
{
	table.bootstrapTable('refreshOptions',{'data':data});
}
function setTableCols(table,cols)
{
//	var options=table.bootstrapTable('getOptions');

//	table.bootstrapTable("destroy")
//	options['columns']=cols;

	table.bootstrapTable('refreshOptions',{'columns':cols});
}
function getTableOption(table)
{
	var options=table.bootstrapTable('getOptions');
	return options;
}
function getTableOptionWithoutData(table)
{
	var options=table.bootstrapTable('getOptions');
	options['data']=[];
	return options;
}
function loadTableCols(table,queryweb,tablename,postloaded,ignore,appendcols,width){
	$.post(queryweb,{
		table:tablename,
		ignore:ignore,
		width:width
	},function(data){
		if(appendcols!=null)
		{
			for(var one in appendcols){
				data.push(appendcols[one]);
			}
		}
		setTableCols(table,data);
		postloaded();
	},"json").fail(function(){
		postloaded();
	});
}

function loadSafeTableCols(table,queryweb,file,postloaded,appendcols){
	$.post(queryweb,{
		file:file
	},function(data){
		if(appendcols!=null)
		{
			for(var one in appendcols){
				data.push(appendcols[one]);
			}
		}
		setTableCols(table,data);
		postloaded();
	},"json").fail(function(){
		postloaded();
	});
}

function loadTableData(table,queryweb,tablename,postloaded,ignore,evalstrinfo,condition)
{
	var args=null;
	if(arguments.length>7)
	{
		args=[];
		for(var i=7;i<arguments.length;i++)
		{
			args.push(arguments[i][0]);
			
		}
		args=JSON.stringify(args);
	}
		
	console.log(args)
	$.post(queryweb,{
		table:tablename,
		condition:condition,
		ignore:ignore,
		args:args
	},function(data){
		if(evalstrinfo!=null)
		{
			for(var i in data){
				var This=data[i];
				eval(evalstrinfo);
			}
		}
		var allcols=table.bootstrapTable('getVisibleColumns');
		var selects={}
		for(var id in allcols)
		{
			if(allcols[id]['select']!=null)
			{
				selects[allcols[id]['field']]=allcols[id]['select'];
			}
		}
		var tempdata=JSON.parse(JSON.stringify(data));
		for(var i in tempdata)
		{
			var row=tempdata[i];
			for(var one in row){
				if(row[one].indexOf("<")!=-1&&row[one].indexOf("<button id=\"")==-1)
				{
					row[one]=replaceAll(row[one],"<","&lt;");
				}
				if(selects[one]!=null)
					row[one]=selects[one][row[one]];
			}
		}
//		var options=getTableOptionWithoutData(table);
//		table.bootstrapTable('destroy');
//		table.bootstrapTable(options);
		
		refreshTableData(table,tempdata);

		postloaded();
	},"json").fail(function(){
		postloaded();
	});
}
function loadSafeTableData(table,queryweb,file,postloaded,evalstrinfo,condition,querytype)
{

	$.post(queryweb,{
		file:file,
		_condition:condition,
		_type:querytype
	},function(data){
		if(evalstrinfo!=null)
		{
			for(var i in data){
				var This=data[i];
				eval(evalstrinfo);
			}
		}
		
		var allcols=table.bootstrapTable('getVisibleColumns');
		var selects={}
		for(var id in allcols)
		{
			if(allcols[id]['select']!=null)
			{
				selects[allcols[id]['field']]=allcols[id]['select'];
			}
		}
		for(var i in data)
		{
			var row=data[i];
			for(var one in row){
				if(selects[one]!=null)
					row[one]=selects[one][row[one]];
			}
		}
		
		refreshTableData(table,data);
		postloaded();
	},"json").fail(function(){
		postloaded();
	});
}




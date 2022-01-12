var table="analysis_data";
var ignore="";
var width="date:100";
var condition="date>?";
var args=['2021-06-03'];

//文件包含方法类:DBUtil和HttpHelper
//数据包括session和params
//必须复写，返回true就为执行
function judge(){
	return "true";
}
//可复写方法包括 del,edit,insert,也可省略下列方法，省略按照默认处理
function del(){
	print("测试")
	return '测试';
}
function edit(){
	print("测试1")
	return '测试1';
}
function insert(){
	print("测试2")
	return '测试2';
}
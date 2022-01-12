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

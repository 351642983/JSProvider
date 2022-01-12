package com.hdq.tools;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;


public class JSONTools {
	//将JSONObject的key值取出并转换为容器List
	public static List<String> getJSONObjectKeyList(JSONObject obj){
		List<String> result=new ArrayList<>(obj.keySet());
		return result;
	}
	//将JSONObject的key值取出并转换为数组
	public static String[] getJSONObjectKeyNList(JSONObject obj){
		return StringHandle.StringListToStringNlist(getJSONObjectKeyList(obj));
	}
	
	//实体对象转换为数据库可存储的json
	public static <T> JSONObject TToSQLBase(T t){
	   JSONObject obj = new JSONObject(JSONObject.parseObject((JSONObject.toJSONString(t))));
	   return jsonToSQLBase(obj);
	}
	//json转换为SQLBase
	public static JSONObject jsonToSQLBase(JSONObject obj) {
		for(String key:new HashSet<String>(obj.keySet())){
			StringBuffer sb=new StringBuffer();
			char []ctemp=key.toCharArray();
			boolean g_init=false;
			if(ctemp.length>0)
				sb.append(ctemp[0]);
			for(int i=1;i<ctemp.length;i++){
				if(ctemp[i]>='A'&&ctemp[i]<='Z'&&!g_init){
					sb.append("_").append((char)(ctemp[i]-('A'-'a')));
					g_init=true;
				}
				else sb.append(ctemp[i]);
			}
			obj.put(sb.toString(),obj.get(key));
			if(!sb.toString().equals(key))
				obj.remove(key);
		}
		return obj;
	}
	
	
	public static JSONObject reverseJSONObject(JSONObject infos)
	{
		JSONObject result=new JSONObject();
		for(String key:infos.keySet())
		{
			result.put(infos.getString(key), key);
		}
		return result;
	}
	public static <T> JSONObject mapToJSONObject(Map<String, T> map)
	{
		JSONObject resultJson=new JSONObject();
		Iterator<String> it = map.keySet().iterator();
		while (it.hasNext()) {
			String key = (String) it.next();
			resultJson.put(key, map.get(key));
		}
		return resultJson;
	}
	public static JSONObject formatRequestJSONObject(JSONObject requestParams)
	{
		JSONObject result=new JSONObject();

		List<String> colsArray=new ArrayList<>(requestParams.keySet());
		Collections.sort(colsArray,new Comparator<String>(){
			@Override
			public int compare(String o1, String o2) {
				String spone[]=o1.split("\\[");
				String sptwo[]=o2.split("\\[");
				for(int i=1;i<spone.length;i++) {
					spone[i]=spone[i].replace("]", "");
				}
				for(int i=1;i<sptwo.length;i++) {
					sptwo[i]=sptwo[i].replace("]", "");
				}
				int i=0;
				while(i<spone.length&&i<sptwo.length)
				{
					if(spone[i].equals(sptwo[i]))
					{
						i++;
						continue;
					}
					else {
						if(getAppendType(spone[i])==getAppendType(sptwo[i]))
						{
							if(getAppendType(spone[i])==0)
								return spone[i].compareTo(sptwo[i]);
							if(Integer.parseInt(spone[i])>Integer.parseInt(sptwo[i]))
								return 1;
							else return -1;
						}
						else {
							if(getAppendType(spone[i])==1) {
								return 1;
							}
							else return -1;
						}
					}
				}
				if(spone.length==sptwo.length)
					return 0;
				if(spone.length>sptwo.length)
					return 1;
				else return -1;
			}
		});
		for(String col:colsArray)
		{
			if(col.contains("["))
			{
				String spone[]=col.split("\\[");
				for(int i=1;i<spone.length;i++) {
					spone[i]=spone[i].replace("]", "");
					if(spone[i].equals(""))
						spone[i]="0";
				}
				List<String> colset=StringHandle.StringNlistToStringList(spone);
				setJSON(result,colset,requestParams.getString(col));
			}
			else {
				result.put(col,requestParams.getString(col));
			}
		}
		return result;
	}


	public static Object setJSON(Object info,List<String> type,String result)
	{
		Object head=info;
		Object pinfo=info;
		for(int i=0;i<type.size();i++)
		{
			if(JSONContainKey(pinfo,type.get(i)))
			{
				
				if(i!=type.size()-1)
					pinfo=getInitJSON(pinfo,type.get(i));
				else addInitJSON(pinfo,type.get(i),result);
			}
			else {
				Object lastpinfo=pinfo;
				pinfo=newNextJSON(type,i,result);
				addInitJSON(lastpinfo,type.get(i),pinfo);
				
			}
		}
		return head;
	}
	public static boolean JSONContainKey(Object a,String key)
	{
		if(getAppendType(key)==1)
		{
			JSONArray arr=(JSONArray)a;
			return (arr.size()>Integer.parseInt(key));
		}
		else {
			JSONObject obj=(JSONObject)a;
			return obj.containsKey(key);
		}
	}
	public static Object newNextJSON(List<String> cols,int nowid,String result)
	{
		if(nowid+1>=cols.size())
			return result;
		else {
			String key=cols.get(nowid+1);
			if(getAppendType(key)==1)
			{
				return new JSONArray();
			}
			else {
				return new JSONObject();
			}
		}
	}
	public static void addInitJSON(Object a,String key,Object value)
	{
		if(getAppendType(key)==1)
		{
			JSONArray arr=(JSONArray)a;
			arr.add(value);
		}
		else {
			JSONObject obj=(JSONObject)a;
			obj.put(key,value);
		}
	}
	public static Object getInitJSON(Object a,String coldown)
	{
		if(getAppendType(coldown)==1)
		{
			JSONArray arr=(JSONArray)a;
			return arr.get(Integer.parseInt(coldown));
		}
		else {
			JSONObject obj=(JSONObject)a;
			return obj.get(coldown);
		}
	}
	private static int getAppendType(String info)
	{
		if(StringHandle.StringIsSuitExep(info, "\\d*"))
		{
			return 1;
		}
		return 0;
	}
	public static void main(String args[]) {
//		List<String> testcol=new ArrayList<String>();
//		testcol.add("test");
//		testcol.add("0");
//		testcol.add("name");
//		Object arr=setJSON(new JSONObject(),testcol,"111");
//		System.out.println(arr);
//	
//		testcol.set(1,"1");
//		testcol.add("test");
//		testcol.add("0");
//		testcol.add("name");
//		System.out.println(setJSON(arr,testcol,"222"));
		
		
	}
	
	/**
	 * 将List的字符串容器转化为JSONArray的格式
	 * @param info字符串容器
	 * @return JSONArray
	 */
	public static JSONArray StringListToJSONArray(List<String> info) {
		JSONArray result=new JSONArray();
		for(String sub:info)
			result.add(sub);
		return result;
	}
	/**
	 * 返回将指定的JSONArray的下元素字符串列表
	 * @param infos 需要装换的JSONArray
	 * @return 字符串列表容器
	 */
	public static List<String> JSONArrayToStringList(JSONArray infos){
		List<String> result=new ArrayList<>();
		if(infos==null)
			return result;
		for(int i=0;i<infos.size();i++) {
			result.add(infos.getString(i));
		}
		return result;
	}
	/**
	 * 返回将指定的JSONArray的下元素字符串数组
	 * @param infos 需要装换的JSONArray
	 * @return 字符串列表数组
	 */
	public static String[] JSONArrayToStringNList(JSONArray infos) {
		return StringHandle.StringListToStringNlist(JSONArrayToStringList(infos));
	}
	/**
	 * 返回指定JSONObject中不为空的字符串
	 * @param infos 需要判断的JSONObject元素
	 * @param cols 不定参数，需判断存在的键
	 * @return 不存在的键值JSONArray内含不存在的键字符串
	 */
	public static JSONArray returnJSONOjbectEmptyKeys(JSONObject infos,String ...cols)
	{
		JSONArray result=new JSONArray();
		for(String col:cols) {
			if(!infos.containsKey(col)||StringHandle.StringIsEmpty(infos.getString(col)))
				result.add(col);
		}
		return result;
	}
	/**
	 * 返回JSONObject的值容器
	 * @param infos
	 * @param keycols 
	 * @return
	 */
	public static JSONArray returnJSONOjbectValues(JSONObject infos,String ...keycols) {
		JSONArray result=new JSONArray();
		for(String col:keycols) {
			result.add(infos.getString(col));
		}
		return result;
	}
	//低级Format格式化JSONArray 内含JSONObject形式的JSONArray This在fomat中代表实体
	public static JSONArray formatJSONArray(JSONArray arr,String format) {
		JSONArray result=new JSONArray();
		boolean isToObj=StringHandle.StringIsSuitExep(format, "\\s*(\\{|\\[)[\\s\\S]*");
		if(isToObj) {
			String trimformat=format.replaceAll("\\s*|\\t|\\r|\\n","").replace("This.", "");
			trimformat=trimformat.substring(1,trimformat.length()-1);
			String []cols=trimformat.split(",");
			
			for(int i=0;i<arr.size();i++) {
				JSONObject tempinfo=arr.getJSONObject(i);
				if(format.trim().startsWith("[")) {
					
					JSONArray obj=new JSONArray();
					
					for(int j=0;j<cols.length;j++) {
						if(!tempinfo.containsKey(cols[j]))
							continue;
						obj.add(tempinfo.getString(cols[j]));
					}
					result.add(obj);
					
				}
				else {
					
					JSONObject obj=new JSONObject();
					for(int j=0;j<cols.length;j++) {
						String []spinfo=cols[j].split(":");
						String key=spinfo[0];
						String value=spinfo[1];
						
						if(!tempinfo.containsKey(value))
							continue;
						obj.put(key,tempinfo.getString(value));
					}
					result.add(obj);
				}
			}
		}
		else
		{
			String trimformat=format.replaceAll("\\s*|\\t|\\r|\\n","").replace("This.", "");
			String []cols=trimformat.split(",");
	
			for(int i=0;i<cols.length;i++) {
				result.add(new JSONArray());
			}
			for(int i=0;i<arr.size();i++) {
				JSONObject tempinfo=arr.getJSONObject(i);
				for(int j=0;j<cols.length;j++) {
					if(!tempinfo.containsKey(cols[j]))
						continue;
					JSONArray temparray=result.getJSONArray(j);
					temparray.add(tempinfo.getString(cols[j]));
					
				}
			}
			
		}
		return result;
	}
	//获得JSONObj之下的所有可存储数值
	public static List<Map<String,String>> getJsonLevelValues(String obj)
	{
		if(getJsonTypeStr(obj)==0) {
			return null;
		}
		List<Map<String,String>> infos=new ArrayList<>();
		if(getJsonTypeStr(obj)==2) {
			JSONObject obje=JSONObject.parseObject(obj);
			
			Set<String> allinfo=obje.keySet();
			Map<String,String> result=new HashMap<>();
			for(String key:allinfo)
			{
				if(getJsonType(obje.get(key))==0)
				{
					result.put(key, obje.getString(key));
				}
			}
			infos.add(result);
		}
		else
		{
			JSONArray arr=JSONObject.parseArray(obj);
			for(int i=0;i<arr.size();i++)
			{
				JSONObject obje=arr.getJSONObject(i);
				
				Set<String> allinfo=obje.keySet();
				Map<String,String> result=new HashMap<>();
				for(String key:allinfo)
				{
					if(getJsonType(obje.get(key))==0)
					{
						result.put(key, obje.getString(key));
					}
				}
				infos.add(result);
			}
		}
		return infos;
	}
	
	//获得JSONObj之下的所有不可存储数值 即jsonobj和jsonarray这两种类型数据的
	public static List<Map<String,Object>> getJsonLevelTValues(String obj)
	{
		if(getJsonTypeStr(obj)==0) {
			return null;
		}
		List<Map<String,Object>> infos=new ArrayList<>();
		if(getJsonTypeStr(obj)==2) {
			JSONObject obje=JSONObject.parseObject(obj);
			
			Set<String> allinfo=obje.keySet();
			Map<String,Object> result=new HashMap<>();
			for(String key:allinfo)
			{
				if(getJsonType(obje.get(key))!=0)
				{
					result.put(key, obje.get(key));
				}
			}
			infos.add(result);
		}
		else
		{
			JSONArray arr=JSONObject.parseArray(obj);
			for(int i=0;i<arr.size();i++)
			{
				JSONObject obje=arr.getJSONObject(i);
				
				Set<String> allinfo=obje.keySet();
				Map<String,Object> result=new HashMap<>();
				for(String key:allinfo)
				{
					if(getJsonType(obje.get(key))!=0)
					{
						result.put(key, obje.get(key));
					}
				}
				infos.add(result);
			}
		}
		return infos;
	}
	
	
	public static int getJsonType(Object obj)
	{
		if(isJSONObject(obj)) return 2;
		if(isJSONArray(obj)) return 1;
		return 0;
	}
	public static int getJsonTypeStr(String str)
	{
		if(isJSONObjectStr(str)) return 2;
		if(isJSONArrayStr(str)) return 1;
		return 0;
	}
	//JSON显示模式转换2
	public static JSONObject formatJsonByJson(JSONObject postJson,JSONObject formatJson)
	{
		JSONTools.JsonStruct js=new JSONTools().new JsonStruct();
		js.ImportDeviceJsonToMapInfo(formatJson.toJSONString());
//		js.showStruct();
		String formatStr[]=new String[] {""};
		js.getMapPointKeyLevelInfo().forEach((key,value)->{
			
			String valueInfo[]=new String[] {""};
			value.forEach((v)->{
				JSONObject jsonOut[]=new JSONObject[] {formatJson};
				String dfsname=js.getDFSName(key,v,"-");
				List<String> init=StringHandle.StringNlistToStringList(dfsname.split("-"));
				init.forEach((one)->{
					if(JSONTools.getJsonType(jsonOut[0].get(one))==2)
						jsonOut[0]=jsonOut[0].getJSONObject(one);
					else if(JSONTools.getJsonType(jsonOut[0].get(one))==0)
						valueInfo[0]=jsonOut[0].getString(one);
				});
				valueInfo[0]=valueInfo[0].replaceAll("(root\\.)", "").replace(".", "-");
				formatStr[0]+=valueInfo[0]+"="+dfsname+";";
				
			});
		});
		formatStr[0]=formatStr[0].replaceAll(";$", "");
		return JSONTools.formatJson(postJson, formatStr[0],true);
	}
	
	
	//JSON显示模式转换-postJson 'cols:'删除cols ';'分隔符; '-'表示其之下的子json对象  'cols-a=cols1-b-c'将cols-a的值转到cols1-b-c之下  分组的话使用中括号[]
	public static JSONObject formatJson(JSONObject postJson,String changeFormat,boolean ...empty)
	{
		if(changeFormat==null||changeFormat.trim().equals(""))
			return postJson;
		JSONObject phinfo=new JSONObject(postJson);
		JSONObject pinfo=null;
		boolean removeall=false;
		if(empty==null||empty.length==0||empty[0])
			removeall=true;
		if(removeall)
			pinfo=new JSONObject();
		else pinfo=phinfo;
//		Map<String,String> resp=new LinkedHashMap<>();
		List<String> keys=new ArrayList<>();
		List<String> values=new ArrayList<>();
		String []spformat=changeFormat.split(";");
		for(int i=0;i<spformat.length;i++)
		{
			String substrsp[]=spformat[i].split("=");
			if(substrsp.length>=2)
			{
//				resp.put(substrsp[0], substrsp[1]);
				keys.add(substrsp[0]);
				values.add(substrsp[1]);
			}		
			else {
//				resp.put(substrsp[0],"");
				keys.add(substrsp[0]);
			}
		}
		Deque<String> stack=new LinkedList<>();
		Deque<String> stackp=new LinkedList<>();
		List<JSONArray> removeQueueArr=new ArrayList<>();
		List<Integer> removePositonArr=new ArrayList<>();
		List<JSONObject> removeQueue=new ArrayList<>();
		List<String> removePositon=new ArrayList<>();
		if(keys.size()!=0)
		{
			List<String> keyinfo=keys;
			
			down:for(int i=0;i<keyinfo.size();i++)
			{
				String substr=keyinfo.get(i);
				JSONObject hjson=phinfo;
				List<JSONObject> jsonobjs=new ArrayList<JSONObject>();
				String []spstr=substr.split("-");
				String []pointer=values.get(i).split("-");
//				boolean one[]=new boolean[spstr.length];
				for(int j=0;j<spstr.length;j++)
				{
					stack.push(spstr[j].split("\\:")[0]);
					if(pointer.length-1>=j) {
						stackp.push(pointer[j]);
					}
					if(j==0)
						jsonobjs.add(hjson);
//					System.out.println(stack.peek());
//					System.out.println(hjson);
					String realcol=stack.peek();
					String nums="";
					if(StringHandle.StringIsSuitExep(realcol, ".*\\[\\d*?\\]$"))
					{
						nums=realcol.replaceAll(".*\\[(\\d*?)\\]$", "$1").trim();
						realcol=realcol.replaceAll("(.*)\\[\\d*?\\]$", "$1");
						System.out.println(nums);
					}
					
					
					if(hjson.getString(realcol)==null)
					{
//						try {
//							throw new NullPointerException(realcol+" has a null value");
//						}
//						catch(NullPointerException e)
//						{
//							e.printStackTrace();
//						}
						continue;
					}
					int jsontype=getJsonType(hjson.get(realcol));
					
					JSONArray arr=null;
					if(jsontype==2)
						hjson=hjson.getJSONObject(realcol);
					else if(jsontype==1)
					{
						if(!nums.equals("")&&StringHandle.StringIsSuitExep(nums, "\\d*")) {
							arr=hjson.getJSONArray(realcol);
							hjson=arr.getJSONObject(Integer.parseInt(nums));
						}
						else
						{
							arr=hjson.getJSONArray(realcol);
							hjson=arr.getJSONObject(0);
						}
					}
					if(jsontype>=1)
					{
						jsonobjs.add(hjson);
						if(spstr[j].contains(":"))
						{
							jsonobjs.get(jsonobjs.size()-2).remove(realcol);
							jsonobjs.remove(jsonobjs.size()-1);
							continue down;
						}
					}
					
					else
					{
						if(spstr[j].contains(":"))
						{
							jsonobjs.get(jsonobjs.size()-1).remove(realcol);
							jsonobjs.remove(jsonobjs.size()-1);
							continue down;
						}
					}
					
					//可以预见有 A-B B-C 这种bug
				}
				
				JSONObject handle=jsonobjs.get(jsonobjs.size()-1);
				if(handle.getString(spstr[spstr.length-1])==null)
				{
					handle=jsonobjs.get(jsonobjs.size()-2);
				}
				

				
				
				
				
				JSONObject pkey=phinfo;
				JSONObject pinfop=pinfo;
				for(int x=0;x<pointer.length;x++)
				{
					if(!pkey.containsKey(pointer[x]))
					{
						if(x!=pointer.length-1)
						{
							pkey.put(pointer[x], new JSONObject());
						}
						else {
							String realcol=spstr[spstr.length-1];
							String nums="";
							if(StringHandle.StringIsSuitExep(realcol, ".*\\[\\d*?\\]$"))
							{
								nums=realcol.replaceAll(".*\\[(\\d*?)\\]$", "$1").trim();
								realcol=realcol.replaceAll("(.*)\\[\\d*?\\]$", "$1");
							}
							
							if(nums.equals(""))
							{
								pkey.put(pointer[x], handle.get(realcol));
//								handle.remove(realcol);
								removeQueue.add(handle);
								removePositon.add(realcol);
							}
							else {
								pkey.put(pointer[x], handle.getJSONArray(realcol).get(Integer.parseInt(nums)));
//								handle.getJSONArray(realcol).remove(Integer.parseInt(nums));
								removeQueueArr.add(handle.getJSONArray(realcol));
								removePositonArr.add(Integer.parseInt(nums));
							}
							if(handle.size()==0)
							{
								if(spstr.length-2>=0)
								{
									String realcolv=spstr[spstr.length-2];
									String numsv="";
									if(StringHandle.StringIsSuitExep(realcol, ".*\\[\\d*?\\]$"))
									{
										numsv=realcolv.replaceAll(".*\\[(\\d*?)\\]$", "$1").trim();
										realcolv=realcolv.replaceAll("(.*)\\[\\d*?\\]$", "$1");
									}
									if(numsv.equals("")) {
//										jsonobjs.get(jsonobjs.size()-2).remove(realcolv);
										removeQueue.add(jsonobjs.get(jsonobjs.size()-2));
										removePositon.add(realcolv);
									}	
									else {
//										jsonobjs.get(jsonobjs.size()-2).getJSONArray(realcolv).remove(Integer.parseInt(numsv));
										removeQueueArr.add(jsonobjs.get(jsonobjs.size()-2).getJSONArray(realcolv));
										removePositonArr.add(Integer.parseInt(numsv));
									}
								}
							}
						}
					}
					
					pinfop.put(pointer[x],pkey.get(pointer[x]));
					if(x!=pointer.length-1) {
						pkey=pkey.getJSONObject(pointer[x]);
						pinfop=pinfop.getJSONObject(pointer[x]);
					}
					
				}
			}
			for(int j=0;j<removeQueueArr.size();j++)
			{
				removeQueueArr.get(j).remove(removePositonArr.get(j));
			}
			for(int j=0;j<removeQueue.size();j++)
			{
				removeQueue.get(j).remove(removePositon.get(j));
			}
		}
		return pinfo;
	}
	
	//对info对象去掉对应的注释信息再返回对应的结果
	public static JSONObject returnJSONObjByString(String info)
	{
//			System.out.println(info.replaceAll("(.*?)(//.*?)\\s\\s", "$1"));
		return JSONObject.parseObject(info.replaceAll("(.*?)(//.*?)$", "$1").replaceAll("(.*?)(//.*?)\\s\\s", "$1"));
	}
	
	
	public class JsonStruct{
		LinkedHashMap<Integer,Map<String,String>> jsonmapinfo;
		LinkedHashMap<Integer,Set<String>> jsonmaplevelinfo;
		public LinkedHashMap<Integer,Set<String>> getMapPointKeyLevelInfo()
		{
			return jsonmaplevelinfo;
		}
		public LinkedHashMap<Integer,Map<String,String>> getMapFatherInfo()
		{
			return jsonmapinfo;
		}
		int level;
		public boolean isTable(int level,String point)
		{
			if(jsonmapinfo.get(level).containsValue(point))
				return true;
			return false;
		}
		public String getFather(int level,String point)
		{
			return jsonmapinfo.get(level-1).get(point) ;
		}
		public String getDFSName(int level,String point,String link)
		{
			if(level<=1)
				return point;
			String nowpoint=getDFSName(level-1,jsonmapinfo.get(level-1).get(point),link);
			if(nowpoint!=null)
				point=nowpoint+link+point;
			return point;
		}
		public String getTableName(int level,String point,String link)
		{
//			return getDFSName(level-1,getFather(level,point));
			return getDFSName(level,point,link);
		}
		public void showStruct()
		{
			System.out.println("MapPointFatherInfo:"+jsonmapinfo);
			System.out.println("MapLevelPointKeyInfo:"+jsonmaplevelinfo);
		}
		//解析json格式信息
		public void ImportDeviceJsonToMapInfo(String strobj)
		{
			jsonmapinfo=new LinkedHashMap<>();
			jsonmaplevelinfo=new LinkedHashMap<>();
			JSONObject jsonobj=JSONObject.parseObject(strobj);
	        Deque<JSONObject> queueobj=new LinkedList<>();
	        Deque<JSONArray> queuearr=new LinkedList<>();
	        Deque<String> objfatherqueue=new LinkedList<>();
	        Deque<String> arrfatherqueue=new LinkedList<>();
	        Map<Object,String> map=new HashMap<>();
	        queueobj.offer(jsonobj);
	        //最外一层需直接建立，在level为1的情况下
	        level=0;
	        while(!queueobj.isEmpty()||!queuearr.isEmpty())
	        {
	        	++level;
//	        	System.out.println("----第"+level+"层----");
	        	
	        	if(!queueobj.isEmpty())
	        	{
	        		String keyfather=null;
	        		if(!objfatherqueue.isEmpty()) {
	        			keyfather=objfatherqueue.poll();
//	        			System.out.println("init:"+keyfather);
	        		}
	        			
	        		int qsize=queueobj.size();
	            	for(int i=0;i<qsize;i++)
	            	{
	            		
	            		JSONObject poll=queueobj.poll();
	            		if(keyfather==null)
	            		{
	            			keyfather=map.get(poll);
	            		}
	            		Iterator<Entry<String, Object>> iter = poll.entrySet().iterator();
		                while (iter.hasNext()) {
		                    Map.Entry<String, Object> entry = (Map.Entry<String, Object>) iter.next();
		                    String key=entry.getKey().toString();
		                    String value=entry.getValue().toString();
		                    Object valueobj=entry.getValue();
		                  //深挖元素，如果有元素，根据所有元素的并集建立父表
	                    	Map<String,String> nowmap=jsonmapinfo.getOrDefault(level, new HashMap<>());
	                    	Set<String> nowlevelinfo=jsonmaplevelinfo.getOrDefault(level,new HashSet<>());
		                    if(isJSONObject(valueobj)) {
		                    	objfatherqueue.offer(key);
		                    	map.put(poll.getJSONObject(key), key);
		                    	queueobj.offer(poll.getJSONObject(key));
//		                    	System.out.println("testobj:"+key+" "+poll.getJSONObject(key));
		                    	//这里就可以建立了父表
		                    	for(String initkey:poll.getJSONObject(key).keySet())
		                    	{
		                    		nowmap.put(initkey, key);
		                    	}
		                    }
		                    else if(isJSONArray(valueobj)) {
		                    	arrfatherqueue.offer(key);
		                    	queuearr.offer(poll.getJSONArray(key));
//		                    	System.out.println("testarr:"+key+" "+poll.getJSONArray(key));
		                    	//setall temp做并集处理
		                    	Set<String> alltemp=new HashSet<>();
		                    	for(int x=0;x<poll.getJSONArray(key).size();x++)
		                    	{
		                    		if(isJSONObject(poll.getJSONArray(key).get(x)))
		                    		{
		                    			JSONObject robj=rJSONObject(poll.getJSONArray(key).getString(x));
		                    			alltemp.addAll(robj.keySet());
		                    		}
		                    		//下面是兼容处理 jsonarray数值类型如何
		                    		//纯array是否为规范数据？
		                    		else if(isJSONArray(poll.getJSONArray(key).get(x)))
		                    		{
		                    			
		                    		}
		                    		//普通数值类型如何
		                    		else 
		                    		{
		                    			
		                    		}
		                    	}
		                    	for(String initkey:alltemp)
		                    		nowmap.put(initkey, key);
		                    }
		                    else {
//		                    	System.out.println("obj. key:"+key+" value:"+value+" test:"+keyfather);
		                    	//新增加值？level加元素
		                    	nowlevelinfo.add(key);
		                    }
		                    jsonmapinfo.put(level, nowmap);
		                    jsonmaplevelinfo.put(level, nowlevelinfo);
	                    }
//		                System.out.println("---objend---");
		                
	            	}
	        	}
	        	//元素中的位置遍历，该模式在设备中应该不会用到
	        	if(!queuearr.isEmpty())
	        	{
////	        		if(!keystack.isEmpty())
////	        			System.out.println("init:"+keystack.poll());
//	        		String keyfather=null;
//	        		if(!arrfatherqueue.isEmpty()) {
//	        			keyfather=arrfatherqueue.poll();
////	        			System.out.println("init:"+keyfather);
//	        		}
	        		int qsize=queuearr.size();
	            	for(int i=0;i<qsize;i++)
	            	{
	            		
	            		JSONArray arrtemp=queuearr.poll();
	            		int arrsize=arrtemp.size();
	            		for(int j=0;j<arrsize;j++)
	            		{
	            			String value=arrtemp.getString(j);
	            			Object valueobj=arrtemp.get(j);
	            			if(isJSONObject(valueobj)) 
		                    	queueobj.add(rJSONObject(value));
		                    else if(isJSONArray(valueobj))
		                    	queuearr.add(rJSONArray(value));
		                    else {
//		                    	System.out.println("arr. index:"+j+" value:"+value+" test:"+keyfather);
		                    }
	            		}
//	            		System.out.println("---arrend---");
	            		
	            	}
	        	}
	        }
		}
	}
	//搜索jsonarr中的列名的所在位置。
	public static int findIndex(JSONArray arr,String colname,String searchvalue)
	{
		for(int i=0;i<arr.size();i++)
		{
			JSONObject infos=arr.getJSONObject(i);
			if(infos.getString(colname).equals(searchvalue)) {
				return i;
			}
		}
		return -1;
	}
	//搜索jsonarr中符合搜索值得jsonarr
	public static JSONArray findMany(JSONArray arr,String colname,String searchvalue)
	{
		JSONArray result=new JSONArray();
		for(int i=0;i<arr.size();i++)
		{
			JSONObject infos=new JSONObject(arr.getJSONObject(i));
			if(infos.getString(colname).equals(searchvalue)) {
				result.add(infos);
			}
		}
		return result;
	}
	public static boolean isJSONObjectStr(String str)
	{
		str=str.trim();
		if(str.startsWith("{"))
			return true;
		else return false;
	}
	public static boolean isJSONObject(Object obj)
	{
		if(obj==null)
			return false;
		return obj instanceof JSONObject;
	}
	public static JSONObject rJSONObject(String str)
	{
		return JSONObject.parseObject(str);
	}
	public static boolean isJSONArray(Object obj)
	{
		if(obj==null)
			return false;
		return obj instanceof JSONObject;
	}
	public static boolean isJSONArrayStr(String str)
	{
		str=str.trim();
		if(str.startsWith("["))
			return true;
		else return false;
	}
	public static JSONArray rJSONArray(String str)
	{
		return JSONArray.parseArray(str);
	}
	@SuppressWarnings("unchecked")
	public static <V> Map<String,V> jsonToMap(JSONObject obj,Class<V> classz)
	{
		if(obj==null)
			return null;
		Map<String,V> map=new HashMap<>();
		for(String key:obj.keySet())
		{
			map.put(key, (V)obj.get(key));
		}
		return map;
	}
	
}

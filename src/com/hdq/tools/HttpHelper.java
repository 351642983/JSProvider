package com.hdq.tools;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;


public class HttpHelper {
	public static JSONObject loadBase(HttpServletRequest request, HttpServletResponse response,int type) throws ServletException, IOException
	{
		//设置网页的字符编码为UTF-8,防止中文乱码
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		//通过一个头"Content-type"告知客户端使用何种码表
		if(type==0)
			response.setContentType("text/plain; charset=utf-8"); 
		else if(type==1)
			response.setContentType("text/css; charset=utf-8"); 
		response.setHeader("Access-Control-Allow-Origin","*");
		JSONObject params=HttpHelper.getParams(request); 
		//解析Params
		params=JSONTools.formatRequestJSONObject(params);
		System.out.println("所有解析参数:"+params);
		return params;
	}
	
	/**
	 * 设置Cookie的值
	 * @param response
	 * @param name
	 * @param value
	 * @param seconds 存活秒数 为0表示关闭浏览器就失效
	 */
	public static void setCookie(HttpServletResponse response,String name,String value,Integer seconds)
	{
		String encodeCookie=null;
		if(value==null)
			value="";
		try {
			encodeCookie = URLEncoder.encode(value ,"utf-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Cookie cookie=new Cookie(name,encodeCookie);
		if(seconds!=null)
			cookie.setMaxAge(seconds);
		response.addCookie(cookie);
	}
	/**
	 * 设置Cookies的值
	 * @param response
	 * @param arr :{name,value,time}
	 */
	public static void setCookies(HttpServletResponse response,JSONArray arr)
	{
		for(int i=0;i<arr.size();i++)
		{
			setCookie(response,arr.getJSONObject(i).getString("name"),arr.getJSONObject(i).getString("value"),arr.getJSONObject(i).getInteger("time"));
		}
	}
	/**
	 * 设置Cookies的值
	 * @param response
	 * @param obj :JSONObject
	 * @param time : 存活时间，秒 为空表示关闭浏览器则清空
	 */
	public static void setCookies(HttpServletResponse response,JSONObject obj,Integer time)
	{
		for(String key:obj.keySet())
		{
			setCookie(response,key,obj.getString(key),time);
		}
	}
	/**
	 * 设置Cookies的值
	 * @param response
	 * @param cookiestr : a=b;c=d 用分号隔开
	 */
	public static void setCookies(HttpServletResponse response,String cookiestr)
	{
		response.addHeader("Set-Cookie",cookiestr);
	}
	
	/**
	 * 获取Cookies的JSON
	 * @param request
	 * @return cookies的JSONObject
	 */
	public static JSONObject getCookies(HttpServletRequest request)
	{
		JSONObject result=new JSONObject();
		Cookie []cookies=request.getCookies();
		for(int i=0;i<cookies.length;i++)
		{
			try {
				result.put(cookies[i].getName(), URLDecoder.decode(cookies[i].getValue() , "utf-8"));
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return result;
	}
	/**
	 * 获取Cookies的JSON 格式化
	 * @param request
	 * @return cookies的JSONObject
	 */
	public static JSONObject getFormatCookies(HttpServletRequest request)
	{
		JSONObject result=new JSONObject();
		Cookie []cookies=request.getCookies();
		for(int i=0;i<cookies.length;i++)
		{
			String value=null;
			try {
				value = URLDecoder.decode(cookies[i].getValue() , "utf-8");
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if(JSONTools.getJsonTypeStr(value)==2)
			{
				result.put(cookies[i].getName(), JSONObject.parseObject(value));
			}
			else if(JSONTools.getJsonTypeStr(value)==1)
			{
				result.put(cookies[i].getName(), JSONArray.parseArray(value));
			}
			else result.put(cookies[i].getName(), value);
		}
//		System.out.println(result);
		return result;
	}
	
	/**
	 * 获取HTTP请求的参数
	 */
	public static JSONObject getParams(HttpServletRequest request){
		JSONObject jsonObject = new JSONObject();
		Enumeration<String> params = request.getParameterNames();
		for (Enumeration<String> e = params; e.hasMoreElements();) {
			String key = e.nextElement().toString();
			jsonObject.put(key, request.getParameter(key));
		}
		return jsonObject;
	}
	public static String getRequstStr(HttpServletRequest request)
	{
		 StringBuffer jb = new StringBuffer();
		  String line = null;
		  try {
		    BufferedReader reader = request.getReader();
		    while ((line = reader.readLine()) != null)
		      jb.append(line);
		  } catch (Exception e) { /*report an error*/ }

		 return jb.toString();
	}
	


	/**
	 * @param request 需传递table,ignore,width
	 * ignore格式: field1-field2.... 用-分隔各个需要忽略的列名
	 * width格式:field1:width1-field2:width2.... 用-分隔各个需要忽略的列名，用:来映射对应属性
	 * @return BootstrapTable列格式
	 */
	public static JSONArray getBootstrapTableCols(HttpServletRequest request) {
		String table=request.getParameter("table");
		String ignoreStr=request.getParameter("ignore");
		String widthStr=request.getParameter("width");
		return getBootstrapTableCols(table,ignoreStr,widthStr);
	}

	/**
	 * @param table,ignore
	 * ignore格式: field1-field2.... 用-分隔各个需要忽略的列名
	 * width格式:field1:width1-field2:width2.... 用-分隔各个需要忽略的列名，用:来映射对应属性
	 * @return BootstrapTable列格式
	 */
	public static JSONArray getBootstrapTableCols(String table,String ignoreStr,String widthStr) {
		JSONArray result=new JSONArray();

		
		if(StringHandle.StringIsEmpty(table)) 
			return result;
		
		Map<String,String> tablemapper=null;
		if(!table.contains(":")&&!DBUtil.isExistTable(table)) {
			return result;
		}
		else if(table.contains("-")){
			table=table.replaceAll("\\s*", "");
			tablemapper=StringHandle.analyseMapSentence(table, "-", ":");
			for(String subtable:tablemapper.keySet()) {
				if(!DBUtil.isExistTable(subtable))
					return result;
			}
		}
		
		if(tablemapper==null) {
			JSONArray arr=DBUtil.get_colscomment(Config.db_database, table);
			Map<String,String> namemapper=DBUtil.getCommentAbleColsNameMapper(arr);
			JSONObject cinfos=DBUtil.getCommentInfoColsNameMapper(arr);
			List<String> ignorelist=StringHandle.analyseListSentence(ignoreStr, "-");
			Map<String, String> widthlist=StringHandle.analyseMapSentence(widthStr, "-",":");
			for(String key:namemapper.keySet()) {
				if(ignorelist.contains(key))
					continue;
				JSONObject obj=new JSONObject();
				obj.put("field",key);
				obj.put("title", namemapper.get(key));
				if(widthlist.get(key)!=null)
					obj.put("width", widthlist.get(key));
				obj.putAll(cinfos.getJSONObject(key));
				result.add(obj);
				
			}
			return result;
		}else {
			for(String subtable:tablemapper.keySet()) {
				JSONArray arr=DBUtil.get_colscomment(Config.db_database, subtable);
				Map<String,String> namemapper=DBUtil.getCommentAbleColsNameMapper(arr);
				JSONObject cinfos=DBUtil.getCommentInfoColsNameMapper(arr);
				List<String> ignorelist=StringHandle.analyseListSentence(ignoreStr, "-");
				Map<String, String> widthlist=StringHandle.analyseMapSentence(widthStr, "-",":");
				for(String key:namemapper.keySet()) {
					if(ignorelist.contains(key))
						continue;
					JSONObject obj=new JSONObject();
					obj.put("field",key);
					obj.put("title", namemapper.get(key));
					if(widthlist.get(key)!=null)
						obj.put("width", widthlist.get(key));
					obj.putAll(cinfos.getJSONObject(key));
					result.add(obj);
					
				}
			}
			return result;
		}
		
	}
	/**
	 * 将request中Session中存在的所有Attribute转换为JSONObject
	 * @param request
	 * @return
	 */
	public static JSONObject getRequestSessionToJSONObject(HttpServletRequest request) {
		JSONObject result=new JSONObject();
		//获取session  
		HttpSession session=request.getSession();    
		// 获取session中所有的键值  
		Enumeration<String> attrs=session.getAttributeNames();  
		// 遍历attrs中的
		while(attrs.hasMoreElements()){
			// 获取session键值  
			String name = attrs.nextElement().toString();
			// 根据键值取session中的值  
			Object value = session.getAttribute(name);
			result.put(name, value);
		}
		return result;
	}
	
	
	/**
	 * @param request 需传递table,ignore,condition
	 * ignore格式: field1-field2.... 用-分隔各个需要忽略的列名
	 * @return BootstrapTable列内容
	 */
	public static JSONArray getBootstrapTableInfo(HttpServletRequest request) {
		String table=request.getParameter("table");
		String ignoreStr=request.getParameter("ignore");
		String condition=request.getParameter("condition");
		JSONArray args=JSONArray.parseArray(request.getParameter("args"));
		
		if(args==null)
			args=new JSONArray();
		return getBootstrapTableInfo(table,ignoreStr,condition,args.toArray());
	}
	
	
	/**
	 * @param request 需传递table,ignore,condition
	 * ignore格式: field1-field2.... 用-分隔各个需要忽略的列名
	 * @return BootstrapTable列内容
	 */
	public static JSONArray getBootstrapTableInfo(String table,String ignoreStr,String condition,Object ...args) {
		JSONArray result=new JSONArray();
		
		
		if(StringHandle.StringIsEmpty(table)) 
			return result;
		
		Map<String,String> tablemapper=null;
		if(!table.contains(":")&&!DBUtil.isExistTable(table)) {
			return result;
		}
		else if(table.contains("-")){
			table=table.replaceAll("\\s*", "");
			tablemapper=StringHandle.analyseMapSentence(table, "-", ":");
			for(String subtable:tablemapper.keySet()) {
				if(!DBUtil.isExistTable(subtable))
					return result;
			}
			table="";
			for(String subtable:tablemapper.keySet()) {
				table+="`"+subtable+"` "+tablemapper.get(subtable)+',';
			}
			table=table.substring(0,table.length()-1);
		}
		List<String> allavcols=new ArrayList<>();
		if(tablemapper==null) {
			List<String> ignorelist=StringHandle.analyseListSentence(ignoreStr, "-");
			JSONArray arr=DBUtil.get_colscomment(Config.db_database, table);
			
			List<String> avcols=DBUtil.getCommentAbleCols(arr);
			for(int i=avcols.size()-1;i>=0;i--) {
				String key=avcols.get(i);
				if(ignorelist.contains(key))
				{
					avcols.remove(i);
				}
			}
			allavcols=avcols;
			
		}
		else
		{
			
			for(String subtale:tablemapper.keySet()) {
				List<String> ignorelist=StringHandle.analyseListSentence(ignoreStr, "-");
				JSONArray arr=DBUtil.get_colscomment(Config.db_database, subtale);
				
				List<String> avcols=DBUtil.getCommentAbleCols(arr);
				for(int i=avcols.size()-1;i>=0;i--) {
					String key=avcols.get(i);
					if(ignorelist.contains(key))
					{
						avcols.remove(i);
					}
					else {
						avcols.set(i, tablemapper.get(subtale)+".`"+avcols.get(i)+"`");
					}
					
				}
				allavcols.addAll(avcols);
			}
			
		}
		if(allavcols==null||allavcols.size()==0)
			return result;
	
		
		
		if(tablemapper==null) {
			String colsname="`"+StringHandle.StringListIntoString(allavcols, "`,`")+"`";
			if(condition!=null&&(InfoLoaderServlet.g_safe&&StringHandle.sql_inj(condition.toLowerCase(),true)))
			{
				System.out.println("可能为注入语句，将条件设置为无");
				condition="";
				return new JSONArray();
			}
			if(StringHandle.StringIsEmpty(condition))
				result=DBUtil.get_info_byjson("select "+colsname+" from `"+table+"`");
			else if(condition!=null) {
				try {
					result=DBUtil.get_info_byjson("select "+colsname+" from `"+table+"` where "+condition,args);
				}
				catch(Exception e){
					e.printStackTrace();
					System.out.println(condition+"条件错误");
//					return DBUtil.get_info_byjson("select "+colsname+" from `"+table+"`");
					return new JSONArray();
				}
			}
		}
		else {
			String colsname=StringHandle.StringListIntoString(allavcols, ",");
			if(condition!=null&&(InfoLoaderServlet.g_safe&&StringHandle.sql_inj(condition.toLowerCase(),true)))
			{
				System.out.println("可能为注入语句，将条件设置为无");
				condition="";
				return new JSONArray();
			}
			if(StringHandle.StringIsEmpty(condition))
				result=DBUtil.get_info_byjson("select "+colsname+" from "+table+"");
			else if(condition!=null) {
				try {
					result=DBUtil.get_info_byjson("select "+colsname+" from "+table+" where "+condition,args);
					
				}
				catch(Exception e){
					e.printStackTrace();
					System.out.println(condition+"条件错误");
					return new JSONArray();
				}
			}
		}
		/*JSONObject selectcols=new JSONObject();
		JSONArray colsinfos=getBootstrapTableCols(table,"","");
		for(int i=0;i<colsinfos.size();i++)
		{
			if(colsinfos.getJSONObject(i).containsKey("select"))
				selectcols.put(colsinfos.getJSONObject(i).getString("field"), colsinfos.getJSONObject(i).getJSONObject("select"));
		}
		for(String key:selectcols.keySet())
		{
			for(int i=0;i<result.size();i++)
			{
				result.getJSONObject(i).put(key, selectcols.getJSONObject(key).getOrDefault(result.getJSONObject(i).getString(key), "无对应值"));
			}
		}*/

		return result;
	}
	/**
	 * @param request 需传递table,ignore,condition
	 * ignore格式: field1-field2.... 用-分隔各个需要忽略的列名
	 * @return BootstrapTable列内容
	 */
	public static JSONArray getDownloadBootstrapTableInfo(String table,String ignoreStr,String condition,Object ...args) {
		JSONArray result=new JSONArray();
		
		
		if(StringHandle.StringIsEmpty(table)) 
			return result;
		
		Map<String,String> tablemapper=null;
		if(!table.contains(":")&&!DBUtil.isExistTable(table)) {
			return result;
		}
		else if(table.contains("-")){
			table=table.replaceAll("\\s*", "");
			tablemapper=StringHandle.analyseMapSentence(table, "-", ":");
			for(String subtable:tablemapper.keySet()) {
				if(!DBUtil.isExistTable(subtable))
					return result;
			}
			table="";
			for(String subtable:tablemapper.keySet()) {
				table+="`"+subtable+"` "+tablemapper.get(subtable)+',';
			}
			table=table.substring(0,table.length()-1);
		}
		List<String> allavcols=new ArrayList<>();
		if(tablemapper==null) {
			List<String> ignorelist=StringHandle.analyseListSentence(ignoreStr, "-");
			JSONArray arr=DBUtil.get_colscomment(Config.db_database, table);
			
			List<String> avcols=DBUtil.getCommentAbleCols(arr);
			for(int i=avcols.size()-1;i>=0;i--) {
				String key=avcols.get(i);
				if(ignorelist.contains(key))
				{
					avcols.remove(i);
				}
			}
			allavcols=avcols;
			
		}
		else
		{
			
			for(String subtale:tablemapper.keySet()) {
				List<String> ignorelist=StringHandle.analyseListSentence(ignoreStr, "-");
				JSONArray arr=DBUtil.get_colscomment(Config.db_database, subtale);
				
				List<String> avcols=DBUtil.getCommentAbleCols(arr);
				for(int i=avcols.size()-1;i>=0;i--) {
					String key=avcols.get(i);
					if(ignorelist.contains(key))
					{
						avcols.remove(i);
					}
					else {
						avcols.set(i, tablemapper.get(subtale)+".`"+avcols.get(i)+"`");
					}
					
				}
				allavcols.addAll(avcols);
			}
			
		}
		if(allavcols==null||allavcols.size()==0)
			return result;
	
		
		
		if(tablemapper==null) {
			String colsname="`"+StringHandle.StringListIntoString(allavcols, "`,`")+"`";
			if(condition!=null&&(InfoLoaderServlet.g_safe&&StringHandle.sql_inj(condition.toLowerCase(),true)))
			{
				System.out.println("可能为注入语句，将条件设置为无");
				condition="";
				return new JSONArray();
			}
			if(StringHandle.StringIsEmpty(condition))
				result=DBUtil.get_info_byjson("select "+colsname+" from `"+table+"`");
			else if(condition!=null) {
				try {
					result=DBUtil.get_info_byjson("select "+colsname+" from `"+table+"` where "+condition,args);
				}
				catch(Exception e){
					e.printStackTrace();
					System.out.println(condition+"条件错误");
//					return DBUtil.get_info_byjson("select "+colsname+" from `"+table+"`");
					return new JSONArray();
				}
			}
		}
		else {
			String colsname=StringHandle.StringListIntoString(allavcols, ",");
			if(condition!=null&&(InfoLoaderServlet.g_safe&&StringHandle.sql_inj(condition.toLowerCase(),true)))
			{
				System.out.println("可能为注入语句，将条件设置为无");
				condition="";
				return new JSONArray();
			}
			if(StringHandle.StringIsEmpty(condition))
				result=DBUtil.get_info_byjson("select "+colsname+" from "+table+"");
			else if(condition!=null) {
				try {
					result=DBUtil.get_info_byjson("select "+colsname+" from "+table+" where "+condition,args);
					
				}
				catch(Exception e){
					e.printStackTrace();
					System.out.println(condition+"条件错误");
					return new JSONArray();
				}
			}
		}
		JSONObject selectcols=new JSONObject();
		JSONArray colsinfos=getBootstrapTableCols(table,"","");
		for(int i=0;i<colsinfos.size();i++)
		{
			if(colsinfos.getJSONObject(i).containsKey("select"))
				selectcols.put(colsinfos.getJSONObject(i).getString("field"), colsinfos.getJSONObject(i).getJSONObject("select"));
		}
		for(String key:selectcols.keySet())
		{
			for(int i=0;i<result.size();i++)
			{
				result.getJSONObject(i).put(key, selectcols.getJSONObject(key).getOrDefault(result.getJSONObject(i).getString(key), "-"));
			}
		}

		return result;
	}
	
}

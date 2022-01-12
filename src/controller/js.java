package controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hdq.tools.DBUtil;
import com.hdq.tools.HttpHelper;
import com.hdq.tools.JSONTools;
import com.hdq.tools.StringHandle;

/**
 * Servlet implementation class js
 */
@WebServlet("/js")
public class js extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public js() {
        super();
        // TODO Auto-generated constructor stub
    }

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		super.service(request, response);
		JSONObject params=HttpHelper.loadBase(request, response,0);
	
		if(params.containsKey("group"))
		{
			jsGroup(request,response,params);
			
		}
		else if(params.containsKey("loadjs"))
		{
			loadjs(response, params);
			
		}
		else if(params.containsKey("loadcss"))
		{
			HttpHelper.loadBase(request, response,1);
			loadcss(response, params);
		}
		else if(params.containsKey("loadothers"))
		{
			loadothers(response, params);
		}
		else if(params.containsKey("require"))
		{
			require(request,response,params);
			
		}
		else if(params.containsKey("requirejs"))
		{
			requirejs(response, params);
		}
		else if(params.containsKey("requirecss"))
		{
			HttpHelper.loadBase(request, response,1);
			requirecss(response, params);
		}
		else if(params.containsKey("loadjsbyname"))
		{
			JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base where isvaild=1 and type=0 and name=?",params.getString("loadjsbyname"));
			if(jsinfo.size()>0)
			{
			
				StringBuffer sb=new StringBuffer();
				sb.append("//jsname:").append(params.getString("loadjsbyname")).append("-------------\n")
				.append(jsinfo.getJSONObject(0).getString("def")).append("\n");
				response.getWriter().print(sb);
			}
			
		}
		else if(params.containsKey("loadcssbyname"))
		{
			HttpHelper.loadBase(request, response,1);
			JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base where isvaild=1 and type=1 and name=?",params.getString("loadcssbyname"));
			if(jsinfo.size()>0)
			{
			
				StringBuffer sb=new StringBuffer();
				sb.append("/*cssname:").append(params.getString("loadcssbyname")).append("-------------*/\n")
				.append(jsinfo.getJSONObject(0).getString("def")).append("\n");
				response.getWriter().print(sb);
			}
		}
		else if(params.containsKey("loadothersbyname"))
		{
			JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base where isvaild=1 and type=2 and name=?",params.getString("loadothersbyname"));
			if(jsinfo.size()>0)
			{
				StringBuffer sb=new StringBuffer();
				sb.append(jsinfo.getJSONObject(0).getString("def")).append("\n");
				response.getWriter().print(sb);
			}
		}
	}
	
	private void require(HttpServletRequest request, HttpServletResponse response, JSONObject params) {
		// TODO Auto-generated method stub
		JSONArray require;
		if(params.getString("require").startsWith("["))
			require=JSON.parseArray(params.getString("require"));
		else require=JSON.parseArray("["+params.getString("require")+"]");
		StringBuffer url=request.getRequestURL();
		String preinfo=String.format("var HeadBaseInserter = document.getElementsByTagName('head')[0],baseStyleLoader = document.createElement('style');\r\n" + 
				"function linkScript(parm, fn) {\r\n" + 
				"	var linkScript;\r\n" + 
				"	if(/\\.css[^\\.]*$/.test(parm)) {\r\n" + 
				"		linkScript = document.createElement(\"link\");\r\n" + 
				"		linkScript.type = \"text/\" + (\"css\");\r\n" + 
				"		linkScript.rel = \"stylesheet\";\r\n" + 
				"		linkScript.href = parm;\r\n" + 
				"	} else {\r\n" + 
				"		linkScript = document.createElement(\"script\");\r\n" + 
				"		linkScript.type = \"text/\" + (\"javascript\");\r\n" + 
				"		linkScript.src = parm;\r\n" + 
				"	}\r\n" + 
				"	HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)\r\n" + 
				"	linkScript.onload = linkScript.onerror = function() {\r\n" + 
				"		if(fn) fn()\r\n" + 
				"	}\r\n" + 
				"}\r\n" + 
				"function linkCss(parm, fn) {\r\n" + 
				"	var linkScript;\r\n" + 
				"	\r\n" + 
				"	linkScript = document.createElement(\"link\");\r\n" + 
				"	linkScript.type = \"text/\" + (\"css\");\r\n" + 
				"	linkScript.rel = \"stylesheet\";\r\n" + 
				"	linkScript.href = parm;\r\n" + 
				"	\r\n" + 
				"	HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)\r\n" + 
				"	linkScript.onload = linkScript.onerror = function() {\r\n" + 
				"		if(fn) fn()\r\n" + 
				"	}\r\n" + 
				"}\r\n" + 
				"function linkScriptDOMLoaded(parm){\r\n" + 
				"    baseStyleLoader.innerHTML = 'body{display:none}';//动态加载文件造成样式表渲染变慢，为了防止DOM结构在样式表渲染完成前显示造成抖动，先隐藏body，样式表读完再显示\r\n" + 
				"    HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.firstChild)\r\n" + 
				"    var linkScript, linckScriptCount = parm.length, currentIndex = 0;\r\n" + 
				"    for ( var i = 0 ; i < parm.length; i++ ){\r\n" + 
				"        if(/\\.css[^\\.]*$/.test(parm[i])) {\r\n" + 
				"            linkScript = document.createElement(\"link\");\r\n" + 
				"            linkScript.type = \"text/\" + (\"css\");\r\n" + 
				"            linkScript.rel = \"stylesheet\";\r\n" + 
				"            linkScript.href = parm[i];\r\n" + 
				"        } else {\r\n" + 
				"            linkScript = document.createElement(\"script\");\r\n" + 
				"            linkScript.type = \"text/\" + (\"javascript\");\r\n" + 
				"            linkScript.src = parm[i];\r\n" + 
				"        }\r\n" + 
				"        HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)\r\n" + 
				"        linkScript.onload = linkScript.onerror = function(){\r\n" + 
				"            currentIndex++;\r\n" + 
				"            if(linckScriptCount == currentIndex){\r\n" + 
				"                baseStyleLoader.innerHTML = 'body{display:block}';\r\n" + 
				"                HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.lastChild)\r\n" + 
				"            }\r\n" + 
				"        }\r\n" + 
				"    }\r\n" + 
				"}\r\n" + 
				"function linkCssDOMLoaded(parm){\r\n" + 
				"    baseStyleLoader.innerHTML = 'body{display:none}';//动态加载文件造成样式表渲染变慢，为了防止DOM结构在样式表渲染完成前显示造成抖动，先隐藏body，样式表读完再显示\r\n" + 
				"    HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.firstChild)\r\n" + 
				"    var linkScript, linckScriptCount = parm.length, currentIndex = 0;\r\n" + 
				"    for ( var i = 0 ; i < parm.length; i++ ){\r\n" + 
				"       \r\n" + 
				"		linkScript = document.createElement(\"link\");\r\n" + 
				"		linkScript.type = \"text/\" + (\"css\");\r\n" + 
				"		linkScript.rel = \"stylesheet\";\r\n" + 
				"		linkScript.href = parm[i];\r\n" + 
				"       \r\n" + 
				"        HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)\r\n" + 
				"        linkScript.onload = linkScript.onerror = function(){\r\n" + 
				"            currentIndex++;\r\n" + 
				"            if(linckScriptCount == currentIndex){\r\n" + 
				"                baseStyleLoader.innerHTML = 'body{display:block}';\r\n" + 
				"                HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.lastChild)\r\n" + 
				"            }\r\n" + 
				"        }\r\n" + 
				"    }\r\n" + 
				"}\r\n" + 
				"///移除平板样式文件\r\n" + 
				"function removeStyles(filename){\r\n" + 
				"  var targetelement = \"link\";\r\n" + 
				"  var targetattr = \"href\";\r\n" + 
				"  var allsuspects = document.getElementsByTagName(targetelement)\r\n" + 
				"  for (var i = allsuspects.length; i>=0 ; i--){\r\n" + 
				"    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {\r\n" + 
				"      allsuspects[i].parentNode.removeChild(allsuspects[i])\r\n" + 
				"    }\r\n" + 
				"  }\r\n" + 
				"}\r\n"
				+ "function dlink(web){"
				+ "	document.write('<script src=\"'+web+'\"></script>')"
				+ "}\r\n"
				+ "function dlinkCss(web){"
				+ "	document.write('<link rel=\"stylesheet\" href=\"'+web+'\">');"
				+ "}\r\n");
		List<String> groupinfo=DBUtil.get_singal_list("select id from js_groupdef where name in "+StringHandle.createRepeatString("?", ",", "(", ")", require.size()),JSONTools.JSONArrayToStringList(require).toArray());
		if(groupinfo.size()>0)
		{
			
			try {
				
				response.getWriter().print(
						preinfo+
						
//						String.format("document.write('<link rel=\"stylesheet\" href=\"%s?loadcss=%d\">');", 
						String.format("linkCss('%s?requirecss=[%s]');", 
								url,StringHandle.StringListIntoString(groupinfo, ","))
						+"\r\n"+
						String.format("document.write(\"<script language='javascript' src='%s?requirejs=[%s]'></script>\");", 
								url,StringHandle.StringListIntoString(groupinfo, ","))
						);
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
	}

	private void requirejs(HttpServletResponse response, JSONObject params) {
		// TODO Auto-generated method stub
		JSONArray require;
		if(params.getString("requirejs").startsWith("["))
			require=JSON.parseArray(params.getString("requirejs"));
		else require=JSON.parseArray("["+params.getString("requirejs")+"]");
		
		
		JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base  where groupidarray in "+StringHandle.createRepeatString("?", ",", "(", ")", require.size())+"  and type=0 and isvaild=1 order by zindex desc", JSONTools.JSONArrayToStringList(require).toArray());
		StringBuffer sb=new StringBuffer();	
		for(int i=0;i<jsinfo.size();i++)
		{
			JSONObject temp=jsinfo.getJSONObject(i);
			//这里尚且未加上测试的功能，以后可以添加
			sb.append("//groupid:").append(temp.getString("groupidarray")).append("--------js：").append(temp.getString("name")).append("-------------\n")
			.append(temp.getString("def")).append("\n");
			
		}
		try {
			response.getWriter().print(sb);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	private void requirecss(HttpServletResponse response, JSONObject params) {
		// TODO Auto-generated method stub
		JSONArray require;
		if(params.getString("requirecss").startsWith("["))
			require=JSON.parseArray(params.getString("requirecss"));
		else require=JSON.parseArray("["+params.getString("requirecss")+"]");
		
		
		JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base where groupidarray in "+StringHandle.createRepeatString("?", ",", "(", ")", require.size())+" and type=1 and isvaild=1 order by zindex desc",JSONTools.JSONArrayToStringList(require).toArray());
		StringBuffer sb=new StringBuffer();	
		for(int i=0;i<jsinfo.size();i++)
		{
			JSONObject temp=jsinfo.getJSONObject(i);
			//这里尚且未加上测试的功能，以后可以添加
			sb.append("/*groupid:").append(temp.getString("groupidarray")).append("----------css name:").append(temp.getString("name")).append("--------*/").append("\n")
			.append(temp.getString("def")).append("\n");
			
		}
		try {
			response.getWriter().print(sb);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	private void loadothers(HttpServletResponse response,JSONObject params) throws IOException{
		if(!params.getString("loadothers").equals("all"))
		{
			JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base where  type=2 and isvaild=1 order by zindex desc");
			StringBuffer sb=new StringBuffer();
			for(int i=0;i<jsinfo.size();i++)
			{
				JSONObject temp=jsinfo.getJSONObject(i);
				sb.append(temp.getString("def")).append("\n");
				
			}
			jsinfo=DBUtil.get_info_byjson("select * from js_base where groupidarray in (select id from js_groupdef  where name = ?) and type=2 and isvaild=1 order by zindex desc", params.getString("loadothers"));
			sb=new StringBuffer();
			System.out.println(jsinfo);
			for(int i=0;i<jsinfo.size();i++)
			{
				JSONObject temp=jsinfo.getJSONObject(i);
				//这里尚且未加上测试的功能，以后可以添加
				sb.append(temp.getString("def")).append("\n");
				
			}
			response.getWriter().print(sb);
		}
		else {
			JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base where type=2 and isvaild=1 order by zindex desc");
			StringBuffer sb=new StringBuffer();
			for(int i=0;i<jsinfo.size();i++)
			{
				JSONObject temp=jsinfo.getJSONObject(i);
				//这里尚且未加上测试的功能，以后可以添加
				sb.append(temp.getString("def")).append("\n");
				
			}
			response.getWriter().print(sb);
		}
		
	}

	private void loadcss(HttpServletResponse response, JSONObject params) throws IOException {
		if(!params.getString("loadcss").equals("all"))
		{
			JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base where groupidarray=4 and type=1 and isvaild=1 order by zindex desc");
			StringBuffer sb=new StringBuffer();
			for(int i=0;i<jsinfo.size();i++)
			{
				JSONObject temp=jsinfo.getJSONObject(i);
				sb.append("/*groupid:").append(params.getString("loadcss")).append("----------css name:").append(temp.getString("name")).append("--------*/").append("\n")
				.append(temp.getString("def")).append("\n");
				
			}
			jsinfo=DBUtil.get_info_byjson("select * from js_base where groupidarray=? and type=1 and isvaild=1 order by zindex desc", params.getString("loadcss"));
			sb=new StringBuffer();
			for(int i=0;i<jsinfo.size();i++)
			{
				JSONObject temp=jsinfo.getJSONObject(i);
				//这里尚且未加上测试的功能，以后可以添加
				sb.append("/*groupid:").append(params.getString("loadcss")).append("----------css name:").append(temp.getString("name")).append("--------*/").append("\n")
				.append(temp.getString("def")).append("\n");
				
			}
			response.getWriter().print(sb);
		}
		else {
			JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base where type=1 and isvaild=1");
			StringBuffer sb=new StringBuffer();
			for(int i=0;i<jsinfo.size();i++)
			{
				JSONObject temp=jsinfo.getJSONObject(i);
				//这里尚且未加上测试的功能，以后可以添加
				sb.append(temp.getString("def")).append("\n");
				
			}
			response.getWriter().print(sb);
		}
	}

	private void loadjs(HttpServletResponse response, JSONObject params) throws IOException {
		JSONArray jsinfo=DBUtil.get_info_byjson("select * from js_base where groupidarray=4 and type=0 and isvaild=1 order by zindex desc");
		StringBuffer sb=new StringBuffer();
		for(int i=0;i<jsinfo.size();i++)
		{
			JSONObject temp=jsinfo.getJSONObject(i);
			//这里尚且未加上测试的功能，以后可以添加
			sb.append("//groupid:").append(params.getString("loadjs")).append("--------js：").append(temp.getString("name")).append("-------------\n")
			.append(temp.getString("def")).append("\n");
			
		}
		if(!params.getString("loadjs").equals("all"))
		{
			
			
			jsinfo=DBUtil.get_info_byjson("select * from js_base where groupidarray=?  and type=0 and isvaild=1 order by zindex desc", params.getString("loadjs"));
			for(int i=0;i<jsinfo.size();i++)
			{
				JSONObject temp=jsinfo.getJSONObject(i);
				//这里尚且未加上测试的功能，以后可以添加
				sb.append("//groupid:").append(params.getString("loadjs")).append("--------js：").append(temp.getString("name")).append("-------------\n")
				.append(temp.getString("def")).append("\n");
				
			}
			response.getWriter().print(sb);
		}
		else {
			jsinfo=DBUtil.get_info_byjson("select * from js_base where groupidarray!=4 and type=0 and isvaild=1 order by zindex desc");
			
			for(int i=0;i<jsinfo.size();i++)
			{
				JSONObject temp=jsinfo.getJSONObject(i);
				//这里尚且未加上测试的功能，以后可以添加
				sb.append("//all--------js：").append(temp.getString("name")).append("-------------\n")
				.append(temp.getString("def")).append("\n");
				
			}
			response.getWriter().print(sb);
		}
	}

	private void jsGroup(HttpServletRequest request, HttpServletResponse response,JSONObject params) {
		String groupname=params.getString("group");
		StringBuffer url=request.getRequestURL();
		String preinfo=String.format("var HeadBaseInserter = document.getElementsByTagName('head')[0],baseStyleLoader = document.createElement('style');\r\n" + 
				"function linkScript(parm, fn) {\r\n" + 
				"	var linkScript;\r\n" + 
				"	if(/\\.css[^\\.]*$/.test(parm)) {\r\n" + 
				"		linkScript = document.createElement(\"link\");\r\n" + 
				"		linkScript.type = \"text/\" + (\"css\");\r\n" + 
				"		linkScript.rel = \"stylesheet\";\r\n" + 
				"		linkScript.href = parm;\r\n" + 
				"	} else {\r\n" + 
				"		linkScript = document.createElement(\"script\");\r\n" + 
				"		linkScript.type = \"text/\" + (\"javascript\");\r\n" + 
				"		linkScript.src = parm;\r\n" + 
				"	}\r\n" + 
				"	HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)\r\n" + 
				"	linkScript.onload = linkScript.onerror = function() {\r\n" + 
				"		if(fn) fn()\r\n" + 
				"	}\r\n" + 
				"}\r\n" + 
				"function linkCss(parm, fn) {\r\n" + 
				"	var linkScript;\r\n" + 
				"	\r\n" + 
				"	linkScript = document.createElement(\"link\");\r\n" + 
				"	linkScript.type = \"text/\" + (\"css\");\r\n" + 
				"	linkScript.rel = \"stylesheet\";\r\n" + 
				"	linkScript.href = parm;\r\n" + 
				"	\r\n" + 
				"	HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)\r\n" + 
				"	linkScript.onload = linkScript.onerror = function() {\r\n" + 
				"		if(fn) fn()\r\n" + 
				"	}\r\n" + 
				"}\r\n" + 
				"function linkScriptDOMLoaded(parm){\r\n" + 
				"    baseStyleLoader.innerHTML = 'body{display:none}';//动态加载文件造成样式表渲染变慢，为了防止DOM结构在样式表渲染完成前显示造成抖动，先隐藏body，样式表读完再显示\r\n" + 
				"    HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.firstChild)\r\n" + 
				"    var linkScript, linckScriptCount = parm.length, currentIndex = 0;\r\n" + 
				"    for ( var i = 0 ; i < parm.length; i++ ){\r\n" + 
				"        if(/\\.css[^\\.]*$/.test(parm[i])) {\r\n" + 
				"            linkScript = document.createElement(\"link\");\r\n" + 
				"            linkScript.type = \"text/\" + (\"css\");\r\n" + 
				"            linkScript.rel = \"stylesheet\";\r\n" + 
				"            linkScript.href = parm[i];\r\n" + 
				"        } else {\r\n" + 
				"            linkScript = document.createElement(\"script\");\r\n" + 
				"            linkScript.type = \"text/\" + (\"javascript\");\r\n" + 
				"            linkScript.src = parm[i];\r\n" + 
				"        }\r\n" + 
				"        HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)\r\n" + 
				"        linkScript.onload = linkScript.onerror = function(){\r\n" + 
				"            currentIndex++;\r\n" + 
				"            if(linckScriptCount == currentIndex){\r\n" + 
				"                baseStyleLoader.innerHTML = 'body{display:block}';\r\n" + 
				"                HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.lastChild)\r\n" + 
				"            }\r\n" + 
				"        }\r\n" + 
				"    }\r\n" + 
				"}\r\n" + 
				"function linkCssDOMLoaded(parm){\r\n" + 
				"    baseStyleLoader.innerHTML = 'body{display:none}';//动态加载文件造成样式表渲染变慢，为了防止DOM结构在样式表渲染完成前显示造成抖动，先隐藏body，样式表读完再显示\r\n" + 
				"    HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.firstChild)\r\n" + 
				"    var linkScript, linckScriptCount = parm.length, currentIndex = 0;\r\n" + 
				"    for ( var i = 0 ; i < parm.length; i++ ){\r\n" + 
				"       \r\n" + 
				"		linkScript = document.createElement(\"link\");\r\n" + 
				"		linkScript.type = \"text/\" + (\"css\");\r\n" + 
				"		linkScript.rel = \"stylesheet\";\r\n" + 
				"		linkScript.href = parm[i];\r\n" + 
				"       \r\n" + 
				"        HeadBaseInserter.insertBefore(linkScript, HeadBaseInserter.lastChild)\r\n" + 
				"        linkScript.onload = linkScript.onerror = function(){\r\n" + 
				"            currentIndex++;\r\n" + 
				"            if(linckScriptCount == currentIndex){\r\n" + 
				"                baseStyleLoader.innerHTML = 'body{display:block}';\r\n" + 
				"                HeadBaseInserter.insertBefore(baseStyleLoader,HeadBaseInserter.lastChild)\r\n" + 
				"            }\r\n" + 
				"        }\r\n" + 
				"    }\r\n" + 
				"}\r\n" + 
				"///移除平板样式文件\r\n" + 
				"function removeStyles(filename){\r\n" + 
				"  var targetelement = \"link\";\r\n" + 
				"  var targetattr = \"href\";\r\n" + 
				"  var allsuspects = document.getElementsByTagName(targetelement)\r\n" + 
				"  for (var i = allsuspects.length; i>=0 ; i--){\r\n" + 
				"    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {\r\n" + 
				"      allsuspects[i].parentNode.removeChild(allsuspects[i])\r\n" + 
				"    }\r\n" + 
				"  }\r\n" + 
				"}\r\n"
				+ "function dlink(web){"
				+ "	document.write('<script src=\"'+web+'\"></script>')"
				+ "}\r\n"
				+ "function dlinkCss(web){"
				+ "	document.write('<link rel=\"stylesheet\" href=\"'+web+'\">');"
				+ "}\r\n");
		if(!groupname.equals("all"))
		{
			JSONArray groupinfo=DBUtil.get_info_byjson("select * from js_groupdef");
			JSONArray point=JSONTools.findMany(groupinfo, "name", params.getString("group"));
			
			//如果有找到对应的类别
			if(point.size()>0)
			{
				JSONObject pjson=point.getJSONObject(0);
				try {
					
					response.getWriter().print(
							preinfo+
							
//							String.format("document.write('<link rel=\"stylesheet\" href=\"%s?loadcss=%d\">');", 
							String.format("linkCss('%s?loadcss=%d');", 
									url,pjson.getInteger("id"))
							+"\r\n"+
							String.format("document.write(\"<script language='javascript' src='%s?loadjs=%d'></script>\");", 
									url,pjson.getInteger("id"))
							);
					
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
		}
		else {
			//如果是要加载全部的类别
			try {
				response.getWriter().print(
						preinfo+
//						String.format("documnet.write('<link rel=\"stylesheet\" href=\"%s?loadcss=all\">');", 
						String.format("linkCss('%s?loadcss=all');", 
								url)
						+"\r\n"+
						String.format("document.write(\"<script language='javascript' src='%s?loadjs=all'></script>\");", 
								url)
						);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
//		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}

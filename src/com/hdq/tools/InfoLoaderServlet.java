package com.hdq.tools;

import java.io.IOException;

import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

@WebServlet("/InfoLoaderServlet")
public class InfoLoaderServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	//是否开启安全模式
	public static boolean g_safe=false;

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		super.service(request, response);
		
		//设置网页的字符编码为UTF-8,防止中文乱码
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String method="";
		if(request.getParameter("method")!=null)
			method=request.getParameter("method");
		System.out.println("method:"+method);
		JSONObject params=HttpHelper.getParams(request); 
		//解析Params
		params=JSONTools.formatRequestJSONObject(params);
		System.out.println("所有解析参数:"+params);

		if(method.equals("loaddbcols")) {
			if(!g_safe)
				loaddbcols(request, response);
		}
		else if(method.equals("loaddbdata")) { 
			if(!g_safe)
				loaddbdata(request, response);
		}
		else if(method.equals("deldbinfo")) {
			if(!g_safe)
				deldbinfo(request, response, params);
		}
		else if(method.equals("insertdbinfo")) {
			if(!g_safe)
				insertdbinfo(request, response, params);
		}
		else if(method.equals("editdbinfo")) {
			if(!g_safe)
				editdbinfo(request, response, params);
		}
		
		
	}
	
	private void editdbinfo(HttpServletRequest request, HttpServletResponse response, JSONObject params)
			throws IOException {
		JSONObject colsname=JSONObject.parseObject(params.getString("colsname"));
		if(!StringHandle.StringIsEmpty(params.getString("evalmethod"))) {//evalmethod拓展 传入其带有形参JSONObject的参数,JSONObject格式的列名 返回值String
			if(EntityToString.hasMethod(this.getClass(), params.getString("evalmethod"), JSONObject.class, JSONObject.class)) {
				String error=null;
				Object temp=EntityToString.executeTMethod(this, params.getString("evalmethod"), params, colsname);
				if(temp!=null) {
					error=(String) temp;
					if(!StringHandle.StringIsEmpty(error)) {
						response.getWriter().print(error);
						return;
					}
				}
			}
			else {
				response.getWriter().print("false");
				return;
			}
		}
		response.getWriter().print(DBUtil.insertInfoUpdateValid(request.getParameter("table"), params));
	}
	private void insertdbinfo(HttpServletRequest request, HttpServletResponse response, JSONObject params)
			throws IOException {
		JSONObject colsname=JSONObject.parseObject(params.getString("colsname"));
		if(!StringHandle.StringIsEmpty(params.getString("evalmethod"))) { //evalmethod拓展 其带有形参JSONObject的参数,JSONObject格式的列名 返回值String
			if(EntityToString.hasMethod(this.getClass(), params.getString("evalmethod"), JSONObject.class, JSONObject.class)) {
				String error=null; 
				Object temp=EntityToString.executeTMethod(this, params.getString("evalmethod"), params, colsname);
				if(temp!=null) {
					error=(String) temp;
					if(!StringHandle.StringIsEmpty(error)) {
						response.getWriter().print(error);
						return;
					}
				}
			}
			else {
				response.getWriter().print("false");
				return;
			}
		}
		response.getWriter().print(DBUtil.insertInfoValid(request.getParameter("table"), params));
	}
	private void deldbinfo(HttpServletRequest request, HttpServletResponse response, JSONObject params)
			throws IOException {
		if(!StringHandle.StringIsEmpty(params.getString("evalmethod"))) {
			if(EntityToString.hasMethod(this.getClass(), params.getString("evalmethod"), JSONObject.class)) {
				String error=null;
				Object temp=EntityToString.executeTMethod(this, params.getString("evalmethod"), params);
				if(temp!=null) {
					error=(String) temp;
					if(!StringHandle.StringIsEmpty(error)) {
						response.getWriter().print(error);
						return;
					}
				}
			}
			else {
				response.getWriter().print("false");
				return;
			}
		}
		response.getWriter().print(DBUtil.deleteEntityValid(request.getParameter("table"), params));
	}
	private void loaddbdata(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.getWriter().print(HttpHelper.getBootstrapTableInfo(request));
	}
	private void loaddbcols(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.getWriter().print(HttpHelper.getBootstrapTableCols(request));
	}
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	
	}
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doGet(req, resp);
		
	}
	//默认初始化处理函数
	public static String infosPrehandle(JSONObject info,JSONObject colsname,String ...allNeedValueCols) {
		String message=null;
		if(JSONTools.returnJSONOjbectEmptyKeys(colsname, allNeedValueCols).size()>0) {
			message="传递信息错误，存在键名未定义";
			return message;
		}
		JSONArray emptyCols=JSONTools.returnJSONOjbectEmptyKeys(info, allNeedValueCols);
		if(emptyCols.size()>0) {
			JSONArray names=JSONTools.returnJSONOjbectValues(colsname, JSONTools.JSONArrayToStringNList(emptyCols));
			List<String> namelist=JSONTools.JSONArrayToStringList(names);
			message=StringHandle.StringListIntoString(namelist, ",")+"不能为空";
			return message;
		}	
		return message;
	}
	
	
	/**
	 * 示例自定义处理函数 eval_example名称可以为任意
	 * @param info 前端传递过来所有参数的JSONObjec
	 * @param colsname 参数列名对应中文名的JSONObject
	 * @return 前端提示信息，为空表示不提示
	 */
	public String eval_example(JSONObject info,JSONObject colsname) {
		String allNeedValueCols[]=new String[] {};
		String message=infosPrehandle(info,colsname,allNeedValueCols);
		
		if(message!=null)
			return message;
		//下面添加拓展判别
		
		return message;
	}
	/**
	 * Unicode转换成String
	 * @param theString
	 * @return
	 */
	public static String decodeUnicode(String theString) {
		char aChar;
		int len = theString.length();
		StringBuffer outBuffer = new StringBuffer(len);
		for (int x = 0; x < len;) {
			aChar = theString.charAt(x++);
			if (aChar == '\\') {
				aChar = theString.charAt(x++);
				if (aChar == 'u') {
					// Read the xxxx
					int value = 0;
					for (int i = 0; i < 4; i++) {
						aChar = theString.charAt(x++);
						switch (aChar) {
						case '0':
						case '1':
						case '2':
						case '3':
						case '4':
						case '5':
						case '6':
						case '7':
						case '8':
						case '9':
							value = (value << 4) + aChar - '0';
							break;
						case 'a':
						case 'b':
						case 'c':
						case 'd':
						case 'e':
						case 'f':
							value = (value << 4) + 10 + aChar - 'a';
							break;
						case 'A':
						case 'B':
						case 'C':
						case 'D':
						case 'E':
						case 'F':
							value = (value << 4) + 10 + aChar - 'A';
							break;
						default:
							throw new IllegalArgumentException(
									"Malformed   \\uxxxx   encoding.");
						}
 
					}
					outBuffer.append((char) value);
				} else {
					if (aChar == 't')
						aChar = '\t';
					else if (aChar == 'r')
						aChar = '\r';
					else if (aChar == 'n')
						aChar = '\n';
					else if (aChar == 'f')
						aChar = '\f';
					outBuffer.append(aChar);
				}
			} else
				outBuffer.append(aChar);
		}
		return outBuffer.toString();
	}


	

}

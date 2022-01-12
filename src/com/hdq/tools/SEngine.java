package com.hdq.tools;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import com.alibaba.fastjson.JSONObject;

public class SEngine {
	public static Object eval(String info,JSONObject putvari)
	{
		ScriptEngineManager manager = new ScriptEngineManager();
		ScriptEngine se = manager.getEngineByName("js");

		StringBuilder result=new StringBuilder();
		try {
			for(String key:putvari.keySet()) {
				result.append("var ").append(key).append("=").append("").append(putvari.getString(key)).append(";\r\n");
			}
			result.append(info);
			return se.eval(result.toString());
		} catch (ScriptException e) {
			e.printStackTrace();
		}
		return null;

	}
//	public static void main(String args[])
//	{
//		JSONObject info=new JSONObject();
//		JSONObject ok=new JSONObject();
//		ok.put("name", "名字测试");
//		info.put("a", 1);
//		info.put("b", 100);
//		info.put("isSuitReg", "function(array,formatStr){var result=[]\r\n" + 
//				"	var isToObj=isSuitReg(formatstr,\"\\\\s*(\\\\{|\\\\[)[\\\\s\\\\S]*\")\r\n" + 
//				"	if(isToObj)\r\n" + 
//				"	{\r\n" + 
//				"		for(var i in array){\r\n" + 
//				"			var This=array[i];\r\n" + 
//				"			result.push(eval(\"(\"+formatstr+\")\"))\r\n" + 
//				"		}\r\n" + 
//				"	}\r\n" + 
//				"	else{\r\n" + 
//				"		var fstr=formatstr.split(\",\");\r\n" + 
//				"		for(var i in fstr){\r\n" + 
//				"			result.push([])\r\n" + 
//				"		}\r\n" + 
//				"		for(var i in array){\r\n" + 
//				"			var This=array[i];\r\n" + 
//				"			for(var istr in fstr){\r\n" + 
//				"				result[istr].push(eval(\"(\"+fstr[istr]+\")\"))\r\n" + 
//				"			}\r\n" + 
//				"		}\r\n" + 
//				"	}\r\n" + 
//				"	return result;}");
//		info.put("formatJsonarrray", "function(array,formatStr){var result=[]\r\n" + 
//				"	var isToObj=isSuitReg(formatstr,\"\\\\s*(\\\\{|\\\\[)[\\\\s\\\\S]*\")\r\n" + 
//				"	if(isToObj)\r\n" + 
//				"	{\r\n" + 
//				"		for(var i in array){\r\n" + 
//				"			var This=array[i];\r\n" + 
//				"			result.push(eval(\"(\"+formatstr+\")\"))\r\n" + 
//				"		}\r\n" + 
//				"	}\r\n" + 
//				"	else{\r\n" + 
//				"		var fstr=formatstr.split(\",\");\r\n" + 
//				"		for(var i in fstr){\r\n" + 
//				"			result.push([])\r\n" + 
//				"		}\r\n" + 
//				"		for(var i in array){\r\n" + 
//				"			var This=array[i];\r\n" + 
//				"			for(var istr in fstr){\r\n" + 
//				"				result[istr].push(eval(\"(\"+fstr[istr]+\")\"))\r\n" + 
//				"			}\r\n" + 
//				"		}\r\n" + 
//				"	}\r\n" + 
//				"	return result;}");
//		System.out.println(eval("a",info));
//	}
}

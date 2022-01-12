package com.hdq.tools;

import java.util.Arrays;
import java.util.Properties;



public class Config {

	//--------------MySql管理------------------
	//定义链接地址
//	public static String db_url = "jdbc:mysql://58.221.57.175:3306/";
	public static String db_url = "jdbc:mysql://localhost:3306/";
	//数据库名
	public static String db_database="devicesuit";
	//数据库用户名
	public static String db_user = "root";
	//数据库密码
	public static String db_pass = "password";
	//数据驱动
	public static String db_driver = "com.mysql.jdbc.Driver";
	
	
	
	
	
	static {
		//兼容性处理
		boolean isLinux=false;
		//获取当前目录下 否则为类目录下
		boolean inClass=true;
		//配置文件名称
		String configFile="jdbc.properties";
		
		if(!inClass) {
			if(JudgeSystem.getSystem().equals("linux"))
				isLinux=true;
		
			String append="/";
			if(isLinux)
				append="/";
			
			String path=FileHandle.getClassesDirPath(Config.class);
	    	String spath[]=path.split("/");
	    	String outdir=StringHandle.StringListIntoString(
	    			StringHandle.StringNlistToStringList(Arrays.copyOfRange(spath, 1, spath.length-1))
	    			, "/");
	    	if(FileHandle.judgeFileExists(append+outdir+"/"+configFile))
	    	{
	    		Properties props=FileHandle.getPropertiesByPath(append+outdir+"/"+configFile);
	    		for(String init:EntityToString.getNameList(Config.class))
	    		{
	    			
	    			String pvalue=null;
	    			if(props.get(init)!=null)
	    				pvalue=props.get(init).toString();
	    			else continue;
	    			if(pvalue.equals("true")||pvalue.equals("false"))
	    			{
	    				EntityToString.setNameValue(new Config(), init, Boolean.valueOf(props.get(init).toString()));
	    			}
	    			else if(StringHandle.StringIsSuitExep(pvalue, "\\d+")) 
	    			{
	    				EntityToString.setNameValue(new Config(), init, Integer.parseInt(props.get(init).toString()));
	    			}
	    			else {
	    				EntityToString.setNameValue(new Config(), init, props.get(init).toString());
	    			}
	    		}
	    	}
		}
		else
		{
			Properties props=FileHandle.getPropertiesByStream(Config.class.getResourceAsStream(configFile));
    		for(String init:EntityToString.getNameList(Config.class))
    		{
    			String pvalue=null;
    			if(props.get(init)!=null)
    				pvalue=props.get(init).toString();
    			else continue;
    			
    			if(pvalue.equals("true")||pvalue.equals("false"))
    			{
    				EntityToString.setNameValue(new Config(), init, Boolean.valueOf(props.get(init).toString()));
    			}
    			else if(StringHandle.StringIsSuitExep(pvalue, "\\d+")) 
    			{
    				EntityToString.setNameValue(new Config(), init, Integer.parseInt(props.get(init).toString()));
    			}
    			else {
    				EntityToString.setNameValue(new Config(), init, props.get(init).toString());
    			}
    		}
    	}
		
	}
}	

package com.hdq.tools;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;



/*
 * author:洪鼎淇 石家庄铁道大学 信1705-3
 * introduce:Oracle通用处理类
 */

public class OracleUtil {


//example:
//	static String driverClass="oracle.jdbc.driver.OracleDriver"; //oracle的驱动
//	static String url="jdbc:oracle:thin:@localhost:1521:orcl";  //连接oracle路径方式 
//	static String user="Halo";   //user是数据库的用户名
//	static String password="aA13902766702";  //用户登录密码
	
//	static String url="jdbc:oracle:thin:@192.168.62.200:1521:orcl";  //连接oracle路径方式 
//	static String user="DBL";   //user是数据库的用户名
//	static String password="Huawei12#$";  //用户登录密码
	
	public static Connection getconn() {  //为了方便下面的讲解，这里专门建立了一个用于数据库连接的一个方法
		Connection conn=null;
		try {
			if(conn==null||conn.isClosed())
			{
				try {

					//首先建立驱动
					Class.forName("oracle.jdbc.driver.OracleDriver");
					//驱动成功后进行连接
					conn=DriverManager.getConnection(Config.db_url+Config.db_database+"?characterEncoding=utf-8", Config.db_user, Config.db_pass);

					System.out.println("连接成功");
				} catch (SQLException e) {
					e.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return conn; //返回一个连接
	}
	public static void close(Connection conn)
	{
		
		try {
			conn.close();
			conn=null;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public static void closeStatement(Statement statement)
	{
		if (statement != null)
		{
			try
			{
				statement.close();
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
	}

	//获取数据，数据存放于List<List<String>>中
	public static List<List<String>> get_info(String sql,Object ...args)
	{
		List<List<String>> info=new ArrayList<List<String>>();
		Connection conn=getconn();
		PreparedStatement statement =null;
		try {
			statement = conn.prepareStatement(sql);

			for (int i=0;i<args.length;i++){
				statement.setObject(i+1, args[i]);
			}
			ResultSet rs = statement.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData() ; 
			int columnCount = rsmd.getColumnCount(); 
			while(rs.next())
			{
				List<String> subinfo=new ArrayList<String>();
				for(int i=1;i<=columnCount;i++)
				{
					subinfo.add(rs.getString(i));
				}
				info.add(subinfo);
			}

		}
		catch (SQLException e)
		{

			System.out.println(e);
			e.printStackTrace();
		}
		finally
		{
			closeStatement(statement);
			close(conn);
		}
		return info;
	}
	//获取jsonarray
	public static JSONArray get_info_byjson(String sql,Object ...args)
	{
		List<Map<String,String>> result=DBUtil.get_info_bymap(sql,args);
		JSONArray rarr=new JSONArray();
		for(Map<String,String> subinfo:result)
		{
			JSONObject obj=new JSONObject();
			obj.putAll(subinfo);
			rarr.add(obj);
		}
		return rarr;
	}
	//获取数据，数据存放于List<Map<String,String>>中
	public static List<Map<String,String>> get_info_bymap(String sql,Object ...args)
	{
		List<Map<String,String>> info=new ArrayList<Map<String,String>>();
		Connection conn=getconn();
		PreparedStatement statement =null;
		try {
			statement = conn.prepareStatement(sql);

			for (int i=0;i<args.length;i++){
				statement.setObject(i+1, args[i]);
			}
			ResultSet rs = statement.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData() ; 
			
			int columnCount = rsmd.getColumnCount(); 
			while(rs.next())
			{
				Map<String,String> subinfo=new HashMap<String,String>();
				for(int i=1;i<=columnCount;i++)
				{
					
					subinfo.put(rsmd.getColumnName(i),rs.getString(i));
				}
				info.add(subinfo);
			}

		}
		catch (SQLException e)
		{

			System.out.println(e);
			e.printStackTrace();
		}
		finally
		{
			closeStatement(statement);
			close(conn);
		}
		return info;
	}
	
	
	public static List<String> get_colsname(String table)
	{
		List<String> subinfo=new ArrayList<String>();
		Connection conn=getconn();
		Statement statement = null;
		try
		{
			String sql="select * from "+table+" where rownum<=1";
			statement =conn.createStatement();
			ResultSet rs = statement.executeQuery(sql);
			ResultSetMetaData rsmd = rs.getMetaData() ; 
			int columnCount = rsmd.getColumnCount(); 
//			while(rs.next())
			{

				for(int i=1;i<=columnCount;i++)
				{
					subinfo.add(rsmd.getColumnName(i));
				}

			}

		}
		catch (SQLException e)
		{

			System.out.println(e);
			e.printStackTrace();
		}
		finally
		{
			closeStatement(statement);
			close(conn);
		}
		return subinfo;
	}
	
	
	
	public static List<String> get_singal_list(String sql,Object ...args)
	{
		List<String> result=new ArrayList<String>();
		Connection conn=getconn();
		PreparedStatement statement =null;
		try {
			statement = conn.prepareStatement(sql);

			for (int i=0;i<args.length;i++){
				statement.setObject(i+1, args[i]);
			}
			ResultSet rs = statement.executeQuery();
			while(rs.next())
			{
				result.add(rs.getString(1));
			}
		}
		catch (SQLException e)
		{
			System.out.println(e);
			e.printStackTrace();
		}
		finally
		{
			closeStatement(statement);
			close(conn);
		}
		return result;
	}
	
	/**
	 *
	 * @param sql
	 * @return 查询到的结果集
	 */
	public static ResultSet executeQuery(String sql,Object ...args){
		Connection conn=getconn();
		PreparedStatement statement =null;
		try {
			statement = conn.prepareStatement(sql);

			for (int i=0;i<args.length;i++){
				statement.setObject(i+1, args[i]);
			}
			ResultSet rs = statement.executeQuery();
			return  rs;
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public static int executeUpdate(String sql,Object... args)
	{
		int result=0;
		Connection conn=getconn();
		
		PreparedStatement statement =null;
		try {
			statement = conn.prepareStatement(sql);

			for (int i=0;i<args.length;i++){
				statement.setObject(i+1, args[i]);
			}
			result = statement.executeUpdate();
			
		}
		catch (SQLException e)
		{
			System.out.println(e);
			e.printStackTrace();
		}
		finally
		{
			closeStatement(statement);
			close(conn);
		}
		return result;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static List removeDuplicate(List list) {   
	    HashSet h = new HashSet(list);   
	    list.clear();   
	    list.addAll(h);   
	    return list;   
	} 
	
	 //判断表是否存在
    public static boolean isExistTable(String tablename)
    {
//        String tableNameStr = "select count(1) from user_tables where table_name ='" + tablename.toUpperCase() + "'";
//
//        int result=Integer.parseInt(get_singal_list(tableNameStr).get(0));
//        if (result == 0)
//        {
//            return false;
//        }
//        else
//        {
//            return true;
//        }
    	return DBUtil.get_singal_list("show tables like \""+tablename.toLowerCase()+"\"").size()>0;
    }
    //判断获取的列表信息中是否存在数据，可以不仅仅判断由数据库获取的信息
    public static <T> boolean isEmpty(List<T> data)
    {
    	if(data==null||data.size()==0)
    		return true;
    	return false;
    }
    //ORM部分功能支持，将T数组转换为Object数组
    @SafeVarargs
	public static <T> Object[] TArrayToObjectArray(T ...args)
    {
    	List<Object> tempinfo=new ArrayList<>();
		for(Object value:args)
			tempinfo.add(value);
		return tempinfo.toArray();
    }
  //添加实例到数据库中
    public static <T> boolean addEntityInfo(T t,String table,boolean notPutEmpty,String ...ignore)
	{
    	List<String> cols=EntityToString.getNameList(t.getClass());
    	List<String> valueslist=EntityToString.getStringListSingle(t);
    	//去除id列使其id无关
    	for(String one:ignore)
    	{
    		if(!cols.contains(one)) {
    			System.out.println("查无此要忽略的列名，添加实体到数据库失败");
    			return false;
    		}
    		int idindex=cols.indexOf(one);
    		cols.remove(one);
    		valueslist.remove(idindex);
    	}
    	if(notPutEmpty)
    	{
    		for(int i=valueslist.size()-1;i>=0;i--)
        	{
        		if(valueslist.get(i)==null)
        		{
        			cols.remove(i);
            		valueslist.remove(i);
        		}
        	}
    	}
			
		String infocols=StringHandle.StringListIntoString(StringHandle.StringListAdd(cols, "`", "`"), ",");
		String[] values=StringHandle.StringListToStringNlist(valueslist);
		List<String> holder=new ArrayList<>();
		for(int i=0;i<values.length;i++)
			holder.add("?");
		String sql=StringHandle.SqlPutInfosWithoutQuoteFirst("insert into ?(?) values("+StringHandle.StringListIntoString(holder, ",")+");", table);
		sql=StringHandle.SqlPutInfosWithoutQuoteFirst(sql,infocols);

		return executeUpdate(sql,TArrayToObjectArray(values))>0;
	}
    /*//orm实例
    public static List<DevModel> getDeviceModelByLevel(String devtypeid,String level)
	{
		List<List<String>> infos=DBUtil.get_info("select * from "+ Config.tb_devs +" where devtypeid=?",devtypeid);
		return EntityToString.setNameValueListCorrect(infos, DBUtil.get_colsname(Config.tb_devs), Dev.class);
	}
	public static DevDef getDevDef(String devtypeid) {
		List<List<String>> infos=DBUtil.get_info("select * from "+ Config.tb_devdef +" where devtypeid=?",devtypeid);
		if(!DBUtil.isEmpty(infos))
			return EntityToString.setNameValueCorrect(infos.get(0), DBUtil.get_colsname(Config.tb_devdef), DevDef.class);
		else return null;
	}
    */
    //ORM获取数据库多个实例
    public static <T> List<T> getORMEntities(Class<T> classz,String sql,String table,Object ...args)
	{
		List<List<String>> infos=get_info(sql,args);
		return EntityToString.setNameValueListCorrect(infos, get_colsname(table), classz);
	}
    //ORM获取数据库单个实例
    public static <T> T getORMEntity(Class<T> classz,String sql,String table,Object ...args) {
		List<List<String>> infos=get_info(sql,args);
		if(!isEmpty(infos))
			return EntityToString.setNameValueCorrect(infos.get(0), get_colsname(table), classz);
		else return null;
	}
    //删除对应的实例
    public static <T> boolean deleteEntity(String table,T t)
    {
    	List<String> cols=EntityToString.getNameList(t.getClass());
    	List<String> values=EntityToString.getStringListSingle(t);
    	StringBuilder sb=new StringBuilder();
    	int count=0;
    	for(int i=cols.size()-1;i>=0;i--)
    	{
    		
    		if(values.get(i)!=null) {
    			if(count!=0)
        			sb.append(" and ");
        		count++;
    			sb.append("`").append(cols.get(i)).append("`=").append("?");
    		}
    		else values.remove(i);
    	}
    	Collections.reverse(values);
    	return executeUpdate("delete from "+table+" where "+sb.toString(),values.toArray())>0;
   
    }
    //修改对应实例
    public static <T> boolean updateEntity(String table,T t,T change)
    {
    	List<String> cols=EntityToString.getNameList(t.getClass());
    	List<String> values=EntityToString.getStringListSingle(t);
    	StringBuilder sb=new StringBuilder();
    	int count=0;
    	for(int i=cols.size()-1;i>=0;i--)
    	{
    		
    		if(values.get(i)!=null) {
    			if(count!=0)
        			sb.append(" and ");
        		count++;
    			sb.append("`").append(cols.get(i)).append("`=").append("?");
    			if(StringHandle.StringIsEmpty(values.get(i)))
    				values.set(i, null);
    		}
    		else values.remove(i);
    	}
    	StringBuilder sb1=new StringBuilder();
    	List<String> values1=EntityToString.getStringListSingle(change);
    	count=0;
    	for(int i=cols.size()-1;i>=0;i--)
    	{
    		if(values1.get(i)!=null) {
    			if(count!=0)
        			sb1.append(",");
        		count++;
    			sb1.append("`").append(cols.get(i)).append("`=").append("?");
        		
    		}
    		else values1.remove(i);
    	}
    	Collections.reverse(values1);
    	Collections.reverse(values);
    	values1.addAll(values);
    	return executeUpdate("update "+table+" set "+sb1.toString()+" where "+sb.toString(),values1.toArray())>0;
    }
    //修改对应实例
    public static <T> boolean updateEntity(String table,String keyname,T change)
    {
    	List<String> cols=EntityToString.getNameList(change.getClass());
 
    	StringBuilder sb=new StringBuilder();
    	int count=0;
    	for(int i=cols.size()-1;i>=0;i--)
    	{
    		if(cols.get(i).equals(keyname)) {
    			sb.append("`").append(keyname).append("`=").append("?");
    		}
    	}
    	StringBuilder sb1=new StringBuilder();
    	List<String> values1=EntityToString.getStringListSingle(change);
    	count=0;
    	for(int i=cols.size()-1;i>=0;i--)
    	{
    		if(values1.get(i)!=null) {
    			if(count!=0)
        			sb1.append(",");
        		count++;
    			sb1.append("`").append(cols.get(i)).append("`=").append("?");
    			if(StringHandle.StringIsEmpty(values1.get(i)))
    				values1.set(i, null);
    		}
    		else values1.remove(i);
    	}
    	Collections.reverse(values1);
    	values1.add(EntityToString.getNameValue(change, keyname));
    	return executeUpdate("update "+table+" set "+sb1.toString()+" where "+sb.toString(),values1.toArray())>0;
    }
    
    
  //自动补全内部数据
    @SuppressWarnings("unchecked")
	public static <T> void autoGetEntityInfo(String table,T t)
    {
    	String sql="select * from "+table;
    	List<String> cols=EntityToString.getNameList(t.getClass());
    	List<String> values=EntityToString.getStringListSingle(t);
    	List<String> valuesTrue=new ArrayList<>();
    	List<String> condition=new ArrayList<>();
    	for(int i=0;i<cols.size();i++)
    	{
    		if(values.get(i)!=null)
    		{
    			valuesTrue.add(values.get(i));
    			condition.add("`"+cols.get(i)+"`=?");
    		}
    			
    	}
    	if(condition.size()!=0)
    	{
    		sql+=" where "+StringHandle.StringListIntoString(condition, " and ");
    	}
    	
    	T allinfo=(T) getORMEntity(t.getClass(),sql,table,valuesTrue.toArray());
    	EntityToString.setNameValues(t, cols, Arrays.asList(EntityToString.getStringListSingle(allinfo).toArray()));
    	
    }
    
    //获取未补全内部的全部数据 当查询只有1个的时候
    @SuppressWarnings("unchecked")
	public static <T> T GetEntityInfo(String table,T t)
    {
    	String sql="select * from "+table;
    	List<String> cols=EntityToString.getNameList(t.getClass());
    	List<String> values=EntityToString.getStringListSingle(t);
    	List<String> valuesTrue=new ArrayList<>();
    	List<String> condition=new ArrayList<>();
    	for(int i=0;i<cols.size();i++)
    	{
    		if(values.get(i)!=null)
    		{
    			valuesTrue.add(values.get(i));
    			condition.add("`"+cols.get(i)+"`=?");
    		}
    			
    	}
    	if(condition.size()==0)
    		return null;
    	else
    	{
    		sql+=" where "+StringHandle.StringListIntoString(condition, " and ");
    	}
    	
    	return (T) getORMEntity(t.getClass(),sql,table,valuesTrue.toArray());
    }
    
    
    //自动补全内部数据 当查询能出来多个的时候
    @SuppressWarnings("unchecked")
	public static <T> List<T> GetEntitiesInfo(String table,T t)
    {
    	String sql="select * from "+table;
    	List<String> cols=EntityToString.getNameList(t.getClass());
    	List<String> values=EntityToString.getStringListSingle(t);
    	List<String> valuesTrue=new ArrayList<>();
    	List<String> condition=new ArrayList<>();
    	for(int i=0;i<cols.size();i++)
    	{
    		if(values.get(i)!=null)
    		{
    			condition.add("`"+cols.get(i)+"`=?");
    			valuesTrue.add(values.get(i));
    		}
    			
    	}
    	if(condition.size()==0)
    		return null;
    	else
    	{
    		sql+=" where "+StringHandle.StringListIntoString(condition, " and ");
    	}
    	System.out.println(sql);
    	return (List<T>) getORMEntities(t.getClass(),sql,table,valuesTrue.toArray());
    }
    //插入数据 cols之间用;分隔开
    public static boolean insertInfo(String tablename,String cols,Object ...values)
    {
    	List<String> colsN=StringHandle.StringNlistToStringList(cols.split(";"));
    	StringBuilder sql=new StringBuilder();
    	sql.append("insert into `").append(tablename).append("` set ");
    	for(int i=0;i<colsN.size();i++)
    	{
    		sql.append("`").append(colsN.get(i)).append("`").append("=?");
    		if(i!=colsN.size()-1)
    			sql.append(",");
    	}
    	return executeUpdate(sql.toString(),values)>0;
    }
    public static boolean insertInfoUpdate(String tablename,String cols,Object ...values)
    {
    	List<String> colsN=StringHandle.StringNlistToStringList(cols.split(";"));
    	StringBuilder sql=new StringBuilder();
    	sql.append("insert into `").append(tablename).append("`(");
    	sql.append(StringHandle.StringListIntoString(StringHandle.StringListAdd(colsN, "`", "`"), ",")).append(")  values(");
    	for(int i=0;i<colsN.size();i++)
    	{
    		sql.append("?");
    		if(i!=colsN.size()-1)
    			sql.append(",");
    	}
    	
    	String upsql="";
		for(int i=0;i<colsN.size();i++)
		{
			if(i!=0)
				upsql+=",";
			String col=colsN.get(i);
			upsql+=" "+col+"=VALUES("+col+")";
		}
		sql.append(") ON DUPLICATE KEY UPDATE "+upsql);
//    	System.out.println(StringHandle.SqlPutInfos(sql.toString(), values));
    	return executeUpdate(sql.toString(),values)>0;
    }
    
//	public static void main(String []s)
//	{
//		System.out.println(get_info_bymap("select * from ANNUAL_MAIN"));
//	}
	
}

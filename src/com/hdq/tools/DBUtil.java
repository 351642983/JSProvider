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





/**
 * 数据库连接工具
 * @author 洪鼎淇  石家庄铁道大学 信1705-3
 * v2.0 增强了对于SQL注入的防护，同时优化了一些函数的使用方法同时兼容V1.0版本
 * v2.01 遗留bug修复，使其正常地关闭连接
 * v2.02 JSON拓展支持
 */

public class DBUtil {

	

	
	public static Connection getConn () {
		Connection conn = null;

		
			try {
				Class.forName(Config.db_driver);
				conn = DriverManager.getConnection(Config.db_url+Config.db_database+"?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=UTC", Config.db_user, Config.db_pass);
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}//加载驱动
			catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		
		return conn;
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



	/**
	 *
	 * @param sql 执行的sql语句
	 * @param args 参数
	 * @return true代表执行成功  反之亦然
	 */
	public static int executeUpdate(String sql,Object... args){
		
		Connection conn=getConn();
		PreparedStatement ps =null;
		try {
			ps = conn.prepareStatement(sql);

			for (int i=0;i<args.length;i++){
				ps.setObject(i+1, args[i]);
			}
			int i = ps.executeUpdate();
			return  i;
		} catch (SQLException e) {
			System.out.print(sql);
			e.printStackTrace();
			return  -1;
		}finally {
				close(ps,conn);
//				conn.close();
		}
	}

	/**
	 *
	 * @param sql
	 * @return 查询到的结果集
	 */
	public static ResultSet executeQuery(String sql,Object... args){

		PreparedStatement ps =null;
		Connection conn=null;
		ResultSet rs=null;
		try {
			conn=getConn();
			ps = conn.prepareStatement(sql);
			for (int i=0;i<args.length;i++){
				ps.setObject(i+1, args[i]);
			}
			rs = ps.executeQuery();
			return  rs;
		} catch (SQLException e) {
			System.out.println(sql);
			e.printStackTrace();
			return null;
		}finally {
			close(rs,ps,conn);
		}
	}


	/**
	 * 关闭连接
	 * @param state
	 * @param conn
	 */
	public static void close (Statement state, Connection conn) {
		if (state != null) {
			try {
				state.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

		if (conn != null) {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

	public static void close (ResultSet rs, Statement state, Connection conn) {
		if (rs != null) {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

		if (state != null) {
			try {
				state.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

		if (conn != null) {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	//获得表的所有字段名字
	public static List<String> get_colsname(String table)
	{
		List<String> colsname=new ArrayList<String>();
		Connection conn = getConn();
        String sql = "select * from "+table+" where 1=0";
        PreparedStatement stmt=null;
        try {
            stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery(sql);
            ResultSetMetaData data = rs.getMetaData();
//            while(rs.next())
            {
            	int nums=data.getColumnCount();
	            for (int i = 1; i <= nums; i++) {
	            	colsname.add(data.getColumnName(i)) ;
	            }
//	            break;
            }
        }
        catch (SQLException e) {
        	e.printStackTrace();
        }finally {
			close(stmt,conn);
//			conn.close();
        }
        return colsname;
        
	}
	
	//获得所有数据信息
	public static List<List<String>> get_info(String sql,Object ...args)
	{
		List<List<String>> info=new ArrayList<List<String>>();
		Connection conn=getConn();
		PreparedStatement statement = null;
		ResultSet rs=null;
		try
		{
			statement =conn.prepareStatement(sql);
			for (int i=0;i<args.length;i++){
				statement.setObject(i+1, args[i]);
			}
			rs = statement.executeQuery();
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
			System.out.print(sql);
			e.printStackTrace();
		}finally {
			close(rs,statement,conn);
		}
		
		return info;
	}
	//获取数据，数据存放于List<Map<String,String>>中
	public static List<Map<String,String>> get_info_bymap(String sql,Object ...args)
	{
//		sql=StringHandle.SqlPutInfosWithoutQuote(sql, args);
		List<Map<String,String>> info=new ArrayList<Map<String,String>>();
		Connection conn=getConn();
		PreparedStatement statement = null;
		ResultSet rs=null;
		try
		{
			statement =conn.prepareStatement(sql);
			for (int i=0;i<args.length;i++){
				statement.setObject(i+1, args[i]);
			}
			rs = statement.executeQuery();
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
			System.out.print(sql);
			e.printStackTrace();
		}finally {
			close(rs,statement,conn);
		}
		
		return info;
		
	}
	
	public static List<String> get_singal_list(String sql,Object ...args)
	{
//		sql=StringHandle.SqlPutInfosWithoutQuote(sql, args);
		List<String> result=new ArrayList<String>();
		Connection conn=getConn();
		PreparedStatement statement = null;
		ResultSet rs=null;
		try
		{
			statement =conn.prepareStatement(sql);
			for (int i=0;i<args.length;i++){
				statement.setObject(i+1, args[i]);
				
			}
			
			rs = statement.executeQuery();
			while(rs.next())
			{
				result.add(rs.getString(1));
			}
		}
		catch (SQLException e)
		{
			System.out.print(sql);
//			System.out.println(e);
			e.printStackTrace();
		}finally {
			close(rs,statement,conn);
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
//        String tableNameStr = "SELECT count(0) FROM information_schema.TABLES WHERE table_schema='"+Config.db_database+"' and table_name='"+tablename.toLowerCase()+"';";
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
    	Object info=getORMEntity(t.getClass(),sql,table,valuesTrue.toArray());
    	if(info==null)
    		return;
    	T allinfo= (T) info;
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
    
    
    //获取数据 当能查询能出来多个的时候
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
//    	System.out.println(sql);
    	return (List<T>) getORMEntities(t.getClass(),sql,table,valuesTrue.toArray());
    }
    
    
    
    //判断获取的列表信息中是否存在数据，可以不仅仅判断由数据库获取的信息
    public static <T> boolean isEmpty(List<T> data)
    {
    	if(data==null||data.size()==0)
    		return true;
    	return false;
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
    
    public static <T> boolean deleteEntity(String table,JSONObject obj)
    {
    	List<String> cols=new ArrayList<>(obj.keySet());
    	List<String> values=new ArrayList<>();
    	for(int i=0;i<cols.size();i++) {
    		values.add(obj.getString(cols.get(i)));
    	}
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
    public static <T> boolean deleteEntityValid(String table,JSONObject obj)
    {
    	List<String> cols=get_colsname(table);
    	List<String> values=new ArrayList<>();
    	for(int i=cols.size()-1;i>=0;i--) {
    		if(!obj.containsKey(cols.get(i))) {
    			cols.remove(i);
    		}
    	}
    	for(int i=0;i<cols.size();i++) {
    		values.add(obj.getString(cols.get(i)));
    	}
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
    			if(StringHandle.StringIsEmpty(values1.get(i)))
    				values1.set(i, null);
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
    			break;
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
    
    //插入数据 cols之间用;分隔开
    public static boolean insertInfo(String tablename,String cols,Object ...values)
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
    	sql.append(")");
    	return executeUpdate(sql.toString(),values)>0;
    }
    //用JSONObject插入 无验证
    public static boolean insertInfo(String tablename,JSONObject obj)
    {
    	
    	List<String> colsN=new ArrayList<>(obj.keySet());
    	StringBuilder sql=new StringBuilder();
    	sql.append("insert into `").append(tablename).append("`(");
    	sql.append(StringHandle.StringListIntoString(StringHandle.StringListAdd(colsN, "`", "`"), ",")).append(")  values(");
    	for(int i=0;i<colsN.size();i++)
    	{
    		sql.append("?");
    		if(i!=colsN.size()-1)
    			sql.append(",");
    	}
    	sql.append(")");
    	List<String> valuesList=new ArrayList<>();
    	for(int i=0;i<colsN.size();i++) {
    		valuesList.add(obj.getString(colsN.get(i)));
    	}
    	return executeUpdate(sql.toString(),valuesList.toArray())>0;
    }
    //用JSONObject插入 Valid有验证列
    public static boolean insertInfoValid(String tablename,JSONObject obj)
    {
    	
    	List<String> colsN=get_colsname(tablename);
    	for(int i=colsN.size()-1;i>=0;i--) {
    		if(!obj.containsKey(colsN.get(i)))
    		{
    			colsN.remove(i);
    		}
    	}
    	StringBuilder sql=new StringBuilder();
    	sql.append("insert into `").append(tablename).append("`(");
    	sql.append(StringHandle.StringListIntoString(StringHandle.StringListAdd(colsN, "`", "`"), ",")).append(")  values(");
    	for(int i=0;i<colsN.size();i++)
    	{
    		sql.append("?");
    		if(i!=colsN.size()-1)
    			sql.append(",");
    	}
    	sql.append(")");
    	List<String> valuesList=new ArrayList<>();
    	for(int i=0;i<colsN.size();i++) {
    		valuesList.add(obj.getString(colsN.get(i)));
    	}
    	return executeUpdate(sql.toString(),valuesList.toArray())>0;
    }
    public static boolean insertInfoValid(String tablename,JSONArray arr)
    {
    	if(arr.size()==0)
    		return false;
    	JSONObject objt=arr.getJSONObject(0);
    	List<String> colsN=get_colsname(tablename);
    	for(int i=colsN.size()-1;i>=0;i--) {
    		if(!objt.containsKey(colsN.get(i)))
    		{
    			colsN.remove(i);
    		}
    	}
    	StringBuilder sql=new StringBuilder();
    	sql.append("insert into `").append(tablename).append("`(");
    	sql.append(StringHandle.StringListIntoString(StringHandle.StringListAdd(colsN, "`", "`"), ",")).append(")  values");
    	String colsPlaceholder=StringHandle.createRepeatString("?", ",", "(", ")", colsN.size());
    	colsPlaceholder=StringHandle.createRepeatString(colsPlaceholder,",","","",arr.size());
    	sql.append(colsPlaceholder);
    	
    	List<String> valuesList=new ArrayList<>();
    	for(int j=0;j<arr.size();j++)
		{
			JSONObject obj=arr.getJSONObject(j);
	    	for(int i=0;i<colsN.size();i++) {
	    		valuesList.add(obj.getString(colsN.get(i)));
	    	}
		}
//    	System.out.println(StringHandle.SqlPutInfos(sql.toString(), valuesList.toArray()));
    	return executeUpdate(sql.toString(),valuesList.toArray())>0;
//    	return true;
    }
    //多次分步插入数据
    public static boolean insertInfoValidSplit(String tablename,JSONArray arr,int splitnum)
    {
    	boolean result=true;
    	if(arr.size()==0)
    		return false;
    	int maxlen=arr.size();
    	int nowstep=0;
    	int nextstep=Math.min(splitnum, maxlen);
    	while(nowstep<maxlen) {
    		JSONArray subarr=new JSONArray(arr.subList(nowstep, nextstep));
    		
    		result=(insertInfoValid(tablename,subarr)&&result);
    		nowstep=nextstep;
    		nextstep=Math.min(nextstep+splitnum, maxlen);
    	}

    	return result;
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
    
    public static boolean insertInfoUpdate(String tablename,JSONObject obj)
    {
    	List<String> colsN=new ArrayList<>(obj.keySet());
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
		List<String> valuesList=new ArrayList<>();
    	for(int i=0;i<colsN.size();i++) {
    		valuesList.add(obj.getString(colsN.get(i)));
    	}
//    	System.out.println(StringHandle.SqlPutInfos(sql.toString(), values));
    	return executeUpdate(sql.toString(),valuesList.toArray())>0;
    }
    
    public static boolean insertInfoUpdateValid(String tablename,JSONObject obj)
    {
    	List<String> colsN=get_colsname(tablename);
    	for(int i=colsN.size()-1;i>=0;i--) {
    		if(!obj.containsKey(colsN.get(i)))
    		{
    			colsN.remove(i);
    		}
    	}
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
		List<String> valuesList=new ArrayList<>();
		for(int i=0;i<colsN.size();i++) {
    		valuesList.add(obj.getString(colsN.get(i)));
    	}
//    	System.out.println(StringHandle.SqlPutInfos(sql.toString(), values));
    	return executeUpdate(sql.toString(),valuesList.toArray())>0;
    }
    //多次分步更新或插入数据
    public static boolean insertInfoUpdateValidSplit(String tablename,JSONArray arr,int splitnum)
    {
    	boolean result=true;
    	if(arr.size()==0)
    		return false;
    	int maxlen=arr.size();
    	int nowstep=0;
    	int nextstep=Math.min(splitnum, maxlen);
    	while(nowstep<maxlen) {
    		JSONArray subarr=new JSONArray(arr.subList(nowstep, nextstep));
    		
    		result=(insertInfoUpdateValid(tablename,subarr)&&result);
    		nowstep=nextstep;
    		nextstep=Math.min(nextstep+splitnum, maxlen);
    	}
    	
    	return result;
    	
    }
    
  
    public static boolean insertInfoUpdateValid(String tablename,JSONArray arr)
    {
    	if(arr.size()==0)
    		return false;
    	JSONObject objt=arr.getJSONObject(0);
    	List<String> colsN=get_colsname(tablename);
    	for(int i=colsN.size()-1;i>=0;i--) {
    		if(!objt.containsKey(colsN.get(i)))
    		{
    			colsN.remove(i);
    		}
    	}
    	StringBuilder sql=new StringBuilder();
    	sql.append("insert into `").append(tablename).append("`(");
    	sql.append(StringHandle.StringListIntoString(StringHandle.StringListAdd(colsN, "`", "`"), ",")).append(")  values");

    	String colsPlaceholder=StringHandle.createRepeatString("?", ",", "(", ")", colsN.size());
    	colsPlaceholder=StringHandle.createRepeatString(colsPlaceholder,",","","",arr.size());
    	sql.append(colsPlaceholder);
    	String upsql="";
		for(int i=0;i<colsN.size();i++)
		{
			if(i!=0)
				upsql+=",";
			String col=colsN.get(i);
			upsql+=" "+col+"=VALUES("+col+")";
		}
		sql.append(" ON DUPLICATE KEY UPDATE "+upsql);
		List<String> valuesList=new ArrayList<>();
		for(int j=0;j<arr.size();j++)
		{
			JSONObject obj=arr.getJSONObject(j);
			for(int i=0;i<colsN.size();i++) {
	    		valuesList.add(obj.getString(colsN.get(i)));
	    	}
		}
		
//    	System.out.println(StringHandle.SqlPutInfos(sql.toString(), valuesList.toArray()));
    	return executeUpdate(sql.toString(),valuesList.toArray())>0;
//		return true;
    }
    /**
     * 
     * @param database
     * @param table
     * @return 拥有COLUMN_NAME和COLUMN_COMMENT的jsonarray
     */
    public static JSONArray get_colscomment(String database,String table) {
    	return DBUtil.get_info_byjson("select column_name,column_comment from information_schema.columns where table_schema=? and table_name=?", database,table);
    }
    
    /**
     * @param colscomment  拥有COLUMN_NAME和COLUMN_COMMENT的jsonarray
     * @return able cols的列表
     */
    public static List<String> getCommentAbleCols(JSONArray colscomment) {
    	List<String> result=new ArrayList<>();
    	for(int i=0;i<colscomment.size();i++) {
    		JSONObject nowinfo=colscomment.getJSONObject(i);
    		
    		String commentstr=getCommentAnalysisInfo(nowinfo.getString("COLUMN_COMMENT")).replaceAll("\\s", "");
    		String comments[]=commentstr.split(",");
    		for(String comment:comments) {
	    		if(comment.startsWith("name:")) {
					result.add(nowinfo.getString("COLUMN_NAME"));
				}
    		}
    		
    	}
    	return result;
    }
    
    private static final String[] oneFormatter=new String[] {"hidden","readonly","disabled","textarea"};
    private static final String[] twiceFormatter=new String[] {"name","value"};
    private static final String[] mulFormatter=new String[] {};
    private static final String[] mulMapFormatter=new String[] {"select"};
    /**
     * @param colscomment  拥有COLUMN_NAME和COLUMN_COMMENT的jsonarray
     * @return able cols的属性包括 col,hidden,readonly,disabled的jsonobject {列名:{hidden:true,readonly:false,...},...}
     */
    public static JSONObject getCommentInfoColsNameMapper(JSONArray colscomment) {
    	JSONObject mapper=new JSONObject();
    	for(int i=0;i<colscomment.size();i++) {
    		JSONObject nowinfo=colscomment.getJSONObject(i);
    		String commentstr=getCommentAnalysisInfo(nowinfo.getString("COLUMN_COMMENT")).replaceAll("\\s", "");
    		String comments[]=commentstr.split(",");
    		List<String> commentslist=StringHandle.StringNlistToStringList(comments);
    		
    		
    		if(!commentstr.startsWith("name:")) {
    			continue;
    		}
    		JSONObject temp=new JSONObject();
    		for(String one:oneFormatter) {
    			if(commentslist.contains(one))
    				temp.put(one,true);
    			else temp.put(one,false);
    		}
    
    		for(String comment:comments) {
	    		
	//    		String name=comment.split("name:")[1].split(",")[0];
	    		
	    		
	    			
				for(String one:mulMapFormatter)
				{
					if(comment.startsWith(one+":")) {
						JSONObject selectinfo=null;
						selectinfo=new JSONObject();
						String sinfo=comment.split(one+":")[1];
						if(!sinfo.contains("/"))
						{
							Map<String,String> mapsinfo=StringHandle.analyseMapSentence(sinfo, ";", "=");
							selectinfo.putAll(mapsinfo);
							temp.put(one, selectinfo);
						}
						else {
							if(sinfo.contains("="))
							{
								String []spOne=sinfo.split("=");
								
								String colsone=spOne[0];
								String spcOne[]=colsone.split("/");
								String onetable=spcOne[0];
								String onecol=spcOne[1];
								
								String colstwo=spOne[1];
								String spcTwo[]=colstwo.split("/");
								String twotable=spcTwo[0];
								String twocol=spcTwo[1];
								
								String colsthree=spOne[2];
								String spcThree[]=colsthree.split("/");
								String onethreecol=spcThree[0];
								String twothreecol=spcThree[1];
								
								String sqlone=String.format("select distinct t1.%s,t2.%s from %s t1,%s t2 where t1.%s=t2.%s", onecol,twocol,onetable,twotable,onethreecol,twothreecol);
								JSONArray arr=DBUtil.get_info_byjson(sqlone);
								
								for(int j=0;j<arr.size();j++)
								{
									selectinfo.put(arr.getJSONObject(j).getString(onecol), arr.getJSONObject(j).getString(twocol));
								}
								temp.put(one, selectinfo);
							}
							else if(sinfo.contains("->")){
								String []spOne=sinfo.split("->");
								
								String colsone=spOne[0];
								String spcOne[]=colsone.split("/");
								String onetable=spcOne[0];
								String onecol=spcOne[1];
								Map<String,String> mapsinfo=StringHandle.analyseMapSentence(spOne[1], ";", "-");
								String sqlone=String.format("select distinct %s from %s", onecol,onetable);
								List<String> colsinfos=DBUtil.get_singal_list(sqlone);
								Map<String,String> resultmap=new HashMap<>();
								for(String two:colsinfos)
								{
									if(mapsinfo.containsKey(two))
										resultmap.put(mapsinfo.get(two),two);
								}
								selectinfo.putAll(resultmap);
								temp.put(one, selectinfo);
							}
							
						}
						
					}
				}
				for(String one:twiceFormatter)
				{
					if(comment.startsWith(one+":")) {
						
						String sinfo=comment.split(one+":")[1];
						temp.put(one, sinfo);
					}
				}
				for(String one:mulFormatter)
				{
					if(comment.startsWith(one+":")) {
						JSONArray arr=new JSONArray();
						String sinfo=comment.split(one+":")[1];
						StringHandle.analyseListSentence(sinfo, ";");
						temp.put(one, arr);
					}
				}
				
    		}
    		mapper.put(nowinfo.getString("COLUMN_NAME"),temp);
    	}
    	return mapper;
    }
    
    
    /**
     * @param colscomment  拥有COLUMN_NAME和COLUMN_COMMENT的jsonarray
     * @return able cols的列表列名隐射名称Map
     */
    public static Map<String,String> getCommentAbleColsNameMapper(JSONArray colscomment) {
    	Map<String,String> mapper=new HashMap<>();
    	for(int i=0;i<colscomment.size();i++) {
    		JSONObject nowinfo=colscomment.getJSONObject(i);
    		String commentstr=getCommentAnalysisInfo(nowinfo.getString("COLUMN_COMMENT")).replaceAll("\\s", "");
    		
    		
			if(commentstr.startsWith("name:")) {
				String name=commentstr.split("name:")[1].split(",")[0];
    			mapper.put(nowinfo.getString("COLUMN_NAME"),name);
			}
    		
    	}
    	return mapper;
    }
    /**
     * 获取注释中表达式 ${name:名称(,disabled)}中获取name:名称(,disabled)
     * @param args
     */
    public static String getCommentAnalysisInfo(String commentinfo) {
    	List<String> comments= StringHandle.getExpString("(?<=\\$\\{)(.*?)(?=\\})", commentinfo);
    	String comment="";
    	if(comments.size()!=0) {
    		comment=comments.get(0);
		}
    	return comment;
    }
    public static void main(String args[] ){
    	List<String> tables=DBUtil.get_singal_list("show tables");
    	
    	for(String table:tables) {
    		List<String> cols=DBUtil.get_colsname(table);
    		List<String> allresult=new ArrayList<>();
    		for(int j=0;j<cols.size();j++) {
    			for(int i=0;i<2;i++)
        			allresult.add(cols.get(j));
    		}
    		
    		String sql="update "+table+" set "+StringHandle.createRepeatString("`?`=replace(replace(`?`,'b.jzxnb.com','xt.jzxnb.com'),'xt.jzxnb.com','xcx.rryoujia.com')", ",", "", "", cols.size());
    		sql=StringHandle.SqlPutInfosWithoutQuote(sql, allresult.toArray());
    		System.out.println(sql);
    		DBUtil.executeUpdate(sql);
    	}
    	
    	
    	
    }
}

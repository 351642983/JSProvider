package com.hdq.tools;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;



public class EntityToString
{
	/**
	 * 
	 * @param src
	 * @return 深度拷贝
	 * @throws IOException
	 * @throws ClassNotFoundException
	 */
	public static <T> T deepCopy(T src) throws IOException, ClassNotFoundException {  
	    ByteArrayOutputStream byteOut = new ByteArrayOutputStream();  
	    ObjectOutputStream out = new ObjectOutputStream(byteOut);  
	    out.writeObject(src);  
	  
	    ByteArrayInputStream byteIn = new ByteArrayInputStream(byteOut.toByteArray());  
	    ObjectInputStream in = new ObjectInputStream(byteIn);  
	    @SuppressWarnings("unchecked")  
	    T dest = (T) in.readObject();  
	    return dest;  
	}
	/**
	 * @MethodName : getString
	 * @Description : 获取类中全部属性及属性值
	 * @param o
	 *            操作对象
	 * @param c
	 *            操作类。用于获取类中的方法
	 * @return
	 */
	public static String getStringToShow(Object o, Class< ? > c )
	{
		String result = c.getSimpleName( ) + ":";

		// 获取父类。推断是否为实体类
		if ( c.getSuperclass( ).getName( ).indexOf( "entity" ) >= 0 )
		{
			result +="\n<" +getStringToShow( o , c.getSuperclass( ) )+">,\n";
		}

		// 获取类中的全部定义字段
		Field[ ] fields = c.getDeclaredFields( );

		// 循环遍历字段，获取字段相应的属性值
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );

			try
			{
				// 设置字段可见，就可以用get方法获取属性值。

				result += field.getName( ) + "=" + field.get( o ) +",\n";
			}
			catch ( Exception e )
			{
				e.printStackTrace();
				// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
			}
		}
		if(result.indexOf( "," )>=0) result = result.substring( 0 , result.length( )-2 );
		return result;
	}

	public static String getString(Object o, Class< ? > c )
	{
		String result = new String();
		// 获取类中的全部定义字段
		Field[ ] fields = c.getDeclaredFields( );
		// 循环遍历字段，获取字段相应的属性值
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				// 设置字段可见，就可以用get方法获取属性值。
				result += field.get( o ) +" ";
			}
			catch ( Exception e )
			{
				// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
			}
		}
		if(result.length()>=1)
			result = result.substring( 0 , result.length( )-1 );
		return result;
	}
	
	//获取字符串2型
	public static String getString(Object o)
	{
		String result = new String();
		Class<?> c=o.getClass();
		// 获取类中的全部定义字段
		Field[ ] fields = c.getDeclaredFields( );
		// 循环遍历字段，获取字段相应的属性值
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				// 设置字段可见，就可以用get方法获取属性值。
				result += field.getName()+":"+field.get( o ) +" ";
			}
			catch ( Exception e )
			{
				e.printStackTrace();
				// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
			}
		}
		if(result.length()>=1)
			result = result.substring( 0 , result.length( )-1 );
		return result;
	}
	
	//获取字符串3形
	public static <T> List<String> getStringListSingle(T it)
	{
		List<String> result = new ArrayList<String>();
		Class<?> c=it.getClass();
		// 获取类中的全部定义字段
		Field[ ] fields = c.getDeclaredFields( );
		// 循环遍历字段，获取字段相应的属性值
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				// 设置字段可见，就可以用get方法获取属性值。
				result.add((String)field.get( it ));
			}
			catch ( Exception e )
			{
				e.printStackTrace();
				// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
			}
		}
		return result;
	}
	//获取字符串4形
	public static <T> Map<String,Object> getMapInfo(T it)
	{
		Map<String,Object> result = new HashMap<String,Object>();
		Class<?> c=it.getClass();
		// 获取类中的全部定义字段
		Field[ ] fields = c.getDeclaredFields( );
		// 循环遍历字段，获取字段相应的属性值
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				// 设置字段可见，就可以用get方法获取属性值。
				result.put(field.getName(),field.get( it ));
			}
			catch ( Exception e )
			{
				e.printStackTrace();
				// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
			}
		}
		
		return result;
	}
	public static <T> JSONObject getJSONObject(T it)
	{
		JSONObject result = new JSONObject();
		Class<?> c=it.getClass();
		// 获取类中的全部定义字段
		Field[ ] fields = c.getDeclaredFields( );
		// 循环遍历字段，获取字段相应的属性值
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				// 设置字段可见，就可以用get方法获取属性值。
				result.put(field.getName(),field.get( it ));
			}
			catch ( Exception e )
			{
				e.printStackTrace();
				// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
			}
		}
		
		return result;
	}
	
 
	//获取T容器系列字符串容器2型
	public static <T> List<String> getStringList(List<T> o)
	{
		List<String> results=new ArrayList<String>();
		// 获取类中的全部定义字段
		Class<?> c=o.get(0).getClass();
		Field[ ] fields = c.getDeclaredFields( );
		for(int i=0;i<o.size();i++)
		{
			String result = new String();
			
			// 循环遍历字段，获取字段相应的属性值
			for ( Field field : fields )
			{
				// 假设不为空。设置可见性，然后返回
				field.setAccessible( true );
				try
				{
					// 设置字段可见，就可以用get方法获取属性值。
					result += field.get( o.get(i) ) +" ";
				}
				catch ( Exception e )
				{
					e.printStackTrace();
					// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
				}
			}
			if(result.length()>=1)
				result = result.substring( 0 , result.length( )-1 );
			results.add(result);
		}
		return results;
	}
	
	
	
	//获得类容器中一系列容器的值的容器
	public static <T> List<String> getStringList(List<T> o,Class<?> c)
	{
		List<String> results=new ArrayList<String>();
		// 获取类中的全部定义字段

		Field[ ] fields = c.getDeclaredFields( );
		for(int i=0;i<o.size();i++)
		{
			String result = new String();
			
			// 循环遍历字段，获取字段相应的属性值
			for ( Field field : fields )
			{
				// 假设不为空。设置可见性，然后返回
				field.setAccessible( true );
				try
				{
					// 设置字段可见，就可以用get方法获取属性值。
					result += field.get( o.get(i) ) +" ";
				}
				catch ( Exception e )
				{
					e.printStackTrace();
					// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
				}
			}
			if(result.length()>=1)
				result = result.substring( 0 , result.length( )-1 );
			results.add(result);
		}
		return results;
	}

	//获得对应名称中变量的值
	public static <T> String getNameValue(T it,String name)
	{
		String result=new String();
		Class<?> c=it.getClass();
		// 获取类中的全部定义字段
		Field[ ] fields = c.getDeclaredFields( );
		// 循环遍历字段，获取字段相应的属性值
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				if(field.getName().equals(name))
					return (String)field.get( it );
			}
			catch ( Exception e )
			{
				e.printStackTrace();
				// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
			}
		}
		return result;
	}
	
	//获得对应名称中变量的值
	public static <T> List<String> getNameValues(List<T> it,String name)
	{
		List<String> result=new ArrayList<String>();
		if(it==null||it.size()==0)
			return null;
		Class<?> c=it.get(0).getClass();
		// 获取类中的全部定义字段
		Field[ ] fields = c.getDeclaredFields( );
		for(T init:it)
		{
			// 循环遍历字段，获取字段相应的属性值
			for ( Field field : fields )
			{
				// 假设不为空。设置可见性，然后返回
				field.setAccessible( true );
				try
				{
					if(field.getName().equals(name))
						result.add((String)field.get( init ));
				}
				catch ( Exception e )
				{
					e.printStackTrace();
					// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
				}
			}
		}
		return result;
	}
	
	//获得变量名在类中的位置
	public static <T> int getNameIndexof(Class<?> c,String name)
	{
		Field[ ] fields = c.getDeclaredFields( );
		// 循环遍历字段，获取字段相应的属性值
		for (int i=0;i<fields.length;i++)
		{
			// 假设不为空。设置可见性，然后返回
			fields[i].setAccessible( true );
			if(fields[i].getName().equals(name))
				return i;
		}
		return -1;
	}
	
	//获得所有变量的名称的容器
	public static <T> List<String> getNameList(Class<?> c)
	{
		Field[ ] fields = c.getDeclaredFields( );
		List<String> result=new ArrayList<String>();
		// 循环遍历字段，获取字段相应的属性值
		for (int i=0;i<fields.length;i++)
		{
			// 假设不为空。设置可见性，然后返回
			result.add(fields[i].getName());
		}
		return result;
	}
	
	
	
	//获得所有变量的个数
	public static <T> Integer getNameCount(Class<?> c)
	{
		Field[ ] fields = c.getDeclaredFields( );
		return fields.length;
	}
	
	
	//获得类名
	public static <T> String getClassName(Class<?> c)
	{
		return c.getName();
	}
	
	//将字符串设置为变量值
	@SuppressWarnings({ "unchecked" })
	public static <T> T setNameValue(String info,Class<?> in)
	{
		return (T) StringHandle.StringListToT(StringHandle.StringNlistToStringList(info.split(" ")), in);
	}

	//隐射设置字符串为变量,根据设置的变量顺序
	public static <T> T setNameValueCorrect(List<String> info,List<String> pointercols,Class<?> in)
	{
		List<Integer> correctid=StringHandle.StringListInStringListIndexof(pointercols, EntityToString.getNameList(in));
		List<String> correctcolsinfo=new ArrayList<>();
		for(int i:correctid)
		{
			correctcolsinfo.add(info.get(i));
		}
		if(correctcolsinfo.size()>0)
		{
			@SuppressWarnings("unchecked")
			T t=(T) StringHandle.StringListToT(correctcolsinfo, in);
			return t;
		}
		else return null;
		
	}
	//隐射设置字符串为变量,根据设置的名称，直接设置对应的对象数据，不返回实体
	public static <T> void setNameValue(T bean,String name,Object value)
	{
		Field[ ] fields = bean.getClass().getDeclaredFields( );
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				if(!field.getName().equals(name))
					continue;
				Field fs=getDeclaredField(bean, field.getName());
				
				if(fs==null){
					throw new IllegalArgumentException(new StringBuilder().append("Could not find field[").append(
							field.getName( )).append("] on target [").append(bean).append("]").toString());
				}
				makeAccessiable(fs);
				try{
					fs.set(bean, value);
				}
				catch(IllegalAccessException e){
					System.out.println("不可能抛出的异常");
				}
				// 设置字段可见，就可以用get方法获取属性值。
				//result += field.get( o ) +" ";
				
			}
			catch ( Exception e )
			{
				System.out.println(new StringBuilder().append("映射出现问题").append(e).toString());
				e.printStackTrace();
			}
		}
	}
	//隐射设置字符串为变量,根据设置的名称，直接设置对应的对象数据，不返回实体
	public static <T> void setNameValues(T bean,List<String> cols,List<Object> values)
	{
		Field[ ] fields = bean.getClass().getDeclaredFields( );
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				int i=cols.indexOf(field.getName());
				if(i==-1)
					continue;
				Field fs=getDeclaredField(bean, field.getName());
				
				if(fs==null){
					throw new IllegalArgumentException(new StringBuilder().append("Could not find field[").append(
							field.getName( )).append("] on target [").append(bean).append("]").toString());
				}
				makeAccessiable(fs);
				try{
					fs.set(bean, values.get(i));
				}
				catch(IllegalAccessException e){
					System.out.println("设置失败而抛出的异常");
				}
				// 设置字段可见，就可以用get方法获取属性值。
				//result += field.get( o ) +" ";
				
			}
			catch ( Exception e )
			{
				System.out.println(new StringBuilder().append("映射出现问题").append(e).toString());
				e.printStackTrace();
			}
		}
	}
	public static <T> void setNameValues(T bean,Map<String,Object> info)
	{
		Field[ ] fields = bean.getClass().getDeclaredFields( );
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				
				Object i=info.getOrDefault(field.getName(), null);
				if(i==null)
					continue;
				Field fs=getDeclaredField(bean, field.getName());
				
				if(fs==null){
					throw new IllegalArgumentException(new StringBuilder().append("Could not find field[").append(
							field.getName( )).append("] on target [").append(bean).append("]").toString());
				}
				makeAccessiable(fs);
				try{
					System.out.println("设置类"+bean.getClass().getName()+":"+field.getName( )+"="+info.get(field.getName( )));
					fs.set(bean, info.get(field.getName( )));
				}
				catch(IllegalAccessException e){
					System.out.println("设置失败而抛出的异常");
				}
				// 设置字段可见，就可以用get方法获取属性值。
				//result += field.get( o ) +" ";
				
			}
			catch ( Exception e )
			{
				System.out.println(new StringBuilder().append("映射出现问题").append(e).toString());
				e.printStackTrace();
			}
		}
	}
	public static <T> void setNameValues(T bean,JSONObject info)
	{
		Field[ ] fields = bean.getClass().getDeclaredFields( );
		for ( Field field : fields )
		{
			// 假设不为空。设置可见性，然后返回
			field.setAccessible( true );
			try
			{
				
				Object i=info.get(field.getName());
				if(i==null)
					continue;
				Field fs=getDeclaredField(bean, field.getName());
				
				if(fs==null){
					throw new IllegalArgumentException(new StringBuilder().append("Could not find field[").append(
							field.getName( )).append("] on target [").append(bean).append("]").toString());
				}
				makeAccessiable(fs);
				try{
					System.out.println("设置类"+bean.getClass().getName()+":"+field.getName( )+"="+info.get(field.getName( )));
					fs.set(bean, info.get(field.getName( )));
				}
				catch(IllegalAccessException e){
					System.out.println("设置失败而抛出的异常");
				}
				// 设置字段可见，就可以用get方法获取属性值。
				//result += field.get( o ) +" ";
				
			}
			catch ( Exception e )
			{
				System.out.println(new StringBuilder().append("映射出现问题").append(e).toString());
				e.printStackTrace();
			}
		}
	}
	//判断field的修饰符是否是public static,并据此改变field的访问权限 
	public static void makeAccessiable(Field field){
		if(!Modifier.isPublic(field.getModifiers())){
			field.setAccessible(true);
		}
	}
	
	//获取field属性，属性有可能在父类中继承 
	public static Field getDeclaredField(Object obj,String fieldName){
		for (Class<?> clazz=obj.getClass(); clazz!=Object.class; clazz=clazz.getSuperclass()){
			try{
				return clazz.getDeclaredField(fieldName);
			}
			catch(Exception e){
			}
		}
		return null;
	}
	
	//隐射设置字符串为变量,根据设置的变量顺序,列表(效率更高)
	public static <T> List<T> setNameValueListCorrect(List<List<String>> infos,List<String> fromcols,Class<?> in)
	{
		List<Integer> correctid=StringHandle.StringListInStringListIndexof(fromcols, EntityToString.getNameList(in));
		List<T> result=new ArrayList<>();
		for(List<String> info:infos)
		{
			List<String> correctcolsinfo=new ArrayList<>();
			for(int i:correctid)
			{
				correctcolsinfo.add(info.get(i));
			}
			if(correctcolsinfo.size()>0)
			{
				@SuppressWarnings("unchecked")
				T t=(T) StringHandle.StringListToT(correctcolsinfo, in);
				result.add(t);
			}
			else
			{
				result.add(null);
			}
		}
		return result;
	}
	
	//仅含有基础类型数据类深度拷贝
	public static <T> T deepCopyBaseClass(T t)
	{
		return EntityToString.setNameValueCorrect(EntityToString.getStringListSingle(t), EntityToString.getNameList(t.getClass()), t.getClass());
	}
	
	
	//执行类里面的方法 方法参数不能使用基本类型
	public static <T> Object executeTMethod(Class<?> classz,String methodname,Object ...args)
	{
		Class<?>[] classes = new Class<?>[args.length];
		for(int i=0;i<args.length;i++)
			classes[i]=args[i].getClass();
		try {
			Method method=classz.getMethod(methodname, classes);
			return method.invoke(classz.newInstance(), args);
		} catch (NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException | InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	//执行类里面的方法 方法参数不能使用基本类型
	public static <T> Object executeTMethod(T t,String methodname,Object ...args)
	{
		Class<?>[] classes = new Class<?>[args.length];
		for(int i=0;i<args.length;i++)
			classes[i]=args[i].getClass();
		try {
			Method method=t.getClass().getMethod(methodname, classes);
			return method.invoke(t, args);
		} catch (NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	//静态方法，可以用类名.静态方法直接调用 判断是否有此方法
	public static boolean hasMethod(Class<?> classType,String method,Class<?> ...params)  {
	
		//获取对象中的所有方法 当前类定义（不包括父类）
		Method[] methods = classType.getMethods();
		for (int i=0;i<methods.length;i++){
			//获取方法名字
			String methodName=methods[i].getName();
			if(!methodName.equals(method))
				continue;
//			System.out.println(methodName);
			//获取本方法所有参数类型，存入数组
			Class<?>[] parameterTypes = methods[i].getParameterTypes();
			if(parameterTypes.length!=params.length)
				continue;
			boolean g_has=true;
			for(int j=0;j<parameterTypes.length;j++){
//				String parameterName = parameterTypes[j].getName();
//				System.out.println("方法"+methodName+"的参数类型是"+parameterName);
				if(!parameterTypes[i].equals(params[i])) {
					g_has=false;
					break;
				}
			}
			if(g_has)
				return true;
		}
		return false;
	}
	//静态方法，可以用类名.静态方法直接调用 通过表达式判断是否有此方法
	public static boolean hasMethodByStr(Class<?> classType,String methodstr)  {
	
		String methodname=methodstr;
		String params=null;
		if(methodstr.contains("[")) {
			params=methodname.substring(methodstr.indexOf("[")+1,methodstr.length()-1);
			methodname=methodname.substring(0,methodstr.indexOf("["));
		}
		if(params!=null)
		{
			String []spparams=params.split("([^\\\\]\")?,");
			Class<?> []classes=new Class<?>[spparams.length];
			Object []args=new Object[spparams.length];
			for(int i=0;i<spparams.length;i++)
			{
				String kv[]=spparams[i].split(":", 2);
				if(kv[0].equals("int"))
				{
					classes[i]=Integer.class;
					args[i]=Integer.parseInt(kv[1]);
				}
				else if(kv[0].equals("String"))
				{
					classes[i]=String.class;
					if(!kv[1].startsWith("\"")||!kv[1].endsWith("\""))
					{
						try {
							throw new Exception(kv[0]+" format Info '"+kv[1]+"' is error.\r\n请在字符串的边界加上双引号");
							
						} catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
							return false;
						}
					}
					args[i]=kv[1].substring(1, kv[1].length()-1);
				}
				else
				{
					try {
						throw new Exception("Type "+kv[0]+" is unknow.\r\n");
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
			return hasMethod(classType,methodname,classes);
		}
		return hasMethod(classType,methodname);
	}
	//根据字符串 执行对应方法如 test[int:2,String:"dfs"] 或 test
	public static Object executeTMethodByStr(Class<?> classz,String methodstr)
	{
		String methodname=methodstr;
		String params=null;
		if(methodstr.contains("[")) {
			params=methodname.substring(methodstr.indexOf("[")+1,methodstr.length()-1);
			methodname=methodname.substring(0,methodstr.indexOf("["));
		}
		if(params!=null)
		{
			String []spparams=params.split("([^\\\\]\")?,");
			Class<?> []classes=new Class<?>[spparams.length];
			Object []args=new Object[spparams.length];
			for(int i=0;i<spparams.length;i++)
			{
				String kv[]=spparams[i].split(":", 2);
				if(kv[0].equals("int"))
				{
					classes[i]=Integer.class;
					args[i]=Integer.parseInt(kv[1]);
				}
				else if(kv[0].equals("String"))
				{
					classes[i]=String.class;
					if(!kv[1].startsWith("\"")||!kv[1].endsWith("\""))
					{
						try {
							throw new Exception(kv[0]+" format Info '"+kv[1]+"' is error.\r\n请在字符串的边界加上双引号");
							
						} catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
							return null;
						}
					}
					args[i]=kv[1].substring(1, kv[1].length()-1);
				}
				else
				{
					try {
						throw new Exception("Type "+kv[0]+" is unknow.\r\n");
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
			return executeTMethod(classz,methodname,args);
		}
		return executeTMethod(classz,methodname);
			
	}
	
	/**
	 * 单选多值筛选器
	 * @param infos 搜索容器
	 * @param colsname 搜索变量名
	 * @param cmp_value 搜索值
	 * @param searchmode  0全匹配  1左匹配 2右匹配 3包含匹配
	 * @return
	 */
	public static <T> List<T> selectFromTlist(List<T> infos,String colsname,String cmp_value,int searchmode)
	{
		List<T> result=new ArrayList<>();
		for(int i=0;i<infos.size();i++)
		{
			String value=getNameValue(infos.get(i),colsname);
			if(searchmode==0){
				if(value.equals(cmp_value))
				{
					result.add(infos.get(i));
				}
			}
			else if(searchmode==1)
			{
				if(value.startsWith(cmp_value))
				{
					result.add(infos.get(i));
				}
			}
			else if(searchmode==2)
			{
				if(value.endsWith(cmp_value))
				{
					result.add(infos.get(i));
				}
			}
			else if(searchmode==3)
			{
				if(value.contains(cmp_value))
				{
					result.add(infos.get(i));
				}
			}
			else if(searchmode==4)
			{
				if(StringHandle.StringIsSuitExep(value, cmp_value))
				{
					result.add(infos.get(i));
				}
			}
		}
		return result;
	}
	/**
	 * 多选多值筛选器
	 * @param infos 搜索容器
	 * @param colsname 搜索变量名 分号为间隔，具有顺序
	 * @param cmp_values 搜索值对应列表 
	 * @param searchmodes  0全匹配  1左匹配 2右匹配 3包含匹配 分号为间隔，具有顺序
	 * @return
	 */
	public static <T> List<T> selectMoreFromTlist(List<T> infos,String colsnames,String searchmodes,String ...cmp_values)
	{
		List<T> result=new ArrayList<>();
		String colsnameN[]=colsnames.split(";");
		Integer []searchmode=new Integer[colsnameN.length];
		if(searchmodes.equals("-1"))
		{
			Arrays.fill(searchmode, 0);
		}
		else {
			String []spmode=searchmodes.split(";");
			for(int i=0;i<spmode.length;i++)
			{
				searchmode[i]=Integer.parseInt(spmode[i]);
			}
		}
		for(int i=0;i<infos.size();i++)
		{
			boolean g_throgh=true;
			for(int j=0;j<colsnameN.length;j++)
			{
				String value=getNameValue(infos.get(i),colsnameN[j]);
				if(searchmode[j]==0){
					if(!value.equals(cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
				else if(searchmode[j]==1)
				{
					if(!value.startsWith(cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
				else if(searchmode[j]==2)
				{
					if(!value.endsWith(cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
				else if(searchmode[j]==3)
				{
					if(!value.contains(cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
				else if(searchmode[j]==4)
				{
					if(!StringHandle.StringIsSuitExep(value, cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
				
			}
			if(g_throgh)
				result.add(infos.get(i));
		}
		return result;
	}
	/**
	 * 单选单值筛选器
	 * @param infos 搜索容器
	 * @param colsname 搜索变量名
	 * @param cmp_value 搜索值
	 * @param searchmode  0全匹配  1左匹配 2右匹配 3包含匹配
	 * @return
	 */
	public static <T> T selectOneFromTlist(List<T> infos,String colsname,String cmp_value,int searchmode)
	{
		for(int i=0;i<infos.size();i++)
		{
			String value=getNameValue(infos.get(i),colsname);
			if(searchmode==0){
				if(value.equals(cmp_value))
				{
					return infos.get(i);
				}
			}
			else if(searchmode==1)
			{
				if(value.startsWith(cmp_value))
				{
					return infos.get(i);
				}
			}
			else if(searchmode==2)
			{
				if(value.endsWith(cmp_value))
				{
					return infos.get(i);
				}
			}
			else if(searchmode==3)
			{
				if(value.contains(cmp_value))
				{
					return infos.get(i);
				}
			}
			else if(searchmode==4)
			{
				if(StringHandle.StringIsSuitExep(value, cmp_value))
				{
					return infos.get(i);
				}
			}
			
		}
		return null;
	}
	/**
	 * 多选单值筛选器
	 * @param infos 搜索容器
	 * @param colsname 搜索变量名 分号为间隔，具有顺序
	 * @param cmp_values 搜索值对应列表 
	 * @param searchmodes  0全匹配  1左匹配 2右匹配 3包含匹配 4正则匹配 分号为间隔，具有顺序
	 * @return
	 */
	public static <T> T selectOneMoreFromTlist(List<T> infos,String colsnames,String searchmodes,String ...cmp_values)
	{
		String colsnameN[]=colsnames.split(";");
		Integer []searchmode=new Integer[colsnameN.length];
		if(searchmodes.equals("-1"))
		{
			Arrays.fill(searchmode, 0);
		}
		else {
			String []spmode=searchmodes.split(";");
			for(int i=0;i<spmode.length;i++)
			{
				searchmode[i]=Integer.parseInt(spmode[i]);
			}
		}
		for(int i=0;i<infos.size();i++)
		{
			boolean g_throgh=true;
			for(int j=0;j<colsnameN.length;j++)
			{
				String value=getNameValue(infos.get(i),colsnameN[j]);
				if(searchmode[j]==0){
					if(!value.equals(cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
				else if(searchmode[j]==1)
				{
					if(!value.startsWith(cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
				else if(searchmode[j]==2)
				{
					if(!value.endsWith(cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
				else if(searchmode[j]==3)
				{
					if(!value.contains(cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
				else if(searchmode[j]==4)
				{
					if(!StringHandle.StringIsSuitExep(value, cmp_values[j]))
					{
						g_throgh=false;
						break;
					}
				}
			}
			if(g_throgh)
				return infos.get(i);
		}
		return null;
	}
}






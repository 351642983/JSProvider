package com.hdq.tools;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ListTools {

	public static <T> List<T> deepCopy(List<T> src) throws IOException, ClassNotFoundException {  
	    ByteArrayOutputStream byteOut = new ByteArrayOutputStream();  
	    ObjectOutputStream out = new ObjectOutputStream(byteOut);  
	    out.writeObject(src);  
	  
	    ByteArrayInputStream byteIn = new ByteArrayInputStream(byteOut.toByteArray());  
	    ObjectInputStream in = new ObjectInputStream(byteIn);  
	    @SuppressWarnings("unchecked")  
	    List<T> dest = (List<T>) in.readObject();  
	    return dest;  
	}
	//subList：不改变原数组，但是改变其中值会改变原数组。end值(subList)是开区间
	//把一维数组当做循环数组，除去指定部分从以尾开始到头（保留from和end元素）
	/*
	 * 	type值
	 * 	1：不删除末尾元素
	 * 	2或其他：删除末尾元素
	 * 
	 */
	public static <T> List<T> reList(List<T> objList,int from,int end,int type)
	{
		if(from<0||from>end||end>objList.size()-1)
			return null;
		List<T> objListResult=new ArrayList<T>();
		List<T> objListTemp=new ArrayList<T>(objList);
		List<T> objListTemp_1=new ArrayList<T>(objList);
		if(objList.size()==1)
			return objListTemp;
		if(type!=1)
			objListTemp.remove(objListTemp.size()-1);
		objListResult.addAll(objListTemp.subList(end, objListTemp.size()));
		objListResult.addAll(objListTemp_1.subList(0, from+1));
		return objListResult;
	}

	//删除数组中的重复元素
	public static <T> void minList(List<T> objList)
	{
		Iterator<T> it = objList.iterator();
		Map<T,Integer> a=new HashMap<T,Integer>();
		while(it.hasNext())
		{
			T x = it.next();
			if(a.get(x)==null)
			{
				a.put(x, 1);
			}
			else
			{
				it.remove();
			}
		}
	}
	//获得List中第n个x元素的位置,如果没有第n个x元素的位置则返回-1
	public static <T> int getListIndexBy(List<T> objList,T x,int n)
	{
		if(!objList.contains(x))
			return -1;
		Map<T,Integer> map=new HashMap<T,Integer>();
		int num=objList.size();
		for(int i=0;i<num;i++)
		{
			if(objList.get(i).equals(x))
			{
				if(map.get(x)==null)
					map.put(x, 1);
				else
				{
					map.put(x, map.get(x)+1);
				}
				if(map.get(x)==n)
					return i;
			}
		}
		return -1;
	}



	//根据双数组容器统计出对应的整型容器的大小
	public static <T> List<Integer> getListListSize(List<List<T>> objlistlist)
	{
		List<Integer> listsize=new ArrayList<Integer>();
		for(int i=0;i<objlistlist.size();i++)
		{
			listsize.add(objlistlist.get(i).size());
		}
		return listsize;
	}

	//根据数组对前数组进行排序
	public static <T> List<T> sortFromList(List<T> infolist,List<Integer> varray,boolean isMaxToMin)
	{
		List<T> list=new ArrayList<T>(infolist);
		int temp;
		T tTemp;
		List<Integer> array=new ArrayList<Integer>(varray);
		int size =array.size();
		for(int i=1; i<size; i++) {
			for(int j=0; j<size-i; j++) {
				int jarray=array.get(j);
				int j1array=array.get(j+1);
				T jlist=list.get(j);
				T j1list=list.get(j+1);
				if(isMaxToMin)
				{
					if(jarray < j1array) {
						temp = array.get (j);
						array.set(j, j1array) ;
						array.set(j+1,temp);		
						tTemp=jlist;
						list.set(j,j1list);
						list.set(j+1,tTemp);
					}
				}
				else
				{
					if(jarray > j1array) {
						temp = jarray;
						array.set(j, j1array) ;
						array.set(j+1,temp);
						tTemp=jlist;
						list.set(j, j1list);
						list.set(j+1, tTemp);

					}

				}
			}
		}
		return list;
	}

	//将T数组转换为T容器
	public static <T> List<T> TNlistToTList(T []tlist)
	{
		List<T> list = java.util.Arrays.asList(tlist);
		return list;
	}


	//将Object容器转换为String容器
	@SuppressWarnings("unchecked")
	public static <T> List<T> ObjectListToTList(List<Object> objList,T it)
	{
		List<T> tList=new ArrayList<T>();
		for(int i=0;i<objList.size();i++)
		{
			tList.add((T)objList.get(i));
		}
		return tList;
	}

	//获得Map中的值的最大或最小的n个位置
	public static List<Integer> getMtoM(List<Integer> listinteger,int count,boolean isMaxToMin)
	{
		List<Integer> numlist=new ArrayList<Integer>();
		List<Integer> clist=new ArrayList<Integer>();
		int g_size=listinteger.size();
		if(g_size==0||count==0)
			return numlist;
		if(count<0)
			count=g_size;
		if(isMaxToMin)
		{
			for(int j=0;j<count;j++)
			{
				Integer point=null;
				int g_m=Integer.MIN_VALUE;
				for(int i=0;i<g_size;i++)
				{
					if(clist.contains(i))
						continue;
					int number=listinteger.get(i);
					if(number>g_m)
					{
						point=i;
						g_m=number;
					}
				}
				clist.add(point);
				numlist.add(g_m);

			}
		}
		else
		{
			for(int j=0;j<count;j++)
			{
				Integer point=null;
				int g_m=Integer.MAX_VALUE;
				for(int i=0;i<g_size;i++)
				{
					if(clist.contains(i))
						continue;
					int number=listinteger.get(i);
					if(number<g_m)
					{
						point=i;
						g_m=number;
					}
				}
				clist.add(point);
				numlist.add(g_m);

			}
		}
		return clist;
	}

	//获得Map中的值的最大或最小的n个位置
	public static List<Integer> getDMtoM(List<Double> listinteger,int count,boolean isMaxToMin)
	{
		List<Double> numlist=new ArrayList<Double>();
		List<Integer> clist=new ArrayList<Integer>();
		int g_size=listinteger.size();
		if(g_size==0||count==0)
			return clist;
		if(count<0)
			count=g_size;
		if(isMaxToMin)
		{
			for(int j=0;j<count;j++)
			{
				Integer point=null;
				Double g_m=Double.MIN_VALUE;
				for(int i=0;i<g_size;i++)
				{
					if(clist.contains(i))
						continue;
					Double number=listinteger.get(i);
					if(number>g_m)
					{
						point=i;
						g_m=number;

					}
				}
				clist.add(point);
				numlist.add(g_m);

			}
		}
		else
		{
			for(int j=0;j<count;j++)
			{
				Integer point=null;
				Double g_m=Double.MAX_VALUE;
				for(int i=0;i<g_size;i++)
				{
					if(clist.contains(i))
						continue;
					Double number=listinteger.get(i);
					if(number<g_m)
					{
						point=i;
						g_m=number;
					}
				}
				clist.add(point);
				numlist.add(g_m);

			}
		}
		return clist;
	}
	//获得Map中的值的最大或最小的n个位置
	public static List<Integer> getFMtoM(List<Float> listinteger,int count,boolean isMaxToMin)
	{
		List<Float> numlist=new ArrayList<Float>();
		List<Integer> clist=new ArrayList<Integer>();
		int g_size=listinteger.size();
		if(g_size==0||count==0)
			return clist;
		if(count<0)
			count=g_size;
		if(isMaxToMin)
		{
			for(int j=0;j<count;j++)
			{
				Integer point=null;
				Float g_m=Float.MIN_VALUE;
				for(int i=0;i<g_size;i++)
				{
					if(clist.contains(i))
						continue;
					Float number=listinteger.get(i);
					if(number>g_m)
					{
						point=i;
						g_m=number;

					}
				}
				clist.add(point);
				numlist.add(g_m);

			}
		}
		else
		{
			for(int j=0;j<count;j++)
			{
				Integer point=null;
				Float g_m=Float.MAX_VALUE;
				for(int i=0;i<g_size;i++)
				{
					if(clist.contains(i))
						continue;
					Float number=listinteger.get(i);
					if(number<g_m)
					{
						point=i;
						g_m=number;
					}
				}
				clist.add(point);
				numlist.add(g_m);

			}
		}
		return clist;
	}
	//获得Map中的值的最大或最小的n个位置
	public static List<Integer> getLMtoM(List<Long> listinteger,int count,boolean isMaxToMin)
	{
		List<Long> numlist=new ArrayList<Long>();
		List<Integer> clist=new ArrayList<Integer>();
		int g_size=listinteger.size();
		if(g_size==0||count==0)
			return clist;
		if(count<0)
			count=g_size;
		if(isMaxToMin)
		{
			for(int j=0;j<count;j++)
			{
				Integer point=null;
				Long g_m=Long.MIN_VALUE;
				for(int i=0;i<g_size;i++)
				{
					if(clist.contains(i))
						continue;
					Long number=listinteger.get(i);
					if(number>g_m)
					{
						point=i;
						g_m=number;

					}
				}
				clist.add(point);
				numlist.add(g_m);

			}
		}
		else
		{
			for(int j=0;j<count;j++)
			{
				Integer point=null;
				Long g_m=Long.MAX_VALUE;
				for(int i=0;i<g_size;i++)
				{
					if(clist.contains(i))
						continue;
					Long number=listinteger.get(i);
					if(number<g_m)
					{
						point=i;
						g_m=number;
					}
				}
				clist.add(point);
				numlist.add(g_m);

			}
		}
		return clist;
	}

	//获得Map中的键值List
	public static <T,R> List<T> getMapTList(Map<T,R> maplist)
	{
		List<T> tList=new ArrayList<T>();
		Set<T> s = maplist.keySet();//获取KEY集合
		for (T t : s) 
		{
			tList.add(t);
		}
		return tList;
	}

	//获得Map中的值List
	public static <T,R> List<R> getMapValueList(Map<T,R> maplist)
	{
		List<R> numList=new ArrayList<R>();
		Set<T> s = maplist.keySet();//获取KEY集合
		for (T str : s) 
		{
			numList.add(maplist.get(str));
		}
		return numList;
	}

}

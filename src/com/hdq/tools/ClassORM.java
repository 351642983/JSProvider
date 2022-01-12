package com.hdq.tools;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ClassORM<T> {
	List<T> roots;
	List<T> changes;
	Set<Integer> changer;
	Set<Integer> deleter;
	List<T> adder;
	String table;
	public ClassORM(List<T> infos,String table) {
		roots=new ArrayList<>(infos);
		changes=new ArrayList<>();
		for(int i=0;i<roots.size();i++)
			changes.add(EntityToString.deepCopyBaseClass(roots.get(i)));
		
		changer=new HashSet<>();
		deleter=new HashSet<>();
		adder=new ArrayList<>();
		this.table=table;
	}
	public T get(Integer index)
	{
		if(roots.size()<=index)
			return null;
		changer.add(index);
		return changes.get(index);
	}
	public synchronized void delete(Integer index)
	{
		if(roots.size()<=index)
			return;
		deleter.add(index);
	}
	public synchronized void delete(T obj)
	{
		Integer index=changes.indexOf(obj);
		if(index==-1)
			return;
		deleter.add(index);
	}
	public void delete(List<T> objs)
	{
		for(T init:objs)
			delete(init);
	}
	public List<T> searchMany(String colsnames,String searchmodes,String ...cmp_values)
	{
		List<T> ts=EntityToString.selectMoreFromTlist(changes, colsnames, searchmodes, cmp_values);
		for(T ints:ts)
			changer.add(changes.indexOf(ints));
		return ts;
	}
	public List<T> searchMany(List<T> infos,String colsnames,String searchmodes,String ...cmp_values)
	{
		List<T> ts=EntityToString.selectMoreFromTlist(infos, colsnames, searchmodes, cmp_values);
		for(T ints:ts)
			changer.add(changes.indexOf(ints));
		return ts;
	}
	public T searchOne(String colsnames,String searchmodes,String ...cmp_values)
	{
		T t=EntityToString.selectOneMoreFromTlist(changes, colsnames, searchmodes, cmp_values);
		changer.add(changes.indexOf(t));
		return t;
	}
	public T searchOne(List<T> infos,String colsnames,String searchmodes,String ...cmp_values)
	{
		T t=EntityToString.selectOneMoreFromTlist(infos, colsnames, searchmodes, cmp_values);
		changer.add(changes.indexOf(t));
		return t;
	}
	public void add(T obj)
	{
		adder.add(obj);
	}
	public void add(List<T> objs)
	{
		adder.addAll(objs);
	}
	public synchronized void commit()
	{
		
		for(Integer init:changer)
		{
			if(init==-1)
				continue;
			if(DBUtil.updateEntity(table, roots.get(init), changes.get(init)))
			{
				roots.set(init, EntityToString.deepCopyBaseClass(changes.get(init)));
			}
		}
		for(Integer init:deleter)
		{
			
			if(init==-1)
				continue;
			if(DBUtil.deleteEntity(table, changes.get(init)))
			{
				roots.remove(init);
				changes.remove(init);
			}
		}
		for(T init:adder)
		{
			if(DBUtil.addEntityInfo(init, table, true))
			{
				roots.add(init);
				changes.add(EntityToString.deepCopyBaseClass(init));
			}
		}
		
		changer.clear();
		deleter.clear();
		adder.clear();
	}
	public synchronized void backroll()
	{
		changer.clear();
		deleter.clear();
		adder.clear();
		changes.clear();
		
		for(int i=0;i<roots.size();i++)
			changes.add(EntityToString.deepCopyBaseClass(roots.get(i)));
	}
}

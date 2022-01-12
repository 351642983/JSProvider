package com.hdq.tools;

import java.util.List;

/**
 * 协议适配框架 子功能  数据库制造工具
 * @author 洪鼎淇  
 *
 */

public class DBMaker {


	
	/**
	 * 方法：创建简易表 
	 * 
	 * @Param tbname
	 * 表名
	 * 
	 * @Param key
	 * 定义主键
	 * 
	 * @Param cols
	 * 设备定义表的额外需定义的列
	 * 
	 */
	public static boolean create_simpletable(String tbname,String key,String ...cols)
	{
		//将列数组转化为列表
		List<String> colslist=StringHandle.StringNlistToStringList(cols);
//		//若主键不包含在列中 -这里需要抛出异常,键值错误
//		if(!StringHandle.StringListIsExContainString(colslist, key))
//			return;
		
		StringBuilder sqlsb=new StringBuilder();
		sqlsb.append("CREATE TABLE IF NOT EXISTS `"+tbname+"` ");
		//构建列的信息创建语句
		List<String> colsCreateInfos=StringHandle.StringListAdd(colslist, "`", "` varchar(255) NOT NULL");
		sqlsb.append("(").append(StringHandle.StringListIntoString(colsCreateInfos, ",")).append(",");
		sqlsb.append("PRIMARY KEY ("+key+"))");
		sqlsb.append("ENGINE=InnoDB DEFAULT CHARSET=utf8;");
		if(sqlsb.toString().equals("null"))
			System.out.println(sqlsb);
		return DBUtil.executeUpdate(sqlsb.toString())>=0;
	}
	/**
	 * 方法：添加表外键约束
	 * 
	 */
	public static boolean add_foreign(String tbname,String tablecol,String foreignkey,String foreigntable,String constraintName)
	{
//		if(!DBUtil.isExistTable(tbname))
//			return;
//		if(!DBUtil.isExistTable(foreigntable))
//			return;
		return DBUtil.executeUpdate("alter table `"+tbname+"` add constraint "+constraintName+" foreign key("+tablecol+") references "+foreigntable+"("+foreignkey+") on delete CASCADE  on update CASCADE ;")>=0;
	}
	
	/**
	 * 添加一列 example:alter table pre_csdn123zd_rule add column start_url varchar(255) DEFAULT NULL after rule_remark;
	 * @param tbname
	 * @param tablecol
	 * @param coldesc
	 */
	public static boolean add_col(String tbname,String tablecol,String coldesc)
	{
		return DBUtil.executeUpdate("alter table `"+tbname+"` add column `"+tablecol+"` "+coldesc)>=0;
	}

	/**
	 * 删除一列
	 */
	public static boolean delete_col(String tbname,String tablecol)
	{
		return DBUtil.executeUpdate("alter table `"+tbname+"` drop column `"+tablecol+"`")>=0;
	}
	
	
	/**
	 * 删除表
	 * @param tbname
	 */
	public static boolean delete_table(String tbname) {
		return DBUtil.executeUpdate("drop table if exists `"+tbname+"`")>=0;
		
	}
	
	/**
	 * 修改列属性 example:alter table class change caption caption varchar(255) not null;（自增auto_increment）
	 * @param tbname
	 * 表名
	 * @paraDm col
	 * 需要修改的列
	 * @param changecolinfo
	 * 修改后列的信息
	 */
	public static boolean change_col(String tbname,String col,String changecolinfo)
	{
		
		return DBUtil.executeUpdate("alter table `"+tbname+"` change `"+col+"` "+changecolinfo)>=0;
	}

	/**
	 * 修改对应的表名为另外的表名
	 * @param oldtbname
	 * 老的表名
	 * @param changename
	 * 修改之后的表名是什么
	 */
	public static boolean rename_table(String oldtbname,String changename)
	{
		if(!DBUtil.isExistTable(changename))
		{
			return DBUtil.executeUpdate("rename table `"+oldtbname+"` to `"+changename+"`")>=0;
		}
		else return false;
	}
	
	//根据类名反射自动创建表格
	public static <T> boolean create_Tsimpletable(Class<T> c,String tbname,String key)
	{
		return create_simpletable(tbname,key,StringHandle.ObjectListToStringNlist(EntityToString.getNameList(c).toArray()));
	}
	
	
	//加表注释
	public static boolean comment_table(String table,String comment)
	{
		return DBUtil.executeUpdate("alter table "+table+" comment ?",comment)>=0;
	}
	

// 表级约束实际例子
//	alter table 表名 add constraint 自定义主键名 primary key `表名`(`添加主键的字段`);
//	alter table `Grade` add constraint `primary_key_GradeId` primary key `Grade`(`GradeId`);
	//primary key（主键），unique index（唯一），index索引

}

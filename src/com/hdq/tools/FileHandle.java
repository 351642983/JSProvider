package com.hdq.tools;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import com.alibaba.fastjson.JSONObject;


public  class FileHandle {
	//获取类路径前地址
	public static String getPreClassPath()
	{
		String path=FileHandle.getClassesDirPath(FileHandle.class);
    	String spath[]=path.split("/");
    	String outdir="/"+StringHandle.StringListIntoString(
    			StringHandle.StringNlistToStringList(Arrays.copyOfRange(spath, 1, spath.length-1))
    			, "/");
    	return outdir;
	}
	//将Properties转化为Map
	public static Map<String,String> changePropertiesToMap(Properties pro)
	{
		Map<String,String> obj=new HashMap<>();
		for (Entry<Object, Object> entry : pro.entrySet()) {
			obj.put((String) entry.getKey(), (String) entry.getValue());
		}
		return obj;
	}
	//获得Properties的属性
	public static JSONObject getProperties(String path)
	{
		Properties pro=FileHandle.getPropertiesByPath(path);
		JSONObject obj=new JSONObject();
		for (Entry<Object, Object> entry : pro.entrySet()) {
			obj.put((String) entry.getKey(), entry.getValue());
		}
		return obj;
	}
	//获得class类的上一级目录
	public static String getClassPrePath()
	{
		String path=FileHandle.getClassesDirPath(FileHandle.class);
		String spath[]=path.split("/");
		String outdir=StringHandle.StringListIntoString(
				StringHandle.StringNlistToStringList(Arrays.copyOfRange(spath, 1, spath.length-1))
				, "/");
		return "/"+outdir;
	}
	//是否以追加的形式导出文件
	public static void outFile(String txt,String outfile,boolean isappend)
	{
		File fi=new File(outfile);
		FileOutputStream fop;
		try {

			fop = new FileOutputStream(fi,isappend);
			OutputStreamWriter ops=new OutputStreamWriter(fop,"UTF-8");

			ops.append(txt);
			ops.close();
			fop.close();
		} catch (IOException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}

	}
	//获得文件路径中对应子文件夹对应的位置
	public static String getRelationWhereDirPath(String path,String subdir) {
		if (path != null && path.lastIndexOf(subdir) != -1) {
			path = path.substring(0, path.lastIndexOf(subdir));
		}
		return path;
	}

	//判断文件为空
	public static boolean judgeFileEmpty(String path)
	{
		File file = new File(path);
		if(file.exists() && file.length() == 0) {
			return true;
		}
		return false;
	}
	//判断文件是否存在
	public static boolean judgeFileExists(String path) {

		File file=new File(path);
		if (file.exists()) {
			return true;
		} else {
			return false;
		}

	}

	//导入文件时判断文件存在
	public static boolean judeFileExistsNoDepend(File file) {

		if (file.exists()) {
			return true;
		} else {
			return false;
		}

	}

	//读取文件每一行的数据并且放在字符串容器中
	public static List<String> inputFile(String path)
	{

		List<String> strlist=new ArrayList<String>();
		File a=new File(path);
		if(!judeFileExistsNoDepend(a))
		{
			System.out.println(path+"文件不存在");
			System.out.println(getFileList("./"));
			return strlist;
		}
		FileInputStream b;
		try {
			b = new FileInputStream(a);
			InputStreamReader c=new InputStreamReader(b,"UTF-8");


			{
				BufferedReader bufr =new BufferedReader(c);
				String line = null;
				while((line = bufr.readLine())!=null){
					//line是每一行的数据
					strlist.add(line);
				}
				bufr.close();
			}
			c.close();
			b.close();
		} catch ( IOException e) {
			// TODO 自动生成的 catch 块

			e.printStackTrace();
		}

		return strlist;
	}

	//读取文件每一行的数据并且放在字符串容器中
	public static List<String> inputFileByStream(InputStream stream)
	{

		List<String> strlist=new ArrayList<String>();
		try {

			InputStreamReader c=new InputStreamReader(stream,"UTF-8");

			BufferedReader bufr =new BufferedReader(c);
			String line = null;
			while((line = bufr.readLine())!=null){
				//line是每一行的数据
				strlist.add(line);
			}
			bufr.close();
			c.close();

		} catch ( IOException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
		return strlist;
	}

	//读取Properties
	public static Properties getPropertiesByStream(InputStream stream)
	{

		Properties props = new Properties();
		try {
			props.load(stream);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return props;
	}

	//读取Properties String value=props.getProperty("user");
	public static Properties getPropertiesByPath(String position)
	{
		Properties props = new Properties();
		InputStream in;
		try {
			in = new BufferedInputStream(new FileInputStream(position));
			props.load(in);
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		return props;
	}



	/**
	 * 删除文件，可以是文件或文件夹
	 *
	 * @param fileName
	 *            要删除的文件名
	 * @return 删除成功返回true，否则返回false
	 */
	public static boolean delete(String fileName) {
		File file = new File(fileName);
		if (!file.exists()) {
			System.out.println("删除文件失败:" + fileName + "不存在！");
			return false;
		} else {
			if (file.isFile())
				return deleteFile(fileName);
			else
				return deleteDirectory(fileName);
		}
	}

	/**
	 * 删除单个文件
	 *
	 * @param fileName
	 *            要删除的文件的文件名
	 * @return 单个文件删除成功返回true，否则返回false
	 */
	public static boolean deleteFile(String fileName) {
		File file = new File(fileName);
		// 如果文件路径所对应的文件存在，并且是一个文件，则直接删除
		if (file.exists() && file.isFile()) {
			if (file.delete()) {
				System.out.println("删除单个文件" + fileName + "成功！");
				return true;
			} else {
				System.out.println("删除单个文件" + fileName + "失败！");
				return false;
			}
		} else {
			System.out.println("删除单个文件失败：" + fileName + "不存在！");
			return false;
		}
	}

	/**
	 * 删除目录及目录下的文件
	 *
	 * @param dir
	 *            要删除的目录的文件路径
	 * @return 目录删除成功返回true，否则返回false
	 */
	public static boolean deleteDirectory(String dir) {
		// 如果dir不以文件分隔符结尾，自动添加文件分隔符
		if (!dir.endsWith(File.separator))
			dir = dir + File.separator;
		File dirFile = new File(dir);
		// 如果dir对应的文件不存在，或者不是一个目录，则退出
		if ((!dirFile.exists()) || (!dirFile.isDirectory())) {
			System.out.println("删除目录失败：" + dir + "不存在！");
			return false;
		}
		boolean flag = true;
		// 删除文件夹中的所有文件包括子目录
		File[] files = dirFile.listFiles();
		for (int i = 0; i < files.length; i++) {
			// 删除子文件
			if (files[i].isFile()) {
				flag = deleteFile(files[i].getAbsolutePath());
				if (!flag)
					break;
			}
			// 删除子目录
			else if (files[i].isDirectory()) {
				flag = deleteDirectory(files[i]
						.getAbsolutePath());
				if (!flag)
					break;
			}
		}
		if (!flag) {
			System.out.println("删除目录失败！");
			return false;
		}
		// 删除当前目录
		if (dirFile.delete()) {
			System.out.println("删除目录" + dir + "成功！");
			return true;
		} else {
			return false;
		}
	}

	//获得文件的内容行数
	public static long getLineNumber(String strfile) {
		File file=new File(strfile);
		if (file.exists()) {
			try {
				FileReader fileReader = new FileReader(file);
				LineNumberReader lineNumberReader = new LineNumberReader(fileReader);
				lineNumberReader.skip(Long.MAX_VALUE);
				long lines = lineNumberReader.getLineNumber() + 1;
				fileReader.close();
				lineNumberReader.close();
				return lines;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return 0;
	}


	//删除文件中的第n行数据
	public static String deleteLine(String filePath,int indexLine){             
		try {        
			List<String> ifList=inputFile(filePath);
			ifList.remove(indexLine);
			outFile(StringHandle.StringListIntoString(ifList, "\r\n"),filePath,false);
		} catch (Exception e) {  
			return "fail :"+ e.getCause();     
		}      
		return "success!";   
	}


	//将字符串容器以行间修饰串存入文件中
	public static void outFileByStringList(List<String> strlist,String outfile,String lineDecorate)
	{
		outFile(StringHandle.StringListIntoString(strlist, lineDecorate),outfile,false);
	}

	//将字符串容器以空格和行间修饰串存入文件中
	public static void outFileByStringListList(List<List<String>> strlist,String outfile,String pointDecorate,String lineDecorate)
	{
		outFile(StringHandle.StringListIntoString(StringHandle.StringListListIntoStringList(strlist,pointDecorate),lineDecorate ),outfile,false);
	}

	//获得文件的修改时间
	public static String getModifiedTime(String path){  
		File f = new File(path);              
		Calendar cal = Calendar.getInstance();  
		String timechange="";
		//获取文件时间
		long time = f.lastModified();  
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
		//转换文件最后修改时间的格式
		cal.setTimeInMillis(time);    

		timechange = formatter.format(cal.getTime());
		return timechange;
		//输出：修改时间[2]    2009-08-17 10:32:38  
	}  

	//判断文件是否为空
	public static boolean fileIsEmpty(String path)
	{
		File fi=new File(path);

		if(fi.length()==0||!fi.exists())
			return true;
		else return false;
	}

	//获得文件目录里面的信息转为字符串的容器的容器
	public static List<List<String>> getInfosList(String path,String spchar)
	{
		List<String> objline=null;
		objline=inputFile(path);
		List<List<String>> objinfo=StringHandle.StringSplitByExpToStringList(objline, spchar);;
		return objinfo;
	}

	//获得文件目录里面的信息转为字符串的容器的容器
	public static Map<String,String> getInfosListToMap(String path,String spchar)
	{
		List<String> objline=null;
		objline=inputFile(path);
		List<List<String>> objinfo=StringHandle.StringSplitByExpToStringList(objline, spchar);
		return StringHandle.StringListToMap(StringHandle.StringListListInitSingleList(objinfo, 0), StringHandle.StringListListInitSingleList(objinfo, 1));
	}

	//获得文件目录里面的信息转为对应类的容器
	public static <T> List<T> getInfosToTlist(String path,String []nameNlist,Class<T> clazz)
	{
		List<String> objline=null;
		objline=inputFile(path);
		List<T> objinfo=StringHandle.StringSplitByExpToTList(objline, " ",nameNlist,clazz);;
		return objinfo;
	}

	//获得文件目录的里面的信息转为对应类的容器(自动型)
	public static <T> List<T> getInfosToTlist(String path,Class<T> clazz)
	{
		List<String> objline=null;
		objline=inputFile(path);
		List<T> objinfo=StringHandle.StringSplitByExpToTList(objline, " ",clazz);;
		return objinfo;
	}

	//将对应类容器里面的所有数据存入对应文件中
	public static <T> void outputFileByTlist(List<T> obj,Class<?> clazz,String path,boolean isAppend)
	{
		if(fileIsEmpty(path))
			outFile(StringHandle.StringListIntoString(EntityToString.getStringList(obj, clazz),"\r\n"),path,isAppend);
		else outFile("\r\n"+StringHandle.StringListIntoString(EntityToString.getStringList(obj, clazz),"\r\n"),path,isAppend);
	}
	public static <T> void outputFileByTlist(List<T> obj,String path,boolean isAppend)
	{
		outputFileByTlist(obj,obj.get(0).getClass(),path,isAppend);
	}


	//将对应的类数据添加到对应文件中
	public static <T> void outputFileByT(T obj,Class<?> clazz,String path,boolean isAppend)
	{
		if(fileIsEmpty(path))
			outFile(EntityToString.getString(obj, clazz),path,isAppend);
		else outFile("\r\n"+EntityToString.getString(obj, clazz),path,isAppend);
	}

	public static <T> void outputFileByT(T obj,String path,boolean isAppend)
	{
		outputFileByT(obj,obj.getClass(),path,isAppend);
	}

	//获得文件目录下所有文件
	public static List<String> getFileList(String fileDir)
	{

		List<String> fileList = new ArrayList<String>();
		File file = new File(fileDir);
		File[] files = file.listFiles();// 获取目录下的所有文件或文件夹
		if (files == null) {// 如果目录为空，直接退出
			return null;
		}

		// 遍历，目录下的所有文件
		for (File f : files) {
			if (f.isFile()) {
				try {
					fileList.add(f.getCanonicalPath());
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
			} 
		}
		return fileList;
	}
	//获得文件目录下所有文件(包括递归子文件夹的文件)
	public static List<String> getFileListAll(String fileDir)
	{

		List<String> fileList = new ArrayList<String>();
		File file = new File(fileDir);
		File[] files = file.listFiles();// 获取目录下的所有文件或文件夹
		if (files == null) {// 如果目录为空，直接退出
			return null;
		}

		// 遍历，目录下的所有文件
		for (File f : files) {

			if (f.isFile()) {
				try {
					fileList.add(f.getCanonicalPath());
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
			} else if (f.isDirectory()) {
				//System.out.println(f.getAbsolutePath());
				fileList.addAll(getFileList(f.getAbsolutePath()));
			}
		}
		return fileList;
	}

	//获得文件目录下所有文件夹
	public static List<String> getDirList(String fileDir)
	{

		List<String> fileList = new ArrayList<String>();
		File file = new File(fileDir);
		File[] files = file.listFiles();// 获取目录下的所有文件或文件夹
		if (files == null) {// 如果目录为空，直接退出
			return null;
		}

		// 遍历，目录下的所有文件
		for (File f : files) {
			if (f.isDirectory()) {
				try {
					fileList.add(f.getCanonicalPath());
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
			} 
		}
		return fileList;
	}

	//获得文件目录下所有文件夹(包括递归子文件夹的文件)
	public static List<String> getDirListAll(String fileDir)
	{

		List<String> fileList = new ArrayList<String>();
		File file = new File(fileDir);
		File[] files = file.listFiles();// 获取目录下的所有文件或文件夹
		if (files == null) {// 如果目录为空，直接退出
			return null;
		}

		// 遍历，目录下的所有文件
		for (File f : files) {
			if (f.isDirectory()) {
				String nowDir=null;
				try {
					nowDir=f.getCanonicalPath();
					fileList.add(nowDir);
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
				List<String> initDir=getDirListAll(nowDir);
				if(initDir.size()!=0)
					fileList.addAll(initDir);
			} 
		}
		return fileList;
	}
	//获得总类路径
	public static String getClassesDirPath(Class<?> classz)
	{
		return classz.getProtectionDomain().getCodeSource().getLocation().getFile();
	}

	//创建文件夹
	public static boolean createDir(String Path)
	{
		String filePar = Path;// 文件夹路径  
		File myPath = new File( filePar );  
		if ( !myPath.exists()){//若此目录不存在，则创建之  
			myPath.mkdir();  
			return true;
		}
		return false;
	}


}

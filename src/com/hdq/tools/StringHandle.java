package com.hdq.tools;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * 
 * @author Halo 洪鼎淇
 * @name 字符串及其字符串容器处理工具
 * @version v1.0
 * 
 */

public class StringHandle {
	//占位器
	public static JSONObject makePlaceHolder(String startHolder,int startlen,String endHolder,int endlen) {
		JSONObject result=new JSONObject();
		result.put("startHolder", startHolder);
		result.put("startlen", startlen);
		result.put("endHolder", endHolder);
		result.put("endlen", endlen);
		return result;
	}
	//占位分析器 (本想着做出解决一切最好的组件,但是奈何时间不允许，原谅我)@hdq
	public static JSONObject analysePlaceHolder(String holder,JSONObject placeHolder) {
		JSONObject result=new JSONObject();
		result.putAll(placeHolder);
		String startHolder=result.getString("startHolder");
		int startlen=result.getIntValue("startlen");
		String endHolder=result.getString("endHolder");
		int endlen=result.getIntValue("endlen");
		//以下仅是快速实现,不考虑任何语法兼容，请谅解
		String reg=startHolder+"[\\s\\S]*?"+endHolder;
		List<String> infos=StringHandle.getExpString(reg, holder);
		
		JSONArray data=new JSONArray();
		for(String subinfo:infos)
		{
			String subholder=subinfo.substring(startlen, subinfo.length()-endlen);
			data.add(subholder);
		}
		result.put("data", data);
		result.put("info",holder);
		return result;
	}
	//占位原始字符生成器
	public static String getPlaceHolder(JSONObject analysePlaceHolder,int index) {
		StringBuffer result=new StringBuffer();
		result.append(analysePlaceHolder.getString("startHolder"))
		.append(analysePlaceHolder.getJSONArray("data").getString(index))
		.append(analysePlaceHolder.getString("endHolder"));
		return result.toString();
	}
	public static String getInitPlaceHolder(JSONObject analysePlaceHolder,int index) {
		StringBuffer result=new StringBuffer();
		result.append(analysePlaceHolder.getJSONArray("data").getString(index));
		return result.toString();
	}
	//占位分析替换器
	public static String replacePlaceHolder(JSONObject analysePlaceHolder,int index,String replaceinfo) {
		analysePlaceHolder.put(
				"info", 
				analysePlaceHolder.getString("info").replace(StringHandle.getPlaceHolder(analysePlaceHolder,index), replaceinfo)
		);
		return analysePlaceHolder.getString("info");
	}
	/*	
	 	//占位分析器用法实例
		String info="main:<%%test%%> test:<%%ok%%>";
		JSONObject analyser=makePlaceHolder("<%%",3,"%%>",3);
		JSONObject analyserInfo=analysePlaceHolder(info,analyser);
		replacePlaceHolder(analyserInfo,0,
				getInitPlaceHolder(analyserInfo,0)
		);
		
		replacePlaceHolder(analyserInfo,1,
				getInitPlaceHolder(analyserInfo,1)
		);
		
		System.out.println(analyserInfo.getString("info"));
	
	 */
	

	//判断字符串是否属于某种时间格式
	public static boolean isValidDate(String str,String formatstr) {
	       boolean convertSuccess=true;
	       // 指定日期格式为四位年/两位月份/两位日期，注意yyyy/MM/dd区分大小写；
	       SimpleDateFormat format = new SimpleDateFormat(formatstr);
	       try {
	    	   // 设置lenient为false. 否则SimpleDateFormat会比较宽松地验证日期，比如2007/02/29会被接受，并转换成2007/03/01
	          format.setLenient(false);
	          format.parse(str);
	       } catch (ParseException e) {
	           // e.printStackTrace();
	    	   // 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
	           convertSuccess=false;
	       }
	       return convertSuccess;
	}
	//创建重复字符串
	public static String createRepeatString(String str,String split,String start,String end,int repeatNum) {
		StringBuilder sb=new StringBuilder();
		sb.append(start);
		for(int i=0;i<repeatNum;i++)
		{
			sb.append(str);
			if(i!=repeatNum-1) {
				sb.append(split);
			}
		}
		sb.append(end);
		return sb.toString();
	}
	/**
	 * 判断是否为注入语句
	 */
	public static boolean sql_inj(String str,boolean easy){
		String inj_str = "'|and|exec|insert|select|delete|update|count(|*|%|chr(|mid(|master|truncate|declare|;"
				+ "|or|-|+|,|from|drop|union|len(|left(|right(|where|sysobjects|newtable|master.|dbo.|sysdatabases"
				+ "|create|swap|set|char(|alter|columns|@|use|1=";
		if(easy)
			inj_str=inj_str.replace("'|and|", "").replace("|or", "");
		List<String> notAddSpace=StringHandle.StringNlistToStringList("1=|count(|@|+|-|,|%|*|;|len(|right(|char(|chr(|mid(|master.|dbo.".split("\\|"));
		//这里的东西还可以自己添加
		String[] inj_stra=inj_str.split("\\|");
		for (int i=0 ; i < inj_stra.length;i++ ){
			String space=" ";
			if(notAddSpace.contains(inj_stra[i]))
				space="";
			if (str.indexOf(inj_stra[i]+space)>=0){
		
				return true;
			}
		}
		return false;
	}
	/**
	 * 语法分析器1 用于分析A-B-C...诸如的字符串为列表，以split为"-"为列子
	 * @param sentence
	 * @param split
	 * @return 分析列表
	 */
	public static List<String> analyseListSentence(String sentence,String split){
		if(StringHandle.StringIsEmpty(sentence))
			return new ArrayList<>();
		return StringHandle.StringNlistToStringList(sentence.trim().split(split));
	}
	
	/**
	 * 语法分析器2 用于分析A:A1-B:B1-C:C1...诸如的字符串为Map，以split为"-",String formatter为":"为列子
	 * @param sentence
	 * @param split
	 * @param formatter
	 * @return 分析列表
	 */
	public static Map<String,String> analyseMapSentence(String sentence,String split,String formatter){
		Map<String,String> result=new HashMap<>();
		if(StringHandle.StringIsEmpty(sentence))
			return result;
		String []spst=sentence.trim().split(split);
		
		for(String sub:spst) {
			String []sbsp=sub.split(formatter);
			result.put(sbsp[0],sbsp[1]);
		}
		return result;
	}
	
	
	//比较时间的方位-1 0 1
	public static Integer StringTimeCompareTo(String format,String time1,String time2)
	{
		try {
			Date date1 = new SimpleDateFormat(format, Locale.SIMPLIFIED_CHINESE).parse(time1);
			Date date2 = new SimpleDateFormat(format, Locale.SIMPLIFIED_CHINESE).parse(time2);
			return date1.compareTo(date2);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	//添加a和b的数
	public static String StringAdd(String numa,String numb)
	{
		int flag=0;
		int i=0,j=0;
		int lena=numa.length();
		int lenb=numb.length();
		StringBuilder result=new StringBuilder();
		while(i<numa.length()||j<numb.length())
		{
			int a=(i<numa.length())?(numa.charAt(lena-i++-1)-'0'):0;
			int b=(j<numb.length())?(numb.charAt(lenb-j++-1)-'0'):0;
			int temp=a+b+flag;
			result.append(temp%10);
			flag=temp/10;
		}
		if(flag!=0)
			result.append(flag);
		return result.reverse().toString();
	}
	//获取当前时间"yyyy-MM-dd HH:mm:ss"
	public static String GetLocalTime(String format)
	{
		Date t = new Date();
		SimpleDateFormat df = new SimpleDateFormat(format, Locale.SIMPLIFIED_CHINESE);
		return df.format(t);
	}
	
	//获取当前时间"yyyy-MM-dd HH:mm:ss"
	public static String GetStandardLocalTime()
	{
		Date t = new Date();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.SIMPLIFIED_CHINESE);
		return df.format(t);
	}//获取当前时间"yyyy-MM-dd HH:mm:ss"
	public static Date GetLocalDate()
	{
		Date t = new Date();
		return t;
	}
	
	//将时间从一个格式转换为另外的格式"yyyy-MM-dd HH:mm:ss"
	public static String ChangeTimeFormat(String time,String formatinput,String fromatoutput)
	{
		// 将日期转换为另外的格式
        Date date = new Date();
        try {
            date = new SimpleDateFormat(formatinput, Locale.SIMPLIFIED_CHINESE).parse(time);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        String now = new SimpleDateFormat(fromatoutput, Locale.SIMPLIFIED_CHINESE).format(date);
        return now;//13:12
	}
	
	
	 /***
     * 生成时间戳
     * @param s
     * @return 时间戳
     */
    public static String GetTimeStamp(String time,String format) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format, Locale.SIMPLIFIED_CHINESE);
        Date date = null;
        try {
            date = simpleDateFormat.parse(time);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        long ts = Objects.requireNonNull(date).getTime();
        return String.valueOf(ts);
    }

    /***
     * 返回时间戳对应的时间
     * @param s
     * @return 时间
     */
    public static Timestamp GetDateFromTimeStamp(Long timestamp,String formatoutput) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(formatoutput, Locale.SIMPLIFIED_CHINESE);
        long lt = timestamp;
        Date date1 = new Date(lt);
        return Timestamp.valueOf(simpleDateFormat.format(date1));
    }

    /**
     * 将指定的日期字符串转换成日期
     * @param dateStr 日期字符串
     * @param pattern 格式
     * @return 日期对象
     */
    public static Date parseDate(String dateStr, String pattern)
    {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern, Locale.SIMPLIFIED_CHINESE);
        Date date;
        try {
            date = sdf.parse(dateStr);
        } catch (ParseException e) {
            throw  new RuntimeException("日期转化错误");
        }

        return date;
    }
    //将两个时间进行相减操作 Calendar.SECOND
    public static Long minusDateI(Date d1,Date d2,int dint)
    {
	    return (d1.getTime()-d2.getTime())/dint;
    }
    //将两个时间进行相减操作 Calendar.SECOND
    public static int minusDateC(Date d1,Date d2,int calendarType)
    {
    	Calendar c1 = Calendar.getInstance();   //当前日期
	    Calendar c2 = Calendar.getInstance();
	    c1.setTime(d1);
	    c2.setTime(d2);
	    return c1.get(calendarType)-c2.get(calendarType);
    }
    //修改将Date时间
    public static Date updateDate(Date date,int calendarType,int addnum)
    {
		Calendar calendar=new GregorianCalendar(); 
		calendar.setTime(date); 
		calendar.add(calendarType,addnum); 
		return calendar.getTime();
    }
    /**
     * format date method
     */
    public static String formatDate(Date date, String pattern){
        SimpleDateFormat sdf = new SimpleDateFormat(pattern, Locale.SIMPLIFIED_CHINESE);
        return sdf.format(date);
    }
    public static Date geLastWeekMonday(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(getThisWeekMonday(date));
		cal.add(Calendar.DATE, -7);
		return cal.getTime();
	}
 
	public static Date getThisWeekMonday(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		// 获得当前日期是一个星期的第几天
		int dayWeek = cal.get(Calendar.DAY_OF_WEEK);
		if (1 == dayWeek) {
			cal.add(Calendar.DAY_OF_MONTH, -1);
		}
		// 设置一个星期的第一天，按中国的习惯一个星期的第一天是星期一
		cal.setFirstDayOfWeek(Calendar.MONDAY);
		// 获得当前日期是一个星期的第几天
		int day = cal.get(Calendar.DAY_OF_WEEK);
		// 根据日历的规则，给当前日期减去星期几与一个星期第一天的差值
		cal.add(Calendar.DATE, cal.getFirstDayOfWeek() - day);
		return cal.getTime();
	}
 
	public static Date getNextWeekMonday(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(getThisWeekMonday(date));
		cal.add(Calendar.DATE, 7);
		return cal.getTime();
	}


    
	
	//sql包含语句
	public static String SqlInToEqual(String link,String colname,List<String> list) {

		if(list.size()==0)
			return " "+link+" 1=0";
		StringBuilder sql=new StringBuilder();
		sql.append(" ").append(link).append(" ");
		sql.append("(").append(StringListIntoString(StringListAdd(list,new StringBuilder().append(colname).append("='").toString(),"'")," or ")).append(") ");
		System.out.println(list);
		return sql.toString();
	}
	public static String SqlInToEqual(String link,String colname,String strequals,String split) {

		StringBuilder sql=new StringBuilder();
		sql.append(" ").append(link).append(" ");
		sql.append("(").append(StringListIntoString(StringListAdd(StringNlistToStringList(strequals.split(split)),new StringBuilder().append(colname).append("='").toString(),"'")," or ")).append(") ");
		return sql.toString();
	}
	//sql不包含语句
	public static String SqlInToNotEqual(String link,String colname,List<String> list) {

		StringBuilder sql=new StringBuilder();
		sql.append(" ").append(link).append(" ");
		sql.append("(").append(StringListIntoString(StringListAdd(list,new StringBuilder().append(colname).append("!='").toString(),"'")," and ")).append(") ");
		return sql.toString();
	}
	//sql加工语句
	public static String SqlPutInfos(String sql,Object ... args)
	{
		String newsql=sql.replace("?", "'%s'");
		newsql=String.format(newsql, args);
		return newsql;
	}
	//sql加工语句
	public static String SqlPutInfosWithoutQuote(String sql,Object ... args)
	{
		String newsql=sql.replace("?", "%s");
		newsql=String.format(newsql, args);
		return newsql;
	}
	//sql加工语句-替换第一个
	public static String SqlPutInfosWithoutQuoteFirst(String sql,Object arg)
	{
		String newsql=sql.replaceFirst("\\?", "%s");
		newsql=String.format(newsql, arg);
		return newsql;
	}
	public static int StringIsContainStringListRIndex(String it,List<String> strlist)
	{
		int num=strlist.size();
		for(int i=0;i<num;i++)
		{
			if(it.contains(strlist.get(i)))
			{
				//				System.out.println(i);
				return i;
			}
		}
		//		System.out.println(-1);
		return -1;
	}
	/**
     * java高效比较两个字符串的相似度算法
     *
     *
     *
     * 解决方法：
     *
     * Levenshtein Distance，又称编辑距离，指的是两个字符串之间，由一个转换成另一个所需的最少编辑操作次数。
     *
     * 许可的编辑操作包括将一个字符替换成另一个字符，插入一个字符，删除一个字符。
     *
     * 编辑距离的算法是首先由俄国科学家Levenshtein提出的，故又叫Levenshtein Distance。
     *
     *
     *
     * 算法原理：
     *
     * 该算法的解决是基于动态规划的思想，具体如下：
     *
     * 设 s 的长度为 n，t 的长度为 m。如果 n = 0，则返回 m 并退出；如果 m=0，则返回 n 并退出。否则构建一个数组 d[0..m, 0..n]。
     *
     * 将第0行初始化为 0..n，第0列初始化为0..m。
     *
     * 依次检查 s 的每个字母(i=1..n)。
     *
     * 依次检查 t 的每个字母(j=1..m)。
     *
     * 如果 s[i]=t[j]，则 cost=0；如果 s[i]!=t[j]，则 cost=1。将 d[i,j] 设置为以下三个值中的最小值：
     *
     * 紧邻当前格上方的格的值加一，即 d[i-1,j]+1
     *
     * 紧邻当前格左方的格的值加一，即 d[i,j-1]+1
     *
     * 当前格左上方的格的值加cost，即 d[i-1,j-1]+cost
     *
     * 重复3-6步直到循环结束。d[n,m]即为莱茵斯坦距离。
     */
    /**
     * 比较两个字符串的相识度
     * <p>
     * <p>
     * 核心算法：用一个二维数组记录每个字符串是否相同，如果相同记为0，不相同记为1，每行每列相同个数累加
     * <p>
     * <p>
     * 则数组最后一个数为不相同的总数，从而判断这两个字符的相识度
     */
    private static int compare(String str, String target) {
        int d[][]; // 矩阵
        int n = str.length();
        int m = target.length();
        int i; // 遍历str的
        int j; // 遍历target的
        char ch1; // str的
        char ch2; // target的
        int temp; // 记录相同字符,在某个矩阵位置值的增量,不是0就是1
        if (n == 0) {
            return m;
        }
        if (m == 0) {
            return n;
        }
        d = new int[n + 1][m + 1];
// 初始化第一列
        for (i = 0; i <= n; i++) {
            d[i][0] = i;
        }
// 初始化第一行
        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }

        for (i = 1; i <= n; i++) {
// 遍历str
            ch1 = str.charAt(i - 1);
// 去匹配target
            for (j = 1; j <= m; j++) {
                ch2 = target.charAt(j - 1);
                if (ch1 == ch2 || ch1 == ch2 + 32 || ch1 + 32 == ch2) {
                    temp = 0;
                } else {
                    temp = 1;
                }
// 左边+1,上边+1, 左上角+temp取最小
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + temp);
            }
        }
        return d[n][m];
    }

    
    /**
     * 获取最小的值
     */
    private static int min(int one, int two, int three) {
        return (one = one < two ? one : two) < three ? one : three;
    }


    /**
     * 获取两字符串的相似度
     */
    public static float GetSimilarityRatio(String str, String target) {
        if (StringIsEmpty(str) || StringIsEmpty(target)) {
            return 0;
        }
        int max = Math.max(str.length(), target.length());
        return 1 - (float) compare(str, target) / max;
    }
    public static List<Float> GetStringListSimilartyRatio(String str,List<String> lines)
    {
    	List<Float> results=new ArrayList<Float>();
    	for(String init:lines)
    		results.add(GetSimilarityRatio(str,init));
    	return results;
    }
    
    
    //判断字符串是否为空
    public static boolean StringIsEmpty(String str)
    {
    	if(str==null||str.equals(""))
    		return true;
    	return false;
    }

	//返回一个用左字符串，右字符串修饰的字符串
	public static String StringAdd(String info,String left,String right)
	{
		return new StringBuilder().append(left).append(info).append(right).toString();
	}
	//返回子字符串中包含特定字符的字符串容器
	public static List<String> StringListContainString(List<String> infos,String substr)
	{
		List<String> results=new ArrayList<String>();
		int num=infos.size();
		for(int i=0;i<num;i++)
		{
			if(infos.get(i).contains(substr))
				results.add(infos.get(i));
		}
		return results;
	}

	//返回子字符串中包含特定字符的字符串容器,限制获取个数
	public static List<String> StringListContainStringLimitNum(List<String> infos,String substr,int limitnum)
	{
		List<String> results=new ArrayList<String>();
		int num=infos.size();
		for(int i=0;i<num;i++)
		{
			if(infos.get(i).contains(substr))
				results.add(infos.get(i));
			if(results.size()>=limitnum)
				break;
		}
		return results;
	}

	//全模糊搜索字符串容器中的String，limitnum表示限制搜索格式，单limitnum<=0时表示无限制
	public static List<String> StringListThinkLimitNum(List<String> infos,String think,int limitnum)
	{
		String []tlist=think.split("");
		String firstsearch="";
		if(tlist.length>0)
			firstsearch=tlist[0]+"";
		List<String> searchTarget=null;
		if(!tlist[0].equals(""))
			searchTarget=StringListContainString(infos,firstsearch);
		else searchTarget=StringListContainStringLimitNum(infos,firstsearch,limitnum);
		int i=0;

		for(i=1;i<tlist.length-1;i++)
		{
			searchTarget=StringListContainString(searchTarget, tlist[i]+"");
		}
		if(tlist.length>i)
		{
			if(limitnum>=1)
			{
				searchTarget=StringListContainStringLimitNum(searchTarget, tlist[i]+"", limitnum);
			}
			else searchTarget=StringListContainString(searchTarget, tlist[i]+"");
		}

		return searchTarget;
	}

	//用左字符串，右字符串修饰字符串容器
	public static List<String> StringListAdd(List<String> infoList,String left,String right)
	{
		int num=infoList.size();
		List<String> ls=new ArrayList<String>();
		for(int i=0;i<num;i++)
		{
			ls.add(new StringBuilder().append(left).append(infoList.get(i)).append(right).toString());
		}
		return ls;
	}
	//用左字符串，右字符串修饰字符串容器的容器中的全部字符串
	public static List<List<String>> StringListListAdd(List<List<String>> infolistlist,String left,String right)
	{
		int num=infolistlist.size();
		List<List<String>> lls=new 	ArrayList<List<String>>();
		for(int i=0;i<num;i++)
		{
			lls.add(StringListAdd(infolistlist.get(i),left,right));
		}
		return lls;
	}

	//将字符串容器组合成一个字符串,并且字符串和字符串之间添加decorate
	public static String StringListIntoString(List<String> infoList,String decorate)
	{
		StringBuilder result=new StringBuilder();
		int num=infoList.size();
		for(int i=1;i<num;i++)
		{
			result.append(new StringBuilder().append(decorate).append(infoList.get(i)).toString());
		}
		if(num>0)
			result.insert(0, infoList.get(0));
		return result.toString();
	}

	//将整型容器组合成一个字符串,并且整型和字符串之间添加decorate
	public static String IntegerListIntoString(List<Integer> infoList,String decorate)
	{
		StringBuilder result=new StringBuilder();
		int num=infoList.size();
		for(int i=1;i<num;i++)
		{
			result.append(decorate).append(infoList.get(i));
		}
		if(num>0)
			result.insert(0, infoList.get(0));
		return result.toString();
	}

	//判断字符串的长度是否处于n到m个长度
	public static boolean StringIsSuitLength(String it,int n,int m)
	{
		if(it.length()>=n&&it.length()<=m)
			return true;
		return false;
	}

	//判断字符串是否符合正则表达式（全匹配)
	public static boolean StringIsSuitExep(String str,String exp)
	{
		if(str==null)
			return false;
		boolean isMatch = Pattern.matches(exp, str);
		return isMatch;
	}

	//判断字符串是否符合正则表达式（匹配子字符串)
	public static boolean StringIsSuitSubExep(String str,String exp)
	{
		// 编译正则表达式
		Pattern pattern = Pattern.compile(exp);
		// 忽略大小写的写法
		// Pattern pat = Pattern.compile(regEx, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(str);
		// 查找字符串中是否有匹配正则表达式的字符/字符串
		boolean rs = matcher.find();
		return rs;
	}
	//将Object容器转换为String容器
	public static List<String> ObjectListToStringList(List<Object> objList)
	{
		List<String> strList=new ArrayList<String>();
		for(int i=0;i<objList.size();i++)
		{
			strList.add((String)objList.get(i));
		}
		return strList;
	}
	//将Object数组转化为String数组
	public static String[] ObjectListToStringNlist(Object []object)
	{
		List<Object> listTemp = java.util.Arrays.asList(object);
		List<String> list=ObjectListToStringList(listTemp);
		String[] strings = new String[list.size()];
		list.toArray(strings);
		return strings;
	}
	//将String容器转换为String数组
	public static String[] StringListToStringNlist(List<String> list)
	{
		return list.toArray(new String[list.size()]);
	}

	//获得字符串中的符合正则表达式的值
	public static List<String> getExpString(String exp,String str)
	{
		Pattern pattern;
		Matcher matcher;
		// 贪婪: 最长匹配 .* : 输出: <biao><>c<b>
		List<String> result=new ArrayList<String>();
		pattern = Pattern.compile(exp);
		matcher = pattern.matcher(str);
		while (matcher.find()) {
			result.add(matcher.group());
		}
		return result;
	}

	//获得字符串中的符合正则表达式的值 并去除空白符
	public static List<String> getExpStringAndRepalceEmpty(String exp,String str)
	{
		Pattern pattern;
		Matcher matcher;
		// 贪婪: 最长匹配 .* : 输出: <biao><>c<b>
		List<String> result=new ArrayList<String>();
		pattern = Pattern.compile(exp);
		matcher = pattern.matcher(str);
		while (matcher.find()) {
			result.add(matcher.group().replaceAll("\\s", ""));
		}
		return result;
	}

	//获得字符串中的符合正则表达式的值 并去除空白符
	public static List<String> getExpStringAndRemoveEmpty(String exp,String str)
	{
		Pattern pattern;
		Matcher matcher;
		// 贪婪: 最长匹配 .* : 输出: <biao><>c<b>
		List<String> result=new ArrayList<String>();
		pattern = Pattern.compile(exp);
		matcher = pattern.matcher(str);
		while (matcher.find()) {
			String info=matcher.group();
			if(info==null||StringIsSuitExep(info,"\\s*"))
				continue;
			result.add(info);
		}
		return result;
	}

	//获得字符串中的符合正则表达式的值 并去除空白符
	public static List<String> getExpStringAndRemoveAndReplaceEmpty(String exp,String str)
	{
		Pattern pattern;
		Matcher matcher;
		// 贪婪: 最长匹配 .* : 输出: <biao><>c<b>
		List<String> result=new ArrayList<String>();
		pattern = Pattern.compile(exp);
		matcher = pattern.matcher(str);
		while (matcher.find()) {
			String info=matcher.group();
			if(info==null||StringIsSuitExep(info,"\\s*"))
				continue;
			result.add(info.replaceAll("\\s", ""));
		}
		return result;
	}

	//去除字符串容器中的空白符
	public static List<String> StringListReplaceEmpty(List<String> list)
	{
		List<String> ls=new ArrayList<String>();
		int num=list.size();
		for(int i=0;i<num;i++)
		{
			String info=list.get(i);
			ls.add(info.replaceAll("\\s", ""));
		}
		return ls;
	}

	//移除字符串容器中的空白符字符串
	public static List<String> StringListRemoveEmpty(List<String> list)
	{
		List<String> ls=new ArrayList<String>();
		int num=list.size();
		for(int i=0;i<num;i++)
		{
			String info=list.get(i);
			if(info==null||StringIsSuitExep(info,"\\s*"))
				continue;
			//System.out.println(StringIsSuitExep(info,"\\s*")+"  字符串:\""+info+"\"");
			ls.add(info);
		}
		return ls;
	}
	//移除字符串容器中的空白符字符串并将空白字符替换为空
	public static List<String> StringListRemoveAndReplaceEmpty(List<String> list)
	{
		List<String> ls=new ArrayList<String>();
		int num=list.size();
		for(int i=0;i<num;i++)
		{
			String info=list.get(i);
			if(info==null||StringIsSuitExep(info,"\\s*"))
				continue;
			//System.out.println(StringIsSuitExep(info,"\\s*")+"  字符串:\""+info+"\"");
			ls.add(info.replaceAll("\\s", ""));
		}
		return ls;
	}


	//将String数组转换为String容器
	public static List<String> StringNlistToStringList(String []strlist)
	{
		List<String> list = java.util.Arrays.asList(strlist);
		return list;
	}

	//判断一系列的以空格分开的字符串序列中的特定位置是否含有相对应的信息(全一致长度容器),有的话返回对应行数容器，没有的话返回null
	public static List<Integer> judgeStringListContainPerfect(List<List<String>> info,int count,String contain)
	{
		List<Integer> numList=new ArrayList<Integer>();
		int g_size=info.size();
		for(int i=0;i<g_size;i++)
		{
			int g_initsize=info.get(i).size();
			if(g_initsize>count)
			{
				return null;
			}
			else
			{
				if(!info.get(i).get(count-1).equals(contain))
				{
					continue;
				}
				else
				{
					numList.add(i);
				}

			}
		}
		if(numList.size()==0)
			return null;
		else return numList;
	}


	//将字符串中符合正则表达式的字符替换为空
	public static List<String> StringListReplaceAll(List<String> infos,String exp)
	{
		List<String> result=new ArrayList<String>();
		int g_size=infos.size();
		for(int i=0;i<g_size;i++)
		{
			String temp=infos.get(i).replaceAll(exp, "");
			result.add(temp);
		}
		return result;
	}

	//判断一系列的以空格分开的字符串序列中的特定位置是否含有相对应的信息(非全一致长度容器),有的话返回对应行数容器，没有的话返回null
	public static List<Integer> judgeStringListContain(List<List<String>> info,int count,String contain)
	{
		List<Integer> numList=new ArrayList<Integer>();
		int g_size=info.size();
		for(int i=0;i<g_size;i++)
		{
			int g_initsize=info.get(i).size();
			if(g_initsize>count)
			{
				continue;
			}
			else
			{
				if(!info.get(i).get(count-1).equals(contain))
				{
					continue;
				}
				else
				{
					numList.add(i);
				}

			}
		}
		if(numList.size()==0)
			return null;
		else return numList;
	}

	//以对应正则表达式分隔字符并且将分隔后的字符串储存进字符串容器中
	public static List<List<String>> StringSplitByExpToStringList(List<String> strlist,String exp)
	{
		List<List<String>> strresult=new ArrayList<List<String>>();
		int g_size=strlist.size();
		for(int i=0;i<g_size;i++)
		{
			String list=strlist.get(i);
			if(list==null)
				continue;
			String []strnlist=list.split(exp);
			strresult.add(StringNlistToStringList(strnlist));
		}
		return strresult;
	}
	
	//以对应正则表达式分隔字符并且将分隔后的字符串储存进类容器中
	public static <T> List<T> StringSplitByExpToTList(List<String> strlist,String exp,String []namelist,Class<T> clazz)
	{
		List<T> tresult=new ArrayList<T>();
		int g_size=strlist.size();
		for(int i=0;i<g_size;i++)
		{
			String list=strlist.get(i);
			if(list==null)
				continue;
			String []nlist=list.split(exp);
			if(nlist.length<namelist.length)
			{
				throw new IllegalArgumentException("The Length of namelist is longer than nlist");
			}
			T bean;
			try {
				bean = clazz.newInstance();
				int num=namelist.length;
				for(int j=0;j<num;j++)
				{
					Field fs=getDeclaredField(bean, namelist[j]);
					if(fs==null){
						throw new IllegalArgumentException(new StringBuilder().append("Could not find field[").append("] on target [").append(bean).append("]").toString());
					}
					makeAccessiable(fs);
					try{
						fs.set(bean, (Object)nlist[j]);
					}
					catch(IllegalAccessException e){
						System.out.println("不可能抛出的异常");
					}

				}
				tresult.add(bean);
			} catch (InstantiationException | IllegalAccessException e1) {
				// TODO 自动生成的 catch 块
				e1.printStackTrace();
			}

		}
		return tresult;
	}

	//以对应正则表达式分隔字符并且将分隔后的字符串储存进类容器中(自动型)
	public static <T> List<T> StringSplitByExpToTList(List<String> strlist,String exp,Class<T> clazz)
	{
		List<T> tresult=new ArrayList<T>();
		int g_size=strlist.size();
		for(int i=0;i<g_size;i++)
		{
			String list=strlist.get(i);
			if(list==null)
				continue;
			String []nlist=list.split(exp);

			Field[ ] fields = clazz.getDeclaredFields( );

			T bean;
			try {
				bean = clazz.newInstance();
				// 循环遍历字段，获取字段相应的属性值
				int j=0;
				for ( Field field : fields )
				{
					// 假设不为空。设置可见性，然后返回
					field.setAccessible( true );
					try
					{
						Field fs=getDeclaredField(bean, field.getName( ));
						if(fs==null){
							throw new IllegalArgumentException(new StringBuilder().append("Could not find field[").append(
									field.getName( )).append("] on target [").append(bean).append("]").toString());
						}
						makeAccessiable(fs);
						try{
							fs.set(bean, (Object)nlist[j]);
						}
						catch(IllegalAccessException e){
							System.out.println("不可能抛出的异常");
						}
						// 设置字段可见，就可以用get方法获取属性值。
						//result += field.get( o ) +" ";
						++j;
					}
					catch ( Exception e )
					{
						System.out.println(new StringBuilder().append("映射出现问题").append(e).toString());
						e.printStackTrace();
						// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
					}
				}



				tresult.add(bean);
			} catch (InstantiationException | IllegalAccessException e1) {
				// TODO 自动生成的 catch 块
				e1.printStackTrace();
			}

		}
		return tresult;
	}

	//将字符串容器的容器组合成一个字符串容器,并且字符串和字符串之间添加decorate
	public static List<String> StringListListIntoStringList(List<List<String>> infoList,String decorate)
	{
		List<String> result=new ArrayList<String>();
		int num=infoList.size();
		for(int i=0;i<num;i++)
		{
			int initnum=infoList.get(i).size();
			StringBuilder resultTemp=new StringBuilder();
			for(int j=1;j<initnum;j++)
			{
				resultTemp.append(decorate).append(infoList.get(i).get(j));
			}
			if(initnum>0)
				resultTemp.insert(0, infoList.get(i).get(0));
			result.add(resultTemp.toString());
		}
		return result;
	}
	//删除string容器中符合正则表达式的元素
	public static List<String> deleteStringListIsSuitExp(List<String> strlist,String exp)
	{
		Iterator<String> it = strlist.iterator();
		while(it.hasNext()){
			String x = it.next();
			if(StringIsSuitExep(x, exp)){
				it.remove();
			}
		}
		return strlist;
	}
	//删除string容器的容器中符合正则表达式的元素
	public static List<List<String>> deleteStringListListIsSuitExp(List<List<String>> strlist,String exp)
	{
		int g_size=strlist.size();
		for(int i=0;i<g_size;i++)
		{
			List<String> itTemp=new ArrayList<String>(strlist.get(i));
			Iterator<String> it = itTemp.iterator();
			while(it.hasNext()){
				if(StringIsSuitExep(it.next(), exp)){
					it.remove();
				}
			}
			strlist.set(i, itTemp);
		}
		return strlist;
	}

	//将字符串容器的容器拼接成字符串容器
	public static List<String> StringListListAddToStringList(List<List<String>> strllist)
	{
		List<String> strResult=new ArrayList<String>();
		Integer g_size=strllist.size();
		for(int i=0;i<g_size;i++)
		{
			strResult.addAll(strllist.get(i));
		}
		return strResult;
	}

	//将字符串容器的值统计并记录进Map中
	public static Map<String,Integer> StringListToMapValue(List<String> strlist)
	{
		Map<String,Integer> maplist=new HashMap<String,Integer>();
		Integer g_size=strlist.size();
		for(int i=0;i<g_size;i++) {

			Integer g_map=maplist.get(strlist.get(i));
			if(g_map==null)
			{
				maplist.put(strlist.get(i),1);
			}
			else
			{
				maplist.put(strlist.get(i), g_map+1);
			}
		}
		return maplist;
	}

	//将两个字符串容器对应链接成Map
	public static Map<String,String> StringListToMap(List<String> list1,List<String> list2)
	{
		Map<String,String> map=new HashMap<String,String>();
		int g_size=list1.size();
		System.out.println(new StringBuilder().append("map:").append(g_size).append(",").append(list2.size()));
		if(list1.size()!=list2.size())
			return map;
		else
		{
			for(int i=0;i<g_size;i++)
			{
				map.put(list1.get(i), list2.get(i));
			}
		}
		return map;
	}

	//将字符串容器和整型容器对应链接成Map
	public static Map<String,Integer> StringListAndIntegerListToMap(List<String> list1,List<Integer> list2)
	{
		Map<String,Integer> map=new HashMap<String,Integer>();
		int g_size=list1.size();
		if(list1.size()!=list2.size())
			return map;
		else
		{
			for(int i=0;i<g_size;i++)
			{
				map.put(list1.get(i), list2.get(i));
			}
		}
		return map;
	}




	//抽取字符串容器容器中的某一列出来(perfect型)
	public static List<String> StringListListInitSingleList(List<List<String>> strlist,Integer index)
	{
		List<String> strlistTemp=new ArrayList<String>();
		int g_size=strlist.size();
		if(g_size==0)
			return strlistTemp;
		if(index>=strlist.get(0).size())
			return strlistTemp;
		for(int i=0;i<g_size;i++)
		{
			strlistTemp.add(strlist.get(i).get(index));
		}
		return strlistTemp;
	}



	//字符串列表精确包含某个字符串
	public static boolean StringListIsExContainString(List<String> strlist,String it)
	{
		int num=strlist.size();
		for(int i=0;i<num;i++)
		{
			if(strlist.get(i).equals(it))
				return true;
		}
		return false;
	}

	//字符串容器和字符串容器中将互相包含的元素取出
	public static List<String> StringListSameOutStringList(List<String> strlist1,List<String> strlist2)
	{
		List<String> result=new ArrayList<String>();
		int g_size=strlist1.size();
		int g_size2=strlist2.size();
		if(g_size==0||g_size2==0)
			return result;
		for(int i=0;i<g_size;i++)
		{
			String itTemp=strlist1.get(i);
			if(StringListIsExContainString(strlist2,itTemp))
			{
				result.add(itTemp);
			}
		}
		return result;
	}

	//将字符串中重复的元素移除
	public static List<String> StringListRemoveRepeat(List<String> infos)
	{
		List<String> result=new ArrayList<String>();
		int g_size=infos.size();
		for(int i=0;i<g_size;i++)
		{
			String temp=infos.get(i);
			if(!StringListIsContainString(result,temp))
			{
				result.add(temp);
			}
		}
		return result;
	}

	//判断字符串中是否含有
	public static boolean StringListIsContainString(List<String> info,String txt)
	{
		int g_size=info.size();
		for(int i=0;i<g_size;i++)
		{
			if(info.get(i).equals(txt))
			{
				return true;
			}
		}
		return false;
	}


	//返回对应子字符串容器中对应字符串中的位置的容器
	public static List<Integer> StringListInStringListIndexof(List<String> allinfo,List<String> sublist)
	{
		List<Integer> numlist=new ArrayList<Integer>();
		int g_size=allinfo.size();
		int g_size2=sublist.size();
		if(g_size==0||g_size2==0)
			return numlist;
		for(int i=0;i<g_size2;i++)
		{
			numlist.add(allinfo.indexOf(sublist.get(i)));
		}
		return numlist;
	}

	//将字符串容器的容器转换为T容器
	@SuppressWarnings({ "unchecked" })
	public static <T> List<T> StringListListToTlist(List<List<String>> strlist,Class<?> clazz)
	{
		List<T> tresult=new ArrayList<T>();
		int g_size=strlist.size();
		Field[ ] fields = clazz.getDeclaredFields( );
		for(int i=0;i<g_size;i++)
		{
			List<String> list=strlist.get(i);
			if(list==null)
				continue;
			String []nlist=StringListToStringNlist(list);

			T bean;
			try {
				bean = (T) clazz.newInstance();
				// 循环遍历字段，获取字段相应的属性值
				int j=0;
				for ( Field field : fields )
				{
					// 假设不为空。设置可见性，然后返回
					field.setAccessible( true );
					try
					{
						Field fs=getDeclaredField(bean, field.getName( ));
						if(fs==null){
							throw new IllegalArgumentException(new StringBuilder().append("Could not find field[").append(
									field.getName( )).append("] on target [").append(bean).append("]").toString());
						}
						makeAccessiable(fs);
						try{
							fs.set(bean, (Object)nlist[j]);
						}
						catch(IllegalAccessException e){
							System.out.println("不可能抛出的异常");
						}
						// 设置字段可见，就可以用get方法获取属性值。
						//result += field.get( o ) +" ";
						++j;
					}
					catch ( Exception e )
					{
						e.printStackTrace();
						// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
					}
				}



				tresult.add(bean);
			} catch (InstantiationException | IllegalAccessException e1) {
				// TODO 自动生成的 catch 块
				e1.printStackTrace();
			}

		}
		return tresult;
	}
	//字符串容器逐个字符替换 逐个字符包含括号
	public static List<String> StringListInitReplaceSingle(List<String> infos,String singleCharStr,String repalceReg)
	{
		List<String> results=new ArrayList<String>();
		for(String sub:infos)
			results.add(StringReplaceSingle(sub,singleCharStr,repalceReg));
		return results;
	}
	//字符串逐个字符替换
	public static String StringReplaceSingle(String info,String singleCharStr,String repalceReg)
	{
		String spstr[]=singleCharStr.split("");
		String result=info;
		for(String sub:spstr)
		{
			result=result.replaceAll(new StringBuilder().append("(").append(sub).append(")").toString(), repalceReg);
		}
		return result;
	}

	//将字符串容器的容器中取出对应整型容器对应位置的字符串的容器的容器-竖着获取
	public static List<List<String>> StringListListInitIndexOfIntegerList(List<List<String>> ls,List<Integer> indexof)
	{
		int g_size=ls.size();
		System.out.println(g_size);
		int g_numsize=indexof.size();
		List<List<String>> result=new ArrayList<List<String>>();
		for(int i=0;i<g_size;i++)
		{
			List<String> temp=new ArrayList<String>();

			for(int j=0;j<g_numsize;j++)
			{
				temp.add(ls.get(i).get(indexof.get(j)));
			}

			result.add(temp);
		}
		return result;
	}


	//将字符串容器的容器链接上对应字符串容器的容器
	public static List<List<String>> StringListListAddToByStringListList(List<List<String>> strlistlist,List<List<String>> strlist)
	{
		int g_size=strlistlist.size();
		List<List<String>> result=new ArrayList<List<String>>();
		for(int i=0;i<g_size;i++)
		{
			List<String> strTemp=new ArrayList<String>(strlistlist.get(i));
			strTemp.addAll(strlist.get(i));
			result.add(strTemp);
		}
		return result;
	}
	//健值反转
	public static <T,C> Map<C,T> MapReserve(Map<T,C> normal)
	{
		Set<T> keys = normal.keySet();
		Map<C,T> reserve=new HashMap<C,T>();

		for(T key : keys){
			C value = normal.get(key);
			reserve.put(value,key);
		}
		return reserve;
	}

	//将对应的T容器转换为字符串的容器的容器
	public static <T> List<List<String>> TListToStringListList(List<T> tlist)
	{
		List<List<String>> result=new ArrayList<List<String>>();
		int g_size=tlist.size();
		if(g_size==0)
			return result;
		for(int i=0;i<g_size;i++)
		{
			result.add(StringNlistToStringList(EntityToString.getString(tlist.get(i), tlist.get(i).getClass()).split(" ")));
		}
		return result;

	}

	//返回字符串容器中符合正则的字符串容器
	public static List<String> StringListGetSuitExpStringList(List<String> strlist,String exp)
	{
		List<String> temp=new ArrayList<String>();
		int g_size=strlist.size();
		for(int i=0;i<g_size;i++)
		{
			String subtemp=strlist.get(i);
			if(StringIsSuitExep(subtemp,exp))
				temp.add(subtemp);
		}
		return temp;
	}

	//返回字符串容器中字符包含符合正则的字符串容器
	public static List<String> StringListGetSuitSubExpStringList(List<String> strlist,String subexp)
	{
		List<String> temp=new ArrayList<String>();
		int g_size=strlist.size();
		for(int i=0;i<g_size;i++)
		{
			String subtemp=strlist.get(i);
			if(StringIsSuitSubExep(subtemp,subexp))
				temp.add(subtemp);
		}
		return temp;
	}



	//获得对应类容器中的字符串容器
	public static <T> List<String> getTSingleList(List<T> tlist,String name)
	{
		return StringListListInitSingleList(TListToStringListList(tlist), EntityToString.getNameIndexof(tlist.get(0).getClass(), name));
	}

	//将T转换为字符串容器
	public static <T> List<String> TToStringList(T it)
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
				// System.out.println("error--------"+methodName+".Reason is:"+e.getMessage());
			}
		}
		return result;
	}
	//将字符串容器的容器链接上对应字符串容器
	public static List<List<String>> StringListListAddToStringListList(List<List<String>> strlistlist,List<String> strlist)
	{
		int g_size=strlistlist.size();
		List<List<String>> result=new ArrayList<List<String>>();
		for(int i=0;i<g_size;i++)
		{
			List<String> strTemp=new ArrayList<String>(strlistlist.get(i));
			strTemp.add(strlist.get(i));
			result.add(strTemp);
		}
		return result;
	}

	//将字符串容器的值转换为T
	public static <T> T StringListToT(List<String> it,Class<T> clazz)
	{

		Field[ ] fields = clazz.getDeclaredFields( );
		T bean=null;
		try {
			bean=(T) clazz.newInstance();
			// 循环遍历字段，获取字段相应的属性值
			int j=0;
			for ( Field field : fields )
			{
				// 假设不为空。设置可见性，然后返回
				field.setAccessible( true );
				try
				{
					Field fs=getDeclaredField(bean, field.getName( ));
					if(fs==null){
						throw new IllegalArgumentException(new StringBuilder().append("Could not find field[").append(
								field.getName( )).append("] on target [").append(bean).append("]").toString());
					}
					makeAccessiable(fs);
					try{
						fs.set(bean, (Object)it.get(j));
					}
					catch(IllegalAccessException e){
						System.out.println("不可能抛出的异常");
					}
					// 设置字段可见，就可以用get方法获取属性值。
					//result += field.get( o ) +" ";
					++j;
				}
				catch ( Exception e )
				{
					System.out.println(new StringBuilder().append("映射出现问题").append(e).toString());
					e.printStackTrace();
				}
			}
		} catch (InstantiationException | IllegalAccessException e1) {
			// TODO 自动生成的 catch 块
			e1.printStackTrace();
		}
		return bean;
	}

	//将map中的对应String的键的值获取出来储存到字符串的容器
	public static <T> List<T> GetMapKeysValue(Map<String,T> map,List<String> keys)
	{
		List<T> result=new ArrayList<T>();
		for(String key:keys)
		{
			result.add(map.get(key));
		}
		return result;
	}

	//将字符串转换成T类
	public static <T> T StringToT(String str,Class<T> it)
	{
		return StringListToT(StringNlistToStringList(str.split(" ")),it);
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



	//判断field的修饰符是否是public static,并据此改变field的访问权限 
	public static void makeAccessiable(Field field){
		if(!Modifier.isPublic(field.getModifiers())){
			field.setAccessible(true);
		}
	}


}

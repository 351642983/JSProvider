package com.hdq.tools;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;


public class Runcmd{
	
	
	//获得节点json信息
	public static List<String> run_cmd(String presend,List<String> info)
	{
		List<String> strresult=new ArrayList<>();
		Runtime proc;
		proc = Runtime.getRuntime();
		try {
			Process result=proc.exec(presend);
			OutputStream output=result.getOutputStream();
			for(String init:info)
				runOutput(output,init);
			runFinish(output);
			InputStream input=result.getInputStream();
			BufferedReader br = null;
			br = new BufferedReader(new InputStreamReader(input, "GB2312"));
			String line = null;
			while ((line = br.readLine()) != null) {
				strresult.add(line);
			}
			input.close();
			result.waitFor();
		}catch (IOException | InterruptedException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
		return strresult;
	}
	
	
	
	
	
		//解析单层字符串
	public static List<String> pyStringToListInfo(String pyString)
	{
		List<List<String>> outputlist=null;
		String []spilt_result=pyString.split("\\], \\[");
		if(spilt_result[0].length()>=2)
			spilt_result[0]=spilt_result[0].substring(1);
		if(spilt_result[spilt_result.length-1].length()>=3)
			spilt_result[spilt_result.length-1]=spilt_result[spilt_result.length-1].substring(0,spilt_result[spilt_result.length-1].length()-1);
		else{
			outputlist=new ArrayList<List<String>>();
			//spilt_result[spilt_result.length-1]=spilt_result[spilt_result.length-1].substring(0,spilt_result[spilt_result.length-1].length()-1);
		}
		if(outputlist==null) {
			outputlist=StringHandle.StringSplitByExpToStringList(StringHandle.StringNlistToStringList(spilt_result), ", ");
			int len=outputlist.size();
			for(int i=0;i<len;i++)
			{
				List<String> nowlist=outputlist.get(i);
				int sublen=nowlist.size();

				for(int j=0;j<sublen;j++)
				{
					String nowstr=nowlist.get(j);
					if(nowstr!=null&&nowstr.length()>1)
					{
						if(nowstr.startsWith("'")&&nowstr.endsWith("'"))
						{
							nowstr=nowstr.substring(1,nowstr.length()-1);
							nowlist.set(j, nowstr);
							outputlist.set(i, nowlist);
						}
					}
				}
			}
		}
		return outputlist.get(0);
	}
	public static void runOutput(OutputStream outstream,String command)
	{
		try {
			outstream.write((command+"\r\n").getBytes());
			outstream.flush();
		} catch (IOException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
	}
	public static void runFinish(OutputStream outstream)
	{
		try {
			outstream.flush();
			outstream.close();
		} catch (IOException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
		
	}
}

package com.hdq.tools;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

//import org.apache.poi.hssf.usermodel.HSSFCell;
//import org.apache.poi.hssf.usermodel.HSSFCellStyle;
//import org.apache.poi.hssf.usermodel.HSSFRow;
//import org.apache.poi.hssf.usermodel.HSSFSheet;
//import org.apache.poi.hssf.usermodel.HSSFWorkbook;
//import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
//需新打开页面!!
public class XlsDownload {
	public static XSSFWorkbook titlebaseToExcel(String sheetname,List<String> titles,List<List<String>> info)
	{
		//创建XSSFWorkbook对象
		@SuppressWarnings("resource")
		XSSFWorkbook wb = new XSSFWorkbook();
		//创建XSSFSheet对象
		XSSFSheet sheet = wb.createSheet(sheetname);
		//获取长度

		int firststart=0;
		if(titles!=null&&titles.size()>0)
		{
			//创建XSSFRow对象
			XSSFRow row_title = sheet.createRow(0);
			for(int j=0;j<titles.size();j++)
			{
				row_title.createCell(j).setCellValue(titles.get(j));
			}
			firststart=1;
		}
		int infolen=info.size();

		for(int i=firststart;i<=infolen;i++)
		{
			XSSFRow row = sheet.createRow(i);
			int subinfolen=info.get(i-1).size();
			for(int z=0;z<subinfolen;z++)
			{
				row.createCell(z).setCellValue(info.get(i-1).get(z));
			}
		}
		return wb;

	}


	public static XSSFCellStyle getStyle(XSSFWorkbook wb)
	{
		//      POI设置上下左右居中：
		XSSFCellStyle style = wb.createCellStyle();//设置列样式
		style.setAlignment(HorizontalAlignment.CENTER);// 水平居中  
		style.setVerticalAlignment(VerticalAlignment.CENTER);// 垂直居中
//		style.setBorderBottom(XSSFCellStyle.BORDER_THIN); //下边框
//		style.setBorderLeft(XSSFCellStyle.BORDER_THIN);//左边框
//		style.setBorderTop(XSSFCellStyle.BORDER_THIN);//上边框
//		style.setBorderRight(XSSFCellStyle.BORDER_THIN);//右边框
		style.setBorderBottom(BorderStyle.THIN);
		style.setBorderLeft(BorderStyle.THIN);//左边框
		style.setBorderTop(BorderStyle.THIN);//上边框
		style.setBorderRight(BorderStyle.THIN);//右边框
		return style;
	}

	public static XSSFWorkbook baseToExcel(String sheetname,List<List<String>> info)
	{
		//创建XSSFWorkbook对象
		@SuppressWarnings("resource")
		XSSFWorkbook wb = new XSSFWorkbook();
		//创建XSSFSheet对象
		XSSFSheet sheet = wb.createSheet(sheetname);
		//获取长度


		//		CellRangeAddress  range= new CellRangeAddress(1,2,3,3);
		//		sheet.addMergedRegion(range);
		int firststart=0;
		int infolen=info.size();
		XSSFCellStyle style=getStyle(wb);
		for(int i=firststart;i<infolen;i++)
		{
			XSSFRow row = sheet.createRow(i);
			int subinfolen=info.get(i).size();
			for(int z=0;z<subinfolen;z++)
			{
				XSSFCell titleCell=row.createCell(z);
				titleCell.setCellValue(info.get(i).get(z));
				titleCell.setCellStyle(style);//设置样式
			}
		}


		return wb;

	}
	public static synchronized boolean startDownload(XSSFWorkbook wb,String downfilename,HttpServletResponse response)
	{
		//将生成的excel文件写入到字节流中，供客户端下载
		//输出Excel文件
		OutputStream output=null;
		try {
			output = response.getOutputStream();
			response.reset();
			response.setHeader("Content-disposition", "attachment; filename="+downfilename);
			response.setContentType("application/msexcel;charset=utf-8");        
			wb.write(output);
			output.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * json 转 excel
	 * @param jsonArray
	 * @return
	 * @throws IOException
	 */
	public static  XSSFWorkbook jsonToExcel(JSONArray jsonArray){
		Set<String> keys = null;
		// 创建XSSFWorkbook对象
		XSSFWorkbook wb = new XSSFWorkbook();
		// 创建XSSFSheet对象
		XSSFSheet sheet = wb.createSheet("sheet0");


		int roleNo = 0;
		int rowNo = 0;

		List<JSONObject> jsonObjects = new ArrayList<JSONObject>();
		for(int i=0;i<jsonArray.size();i++)
		{
			jsonObjects.add(jsonArray.getJSONObject(i));
		}
		// 创建XSSFRow对象
		XSSFRow row = sheet.createRow(roleNo++);
		// 创建XSSFCell对象
		//标题
		keys = jsonObjects.get(0).keySet();
		for (String s : keys) {
			XSSFCell cell = row.createCell(rowNo++);
			cell.setCellValue(s);
		}
		rowNo = 0;
		for (JSONObject jsonObject : jsonObjects) {
			row = sheet.createRow(roleNo++);
			for (String s : keys) {
				XSSFCell cell = row.createCell(rowNo++);
				cell.setCellValue(jsonObject.getString(s));
			}
			rowNo = 0;
		}
		return wb;
	}

	/**
	 * bootstrap_json 转 excel
	 * @param jsonArray
	 * @return
	 * @throws IOException
	 */
	@SuppressWarnings("static-access")
	public static synchronized XSSFWorkbook bootstrap_jsonToExcel(JSONArray titles,JSONObject info,String sheetname,String getvalueExp,String path) {
		// 创建XSSFWorkbook对象
		XSSFWorkbook wb =null;
		
		// 创建XSSFSheet对象
		XSSFSheet sheet = null;
		if(path==null)
		{
			wb=new XSSFWorkbook();
			sheet=wb.createSheet(sheetname);
		}
		else
		{
			//先清空Excel表格之前的数据
			try {
				deleteRow(path);
				FileInputStream fs = new FileInputStream(path); // 获取d://test.xls
//				POIFSFileSystem ps = new POIFSFileSystem(fs); // 使用POI提供的方法得到excel的信息
				wb = new XSSFWorkbook(fs);
				sheet = wb.getSheetAt(0); // 获取到工作表，因为一个excel可能有多个工作表
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		XSSFCellStyle style=getStyle(wb);


		int pointcount=0;
		Map<String,Integer> titlemap=new HashMap<String,Integer>();


		int minrow=1;
		int mincol=1;
		if(titles!=null&&titles.size()>0)
		{
			//创建XSSFRow对象
			int firstoffset=0;

			for(int j=0;j<titles.size();j++)
			{
				XSSFRow row_title = sheet.createRow(j);
				JSONArray nowarray=titles.getJSONArray(j);
				int offsetk=1;

				for(int k=0;k<nowarray.size();k++)
				{
					JSONObject jsonObjects=nowarray.getJSONObject(k);
					String szrow=jsonObjects.getString("rowspan");
					if(szrow==null)
						szrow="1";
					String szcol=jsonObjects.getString("colspan");
					if(szcol==null)
						szcol="1";

					String field=jsonObjects.getString("field");
					if(!(field==null||field.equals("")))
					{
						titlemap.put(field, pointcount);
						pointcount++;
					}

					int row=Integer.parseInt(szrow);
					int col=Integer.parseInt(szcol);
					if(row>minrow)
						minrow=row;
					if(col>mincol)
						mincol=col;
					if(firstoffset==0&&col!=1)
						firstoffset=k;
					int nowk=k+offsetk-1;


					if(j==0)
					{
						CellRangeAddress range= null;
						XSSFCell titleCell=row_title.createCell(nowk);
						titleCell.setCellValue(jsonObjects.getString("title"));

						//						System.out.println(nowk+" "+(nowk+col-1));

						range=new CellRangeAddress(j,j+row-1,nowk,nowk+col-1);
						sheet.addMergedRegion(range);

						titleCell.setCellStyle(style);//设置样式
					}
					else
					{

						XSSFCell titleCell=row_title.createCell(k+firstoffset);
						titleCell.setCellValue(jsonObjects.getString("title"));
						titleCell.setCellStyle(style);//设置样式
					}

					//					System.out.println("i:"+k);
					//					System.out.println(jsonObjects);
					//					System.out.println(j+","+(j+row-1));
					//					System.out.println(nowk+","+(nowk+firstoffset));

					offsetk+=col-1;
				}
			}
		}

		ListTools lts=new ListTools();
		StringHandle sh=new StringHandle();
		//id name unit 这个地方得排序下。利用map解决
		JSONArray rowsinfo=info.getJSONArray("rows");
		int pass=-1;
		int countc=0;
		//排序序号
		List<Integer> sortid=new ArrayList<Integer>();
		try {

			JSONObject objtmep=rowsinfo.getJSONObject(0);
			Set<String> coltemp=objtmep.keySet();

			for(String incol:coltemp)
			{
				if(titlemap.get(incol)!=null)
					sortid.add(titlemap.get(incol));
				else pass=countc;
				countc++;
			}
		}
		catch (Exception e)
		{
			return wb;
		}

		int infolen=rowsinfo.size();
		for(int i=minrow;i<infolen+minrow;i++)
		{
			XSSFRow row = sheet.createRow(i);
			JSONObject objs=rowsinfo.getJSONObject(i-minrow);
			Set<String> ks=objs.keySet();
			List<String> values=new ArrayList<String>();
			int initcount=0;
			for(String init:ks)
			{
				if(initcount++==pass)
					continue;

				values.add(objs.getString(init));
			}


			values=lts.sortFromList(values, sortid, false);

			for(int l=0;l<values.size();l++)
			{
				XSSFCell titleCell=row.createCell(l);
				List<String> sear_result=null;
				if(values.get(l)!=null)
					sear_result=sh.getExpString(getvalueExp, values.get(l));
				else {
					sear_result=new ArrayList<String>();
					sear_result.add("-");
				}
				if(sear_result.size()>0)
					titleCell.setCellValue(sear_result.get(0));
				else titleCell.setCellValue(values.get(l));
				titleCell.setCellStyle(style);//设置样式
			}
		}
		return wb;
	}

	// 删除Excel行体验
	public static void deleteRow(String path) throws IOException {
		FileInputStream is = new FileInputStream(path);
		System.out.println(path);
		@SuppressWarnings("resource")
		XSSFWorkbook workbook = new XSSFWorkbook(is);
		XSSFSheet sheet = workbook.getSheetAt(0);

		int lastRowNum = sheet.getLastRowNum();
		int rowTatol = sheet.getLastRowNum()+1;
		System.out.println("该Excel表格中行数：" + rowTatol);
		for (int i = lastRowNum; i >= 0; i--) {
			removeRow(sheet, i);
		}

		FileOutputStream os = new FileOutputStream(path); // 向d://test.xls中写数据
		workbook.write(os);
		is.close();
		os.close();
	}

	// 删除行
	public static void removeRow(XSSFSheet sheet, int rowIndex) {
//		int lastRowNum=sheet.getLastRowNum();  
		if(rowIndex > 0) {
			sheet.shiftRows(rowIndex,rowIndex+1,-1);
			XSSFRow removingRow=sheet.getRow(rowIndex);  
			sheet.removeRow(removingRow);  
		}
	}
	
	public static JSONObject excelToJson(String excelpath) {
		JSONObject jsonObject = new JSONObject();
        try {
            FileInputStream inp = new FileInputStream(excelpath);
            Workbook workbook = WorkbookFactory.create(inp);
            //获取sheet数
            int sheetNum = workbook.getNumberOfSheets();
            
            for (int s = 0; s < sheetNum; s++) {
                // Get the Sheet of s.
                Sheet sheet = workbook.getSheetAt(s);
                //获取最大行数
                int rownum = sheet.getPhysicalNumberOfRows();
                if (rownum <= 1) {
                    continue;
                }
                //获取第一行
                Row row1 = sheet.getRow(0);
                //获取最大列数
                int colnum = row1.getPhysicalNumberOfCells();
                JSONArray jsonArray = new JSONArray();
                for (int i = 1; i < rownum; i++) {
                    Row row = sheet.getRow(i);
                    if (row != null) {
//	                    List<Object> list = new ArrayList<>();
                        JSONObject rowObj = new JSONObject();
                        //循环列
                        for (int j = 0; j < colnum; j++) {
                            Cell cellData = row.getCell(j);
                            if (cellData != null) {
                                //判断cell类型 
                                switch (cellData.getCellType()) {
                                    case Cell.CELL_TYPE_NUMERIC: {
                                        rowObj.put(row1.getCell(j).getStringCellValue(), cellData.getNumericCellValue());
                                        break;
                                    }
                                    case Cell.CELL_TYPE_FORMULA: {
                                        //判断cell是否为日期格式 
                                        if (DateUtil.isCellDateFormatted(cellData)) {
                                            //转换为日期格式YYYY-mm-dd 
                                            rowObj.put(row1.getCell(j).getStringCellValue(), cellData.getDateCellValue());
                                        } else {
                                            //数字 
                                            rowObj.put(row1.getCell(j).getStringCellValue(), cellData.getNumericCellValue());
                                        }
                                        break;
                                    }
                                    case Cell.CELL_TYPE_STRING: {
                                        rowObj.put(row1.getCell(j).getStringCellValue(), cellData.getStringCellValue());
                                        break;
                                    }
                                    default:
                                        rowObj.put(row1.getCell(j).getStringCellValue(), "");
                                }
                            } else {
                                rowObj.put(row1.getCell(j).getStringCellValue(), "");

                            }
                        }
                        jsonArray.add(rowObj);
                    }
                }
               
                jsonObject.put(sheet.getSheetName(), jsonArray);
                
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jsonObject;
	}
	
	
	//  //需打开新窗口，单层array下载
	//  XSSFWorkbook wb=XlsDownload.jsonToExcel(YearBooksService.get_target_cols(years.subList(0, 5), regions.subList(0, 3)).getJSONArray(0));
	//	XlsDownload.startDownload(wb, "111.xls", response);

}

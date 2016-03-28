package codeman.util;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

public class FileUtil {
	protected static Logger logger = Logger.getLogger(FileUtil.class);
	 
/**
 * ******************************************************************************
*
* Method: findFlieTypeByPathName<BR>
* Desc: 			  <BR>
* @param path:文件路径 
* @param name:文件名称
* @return   String:返回文件类型
*
*******************************************************************************
 */
	public static String findFlieTypeByPathName(String path, String name) {
		String type = null;
		File f = new File(path);
		String[] names = f.list();
		for (int i = 0; i < names.length; i++) {
			String nm = names[i];
			String[] nms = nm.split("\\.");
			if (nms.length > 1) {
				if (name.equals(nms[0])) {
					type = nms[1];
					break;
				}
			}
		}
		return type;
	}
	
 
	/*
	 * 上传文件 file上传的文件 path:上传文件的路径 fileName:上传后文件的名称
	 */
 
	public static boolean renameFileName(String path, String newName, String oldName) {
		boolean bln = false;

		File newFile = new File(path + newName);
		File oldFile = new File(path + oldName);
		bln = oldFile.renameTo(newFile);
		return bln;

	}
 
	public static boolean findFlie(String path) {
		boolean bln = true;
		File f = new File(path);
		String[] names = f.list();
		if (names == null || (names != null && names.length == 0)) {
			bln = false;
		}

		return bln;
	}
	public static boolean findFlieByPathName(String pathName) {
		boolean bln = true;
		String[] pns = pathName.split("/");

		String fileName = pns[pns.length - 1];
		String filePath = pns[0];
		for (int i = 1; i < pns.length - 1; i++) {
			filePath = filePath + "/" + pns[i];
		}
		bln = findFlie(filePath, fileName);

		return bln;
	}
	public static boolean findFlie(String path, String fileName) {
		boolean bln = false;
		File f = new File(path);
		String[] names = f.list();
		if (names == null || (names != null && names.length == 0)) {
			bln = false;

		} else {
			for (int i = 0; i < names.length; i++) {

				if (names[i].indexOf(fileName) > -1) {
					bln = true;
					break;
				}
			}
		}

		return bln;
	}
	public static String[] findFlieForString(String path) {

		File f = new File(path);
		String[] names = f.list();

		return names;
	}

	public static boolean deleteFile(String path) {
		boolean bln = false;
		bln = (new File(path)).delete();
		return bln;

	}
	public static boolean deleteFileCN(String path) {
		boolean bln = true;

		String path1 = new String(path);

		File f = new File(path1);
		if (f.exists()) {

			bln = f.delete();
		}

		return bln;
	}
	/*
	 * 删除路径path下同名文件不同类型的文件
	 */
	public static boolean deleteFileCN(String path, String fileName) {
		boolean bln = false;
		int k = 0;

		File f = new File(path);
		String[] names = f.list();
		for (int i = 0; i < names.length; i++) {

			if (names[i].indexOf(fileName, 0) > -1) {
				String path1 = path + names[i];

				boolean bln1 = (new File(path1)).delete();
				if (!bln1) {
					k = k + 1;
				}

			}
		}
		if (k == 0) {
			bln = true;
		}

		return bln;
	}
	public static boolean downFile(HttpServletResponse response, String path) {
		boolean bln = false;
		// 下载指定文公的附件

		BufferedOutputStream bos = null;
		FileInputStream fis = null;
		String[] arrPath = path.split("/");
		String filename = arrPath[arrPath.length - 1];// 文件名称
		StringBuffer sb = new StringBuffer();
		sb.append("attachment; filename=\"");
		sb.append(filename+"\"");
		try {
			if (null != path && filename != null) {
				response.setContentType("application/x-msdownload;charset=utf-8");
				response.setHeader("Content-Disposition", new String(sb.toString().getBytes(), "ISO8859-1"));
				fis = new FileInputStream(path);// 从路径中读取文件流

				bos = new BufferedOutputStream(response.getOutputStream());// 输出流

				byte[] buffer = new byte[1024];
				int n = -1;
				while ((n = fis.read(buffer, 0, 1024)) > -1) {
					bos.write(buffer, 0, n);
				}
				fis.close();
				bos.close();
			}
			bln = true;
		} catch (IOException e) {
			e.printStackTrace();
			bln = false;
			logger.error("UploadFile文件下载出错", e);
		} finally {

			try {
				if (fis != null) {
					fis.close();
				}
				if (bos != null) {
					bos.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bln;
	}
	public static boolean downFile(HttpServletResponse response, String path,String filename) {
		boolean bln = false;

		BufferedOutputStream bos = null;
		FileInputStream fis = null;
		StringBuffer sb = new StringBuffer();
		sb.append("attachment; filename=\"");
		sb.append(filename+"\"");
		try {
			if (null != path && filename != null) {
				response.setContentType("application/x-msdownload;charset=utf-8");
				response.setHeader("Content-Disposition", new String(sb.toString().getBytes(), "ISO8859-1"));
				fis = new FileInputStream(path);// 从路径中读取文件流

				bos = new BufferedOutputStream(response.getOutputStream());// 输出流

				byte[] buffer = new byte[1024];
				int n = -1;
				while ((n = fis.read(buffer, 0, 1024)) > -1) {
					bos.write(buffer, 0, n);
				}
				fis.close();
				bos.close();
			}
			bln = true;
		} catch (IOException e) {
			e.printStackTrace();
			bln = false;
			logger.error("UploadFile文件下载出错", e);
		} finally {

			try {
				if (fis != null) {
					fis.close();
				}
				if (bos != null) {
					bos.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bln;
	}
	public static boolean stringToFile(String path, String s) {
		boolean bln = false;

		try {
			byte[] b = s.getBytes();

			BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(path));

			bos.write(b);
			bos.close();
			bln = true;

		} catch (FileNotFoundException e) {
			logger.error("UploadFile字符转换文件出错", e);
			e.printStackTrace();
			bln = false;
		} catch (IOException e) {
			logger.error("UploadFile字符转换文件出错", e);
			e.printStackTrace();
			bln = false;
		}
		return bln;
	}

	public static void copy(String __strFrom, String __strTo) throws Exception {
		java.io.File oFrom = new java.io.File(__strFrom);
		java.io.File oTo = new java.io.File(__strTo);
		String[] paths = __strTo.split("/");
		String fileName = paths[paths.length - 1];
		String[] pathss = __strTo.split(fileName);
		String path = pathss[0];
		java.io.File filePath = new java.io.File(path);
		if (!filePath.exists()) {// 如果文件存放的路径不存在
			filePath.mkdirs();
		}
		oTo.createNewFile();
		java.io.FileInputStream oFin = new java.io.FileInputStream(oFrom);
		java.io.FileOutputStream oFout = new java.io.FileOutputStream(oTo);
		byte b[] = new byte[2048];
		int len;
		while ((len = oFin.read(b)) != -1) {
			oFout.write(b, 0, len);
		}
		oFin.close();
		oFout.close();
	}
	/**
	 * ******************************************************************************
	*
	* Method: replaceFile<BR>
	* Desc: 	替换文件	  <BR>
	* @param pathFrom ：原文件
	* @param pathTo：新文件
	* @param pattStrTag：搜索标志

	* @param oldStr：原文件要替换的字符
	* @param newStr：要替换的新的字符

	* @throws IOException   void
	*
	*******************************************************************************
	 */
	
	public static void replaceFile(String pathFrom, String pathTo,String pattStrTag, String oldStr, String newStr) throws IOException{
	 
		BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(pathFrom)));
		String line = null; 
		PrintWriter pw = new PrintWriter(new OutputStreamWriter(new FileOutputStream(pathTo)), true); 
		String patt = "(\\<"+pattStrTag.trim()+">)(" + oldStr + ")(\\</"+pattStrTag.trim()+"\\>)";
		Pattern p = Pattern.compile(patt);
		Matcher m;
		StringBuffer sb = null;
		boolean result;
		StringBuffer sbTag = null;
		while ((line = br.readLine()) != null) {
			sb = new StringBuffer(); 
			m = p.matcher(line);
			result = m.find();
			while (result) {
				sbTag = new StringBuffer();
				sbTag.append("<"+pattStrTag.trim()+">");
				sbTag.append(newStr);
				sbTag.append("</"+pattStrTag.trim()+">");
				m.appendReplacement(sb, sbTag.toString());
				result = m.find();
			}
			m.appendTail(sb);
			pw.println(sb);
		}
		pw.flush();
		pw.close(); 
		br.close();
	}
	
	public List findStrFrmFile(String path,String pattStrTag) throws IOException{
		BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(path)));
		String line = null;  
		String patt = "(\\<"+pattStrTag.trim()+">)([^\\[]+)(\\</"+pattStrTag.trim()+"\\>)";
		Pattern p = Pattern.compile(patt);
		Matcher m; 
		boolean result;
		 List list=new ArrayList();
		while ((line = br.readLine()) != null) { 
			m = p.matcher(line);
			result = m.find();
			while (result) {
				System.out.println("m.group(2):"+m.group(2)); //打印字母的

				list.add(m.group(2));
				result = m.find();
			} 
		}  
		br.close();
		return list;
	}
	
}


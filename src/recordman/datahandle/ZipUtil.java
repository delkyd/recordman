package recordman.datahandle;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

public class ZipUtil {
	// 输出日志文件
		private static Logger logger = Logger.getLogger(ZipUtil.class);
		
	/**
	 * Method: zip<BR>
	 * Desc: <BR>
	 * 
	 * @param filePath
	 *        文件绝对路径，不包含后缀
	 * @param filename
	 *        文件名，不包含后缀
	 */
	public static boolean zip(String filePath,String filename) {
        //最大的范围
		final int BUFFER = 2048;
		BufferedInputStream origin = null;
		//文件流
		FileOutputStream dest = null;
		//打包文件输出流
		ZipOutputStream out = null;
		//打包的文件里包含的3种格式
		String[] fileSuffix = { ".cfg", ".dat", ".hdr", ".rev", ".reh"};
		
		
		//打包的成压缩文件的格式
		String zipPathName = filePath + ".zip";
		try {
			dest = new FileOutputStream(zipPathName);
			out = new ZipOutputStream(new BufferedOutputStream(dest));
			out.setEncoding("gbk");
			byte data[] = new byte[BUFFER];
			if (fileSuffix != null && fileSuffix.length > 0) {
				File ft = null;
				for (int i = 0; i < fileSuffix.length; i++) {
					ft = new File( filePath+fileSuffix[i]);

					if (ft.exists()) {
						logger.error("info:"+ft.getPath());
						FileInputStream fi = new FileInputStream(ft);
						origin = new BufferedInputStream(fi, BUFFER);
						ZipEntry entry = new ZipEntry(filename+fileSuffix[i]);
						out.putNextEntry(entry);
						int count;
						while ((count = origin.read(data, 0, BUFFER)) != -1) {
							out.write(data, 0, count);
						}
						origin.close();
					}else{
						ft = new File( filePath+fileSuffix[i].toUpperCase() );
						if (ft.exists()) {
							logger.error("info:"+ft.getPath());
							FileInputStream fi = new FileInputStream(ft);
							origin = new BufferedInputStream(fi, BUFFER);
							ZipEntry entry = new ZipEntry(filename+fileSuffix[i].toUpperCase());
							out.putNextEntry(entry);
							int count;
							while ((count = origin.read(data, 0, BUFFER)) != -1) {
								out.write(data, 0, count);
							}
							origin.close();
						}
					}
					ft = null;
				}
			}
			out.close();
			dest.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.toString());
			try {
				origin.close();
				out.close();
				dest.close();
			} catch (IOException e1) {
				e1.printStackTrace();
			}
			return false;
		}

	}

	/**
	 * Method isNumeric 判断字符串使用有"_" 的特殊标志符,并且"_" 后的字符串是否是数字
	 * 
	 * @param str 传入的数据
	 * @return boolean
	 */
	public static boolean isNumeric(String str) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher isNum = pattern.matcher(str);
		if (!isNum.matches()) {
			return false;
		}
		return true;

	}

}

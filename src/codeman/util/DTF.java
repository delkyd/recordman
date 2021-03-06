package codeman.util;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author lyh
 * 数据类型格式化,DataTypeFormat，简称DTF
 */
public class DTF {
	public static final int ERROR_INT = 0;
	public static final int INVALID_INT = -999999;
	public static final float ERROR_FLOAT = 0;
	public static final float INVALID_FLOAT = -9999.999f;
	public static final float FLOAT_DEVIATION = 0.001f;
	public static String defaultDateFormat = "yyyy-MM-dd HH:mm:ss";
	public static String utcFormat = "yyyy-MM-dd'T'HH:mm:ssZ";
	public static final String defaultFloatFormat = "##.##";
	
	public static boolean isValid(float a){
		return !equalFloat(a, INVALID_FLOAT);
	}
	public static boolean isValid(int a){
		return a-INVALID_INT!=0;
	}
	public static boolean equalFloat(float a, float b){
		if( Math.abs(a-b) < FLOAT_DEVIATION )
			return true;
		return false;
	}
	public static Integer StringToInt( String str ){
		if( str == null || str.isEmpty() ){
			return null;
		}
		try{
			return Integer.parseInt( str.trim() );
		}catch( Exception e ){
			e.printStackTrace();
			return null;
		}
	}
	
	public static Date StringToDate( String str ){
		SimpleDateFormat sdf = new SimpleDateFormat(defaultDateFormat);
		try {
			if( str == null || str.isEmpty() ){
				return null;
			}
			Date date = sdf.parse(str.trim());
			return date;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static Date utcStringToDate( String str ){
		SimpleDateFormat sdf = new SimpleDateFormat(utcFormat);
		try {
			if( str == null || str.isEmpty() ){
				return null;
			}
			int indexPlus = str.indexOf("+");
			String newString;
			if( indexPlus != -1 ){
				String f = str.substring(0, indexPlus);
				String zone = str.substring( indexPlus+1, str.length());
				zone = zone.replaceAll(":", "");
				newString = String.format("%s+%s", f,zone);
			}else{
				newString = str;
			}
			Date date = sdf.parse(newString.trim());
			return date;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static Date StringToDate( String str, String format ){		
		try {
			if( str == null || str.isEmpty() ){
				return null;
			}
			SimpleDateFormat sdf = new SimpleDateFormat(format);
			Date date = sdf.parse(str.trim());
			return date;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static String DateToString( Date date ){
		try{
			return (new SimpleDateFormat( defaultDateFormat)).format(date);
		}catch( Exception e){
			e.printStackTrace();
		}
		return null;
	}
	
	
	public static String DateToString( Date date, String format ){
		try{
			return (new SimpleDateFormat( format)).format(date);
		}catch( Exception e){
			e.printStackTrace();
		}
		return null;
	}
	
	public static Float StringToFloat( String str ){
		try{
			if( str == null || str.isEmpty() ){
				return null;
			}
			return Float.parseFloat(str.trim());
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 得到去除后缀的文件名
	 * @param filename 原文件名
	 * @return 去除后缀的文件名
	 */
	public static String DelFileSuffix( String filename ){
		int nfind = filename.lastIndexOf('.');
		if( nfind < 0 )
			return filename;
		String sNew = filename.substring(0, nfind);
		return sNew;
	}
	
	/**
	 * 将数据库中读取的对象转换为字符串，遇到'null'或是'none'转换为“”
	 * @param e
	 * @return
	 */
	public static String DBobjToString( Object e ){
		if( e== null)
			return "";
		String str = String.valueOf( e );
		if( str == null )
			return "";
		if(  str.equalsIgnoreCase("null") || str.equalsIgnoreCase("none")){
			str = "";
		}
		return str;
	}
	
	public static int DBobjToInt( Object e){
		Integer result = StringToInt( DBobjToString(e));
		if( result == null )
			return ERROR_INT;
		return result;
	}
	
	public static float DBobjToFloat( Object e ){
		Float result = StringToFloat( DBobjToString(e));
		if( result == null )
			return 0.0f;
		return result;
	}
	
	public static String TimeSpan(Date start, Date end){
		try{
			long diff = (end.getTime() - start.getTime());
			return TimeSpan( diff);
		}catch( Exception e){
			e.printStackTrace();
		}
		return null;
	}
	
	public static String TimeSpan( long diffInMS ){
		try{
			if( diffInMS < 0 )
				return "时间错误";
			long diffInSeconds = diffInMS / 1000;

		    long diff[] = new long[] { 0, 0, 0, 0 };
		    /* sec */diff[3] = (diffInSeconds >= 60 ? diffInSeconds % 60 : diffInSeconds);
		    /* min */diff[2] = (diffInSeconds = (diffInSeconds / 60)) >= 60 ? diffInSeconds % 60 : diffInSeconds;
		    /* hours */diff[1] = (diffInSeconds = (diffInSeconds / 60)) >= 24 ? diffInSeconds % 24 : diffInSeconds;
		    /* days */diff[0] = (diffInSeconds = (diffInSeconds / 24));
		    
		    return String.format("%d天%d小时%d分钟%d秒",diff[0],diff[1],diff[2],diff[3]);
		}catch( Exception e){
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 格式化浮点数，保留两位小数
	 * @param fdata
	 * @return
	 */
	public static float FormatFloat(float fdata){
		try{
			return FormatFloat( fdata, defaultFloatFormat );
		}catch( Exception e){
			e.printStackTrace();
			return 0.0f;
		}
	}
	
	public static float FormatFloat(float fdata, String format){
		try{
			DecimalFormat df = new DecimalFormat();
			String style = format;
			df.applyPattern(style);
			return Float.parseFloat( df.format(fdata) );
		}catch( Exception e){
			e.printStackTrace();
			return 0.0f;
		}
	}
	
	public static String SlashDiff(String str){
		String newString = str;
		if( System.getProperty("os.name").toUpperCase().indexOf("WINDOWS") != -1 ){
			newString = newString.replace("/", "\\");
		}else{
			newString = newString.replace("\\", "/");
		}
		return newString;
	}
}

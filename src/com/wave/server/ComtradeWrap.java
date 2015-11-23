package com.wave.server;
 
import java.io.ObjectOutputStream; 
import java.util.List;
import org.apache.log4j.Logger;

public class ComtradeWrap {

	private static Logger logger = Logger.getLogger(ComtradeWrap.class);
	
	/** default constructor */
	public ComtradeWrap() {
 
	}
 
	static {

			try { 
				 System.out.println("java.lib.path is " + System.getProperty("java.library.path")); 
				 System.loadLibrary("JReadComtrade");
			}
			catch(UnsatisfiedLinkError e) 
			{ 
		    logger.error("load JReadComtrade and quickComtrade failed,please check the file path");
		    logger.error("load JReadComtrade quickComtrade path： " + System.getProperty("java.library.path"));
			logger.error(e.toString());
		        
		  }
	}

	/**
	 * ******************************************************************************
	*
	* Method: getComtrade<BR>
	* Desc: 			  <BR>
	* @param path
	* @param objStream   void
	*
	*******************************************************************************
	 */
	 
	public native static int getComtradeWeb(String path, ObjectOutputStream objStream,int dotNum);
		  
	/**
	 * ******************************************************************************
	*
	* Method: getComtrade<BR>
	* Desc: 			  <BR>
	* @param  fpath:cfg文件路径
	* @param cfg:cfg信息
	* @param channelA:模拟量通道
	* @param channelD:开关量通道
	* @return   int
	*
	*******************************************************************************
	 */
	public native static String getComtrade(String fpath, ComtradeCFG cfg,List<ComtradeChannel> channelA,List<ComtradeChannel> channelD); 
	
	/**
	 * ******************************************************************************
	*
	* Method: getComtrade<BR>
	* Desc: 			  <BR>
	* @param fpath
	* @param cfg
	* @param channelA
	* @param channelD
	* @param isFreeXJComtrade:是否释放XJComtrade.dll如果true:释放
	* @return   int
	*
	*******************************************************************************
	 */
	public native static String getComtradeB(String fpath, ComtradeCFG cfg,List<ComtradeChannel> channelA,List<ComtradeChannel> channelD, boolean isFreeXJComtrade); 
	
	 /**
	  * ******************************************************************************
	 *
	 * Method: freeQuickComtrade<BR>
	 * Desc: 	释放	quickComtrade.dll,必须是最后释放	  <BR>   void
	 *
	 *******************************************************************************
	  */
	 public native static void freeQuickComtrade();	
}

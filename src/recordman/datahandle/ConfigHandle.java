package recordman.datahandle;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.Element;
import org.springframework.stereotype.Component;

@Component
public class ConfigHandle {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(ConfigHandle.class);
	private static String ROOTNODE = "/recordman_manager/";
	
	public String getValue(String confPath){
		try{
			if( null == confPath || confPath.isEmpty() ){
				return null;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+confPath;
			Element e = (Element)doc.selectSingleNode(path);
			if( null == e ){
				return null;
			}
			return e.getTextTrim();
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
}

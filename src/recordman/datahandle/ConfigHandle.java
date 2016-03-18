package recordman.datahandle;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.Element;
import org.springframework.stereotype.Component;

import recordman.bean.fileconf;

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
	
	public fileconf getFileConf(){
		try{
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+"record_file_config";
			Element e = (Element)doc.selectSingleNode(path);
			if( null == e ){
				return null;
			}
			fileconf c = new fileconf();
			Element child = e.element("fault_file_save_days");
			if( null != child ){
				c.setFault_path( child.getText() );
			}
			child = e.element("fault_file_save_days");
			if( null != child ){
				c.setFault_days( child.getText() );
			}
			child = e.element("contin_file_save_path");
			if( null != child ){
				c.setContinue_path( child.getText() );
			}
			child = e.element("contin_file_save_days");
			if( null != child ){
				c.setContinue_days( child.getText() );
			}
			return c;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean editFileConf( fileconf c ){
		Document doc = ConfigDao.getInstance().getDocument();
		String path = ROOTNODE+"record_file_config";
		Element e = (Element)doc.selectSingleNode(path);
		if( null == e ){
			e = ConfigDao.getInstance().createXPathElement(path);
		}
		if( null == e ){
			return false;
		}
		
		Element child = e.element("fault_file_save_days");
		if( null == child ){
			child = e.addElement("fault_file_save_days");
		}
		if( null != child ){
			child.setText( c.getFault_path() );
		}
		return true;
	}
}

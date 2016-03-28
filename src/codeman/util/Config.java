package codeman.util;

import java.io.File;
import java.net.URL;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

public class Config {
	private Config(){
		try {
			String p = this.getClass().getResource("").getPath();
			File ft = new File(p+"../../config/app/config.xml");
			SAXReader reader = new SAXReader();
			m_doc = reader.read(ft);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private static Document m_doc = null;
	private static Config m_instance = null;
	
	public static Config getInstance(){
		if( null == m_instance ){
			m_instance = new Config();
		}
		return m_instance;
	}
	
	public String get(String confPath){
		try{
			if( null == m_doc ){
				return null;
			}
			if( null == confPath || confPath.isEmpty() ){
				return null;
			}
			Element e = (Element)m_doc.selectSingleNode(confPath);
			if( null == e ){
				return null;
			}
			return e.getTextTrim();
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}
}

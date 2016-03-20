package recordman.datahandle;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import recordman.bean.sysconstant;

public class ConfigDao {
	// 输出日志文件
		private static Logger logger = Logger.getLogger(XMLDao.class);
		
		private ConfigDao(){
			try {
				SAXReader reader = new SAXReader();
				m_doc = reader.read(new File(sysconstant.CONF_ROOTDIR+sysconstant.MGR_CONF+".xml"));
			} catch (Exception e) {
				e.printStackTrace();
				logger.error(e.toString());
			}
		}
		
		private static ConfigDao m_instance;
		private static Document m_doc = null;
		
		public static ConfigDao getInstance(){
			if( null == m_instance ){
				m_instance = new ConfigDao();
			}
			return m_instance;
		}
		
		public boolean SaveTo(String filepath) {
			try {
				if( null == m_doc )
					return false;
				//创建输出格式  
		        OutputFormat format = OutputFormat.createPrettyPrint(); 
				XMLWriter output = new XMLWriter(new FileWriter(new File(
						filepath)), format);
				output.write(m_doc);
				output.close();
				return true;
			} catch (IOException e) {
				e.printStackTrace();
				logger.error(e.toString());
				return false;
			}
		}
		
		public Document getDocument(){
			return m_doc;
		}
		
		/**
		 * 根据xpath创建元素，目前只支持从根元素到指定元素的全路径.无法创建根节点，所以必须保证根节点存在
		 * @param xpath
		 * @return
		 */
		public Element createXPathElement(String xpath){
			try{
				if( null == m_doc )
					return null;
				String[] eles = xpath.split("/");
				if( eles.length <= 1 )
					return null;
				Element e = null;
				String tmpath = xpath;
				int count = 0;
				while( null == e ){
					int index = tmpath.lastIndexOf('/');
					if( index <= 0 )
						break;
					tmpath = tmpath.substring(0, index);
					e = (Element)m_doc.selectSingleNode(tmpath);
					count++;
					if( e != null )
						break;
					
				}
				if( null == e ){
					return null;
				}
				for( int i = eles.length-count; i < eles.length; i++ ){
					e = e.addElement(eles[i]);
				}
				return e;
			}catch(Exception e){
				e.printStackTrace();
				logger.error(e.toString());
				return null;
			}
		}
		
		/** 删除指定元素的所有子元素
		 * @param e
		 * @return
		 */
		public boolean deleteChildren(Element e){
			try{
				if( null == e )
					return false;
				List children = e.elements();
				for( Object o : children ){
					Element ele = (Element)o;
					deleteChildren(ele);
					e.remove( ele );
				}
				return true;
			}catch(Exception ex){
				ex.printStackTrace();
				logger.error(ex.toString());
				return false;
			}
		}
}

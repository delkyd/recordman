package recordman.datahandle;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

public class XMLDao {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(XMLDao.class);
	
	private XMLDao(){
		try {
			SAXReader reader = new SAXReader();
			m_doc = reader.read(new File("F:/stdown/tmp/deviceConfig.xml"));
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.toString());
		}
	}
	
	private static XMLDao m_instance;
	private static Document m_doc = null;
	
	public static XMLDao getInstance(){
		if( null == m_instance ){
			m_instance = new XMLDao();
		}
		return m_instance;
	}
	
	public boolean SaveTo(String filepath) {
		try {
			if( null == m_doc )
				return false;
			XMLWriter output = new XMLWriter(new FileWriter(new File(
					filepath)));
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
}

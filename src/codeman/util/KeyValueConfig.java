package codeman.util;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class KeyValueConfig extends DefaultHandler {

	private static KeyValueConfig instance;
	public synchronized static KeyValueConfig getInstance() {
		if (instance == null) {
			instance = new KeyValueConfig();
		}
		return instance;
	}

	String namespace = null;// 命名空间
	
	public void startElement(String namespaceURI, String localName, String qName, Attributes atts) {
		if (qName != null && "nodes".equals(qName)) {// 根节点

			if (atts != null) {
				String key = atts.getValue("namespace");//
				if (key != null && !"".equals(key)) {
					namespace = key;
				}
			} else {
				namespace = null;
			}
		}
		if (qName != null && "node".equals(qName)) {
			if (atts != null) {
				String key = atts.getValue("key");
				if (namespace != null && !"".equals(namespace)) {
					key = namespace + "." + atts.getValue("key");
				}
				value.put(key, atts.getValue("value"));
			}
		} else if ("include".equals(qName)) {// 嵌套xml
			String filePath = atts.getValue("file");// 嵌套xml路径，多个xml用,分割
			if (filePath != null && !"".equals(filePath.trim())) {
				String[] paths = filePath.split(",");
				for (String p : paths) {
					try {
						KeyValueConfig.getInstance().parseByPath(p.trim());
					} catch (ParserConfigurationException e) {
						e.printStackTrace();
					} catch (SAXException e) {
						e.printStackTrace();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}

		}
	}

	public void parseByPath(String path) throws ParserConfigurationException, SAXException, IOException {
		SAXParserFactory sf = SAXParserFactory.newInstance();
		SAXParser sp = sf.newSAXParser();

		sp.parse(new InputSource(Thread.currentThread().getContextClassLoader().getResourceAsStream(path)), this);

	}
	public void parseByPath(File file) throws ParserConfigurationException, SAXException, IOException {
		SAXParserFactory sf = SAXParserFactory.newInstance();
		SAXParser sp = sf.newSAXParser();

		sp.parse(file, this);
	}
	private static Properties value = new Properties();
	static {
		try {
			KeyValueConfig.getInstance().parseByPath("config/env_user/baseConfig.xml");//
			
			System.out.println("=======系统配置加载完===========");
			

		} catch (ParserConfigurationException e) {

			e.printStackTrace();
		} catch (SAXException e) {

			e.printStackTrace();
		} catch (IOException e) {

			e.printStackTrace();
		}
	}

	public static String getValue(String key) {
		return value.getProperty(key);
	}

	public static Properties getValue() {
		return value;
	}
}

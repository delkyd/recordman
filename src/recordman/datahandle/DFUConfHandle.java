package recordman.datahandle;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.Element;
import org.springframework.stereotype.Component;

import codeman.util.DTF;
import recordman.bean.devconf;
import recordman.bean.ethernet;

@Component
public class DFUConfHandle {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(DFUConfHandle.class);
	
	public devconf getDevBaseInfo(){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			Element e = (Element)doc.selectSingleNode("/LeyunDevices/Property");
			if( null == e ){
				return null;
			}
			
			devconf dev = new devconf();
			
			dev.setName( e.attributeValue("name"));
			dev.setStation( e.attributeValue("station"));
			dev.setModel( e.attributeValue("type"));
			dev.setVersion( e.attributeValue("version"));
			
			Element child = e.element("Remark");
			if( child != null ){
				dev.setRemark( child.getText() );
			}
			return dev;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return null;
		}
	}
	
	public boolean editBaseinfo(devconf conf){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			Element e = (Element)doc.selectSingleNode("/LeyunDevices/Property");
			if( null == e ){
				e = doc.getRootElement().addElement("Property");
			}
			e.addAttribute("class", "Record");
			e.addAttribute("name", conf.getName());
			e.addAttribute("type", conf.getModel());
			e.addAttribute("station", conf.getStation());
			e.addAttribute("version", conf.getVersion());
			
			Element child = e.element("Remark");
			if( null == child ){
				child = e.addElement("Remark");
			}
			child.setText( conf.getRemark() );
			
			return true;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return false;
		}
	}
	
	public List<ethernet> getNetworkInfo(){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			Element e = (Element)doc.selectSingleNode("/LeyunDevices/Property/Network");
			if( null == e ){
				return null;
			}
			
			List<Element> items = e.elements("Item");
			if( null == items ){
				return null;
			}
			
			List<ethernet> nets = new ArrayList<ethernet>();
			for( Element item : items ){
				ethernet n = new ethernet();
				n.setIndex( DTF.StringToInt(item.attributeValue("index")));
				n.setName( item.attributeValue("name"));
				n.setIp( item.attributeValue("ip"));
				n.setMask( item.attributeValue("mask"));
				n.setGate( item.attributeValue("gate"));
				nets.add(n);
			}
			return nets;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return null;
		}
	}
	
	public ethernet getEthernetInfo(int index){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Property/Network/Item[@index='%d']", index);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return null;
			}
			ethernet n = new ethernet();
			n.setIndex( DTF.StringToInt(e.attributeValue("index")));
			n.setName( e.attributeValue("name"));
			n.setIp( e.attributeValue("ip"));
			n.setMask( e.attributeValue("mask"));
			n.setGate( e.attributeValue("gate"));
			return n;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return null;
		}
	}
	
	public boolean editEthernetInfo( ethernet eth ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Property/Network/Item[@index='%d']", eth.getIndex());
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return false;
			}
			e.addAttribute("index", String.valueOf( eth.getIndex() ));
			e.addAttribute("name", eth.getName());
			e.addAttribute("ip", eth.getIp());
			e.addAttribute("mask", eth.getMask());
			e.addAttribute("gate", eth.getGate());
			return true;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return false;
		}
	}
}

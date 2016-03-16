package recordman.datahandle;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.Element;
import org.springframework.stereotype.Component;

import codeman.util.DTF;
import recordman.bean.channel;
import recordman.bean.devconf;
import recordman.bean.ethernet;
import recordman.bean.module;
import recordman.bean.moduleItem;
import recordman.bean.setting;
import recordman.bean.terminal;

@Component
public class DFUConfHandle {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(DFUConfHandle.class);
	
	public boolean save(){
		try{
			return XMLDao.getInstance().SaveTo("D:/stdown/tmp/deviceConfig-m.xml");
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
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
	
	public terminal getTerminalInfo(int board, int index){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Boards/Board[@pos='%d']/*[@index='%d']", board,index);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return null;
			}
			terminal t = new terminal();
			t.setBoard(board);
			t.setIndex(index);
			t.setKind(e.getName());
			t.setName( e.attributeValue("name"));
			t.setType( e.attributeValue("class"));
			if( terminal.KIND_AI.equals(t.getKind()) ){
				if( null != e.attributeValue("rate")){
					t.setRate( DTF.StringToFloat(e.attributeValue("rate")));
				}
			}else if( terminal.KIND_BI.equals(t.getKind()) ){
				if( null != e.attributeValue("debounce")){
					t.setDebounce( DTF.StringToInt(e.attributeValue("debounce")));
				}
				if( null != e.attributeValue("reverse")){
					t.setReverse( DTF.StringToInt(e.attributeValue("reverse")));
				}
			}
			
			return t;
		}catch(Exception e){
			e.printStackTrace();
			logger.error( e.toString() );
			return null;
		}
	}
	
	public boolean editTerminalInfo( terminal t ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Boards/Board[@pos='%d']/%s[@index='%d']", t.getBoard(),t.getKind(), t.getIndex());
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return false;
			}
			e.addAttribute("name", t.getName());
			e.addAttribute("class", t.getType());
			if( terminal.KIND_AI.equals(t.getKind()) ){
				if( DTF.isValid(t.getRate())){
					e.addAttribute("rate", String.valueOf(t.getRate()));
				}
				
			}else if( terminal.KIND_BI.equals(t.getKind()) ){
				if( DTF.isValid(t.getDebounce())){
					e.addAttribute("debounce", String.valueOf(t.getDebounce()));
				}
				if( DTF.isValid(t.getReverse())){
					e.addAttribute("reverse", String.valueOf(t.getReverse()));
				}
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public channel getChannelInfo( String id ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Channels/*/*[@id='%s']", id);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return null;
			}
			channel c = new channel();
			c.setKind( e.getName() );
			c.setId( e.attributeValue("id"));
			c.setName( e.attributeValue("name"));
			if( channel.KIND_AI.equals(c.getKind()) ){
				c.setUnit( e.attributeValue("unit"));
				c.setRate1( e.attributeValue("rate1"));
				c.setUnit1( e.attributeValue("unit1"));
				c.setRate2( e.attributeValue("rate2"));
				c.setUnit2( e.attributeValue("unit2"));
			}else if( channel.KIND_BI.equals(c.getKind()) ){
				if( null != e.attributeValue("val")){
					c.setVal( DTF.StringToInt(e.attributeValue("val")));
				}
			}
			return c;			
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean editChannelInfo( channel c ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Channels/%ss/%s[@id='%s']", c.getKind(), c.getKind(), c.getId());
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				xpath = String.format("/LeyunDevices/Channels/%ss/%s", c.getKind(), c.getKind());
				e = XMLDao.getInstance().createXPathElement(xpath);
			}
			if( null == e )
				return false;
			e.addAttribute("id", c.getId());
			e.addAttribute("name", c.getName());
			if( channel.KIND_AI.equals(c.getKind()) ){
				e.addAttribute("unit", c.getUnit());
				e.addAttribute("rate1", c.getRate1());
				e.addAttribute("unit1", c.getUnit1());
				e.addAttribute("rate2", c.getRate2());
				e.addAttribute("unit2", c.getUnit2());
			}else if( channel.KIND_BI.equals(c.getKind()) ){
				e.addAttribute("val", String.valueOf(c.getVal()));
			}
			return true;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	/** 根据板块号和端子号取得对应的通道ID
	 * @param board 板卡号
	 * @param index 端子号
	 * @return 通道ID
	 */
	public String getChannelMap( int board, int index){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/ChannelMap/*/Item[@board='%d' and @index='%d']", board, index);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e )
				return null;
			return e.attributeValue("id");
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean editChannelMap(int board, int index, String id){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/ChannelMap/*/Item[@id='%s']", id);
			Element ele = (Element)doc.selectSingleNode(xpath);
			if( ele != null ){
				if( null == ele.getParent() ){
					return false;
				}
				if( ! ele.getParent().remove(ele) ){
					return false;
				}
			}
			xpath = String.format("/LeyunDevices/ChannelMap/*/Item[@board='%d' and @index='%d']", board, index);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				terminal t = getTerminalInfo(board, index);
				if( null == t )
					return false;
				xpath = String.format("/LeyunDevices/ChannelMap/%ss/Item", t.getKind());
				e = XMLDao.getInstance().createXPathElement(xpath);
			}
			if( null == e )
				return false;
			e.addAttribute("id", id);
			e.addAttribute("board", String.valueOf(board));
			e.addAttribute("index", String.valueOf(index));
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public List<module> getModules(String kind){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = "/LeyunDevices/Modules/Module";
			if( null != kind && !kind.isEmpty()){
				xpath = String.format("/LeyunDevices/Modules/Module[@class='%s']", kind);
			}
			List<module> arr = new ArrayList<module>();
			List list = doc.selectNodes(xpath);
			for( Object o : list){
				Element e = (Element)o;
				module m = new module();
				m.setId( e.attributeValue("id"));
				m.setName( e.attributeValue("name"));
				m.setKind( e.attributeValue("class"));
				arr.add( m );
			}
			return arr;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	
	public module getModuleAttr( String id ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Modules/Module[@id='%s']", id);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e )
				return null;
			module m = new module();
			m.setId( e.attributeValue("id"));
			m.setName( e.attributeValue("name"));
			m.setKind( e.attributeValue("class"));
			
			return m;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public module getModuleInfo( String id ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Modules/Module[@id='%s']", id);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e )
				return null;
			module m = new module();
			m.setId( e.attributeValue("id"));
			m.setName( e.attributeValue("name"));
			m.setKind( e.attributeValue("class"));
			Element configs = e.element("Configs");
			if( null != configs ){
				List list = configs.elements("Item");
				for( Object o : list ){
					moduleItem item = new moduleItem();
					Element ele = (Element)o;
					item.setId( ele.attributeValue("id") );
					item.setName( ele.attributeValue("name"));
					item.setKind( ele.attributeValue("class"));
					item.setValType( ele.attributeValue("type"));
					item.setVal( ele.attributeValue("val"));
					item.setType(moduleItem.TYPE_CONF);
					m.configs.add( item );
				}
			}
			Element params = e.element("Params");
			if( null != params ){
				List list = params.elements("Item");
				for( Object o : list ){
					moduleItem item = new moduleItem();
					Element ele = (Element)o;
					item.setId( ele.attributeValue("id") );
					item.setName( ele.attributeValue("name"));
					item.setKind( ele.attributeValue("class"));
					item.setValType( ele.attributeValue("type"));
					item.setVal( ele.attributeValue("val"));
					item.setType(moduleItem.TYPE_PARAM);
					m.params.add( item );
				} 
			}
			return m;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public moduleItem getModuleItem( String moduleId, String itemId ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Modules/Module[@id='%s']/*/Item[@id='%s']", moduleId, itemId);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e )
				return null;
			moduleItem item = new moduleItem();
			Element ele = e;
			item.setId( ele.attributeValue("id") );
			item.setName( ele.attributeValue("name"));
			item.setKind( ele.attributeValue("class"));
			item.setValType( ele.attributeValue("type"));
			item.setVal( ele.attributeValue("val"));
			
			Element parent = e.getParent();
			if( null != parent ){
				item.setType( parent.getName());
			}			
			
			return item;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean editModuleItem( String moduleId, moduleItem item ){
		Document doc = XMLDao.getInstance().getDocument();
		String xpath = String.format("/LeyunDevices/Modules/Module[@id='%s']/%s/Item[@id='%s']", moduleId, item.getType(), item.getId());
		Element e = (Element)doc.selectSingleNode(xpath);
		if( null == e ){
			xpath = String.format("/LeyunDevices/Modules/Module[@id='%s']/%s/Item", moduleId, item.getType());
			e = XMLDao.getInstance().createXPathElement(xpath);
		}
		if( null == e )
			return false;
		e.addAttribute("id", item.getId());
		e.addAttribute("name", item.getName());
		e.addAttribute("class", item.getKind());
		e.addAttribute("type", item.getValType());
		e.addAttribute("val", item.getVal());
		return true;
	}
	
	public boolean editModuleAttribute( module m ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Modules/Module[@id='%s']", m.getId());
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				xpath = "/LeyunDevices/Modules/Module";
				e = XMLDao.getInstance().createXPathElement(xpath);
			}
			if( null == e )
				return false;
			e.addAttribute("id", m.getId());
			e.addAttribute("name", m.getName());
			e.addAttribute("class", m.getKind());
			
			return true;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public boolean editModuleInfo( module m ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Modules/Module[@id='%s']", m.getId());
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				xpath = "/LeyunDevices/Modules/Module";
				e = XMLDao.getInstance().createXPathElement(xpath);
			}
			if( null == e )
				return false;
			e.addAttribute("id", m.getId());
			e.addAttribute("name", m.getName());
			e.addAttribute("class", m.getKind());
			XMLDao.getInstance().deleteChildren(e);
			if( null != m.configs && m.configs.size() > 0 ){
				Element configs = e.addElement("Configs");
				for( moduleItem item : m.configs ){
					Element ele = configs.addElement("Item");
					ele.addAttribute("id", item.getId());
					ele.addAttribute("name", item.getName());
					ele.addAttribute("class", item.getKind());
					ele.addAttribute("type", item.getValType());
					ele.addAttribute("val", item.getVal());
				}
			}
			if( null != m.params && m.params.size() > 0 ){
				Element configs = e.addElement("Params");
				for( moduleItem item : m.params ){
					Element ele = configs.addElement("Item");
					ele.addAttribute("id", item.getId());
					ele.addAttribute("name", item.getName());
					ele.addAttribute("class", item.getKind());
					ele.addAttribute("type", item.getValType());
					ele.addAttribute("val", item.getVal());
				}
			}
			return true;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public boolean deleteModule( String id ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Modules/Module[@id='%s']", id);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return false;
			}

			Element parent = (Element)e.getParent();
			if( null == parent ){
				return false;
			}
			if( !XMLDao.getInstance().deleteChildren(e) ){
				return false;
			}
			if( !parent.remove(e) ){
				return false;
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public boolean deleteModuleItem( String id ){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Modules/Module/*/Item[@id='%s']", id);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return false;
			}

			Element parent = (Element)e.getParent();
			if( null == parent ){
				return false;
			}
			if( !XMLDao.getInstance().deleteChildren(e) ){
				return false;
			}
			if( !parent.remove(e) ){
				return false;
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public List<String> getSettingGroups(){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = "/LeyunDevices/Settings/Group";
			List<String> arr = new ArrayList<String>();
			List list = doc.selectNodes(xpath);
			for( Object o : list){
				Element e = (Element)o;
				arr.add( e.attributeValue("name") );
			}
			return arr;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean existSettingGroup(String id){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']", id);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null != e ){
				return true;
			}
			return false;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public boolean editSettingGroup(String oldName, String newName){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']", oldName);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				xpath = "/LeyunDevices/Settings/Group";
				e = XMLDao.getInstance().createXPathElement(xpath);
			}
			if( null == e ){
				return false;
			}
			e.addAttribute("name", newName);
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public boolean deleteSettingGroup(String group){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']", group);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return false;
			}
			xpath = "/LeyunDevices/Settings";
			Element parent = (Element)e.getParent();
			if( null == parent ){
				return false;
			}
			if( ! XMLDao.getInstance().deleteChildren(e) ){
				return false;
			}
			if( ! parent.remove(e) ){
				return false;
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	private List<setting> getSettings(Element e){
		try{
			if( null == e )
				return null;
			
			List<setting> arr = new ArrayList<setting>();
			List list = e.elements();
			String group = e.attributeValue("name");
			for( Object o : list){
				Element ele = (Element)o;
				setting s = new setting();
				s.setSid( ele.attributeValue("sid"));
				s.setName( ele.attributeValue("name"));
				s.setUnit( ele.attributeValue("unit"));
				s.setType( ele.attributeValue("type"));
				s.setVal( ele.attributeValue("val"));
				s.setMax( ele.attributeValue("max"));
				s.setMin( ele.attributeValue("min"));
				s.setStep( ele.attributeValue("step"));
				s.setRate1( ele.attributeValue("rate1"));
				s.setUnit1( ele.attributeValue("unit1"));
				s.setRate2( ele.attributeValue("rate2"));
				s.setUnit2( ele.attributeValue("unit2"));
				
				s.setGroup(group);
				arr.add(s);
			}
			return arr;
		}catch(Exception ex){
			ex.printStackTrace();
			logger.error(ex.toString());
			return null;
		}
	}
	
	private List<setting> getSettings(){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = "/LeyunDevices/Settings/Group";
			List<setting> arr = new ArrayList<setting>();
			List list = doc.selectNodes(xpath);
			for( Object o : list){
				Element e = (Element)o;
				List<setting> sets = getSettings(e);
				if( null != sets ){
					arr.addAll(sets);
				}				
			}
			return arr;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public List<setting> getSettings(String group){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			
			if( null == group || group.isEmpty() ){
				return getSettings();
			}
			
			String xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']", group);
			
			
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e )
				return null;
			
			return getSettings(e);
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}

	public boolean editSettings(List<setting> sets){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			
			for( setting s : sets ){
				String xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']/Set[@sid='%d']", s.getGroup(), s.getSid());
				Element e = (Element)doc.selectSingleNode(xpath);
				if( null == e ){
					xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']", s.getGroup());
					Element g = (Element)doc.selectSingleNode(xpath);
					if( null == g ){
						if( !editSettingGroup(s.getGroup(), s.getGroup()) ){
							return false;
						}
					}
					xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']/Set", s.getGroup());
					e = XMLDao.getInstance().createXPathElement(xpath);
				}
				if( null == e ){
					return false;
				}
				e.addAttribute("sid", String.valueOf(s.getSid()));
				e.addAttribute("name", s.getName());
				e.addAttribute("unit", s.getUnit());
				e.addAttribute("type", s.getType());
				e.addAttribute("val", s.getVal());
				e.addAttribute("max", s.getMax());
				e.addAttribute("min", s.getMin());
				e.addAttribute("step", s.getStep());
				e.addAttribute("rate1", s.getRate1());
				e.addAttribute("unit1", s.getUnit1());
				e.addAttribute("rate2", s.getRate2());
				e.addAttribute("unit2", s.getUnit2());
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	public boolean editSetting(setting s){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']/Set[@sid='%s']", s.getGroup(), s.getSid());
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']", s.getGroup());
				Element g = (Element)doc.selectSingleNode(xpath);
				if( null == g ){
					if( !editSettingGroup(s.getGroup(), s.getGroup()) ){
						return false;
					}
				}
				xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']/Set", s.getGroup());
				e = XMLDao.getInstance().createXPathElement(xpath);
			}
			if( null == e ){
				return false;
			}
			e.addAttribute("sid", String.valueOf(s.getSid()));
			e.addAttribute("name", s.getName());
			e.addAttribute("unit", s.getUnit());
			e.addAttribute("type", s.getType());
			e.addAttribute("val", s.getVal());
			e.addAttribute("max", s.getMax());
			e.addAttribute("min", s.getMin());
			e.addAttribute("step", s.getStep());
			e.addAttribute("rate1", s.getRate1());
			e.addAttribute("unit1", s.getUnit1());
			e.addAttribute("rate2", s.getRate2());
			e.addAttribute("unit2", s.getUnit2());
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public setting getSetting(String group, String sid){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']/Set[@sid='%s']", group, sid);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return null;
			}
			setting s = new setting();
			s.setSid( e.attributeValue("sid"));
			s.setName( e.attributeValue("name"));
			s.setUnit( e.attributeValue("unit"));
			s.setType( e.attributeValue("type"));
			s.setVal( e.attributeValue("val"));
			s.setMax( e.attributeValue("max"));
			s.setMin( e.attributeValue("min"));
			s.setStep( e.attributeValue("step"));
			s.setRate1( e.attributeValue("rate1"));
			s.setUnit1( e.attributeValue("unit1"));
			s.setRate2( e.attributeValue("rate2"));
			s.setUnit2( e.attributeValue("unit2"));
			
			s.setGroup(e.getParent().attributeValue("name"));
			return s;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean deleteSetting(String group, String sid){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/Settings/Group[@name='%s']/Set[@sid='%s']", group, sid);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return false;
			}
			Element parent = (Element)e.getParent();
			if( null == parent ){
				return false;
			}
			if( !parent.remove(e) ){
				return false;
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public String getSettingMapByParam(String paramId){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/SettingMap/Item[@id='%s']", paramId);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return null;
			}
			return e.attributeValue("sid");
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public String getSettingMapBySid(String sid){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/SettingMap/Item[@sid='%s']", sid);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return null;
			}
			return e.attributeValue("id");
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean editSettingMap(String paramId, String sid){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			String xpath = String.format("/LeyunDevices/SettingMap/Item[@sid='%s']", sid);
			Element ele = (Element)doc.selectSingleNode(xpath);
			if( ele != null ){
				if( null == ele.getParent() ){
					return false;
				}
				if( ! ele.getParent().remove(ele) ){
					return false;
				}
			}
			xpath = String.format("/LeyunDevices/SettingMap/Item[@id='%s']", paramId);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				xpath = "/LeyunDevices/SettingMap/Item";
				e = XMLDao.getInstance().createXPathElement(xpath);
			}
			if( null == e ){
				return false;
			}
			e.addAttribute("id", paramId);
			e.addAttribute("sid", String.valueOf(sid));
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public boolean deleteSettingMap(String paramId, String sid){
		try{
			Document doc = XMLDao.getInstance().getDocument();
			if( null != paramId ){
				String xpath = String.format("/LeyunDevices/SettingMap/Item[@id='%s']", paramId);
				Element e = (Element)doc.selectSingleNode(xpath);
				if( null != e ){
					if( e.getParent() != null ){
						if( ! e.getParent().remove(e) ){
							return false;
						}
					}
				}
			}
			
				String xpath = String.format("/LeyunDevices/SettingMap/Item[@sid='%s']", sid);
				Element e = (Element)doc.selectSingleNode(xpath);
				if( null != e ){
					if( e.getParent() != null ){
						if( ! e.getParent().remove(e) ){
							return false;
						}
					}
				}
			
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public int getMaxSettingId(){
		try{
			int max = 0;
			List<setting> sets = getSettings();
			for( setting s : sets ){
				int id = DTF.StringToInt( s.getSid() );
				if( max < id )
					max = id;
			}
			return max;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return 0;
		}
	}
	
	public boolean createSettingsFromModule(String moduleId){
		try{
			module m = getModuleInfo(moduleId);
			if( null == m )
				return false;
			deleteSettingGroup(m.getName());
			if( !editSettingGroup( m.getName(), m.getName() ) )
				return false;
			int curId = getMaxSettingId();
			for( moduleItem item : m.params){
				curId++;
				setting s = new setting();
				s.setSid(String.valueOf(curId));
				s.setName(item.getName());
				s.setType(item.getValType());
				s.setVal(item.getVal());
				s.setGroup(m.getName());
				if( editSetting(s) ){
					editSettingMap(item.getId(), s.getSid());
				}	
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	
}
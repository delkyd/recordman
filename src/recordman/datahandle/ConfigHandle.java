package recordman.datahandle;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.stereotype.Component;

import codeman.util.Config;
import codeman.util.DTF;
import recordman.bean.ethernet;
import recordman.bean.fileconf;
import recordman.bean.lineparam;
import recordman.bean.logconf;
import recordman.bean.protocol;
import recordman.bean.sysconstant;

@Component
public class ConfigHandle {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(ConfigHandle.class);
	private static String ROOTNODE = "/recordman_manager/";
	
	public boolean save(){
		try{
			if( null == ConfigDao.getInstance()){
				return false;
			}
			return ConfigDao.SaveTo(Config.getInstance().get("Config/conf_tmpdir")
					+ Config.getInstance().get("Config/mgr_conf")
					+".xml");
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public boolean rollback(){
		try{
			if( null == ConfigDao.getInstance()){
				return false;
			}
			return ConfigDao.loadFile(Config.getInstance().get("Config/conf_tmpdir")
					+ Config.getInstance().get("Config/mgr_conf")
					+".xml");
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public boolean rewirte(){
		try{
			if( null == ConfigDao.getInstance()){
				return false;
			}
			if( !ConfigDao.SaveTo(Config.getInstance().get("Config/conf_rootdir")
					+Config.getInstance().get("Config/mgr_conf")+".xml") ){
				return false;
			}
			String filename = Config.getInstance().get("Config/mgr_conf");
			Date now = new Date();
			filename = filename +"-"+ DTF.DateToString(now, "yyyyMMddHHmmss") + ".xml";
			if( !ConfigDao.SaveTo(Config.getInstance().get("Config/conf_hisdir")+filename) ){
				return false;
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public String getValue(String confPath){
		try{
			if( null == ConfigDao.getInstance()){
				return null;
			}
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
			if( null == ConfigDao.getInstance()){
				return null;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+"record_file_config";
			Element e = (Element)doc.selectSingleNode(path);
			if( null == e ){
				return null;
			}
			fileconf c = new fileconf();
			Element child = e.element("fault_file_save_path");
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
		if( null == ConfigDao.getInstance()){
			return false;
		}
		if( null == c ){
			return false;
		}
		Document doc = ConfigDao.getInstance().getDocument();
		String path = ROOTNODE+"record_file_config";
		Element e = (Element)doc.selectSingleNode(path);
		if( null == e ){
			e = ConfigDao.getInstance().createXPathElement(path);
		}
		if( null == e ){
			return false;
		}
		
		Element child = e.element("fault_file_save_path");
		if( null == child ){
			child = e.addElement("fault_file_save_path");
		}
		if( null != child ){
			child.setText( c.getFault_path() );
		}
		
		child = e.element("fault_file_save_days");
		if( null == child ){
			child = e.addElement("fault_file_save_days");
		}
		if( null != child ){
			child.setText( c.getFault_days() );
		}
		
		child = e.element("contin_file_save_path");
		if( null == child ){
			child = e.addElement("contin_file_save_path");
		}
		if( null != child ){
			child.setText( c.getContinue_path() );
		}
		
		child = e.element("contin_file_save_days");
		if( null == child ){
			child = e.addElement("contin_file_save_days");
		}
		if( null != child ){
			child.setText( c.getContinue_days() );
		}
		return true;
	}
	
	public logconf getLogConf(){
		try{
			if( null == ConfigDao.getInstance()){
				return null;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+"system_log_config";
			Element e = (Element)doc.selectSingleNode(path);
			if( null == e ){
				return null;
			}
			logconf c = new logconf();
			Element child = e.element("log_path");
			if( null != child ){
				c.setPath( child.getText() );
			}
			
			child = e.element("log_level");
			if( null != child ){
				c.setLevel( child.getText() );
			}
			
			child = e.element("log_days");
			if( null != child ){
				c.setDays( child.getText() );
			}
			
			return c;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean editLogConf( logconf c){
		try{
			if( null == ConfigDao.getInstance()){
				return false;
			}
			if( null == c ){
				return false;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+"system_log_config";
			Element e = (Element)doc.selectSingleNode(path);
			if( null == e ){
				e = ConfigDao.getInstance().createXPathElement(path);
			}
			if( null == e ){
				return false;
			}
			
			Element child = e.element("log_path");
			if( null == child ){
				child = e.addElement("log_path");
			}
			if( null != child ){
				child.setText( c.getPath() );
			}
			
			child = e.element("log_level");
			if( null == child ){
				child = e.addElement("log_level");
			}
			if( null != child ){
				child.setText( c.getLevel() );
			}
			
			child = e.element("log_days");
			if( null == child ){
				child = e.addElement("log_days");
			}
			if( null != child ){
				child.setText( c.getDays() );
			}
			
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public List<ethernet> getProtocols(){
		try{
			if( null == ConfigDao.getInstance()){
				return null;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+"outward_commu_protocol_config/protocol";
			List<ethernet> arr = new ArrayList<ethernet>();
			List list = doc.selectNodes(path);
			for( Object o : list){
				Element e = (Element)o;
				ethernet p = new ethernet();
				Element child = e.element("id");
				if( null != child ){
					p.setIndex( DTF.StringToInt(child.getText()));
				}
				child = e.element("name");
				if( null != child ){
					p.setProtocol( child.getText() );
				}
				child = e.element("net_card");
				if( null != child ){
					p.setName( child.getText() );
				}
				child = e.element("addr");
				if( null != child ){
					p.setIp( child.getText() );
				}
				child = e.element("net_mask");
				if( null != child ){
					p.setMask( child.getText() );
				}
				child = e.element("port");
				if( null != child ){
					p.setPort( child.getText() );
				}
				child = e.element("gateway");
				if( null != child ){
					p.setGate( child.getText() );
				}
				arr.add(p);
			}
			return arr;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public ethernet getProtocol(int id){
		try{
			if( null == ConfigDao.getInstance()){
				return null;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+String.format("outward_commu_protocol_config/protocol[id='%d']", id);
			Element e = (Element)doc.selectSingleNode(path);
			if( null == e ){
				return null;
			}
			ethernet p = new ethernet();
			Element child = e.element("id");
			if( null != child ){
				p.setIndex( DTF.StringToInt(child.getText()));
			}
			child = e.element("name");
			if( null != child ){
				p.setProtocol( child.getText() );
			}
			child = e.element("net_card");
			if( null != child ){
				p.setName( child.getText() );
			}
			child = e.element("addr");
			if( null != child ){
				p.setIp( child.getText() );
			}
			child = e.element("net_mask");
			if( null != child ){
				p.setMask( child.getText() );
			}
			child = e.element("port");
			if( null != child ){
				p.setPort( child.getText() );
			}
			child = e.element("gateway");
			if( null != child ){
				p.setGate( child.getText() );
			}
			return p;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean editProtocol( ethernet p ){
		try{
			if( null == ConfigDao.getInstance()){
				return false;
			}
			if( null == p ){
				return false;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+String.format("outward_commu_protocol_config/protocol[id='%d']", p.getIndex());
			Element e = (Element)doc.selectSingleNode(path);
			if( null == e ){
				path = ROOTNODE+"outward_commu_protocol_config/protocol";
				e = ConfigDao.getInstance().createXPathElement(path);
			}
			if( null == e ){
				return false;
			}
			
			Element child = e.element("id");
			if( null == child ){
				child = e.addElement("id");
			}
			if( null != child ){
				child.setText( String.valueOf(p.getIndex()) );
			}
			
			child = e.element("name");
			if( null == child ){
				child = e.addElement("name");
			}
			if( null != child ){
				child.setText( p.getProtocol() );
			}
			
			child = e.element("net_card");
			if( null == child ){
				child = e.addElement("net_card");
			}
			if( null != child ){
				child.setText( p.getName() );
			}
			
			child = e.element("addr");
			if( null == child ){
				child = e.addElement("addr");
			}
			if( null != child ){
				child.setText( p.getIp() );
			}
			
			child = e.element("net_mask");
			if( null == child ){
				child = e.addElement("net_mask");
			}
			if( null != child ){
				child.setText( p.getMask() );
			}
			
			child = e.element("port");
			if( null == child ){
				child = e.addElement("port");
			}
			if( null != child ){
				child.setText( p.getPort() );
			}
			
			child = e.element("gateway");
			if( null == child ){
				child = e.addElement("gateway");
			}
			if( null != child ){
				child.setText( p.getGate() );
			}
			return true;
			
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public List<String> getLines(){
		try{
			if( null == ConfigDao.getInstance()){
				return null;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+"line_param/line";
			List<String> arr = new ArrayList<String>();
			List list = doc.selectNodes(path);
			for( Object o : list){
				Element e = (Element)o;
				arr.add( e.attributeValue("name"));
			}
			return arr;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean editLine(String oldName, String newName){
		try{
			if( null == ConfigDao.getInstance()){
				return false;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String xpath = ROOTNODE+String.format("line_param/line[@name='%s']", oldName);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				xpath = ROOTNODE+"line_param/line";
				e = ConfigDao.getInstance().createXPathElement(xpath);
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
	
	public boolean deleteLine(String name){
		try{
			if( null == ConfigDao.getInstance()){
				return false;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String xpath = ROOTNODE+String.format("line_param/line[@name='%s']", name);
			Element e = (Element)doc.selectSingleNode(xpath);
			if( null == e ){
				return false;
			}
			
			Element parent = (Element)e.getParent();
			if( null == parent ){
				return false;
			}
			if( ! ConfigDao.getInstance().deleteChildren(e) ){
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
	
	public lineparam getLineParam(String name){
		try{
			if( null == ConfigDao.getInstance()){
				return null;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+String.format("line_param/line[@name='%s']", name);
			Element e = (Element)doc.selectSingleNode(path);
			if( null == e ){
				return null;
			}
			lineparam p = new lineparam();
			p.setName( e.attributeValue("name") );
			p.setLength( e.attributeValue("length") );
			p.setRatedcurrent( e.attributeValue("rated_current"));
			p.setRatedvoltage( e.attributeValue("rated_voltage"));
			p.setR0( e.attributeValue("zero_r"));
			p.setR1( e.attributeValue("positive_r"));
			p.setR2( e.attributeValue("negative_r"));
			p.setX0( e.attributeValue("zero_x"));
			p.setX1( e.attributeValue("positive_x"));
			p.setX2( e.attributeValue("negative_x"));
			Element child = e.element("IA");
			if( null != child ){
				p.setIa( child.getText() );
			}
			child = e.element("IB");
			if( null != child ){
				p.setIb( child.getText() );
			}
			child = e.element("IC");
			if( null != child ){
				p.setIc( child.getText() );
			}
			child = e.element("I0");
			if( null != child ){
				p.setI0( child.getText() );
			}
			child = e.element("UA");
			if( null != child ){
				p.setUa( child.getText() );
			}
			child = e.element("UB");
			if( null != child ){
				p.setUb( child.getText() );
			}
			child = e.element("UC");
			if( null != child ){
				p.setUc( child.getText() );
			}
			child = e.element("U0");
			if( null != child ){
				p.setU0( child.getText() );
			}
			return p;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public boolean editLineParam( lineparam p ){
		try{
			if( null == ConfigDao.getInstance()){
				return false;
			}
			if( null == p ){
				return false;
			}
			Document doc = ConfigDao.getInstance().getDocument();
			String path = ROOTNODE+String.format("line_param/line[@name='%s']", p.getName());
			Element e = (Element)doc.selectSingleNode(path);
			if( null == e ){
				path = ROOTNODE+"line_param/line";
				e = ConfigDao.getInstance().createXPathElement(path);
			}
			if( null == e ){
				return false;
			}
			e.addAttribute("name", p.getName());
			e.addAttribute("length", p.getLength());
			e.addAttribute("rated_current", p.getRatedcurrent());
			e.addAttribute("rated_voltage", p.getRatedvoltage());
			e.addAttribute("zero_r", p.getR0());
			e.addAttribute("positive_r", p.getR1());
			e.addAttribute("negative_r", p.getR2());
			e.addAttribute("zero_x", p.getX0());
			e.addAttribute("positive_x", p.getX1());
			e.addAttribute("negative_x", p.getX2());
			Element child = e.element("IA");
			if( null == child ){
				child = e.addElement("IA");
			}
			if( null != child ){
				child.setText( p.getIa() );
			}
			
			child = e.element("IB");
			if( null == child ){
				child = e.addElement("IB");
			}
			if( null != child ){
				child.setText( p.getIb() );
			}
			
			child = e.element("IC");
			if( null == child ){
				child = e.addElement("IC");
			}
			if( null != child ){
				child.setText( p.getIc() );
			}
			
			child = e.element("I0");
			if( null == child ){
				child = e.addElement("I0");
			}
			if( null != child ){
				child.setText( p.getI0() );
			}
			
			child = e.element("UA");
			if( null == child ){
				child = e.addElement("UA");
			}
			if( null != child ){
				child.setText( p.getUa() );
			}
			
			child = e.element("UB");
			if( null == child ){
				child = e.addElement("UB");
			}
			if( null != child ){
				child.setText( p.getUb() );
			}
			
			child = e.element("UC");
			if( null == child ){
				child = e.addElement("UC");
			}
			if( null != child ){
				child.setText( p.getUc() );
			}
			
			child = e.element("U0");
			if( null == child ){
				child = e.addElement("U0");
			}
			if( null != child ){
				child.setText( p.getU0() );
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
}

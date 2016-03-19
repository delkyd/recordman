package recordman.bean;

public class protocol {
	private String id=null;
	private String name=null;
	private String netcard=null;
	private String addr=null;
	private String mask=null;
	private String port=null;
	private String gateway=null;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getNetcard() {
		return netcard;
	}
	public void setNetcard(String netcard) {
		this.netcard = netcard;
	}
	public String getAddr() {
		return addr;
	}
	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getMask() {
		return mask;
	}
	public void setMask(String mask) {
		this.mask = mask;
	}
	public String getPort() {
		return port;
	}
	public void setPort(String port) {
		this.port = port;
	}
	public String getGateway() {
		return gateway;
	}
	public void setGateway(String gateway) {
		this.gateway = gateway;
	}
}

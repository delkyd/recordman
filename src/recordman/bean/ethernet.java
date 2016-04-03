package recordman.bean;

import org.springframework.stereotype.Component;

@Component
public class ethernet {
	private int index; //index小于100的属于采集网络，大于100的属于管理板的对外通信网络
	private String name = null;
	private String ip = null;
	private String mask = null;
	private String gate = null;
	private String port = null;
	private String protocol = null;
	
	public String getPort() {
		return port;
	}
	public void setPort(String port) {
		this.port = port;
	}
	public String getProtocol() {
		return protocol;
	}
	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}
	
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getMask() {
		return mask;
	}
	public void setMask(String mask) {
		this.mask = mask;
	}
	public String getGate() {
		return gate;
	}
	public void setGate(String gate) {
		this.gate = gate;
	}
}

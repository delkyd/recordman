package recordman.bean;

import java.util.ArrayList;
import java.util.List;

public class module {
	public final static String KIND_RECSYS="RecSys";
	public final static String KIND_RECBUS="RecBus";
	public final static String KIND_RECLINE="RecLine";
	public final static String KIND_RECSWITCH="RecSwitch";
	public final static String KIND_RECANALOG="RecAnalog";
	
	private String id=null;
	private String name=null;
	private String kind=null;
	
	public List<moduleItem> configs = new ArrayList<moduleItem>();
	public List<moduleItem> params = new ArrayList<moduleItem>();	
	
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
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
}

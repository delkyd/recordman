package recordman.bean;

import org.apache.commons.lang3.StringUtils;

import codeman.util.DTF;

public class channel {
	public final static String KIND_AI="AI";
	public final static String KIND_BI="BI";
	public final static String KIND_BO="BO";
	
	private String id=null;
	private String name=null;
	private String kind=null; //AI、BI、BO
	private String unit=null;
	private String rate1=null;
	private String unit1=null;
	private String rate2=null;
	private String unit2=null;
	private int val=0;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
		if( StringUtils.isEmpty(this.id))
			this.id=null;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
		if( StringUtils.isEmpty(this.name))
			this.name=null;
	}
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
		if( StringUtils.isEmpty(this.kind))
			this.kind=null;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
		if( StringUtils.isEmpty(this.unit))
			this.unit=null;
	}
	public String getRate1() {
		return rate1;
	}
	public void setRate1(String rate1) {
		this.rate1 = rate1;
		if( StringUtils.isEmpty(this.rate1))
			this.rate1=null;
	}
	public String getUnit1() {
		return unit1;
	}
	public void setUnit1(String unit1) {
		this.unit1 = unit1;
		if( StringUtils.isEmpty(this.unit1))
			this.unit1=null;
	}
	public String getRate2() {
		return rate2;
	}
	public void setRate2(String rate2) {
		this.rate2 = rate2;
		if( StringUtils.isEmpty(this.rate2))
			this.rate2=null;
	}
	public String getUnit2() {
		return unit2;
	}
	public void setUnit2(String unit2) {
		this.unit2 = unit2;
		if( StringUtils.isEmpty(this.unit2))
			this.unit2=null;
	}
	public int getVal() {
		return val;
	}
	public void setVal(int val) {
		this.val = val;
	}
	
	
}

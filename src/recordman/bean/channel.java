package recordman.bean;

import codeman.util.DTF;

public class channel {
	public final static String KIND_AI="AI";
	public final static String KIND_BI="BI";
	public final static String KIND_BO="BO";
	
	private String id=null;
	private String name=null;
	private String kind=null; //AI、BI、BO
	private String unit=null;
	private float rate1=DTF.INVALID_FLOAT;
	private String unit1=null;
	private float rate2=DTF.INVALID_FLOAT;
	private String unit2=null;
	private int val=DTF.INVALID_INT;
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
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public float getRate1() {
		return rate1;
	}
	public void setRate1(float rate1) {
		this.rate1 = rate1;
	}
	public String getUnit1() {
		return unit1;
	}
	public void setUnit1(String unit1) {
		this.unit1 = unit1;
	}
	public float getRate2() {
		return rate2;
	}
	public void setRate2(float rate2) {
		this.rate2 = rate2;
	}
	public String getUnit2() {
		return unit2;
	}
	public void setUnit2(String unit2) {
		this.unit2 = unit2;
	}
	public int getVal() {
		return val;
	}
	public void setVal(int val) {
		this.val = val;
	}
	
	
}

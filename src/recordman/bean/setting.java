package recordman.bean;

import codeman.util.DTF;

public class setting {
	public final static String TYPE_BOOL = "Bool";
	public final static String TYPE_FLOAT = "Float";
	public final static String TYPE_INT = "Int";
	public final static String TYPE_UINT = "Uint";
	
	private int sid = -1;
	private String name = null;
	private String unit = null;
	private String type = null;
	private String val = null;
	private float max = DTF.INVALID_FLOAT;
	private float min = DTF.INVALID_FLOAT;
	private float step = DTF.INVALID_FLOAT;
	private float rate1 = DTF.INVALID_FLOAT;
	private String unit1 = null;
	private float rate2 = DTF.INVALID_FLOAT;
	private String unit2 = null;
	private String group = null;
	
	public int getSid() {
		return sid;
	}
	public void setSid(int sid) {
		this.sid = sid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getVal() {
		return val;
	}
	public void setVal(String val) {
		this.val = val;
	}
	public float getMax() {
		return max;
	}
	public void setMax(float max) {
		this.max = max;
	}
	public float getMin() {
		return min;
	}
	public void setMin(float min) {
		this.min = min;
	}
	public float getStep() {
		return step;
	}
	public void setStep(float step) {
		this.step = step;
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
	public String getGroup() {
		return group;
	}
	public void setGroup(String group) {
		this.group = group;
	}
	
	
}

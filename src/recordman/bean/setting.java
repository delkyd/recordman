package recordman.bean;

import org.apache.commons.lang3.StringUtils;

import codeman.util.DTF;

public class setting {
	public final static String TYPE_BOOL = "Bool";
	public final static String TYPE_FLOAT = "Float";
	public final static String TYPE_INT = "Int";
	public final static String TYPE_UINT = "Uint";
	
	private String sid = null;
	private String name = null;
	private String unit = null;
	private String type = null;
	private String val = null;
	private String max = null;
	private String min = null;
	private String step = null;
	private String rate1 = null;
	private String unit1 = null;
	private String rate2 = null;
	private String unit2 = null;
	private String group = null;
	
	public String getSid() {
		return sid;
	}
	public void setSid(String sid) {
		this.sid = sid;
		if( StringUtils.isEmpty(this.sid))
			this.sid=null;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
		if( StringUtils.isEmpty(this.name))
			this.name=null;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
		if( StringUtils.isEmpty(this.unit))
			this.unit=null;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
		if( StringUtils.isEmpty(this.type))
			this.type=null;
	}
	public String getVal() {
		return val;
	}
	public void setVal(String val) {
		this.val = val;
		if( StringUtils.isEmpty(this.val))
			this.val=null;
	}
	public String getMax() {
		return max;
	}
	public void setMax(String max) {
		this.max = max;
		if( StringUtils.isEmpty(this.max))
			this.max=null;
	}
	public String getMin() {
		return min;
	}
	public void setMin(String min) {
		this.min = min;
		if( StringUtils.isEmpty(this.min))
			this.min=null;
	}
	public String getStep() {
		return step;
	}
	public void setStep(String step) {
		this.step = step;
		if( StringUtils.isEmpty(this.step))
			this.step=null;
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
	public String getGroup() {
		return group;
	}
	public void setGroup(String group) {
		this.group = group;
	}
	
	
}

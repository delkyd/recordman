package com.wave.server;

import java.util.List;

public class ComtradeChannel implements java.io.Serializable{
	public ComtradeChannel(){}
	/** @brief 通道索引号 */
	public int nChannelNo;
	/** @brief 通道名称 */
	public String sChannelName;
	/** @brief 相位标识符 */
	public String sPhase;
	/** @brief 被监视的回路元件 */
	public String sCcbm;
	/** @brief 单位 */
	public String sUnit;
	/** @brief 通道增益系数a */
	public float fScale;
	/** @brief 通道偏移量b */
	public float fOffset;
	/** @brief 采样时滞 */
	public float fSkew;
	/** @brief 最小值范围 */
	public int nMinValue;
	/** @brief 最大值范围 */
	public int nMaxValue;
	/** @brief 一次比例因子 */
	public float fPrimary;
	/** @brief 二次比例因子 */
	public float fSecondary;
	/** @brief 一次或二次标识符.P,p,S,s */
	public String sPSType;
	/** @brief 通道正常状态.0/1 */
	public int nStatus;
	///是否显示
	public boolean isShow=true;
    //////////////////////////////////////////////////////////////////////
	public List<int[]> listD;// 开关，int[] 第一个为变位的位置，第2个为值（只有开关量有效）

	public int[] ListA;//模拟 量有效

	public int nChannelType;//取得指定通道的类型1:模拟量0:开关量
	public int nChlTpype=0;//通道的电气类型0-电流 1-电压 2-高频 3-频率 4 跳闸 5 重合闸

	public float MaxValueCh;//取得指定通道的最大值  
	//////////////////////////////////////////////////////////////////////////////
	public float getFOffset() {
		return fOffset;
	}
	public void setFOffset(float offset) {
		fOffset = offset;
	}
	public float getFPrimary() {
		return fPrimary;
	}
	public void setFPrimary(float primary) {
		fPrimary = primary;
	}
	public float getFScale() {
		return fScale;
	}
	public void setFScale(float scale) {
		fScale = scale;
	}
	public float getFSecondary() {
		return fSecondary;
	}
	public void setFSecondary(float secondary) {
		fSecondary = secondary;
	}
	public float getFSkew() {
		return fSkew;
	}
	public void setFSkew(float skew) {
		fSkew = skew;
	}
	public int[] getListA() {
		return ListA;
	}
	public void setListA(int[] listA) {
		ListA = listA;
	}
	public List<int[]> getListD() {
		return listD;
	}
	public void setListD(List<int[]> listD) {
		this.listD = listD;
	}
	public float getMaxValueCh() {
		return MaxValueCh;
	}
	public void setMaxValueCh(float maxValueCh) {
		MaxValueCh = maxValueCh;
	}
	public int getNChannelNo() {
		return nChannelNo;
	}
	public void setNChannelNo(int channelNo) {
		nChannelNo = channelNo;
	}
	public int getNChannelType() {
		return nChannelType;
	}
	public void setNChannelType(int channelType) {
		nChannelType = channelType;
	}
	public int getNMaxValue() {
		return nMaxValue;
	}
	
	public int getNMinValue() {
		return nMinValue;
	}
	public void setNMinValue(int minValue) {
		nMinValue = minValue;
	}
	public int getNStatus() {
		return nStatus;
	}
	public void setNStatus(int status) {
		nStatus = status;
	}
	public String getSCcbm() {
		return sCcbm;
	}
	public void setSCcbm(String ccbm) {
		sCcbm = ccbm;
	}
	public String getSChannelName() {
		return sChannelName;
	}
	public void setSChannelName(String channelName) {
		sChannelName = channelName;
	}
	public String getSPhase() {
		return sPhase;
	}
	public void setSPhase(String phase) {
		sPhase = phase;
	}
	public String getSPSType() {
		return sPSType;
	}
	public void setSPSType(String type) {
		sPSType = type;
	}
	public String getSUnit() {
		return sUnit;
	}
	public void setSUnit(String unit) {
		sUnit = unit;
	}
	
}

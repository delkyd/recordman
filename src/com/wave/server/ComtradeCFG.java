package com.wave.server;

public class ComtradeCFG implements java.io.Serializable{
	public ComtradeCFG(){}
	/** @brief           厂站名*/
	public String sStation;
	/** @brief           装置名*/
	public String sDevice;
	/** @brief           文件标准年份*/
	public int		nYear;
	/** @brief           模拟量通道个数*/
	public int		nAChannels;
	/** @brief           开关量通道个数*/
	public int		nDChannels;
	/** @brief           线路频率*/
	public float	fLineFreq;
	/** @brief           开始采样时间*/
	public String	sStartTime;
	/** @brief           故障触发事件*/
	public String	sTriggerTime;
	/** @brief           数据文件格式。0-ascii, 1-binary*/
	public int		nDATType;
	/** @brief           时标倍乘系数*/
	public float	fTimeMult;
	//////////////////////////////////////////////////////////////
	public float x_time[];//采样点对应的时间
	public float x_time_hz[];//采样点对应的频率
	public int nTotalSamples;//采样点总数
	 
	public int nTriggerTime;//取得故障触发时刻时间
	 
	public float fSampleRate[];//采样频率
	
	public int nSampleRateNums[];//每个采样频率的采样点数
	
	public boolean isFillDrawD=true;//绘制开关量是否填充变位,true:填充,否不填充
	
	
	public float getFLineFreq() {
		return fLineFreq;
	}
	public void setFLineFreq(float lineFreq) {
		fLineFreq = lineFreq;
	}
	public float getFTimeMult() {
		return fTimeMult;
	}
	public void setFTimeMult(float timeMult) {
		fTimeMult = timeMult;
	}
	public int getNAChannels() {
		return nAChannels;
	}
	public void setNAChannels(int channels) {
		nAChannels = channels;
	}
	public int getNDATType() {
		return nDATType;
	}
	public void setNDATType(int type) {
		nDATType = type;
	}
	public int getNDChannels() {
		return nDChannels;
	}
	public void setNDChannels(int channels) {
		nDChannels = channels;
	}
	 
	 
	public int getNTotalSamples() {
		return nTotalSamples;
	}
	public void setNTotalSamples(int totalSamples) {
		nTotalSamples = totalSamples;
	}
	public int getNTriggerTime() {
		return nTriggerTime;
	}
	public void setNTriggerTime(int triggerTime) {
		nTriggerTime = triggerTime;
	}
	public int getNYear() {
		return nYear;
	}
	public void setNYear(int year) {
		nYear = year;
	}
	public String getSDevice() {
		return sDevice;
	}
	public void setSDevice(String device) {
		sDevice = device;
	}
	public String getSStartTime() {
		return sStartTime;
	}
	public void setSStartTime(String startTime) {
		sStartTime = startTime;
	}
	public String getSStation() {
		return sStation;
	}
	public void setSStation(String station) {
		sStation = station;
	}
	public String getSTriggerTime() {
		return sTriggerTime;
	}
	public void setSTriggerTime(String triggerTime) {
		sTriggerTime = triggerTime;
	} 
	////////////////////////////////////////////////////////////
	
	
	
}

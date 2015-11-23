package com.wave.server;
import com.wave.server.ComtradeCFG;
import com.wave.server.ComtradeChannel;

public class WaveData {

	public ComtradeCFG comtrade;// cfg文件信息,及共享信息
	
	public ComtradeChannel Channel;//ComtradeChannel

	public WaveData(ComtradeCFG comtrade) {
		//
		this.comtrade=comtrade;
	}

	// COMTRADE文件版本号：
	// 1：IEEE C37.111-1991(91标准)
	// 2：IEEE C37.111-1999(99标准)
	private boolean m_bForceUseCTPT = false;
	/** 是否强制使用CTPT变比 */
	/** @brief CT变比 */
	private float m_fCTRate = 1;
	/** @brief PT变比 */
	private float m_fPTRate = 1;
	/**  需要显示 一次值    true  是   */
	public String m_bSecondary = "true";
	//最大的值
	public float nMaxValue = 0;
	
	/**
	 * 功能:getListARealValue
	 * 说明:模拟量通道,通道数据处理 指定采样点的实际值. 
	 * @param参数：
	 * @return  float
	 */
	public float[]  getListARealValue() {

	   //处理当未查询到真确的值时候的处理
       if(Channel.getListA()==null){
    	   return new float[0]; 
	    }
         int size= Channel.getListA().length;
        // System.out.println(" Channel.getListA().length : "+size);
		 float fRealValue[]=new float[size];
		 //循环获得相应的一次/二次比 转换后的数据
		 for(int i =0;i<size;i++){
			  
			  float fValue=getRealValue(i); 
			  
			  fRealValue[i]=fValue; 			  
			  //判读 最大值 (一次值)
			  if(fValue>nMaxValue){
				  nMaxValue=fValue;
			  }
		 }
		 return   fRealValue;
	}
	/**
	 * 功能:获取指定通道,指定采样点的实际值. 
	 * 说明:此方法只用于模拟量通道,对于状态通道,不管其状态如何,总是返回0
	 * @param 参数：nSampleNo指定采样点
	 * @return  返回值:采样点的实际值,由"采样值*比例因子+偏移因子"构成
	 */
	public float getRealValue(int nSampleNo) {
		// 指定的通道号或者指定的采样点不存在,总是返回0
		if (nSampleNo > comtrade.nTotalSamples - 1 || nSampleNo < 0)
			return 0.0f;
		// 取得计算值
		float fValue = getFileValue(nSampleNo);// 已经修正y=ax+b
		
		if ("true".equals(m_bSecondary)) { // 要向外提供二 次值
			
			return transformSecondaryValue(fValue);
		} else {
			// 要向外提供一  次值
			return transformPrimaryValue(fValue);
		}
	}
	/**
	 * 函 数 名: GetFileValue() 
	 * 功能概要: 取得由文件直接计算(ax+b)得来的值 
	 * 参数：nSampleNo指定采样点
	 * 返 回 值: 由文件直接计算(ax+b)得来的值
	 **/
	float getFileValue(int nSampleNo) {
		// 指定的通道号或者指定的采样点不存在,总是返回0
		return (float) (Channel.fScale * Channel.ListA[nSampleNo] + Channel.fOffset);
	}

	/**
	 * 功能:1991的一次值方式
	 * 说明:此方法只用于模拟量通道
	 * @param 参数：fValue
	 * @return 返回乘于的变比数据
	 */
	public float transformPrimaryValueVer1991(float fValue) {
		// if (ChannelType[chNo] == 0)
		
		System.out.println("adfad : " +Channel.nChlTpype);
		
		if (0 ==Channel.nChlTpype) {// 电流通道
		// 乘以CT变比
			return fValue * m_fCTRate;
		} else if (Channel.nChlTpype == 1) // 电压通道
		{
			// 乘以PT变比
			return fValue * m_fPTRate;

		} else
			return fValue;
	}
	/**
	 * ******************************************************************************
	 * 
	 * Method: transformPrimaryValue<BR>
	 * Desc: <BR>
	 * 
	 * @param chNo通道号
	 * @param fValue
	 * @return float
	 * 
	 * ******************************************************************************
	 */
	public float transformPrimaryValue(float fValue) {

		// if(m_nVersion == 1991 || m_bForceUseCTPT)
		if (comtrade.nYear == 1991 || m_bForceUseCTPT) {
	       //返回   1991 格式的数据 处理 
			return this.transformPrimaryValueVer1991(fValue);
		} else {// 97或99版本
			// 判断自身的一次变比和二次变比是否有效
			if ((Channel.fPrimary < 0.00000001) || (Channel.fSecondary < 0.00000001)) {
				// 自身变比无效

				if (Channel.nChlTpype == 1) // 电压通道
				{
					// 乘以PT变比
					return fValue * m_fPTRate;
				} else if (Channel.nChlTpype == 0) // 电流通道
				{
					// 乘以CT变比
					return fValue * m_fCTRate;
				} else
					return fValue;
			} else {
				// 自身变比有效
				// if ("s".equals(m_strDType[chNo].trim().toLowerCase())) // 通道记录的是二次值
				if ("s".equals(Channel.sPSType.trim().toLowerCase())) // 通道记录的是二次值
					return (fValue * Channel.fPrimary) / Channel.fSecondary;
				else
					return fValue;
			}
		}

	}

	/**
	 * ******************************************************************************
	 * 
	 * Method: TransformSecondaryValue<BR>
	 * Desc: <BR>
	 * @param fValue
	 * @return float
	 * 
	 * ******************************************************************************
	 */
	public float transformSecondaryValue(float fValue) {

		if (comtrade.nYear == 1991 || m_bForceUseCTPT) {
			// 强制使用CTPT就等于把文件当成91版处理
			// 91版文件，认为ax+b得出的值都是二次值
			return fValue;
		} else { // 97或99版本
			// 判断自身的一次变比和二次变比是否有效
			if ((Channel.fPrimary < 0.00000001) || (Channel.fSecondary < 0.00000001)) {
				// 自身变比无效
				return fValue;
			} else {// 自身变比有效
				if ("p".equals(Channel.sPSType.trim().toLowerCase())) {// 通道记录的是一次值
					return (fValue / Channel.fPrimary) * Channel.fSecondary;
				} else {
					return fValue;
				}
			}
		}
	}

	
	//通道 数据 
	public void setChannel(ComtradeChannel channel) {
		Channel = channel;
	}

	//
	public void setM_bSecondary(String m_bSecondary) {
		this.m_bSecondary = m_bSecondary;
	}
	
}

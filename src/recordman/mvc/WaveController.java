package recordman.mvc;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.fastjson.JSON;
import com.wave.server.ComtradeCFG;
import com.wave.server.ComtradeChannel;
import com.wave.server.ComtradeWrap;
import com.wave.server.WaveData;

import codeman.util.DTF;

@Controller
@RequestMapping("/wave")
public class WaveController {
	private static Logger logger = Logger.getLogger(WaveController.class);
	
	float maxIValue = 0; // 最大电流值，用于设置电流通道的振幅
	float maxUValue = 0; // 最大电压值，用于设置电压通道的振幅
	float maxOtherValue = 0; // 其他通道最大值，用于设置其他通道的振幅
	float maxIValueP = 0; // 最大电流值一次值，用于设置电流通道的振幅
	float maxUValueP = 0; // 最大电压值一次值，用于设置电压通道的振幅
	float maxOtherValueP = 0;// 其他通道最大值一次值，用于设置其他通道的振幅
	
	@RequestMapping("/read")
	public void read(@RequestParam String filepath, 
			@RequestParam(required = false) String useSecondValue, HttpServletResponse response){
		try {

			HashMap<String, Object> JSONMap = new HashMap<String, Object>();
			Map<String, Object> map = GetWaveData(filepath, useSecondValue);
			JSONMap.put("comtrade", map);
			
			response.getWriter().print(JSON.toJSONString(JSONMap));
			// 将对象清空
			map = null;
			JSONMap = null;
			// 开始执行垃圾回收
			System.gc();
			System.runFinalization();
			return;
		} catch (Exception e) {
			// System.gc();
			e.printStackTrace();
			logger.error(e.toString());
		}
	}

	/**
	 * 将 后台读取的 CFG文件 和 DAT文件的参数
	 *  转换 为JSON的 
	 * 格式 处理 HttpServletRequest request
	 */
	public HashMap<String, Object> GetWaveData(String filePath, String useSecondValue) {
		//
		HashMap<String, Object> data = new HashMap<String, Object>();
		try {
			String sAllPath = filePath;
			sAllPath = DTF.SlashDiff(sAllPath);
			String filename = filePath.substring(filePath.lastIndexOf("\\") + 1);
			
			data.put("filename", filename); // 文件名称
			
			ComtradeCFG cfg = new ComtradeCFG();// cfg信息
			List<ComtradeChannel> channelA = new ArrayList<ComtradeChannel>();// 模拟量
			List<ComtradeChannel> channelD = new ArrayList<ComtradeChannel>(); // 开关量
			
			String hdrJson = ComtradeWrap.getComtrade(sAllPath, cfg, channelA,channelD);
			// 釋放dll
			//ComtradeWrap.freeQuickComtrade();
			// 判断后台的处理设置当处理为
			if ( hdrJson==null || hdrJson.equals("error")) {
				data.put("err", 1); // 返回错误信息 处理
				data.put("fileName", filePath);// 文件路径处理
				logger.error("read comtrade file failed:" + sAllPath); // 错误日志数据
				return data;
			}
			float fRates[] = cfg.fSampleRate;// 采样频率
			data.put("achannelCount", cfg.nAChannels);// 模拟量通道数
			data.put("dchannelCount", cfg.nDChannels); // 开关量通道数
			data.put("sampleCount", cfg.nTotalSamples);// 总采样点数
			data.put("sampleOffset", cfg.nTriggerTime); // 采样时间和故障时间的偏差(毫秒),最小为0,小于0的应忽略
			data.put("lineFreq", cfg.fLineFreq); // 线路频率
			// 转换关于时间的处理功能设置
			String sSampletime = DateFormat(cfg.sStartTime, cfg.nYear);
			String sFaulttime = DateFormat(cfg.sTriggerTime, cfg.nYear);
			data.put("sampletime", sSampletime); // 采样开始时间
			data.put("faulttime", sFaulttime); // 故障时间
			data.put("rateCount", fRates.length); // 采用频率数
			List<Map<String, Object>> rates = getRates(cfg); // 频率
			data.put("rates", rates); // 采用频率数
			rates = null;
			data.put("times", cfg.x_time);// 时间值
			data.put("useCommonAmplitude", "false"); // 震幅
			WaveData waveData = new WaveData(cfg);
			// 处理和设置需要显示的一次值 ，还是二次值
			if (!"null".equals(String.valueOf(useSecondValue))) {
				waveData.setM_bSecondary(useSecondValue);
			}
			// 通道信息数据读取
			getChannels(data, channelA, channelD, cfg, waveData);
			// 设置为空
			channelA = null;
			channelD = null;
			cfg = null;
			waveData = null;
			
			data.put("hdr", JSON.parse(hdrJson));

			return data;

		} catch (Exception e) {
			e.printStackTrace();

			logger.error(e.toString());
			return null;
		}
	}

	/**
	 * 读取采样值频率 ComtradeCFG cfg
	 */
	public List<Map<String, Object>> getRates(ComtradeCFG cfg) {
		List<Map<String, Object>> rates = new ArrayList<Map<String, Object>>();
		try {

			HashMap<String, Object> data = null;

			float fRates[] = cfg.fSampleRate;// 采样频率

			int nCounts[] = cfg.nSampleRateNums;// 每个采样频率的采样点数
			if (nCounts.length > 0 && fRates.length > 0
					&& nCounts.length == fRates.length) {
				// 判读 频率和 采样点数
				for (int i = 0; i < fRates.length; i++) {
					data = new HashMap<String, Object>();
					data.put("rate", (int) fRates[i]);// 频率
					data.put("count", nCounts[i]);// 频率
					rates.add(data);
				}
			}
			data = null; // 释放内存

			return rates;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}

	/**
	 * 读取通道数据处理 
	 * HashMap<String, Object> data 
	 * List<ComtradeChannel> channelA 模拟量 数据 
	 * List<ComtradeChannel> channelD 开关量数据
	 */
	public void getChannels(HashMap<String, Object> data,
			List<ComtradeChannel> channelA, List<ComtradeChannel> channelD,
			ComtradeCFG comtrade, WaveData waveData) {
		List<Map<String, Object>> rates = new ArrayList<Map<String, Object>>();
		try {

			List<Map<String, Object>> channelsList = new ArrayList<Map<String, Object>>();

			HashMap<String, Object> channelsMap = null;
			maxIValue = 0; // 最大电流值，用于设置电流通道的振幅
			maxUValue = 0; // 最大电压值，用于设置电压通道的振幅
			maxOtherValue = 0; // 其他通道最大值，用于设置其他通道的振幅
			maxIValueP = 0; // 最大电流值一次值，用于设置电流通道的振幅
			maxUValueP = 0; // 最大电压值一次值，用于设置电压通道的振幅
			maxOtherValueP = 0;// 其他通道最大值一次值，用于设置其他通道的振幅
			// 解析模拟量 数据
			if (channelA != null) {
				//
				for (int i = 0; i < channelA.size(); i++) {
					ComtradeChannel channel = (ComtradeChannel) channelA.get(i);
					channelsMap = new HashMap<String, Object>();
					channelsMap.put("name", channel.sChannelName); // 通道名称
					channelsMap.put("type", "AI"); // 类型--- 模拟量
					channelsMap.put("unit", channel.sUnit); // 单位
					channelsMap.put("phase", channel.sPhase); // 相位标识符
					waveData.setChannel(channel);
					float[] RealValue = waveData.getListARealValue();
					channelsMap.put("data", RealValue); //
					channelsMap.put("max", waveData.nMaxValue); // 最大范围
					channelsList.add(channelsMap);
					// System.out.println("Channel.nChlTpype: "+channel.nChlTpype);
					// System.out.println("单位 处理  : " +channel.sUnit);
					// 获得最大值 方法处理
					getMaxChannelsValue(channel.sUnit, waveData.nMaxValue);
					// 将对象清空
					channel.ListA = null;

				}
			}
			// 解析模拟量 数据
			if (channelD != null) {
				//
				for (int i = 0; i < channelD.size(); i++) {
					ComtradeChannel channel = (ComtradeChannel) channelD.get(i);
					channelsMap = new HashMap<String, Object>();
					channelsMap.put("name", channel.sChannelName); // 通道名称
					channelsMap.put("type", "DI"); // 类型--- 模拟量
					channelsMap.put("data", channel.listD); // 开关量数据
					channelsList.add(channelsMap);
					// 将对象清空
					channel.listD = null;
				}
			}

			// 设置最大电流，电压，其他通道
			data.put("maxIValue", DTF.FormatFloat(maxIValue)); // 最大电流值，用于设置电流通道的振幅
			data.put("maxUValue", DTF.FormatFloat(maxUValue)); // 最大电压值，用于设置电压通道的振幅
			data.put("maxOtherValue", DTF.FormatFloat(maxOtherValue));// 其他通道最大值，用于设置其他通道的振幅
			data.put("maxIValueP", DTF.FormatFloat(maxIValueP));// 最大电流值一次值，用于设置电流通道的振幅
			data.put("maxUValueP", DTF.FormatFloat(maxUValueP)); // 最大电压值一次值，用于设置电压通道的振幅
			data.put("maxOtherValueP", DTF.FormatFloat(maxOtherValueP));// 其他通道最大值一次值，用于设置其他通道的振幅
			data.put("channels", channelsList);// 通道信息
			//
			// 设置 channelsList
			channelsList = null;
			// 开始执行垃圾回收
			System.gc();
			System.runFinalization(); // 立即清理内存

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.toString());
		}
	}

	/**
	 * 读取通道数据处理 int nChlTpype=0;//通道的电气类型0-电流 1-电压 2-高频 3-频率 4 跳闸 5 重合闸 int
	 * nValue 获取 int maxIValue=0; //最大电流值，用于设置电流通道的振幅 int maxUValue=0;
	 * //最大电压值，用于设置电压通道的振幅 int maxOtherValue=0; //其他通道最大值，用于设置其他通道的振幅 int
	 * maxIValueP=0; //最大电流值一次值，用于设置电流通道的振幅 int maxUValueP=0;
	 * //最大电压值一次值，用于设置电压通道的振幅 int maxOtherValueP=0;//其他通道最大值一次值，用于设置其他通道的振幅
	 */
	public void getMaxChannelsValue(String sUnit, float nValue) {

		sUnit = sUnit.trim().toLowerCase();
		System.out.println("sUnit :" + sUnit);
		// 通道的电气类型0-电流 1-电压 2-高频 3-频率 4 跳闸 5 重合闸
		if ("a".equals(sUnit) || "安培".equals(sUnit)) {
			// 电流
			// 判读 最大值
			if (nValue > maxIValue) {
				maxIValue = nValue;
			}

		} else if ("v".equals(sUnit) || "伏特".equals(sUnit)
				|| "kv".equals(sUnit)) {
			// 1-电压
			// 判读 最大值 电压
			if (nValue > maxUValue) {
				maxUValue = nValue;
			}

		} else {
			// 判读 最大值 电压 (其他通道最大)
			if (nValue > maxOtherValue) {
				maxOtherValue = nValue;
			}
		}

	}

	/**
	 * 强制转换 DateFormat 数据 
	 * sTime 字符串数据
	 * nYear 日期格式，包含91，97，99 格式处理
	 */
	public String DateFormat(String sTime, int nYear) {

		try {
			// 去除多余的 空格设置的
			sTime = sTime.replaceAll(" ", "");
			// 判读时间数据
			if (sTime.indexOf(",") != -1) {
				String sYYMMDD = sTime.substring(0, sTime.indexOf(","));
				System.out.println("sYYMMDD " + sYYMMDD);
				String formatType = "MM/dd/yy"; // 91格式
				if (nYear == 1999 || nYear == 1997) {
					// 判断处理 dd/mm/yyyy，hh：mm：ss.ssssss<CR/LF> 97,99格式
					formatType = "dd/MM/yyyy";
				}
				Date DateTime = DTF.StringToDate(sYYMMDD, formatType);
				String DateToString = DTF.DateToString(DateTime, "yyyy-MM-dd");
				return DateToString + " "+ sTime.substring(sTime.indexOf(",") + 1);
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.toString());
		}

		return sTime;
	}

}

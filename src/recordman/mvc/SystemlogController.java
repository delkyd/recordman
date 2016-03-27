package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.DTF;

import com.alibaba.fastjson.JSON;

import recordman.datahandle.LogDataHandle;

@Controller
@RequestMapping("/system/syslog")
public class SystemlogController {
	private static Logger logger = Logger.getLogger(SystemlogController.class);
	
	@RequestMapping("/")
	public String show(HttpServletRequest request){
		return "recordman/syslog";
	}
	
	@Inject 
	LogDataHandle handle;
	
	@RequestMapping(value="/count", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String  getLogsCount(@RequestParam String level, @RequestParam("startDate") String startDate, 
			@RequestParam("endDate") String endDate, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("count", handle.getLogsCount(level, DTF.utcStringToDate(startDate), DTF.utcStringToDate(endDate)));
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/logs", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String  getLogs(@RequestParam String level, @RequestParam("startDate") String startDate, 
			@RequestParam("endDate") String endDate, @RequestParam int numPrePage, @RequestParam int curpage,
			HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("logs", handle.findLogs(level, DTF.utcStringToDate(startDate), DTF.utcStringToDate(endDate), curpage, numPrePage));
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
}

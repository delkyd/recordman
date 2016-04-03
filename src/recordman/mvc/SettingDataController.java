package recordman.mvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import recordman.bean.logmsg;
import recordman.bean.setting;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/dataloader/settings")
public class SettingDataController {
	private static Logger logger = Logger.getLogger(SettingDataController.class);
	@Inject
	DFUConfHandle handle;
	
	@RequestMapping(value="/stgroups", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getStgroupList(HttpServletRequest request){
		try{
			List<String> gs = handle.getSettingGroups();
			if( null == gs || gs.size() == 0){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少定值组信息"), 
						request);
			}
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("stgroups", gs);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/findgroup", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String findStGroup(@RequestParam String group){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("result", handle.existSettingGroup(group));
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/settings", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getSettingList(@RequestParam String group, HttpServletRequest request){
		try{
			List<setting> ss = handle.getSettings(group);
			if( null == ss || ss.size() == 0){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("定值组[%s]中缺少定值配置", group), 
						request);
			}
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("settings", ss);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/getsetting", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getSetting(@RequestParam String group, @RequestParam String sid, HttpServletRequest request){
		try{
			setting s = handle.getSetting(group, sid);
			if( null == s ){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少定值组[%s]中定值[%s]的配置", group, sid), 
						request);
			}
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("setting", s);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
}

package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.DTF;

import com.alibaba.fastjson.JSON;

import recordman.bean.errorcode;
import recordman.bean.setting;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/devparam/settings")
public class SettingsController {
	private static Logger logger = Logger.getLogger(SettingsController.class);
	@Inject
	DFUConfHandle handle;
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/settings";
	}
	
	@RequestMapping(value="/stgroups", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getStgroupList(){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("stgroups", handle.getSettingGroups());
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/deletestgroup", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteStgroup(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteSettingGroup(id);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
				}
			}else{
				reason = errorcode.update;
			}
			finalMap.put("result", rs);
			finalMap.put("reason", reason);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/editstgroup", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String editStgroup(@RequestParam String oldId, @RequestParam String newId){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editSettingGroup(oldId, newId);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
				}
			}else{
				reason = errorcode.update;
			}
			finalMap.put("result", rs);
			finalMap.put("reason", reason);
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
	public String getSettingList(@RequestParam String group){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("settings", handle.getSettings(group));
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
	public String getSetting(@RequestParam String group, @RequestParam String sid){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("setting", handle.getSetting(group, sid));
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/deletesetting", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteSetting(@RequestParam String group, @RequestParam String sid){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteSetting(group, sid);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
				}
			}else{
				reason = errorcode.update;
			}
			finalMap.put("result", rs);
			finalMap.put("reason", reason);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/editsetting", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String editSetting(@ModelAttribute setting s){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editSetting(s);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
				}
			}else{
				reason = errorcode.update;
			}
			finalMap.put("result", rs);
			finalMap.put("reason", reason);
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

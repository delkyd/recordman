package recordman.mvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.DTF;

import com.alibaba.fastjson.JSON;

import recordman.bean.errorcode;
import recordman.bean.logmsg;
import recordman.bean.setting;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/mgrparam/settings")
public class SettingsController {
	private static Logger logger = Logger.getLogger(SettingsController.class);
	@Inject
	DFUConfHandle handle;
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/settings";
	}
	
	@RequestMapping(value="/deletestgroup", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteStgroup(@RequestParam String id, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteSettingGroup(id);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("删除定值组[%s]失败", id), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_WARNING, 
							String.format("删除定值组[%s]成功", id), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("删除定值组[%s]失败", id), 
						request);
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
	public String editStgroup(@RequestParam String oldId, @RequestParam String newId, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editSettingGroup(oldId, newId);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存定值组[%s]信息失败", newId), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新定值组[%s]信息成功", newId), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新定值组[%s]信息失败", newId), 
						request);
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
	
	@RequestMapping(value="/deletesetting", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteSetting(@RequestParam String group, @RequestParam String sid, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteSetting(group, sid);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("删除定值组[%s]中定值[%s]的配置失败", group, sid), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_WARNING, 
							String.format("删除定值组[%s]中定值[%s]的配置成功", group, sid), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("删除定值组[%s]中定值[%s]的配置失败", group, sid), 
						request);
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
	public String editSetting(@ModelAttribute setting s, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editSetting(s);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("更新定值组[%s]中定值[%s]的配置失败", null==s?"":s.getGroup(), null==s?"":s.getName()), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新定值组[%s]中定值[%s]的配置成功", null==s?"":s.getGroup(), null==s?"":s.getName()), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新定值组[%s]中定值[%s]的配置失败", null==s?"":s.getGroup(), null==s?"":s.getName()), 
						request);
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

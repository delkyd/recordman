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

import com.alibaba.fastjson.JSON;

import recordman.bean.devconf;
import recordman.bean.errorcode;
import recordman.bean.logmsg;
import recordman.bean.module;
import recordman.bean.moduleItem;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.ConfigHandle;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/mgrparam/modules")
public class ModulesController {
	private static Logger logger = Logger.getLogger(ModulesController.class);
	@Inject
	DFUConfHandle handle;
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/modules";
	}
	
	@RequestMapping(value="/modulelist", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getModuleList(@RequestParam String kind, HttpServletRequest request){
		try{
			List<module> ms = handle.getModules(kind);
			if( null == ms || ms.size() == 0){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少[%s]类型的功能模块", kind), 
						request);
			}
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("modulelist", ms);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/moduleitems", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getModuleItems(@RequestParam String id, HttpServletRequest request){
		try{
			module m = handle.getModuleInfo(id);
			if( null == m ){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少功能模块[%s]的配置信息", id), 
						request);
			}
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("moduleitems", m);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/moduleattr", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getModuleAttribute(@RequestParam String id, HttpServletRequest request){
		try{
			module m = handle.getModuleAttr(id);
			if( null == m ){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少功能模块[%s]的属性信息", id), 
						request);
			}
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("module", m);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/editmoduleattr", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String editModuleAttribute(@ModelAttribute module m, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editModuleAttribute(m);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存功能模块[%s]的属性信息失败", null==m?"":m.getId()), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新功能模块[%s]的属性信息成功", null==m?"":m.getId()), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新功能模块[%s]的属性信息失败", null==m?"":m.getId()), 
						request);
			}
			if( false == rs ){
				handle.rollback();
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
	
	@RequestMapping(value="/deletemodule", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteModule(@RequestParam String id, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteModule(id);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("删除功能模块[%s]失败", id), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_WARNING, 
							String.format("删除功能模块[%s]成功", id), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("删除功能模块[%s]失败", id), 
						request);
			}
			if( false == rs ){
				handle.rollback();
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
	
	@RequestMapping(value="/moduleitem", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getModuleItem(@RequestParam String moduleId, @RequestParam String id, HttpServletRequest request){
		try{
			moduleItem item = handle.getModuleItem(moduleId, id);
			if( null == item ){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少功能模块[%s]的参数[%s]的配置信息", moduleId, id), 
						request);
			}
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("moduleItem", item);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/editmoduleitem", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String editModuleItem(@RequestParam String moduleId, @ModelAttribute moduleItem m, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editModuleItem(moduleId, m);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存功能模块[%s]的参数[%s]的配置信息失败", moduleId, null==m?"":m.getId()), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新功能模块[%s]的参数[%s]的配置信息成功", moduleId, null==m?"":m.getId()), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新功能模块[%s]的参数[%s]的配置信息失败", moduleId, null==m?"":m.getId()), 
						request);
			}
			if( false == rs ){
				handle.rollback();
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
	
	@RequestMapping(value="/deletemoduleitem", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteModuleItem(@RequestParam String id, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteModuleItem(id);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("删除功能模块参数[%s]的配置信息失败", id), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_WARNING, 
							String.format("删除功能模块参数[%s]的配置信息失败", id), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("删除功能模块参数[%s]的配置信息失败", id), 
						request);
			}
			if( false == rs ){
				handle.rollback();
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
	
	@RequestMapping(value="/craetesettings", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String createSettings(@RequestParam String id, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.createSettingsFromModule(id);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存根据功能模块[%s]的参数配置创建的定值信息失败", id), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("根据功能模块[%s]的参数配置创建定值成功", id), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("根据功能模块[%s]的参数配置创建定值失败", id), 
						request);
			}
			if( false == rs ){
				handle.rollback();
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
	
	@Inject
	ConfigHandle mgrHandle;
	
	@RequestMapping(value="/craeteline", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String createLine(@RequestParam String id, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.createLineparamFromModule(id);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !mgrHandle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存根据功能模块[%s]的参数配置创建的线路信息失败", id), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("根据功能模块[%s]的参数配置创建的线路信息成功", id), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("根据功能模块[%s]的参数配置创建的线路信息失败", id), 
						request);
			}
			if( false == rs ){
				handle.rollback();
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

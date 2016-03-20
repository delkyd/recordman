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

import com.alibaba.fastjson.JSON;

import recordman.bean.devconf;
import recordman.bean.errorcode;
import recordman.bean.module;
import recordman.bean.moduleItem;
import recordman.datahandle.ConfigHandle;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/devparam/modules")
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
	public String getModuleList(@RequestParam String kind){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("modulelist", handle.getModules(kind));
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
	public String getModuleItems(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("moduleitems", handle.getModuleInfo(id));
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
	public String getModuleAttribute(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("module", handle.getModuleAttr(id));
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
	public String editModuleAttribute(@ModelAttribute module m){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editModuleAttribute(m);
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
	
	@RequestMapping(value="/deletemodule", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteModule(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteModule(id);
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
	
	@RequestMapping(value="/moduleitem", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getModuleItem(@RequestParam String moduleId, @RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("moduleItem", handle.getModuleItem(moduleId, id));
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
	public String editModuleItem(@RequestParam String moduleId, @ModelAttribute moduleItem m){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editModuleItem(moduleId, m);
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
	
	@RequestMapping(value="/deletemoduleitem", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteModuleItem(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteModuleItem(id);
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
	
	@RequestMapping(value="/craetesettings", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String createSettings(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.createSettingsFromModule(id);
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
	
	@Inject
	ConfigHandle mgrHandle;
	
	@RequestMapping(value="/craeteline", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String createLine(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.createLineparamFromModule(id);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !mgrHandle.save() ){
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

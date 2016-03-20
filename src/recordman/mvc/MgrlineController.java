package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import recordman.bean.errorcode;
import recordman.bean.lineparam;
import recordman.datahandle.ConfigHandle;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/mgrparam/line")
public class MgrlineController {
	private static Logger logger = Logger.getLogger(MgrlineController.class);
	@Inject
	ConfigHandle handle;
	@Inject
	DFUConfHandle dfuHandle;
	
	@RequestMapping(value="/")
	public String show(Model model){
		model.addAttribute("currentchannels", dfuHandle.getAIChannels("A"));
		model.addAttribute("voltagechannels", dfuHandle.getAIChannels("V"));
		return "recordman/mgrline";
	}
	
	@RequestMapping(value="/lines", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getLineList(){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("lines", handle.getLines());
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/findline", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String findline(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("result", handle.getLineParam(id) != null );
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/editline", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String editLine(@RequestParam String oldId, @RequestParam String newId){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editLine(oldId, newId);
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
	
	@RequestMapping(value="/deleteline", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteLine(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteLine(id);
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
	
	@RequestMapping(value="/lineparam", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getLineParam(@RequestParam String id){
		try{
			String finalJSON = JSON.toJSONString(handle.getLineParam(id));
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/editlineparam", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String editLineParam(@ModelAttribute lineparam p){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editLineParam(p);
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

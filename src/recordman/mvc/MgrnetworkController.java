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
import recordman.bean.protocol;
import recordman.datahandle.ConfigHandle;

@Controller
@RequestMapping("/mgrparam/network")
public class MgrnetworkController {
	private static Logger logger = Logger.getLogger(MgrnetworkController.class);
	@Inject
	ConfigHandle handle;
	
	@RequestMapping(value="/")
	public String show(Model model){
		model.addAttribute("protocols", handle.getProtocols());
		return "recordman/mgrnetwork";
	}
	
	@RequestMapping(value="/find", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getDetail( @RequestParam String id ){
		try{
			String finalJSON = JSON.toJSONString(handle.getProtocol(id));
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/update", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String update(@ModelAttribute protocol p){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editProtocol(p);
			finalMap.put("result", rs);
			if( false == rs ){
				finalMap.put("reason", errorcode.update);
			}else{
				if( !handle.save() ){
					rs = false;
					finalMap.put("reason", errorcode.savetofile);
				}else{
					finalMap.put("reason", errorcode.noerror);
				}
			}
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

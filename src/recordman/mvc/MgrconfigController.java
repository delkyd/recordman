package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import codeman.util.FormObj;
import recordman.bean.errorcode;
import recordman.bean.fileconf;
import recordman.bean.logconf;
import recordman.datahandle.ConfigHandle;

@Controller
@RequestMapping("/mgrparam/mgrconfig")
public class MgrconfigController {
	private static Logger logger = Logger.getLogger(MgrconfigController.class);
	@Inject
	ConfigHandle handle;
	@RequestMapping(value="/")
	public String show(Model model){
		model.addAttribute("fileconf", handle.getFileConf());
		model.addAttribute("logconf", handle.getLogConf());
		return "recordman/mgrconfig";
	}
	
	@RequestMapping(value="/update", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String edit(@FormObj fileconf fc, @FormObj logconf lc){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean frs = handle.editFileConf(fc);
			boolean lrs = handle.editLogConf(lc);
			boolean rs = frs&&lrs;
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

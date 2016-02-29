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
import recordman.bean.ethernet;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/devparam/network")
public class NetworkController {
	private static Logger logger = Logger.getLogger(DevconfigController.class);
	
	@Inject
	DFUConfHandle handle;

	@RequestMapping(value="/")
	public String show(Model model){
		model.addAttribute("ethernets", handle.getNetworkInfo());
		return "recordman/network";
	}
	
	@RequestMapping(value="/find", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getDetail(@RequestParam int index){
		try{
			String finalJSON = JSON.toJSONString(handle.getEthernetInfo(index));
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
	public String update(@ModelAttribute ethernet eth){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editEthernetInfo(eth);
			finalMap.put("result", rs);
			if( false == rs ){
				finalMap.put("reason", errorcode.savetofile);
			}else{
				handle.save();
				finalMap.put("reason", errorcode.noerror);
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

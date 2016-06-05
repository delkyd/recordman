package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.DTF;

import com.alibaba.fastjson.JSON;

import recordman.datahandle.ProcessDataHandle;

@Controller
@RequestMapping("/system/sysprocess")
public class SystemprocessController {
private static Logger logger = Logger.getLogger(SystemprocessController.class);
	
	@Inject
	ProcessDataHandle handle;
	
	@RequestMapping("/")
	public String show(HttpServletRequest request){
		return "recordman/sysprocess";
	}
	
	@RequestMapping(value="/curstatus", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String  getCurStatus(HttpServletRequest request){
		try{
			String finalJSON = JSON.toJSONString(handle.getCurStatus());
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
}

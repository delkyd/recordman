package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.fastjson.JSON;

import recordman.datahandle.RunstatusDataHandle;

@Controller
@RequestMapping("/runview/runstatus")
public class RunstatusController {
	private static Logger logger = Logger.getLogger(RunstatusController.class);
	
	@Inject
	private RunstatusDataHandle handle;
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/runstatus";
	}
	
	@RequestMapping(value="/all")
	public void getRunstatus(HttpServletResponse response){
		try{
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("runstatus", handle.findAll());
			String finalJSON = JSON.toJSONString(map);
			logger.info(finalJSON);
			response.getWriter().write(finalJSON);
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
		}
	}
}

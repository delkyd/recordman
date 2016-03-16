package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import recordman.bean.errorcode;
import recordman.datahandle.CommandMgr;

@Controller
@RequestMapping("/devparam/dfuapply")
public class ApplyDfuConfController {
	private static Logger logger = Logger.getLogger(ApplyDfuConfController.class);
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/applydfu";
	}
	
	@RequestMapping(value="/apply", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String apply(){
		try{
			Map<String, Object> cmdMap = new HashMap<String, Object>();
			cmdMap.put("COMMAND_ID", 20060);
			cmdMap.put("FILE_DIR", "/var/recordman/dfu/");
			cmdMap.put("FILE_NAME", "dfuconfig.xml");
			long rri = CommandMgr.getInstance().SendCommand(JSON.toJSONString(cmdMap));
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = rri>0;
			finalMap.put("result", rs);
			if( rs ){
				finalMap.put("RRI", rri);
			}else{
				finalMap.put("reason", errorcode.sendmsg);
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

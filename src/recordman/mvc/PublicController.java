package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import recordman.bean.command;
import recordman.datahandle.CommandMgr;

@Controller
@RequestMapping("/public")
public class PublicController {
	private static Logger logger = Logger.getLogger(PublicController.class);
	
	@RequestMapping(value="/commandresult", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getCommandresult(@RequestParam long rri){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			CommandMgr cg = CommandMgr.getInstance();
			int state = cg.getCommandState(rri);
			finalMap.put("state", state);
			if( command.STATE_FINISHED == state ){
				int result = cg.getCommandResult(rri);
				finalMap.put("result", result);
				if( command.RESULT_OK == result ){
					finalMap.put("response", JSON.parse(cg.getCommandResponse(rri)));
				}
				cg.removeCommand(rri);
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

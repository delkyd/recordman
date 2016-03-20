package recordman.mvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import recordman.bean.command;
import recordman.bean.errorcode;
import recordman.bean.sysconstant;
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
	
	@RequestMapping(value="/applymgrconf", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String apply(@RequestParam("changes[]") List<String> changes){
		try{
			Map<String, Object> cmdMap = new HashMap<String, Object>();
			cmdMap.put("command_id", sysconstant.CMD_APPLYMGR);
			cmdMap.put("file_dir", sysconstant.CONF_TMPDIR);
			cmdMap.put("file_name", sysconstant.MGR_CONF+".xml");
			cmdMap.put("changes", changes);
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
	
	@RequestMapping(value="/applytime", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String applytime(@RequestParam long second,  @RequestParam long nanosecond, 
			@RequestParam long time_zone){
		try{
			Map<String, Object> cmdMap = new HashMap<String, Object>();
			cmdMap.put("command_id", sysconstant.CMD_APPLYTIME);
			cmdMap.put("cur_second", second);
			cmdMap.put("cur_nanosecond", nanosecond);
			cmdMap.put("time_zone", time_zone);
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

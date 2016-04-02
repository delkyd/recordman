package recordman.mvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.Config;

import com.alibaba.fastjson.JSON;

import recordman.bean.command;
import recordman.bean.errorcode;
import recordman.bean.logmsg;
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
	
	@RequestMapping(value="/applydfuconf", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String apply( HttpServletRequest request){
		try{
			Map<String, Object> cmdMap = new HashMap<String, Object>();
			cmdMap.put("command_id", sysconstant.CMD_APPLYDFU);
			cmdMap.put("file_dir", Config.getInstance().get("Config/conf_tmpdir"));
			cmdMap.put("file_name", Config.getInstance().get("Config/dfu_conf")+".xml");
			long rri = CommandMgr.getInstance().sendCommand(JSON.toJSONString(cmdMap));
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = rri>0;
			finalMap.put("result", rs);
			if( rs ){
				finalMap.put("RRI", rri);
				CommandMgr.getInstance().sendLog(logmsg.LOG_INFO, "发送下装通信板配置命令成功", request);
			}else{
				finalMap.put("reason", errorcode.sendmsg);
				CommandMgr.getInstance().sendLog(logmsg.LOG_ERROR, "发送下装通信板配置命令失败", request);
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
	public String apply(@RequestParam("changes[]") List<String> changes, HttpServletRequest request){
		try{
			Map<String, Object> cmdMap = new HashMap<String, Object>();
			cmdMap.put("command_id", sysconstant.CMD_APPLYMGR);
			cmdMap.put("file_dir", Config.getInstance().get("Config/conf_tmpdir"));
			cmdMap.put("file_name", Config.getInstance().get("Config/mgr_conf")+".xml");
			cmdMap.put("changes", changes);
			
			boolean rs = CommandMgr.getInstance().publishMessage(JSON.toJSONString(cmdMap));
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("result", rs);
			if( rs ){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_INFO, 
						String.format("发布更新管理板卡[%s]配置命令成功", changes.toString()), 
						request);
			}else{
				finalMap.put("reason", errorcode.sendmsg);
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("发布更新管理板卡[%s]配置命令失败", changes.toString()), 
						request);
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
			@RequestParam long time_zone, HttpServletRequest request){
		try{
			Map<String, Object> cmdMap = new HashMap<String, Object>();
			cmdMap.put("command_id", sysconstant.CMD_APPLYTIME);
			cmdMap.put("cur_second", second);
			cmdMap.put("cur_nanosecond", nanosecond);
			cmdMap.put("time_zone", time_zone);
			long rri = CommandMgr.getInstance().sendCommand(JSON.toJSONString(cmdMap));
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = rri>0;
			finalMap.put("result", rs);
			if( rs ){
				finalMap.put("RRI", rri);
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_INFO, 
						String.format("下发更新时间及时区的命令成功,时间:[%d],时区:[%d]", nanosecond, time_zone), 
						request);
			}else{
				finalMap.put("reason", errorcode.sendmsg);
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("下发更新时间及时区的命令失败,时间:[%d],时区:[%d]", nanosecond, time_zone), 
						request);
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

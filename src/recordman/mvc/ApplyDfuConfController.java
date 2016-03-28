package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.Config;

import com.alibaba.fastjson.JSON;

import recordman.bean.errorcode;
import recordman.bean.logmsg;
import recordman.bean.sysconstant;
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
}

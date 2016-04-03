package recordman.mvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.DTF;

import com.alibaba.fastjson.JSON;

import recordman.bean.errorcode;
import recordman.bean.ethernet;
import recordman.bean.logmsg;
import recordman.bean.protocol;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.ConfigHandle;

@Controller
@RequestMapping("/devparam/mgrnetwork")
public class MgrnetworkController {
	private static Logger logger = Logger.getLogger(MgrnetworkController.class);
	@Inject
	ConfigHandle handle;

	@RequestMapping(value="/find", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getDetail( @RequestParam String id, HttpServletRequest request ){
		try{
			ethernet p = handle.getProtocol(DTF.StringToInt(id) );
			if( null == p ){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少管理板网络[%s]的参数信息", id), 
						request);
			}
			String finalJSON = JSON.toJSONString(p);
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
	public String update(@ModelAttribute ethernet p, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editProtocol(p);
			finalMap.put("result", rs);
			if( false == rs ){
				finalMap.put("reason", errorcode.update);
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新管理板网卡[%s]的参数配置失败", p==null?"":p.getName()), 
						request);
			}else{
				if( !handle.save() ){
					rs = false;
					finalMap.put("reason", errorcode.savetofile);
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存管理板网卡[%s]的参数配置失败", p==null?"":p.getName()), 
							request);
				}else{
					finalMap.put("reason", errorcode.noerror);
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新管理板网卡[%s]的参数配置成功", p==null?"":p.getName()), 
							request);
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

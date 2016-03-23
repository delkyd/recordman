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

import com.alibaba.fastjson.JSON;

import recordman.bean.channel;
import recordman.bean.errorcode;
import recordman.bean.lineparam;
import recordman.bean.logmsg;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.ConfigHandle;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/mgrparam/line")
public class MgrlineController {
	private static Logger logger = Logger.getLogger(MgrlineController.class);
	@Inject
	ConfigHandle handle;
	@Inject
	DFUConfHandle dfuHandle;
	
	@RequestMapping(value="/")
	public String show(Model model, HttpServletRequest request){
		List<channel> as = dfuHandle.getAIChannels("A");
		if( null == as ){
			CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, "缺少电流通道配置信息", request);
		}
		model.addAttribute("currentchannels", as);
		List<channel> vs = dfuHandle.getAIChannels("V");
		if( null == vs ){
			CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, "缺少电压通道配置信息", request);
		}
		model.addAttribute("voltagechannels", vs);
		return "recordman/mgrline";
	}
	
	@RequestMapping(value="/lines", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getLineList(HttpServletRequest request){
		try{
			List<String> lines = handle.getLines();
			if( null == lines || lines.size() == 0){
				CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, "缺少线路配置信息", request);
			}
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("lines", lines);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/findline", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String findline(@RequestParam String id){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("result", handle.getLineParam(id) != null );
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/editline", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String editLine(@RequestParam String oldId, @RequestParam String newId, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editLine(oldId, newId);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存线路[%s]属性失败", newId), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新线路[%s]属性成功", newId), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新线路[%s]属性失败", newId), 
						request);
			}
			finalMap.put("result", rs);
			finalMap.put("reason", reason);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/deleteline", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String deleteLine(@RequestParam String id, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.deleteLine(id);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("删除线路[%s]失败", id), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_WARNING, 
							String.format("删除线路[%s]成功", id), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("删除线路[%s]失败", id), 
						request);
			}
			finalMap.put("result", rs);
			finalMap.put("reason", reason);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/lineparam", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getLineParam(@RequestParam String id, HttpServletRequest request){
		try{
			lineparam p = handle.getLineParam(id);
			if( null == p ){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少线路[%s]参数配置", id), 
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
	
	@RequestMapping(value="/editlineparam", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String editLineParam(@ModelAttribute lineparam p, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editLineParam(p);
			String reason = errorcode.noerror;
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存线路[%s]参数配置失败", null==p?"":p.getName()), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新线路[%s]参数配置成功", null==p?"":p.getName()), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新线路[%s]参数配置失败", null==p?"":p.getName()), 
						request);
			}
			finalMap.put("result", rs);
			finalMap.put("reason", reason);
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

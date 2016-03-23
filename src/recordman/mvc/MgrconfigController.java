package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import codeman.util.FormObj;
import recordman.bean.errorcode;
import recordman.bean.fileconf;
import recordman.bean.logconf;
import recordman.bean.logmsg;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.ConfigHandle;

@Controller
@RequestMapping("/mgrparam/mgrconfig")
public class MgrconfigController {
	private static Logger logger = Logger.getLogger(MgrconfigController.class);
	@Inject
	ConfigHandle handle;
	@RequestMapping(value="/")
	public String show(Model model, HttpServletRequest request){
		fileconf fc = handle.getFileConf();
		if( null == fc ){
			CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, "管理板缺少文件配置信息", request);
		}
		model.addAttribute("fileconf", fc);
		logconf lc = handle.getLogConf();
		if( null == lc ){
			CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, "管理板缺少日志配置信息", request);
		}
		model.addAttribute("logconf", lc);
		return "recordman/mgrconfig";
	}
	
	@RequestMapping(value="/update", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String edit(@FormObj fileconf fc, @FormObj logconf lc, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean frs = handle.editFileConf(fc);
			boolean lrs = handle.editLogConf(lc);
			boolean rs = frs&&lrs;
			finalMap.put("result", rs);
			if( false == rs ){
				finalMap.put("reason", errorcode.update);
				CommandMgr.getInstance().sendLog(logmsg.LOG_ERROR, "更新管理板文件和日志参数配置失败", request);
			}else{
				if( !handle.save() ){
					rs = false;
					finalMap.put("reason", errorcode.savetofile);
					CommandMgr.getInstance().sendLog(logmsg.LOG_ERROR, "保存管理板文件和日志参数配置失败", request);
				}else{
					finalMap.put("reason", errorcode.noerror);
					CommandMgr.getInstance().sendLog(logmsg.LOG_INFO, "更新管理板文件和日志参数配置成功", request);
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

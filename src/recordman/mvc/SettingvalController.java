package recordman.mvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import recordman.bean.errorcode;
import recordman.bean.logmsg;
import recordman.bean.setting;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/devparam/settingval")
public class SettingvalController {
	private static Logger logger = Logger.getLogger(SettingvalController.class);
	@Inject
	DFUConfHandle handle;
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/settingval";
	}
	
	@RequestMapping(value="/update", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String update(@RequestParam String changes, HttpServletRequest request){
		try{
			List<setting> sets=null;
			if( changes != null && !changes.isEmpty()){
				try{
					sets = JSON.parseArray(changes, setting.class);

				}catch(Exception e){
					sets=null;
				}
			}
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = true;
			String reason = errorcode.noerror;
			if( null == sets){
				reason = errorcode.update;
				rs = false;
			}else{
				rs = handle.editSettingsVal(sets);
			}
			
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存定值信息失败"), 
							request);
				}else{
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新定值信息成功"), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新定值信息失败"), 
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

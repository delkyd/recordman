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

import recordman.bean.errorcode;
import recordman.bean.ethernet;
import recordman.bean.logmsg;
import recordman.bean.user;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/devparam/dfunetwork")
public class NetworkController {
	private static Logger logger = Logger.getLogger(DevconfigController.class);
	
	@Inject
	DFUConfHandle handle;

	@RequestMapping(value="/")
	public String show(Model model, HttpServletRequest request){
		List<ethernet> eths = handle.getNetworkInfo();
		if( null == eths || eths.size() == 0){
			CommandMgr.getInstance().sendLog(
					logmsg.LOG_WARNING, 
					String.format("缺少通信板的网络配置信息"), 
					request);
		}
		model.addAttribute("ethernets", eths);
		return "recordman/network";
	}
	
	@RequestMapping(value="/find", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getDetail(@RequestParam int index, HttpServletRequest request){
		try{
			ethernet eth = handle.getEthernetInfo(index);
			if( null == eth ){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少通信板网卡[%d]配置信息", index), 
						request);
			}
			String finalJSON = JSON.toJSONString(eth);
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
	public String update(@ModelAttribute ethernet eth, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editEthernetInfo(eth);
			finalMap.put("result", rs);
			if( false == rs ){
				finalMap.put("reason", errorcode.update);
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新通信板网卡[%s]的配置信息失败", null==eth?"":eth.getName()), 
						request);
			}else{
				if( !handle.save() ){
					rs = false;
					finalMap.put("reason", errorcode.savetofile);
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存通信板网卡[%s]的配置信息失败", null==eth?"":eth.getName()), 
							request);
				}else{
					finalMap.put("reason", errorcode.noerror);
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新通信板网卡[%s]的配置信息成功", null==eth?"":eth.getName()), 
							request);
				}
			}
			if( false == rs ){
				handle.rollback();
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

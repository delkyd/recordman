package recordman.mvc;

import java.util.ArrayList;
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

import recordman.bean.devconf;
import recordman.bean.errorcode;
import recordman.bean.ethernet;
import recordman.bean.logmsg;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.ConfigHandle;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/devparam/devconfig")
public class DevconfigController {
	private static Logger logger = Logger.getLogger(DevconfigController.class);
	@Inject
	DFUConfHandle dfuhandle;
	@Inject
	ConfigHandle mgrhandle;
	@RequestMapping(value="/")
	public String show(Model model, HttpServletRequest request){
		model.addAttribute("infos", dfuhandle.getDevBaseInfo());
		List<ethernet> dfueths = dfuhandle.getNetworkInfo();
		if( null == dfueths || dfueths.size() == 0){
			CommandMgr.getInstance().sendLog(
					logmsg.LOG_WARNING, 
					String.format("缺少通信板的网络配置信息"), 
					request);
		}
		List<ethernet> mgreths = mgrhandle.getProtocols();
		if( null == mgreths || mgreths.size() == 0){
			CommandMgr.getInstance().sendLog(
					logmsg.LOG_WARNING, 
					String.format("缺少管理板的网络配置信息"), 
					request);
		}
		List<ethernet> alleths = new ArrayList<ethernet>();
		alleths.addAll(dfueths);
		alleths.addAll(mgreths);
		model.addAttribute("ethernets", alleths);
		return "recordman/devconfig";
	}
	
	@RequestMapping(value="/update", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String edit(@ModelAttribute devconf info, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = dfuhandle.editBaseinfo(info);
			finalMap.put("result", rs);
			if( false == rs ){
				finalMap.put("reason", errorcode.update);
				CommandMgr.getInstance().sendLog(logmsg.LOG_ERROR, "更新通信板基本配置失败", request);
			}else{
				if( !dfuhandle.save() ){
					rs = false;
					finalMap.put("reason", errorcode.savetofile);
					CommandMgr.getInstance().sendLog(logmsg.LOG_ERROR, "保存通信板基本配置失败", request);
				}else{
					finalMap.put("reason", errorcode.noerror);
					CommandMgr.getInstance().sendLog(logmsg.LOG_INFO, "更新通信板基本配置成功", request);
				}
			}
			if( false == rs ){
				dfuhandle.rollback();
			}
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error( e.toString() );
			return null;
		}
	}
	
	@RequestMapping(value="/getethernets", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getEthernets( HttpServletRequest request ){
		try{
			List<ethernet> dfueths = dfuhandle.getNetworkInfo();
			List<ethernet> mgreths = mgrhandle.getProtocols();
			
			List<ethernet> alleths = new ArrayList<ethernet>();
			alleths.addAll(dfueths);
			alleths.addAll(mgreths);
			Map<String, Object> finalMap = new HashMap<String, Object>();
			finalMap.put("ethernets", alleths);
			String finalJSON = JSON.toJSONString(finalMap);
			logger.info(finalJSON);
			return finalJSON;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/findethernet", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getDetail( @RequestParam int index, HttpServletRequest request ){
		try{
			ethernet p = null;
			int ethIndex = index;
			if( ethIndex < 100 ){
				p = dfuhandle.getEthernetInfo(ethIndex);
			}else{
				p = mgrhandle.getProtocol(ethIndex);
			}
			if( null == p ){
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_WARNING, 
						String.format("缺少网络[%d]的参数信息", index), 
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
	
	@RequestMapping(value="/updateethernet", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String update(@ModelAttribute ethernet p, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = false;
			if( p.getIndex() < 100 ){
				rs = dfuhandle.editEthernetInfo(p);
			}else{
				rs = mgrhandle.editProtocol(p);
			}
			finalMap.put("result", rs);
			if( false == rs ){
				finalMap.put("reason", errorcode.update);
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_ERROR, 
						String.format("更新网卡[%s]的参数配置失败", p==null?"":p.getName()), 
						request);
			}else{
				boolean saveResult = false;
				if( p.getIndex() < 100 ){
					saveResult = dfuhandle.save();
				}else{
					saveResult = mgrhandle.save();
				}
				if( false == saveResult ){
					rs = false;
					finalMap.put("reason", errorcode.savetofile);
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("保存网卡[%s]的参数配置失败", p==null?"":p.getName()), 
							request);
				}else{
					finalMap.put("reason", errorcode.noerror);
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_INFO, 
							String.format("更新网卡[%s]的参数配置成功", p==null?"":p.getName()), 
							request);
				}
			}
			if( false == rs ){
				dfuhandle.rollback();
				mgrhandle.rollback();
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

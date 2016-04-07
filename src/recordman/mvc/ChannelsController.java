package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.FormObj;

import com.alibaba.fastjson.JSON;

import recordman.bean.channel;
import recordman.bean.errorcode;
import recordman.bean.logmsg;
import recordman.bean.terminal;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/mgrparam/channels")
public class ChannelsController {
	private static Logger logger = Logger.getLogger(ChannelsController.class);
	@Inject
	DFUConfHandle handle;
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/channels";
	}
	
	@RequestMapping(value="/query", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String query(@RequestParam int board, @RequestParam int index, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			terminal t = handle.getTerminalInfo(board, index);
			if( null != t ){
				finalMap.put("terminal", t);
				String cid = handle.getChannelMap(board, index);
				if( null != cid ){
					finalMap.put("channel", handle.getChannelInfo(cid));
				}
			}else{
				CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, String.format("板块:%d,端子:%d,缺少配置信息", board, index), request);
			}
			String finalJson = JSON.toJSONString(finalMap);
			logger.info(finalJson);
			return finalJson;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	@RequestMapping(value="/update", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String edit(@FormObj terminal t, @FormObj channel c, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = true;
			String reason = errorcode.noerror;
			if( null != t ){
				if( handle.editTerminalInfo(t) ){
					if( c != null ){
						if( !handle.editChannelMap(t.getBoard(), t.getIndex(), c.getId()) ){
							rs = false;
							CommandMgr.getInstance().sendLog(
									logmsg.LOG_ERROR, 
									String.format("板块:%d,端子:%d,通道:%s,更新端子与通道关联关系失败", t.getBoard(), t.getIndex(), c.getId()), 
									request);						
						}
						if( !handle.editChannelInfo(c) ){
							rs = false;
							CommandMgr.getInstance().sendLog(
									logmsg.LOG_ERROR, 
									String.format("通道:%s,更新通道配置失败", t.getBoard(), t.getIndex(), c.getId()), 
									request);
						}
					}else{
						if( !handle.editChannelMap(t.getBoard(), t.getIndex(), "") ){
							rs = false;
							CommandMgr.getInstance().sendLog(
									logmsg.LOG_ERROR, 
									String.format("板块:%d,端子:%d,清除端子与通道关联关系失败", t.getBoard(), t.getIndex(), c.getId()), 
									request);
						}
					}
				}else{
					rs = false;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("板块:%d,端子:%d,更新端子配置失败", t.getBoard(), t.getIndex(), c.getId()), 
							request);
				}
				
			}else{
				rs = false;
			}
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_ERROR, 
							String.format("板块:%d,端子:%d,通道:%s,保存端子与通道配置失败", t==null?"":t.getBoard(), t==null?"":t.getIndex(), c==null?"":c.getId()), 
							request);
				}
			}else{
				reason = errorcode.update;
				CommandMgr.getInstance().sendLog(
						logmsg.LOG_INFO, 
						String.format("板块:%d,端子:%d,通道:%s,端子与通道配置更新成功", t==null?"":t.getBoard(), t==null?"":t.getIndex(), c==null?"":c.getId()), 
						request);
			}
			if( false == rs ){
				handle.rollback();
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

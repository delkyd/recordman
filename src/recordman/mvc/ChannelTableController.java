package recordman.mvc;

import java.util.ArrayList;
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

import recordman.bean.channel;
import recordman.bean.errorcode;
import recordman.bean.logmsg;
import recordman.bean.terminal;
import recordman.datahandle.CommandMgr;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/mgrparam/channeltable")
public class ChannelTableController {
	private static Logger logger = Logger.getLogger(ChannelTableController.class);
	@Inject
	DFUConfHandle handle;
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/channeltable";
	}
	
	@RequestMapping(value="/query", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String query(@RequestParam int board, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			List<channel> chs = handle.getChannels(board);
			List<channel> ret = new ArrayList<channel>();
			if( null != chs ){
				Map chlmap = handle.getChannelMaps(board);
				if( null != chlmap ){
					for( channel c : chs ){
						if( null != chlmap.get(c.getId()) ){
							c.setEnable(true);
						}
						ret.add(c);
					}
				}else{
					ret = chs;
				}
			}else{
				CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, String.format("板卡:%d,缺少通道配置信息", board), request);
			}			
			finalMap.put("channels", ret);
			
			Map<String, terminal> terminals = handle.getTerminals(board);
			if( terminals.size() <= 0 ){
				CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, String.format("板卡:%d,缺少端子配置信息", board), request);
			}
			finalMap.put("terminals", terminals);
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
	public String update(@RequestParam String channels, @RequestParam String terminals, HttpServletRequest request){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			List<channel> chls=null;
			if( channels != null && !channels.isEmpty()){
				try{
					chls = JSON.parseArray(channels, channel.class);

				}catch(Exception e){
					chls=null;
				}
			}
			
			List<terminal> ts = null;
			if( terminals != null && !terminals.isEmpty() ){
				try{
					ts = JSON.parseArray(terminals, terminal.class);
				}catch(Exception e){
					ts = null;
				}
			}
			
			boolean rs = true;
			if( null != chls ){
				boolean needSort=false;
				for( channel ch : chls){
					String id = ch.getId();
					if(handle.editChannelInfo(ch)){
						if( ch.isEnable() ){
							needSort = true;
						}
					}else{
						rs = false;
						break;
					}
										
				}
				if(rs && needSort){
					rs = handle.sortChannelMaps();
				}
			}else{
				rs = false;
			}
			
			if( rs && null != ts ){
				for( terminal t : ts ){
					if(!handle.editTerminalInfo(t)){
						rs = false;
						break;
					}
				}
			}
			
			if( false == rs ){
				finalMap.put("reason", errorcode.update);
				CommandMgr.getInstance().sendLog(logmsg.LOG_ERROR, "更新端子和通道配置失败", request);
			}else{
				if( !handle.save() ){
					rs = false;
					finalMap.put("reason", errorcode.savetofile);
					CommandMgr.getInstance().sendLog(logmsg.LOG_ERROR, "保存端子和通道配置失败", request);
				}else{
					finalMap.put("reason", errorcode.noerror);
					CommandMgr.getInstance().sendLog(logmsg.LOG_INFO, "更新端子和通道配置成功", request);
				}
			}
			if( false == rs ){
				handle.rollback();
			}
			finalMap.put("result", rs);
			String finalJson = JSON.toJSONString(finalMap);
			logger.info(finalJson);
			return finalJson;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
}

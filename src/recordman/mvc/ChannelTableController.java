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
}

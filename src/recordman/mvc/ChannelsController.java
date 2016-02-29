package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

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
import recordman.bean.terminal;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/devparam/channels")
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
	public String query(@RequestParam int board, @RequestParam int index){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			terminal t = handle.getTerminalInfo(board, index);
			if( null != t ){
				finalMap.put("terminal", t);
				String cid = handle.getChannelMap(board, index);
				if( null != cid ){
					finalMap.put("channel", handle.getChannelInfo(cid));
				}
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
	public String edit(@FormObj terminal t, @FormObj channel c){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = true;
			String reason = errorcode.noerror;
			if( null != t ){
				if( handle.editTerminalInfo(t) ){
					if( c != null ){
						if( !handle.editChannelMap(t.getBoard(), t.getIndex(), c.getId()) ){
							rs = false;
						}
						if( !handle.editChannelInfo(c) ){
							rs = false;
						}
					}else{
						if( !handle.editChannelMap(t.getBoard(), t.getIndex(), "") ){
							rs = false;
						}
					}
				}else{
					rs = false;
				}
				
			}else{
				rs = false;
			}
			if( rs ){
				if( !handle.save() ){
					rs = false;
					reason = errorcode.savetofile;
				}
			}else{
				reason = errorcode.update;
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

package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import recordman.bean.devconf;
import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/devparam/devconfig")
public class DevconfigController {
	private static Logger logger = Logger.getLogger(DevconfigController.class);
	@Inject
	DFUConfHandle handle;
	@RequestMapping(value="/")
	public String show(Model model){
		model.addAttribute("infos", handle.getDevBaseInfo());
		return "recordman/devconfig";
	}
	
	@RequestMapping(value="/update", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String edit(@ModelAttribute devconf info ){
		try{
			Map<String, Object> finalMap = new HashMap<String, Object>();
			boolean rs = handle.editBaseinfo(info);
			finalMap.put("result", rs);
			if( false == rs ){
				finalMap.put("reason", "错误");
			}else{
				finalMap.put("reason", "成功");
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
	
	
}

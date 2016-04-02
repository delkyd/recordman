package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.Config;

import com.alibaba.fastjson.JSON;

import recordman.bean.errorcode;
import recordman.bean.logmsg;
import recordman.bean.sysconstant;
import recordman.datahandle.CommandMgr;

@Controller
@RequestMapping("/mgrparam/dfuapply")
public class ApplyDfuConfController {
	private static Logger logger = Logger.getLogger(ApplyDfuConfController.class);
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/applydfu";
	}
}

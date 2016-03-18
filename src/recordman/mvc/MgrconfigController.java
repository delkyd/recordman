package recordman.mvc;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import recordman.datahandle.ConfigHandle;

@Controller
@RequestMapping("/mgrparam/mgrconfig")
public class MgrconfigController {
	private static Logger logger = Logger.getLogger(MgrconfigController.class);
	@Inject
	ConfigHandle handle;
	@RequestMapping(value="/")
	public String show(Model model){
		//model.addAttribute("infos", handle.getDevBaseInfo());
		return "recordman/mgrconfig";
	}
}

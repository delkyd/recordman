package recordman.mvc;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import recordman.datahandle.DFUConfHandle;

@Controller
@RequestMapping("/devparam/network")
public class NetworkController {
	private static Logger logger = Logger.getLogger(DevconfigController.class);
	
	@Inject
	DFUConfHandle handle;

	@RequestMapping(value="/")
	public String show(Model model){
		model.addAttribute("ethernets", handle.getNetworkInfo());
		return "recordman/network";
	}
}

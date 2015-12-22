package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/runstatus")
public class RunstatusController {
	@RequestMapping(value="/")
	public String show(){
		return "recordman/runstatus";
	}
}

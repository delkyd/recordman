package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/system/sysreboot")
public class SystemrebootController {
	@RequestMapping(value="/")
	public String show(){
		return "recordman/sysreboot";
	}
}

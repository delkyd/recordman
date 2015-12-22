package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/system/systime")
public class SystemtimeController {
	@RequestMapping(value="/")
	public String show(){
		return "recordman/systime";
	}
}

package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/system/systest")
public class SystemtestController {
	@RequestMapping(value="/")
	public String show(){
		return "recordman/systest";
	}
}

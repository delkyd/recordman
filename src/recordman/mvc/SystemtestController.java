package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/systest")
public class SystemtestController {
	@RequestMapping(value="/show")
	public String show(){
		return "recordman/systest";
	}
}

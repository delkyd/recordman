package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/devparam/devconfig")
public class DevconfigController {
	@RequestMapping(value="/")
	public String show(){
		return "recordman/devconfig";
	}
}

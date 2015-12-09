package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/devconfig")
public class DevconfigController {
	@RequestMapping(value="/show")
	public String show(){
		return "recordman/devconfig";
	}
}

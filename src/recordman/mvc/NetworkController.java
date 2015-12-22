package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/devparam/network")
public class NetworkController {
	@RequestMapping(value="/")
	public String show(){
		return "recordman/network";
	}
}

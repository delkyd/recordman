package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/network")
public class NetworkController {
	@RequestMapping(value="/show")
	public String show(){
		return "recordman/network";
	}
}

package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/devparam/channels")
public class ChannelsController {
	@RequestMapping(value="/")
	public String show(){
		return "recordman/channels";
	}
	
}

package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/devparam/primarydev")
public class PrimarydevController {
	@RequestMapping(value="/")
	public String show(){
		return "recordman/primarydev";
	}
}

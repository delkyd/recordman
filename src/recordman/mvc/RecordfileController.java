package recordman.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/recordfile")
public class RecordfileController {
	@RequestMapping(value="/show")
	public String show(){
		return "recordman/recordfile";
	}
}

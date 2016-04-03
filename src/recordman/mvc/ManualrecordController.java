package recordman.mvc;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/runview/manualrecord")
public class ManualrecordController {
	private static Logger logger = Logger.getLogger(ManualrecordController.class);
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/manualrecord";
	}
}

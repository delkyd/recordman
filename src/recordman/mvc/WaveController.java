package recordman.mvc;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/wave")
public class WaveController {
	private static Logger logger = Logger.getLogger(WaveController.class);
}

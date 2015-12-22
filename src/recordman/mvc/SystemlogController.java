package recordman.mvc;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import recordman.bean.user;

@Controller
@RequestMapping("/system/syslog")
public class SystemlogController {
	@RequestMapping("/")
	public String show(HttpServletRequest request){
		return "recordman/syslog";
	}
}

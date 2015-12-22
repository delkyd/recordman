package recordman.mvc;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import recordman.bean.user;
import recordman.datahandle.UserDataHandle;

@Controller
@RequestMapping("/logon")
public class LoginController {
	
	public LoginController(){
		
	}
	
	@Inject
	private UserDataHandle userdatahandle;
	
	@RequestMapping(value="/login")
	public String login(@RequestParam String name,
						@RequestParam String pwd,Model model, HttpServletRequest request){
		try{						
			System.out.println("login method");
			
			user u = userdatahandle.find(name, pwd);
			if( null != u ){
				request.getSession().setAttribute("user", u);
				System.out.println("login successed");
				
				String rootpath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath();
				model.addAttribute("rootPath", rootpath);
				request.getSession().setAttribute("rootPath", rootpath );
				
				return "redirect:/runstatus/";
			}else{
				System.out.println("login failed");
				model.addAttribute("loginFail", true);
				return "login";
			}
		}catch( Exception e ){
			e.printStackTrace();			
			return "login";
		}
	}

}

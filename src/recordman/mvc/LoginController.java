package recordman.mvc;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import recordman.bean.logmsg;
import recordman.bean.user;
import recordman.datahandle.CommandMgr;
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
						@RequestParam(required=false) String pwd,
						Model model, HttpServletRequest request){
		try{						
			if( name.equals("guest")){
				request.getSession().removeAttribute("user");
				CommandMgr.getInstance().sendLog(logmsg.LOG_INFO, String.format("以游客身份登录系统", name), request);
				return "redirect:/runview/runstatus/";
			}else{
				user u = userdatahandle.find(name, pwd);
				if( null != u ){
					request.getSession().setAttribute("user", u);
					CommandMgr.getInstance().sendLog(logmsg.LOG_INFO, String.format("用户[%s]登录成功", name), request);
					if( u.getType() == user.USER_TYPE_ADMIN){
						return "redirect:/devparam/devconfig/";
					}else if( u.getType() == user.USER_TYPE_ENGINEER){
						return "redirect:/mgrparam/channeltable/";
					}
					return "redirect:/runview/runstatus/";
				}else{
					System.out.println("login failed");
					model.addAttribute("loginFail", true);
					CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, String.format("用户[%s]登录失败", name), request);
					return "login";
				}
			}
			
		}catch( Exception e ){
			e.printStackTrace();			
			return "login";
		}
	}

}

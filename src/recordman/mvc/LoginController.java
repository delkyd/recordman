package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.fastjson.JSON;

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
			System.out.println("login method");
			
			user u = userdatahandle.find(name, pwd);
			if( null != u ){
				request.getSession().setAttribute("user", u);
				
				String rootpath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath();
				
				request.getSession().setAttribute("rootPath", rootpath );
				
				CommandMgr.getInstance().sendLog(logmsg.LOG_INFO, String.format("用户[%s]登录成功", name), request);
				
				return "redirect:/runstatus/";
			}else{
				System.out.println("login failed");
				model.addAttribute("loginFail", true);
				CommandMgr.getInstance().sendLog(logmsg.LOG_WARNING, String.format("用户[%s]登录失败", name), request);
				return "login";
			}
		}catch( Exception e ){
			e.printStackTrace();			
			return "login";
		}
	}

}

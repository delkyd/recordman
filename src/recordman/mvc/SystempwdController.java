package recordman.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.fastjson.JSON;

import recordman.bean.user;
import recordman.datahandle.UserDataHandle;

@Controller
@RequestMapping("/system/syspwd")
public class SystempwdController {
	private static Logger logger = Logger.getLogger(SystempwdController.class);
	
	@Inject
	private UserDataHandle handle;
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/syspwd";
	}
	
	@RequestMapping(value="/edit")
	public void edit(@RequestParam("name") String name, @RequestParam("oldpwd") String oldpwd, @RequestParam("pwd") String pwd,			
			HttpServletRequest request, HttpServletResponse response){
		try{
			Map<String, Object> map = new HashMap<String, Object>();
			
			user u = (user)request.getSession().getAttribute("user");
			
			user f = handle.find(u.getName(), oldpwd);
			if( null == f ){
				map.put("result", false);
				map.put("errorCode", 1);
			}else{

				u.setName(name);
				u.setPwd(pwd);
				if( handle.edit(u) ){
					map.put("result", true);
					map.put("errorCode", 0);
					request.getSession().removeAttribute("user");
				}else{
					map.put("result", false);
					map.put("errorCode", 2);
				}
				
			}			
			String finalJSON = JSON.toJSONString(map);
			logger.info(finalJSON);
			response.getWriter().write(finalJSON);
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
		}
	}
}

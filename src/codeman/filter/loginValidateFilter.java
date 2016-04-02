package codeman.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import recordman.bean.logmsg;
import recordman.bean.user;
import recordman.datahandle.CommandMgr;

/**
 * Servlet Filter implementation class loginValidateFilter
 */
public class loginValidateFilter extends HttpServlet implements Filter {
       
    /**
	 * 
	 */
	private static final long serialVersionUID = -6679195027025070489L;

	/**
     * @see HttpServlet#HttpServlet()
     */
    public loginValidateFilter() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		// place your code here
		HttpServletRequest httpReq = (HttpServletRequest)request;
		//System.out.println("request servlet path:"+httpReq.getServletPath());
		String rootpath = httpReq.getScheme() + "://" + httpReq.getServerName() + ":" + httpReq.getServerPort()+httpReq.getContextPath();		
		httpReq.getSession().setAttribute("rootPath", rootpath );
		String servletPath = httpReq.getServletPath();
		if(	needPermissionLevel(servletPath) > PERMISSION_NONE ){ //需要验证权限
				if( null == httpReq.getSession().getAttribute("user")){
					System.out.println(httpReq.getRemoteAddr() + ",login is expired");
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_WARNING, 
							String.format("用户登录已过期"), 
							httpReq);
					request.getRequestDispatcher("/resources/pages/login.jsp").forward(request, response);
				}else{
					if( ( needPermissionLevel(servletPath) == PERMISSION_ADMIN && ((user)httpReq.getSession().getAttribute("user")).getType() < user.USER_TYPE_ADMIN )
							|| ( needPermissionLevel(servletPath) == PERMISSION_ENGINEER && ((user)httpReq.getSession().getAttribute("user")).getType() < user.USER_TYPE_ENGINEER) ){
						System.out.println(httpReq.getRemoteAddr() + ",quest '"+servletPath+"',permission denied");
						CommandMgr.getInstance().sendLog(
								logmsg.LOG_WARNING, 
								String.format("试图访问:%s,权限被否定", servletPath), 
								httpReq);
						request.getRequestDispatcher("/resources/pages/login.jsp").forward(request, response);
					}
					chain.doFilter(request, response);
				}				
		}else{
			// pass the request along the filter chain
			chain.doFilter(request, response);
		}		
	}
	
	private static int PERMISSION_NONE=0;
	private static int PERMISSION_ADMIN=2;
	private static int PERMISSION_ENGINEER=3;
	
	/** 判断此请求最低需要什么权限
	 * @param servletPath 请求地址
	 * @return 需求权限等级。0-无需权限，2-检修人员/管理员，3-工程师
	 */
	private int needPermissionLevel(String servletPath){
		if( servletPath.indexOf("/devparam") != -1 ){
			return PERMISSION_ADMIN;
		}
		if( servletPath.indexOf("/system") != -1 ){
			return PERMISSION_ADMIN;
		}
		if( servletPath.indexOf("/mgrparam") != -1 ){
			return PERMISSION_ENGINEER;
		}
		
		return PERMISSION_NONE;
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}

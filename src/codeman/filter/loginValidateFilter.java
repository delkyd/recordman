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
		HttpServletResponse httpRes = (HttpServletResponse)response;
		//System.out.println("request servlet path:"+httpReq.getServletPath());
		if(	!httpReq.getServletPath().equals("/logon/login") && !httpReq.getServletPath().equals("/") && !(httpReq.getServletPath().indexOf("resources") >=0)){
				if( null == httpReq.getSession().getAttribute("user")){
					System.out.println(httpReq.getRemoteAddr() + ",login is expired");
					CommandMgr.getInstance().sendLog(
							logmsg.LOG_WARNING, 
							String.format("用户登录已过期"), 
							httpReq);
					request.getRequestDispatcher("/resources/pages/login.jsp").forward(request, response);
					
				}else{
					if( (httpReq.getServletPath().indexOf("/system") != -1 ||
							httpReq.getServletPath().indexOf("/devparam") != -1 ||
							httpReq.getServletPath().indexOf("/mgrparam") != -1 ) && 
							(null == httpReq.getSession().getAttribute("user") || 
							((user)httpReq.getSession().getAttribute("user")).getType() < user.USER_TYPE_ADMIN)){
						System.out.println(httpReq.getRemoteAddr() + ",quest system page,permission denied");
						CommandMgr.getInstance().sendLog(
								logmsg.LOG_WARNING, 
								String.format("试图访问:%s,权限被否定", httpReq.getServletPath()), 
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

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}

package recordman.bean;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import codeman.util.DTF;

public class logmsg {
	public static final String LOG_ERROR="error";
	public static final String LOG_WARNING="warning";
	public static final String LOG_INFO="info";
	private String level = null;
	private String date = DTF.DateToString(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
	private String user = null;
	private String ipaddr = null;
	private String content = null;
	
	public logmsg(String level, HttpServletRequest request, String msg){
		this.level = level;
		if( null != request ){
			user u = (user)request.getSession().getAttribute("user");
			if( null != u ){
				this.user = u.getName();
			}
			this.ipaddr = getClientIP( request );
		}
		this.content = msg;
	}
	
	public static String getClientIP(HttpServletRequest httpservletrequest) {
	    if (httpservletrequest == null)
	        return null;
	    String s = httpservletrequest.getHeader("X-Forwarded-For");
	    if (s == null || s.length() == 0 || "unknown".equalsIgnoreCase(s)){
	    	s = httpservletrequest.getHeader("Proxy-Client-IP");
	    	if(s != null) { 
	    		String[] ips = s.split(",");
	    		for(int i = 0; i < ips.length; i++ ){
	    			String ip = ips[i].trim();
	    			if( null != ip && !ip.isEmpty() ){
	    				s = ip;
	    				break;
	    			}
	    		}
            } 
	    }
	        
	    if (s == null || s.length() == 0 || "unknown".equalsIgnoreCase(s))
	        s = httpservletrequest.getHeader("WL-Proxy-Client-IP");
	    if (s == null || s.length() == 0 || "unknown".equalsIgnoreCase(s))
	        s = httpservletrequest.getHeader("HTTP_CLIENT_IP");
	    if (s == null || s.length() == 0 || "unknown".equalsIgnoreCase(s))
	        s = httpservletrequest.getHeader("HTTP_X_FORWARDED_FOR");
	    if (s == null || s.length() == 0 || "unknown".equalsIgnoreCase(s))
	        s = httpservletrequest.getRemoteAddr();
	    return s;
	}
	
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getIpaddr() {
		return ipaddr;
	}
	public void setIpaddr(String ipaddr) {
		this.ipaddr = ipaddr;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public void setUser(user u) {
		if( null != u ){
			this.user = u.getName();
		}	
	}
	
}

package recordman;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import recordman.datahandle.CommandMgr;


public class ContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		System.out.println("================>[ServletContextListener]Web容器开始退出.");
		CommandMgr.getInstance().stop();
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		System.out.println("================>[ServletContextListener]自动加载启动开始.");
		CommandMgr mgr = CommandMgr.getInstance();
	}

}

package recordman;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import recordman.datahandle.CommandMgr;
import recordman.datahandle.MongoDao;


public class ContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		System.out.println("================>[ServletContextListener]Web容器开始退出.");
		CommandMgr.getInstance().stop();
		MongoDao.GetInstance().close();
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		System.out.println("================>[ServletContextListener]自动加载启动开始.");
		CommandMgr mgr = CommandMgr.getInstance();
	}

}

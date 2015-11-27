package recordman.datahandle;

import org.apache.log4j.Logger;

import codeman.util.DTF;
import codeman.util.KeyValueConfig;
import redis.clients.jedis.Jedis;

public class CacheDao {

	// 输出日志文件
		private static Logger logger = Logger.getLogger(CacheDao.class);
		
		private CacheDao(){
			
		}
		
		protected void finalize(){
			if( null != j ){
				j.disconnect();
			}
		}
			
		private static CacheDao m_instance = null;
		
		public static CacheDao GetInstance(){
			if (m_instance == null) {
				m_instance = new CacheDao();
				Connect();
			}
			return m_instance;
		}

		private static Jedis j = null;
		private static void Connect() {
			try{
				j = new Jedis(KeyValueConfig.getValue("redis.ip"),DTF.StringToInt(KeyValueConfig.getValue("redis.port")));
				j.connect();
				j.auth(KeyValueConfig.getValue("redis.password"));
				j.select(0);
			}catch(Exception e){
				e.printStackTrace();
				logger.error(e.toString());
			}
		}
		
		public Jedis GetDB(){
			return j;
		}
}

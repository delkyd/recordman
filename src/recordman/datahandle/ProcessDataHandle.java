package recordman.datahandle;

import org.apache.log4j.Logger;
import org.bson.Document;
import org.springframework.stereotype.Component;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCursor;

@Component
public class ProcessDataHandle {
	// 输出日志文件
		private static Logger logger = Logger.getLogger(ProcessDataHandle.class);
		
	public Object getCurStatus(){
		try{
			MongoDao dao = MongoDao.GetInstance();
			FindIterable<Document> result = dao.GetCollection("services_run_info").find();
			MongoCursor<Document> it = result.iterator();
			if( it.hasNext() ){
				return it.next();
			}
			return null;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
}

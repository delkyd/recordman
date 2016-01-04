package recordman.datahandle;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.bson.Document;
import org.springframework.stereotype.Component;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCursor;

@Component
public class RunstatusDataHandle {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(UserDataHandle.class);
	
	public List<Object> findAll(){
		try{
			MongoDao dao = MongoDao.GetInstance();

			FindIterable<Document> result = dao.GetCollection("runstatus_info").find();
			MongoCursor<Document> it = result.iterator();
			List<Object> list = new ArrayList<Object>();
			
			while( it.hasNext() ){
				Document doc = it.next();
				list.add(doc);
			}
			return list;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}

}

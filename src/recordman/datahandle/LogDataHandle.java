package recordman.datahandle;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.bson.Document;
import org.springframework.stereotype.Component;

import codeman.util.DTF;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCursor;

import recordman.bean.logmsg;

@Component
public class LogDataHandle {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(LogDataHandle.class);
	
	public long getLogsCount( String level, Date startDate, Date endDate ){
		try{
			MongoDao dao = MongoDao.GetInstance();

			BasicDBObject cond = new BasicDBObject();
			if( null != level && !level.isEmpty() ){
				cond.append("level", new BasicDBObject("$eq", level));
			}
			BasicDBObject comp = new BasicDBObject();
			comp.append("$gte", startDate);
			comp.append("$lte", endDate);
			cond.append("date", comp);
			return dao.GetCollection("sys_logs").count(cond);
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
			return 0;
		}
	}
	public List<logmsg> findLogs( String level, Date startDate, Date endDate, int curPage, int numPrePage ){
		try{
			MongoDao dao = MongoDao.GetInstance();

			BasicDBObject cond = new BasicDBObject();
			if( null != level && !level.isEmpty() ){
				cond.append("level", new BasicDBObject("$eq", level));
			}
			BasicDBObject comp = new BasicDBObject();
			comp.append("$gte", startDate);
			comp.append("$lte", endDate);
			cond.append("date", comp);
			List<logmsg> list = new ArrayList<logmsg>();
			FindIterable<Document> result = dao.GetCollection("sys_logs").find(cond);
			BasicDBObject sort = new BasicDBObject();
			sort.append("date", -1);
			result.sort(sort).skip( (curPage-1)*numPrePage ).limit(numPrePage);
			MongoCursor<Document> it = result.iterator();
			while( it.hasNext() ){
				Document doc = it.next();
				logmsg r = new logmsg();
				r.setId(doc.getLong("id"));
				r.setContent( doc.getString("content"));
				r.setDate( DTF.DateToString( doc.getDate("date"), "yyyy-MM-dd HH:mm:ss.SSS"));
				r.setIpaddr( doc.getString("ipaddr"));
				r.setLevel( doc.getString("level"));
				r.setUser( doc.getString("user"));
				list.add(r);
			}
			return list;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}	
	}
}

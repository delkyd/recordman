package recordman.datahandle;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.bson.Document;
import org.springframework.stereotype.Component;

import recordman.bean.recordfile;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCursor;

@Component
public class RecordfileDataHandle {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(RecordfileDataHandle.class);
	
	/**
	 * @param startDate 查询起始时间(包含)
	 * @param endDate 查询结束时间(包含)
	 * @return
	 */
	public List<recordfile> findComtrade(Date startDate, Date endDate){
		try{
			MongoDao dao = MongoDao.GetInstance();

			BasicDBObject cond = new BasicDBObject();
			BasicDBObject comp = new BasicDBObject();
			comp.append("$gte", startDate);
			comp.append("$lte", endDate);
			cond.append("trigger_time", comp);

			List<recordfile> list = new ArrayList<recordfile>();
			FindIterable<Document> result = dao.GetCollection("osc_list_info").find(cond);
			BasicDBObject sort = new BasicDBObject();
			sort.append("trigger_time", -1);
			sort.append("ms", -1);
			result.sort(sort);
			MongoCursor<Document> it = result.iterator();
			while( it.hasNext() ){
				Document doc = it.next();
				recordfile r = new recordfile();
				r.setbFaultfile( doc.getInteger("bfaultfile")==null?0:doc.getInteger("bfaultfile"));
				r.setFaultType( doc.getString("fault_type"));
				r.setFileSize( doc.getInteger("filesize")==null?0:doc.getInteger("filesize"));
				r.setMs( doc.getInteger("ms")==null?0:doc.getInteger("ms"));
				r.setName( doc.getString("file_name"));
				r.setSavePath( doc.getString("save_path"));
				r.setTriggerTime( doc.getDate("trigger_time"));
				r.setTriggerType( doc.getString("trigger_type"));
				r.setDistance( doc.getString("fault_distance"));
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

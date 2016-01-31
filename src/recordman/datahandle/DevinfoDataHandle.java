package recordman.datahandle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.bson.Document;
import org.springframework.stereotype.Component;

import recordman.bean.devconf;
import recordman.bean.ethernet;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.result.UpdateResult;

@Component
public class DevinfoDataHandle {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(DevinfoDataHandle.class);
	
	public Object getBaseinfo(){
		try{
			MongoDao dao = MongoDao.GetInstance();
			
			FindIterable<Document> result = dao.GetCollection("record_info").find();
			
			BasicDBObject filter = new BasicDBObject();
			filter.append("network", 0);
			filter.append("_id", 0);
			result.projection(filter);
			MongoCursor<Document> it = result.iterator();
			
			Object m = null;
			if( it.hasNext() ){
				m = it.next();
				return m;
			}
			return null;
			
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return null;
		}
	}
	
	public boolean editBaseinfo(devconf conf){
		try{
			MongoDao dao = MongoDao.GetInstance();
			
			BasicDBObject filter = new BasicDBObject();
			filter.append("type", new BasicDBObject("$eq", conf.getType()));
			BasicDBObject update = new BasicDBObject();
			BasicDBObject content = new BasicDBObject();
			content.append("name", conf.getName());
			content.append("model", conf.getModel());
			content.append("station", conf.getStation());
			content.append("version", conf.getVersion());
			content.append("remark", conf.getRemark());
			update.append("$set", content);
			
			UpdateResult rs = dao.GetCollection("record_info").updateOne(filter, update);
			if( 1 == rs.getModifiedCount() ){
				return true;
			}
			return false;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return false;
		}
	}
	
	public Object getNetworkInfo(){
		try{
			MongoDao dao = MongoDao.GetInstance();
			
			FindIterable<Document> result = dao.GetCollection("record_info").find();
			
			BasicDBObject filter = new BasicDBObject();
			filter.append("network", 1);
			result.projection(filter);
			MongoCursor<Document> it = result.iterator();
			
			Object nets = null;
			if( it.hasNext() ){
				Document doc = it.next();
				nets = doc.get("network");
			}
			return nets;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return null;
		}
	}
	
	public Object getEthernetInfo(int index){
		try{
			MongoDao dao = MongoDao.GetInstance();
			
			BasicDBObject cond = new BasicDBObject();
			cond.append("network.index", index);
			
			FindIterable<Document> result = dao.GetCollection("record_info").find();
			
			BasicDBObject filter = new BasicDBObject();
			filter.append("network", new BasicDBObject("$elemMatch", new BasicDBObject("index", index)));
			result.projection(filter);
			MongoCursor<Document> it = result.iterator();
			
			Object eth = null;
			if( it.hasNext() ){
				List<Object> list = new ArrayList<Object>();
				Document doc = it.next();
				list = doc.get("network", list.getClass());
				if( list.size() == 1 ){
					eth = list.get(0);
				}
			}
			return eth;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return null;
		}
	}
	
	public boolean editEthernetInfo( ethernet eth ){
		try{
			MongoDao dao = MongoDao.GetInstance();
			
			BasicDBObject filter = new BasicDBObject();
			filter.append("network.index", eth.getIndex());
			BasicDBObject update = new BasicDBObject();
			BasicDBObject content = new BasicDBObject();
			content.append("network.$.name", eth.getName());
			content.append("network.$.ip", eth.getIp());
			content.append("network.$.mask", eth.getMask());
			content.append("network.$.gate", eth.getGate());
			update.append("$set", content);
			
			UpdateResult rs = dao.GetCollection("record_info").updateOne(filter, update);
			if( 1 == rs.getModifiedCount() ){
				return true;
			}
			return false;
		}catch( Exception e ){
			e.printStackTrace();
			logger.error( e.toString() );
			return false;
		}
	}
}

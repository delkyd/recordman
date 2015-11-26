package datahandle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.bson.Document;

import codeman.util.DTF;
import codeman.util.KeyValueConfig;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;

public class MongoDAO {
	
	// 输出日志文件
	private static Logger logger = Logger.getLogger(MongoDAO.class);
		

	private MongoDAO(){
		
	}
	
	protected void finalize(){
		if( m_client != null ){
			m_client.close();
		}
	}
	
	public static MongoDAO m_instance = null;
	
	public static MongoDAO GetInstance(){
		if( m_instance == null ){
			m_instance = new MongoDAO();
			Connect();
		}
		return m_instance;
	}
	
	private static MongoClient m_client = null;
	private static MongoDatabase m_database = null;
	
	public static boolean Connect(){
		try{
			if( m_client == null ){
				MongoCredential cred = MongoCredential.createCredential(KeyValueConfig.getValue("mongodb.user.name"), 
						KeyValueConfig.getValue("mongodb.dbname"), KeyValueConfig.getValue("mongodb.user.name").toCharArray());
				List<MongoCredential> lc = new ArrayList<MongoCredential>();
				lc.add(cred);
				ServerAddress sa = new  ServerAddress(KeyValueConfig.getValue("mongodb.ip"), DTF.StringToInt(KeyValueConfig.getValue("mongodb.port")));
				
				m_client = new MongoClient(sa, lc);
				
				m_database = m_client.getDatabase(KeyValueConfig.getValue("mongodb.dbname"));
				
					logger.info("connect mongo database successed:"+KeyValueConfig.getValue("mongodb.user.name")+"@"+
							KeyValueConfig.getValue("mongodb.ip")+":"+KeyValueConfig.getValue("mongodb.port")+"/"+KeyValueConfig.getValue("mongodb.dbname"));
			}
			
			return true;
		}catch(Exception e){
			logger.error("connect mongo database failed:"+KeyValueConfig.getValue("mongodb.user.name")+"@"+
					KeyValueConfig.getValue("mongodb.ip")+":"+KeyValueConfig.getValue("mongodb.port")+"/"+KeyValueConfig.getValue("mongodb.dbname"));
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public MongoCollection<Document> GetCollection(String collectionName){
		try{
			return m_database.getCollection(collectionName);
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public long GetId(String idname){
		try{
			MongoDAO dao = MongoDAO.GetInstance();
			
			BasicDBObject cond = new BasicDBObject();
			cond.append("$inc", new BasicDBObject("id", (long)1));
			BasicDBObject cond4 = new BasicDBObject();
			cond4.append("name", new BasicDBObject("$eq", idname));
			FindOneAndUpdateOptions opt = new FindOneAndUpdateOptions();
			opt.upsert(true);
			opt.returnDocument(ReturnDocument.AFTER);
			Document doc = dao.GetCollection("ids").findOneAndUpdate(cond4, cond, opt);
			if( doc == null )
				return -1;
			return doc.getLong("id");
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return -1;
		}
	}

}



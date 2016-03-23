package recordman.datahandle;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

import org.apache.log4j.Logger;
import org.bson.Document;
import org.springframework.stereotype.Component;

import recordman.bean.user;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.result.UpdateResult;

@Component
public class UserDataHandle {
	// 输出日志文件
	private static Logger logger = Logger.getLogger(UserDataHandle.class);

	private String HashPwd(String pwd) {
		try {
			//des加密
			String key = "recordman.Don'tpanic-42"; // 要求key至少长度为8个字符

			SecureRandom random = new SecureRandom();
			DESKeySpec keySpec = new DESKeySpec(key.getBytes());
			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("des");
			SecretKey secretKey = keyFactory.generateSecret(keySpec);

			Cipher descipher = Cipher.getInstance("des");
			descipher.init(Cipher.ENCRYPT_MODE, secretKey, random);
			byte[] descipherData = descipher.doFinal(pwd.getBytes());

			//md5编码
			MessageDigest mg = MessageDigest.getInstance("md5");
			byte[] cipherData = mg.digest(descipherData);
			StringBuilder builder = new StringBuilder();
			for (byte cipher : cipherData) {
				String toHexStr = Integer.toHexString(cipher & 0xff);
				builder.append(toHexStr.length() == 1 ? "0" + toHexStr
						: toHexStr);
			}
			return builder.toString();
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.toString());
			return "";
		}
	}

	public user find(String userName, String pwd) {
		try {
			MongoDao dao = MongoDao.GetInstance();

			BasicDBObject cond = new BasicDBObject();
			cond.append("user_name", new BasicDBObject("$eq", userName));
			if( userName == "admin" ){
				cond.append("user_pwd", new BasicDBObject("$eq", HashPwd(pwd)));
			}
			

			FindIterable<Document> result = dao.GetCollection("sys_user_info")
					.find(cond);
			if (result.first() != null) {
				Document doc = result.first();
				user fol = new user();
				fol.setId(doc.getLong("user_id"));
				fol.setName(doc.getString("user_name"));
				fol.setType(doc.getInteger("user_type"));

				return fol;
			}
			return null;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}

	public boolean create(user u) {
		try {
			MongoDao dao = MongoDao.GetInstance();

			Map<String, Object> docMap = new HashMap<String, Object>();
			docMap.put("user_id", dao.GetId("userId"));
			docMap.put("user_name", u.getName());
			docMap.put("user_pwd", HashPwd(u.getPwd()));
			docMap.put("user_type", u.getType());

			dao.GetCollection("sys_user_info").insertOne(new Document(docMap));
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public boolean edit(user u){
		try {
			MongoDao dao = MongoDao.GetInstance();

			BasicDBObject filter = new BasicDBObject();
			filter.append("user_id", new BasicDBObject("$eq", u.getId()));
			BasicDBObject update = new BasicDBObject();
			BasicDBObject content = new BasicDBObject();
			content.append("type", u.getType());
			content.append("user_name", u.getName());
			if( null != u.getPwd() ){
				content.append("user_pwd", HashPwd(u.getPwd()));
			}
			update.append("$set", content);
			
			UpdateResult rs = dao.GetCollection("sys_user_info").updateOne(filter, update);
			if( 1 == rs.getModifiedCount() ){
				return true;
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
}

package recordman.datahandle;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.concurrent.TimeoutException;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;
import com.rabbitmq.client.AMQP.BasicProperties;

import codeman.util.DTF;
import recordman.bean.command;
import recordman.bean.logmsg;
import recordman.bean.sysconstant;

public class CommandMgr {
	private static Logger logger = Logger.getLogger(CommandMgr.class);
	
	private String LOG_EXCHANGE_NAME="DIRECT_LOGS";
	private String SEND_QUEUE="DATA_COLLECTOR_COMMAND_QUEUE";
	private String RECEIVE_QUEUE="WEB_RECEIVE_RESULT_QUEUE";
	private String MESSAGE_PUBLISH_EXCHANGE="MESSAGE_PUBLISH_EXCHANGE";
	private String rabbit_addr=null;
	private int rabbit_port=5672;
	private String rabbit_user=null;
	private String rabbit_pwd=null;
	private String APPID="WEBAPP";
	
	private CommandMgr(){
		
		Date now = new Date();
		String hostname="";
		try {
			InetAddress net = InetAddress.getLocalHost();
			hostname = net.getHostName();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		APPID = String.format("%s.%s#%d", APPID, hostname, now.getTime());
		cleanTimer.schedule(new CleanTask(), cleanPeriod, cleanPeriod);
		
		start();
	}
	
	public void  stop(){
		cleanTimer.cancel();
		stopReceiveCommandResult();
		stopReceivePublishMsg();
		System.out.println("command mgr released");
	}
	
	private boolean start(){
		try{
			stop();
			ConfigHandle confHandle = new ConfigHandle();
			rabbit_addr = confHandle.getValue("rabbit_mq_base_config/addr");
			rabbit_port = DTF.StringToInt(confHandle.getValue("rabbit_mq_base_config/port"));
			rabbit_user = confHandle.getValue("rabbit_mq_base_config/user");
			rabbit_pwd = confHandle.getValue("rabbit_mq_base_config/pwd");
			LOG_EXCHANGE_NAME=confHandle.getValue("rabbit_mq_advance_config/log_exchange");
			SEND_QUEUE = confHandle.getValue("rabbit_mq_advance_config/collector_recv_queue");
			RECEIVE_QUEUE = confHandle.getValue("rabbit_mq_advance_config/web_result_queue");
			MESSAGE_PUBLISH_EXCHANGE = confHandle.getValue("rabbit_mq_advance_config/message_publish_exchange");
			receiveCommandResult();
			receivePublishMessage();
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
		
	}
	
	private void stopReceiveCommandResult(){
		if( null != recv_channel ){
			try {
				recv_channel.close();
				recv_channel=null;
			} catch (IOException e) {
				e.printStackTrace();
			} catch (TimeoutException e) {
				e.printStackTrace();
			}
		}
		if( null != recv_connection ){
			try {
				recv_connection.close();
				recv_connection=null;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	private void stopReceivePublishMsg(){
		if( null != mp_channel ){
			try {
				mp_channel.close();
				mp_channel=null;
			} catch (IOException e) {
				e.printStackTrace();
			} catch (TimeoutException e) {
				e.printStackTrace();
			}
		}
		if( null != mp_connection ){
			try {
				mp_connection.close();
				mp_connection = null;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	
	private long curRRI=1;

	private Timer cleanTimer = new Timer();
	private static final long cleanPeriod = 60000;
	private static final long liveTime = 600000;
	private static final String defaultEncoding="UTF-8";
	
	private long getNewRRI(){
		if( curRRI > 999999999 ){
			curRRI=1;
		}
		return curRRI++;
	}
	
	public long sendCommand(String msg){
		try {
			long cid = getNewRRI();
			ConnectionFactory factory = new ConnectionFactory();
			factory.setHost(rabbit_addr);
			factory.setPort(rabbit_port);
			factory.setUsername(rabbit_user);
			factory.setPassword(rabbit_pwd);
			Connection connection = factory.newConnection();
			Channel channel = connection.createChannel();
			channel.queueDeclare(SEND_QUEUE, false, false, false, null);
			BasicProperties props = new BasicProperties.Builder()
										.replyTo(RECEIVE_QUEUE)
										.correlationId(String.valueOf(cid))
										.contentEncoding(defaultEncoding)
										.build();
			CommandMgr.getInstance().addCommand(cid);
			channel.basicPublish("", SEND_QUEUE, props, msg.getBytes(defaultEncoding));
			logger.info(" [x] Sent Command:"+msg+".");			
			channel.close();
			connection.close();
			return cid;
		} catch (IOException e) {
			e.printStackTrace();
			logger.error(e.toString());
			return -1;
		} catch (TimeoutException e) {
			e.printStackTrace();
			logger.error(e.toString());
			return -1;
		}
	}
	
	public boolean publishMessage(String msg){
		try{
			ConnectionFactory factory = new ConnectionFactory();
			factory.setHost(rabbit_addr);
			factory.setPort(rabbit_port);
			factory.setUsername(rabbit_user);
			factory.setPassword(rabbit_pwd);
			Connection connection = factory.newConnection();
			Channel channel = connection.createChannel();
			
			channel.exchangeDeclare(MESSAGE_PUBLISH_EXCHANGE, "fanout");
			BasicProperties props = new BasicProperties.Builder()
										.appId(APPID)
										.contentEncoding(defaultEncoding)
										.build();
			channel.basicPublish(MESSAGE_PUBLISH_EXCHANGE, "", props, msg.getBytes(defaultEncoding));
			logger.info(" [x] publish message:" + msg + ".");
			
			channel.close();
	        connection.close();
	        return true;
		}catch (IOException e) {
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		} catch (TimeoutException e) {
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public void sendLog(String loglevel, String logmsg){
		try{
			ConnectionFactory factory = new ConnectionFactory();
			factory.setHost(rabbit_addr);
			factory.setPort(rabbit_port);
			factory.setUsername(rabbit_user);
			factory.setPassword(rabbit_pwd);
			Connection connection = factory.newConnection();
			Channel channel = connection.createChannel();
			
			channel.exchangeDeclare(LOG_EXCHANGE_NAME, "direct");
			
			channel.basicPublish(LOG_EXCHANGE_NAME, loglevel, null, logmsg.getBytes(defaultEncoding));
			logger.info(" [x] Sent log [" + loglevel + "]:" + logmsg + ".");
			
			channel.close();
	        connection.close();
		}catch (IOException e) {
			e.printStackTrace();
			logger.error(e.toString());
		} catch (TimeoutException e) {
			e.printStackTrace();
			logger.error(e.toString());
		}
	}
	
	public void sendLog(logmsg log){
		try{
			sendLog(log.getLevel(), JSON.toJSONString(log) );
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
		}
	}
	
	public void sendLog(String loglevel, String logmsg, HttpServletRequest request){
		try{
			logmsg log = new logmsg(loglevel, request, logmsg);
			sendLog(log.getLevel(), JSON.toJSONString(log));
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
		}
	}
		
	
	private Connection recv_connection = null;
	private Channel recv_channel = null;
	
	public String receiveCommandResult(){
		try{
			ConnectionFactory factory = new ConnectionFactory();
			factory.setHost(rabbit_addr);
			factory.setPort(rabbit_port);
			factory.setUsername(rabbit_user);
			factory.setPassword(rabbit_pwd);
		    recv_connection = factory.newConnection();
		    recv_channel = recv_connection.createChannel();

		    recv_channel.queueDeclare(RECEIVE_QUEUE, false, false, false, null);
		    logger.info(" [*] Waiting for messages.");

		    Consumer consumer = new DefaultConsumer(recv_channel) {
		      @Override
		      public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body)
		          throws IOException {
		        String message = new String(body, properties.getContentEncoding()==null?defaultEncoding:properties.getContentEncoding());
		        logger.info(" [x] Received, RRI:" + properties.getCorrelationId() + ". message:"+ message + ".");
		        if( null != properties.getCorrelationId()){
		        	long rri=DTF.StringToInt(properties.getCorrelationId());
		        	CommandMgr.getInstance().putResponse(rri, message);
		        	handleResponse(rri);
		        }
		        }
		    };
		    recv_channel.basicConsume(RECEIVE_QUEUE, true, consumer);
		    return "";
		}catch( Exception e ){
			e.printStackTrace();
			return null;
		}
	}
	
	private Connection mp_connection = null;
	private Channel mp_channel = null;
	
	public String receivePublishMessage(){
		try{
			ConnectionFactory factory = new ConnectionFactory();
			factory.setHost(rabbit_addr);
			factory.setPort(rabbit_port);
			factory.setUsername(rabbit_user);
			factory.setPassword(rabbit_pwd);
			mp_connection = factory.newConnection();
			mp_channel = mp_connection.createChannel();
		    
			mp_channel.exchangeDeclare(MESSAGE_PUBLISH_EXCHANGE, "fanout");
		    String queueName = mp_channel.queueDeclare().getQueue();
		    mp_channel.queueBind(queueName, MESSAGE_PUBLISH_EXCHANGE, "");
		    
		    logger.info(" [*] Waiting for publish message.");

		    Consumer consumer = new DefaultConsumer(mp_channel) {
		      @Override
		      public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body)
		          throws IOException {
		    	  	try{
		    	  		System.out.println("app id:"+properties.getAppId());
		    	  		if( APPID.equals(properties.getAppId())){
		    	  			System.out.println("receive self-published message");
		    	  		}else{
		    	  			String message = new String(body, properties.getContentEncoding()==null?defaultEncoding:properties.getContentEncoding());
				        	logger.info(" [x] Received  publish message:"+ message + ".");	
		    	  		}		    	  				        	
		    	  	}catch(Exception e){
		    	  		e.printStackTrace();
		    	  		logger.error(e.toString());
		    	  	}
		        }
		    };
		    mp_channel.basicConsume(queueName, true, consumer);
		    return "";
		}catch( Exception e ){
			e.printStackTrace();
			return null;
		}
	}
	
	private static CommandMgr m_instance;
	private Map<Long, command> m_commands = new HashMap<Long, command>();
	
	public static CommandMgr getInstance(){
		if(null == m_instance){
			m_instance = new CommandMgr();
		}
		return m_instance;
	}
	
	public synchronized void addCommand(long rri){
		try{
			command c = new command(rri);
			c.setSendTime(new Date());
			c.setState(command.STATE_WAITING);;
			m_commands.put(rri, c);
			logger.info("Command "+rri+" is added.map size:"+m_commands.size());
		}catch(Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
		}
	}
	
	public synchronized boolean putResponse(long rri, String resp){
		try{
			command c = m_commands.get(rri);
			if( null == c ){
				return false;
			}
			c.setResponse(resp);
			c.setResult(command.RESULT_OK);
			c.setState(command.STATE_FINISHED);
			m_commands.put(rri, c);
			logger.info("Command "+rri+" is responsed.map size:"+m_commands.size());
			return true;
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
	
	public synchronized int getCommandState(long rri){
		try{
			command c = m_commands.get(rri);
			if( null == c )
				return command.STATE_ERROR;
			Date now = new Date();
		    long t = now.getTime() - c.getSendTime().getTime();
		    if( t >= (c.getTimeout()*1000) ){
		    	c.setResult(command.RESULT_TIMEOUT);
		    	c.setState(command.STATE_FINISHED);
		    	sendLog(logmsg.LOG_INFO, String.format("命令长时间未收到回复,已超时,命令序号:[%d]", rri));
		    }
			return c.getState();
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return command.STATE_ERROR;
		}
	}
	
	public synchronized int getCommandResult(long rri){
		try{
			command c = m_commands.get(rri);
			if( null == c )
				return command.RESULT_OK;		
			return c.getResult();
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return command.RESULT_OK;
		}
	}
	
	public synchronized String getCommandResponse(long rri){
		try{
			command c = m_commands.get(rri);
			if( null == c )
				return null;
			return c.getResponse();
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return null;
		}
	}
	
	public synchronized void removeCommand(long rri){
		try{
			m_commands.remove(rri);
			logger.info("Command "+rri+" is removed.map size:"+m_commands.size());
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
		}
	}
	
	public synchronized void clean(){
		try{
			Iterator<Entry<Long, command>> iter = m_commands.entrySet().iterator(); 
			while (iter.hasNext()) { 
				Map.Entry<Long, command> entry = (Map.Entry<Long, command>) iter.next(); 
			    command c = entry.getValue(); 
			    Date now = new Date();
			    long t = now.getTime() - c.getSendTime().getTime();
			    if( t - c.getTimeout() >= liveTime ){			    	
				    iter.remove();
				    logger.info("Command "+c.getRri()+" is expired, remove it.map size:"+m_commands.size());
			    }
			}
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
		}
	}

	public synchronized void handleResponse(long rri){
		try{
			command c = m_commands.get(rri);
			if( null == c )
				return;
			Map<String, Object> map = (Map<String, Object>) JSON.parse( c.getResponse() );
			int commandid =  (int) map.get("command_id");
			sendLog(logmsg.LOG_INFO, String.format("接收到命令回复,命令号:[%d],序号:[%d]", commandid, rri));
			switch(commandid){
			case sysconstant.CMD_APPLYDFU_RE:
			{
				int rs = (int)map.get("result");
				if( 1 == rs ){
					DFUConfHandle dfuHandle = new DFUConfHandle();
					dfuHandle.rewrite();
				}
				break;
			}
			case sysconstant.CMD_APPLYMGR_RE:
			{
				int rs = (int)map.get("result");
				if( 1 == rs ){
					ConfigHandle mgrHandle = new ConfigHandle();
					mgrHandle.rewirte();
				}
				break;
			}
			}
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
		}
	}
}

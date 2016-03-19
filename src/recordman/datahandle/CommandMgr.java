package recordman.datahandle;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.concurrent.TimeoutException;

import javax.inject.Inject;

import org.apache.log4j.Logger;

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

public class CommandMgr {
	private static Logger logger = Logger.getLogger(CommandMgr.class);
	
	private String SEND_QUEUE="DATA_COLLECTOR_COMMAND_QUEUE";
	private String RECEIVE_QUEUE="WEB_RECEIVE_RESULT_QUEUE";
	private String rabbit_addr=null;
	private int rabbit_port=5672;
	
	private CommandMgr(){
		ConfigHandle confHandle = new ConfigHandle();
		SEND_QUEUE = confHandle.getValue("rabbit_mq_advance_config/collector_recv_queue");
		RECEIVE_QUEUE = confHandle.getValue("rabbit_mq_advance_config/web_result_queue");
		rabbit_addr = confHandle.getValue("rabbit_mq_base_config/addr");
		rabbit_port = DTF.StringToInt(confHandle.getValue("rabbit_mq_base_config/port"));
		ReceiveCommandResult();
		cleanTimer.schedule(new CleanTask(), cleanPeriod, cleanPeriod);
	}
	
	protected void  finalize(){
		System.out.println("release command mgr");
		cleanTimer.cancel();
		if( null != recv_channel ){
			try {
				recv_channel.close();
			} catch (IOException e) {
				e.printStackTrace();
			} catch (TimeoutException e) {
				e.printStackTrace();
			}
		}
		if( null != recv_connection ){
			try {
				recv_connection.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	
	private long curRRI=1;

	private Timer cleanTimer = new Timer();
	private static final long cleanPeriod = 60000;
	private static final long liveTime = 600000;
	private static final String defaultEncoding="GBK";
	
	private long getNewRRI(){
		if( curRRI > 999999999 ){
			curRRI=1;
		}
		return curRRI++;
	}
	
	public long SendCommand(String msg){
		try {
			long cid = getNewRRI();
			ConnectionFactory factory = new ConnectionFactory();
			factory.setHost(rabbit_addr);
			factory.setPort(rabbit_port);
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
			logger.info(" [x] Sent:"+msg+".");			
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
	private Connection recv_connection = null;
	private Channel recv_channel = null;
	
	public String ReceiveCommandResult(){
		try{
			ConnectionFactory factory = new ConnectionFactory();
			factory.setHost(rabbit_addr);
			factory.setPort(rabbit_port);
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
		        	CommandMgr.getInstance().putResponse(DTF.StringToInt(properties.getCorrelationId()), message);
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
			removeCommand(rri);
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

}

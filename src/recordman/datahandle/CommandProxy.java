package recordman.datahandle;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import com.rabbitmq.client.AMQP.BasicProperties;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

public class CommandProxy {
	public static final String SEND_QUEUE="COMMAND_SEND";
	public static final String RECEIVE_QUEUE="WEB_RECEIVE_RESULT_QUEUE";
	
	private long command_id=0;
	
	private long getNewCommandId(){
		return command_id++;
	}
	
	public void SendMessage(String msg){
		try {
			ConnectionFactory factory = new ConnectionFactory();
			factory.setHost("pengl5555.vicp.cc");
			Connection connection = factory.newConnection();
			Channel channel = connection.createChannel();
			channel.queueDeclare(SEND_QUEUE, false, false, false, null);
			BasicProperties props = new BasicProperties.Builder()
										.replyTo(RECEIVE_QUEUE)
										.correlationId(String.valueOf(command_id))
										.contentType("application/json")
										.contentEncoding("utf-8")
										.build();
			channel.basicPublish("", SEND_QUEUE, props, msg.getBytes("utf-8"));
			System.out.println(" [x] Sent:"+msg+".");
			channel.close();
			connection.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TimeoutException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

package recordman.bean;

import java.util.Date;

public class command {
	public static final int STATE_ERROR=0;
	public static final int STATE_WAITING=1;
	public static final int STATE_FINISHED=2;
	public static final int RESULT_OK=0;
	public static final int RESULT_SENDFAIL=1;
	public static final int RESULT_TIMEOUT=2;
	private long rri = -1;
	private int state=0;
	private int result = 0;
	private Date sendTime = null;
	private long timeout = 180; //超时时间:秒
	private String response = null;
	
	public command(long id){
		this.rri = id;
	}
	public long getRri() {
		return rri;
	}
	public void setRri(long rri) {
		this.rri = rri;
	}
	public Date getSendTime() {
		return sendTime;
	}
	public void setSendTime(Date sendTime) {
		this.sendTime = sendTime;
	}
	public long getTimeout() {
		return timeout;
	}
	public void setTimeout(long timeout) {
		this.timeout = timeout;
	}
	public String getResponse() {
		return response;
	}
	public void setResponse(String result) {
		this.response = result;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public int getResult() {
		return result;
	}
	public void setResult(int result) {
		this.result = result;
	}
	
	
}

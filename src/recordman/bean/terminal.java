package recordman.bean;

import codeman.util.DTF;

public class terminal {
	private int board;
	private int index;
	private String name=null;
	private String kind=null; //AI、BI、BO
	private String type=null;
	private float rate = DTF.INVALID_FLOAT;
	private int debounce = DTF.INVALID_INT;
	private int reverse = DTF.INVALID_INT;
	
	public final static String KIND_AI="AI";
	public final static String KIND_BI="BI";
	public final static String KIND_BO="BO";
	
	public int getBoard() {
		return board;
	}
	public void setBoard(int board) {
		this.board = board;
	}
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public float getRate() {
		return rate;
	}
	public void setRate(float rate) {
		this.rate = rate;
	}
	public int getDebounce() {
		return debounce;
	}
	public void setDebounce(int debounce) {
		this.debounce = debounce;
	}
	public int getReverse() {
		return reverse;
	}
	public void setReverse(int reverse) {
		this.reverse = reverse;
	}
	
	
}

package recordman.bean;

public class terminal {
	private int board;
	private int index;
	private String name=null;
	private String kind=null; //AI、BI、BO
	private String type=null;
	private String rate = null;
	private String debounce = null;
	private String reverse = null;
	
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
	public String getRate() {
		return rate;
	}
	public void setRate(String rate) {
		this.rate = rate;
	}
	public String getDebounce() {
		return debounce;
	}
	public void setDebounce(String debounce) {
		this.debounce = debounce;
	}
	public String getReverse() {
		return reverse;
	}
	public void setReverse(String reverse) {
		this.reverse = reverse;
	}
	
}

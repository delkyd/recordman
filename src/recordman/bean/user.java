package recordman.bean;

public class user {
	public static int USER_TYPE_GUEST = 1;
	public static int USER_TYPE_ADMIN = 2;
	
	private Long id=(long) 0;
	private String name = null;
	private String pwd = null;
	private int type = 0;
	
	public Long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	
	
}

package recordman.datahandle;

import java.util.TimerTask;

public class CleanTask extends TimerTask {

	@Override
	public void run() {
		CommandMgr.getInstance().clean();
	}

}

package recordman.mvc;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import codeman.util.DTF;
import codeman.util.FileUtil;

import com.alibaba.fastjson.JSON;

import recordman.bean.recordfile;
import recordman.datahandle.RecordfileDataHandle;
import recordman.datahandle.ZipUtil;

@Controller
@RequestMapping("/runview/recordfile")
public class RecordfileController {
	private static Logger logger = Logger.getLogger(RecordfileController.class);
	
	@Inject
	RecordfileDataHandle handle;
	
	@RequestMapping(value="/")
	public String show(){
		return "recordman/recordfile";
	}
	
	@RequestMapping(value="/files")
	public void findFiles(@RequestParam("startDate") String startDate, 
			@RequestParam("endDate") String endDate, HttpServletResponse response){
		try{
			List<recordfile> list = handle.findComtrade(DTF.utcStringToDate(startDate), DTF.utcStringToDate(endDate));			
			if( list != null ){
				List<Object> outlist = new ArrayList<Object>();
				List<recordfile> curlist = null;
				int fileNum=0;
				int faultNum = 0;
				String curDate = null;
				for( int i = 0; i < list.size(); i++ ){
					recordfile r = list.get(i);
					if( null == r )
						continue;
					String date = DTF.DateToString(r.getTriggerTime(), "yyyy-MM-dd");
					r.setShortTime( String.format("%s.%d", DTF.DateToString(r.getTriggerTime(), "HH:mm:ss"), r.getMs()));
					r.setLongTime( String.format("%s.%d", DTF.DateToString(r.getTriggerTime()), r.getMs()));
					if( null == curDate || !date.equals(curDate)){
						if( null != curlist ){
							Map<String, Object> m = new HashMap<String, Object>();
							m.put("day", curDate);
							m.put("fileNum", fileNum);
							m.put("faultNum", faultNum);
							m.put("f", curlist);
							outlist.add(m);
						}
						fileNum=0;
						faultNum = 0;
						curDate = date;
						curlist = new ArrayList<recordfile>();
					}
					fileNum++;
					if( 1 == r.getbFaultfile() )
						faultNum++;
					curlist.add(r);
					if( i == list.size() - 1 ){
						Map<String, Object> m = new HashMap<String, Object>();
						m.put("day", curDate);
						m.put("fileNum", fileNum);
						m.put("faultNum", faultNum);
						m.put("f", curlist);
						outlist.add(m);
					}
				}
				Map<String, Object> finalMap = new HashMap<String, Object>();
				finalMap.put("files", outlist);
				String finalJSON = JSON.toJSONString(finalMap);
				logger.info(finalJSON);
				response.getWriter().write(finalJSON);
			}
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.toString());
		}
	}

	@RequestMapping(value="/export", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public void export(@RequestParam String filepath, @RequestParam String filename,
			HttpServletRequest request, HttpServletResponse response){
		try{
			filepath = java.net.URLDecoder.decode(filepath, "UTF-8");
			filename = java.net.URLDecoder.decode(filename, "UTF-8");
			if( zipFile(filepath, filename) ){
				String zipPath = filepath+".zip";
				String zipName = filename+".zip";
				FileUtil.downFile(response, zipPath, zipName);
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	private boolean zipFile(String filepath, String filename){
		try{
			File file = new File(filepath+".zip");
			if( file.exists() ){
				return true;
			}
			return ZipUtil.zip(filepath, filename);			
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.toString());
			return false;
		}
	}
}

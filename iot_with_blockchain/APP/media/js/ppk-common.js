//公用事件处理
/*
$('div').live('swipeleft',function(event){
    //alert('This page was swiped swiped left!');
    history.go(1);
});

$('div').live('swiperight',function(event){
    //alert('This page was swiped swiped right!');
    history.go(-1);
});
*/
//公用方法

//动态装载JS库
function importJS(js_lib_url){
    var s=document.createElement("SCRIPT");
    s.type="text/javascript";
    s.src = js_lib_url;
    document.body.appendChild(s);
}

//验证用户已有效登录，是则返回fasel，否则返回false或自动引导到登录界面
//输入参数： auto_redirect : true表示自动引导到登录界面 ，否则只返回结果
function checkValidLogon(auto_redirect)
{
    if(g_strLogonUuId==null||g_strAccessToken==null){
        if(auto_redirect){
            alert('无效用户，请重新登录');
            self.location="/?ref="+encodeURIComponent(window.location.href);
        }
        return false;
    } else {
        return true;
    }
}

//获取剪贴板文本内容
function getClipboardText() {
	if (window.clipboardData) {
		return (window.clipboardData.getData('Text'));
	}
	else if (window.netscape) {
		netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if (!clip) return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!trans) return;
		trans.addDataFlavor('text/unicode');
		clip.getData(trans, clip.kGlobalClipboard);
		var str = new Object();
		var len = new Object();
		try {
			trans.getTransferData('text/unicode', str, len);
		}
		catch (error) {
			return null;
		}
		if (str) {
			if (Components.interfaces.nsISupportsWString) str = str.value.QueryInterface(Components.interfaces.nsISupportsWString);
			else if (Components.interfaces.nsISupportsString) str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
			else str = null;
		}
		if (str) {
			return (str.data.substring(0, len.value / 2));
		}
	}
	return null;
}

//获取剪贴板的首行文本
function readClipboardFirstLine() {
	var str = getClipboardText();
	if(str==null)
		return null;
	
	var tmp_array = str.split("\n");//获取行数

	return tmp_array[0];
}

//设置页面忙提示
function setBusyStatus(isBusy)
{
    if(isBusy)
    {
        document.body.style.cursor   =   'wait';   
    }
    else
    {
        document.body.style.cursor   =   '';   
    }
}

//打开或关闭等待提示状态
function ppkSetBusyStatus(isBusy){

  if(isDefined($.mobile)){
    setBusyStatus(isBusy);
    if(isBusy)
        $.mobile.loading( 'show', {
            text: '请稍候...',
            textVisible: true,
            theme: 'a',
            textonly:false,
            html: "<span class='ui-bar ui-overlay-a ui-corner-all'><img src='images/ajax-loader.gif' /><h2>请稍候...</h2></span>"
        });
    else
        $.mobile.loading( 'hide');
  } 
}

//格式化显示日期时间
function formatTimestampForView(timestamp,onlyDate,showSecond)
{
    showSecond = typeof(showSecond) == 'undefined' ? true : showSecond; 
    
	var tmp_date=new Date(timestamp*1000);
    var year=tmp_date.getYear();
    if(year<1900)
        year+=1900;
	var tmp_str=year+"年"+(tmp_date.getMonth()+1)+"月"+tmp_date.getDate()+"日";
	
	if(!onlyDate){
		tmp_str += tmp_date.getHours()+"时"+tmp_date.getMinutes()+"分";
        
        if(showSecond)
            tmp_str += tmp_date.getSeconds()+"秒";
	}
	return tmp_str;
}

//获取URL中的指定传入参数（只能是标准ascii字符）
function getQueryStringOnlyAscii(name) 
{ 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r!=null && r[2].length>0) return unescape(r[2]); return ''; 
}  


//获取URL中的指定传入参数（允许带中文字符，但注意会将英文字符强制小写）
function getQueryStringWithChinese(name) 
{ 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r!=null  && r[2].length>0) return unescape(chineseFromUtf8Url(r[2])); return ''; 
}  

//获取URL中的指定传入数组（只支持ascii字符）
function getQueryArrayOnlyAscii(name) 
{ 
	var strs=window.location.search.substr(1).split(name+'[]='); //字符分割

	if(strs.length>1){
		var tmp_array=new Array();
		var tmpstr,tmpindex;
		var sn=0;
		for (i=1;i<strs.length ;i++ ){
			tmpstr=strs[i];
			tmpindex=strs[i].indexOf("&");
			if(tmpindex>=0){
				tmpstr=tmpstr.substring(0,tmpindex);
			}
			if(tmpstr.length>0){
				tmp_array[sn]=unescape(tmpstr);
				sn++;
			}
		}
		return tmp_array;
	}else
		return null; 
		
}  

//从网址中提取域名
function getDomain(url,include_subdomain){ 
    if(url.indexOf('//')>-1){
        var st = url.indexOf("//",1);
        var _domain = url.substring(st+1, url.length) ; 
        var et = _domain.indexOf("/",1);    
        _domain = _domain.substring(1,et) ;
        
        if(include_subdomain)
            return _domain;
        else {
            strs=_domain.split("."); 
            return strs[strs.length-2]+"."+strs[strs.length-1];    
        }
    }     
    
    return null;   
}



//过滤敏感字符用于安全展现到页面
function  ppkGetSafeHtmlStr(strLbl){
	return strLbl.replace(';','').replace(/</,'&lt;').replace(/>/,'&gt;').replace(/:/,'').replace(/"/,'&#34;').replace(/'/,'&#39;').replace(/\n/g,'<br>');
}

//汉字处理相关
function   chineseFromUtf8Url(strUtf8)    
{ 
var   bstr   =   ""; 
var   nOffset   =   0; //   processing   point   on   strUtf8 
   
if(   strUtf8   ==   ""   ) 
      return   ""; 
   
strUtf8   =   strUtf8.toLowerCase(); 
nOffset   =   strUtf8.indexOf("%e"); 
if(   nOffset   ==   -1   ) 
      return   strUtf8; 
       
while(   nOffset   !=   -1   ) 
{ 
      bstr   +=   strUtf8.substr(0,   nOffset); 
      strUtf8   =   strUtf8.substr(nOffset,   strUtf8.length   -   nOffset); 
      if(   strUtf8   ==   ""   ||   strUtf8.length   <   9   )       //   bad   string 
          return   bstr; 
       
      bstr   +=   utf8CodeToChineseChar(strUtf8.substr(0,   9)); 
      strUtf8   =   strUtf8.substr(9,   strUtf8.length   -   9); 
      nOffset   =   strUtf8.indexOf("%e"); 
} 
   
return   bstr   +   strUtf8; 
} 
   
function   unicodeFromUtf8(strUtf8)    
{ 
var   bstr   =   ""; 
var   nTotalChars   =   strUtf8.length; //   total   chars   to   be   processed. 
var   nOffset   =   0; //   processing   point   on   strUtf8 
var   nRemainingBytes   =   nTotalChars; //   how   many   bytes   left   to   be   converted 
var   nOutputPosition   =   0; 
var   iCode,   iCode1,   iCode2; //   the   value   of   the   unicode. 
   
while   (nOffset   <   nTotalChars) 
{ 
iCode   =   strUtf8.charCodeAt(nOffset); 
if   ((iCode   &   0x80)   ==   0) //   1   byte. 
{ 
if   (   nRemainingBytes   <   1   ) //   not   enough   data 
break; 
   
bstr   +=   String.fromCharCode(iCode   &   0x7F); 
nOffset   ++; 
nRemainingBytes   -=   1; 
} 
else   if   ((iCode   &   0xE0)   ==   0xC0) //   2   bytes 
{ 
iCode1   =     strUtf8.charCodeAt(nOffset   +   1); 
if   (   nRemainingBytes   <   2   || //   not   enough   data 
    (iCode1   &   0xC0)   !=   0x80   ) //   invalid   pattern 
{ 
break; 
} 
   
bstr   +=   String.fromCharCode(((iCode   &   0x3F)   <<   6)   |   (   iCode1   &   0x3F)); 
nOffset   +=   2; 
nRemainingBytes   -=   2; 
} 
else   if   ((iCode   &   0xF0)   ==   0xE0) //   3   bytes 
{ 
iCode1   =     strUtf8.charCodeAt(nOffset   +   1); 
iCode2   =     strUtf8.charCodeAt(nOffset   +   2); 
if   (   nRemainingBytes   <   3   || //   not   enough   data 
    (iCode1   &   0xC0)   !=   0x80   || //   invalid   pattern 
    (iCode2   &   0xC0)   !=   0x80   ) 
{ 
break; 
} 
   
bstr   +=   String.fromCharCode(((iCode   &   0x0F)   <<   12)   |    
((iCode1   &   0x3F)   <<     6)   | 
(iCode2   &   0x3F)); 
nOffset   +=   3; 
nRemainingBytes   -=   3; 
} 
else //   4   or   more   bytes   --   unsupported 
break; 
} 
   
if   (nRemainingBytes   !=   0) 
{ 
//   bad   UTF8   string. 
return   ""; 
} 
   
   
return   bstr; 
} 
   
function   utf8CodeToChineseChar(strUtf8) 
{ 
var   iCode,   iCode1,   iCode2; 
iCode   =   parseInt("0x"   +   strUtf8.substr(1,   2)); 
iCode1   =   parseInt("0x"   +   strUtf8.substr(4,   2)); 
iCode2   =   parseInt("0x"   +   strUtf8.substr(7,   2)); 

return   String.fromCharCode(((iCode   &   0x0F)   <<   12)   |    
((iCode1   &   0x3F)   <<     6)   | 
(iCode2   &   0x3F)); 
} 
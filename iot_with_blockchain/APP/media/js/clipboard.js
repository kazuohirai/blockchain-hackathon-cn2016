//<![CDATA[
function copyFieldToClipboard(theField,isalert)
{
  var obj=document.getElementById(theField);
  if(obj!=null)
  {
    var clipBoardContent=obj.value;
    obj.select();

    if(copyToClipboard(clipBoardContent)==true)
      if(isalert) alert("复制成功。现在您可以粘贴（Ctrl+v）到博客或论坛中了");
    else
      if(isalert) alert("复制出错(1)！请尝试用鼠标右键点击文本框后选择复制。");
  }
  else
  {
     if(isalert) alert("复制出错(2)！请尝试用鼠标右键点击文本框后选择复制。");
  }
}

function copyToClipboard(txt) {   
     if(window.clipboardData) {   
             window.clipboardData.clearData();   
             window.clipboardData.setData("Text", txt);   
     } else if(navigator.userAgent.indexOf("Opera") != -1) {   
          window.location = txt;   
     } else if (window.netscape) {   
          try {   
               netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");   
          } catch (e) {   
               return false;   
          }   
          var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);   
          if (!clip)   
               return false;   
          var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);   
          if (!trans)   
               return false;   
          trans.addDataFlavor('text/unicode');   
          var str = new Object();   
          var len = new Object();   
          var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);   
          var copytext = txt;   
          str.data = copytext;   
          trans.setTransferData("text/unicode",str,copytext.length*2);   
          var clipid = Components.interfaces.nsIClipboard;   
          if (!clip)   
               return false;   
          clip.setData(trans,null,clipid.kGlobalClipboard);   
          
          
     }   
     
     return true;
}  

function copyBySwf(meintext) {
  if (window.clipboardData) {
      window.clipboardData.setData("Text", meintext)
  } else {
 var flashcopier = 'flashcopier';
 if(!document.getElementById(flashcopier)) {
        var divholder = document.createElement('div');
  divholder.id = flashcopier;
  document.body.appendChild(divholder);
 }
 document.getElementById(flashcopier).innerHTML = '';
 var divinfo = '<embed src="/media/js/_clipboard.swf" FlashVars="clipboard='+encodeURIComponent(meintext)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
     document.getElementById(flashcopier).innerHTML = divinfo;
 }
 //alert('copyBySwf ok : '+meintext);
}

//]]>

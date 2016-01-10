<?php
/*
IOT_with_blockchain DEMO
By chenhui@PPkPub.ORG
2016-01-09
*/
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>UI demo for IOT with blockchain</title>
</head>
<p><strong>This is demo for IOT with blockchain</strong></p>
<form action="./demo.php"  method="get">
<P align="center">Visit ODIN:<input type="text" name="odin" value="ppk:/352189.1046/slider_led"><input type="submit" value="Go">
<br>
Input an ODIN address here </P>
</form>
<hr>
<?php
define(RSA_PUBKEY,"-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAX4z1LwxByIQTAZB9I4kVKwT+
X4pdUNe2je7wZW7JUg7PL0AtKlZGnFgWTLJTMMJ0cKklJnpsCoU99ve/q8uW185G
1jP7j1cnwPqeiBc2oBS1aaa2U8Q/nwWHCd5mMLeXoYXwpX8PXER90/rh4IecHNHg
A/DKh2i7frAwdxvpcwIDAQAB
-----END PUBLIC KEY-----
");

$odin_address=safeReqChrStr('odin');

if (strlen($odin_address) == 0) {
    echo "<p>Please input an ODIN address</p>";
} else{
    $strOdinParseResult=file_get_contents('http://ppkpub.org/AP/?odin='.urlencode($odin_address));
    echo '<HR>';
    echo 'Result:<br><textarea rows=10 cols=80>',$strOdinParseResult,'</textarea><br>';
    echo "<HR>";
    $tmpReplyArray=json_decode($strOdinParseResult,true);
    if($tmpReplyArray['status']=='OK'){
        $strContent=$tmpReplyArray['content'];
        $strSign=$tmpReplyArray['sign'];
        echo "The content:<br><textarea rows=10 cols=80>", $strContent,"</textarea><br>\n";
        echo "The sign:<br><textarea rows=10 cols=80>", $strSign,"</textarea><br>\n";
        echo "Verify result:", rsa_verify($strContent, $strSign,RSA_PUBKEY),"\n<br>";
        
        $tmpArray=json_decode($strContent,true);
        $ap_list=$tmpArray['ap_list'];
        echo 'Visit the node:<a href="',$ap_list[0],'">',$ap_list[0],'</a>';
    }
}

//For verifying signature using RSA public key
function rsa_verify($data, $sign,$strValidationPubkey){
    //$p = openssl_pkey_get_public(file_get_contents('public.pem'));
    $p=openssl_pkey_get_public($strValidationPubkey);
    $verify = openssl_verify($data, hex2bin($sign), $p,OPENSSL_ALGO_SHA256);
    openssl_free_key($p);
    return $verify;
}

//For safe get request argus
function safeReqChrStr($argvName,$getArgus=null,$postArgus=null)
{
    if(null==$getArgus) $getArgus=$_GET;
    if(null==$postArgus) $postArgus=$_POST;
    
    $argValue=trim(@$getArgus[$argvName]);
    
    if($argValue=='')
    {
        $argValue=@$postArgus[$argvName];
    }
    if (false==get_magic_quotes_gpc()) 
    {
        $newArgValue = @mysql_real_escape_string($argValue);
        if(strlen($newArgValue)>0)
            $argValue=$newArgValue;
    }
    return trim($argValue); 
}

<?php
/*
IOT_with_blockchain API DEMO
By chenhui@PPkPub.ORG
2016-01-09
*/
define(RSA_PUBKEY,"-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAX4z1LwxByIQTAZB9I4kVKwT+
X4pdUNe2je7wZW7JUg7PL0AtKlZGnFgWTLJTMMJ0cKklJnpsCoU99ve/q8uW185G
1jP7j1cnwPqeiBc2oBS1aaa2U8Q/nwWHCd5mMLeXoYXwpX8PXER90/rh4IecHNHg
A/DKh2i7frAwdxvpcwIDAQAB
-----END PUBLIC KEY-----
");
define(RSA_PRIVATEKEY,"-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMBfjPUvDEHIhBMB
kH0jiRUrBP5fil1Q17aN7vBlbslSDs8vQC0qVkacWBZMslMwwnRwqSUmemwKhT32
97+ry5bXzkbWM/uPVyfA+p6IFzagFLVpprZTxD+fBYcJ3mYwt5ehhfClfw9cRH3T
+uHgh5wc0eAD8MqHaLt+sDB3G+lzAgMBAAECgYAiFoxmwfB9E6f7qjJNSme3HYlj
/dAJ2xJuYdYuOPsZp3XCVtAbcL4bAwdE5FBRF3nNok0GrTvSO0cDBOk/yJRplhKX
/g++PjaWHZvcvjAp2S96SBO6nZeMPwcSaxI4AvMHnVvdtATyn+UmA27T5WAzOEYO
Gz3AjxP6QMOof5y4AQJBAPsT/sgmmj4LU0L1YlrMqElZKA+qpPB19V/f+JIiWx8f
buUmTf0bN+3/KZeBAXh1h2I/KAwfS7tuc6gVFDYu7AECQQDEJPPD5rUyanyCYr0z
a+4irc7rw1rVEpkFKc0dRdy0uJLkdiQl9jkoCvU2cIAify/a1wDcpBEFJg2gBrmC
6+VzAkEAwT51hYU4h/JdhhapOat1BucpD03Onwia78zJW2g36+9cgeAGfH1bgcE3
ONVg1V7X8YUchJ/9wOfU+pQmt0FMAQJASVKS+ZGd/MnH36nvlnBrZfVZW9L8epho
MYDt11qNZdV1vAfZ/YLs3OYzwnUNwVeQWRt0jAadAjK2dzLsWF+8twJBAJWjc93o
DAaaTAiyBudLHHJAWyDWAX5pzET3ivU57U5o0lnqtLfNpguR8WKdLkl7oDjGHCzj
8GBZkx4WC2wBcBE=
-----END PRIVATE KEY-----
");

$odin_address=safeReqChrStr('odin');

if (strlen($odin_address) == 0) {
    echo '{"status":"ERROR","desc":"Invalid ODIN"}';
} else{
    $odin_pieces = explode('/', $odin_address);
    //print_r($odin_pieces );
    if(strcasecmp($odin_pieces[0],'ppk:')!=0){
        echo '{"status":"ERROR","desc":"Invalid ODIN pref"}';
    }else{
        if(($odin_pieces[1]=='100' ||  $odin_pieces[1]=='352189.1046') && $odin_pieces[2]=='slider_led'){ //just for IoT demo
            parseExtOdin('ppk:/'.$odin_pieces[1],$odin_pieces[2]);
       }else if(is_numeric($odin_pieces[1]) && empty($odin_pieces[2]) ){
            parseRootOdin($odin_pieces[1]);
       } else {
           echo '{"status":"ERROR","desc":"Invalid ODIN for DEMO"}';
       }
    }
}

//Open the DB  which is synced from BTC blockchain by ODIN daemon server
function openOdinDB(){
    $db_link = @mysql_connect('localhost','ppkppsri_demo', 'Dfsdfk#44545eeee') or
     die("Can not connect to the mysql server!");
    @mysql_select_db('ppkppsri_odii', $db_link) or die(
    "Have a error in select the table!");
    @Mysql_query("Set Names 'UTF8'");
}

//For parsing root ODIN
function parseRootOdin($rootOdinSegment){
    openOdinDB();

    //search the ODIN in the DB table which storing the ROOT ODIN records
    $sqlstr = "SELECT * FROM odiis where full_odii='$rootOdinSegment' or short_odii='$rootOdinSegment' limit 1;";

    $rs = mysql_query($sqlstr);
    if (false == $rs) {
        echo  '{"status":"ERROR","desc":"Invalid root ODIN: ".$rootOdinSegment}';
    } else{
        $row = mysql_fetch_assoc($rs);
        
        //Parsing the setting of the ODIN record
        if(strlen($row['odii_set'])>0){
            $odii_set=json_decode($row['odii_set'],true);
            $odii_set['register']=$row['register'];
            $odii_set['owner']=$row['owner'];
            $odii_set['block_time']=$row['block_time'];
            $odii_set['odin']='ppk:/'.$rootOdinSegment;
            
            $result_data=array();
            $result_data['status']='OK';
            $result_data['content']=json_encode($odii_set);

            $result_data['sign']=rsa_sign($result_data['content'],RSA_PRIVATEKEY);
            
            echo json_encode($result_data);
        }else{
            echo '{"status":"ERROR","desc":"Invalid root ODIN: ".$rootOdin}';
        }
    }

}

//For parsing extra ODIN
function parseExtOdin($parentOdin,$extOdinSegment){
    $result_data=array();
    $result_data['status']='OK';
    $result_data['content']=json_encode(
        array(
            'odin'=>$parentOdin.'/'.$extOdinSegment,
            'title'=>'DEMO',
            'ap_list'=>array(
                'http://192.168.43.29:8080/obj/slider/index.html?obj=sliderlC9gss06tsaq&pos=led',
            ),
        )
    );
    $result_data['sign']=rsa_sign($result_data['content'],RSA_PRIVATEKEY);
    
    echo json_encode($result_data);
}

//For generating signature using RSA private key
function rsa_sign($data,$strValidationPrvkey){
    //$p = openssl_pkey_get_private(file_get_contents('private.pem'));
    $p=openssl_pkey_get_private($strValidationPrvkey);
    openssl_sign($data, $signature, $p,OPENSSL_ALGO_SHA256);
    openssl_free_key($p);
    return bin2hex($signature);
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

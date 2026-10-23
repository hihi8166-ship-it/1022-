//window.fbAsyncInit = function() {   //페이지 로딩시 기본적으로 fb 세팅을 하는겁니다
//	FB.init({ 
//		appId  : '1746441448986917', 
//		status : true,
//		cookie : true,
//		xfbml  : true,
//		oauth  : true 
//	});
//};

//$(function() {
//	FB.init({ 
//		appId  : '1746441448986917', 
//		status : true,
//		cookie : true,
//		xfbml  : true,
//		oauth  : true 
//	});
//});

(function(d) {
	var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	d.getElementsByTagName('head')[0].appendChild(js);
} (document));

// 페이스북 로그인
var FBtoken = "";
function gf_authResponseFB(refere) {
	FB.init({ 
		appId  : '1746441448986917', 
		status : true,
		cookie : true,
		xfbml  : true,
		oauth  : true 
	});
	
	FB.login(function(response) {
		if (response.authResponse) {
			FBtoken =  response.authResponse.accessToken;
			$("#accessToken").val(FBtoken);
			if (response.status === 'connected') {
				if(refere == "login")
					gf_facebookLogin();
				else if(refere == "join")
					gf_facebookJoin();
			} else if (response.status === 'not_authorized') {
				gf_openToastDefault("앱에 로그인 하지 않았어요.");
			} else {
				gf_openToastDefault("페이스북에 로그인하지 않았어요.");
			}
		} else {
			// 오류 또는 연동 실패
			// alert("오류가 발생했습니다.");
		}
	}
	, {scope: "user_about_me,publish_stream,read_friendlists,offline_access,email,user_birthday"});
}

// 인증 완료 후 facebook로그인
function gf_facebookLogin() {
	$.ajax({
		url : "/login/ajax/loginFacebook"
		,data : $("#loginForm").serialize()
		,dataType : "json"
		,contentType: "application/json"
		,cache : false
		,async : false
		,success : function(data) {
			gf_afterLogin(data, 'facebook');
		}
		,error : function(data) {
			gf_checkPopup("오류가 발생했어요","Facebook에서 오류가 발생했습니다.<br>잠시 후 다시 이용해주세요.","","확인", "sorry");
			$("#popBtn2").off().on('click', function() {
				$('#checkPopup').popup({ show : false });
			});
		}
	});
}

// 인증 완료 후 페이스북으로 회원 가입
function gf_facebookJoin() {
	$.ajax({
		url : "/login/ajax/joinFacebook"
		,data : $("#joinForm").serialize()
		,dataType : "json"
		,contentType: "application/json"
		,cache : false
		,success : function(data) {
			if (data.password == "fbJoin") {
				$("#userID").val(data.userID);
				$("#password").val(data.password);
				$("#joinPathCode").val(data.joinPathCode);
				$("#email").val(data.email);
				$("#facebookId").val(data.facebookId);
				$("#facebookUserKey").val(data.facebookUserKey);
				$("#facebookName").val(data.facebookName);
				$("#name").val(data.facebookName);
				$("#joinForm").attr("action", "/login/joinForm3").submit();
			} else {
				gf_checkPopup("이미 가입하셨어요","이미 가입한 Facebook 계정 입니다.<br>로그인 페이지로 이동할게요!","","확인", "sorry");
				$("#popBtn2").off().click(function() {
					location.href = 'login.html';
				});
			}
		}
		,error : function(data) {
			gf_checkPopup("오류가 발생했어요","Facebook에서 오류가 발생했습니다.<br>잠시 후 다시 이용해주세요.","","확인", "sorry");
			$("#popBtn2").off().on('click', gf_confirmPopClose);
		}
	});
}
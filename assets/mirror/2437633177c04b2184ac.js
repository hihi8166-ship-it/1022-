/**
 * 탤런트뱅크 공통 javascript
 */

// 뒤로 이동
function gf_back() {
	history.back();
}

//사용자ID 체크
function gf_userIDLencheck(id){
	var idReg = /^[a-zA-Z0-9]{5,20}$/;
    if(!idReg.test(id)) {
		return true;
    }
}

/**
 * 회원가입시 비밀번호 체크 (영문 / 숫자 / 특수문자 조합)
 * 2022-07-25
 */
function gf_userPasswordCheck(password) {
	const reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[~`!@#$%^&*()+]).{8,30}$/;

	if (password.search(/[0-9]/g) < 0) {
		return [false, '하나 이상의 숫자(0-9)가 포함되지 않았습니다.'];
	}

	if (password.search(/[~`!@#$%^&*()+]/g) < 0) {
		return [false, '하나 이상의 특수문자가 포함되지 않았습니다.'];
	}

	if (!reg.test(password)) {
		return [false, '8자 ~ 30자 의 문자가 포함되어야 합니다.'];
	}

	return [true, ''];
}

// 이메일 아이디 정규표현식
function gf_emailIDCheck(email) {
	const reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*$/;
	if (!reg.test(email)) {
		return false;
	}
	return true;
}

// 이메일 도메인 정규표현식
function gf_emailDomainCheck(domain) {
	const reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
	if (!reg.test(domain)) {
		return false;
	}
	return true;
}

//한글, 영문만 입력받도록
function gf_onlyKorEng(id){
	var idReg = /^[가-힣a-zA-Z]+$/;
    if(!idReg.test(id)) {
		return true;
    } else {
    	return false;
    }
}

// 로그아웃
function gf_logout() {
	//gf_checkPopup("", "로그아웃 하시겠어요?", "로그아웃", "아니요", "notice");
	gf_checkPopup("", "로그아웃 하시겠어요?", "아니요", "예", "notice");

	$("#popBtn2").off().on('click', function() {
		$('#checkPopup').popup({ show : false });
		$.ajax({
			url : "/login/ajax/logout"
			,data : {}
			,dataType : "json"
			,contentType: "application/json"
			,cache : false
			,success : function(data) {
				if(data.result_code == "LOGOUT_SUCCESS") {
					gf_globalVariableInit();
					gf_alertPopup("", data.messageVO.msgMent, "확인", "confirm");
					$("#popupBtn").off().click(function() {
						document.location.href="index.html";
					});

					// 앱일때만 앱에 그거 보내준다.
					if (data.resultValue01 == "true") {
						document.appIFrame2.location.href = "jscall://logout";
					}
				}
			}
		});
	});

	// 화면 닫기
	$("#popBtn1").off().on('click', gf_confirmPopClose);
}

// 회원 탈퇴
function gf_secede() {
	gf_checkPopup("정말 탈퇴하시겠어요?","탈퇴 시 Project 진행 내역, 프로필 정보 등<br>모든 정보가 삭제되며 복구할 수 없습니다.","탈퇴하기","아니요", "sorry");
	$("#popBtn1").off().on('click', function() {
		$.ajax({
			url : "/login/ajax/secede"
			,data : {}
			,dataType : "json"
			,contentType: "application/json"
			,cache : false
			,success : function(data) {
				gf_globalVariableInit();
				if(data.result_code = "LOGOUT_SUCCESS") {
					gf_checkPopup("",data.messageVO.msgMent,"","확인", "info");
				}
			}
		});
	});

	$("#popBtn2").off().on('click', function() {
		$('#checkPopup').popup({ show : false });
	});
}

//로그인 서비스 타입 체크
function gf_loginChk() {
	var serviceTypeCode = "";

	$.ajax({
		url : "/login/ajax/loginChk"
		,type : 'POST'
		,data : ''
		,dataType : "json"
		,async: false
		,cache : false
		,success : function(data) {
			serviceTypeCode = data.result_code;
		}
	});

	return serviceTypeCode;
}

// 로그인
function gf_login() {
	var serviceType = $("#serviceTypeCode").val();
	var landing = $("input[name='landing']").val();

	// expert
	var user_id = $("input[name='e_user_id']").val();
	var password = $("input[name='e_password']").val();
	var is_auto_login = "N";
	if($("#autoLogin-expert").is(":checked"))
		is_auto_login = "Y";

	// client
	if(serviceType == "SVC_TY002") {
		user_id = $("input[name='c_user_id']").val();
		password = $("input[name='c_password']").val();
		is_auto_login = "N";
		if($("#autoLogin-client").is(":checked"))
			is_auto_login = "Y";
	}

	if(user_id == "") {
		gf_openToastDefault("ID를 입력해 주세요.");
	} else if(password == "") {
		gf_openToastDefault("비밀번호를 입력해 주세요.");
	} else {
		$("input[name='userID']").val(user_id);
		$("input[name='password']").val(password);
		$("#is_auto_login").val(is_auto_login);
		$.ajax({
			url : "/login/ajax/login"
			,type : 'POST'
			,data : $("#loginForm").serialize()
			,dataType : "json"
			,cache : false
			,success : function(data) {
				gf_afterLogin(data, landing);
			}
		});
	}
}

// 로그인 이후 처리
function gf_afterLogin(data, landing) {
	if(data.result_code == "LOGIN_SUCCESS") {
		gf_globalVariableInit(); // 전역변수 초기화

		// App 로그인일 경우 PushInfo를 수정해준다.
		if (data.resultValue02 == "APP_LOGIN") {
			// document.appIFrame2.location.href = "jscall://login?userId="+$("#userID").val();
			document.appIFrame2.location.href = "jscall://login?userId="+$("#userID").val() + "&serviceTypeCode=" + $("#serviceTypeCode").val();
		}

		/**
		 * *******************************************************
		 * 						로그인 후 페이지 랜딩
		 * *******************************************************
		 */
		if(landing.indexOf("activationSetting") != -1) {
			//계정 유지 설정
			location.href = "/setting/activationSetting";
		} else if(landing.indexOf("clientProjectList") != -1) {
			//클라이언트 프로젝트 리스트
			//location.href = "/client/project/projectList";
			location.href = "/common/project-list";
		} else if(landing.indexOf("clientTempProjectList") != -1) {
			//클라이언트 임시프로젝트 리스트
			location.href = "/client/project/projectList?projectSortType=PRJ_LI_CT001";
		} else if(landing.indexOf("applicatedExpertIndex") != -1) {
			//지원한 전문가 보기
			location.href = "/common/applicatedExpertIndex";
		} else if(landing.indexOf("clientScrapIndex") != -1) {
			//스크랩 전문가 보기
			location.href = "/common/clientScrapIndex";
		} else if(landing.indexOf("expertView") != -1) {
			//전문가 상세보기
			var tmp = landing.substring(10);
			location.href = "expert.html?userSeq=" + tmp;
		} else if(landing.indexOf("productDetailView") != -1) {
			//프로젝트 상품 상세보기
			var tmp = landing.substring(17);
			location.href = "/common/product/productDetailView?productSeq=" + tmp;
		} else if(landing.indexOf("projectManage") != -1) {
			//프로젝트 관리하기
			location.href = "/client/project/projectManage";
		} else if(landing.indexOf("tmpSaveStart") != -1) {
			//프로젝트 등록하기 - 시작하기
			var tmp = landing.substring(12);
			gf_updateNonUserProject(tmp);
			location.href = "/client/project/requiredInfo?projectSeq=" + tmp;

		} else if(landing.indexOf("tmpSaveReqInfo") != -1) {
			//v5) 프로젝트 필수정보 입력하기
			var tmp = landing.substring(14);
			gf_updateNonUserProject(tmp);
			location.href = "/client/project/requiredInfo?projectSeq=" + tmp;

		} else if(landing.indexOf("tmpSaveComment") != -1) {
			//프로젝트 등록하기 - 내용
			var tmp = landing.substring(14);
			gf_updateNonUserProject(tmp);
			location.href = "/client/project/requiredInfo?projectSeq=" + tmp;
		} else if(landing.indexOf("tmpSaveTag") != -1) {
			//프로젝트 등록하기 - 태그
			var tmp = landing.substring(10);
			gf_updateNonUserProject(tmp);
			location.href = "/client/project/projectRegKeyword?projectSeq=" + tmp;
		} else if(landing.indexOf("tmpSaveExpert") != -1) {
			//프로젝트 등록하기 - 제안할 전문가
			var tmp = landing.substring(13);
			gf_updateNonUserProject(tmp);
			location.href = "/client/project/requiredInfo?expertSeq=" + tmp;
		} else if(landing.indexOf("tmpSaveEtc") != -1) {
			//프로젝트 등록하기 - 기타사항
			var tmp = landing.substring(10);
			gf_updateNonUserProject(tmp);
			location.href = "/client/project/projectRegEtc?projectSeq=" + tmp;
		} else if(landing.indexOf("facebook") != -1) {
			//페이스북 랜딩
			location.href = "/common/fbLoginSetting"+data.resultValue01;
		} else if(landing.indexOf("prjView") != -1) {
			// 프로젝트상세보기 랜딩
			var tmp = landing.substring(7);
			location.href = "project.html?projectSeq=" + tmp;
		} else if(landing.indexOf("ePrjContent") != -1) {
			// 전문가 프로젝트상세보기 랜딩
			var tmp = landing.substring(11);
			location.href = "/expert/project/projectViewContent?projectSeq=" + tmp;
		} else if(landing.indexOf("cPrjContent") != -1) {
			// 클라이언트 프로젝트상세보기 랜딩
			var tmp = landing.substring(11);
			location.href = "/client/project/projectViewContent?projectSeq=" + tmp;
		} else if(landing.indexOf("ePrjQna") != -1) {
			// 전문가 프로젝트 문의보기 랜딩
			var tmp = landing.substring(7);
			location.href = "/expert/project/projectViewQna?projectSeq=" + tmp;
		} else if(landing.indexOf("cPrjQna") != -1) {
			// 클라이언트 프로젝트 문의보기 랜딩
			var tmp = landing.substring(7);
			location.href = "/client/project/projectViewQna?projectSeq=" + tmp;
		} else if(landing.indexOf("myPrjContent") != -1) {
			// 마이 프로젝트상세보기 랜딩
			var tmp = landing.substring(12);
			location.href = "/expert/myproject/projectViewContent?projectSeq=" + tmp;
		} else if(landing.indexOf("applyList") != -1) {
			// 프로젝트 지원자 리스트 랜딩
			var tmp = landing.substring(9);
			location.href = "/client/project/projectApplyList?projectSeq=" + tmp;
		} else if(landing.indexOf("admCmt") != -1) {
			// 프로젝트 코멘트 랜딩
			var tmp = landing.substring(6);
			location.href = "/expert/myproject/projectViewAdmCmt?projectSeq=" + tmp;
		} else if(landing.indexOf("company") != -1) {
			// 프로젝트 회사보기 랜딩
			var projectSeq = "";
			var evalYn = "";
			var tmp = landing.substring(7);
			projectSeq = tmp.split("_")[0];
			if (tmp.split("_").length > 1) {
				evalYn = tmp.split("_")[1];
			}
			if(data.result_msg == "SVC_TY003") {
				location.href = "/expert/project/projectViewCompany?projectSeq=" + projectSeq + "&openEval=" + evalYn;
			} else {
				location.href = "/common/project/projectViewCompany?projectSeq=" + projectSeq;
			}
		} else if(landing.indexOf("contract") != -1) {
			// 프로젝트 계약 랜딩
			var tmp = landing.substring(8);
			location.href = "/client/project/projectViewContract?projectSeq=" + tmp;
		} else if(landing.indexOf("msg") != -1) {
			// 매니저메시지 랜딩
			var tmp = landing.substring(3);
			location.href = "/setting/managerMsgView?msgSeq=" + tmp;
		} else if(landing.indexOf("applyView") != -1) {
			// 프로젝트 지원자보기 랜딩
			var projectSeq = "";
			var userSeq = "";
			var tmp = landing.substring(9);
			if (tmp.split("_").length > 1) {
				projectSeq = tmp.split("_")[0];
				userSeq = tmp.split("_")[1];
			}

			location.href = "/client/project/projectApplyView?projectSeq=" + projectSeq + "&userSeq=" + userSeq;
		} else if(landing.indexOf("inquiryList") != -1) {
			//문의 리스트
			location.href = "/inquiry/inquiryList";
		} else if(landing.indexOf("inquiryView") != -1) {
			// 1:1문의 랜딩 (새 상세 화면은 본인 문의 목록에서만 진입 가능하므로 목록으로 이동)
			location.href = "/inquiry/inquiryList";
		} else if(landing == 'event') {
			// 이벤트 페이지 -> 전문가 프로필 관리 페이지로 이동으로 수정(2019.04.25)
			location.href = "/expert/profile/profileManage";
		} else if(landing == 'pEvent') {
			// 프로필 업데이트 이벤트 페이지
			location.href = "/common/profileUpdateEvent";
		} else if(landing == 'profileRegCareer') {
			// Profile 등록/수정 : 경력
			location.href = "/expert/profile/profileRegCareer";
		} else if(landing == 'profileRegExpertInfo') {
			// Profile 등록/수정 : Expert 정보
			location.href = "/expert/profile/profileRegExpertInfo";
		} else if(landing == 'profileRegPortfolio') {
			// Profile 등록/수정 : 포트폴리오
			location.href = "/expert/profile/profileRegPortfolio";
		} else if(landing.indexOf("docType") != -1) {
			// Profile 등록/수정 : 증빙서류
			var tmp = landing.substring(7);
			location.href = "/expert/profile/profileRegDocument?docType=" + tmp;
		} else if(landing == 'solutionManage') {
			// Expert's 제안 등록/관리
			location.href = "/expert/profile/solutionManage";
		} else if(landing == 'projectList') {
			// 프로젝트 리스트
			//location.href = "/expert/project/projectList";
			location.href = "/common/project-list";
		} else if(landing == 'noticeIndex') {
			// 노티스 리스트
			location.href = "/notice/noticeIndex";
		} else if(landing == 'managerMsgList') {
			// 매니저 메세지 리스트
			location.href = "/setting/managerMsgList";
		} else if(landing.indexOf("myInfoReg") != -1) {
			//클라이언트 회사정보 입력
			location.href = "/client/myinfo/myinfoReg";
		} else if(landing.indexOf("eConsultHistoryMain") != -1){
			// Expert 자문 내역 메인
			location.href = "/expert/consult/consultHistoryMain";
		} else if(landing.indexOf("cMyConsultBoard") != -1){
			// Client 자문 내역 메인
			location.href = "/client/consult/myConsultBoard";
		} else if(landing.indexOf("eConsultIntro") != -1){
			// Expert 자문 상품 등록 인입
			location.href = "/expert/consult/consultProductIntro";
		} else if(landing.indexOf("pdSeq") != -1) {
			// 자문 상품 상세화면
			var seq = landing.substring(5);
			location.href = "/common/consult/productView?productSeq=" + seq;
		} else if(landing.indexOf("eConsultProductManage") != -1){
			// expert 나의 자문 상품 관리
			location.href = "/expert/consult/consultProductManage";
		} else if(landing.indexOf("eConsultHistoryList") != -1) {
			// expert 자문 내역
			let consultStatusCodeParam = "";
			let introCodeParam = "";
			let tmp = landing.substring(19);
			consultStatusCodeParam = tmp.split("-")[0];
			if (tmp.split("-").length > 1) {
				introCodeParam = tmp.split("-")[1];
			}
			if(consultStatusCodeParam !== "") {
				location.href = "/expert/consult/consultHistoryList?consultStatusCode=" + consultStatusCodeParam + "&introCode=" + introCodeParam;
			} else {
				location.href = "/expert/consult/consultHistoryList?consultStatusCode=CON_RV_ST000&introCode=total";
			}
		} else if(landing.indexOf("cMyConsultList") != -1) {
			// client 자문 내역
			let consultStatusCodeParam = "";
			let tmp = landing.substring(14);
			consultStatusCodeParam = tmp.split("-")[0];
			if(consultStatusCodeParam !== "") {
				location.href = "/client/consult/myConsultList?consultStatusCode=" + consultStatusCodeParam;
			} else {
				location.href = "/client/consult/myConsultList?consultStatusCode=";
			}
		} else if(landing.indexOf("eConsultProductInfo") != -1){
			// expert 자문 상품 수정
			location.href = "/expert/consult/consultProductInfo";
		} else if(landing.indexOf("eProjectProductRegister") != -1){
			// expert 프로젝T 상품 수정
			location.href = "/expert/product/productRegister";
		} else if(landing.indexOf("receptionAgree") != -1) {
			location.href = "/setting/receptionAgree";
		/*
		} else if(data.result_msg == "SVC_TY003") {
			// 전문가
			location.href = "/expert?isLogin=Y";
		} else if(data.result_msg == "SVC_TY002") {
			// 클라이언트
			location.href = "/client?isLogin=Y";
		*/
		} else if(landing.indexOf("report") != -1) {
			// 기업고민제보 랜딩
			location.href = "/inquiry/inquiryRegForm?inquiryTypeCode=INQUIRY_TP02";
		} else if (landing.indexOf("setting") != -1) {
			location.href = "/setting";
		} else if(landing.indexOf("profileRegGuide") != -1){
			location.href = "/expert/profile/profileRegGuide";
		} else if(landing.indexOf("consultProductInfoLink") != -1){
			location.href = "/expert/consult/consultProductLink";
		} else if(landing.indexOf("counselDetail") != -1){
			let tmp = landing.substring(13);
			location.href = "/expert/counsel/counselDetail?counselReservationSeq=" + tmp;
		} else if(landing.indexOf("counselView") != -1){
			let tmp = landing.substring(11);
			location.href = "/client/counsel/counselView?crSeq=" + tmp;
		} else if(landing.indexOf("counselManagement") != -1){
			let tmp = landing.substring(17);

			if (tmp == "client"){
				location.href = "/client/counsel/counselManagement";
			}else{
				location.href = "/expert/counsel/counselManagement";
			}
		} else {
			// 사이트구조 개편 : 로그인시 타입구분없이 main으로
			location.href = "index.html";
		}


	} else if(data.result_code == "LOGIN_QUIT_FAIL") {
		// 탈퇴한 회원
		gf_checkPopup("",data.messageVO.msgMent,"","확인", "info");
	} else if(data.result_code == "LOGIN_PASSWORD_FAIL") {
		// 비밀번호 틀림
		gf_checkPopup("",data.messageVO.msgMent,"","확인", "info");
	} else if(data.result_code == "LOGIN_SERVICE_FAIL") {
		// 서비스 타입 다름
		var service1 = "Client";
		var service2 = "Expert";
		if(data.result_msg == "SVC_TY003") {
			service1 = "Expert";
			service2 = "Client";
		}
		var msg = data.messageVO.msgMent;
		msg = msg.split("{service1}").join(service1).split("{userid}").join($("#userID").val()).split("{service2}").join(service2);
		gf_alertPopup(service2 + "로 로그인 해주세요", msg, "확인", "confirm");
		$("#popupBtn").off().on('click', function() {
			// SVC_TY003 : 전문가, SVC_TY002 : 클라이언트
			if(data.result_msg == "SVC_TY003") {
				// 클라이언트 아이디를 전문가에 적용
				$("input[name='c_user_id']").val($("#userID").val());
				$("input[name='c_password']").val($("#password").val());
				$("input[name='e_user_id']").val("");
				$("input[name='e_password']").val("");
				lf_setServiceType("SVC_TY002");
				$(".login-client").trigger("click");
			} else {
				// 전문가 아이디를 클라이언트에 적용
				$("input[name='e_user_id']").val($("#userID").val());
				$("input[name='e_password']").val($("#password").val());
				$("input[name='c_user_id']").val("");
				$("input[name='c_password']").val("");
				lf_setServiceType("SVC_TY003");
				$(".login-expert").trigger("click");
			}
			gf_closePop("alertPopup");
		});
	} else if(data.result_code == "LOGIN_FAIL") {
		// 로그인 실패
		if(data.messageVO.msgCode == 'CLNT_LOGN_99'){ //facebook 로그인 시 가입 안되어있을경우
			gf_checkPopup("","2020년 4월 7일 이전 가입자만<br>Facebook으로 로그인 할 수 있습니다.<br>가입 방법을 확인해주세요!","","확인", "info");
		} else {
			gf_checkPopup(data.result_title, data.messageVO.msgMent, "", "확인", "sorry");
		}
	} else if(data.result_code == "LOGIN_EMAIL_FAIL") {
		location.href = data.result_msg;
	} else if(data.result_code == "LOGIN_DORMANCY") {
		location.href = data.result_msg;
	} else {
		// 그 외 오류내용
		gf_checkPopup("",data.messageVO.msgMent,"","확인", "sorry");
	}

	$("#popBtn2").off().on('click', function() {
		$('#checkPopup').popup({ show : false });
	});
}

/**
 * 이메일 중복체크
 * 이메일이 중복되면 true, 중복 아니면 false
 */
function gf_emailDup(email) {
	var flag = false;
	$.ajax({
		url : "/login/ajax/checkEmailDup"
		,type : 'POST'
		,data : { email : email }
		,dataType : "json"
		// ,contentType: "application/json"
		,cache : false
		,async : false
		,success : function(data) {
			if(data.result_code == "SUCCESS") { // 중복됨
				flag = true;
			}
		}
	});
	return flag;
}

// 시/도 검색
function gf_selectSido(locationId, selVal) {
	$.ajax({
		url : "/common/ajax/selectSido"
		,data : { }
		,dataType : "json"
		,contentType: "application/json"
		,cache : false
		,success : function(data) {
			var html = "<option value=''>시/도</option>";
			$(data).each(function(i, v) {
				if(v.cityCode == selVal)
					html += "<option value='"+v.cityCode+"' selected='selected' >"+v.cityName+"</option>";
				else
					html += "<option value='"+v.cityCode+"'>"+v.cityName+"</option>";
			});
			// 기타 항목 추가
			/*html +=  "<option value='99'>기타</option>";*/
			$("#" + locationId).html(html);
		}
	});
}

// 시/도 선택하면 변경되는 시군구 정보
function gf_selectSigungu(sido, locationId, selVal) {
	if( sido != undefined && sido != '' ) {
		$.ajax({
			url : "/common/ajax/selectSigungu"
			,data : { sido : sido }
			,dataType : "json"
			,contentType: "application/json"
			,cache : false
			,success : function(data) {
				var html = "<option value=''>시/군/구</option>";
				$(data).each(function(i, v) {
					if(v.townCode == selVal)
						html += "<option value='"+v.townCode+"' selected='selected' >"+v.townName+"</option>";
					else
						html += "<option value='"+v.townCode+"' >"+v.townName+"</option>";
				});

				// 기타 항목 추가
//				if(selVal == '99999')
//					html += "<option value='99999' selected='selected'>기타</option>";
//				else
//					html += "<option value='99999'>기타</option>";

				$("#" + locationId).html(html);
			}
		});
	} else {
		var html = "<option value=''>시/군/구</option>";
		$("#" + locationId).html(html);
	}
}

// 코드 목록을 검색하여 locationID에 html 주입
function gf_selectCodeList(parentSeq, locationId, defaultText) {
	$.ajax({
		url : "/common/ajax/selectCodeListByParent"
		,data : { parentSeq : parentSeq }
		,dataType : "json"
		,contentType: "application/json"
		,cache : false
		,success : function(data) {
			if(defaultText == undefined || defaultText == "")
				defaultText = "선택하세요";
			var html = "<option value=''>"+defaultText+"</option>";
			$(data).each(function(i, v) {
				html += "<option value='"+v.code+"'>"+v.codeName+"</option>";
			});
			$("#" + locationId).html(html);
		}
	});
}

// 휴대폰 번호 형식으로 변경시킴
function gf_phoneFomatter(num,type){
	var regex = / /gi;
    var formatNum = '';

	num = num.replace(regex, '');
    if(num.length==11){
        if(type==0){
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
        }else{
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
    }else if(num.length==8){
        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
    }else{
        if(num.indexOf('02')==0){
            if(type==0){
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
            }else{
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        }else{
            if(type==0){
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
            }else{
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
        }
    }
    return formatNum;
}

// textarea 글자수 counter
function gf_textareaCnt(taID, cntID, maxLen) {
    $('#' + taID).keyup(function (e){
        var content = $(this).val();
        if(content.length > maxLen) {
        	content = content.substring(0, maxLen);
        	$('#' + taID).val(content);
        }
        $('#' + cntID).html(inputNumberWithComma(content.length));
    });
    $('#' + taID).keyup();
}

//천단위 이상의 숫자에 콤마( , )를 삽입하는 함수
function inputNumberWithComma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
}

/**
 * 날짜 비교, 시작일 종료일 확인
 */
function gf_compareDate(sDate, eDate) {
	var arr1 = sDate.split('-');
	var arr2 = eDate.split('-');
	// var dt1 = new Date(arr1[0], arr1[1], arr1[2]);
	// var dt2 = new Date(arr2[0], arr2[1], arr2[2]);
	var dt1 = arr1.join("");
	var dt2 = arr2.join("");
	if(dt1 > dt2) {
		return false;
	}
	return true;
}

/**
 * 날짜 사이 간격일수, 시작일 종료일 확인
 */
function gf_betweenDate(sDate, eDate) {
	var arr1 = sDate.split('-');
	var arr2 = eDate.split('-');
	var dt1 = new Date(arr1[0], Number(arr1[1])-1, arr1[2]);
	var dt2 = new Date(arr2[0], Number(arr2[1])-1, arr2[2]);

	var betweenDay = (dt2.getTime() - dt1.getTime()) /1000/60/60/24;

	return betweenDay;
}

/**
 * 파일명에서 확장자명 추출
 * @param filename 파일명
 * @returns _fileExt 확장자명
 */
function gf_tExtensionOfFilename(filename) {
	var _fileLen = filename.length;
	/** * lastIndexOf('.') * 뒤에서부터 '.'의 위치를 찾기위한 함수 * 검색 문자의 위치를 반환한다. * 파일 이름에 '.'이 포함되는 경우가 있기 때문에 lastIndexOf() 사용 */
	var _lastDot = filename.lastIndexOf('.');
	var _fileExt = filename.substring(_lastDot+1, _fileLen).toLowerCase();
	return _fileExt;
}

/**
 * 파일경로에서 파일명만 가져오는 스크립트 (확장자 포함)
 */
function gf_getFilename(fileFullPath) {
	var fileValue = fileFullPath.split("\\");
	var fileName = fileValue[fileValue.length-1]; // 파일명
	return fileName;
}

// 콤마 찍어주기
function gf_addComma(obj) {
	var v = $(obj).val().replace(/,/gi,"");
	$(obj).val(v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

// 증명서류 확장자에 따른 file-class 조회
function gf_getFileClass(ext) {
	var fClass = "file-etc";
	if(ext != undefined && ext != "") {
		if( "png" == ext || "jpeg" == ext || "jpg" == ext || "gif" == ext ) {
			// 이미지
			fClass = "file-image";
		} else if( "pdf" == ext ) {
			fClass = "file-pdf";
		} else if( "doc" == ext || "docx" == ext ) {
			fClass = "file-word";
		} else if( "hwp" == ext ) {
			fClass = "file-hwp";
		} else if( "xls" == ext || "xlsx" == ext ) {
			fClass = "file-xlsx";
		} else if( "ppt" == ext || "pptx" == ext ) {
			fClass = "file-pptx";
		} else {
			fClass = "file-etc";
		}
	}
	return fClass;
}

// 달력
function gf_setDatepicker() {
	$('.datepicker').datepicker({
		 language : 'ko-KR'
		,format : 'yyyy-mm-dd'
		,autoHide : true
		,autoclose : true
		,todayHighlight : true
	})
}

// 오늘 날짜 검색
function gf_getToday() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd < 10) {
		dd = '0' + dd;
	}
	if(mm < 10) {
		mm = '0' + mm;
	}
	return "" + yyyy+mm+dd;
}

//오늘 날짜 검색 형식
function gf_getTodayFormat() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd < 10) {
		dd = '0' + dd;
	}
	if(mm < 10) {
		mm = '0' + mm;
	}
	return "" + yyyy + "-" + mm + "-" + dd;
}

// 날짜 더하기
function gf_dateAddDel(sDate, nNum, type) {

	var yy = parseInt(sDate.substr(0, 4), 10);
	var mm = parseInt(sDate.substr(5, 2), 10);
	var dd = parseInt(sDate.substr(8), 10);

	if (type == "d") {
		d = new Date(yy, mm - 1, dd + nNum -1);
	} else if (type == "m") {
		d = new Date(yy, mm - 1, dd + (nNum * 31));
	} else if (type == "y") {
		d = new Date(yy + nNum, mm - 1, dd);
	}

	yy = d.getFullYear();
	mm = d.getMonth() + 1; mm = (mm < 10) ? '0' + mm : mm;
	dd = d.getDate(); dd = (dd < 10) ? '0' + dd : dd;

	return '' + yy + '-' +  mm  + '-' + dd;
}

//날짜 차이 구하기
function gf_dateDiff(sDate, eDate) {
	var sdt = new Date(sDate);
	var edt = new Date(eDate);
	var dateDiff = Math.ceil((edt.getTime()-sdt.getTime())/(1000*3600*24)) + 1;

	return dateDiff;
}

//숫자를 날짜형식으로 변환
function gf_setDateFormat(ele) {
	var val = $(ele).val();
	if(val.length == 6) {
		var y = val.substring(0, 4);
		var m = val.substring(4, 6);
		$(ele).val(y + "-" + m);
	} else {
		$(ele).val(val);
	}
}

// 숫자만 입력했을때 날짜형식으로 변환
function gf_setDateFormat8(ele) {
	var val = $(ele).val();

	if(val.length == 8) {
		var y = val.substring(0, 4);
		var m = val.substring(4, 6);
		var d = val.substring(6, 8);
		var val2 = y + "-" + m + "-" + d;

		// 변환한 날짜가 형식에 맞으면 날짜형식으로 보여준다.
		if (gf_dateValueChk(val2))
			$(ele).val(val2);
	} else {
		$(ele).val(val);
	}
}

//숫자만 입력했을때 날짜형식으로 변환
function gf_setDateFormat6(ele) {
	var val = $(ele).val();

	if(val.length == 6) {
		var y = val.substring(0, 4);
		var m = val.substring(4, 6);
		var val2 = y + "-" + m;

		// 변환한 날짜가 형식에 맞으면 날짜형식으로 보여준다.
		if (gf_dateValueChkYM(val2))
			$(ele).val(val2);
	} else {
		$(ele).val(val);
	}
}

/**
 * 날짜 형식 체크 (페이지 내 모든 datepicker를 검사)
 * @return 날짜 형식이면 true, 아니면 false인데, null이라도 true.
 */
function gf_dateFormatChkAll() {
	var regEx = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
	var dateCheck = true;
	$(".datepicker").each(function() {
		var $this = $(this);
		if($this.val() != '' && !regEx.test($this.val())) {
			gf_openToastDefault("기간이 잘못되었습니다. 확인해주세요.");
			$this.focus();
			dateCheck = false;
		}
	});
	return dateCheck;
}

/**
 * 날짜 형식 체크
 * @return 날짜 형식이면 true, 아니면 false인데, null이라도 true.
 */
function gf_dateFormatChk(eleID) {
	var dateCheck = true;
	var $this = $("#" + eleID);
	if( !gf_dateValueChk($this.val()) ) {
		gf_openToastDefault("기간이 잘못되었습니다. 확인해주세요.");
		$this.focus();
		dateCheck = false;
	}
	return dateCheck;
}

/**
 * 날짜 형식 체크
 * @return 날짜 형식이면 true, 아니면 false인데, null이라도 true.
 */
function gf_dateValueChk(dateVal) {
	var regEx = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
	var dateCheck = true;
	if( dateVal != '' && !regEx.test(dateVal) ) {
		dateCheck = false;
	}
	return dateCheck;
}

/**
 * 날짜 형식 체크 : yyyy-mm
 * @return 날짜 형식이면 true, 아니면 false인데, null이라도 true.
 */
function gf_dateValueChkYM(dateVal) {
	var regEx = /^(19|20)\d{2}-(0[1-9]|1[012])$/;
	var dateCheck = true;
	if( dateVal != '' && !regEx.test(dateVal) ) {
		dateCheck = false;
	}
	return dateCheck;
}

/**
 * 이메일 형식 체크
 * @return 이메일 형식이면 true, 아니면 false인데, null이라도 true.
 */
function gf_emailChk(val){
	var regExp = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
	if(val!='') {
		if (!regExp.test(val)) {
			return false;
		} else {
			return true;
		}
	} else {
		return true;
	}
}

/**
 * 휴대폰 번호 체크
 */
function regPhoneChk(val){
	var regExp = /^\d{3}-\d{3,4}-\d{4}$/;
	if(val!='') {
		if (!regExp.test(val)) {
			return false;
		} else {
			return true;
		}
	}
}

/**
 *  text에 핸드폰 번호 포함 되어 있는지 정규식 체크
 */
function gf_checkPhone(text) {
	let phoneRegExp = /\d{2,3}-?\d{3,4}-?\d{4}/;
	return phoneRegExp.test(text);
}

/**
 *  text에 이메일 정보 포함 되어 있는지 정규식 체크
 */
function gf_checkEmail(text) {
	let emailRegExp = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
	return emailRegExp.test(text);
}

// ajax 공통 함수
$.ajaxSetup({
	beforeSend : function() {
	}
	,error : function(request,status,error) {
		gf_checkPopup("오류가 발생했어요!!","잠시 후 다시 이용해주세요.<br>계속해서 오류가 발생하면<br>고객센터(tbhelp@talentbank.co.kr)로 연락해주세요.","","확인", "sorry");
		// gf_checkPopup("오류가 발생했어요!!","잠시 후 다시 이용해주세요.<br>계속해서 오류가 발생하면<br>고객센터(1833-4730)로 연락해주세요.","","확인", "sorry");

		$("#popBtn2").off().on("click", function() {
			//location.reload(true);
			$('#checkPopup').popup({ show : false })
		});
	}
	,complete : function () {
	}
});

// 숫자와 하이픈만 입력 받음
function gf_onlyNumBar() {
	// 숫자와 하이픈만 입력
	$(".onlyNumBar").keyup(function() {
		var str = $(this).val();
		var ret = "";
		for(var i = 0; i < str.length; i++) {
			var tmp = str[i];
			if(isNaN(tmp) == false || tmp == "-") {
				ret += tmp;
			}
		}
		$(this).val(ret);
	});
}

// 숫자와 콤마만 입력
function gf_onlyNumComma() {
	//숫자와 콤마만 입력 받기
	$(".onlyNumCom").keyup(function() {
		var str = $(this).val();
		var ret = "";
		for(var i = 0; i < str.length; i++) {
			var tmp = str[i];
			if(isNaN(tmp) == false || tmp == ",") {
				ret += tmp;
			}
		}
		$(this).val(ret);
	});

	//숫자와 콤마만 입력 받기
	$(".onlyNumCom").blur(function() {
		var v = $(this).val().replace(/,/gi,"");
		$(this).val(v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	});
}

// 사이드바에서 사용하는 프로필 이동 함수.
function gf_goProfile(serviceType) {
	if(serviceType == 'expert') {
		location.href = "/expert/profile/profileManage";
	} else if(serviceType == 'client') {
		location.href = "/client/myinfo/myinfoView";
	}
}

// 프로젝트 보기
function gf_goProjectView(serviceType) {
	if(serviceType == undefined || serviceType == '') {
		serviceType = "common";
	}
	location.href = "/"+serviceType+"/project/projectViewContent?projectSeq=" + $("#projectSeq").val();
}

//휴대폰 인증
function gf_setMobile(refereURL) {
	location.href = "/setting/mobileSetup?refereURL=" + refereURL;
}

//휴대폰 인증
function gf_setEmail(refereURL) {
	location.href = "/setting/emailChange";
}

// 프로젝튿 의뢰하기 (휴대폰 인증 체크)
function gf_regProject() {
	gf_checkPopup("먼저 휴대폰 인증을 진행해주세요","휴대폰 인증 후<br>Project를 등록할 수 있습니다.<br>휴대폰 인증을 진행할까요?","해외 인증 문의","인증하기", "info");
	$("#popBtn1").off().on('click', function() {
		$('#checkPopup').popup({ show : false });
		gf_checkPopup("휴대폰 인증이 힘드신가요?","해외 거주로 휴대폰 인증이 힘드시면<br>1:1 문의를 남겨주세요.<br>1:1 문의로 이동할까요?","아니요","이동하기", "info");
		$("#popBtn1").off().on('click', function() {
			$('#checkPopup').popup({ show : false });
		});
		$("#popBtn2").off().on('click', function() {
			location.href = "/inquiry/inquiryRegForm";
		});
	});
	$("#popBtn2").off().on('click', function() {
		location.href = "/setting/mobileSetup?refereURL=project";
	});
}

// 공지사항 페이지로 이동
function gf_goNotice() {
	$(document).scrollTop(0);
	sessionStorage.scrollTop = 0; // 스크롤위치
	sessionStorage.noticePageNo = 1; // 페이지 번호는 1번
	location.href = "/notice/";
}

// 이미지 없는 전문가의 경우, 전분분야 약자를 이미지에 노출시켜줌
function gf_setFieldImg(fieldName) {
	var ret = fieldName;
	if(fieldName == "경영/전략" || fieldName == "경영전략/신사업") {
		ret = "경영";
	} else if(fieldName == "영업/구매/유통") {
		ret = "영업";
	} else if(fieldName == "인사/총무") {
		ret = "인사";
	} else if(fieldName == "재무/투자") {
		ret = "재무";
	//} else if(fieldName == "마케팅") {
	//	ret = "마케팅";
	//} else if(fieldName == "IT" || fieldName == "IT/디자인") {
	//	ret = "IT";
	} else if(fieldName == "IT") {
		ret = "IT";
	} else if(fieldName == "디자인") {
		ret = "디자인";
	} else if(fieldName == "엔지니어링") {
		ret = "연구";
	} else if(fieldName == "디자인/패션") {
		ret = "예술";
	} else if(fieldName == "법무/대정부") {
		ret = "법무";
	}
	return ret;
}

//계약 합의
function gf_agreeContract(agreeFlag) {
	var contractYN = "";
	var description = "";

	if(agreeFlag == 'Y') {
		// 합의 : 날짜 체크 해야 함
		gf_checkPopup("계약 정보를 검토하셨나요?","합의 전, 계약 정보를 충분히 검토해 주세요.<br>계약 합의를 진행할까요?", "아니요", "합의하기", "question");
		$("#popBtn1").off().click(function() {
			$('#checkPopup').popup({ show:false });
		});
		$("#popBtn2").off().click(function() {
			$('#checkPopup').popup({ show:false });
			contractYN = "Y";
			gf_saveAgree(contractYN, description);
		});
	} else if(agreeFlag == 'N') {
		// 미합의
		gf_openPop("contractNotAgree");
		gf_textareaCnt("contractNotAgreeContent", "contractNotAgreeTxt", 200);
		$("#notAgreeBtn").off().click(function() {
			if($.trim($("#contractNotAgreeContent").val()) == "") {
				gf_checkPopup("","미합의 사유를 입력해 주세요.","","확인", "sorry");
				gf_closePop("contractNotAgree");
				$('#popBtn2').off().on('click',function() {
					$('#checkPopup').popup({ show:false });
					gf_openPop("contractNotAgree");
				});
			} else {
				// 미합의 저장
				contractYN = "N";
				description = $("#contractNotAgreeContent").val();
				gf_saveAgree(contractYN, description);
			}
		});
	}
}

function gf_saveAgree(contractYN, description) {
	$.ajax({
		 url : "/common/ajax/updateProjectContractStatusAgree"
		,data : {
			 contractYN : contractYN
			,projectSeq : $("#projectSeq").val()
			,description : description
		}
		,dataType : "json"
		,cache : false
		,async : false
		,success : function(data) {
			if(data.result_code == "SUCCESS") {
				gf_alertPopup(data.result_msg2, data.result_msg, "확인", "confirm");
				$('#popupBtn').off().on('click',function() {
					gf_closePop("contractNotAgree");
					location.reload();
				});
			} else {
				gf_checkPopup(data.result_msg2, data.result_msg,"","확인", "sorry");
				$('#popBtn2').off().on('click',function() {
					location.reload();
				});
			}
		}
	});
}

//for client/expert
function gf_forMemberNotice() {
	gf_checkPopup("회원만 이용 할 수 있어요", "먼저 회원가입 또는 로그인을 해주세요.", "회원가입하기", "로그인하기", "notice");
	$("#popBtn1").off().click(function() {
		location.href = "signup.html?type=client";
	});
	$("#popBtn2").off().click(function() {
		location.href = "login.html";
	});
	return false;
}

//for client
function gf_forClientNotice() {
	gf_checkPopup("Client 회원만 이용 할 수 있어요","먼저 Client로 회원가입 또는 로그인을 해주세요.","회원가입하기","로그인하기", "notice");
	$("#popBtn1").off().click(function() {
		location.href = "signup.html?type=client";
	});
	$("#popBtn2").off().click(function() {
		location.href = "login.html?serviceTypeCode=SVC_TY002";
	});
	return false;
}

//클라이언트 회원 전용 메뉴 클릭시
function gf_expertAlert() {
	gf_checkPopup("Client 회원만 이용 가능한 메뉴에요","Expert 서비스로 이동할까요?","","이동하기", "sorry");
	$("#popBtn2").off().click(function() {
		gf_goExpertProjectList();
	});
	return false;
}

//클라이언트 회원 전용 메뉴 클릭시
function gf_notExpert() {
	gf_checkPopup("Expert 회원만 이용 가능한 메뉴에요","Client 서비스로 이동할까요?","","이동하기", "sorry");
	$("#popBtn2").off().click(function() {
		location.href = "/client";
	});
	return false;
}

//전문가 회원 전용메뉴 클릭시
function gf_clientAlert(param) {
	gf_checkPopup("Expert 회원만 이용 할 수 있어요","먼저 Expert로 회원가입 또는 로그인을 해주세요.", "회원가입하기", "로그인하기", "notice");
	$("#popBtn2").off().click(function() {
		//비회원상태에서 프로젝트 상세보기 화면에서 이동해왔다면 -> 로그인 후 랜딩
		if(param != ""){
			location.href = "login.html?landing=prjView" + param;
		} else {
			location.href = "login.html";
		}
	});

	$("#popBtn1").off().click(function() {
		location.href = "signup.html?type=expert";
	});
	return false;
}

function gf_forExpertNotice(type) {
	gf_checkPopup("Expert 회원만 이용 할 수 있어요","먼저 Expert로 회원가입 또는 로그인을 해주세요.", "회원가입하기", "로그인하기", "notice");
	$("#popBtn2").off().click(function() {
		//비회원상태에서 프로젝트 상세보기 화면에서 이동해왔다면 -> 로그인 후 랜딩
		if(type != ""){
			if(type == 'profile'){
				location.href = "login.html?landing=profileRegGuide";
			}else if(type == 'product'){
				location.href = "login.html?landing=eProjectProductRegister";
			}else if(type == 'consult'){
				location.href = "login.html?landing=consultProductInfoLink";
			}else{
				location.href = "login.html";
			}
		} else {
			location.href = "login.html";
		}
	});

	$("#popBtn1").off().click(function() {
		location.href = "signup.html?type=expert";
	});
	return false;
}

//전문가 회원만을 위한 프로필 등록 클릭시
function gf_forExpertProfile(serviceType) {
	if(serviceType == 'expert') {
		location.href = "/expert/profile/profileManage";
	} else if(serviceType == 'client') {
		gf_openToastDefault("Expert만 이용 가능한 서비스에요.");
	} else if(serviceType == '') {
		/*
		gf_checkPopup("Expert 회원만 이용 할 수 있어요", "먼저 Expert로 회원가입 또는 로그인을 해주세요.", "", "로그인하기", "notice");
		$("#popBtn2").off().click(function() {
			location.href = "/login/joinForm1?serviceTypeCode=SVC_TY003";
		});
		*/
		gf_clientAlert('');
	}
}

//모바일 사진 변경 경로이동을 위함
function gf_forInfoReg(serviceType) {
	if(serviceType == 'expert') {
		location.href = "/expert/profile/profileRegInfo";
	} else if(serviceType == 'client') {
		location.href = "/client/myinfo/myinfoReg";
	}
}

// 날짜 계산
function lf_getAfter7Day(currDate) {
	var afterDate = "";
	if( currDate != '' && gf_dateValueChk(currDate) ) {
		var arr1 = currDate.split('-');
		var dt1 = new Date(arr1[0], arr1[1], arr1[2]);
		var dt2 = new Date(dt1.getFullYear(), dt1.getMonth(), (dt1.getDate() + 7));
		var tmpMonth = dt2.getMonth();
		if (tmpMonth < 10) {
			tmpMonth = "0" + tmpMonth;
		}
		var tmpDate = dt2.getDate();
		if (tmpDate < 10) {
			tmpDate = "0" + tmpDate;
		}
		afterDate = dt1.getFullYear() + "-" + tmpMonth + "-" + tmpDate;
	}
	return afterDate;
}

function gf_formatToday(){

	var date = new Date();

	var year  = date.getFullYear();
	var month = date.getMonth() + 1; // 0부터 시작하므로 1더함 더함
	var day   = date.getDate();

	if (("" + month).length == 1) { month = "0" + month; }
	if (("" + day).length   == 1) { day   = "0" + day;   }

	var today = year + "-" + month + "-" + day;

	return today;
}


// SelectBox에 월Option추가
function gf_monthOptionList() {
	var str = "";
	for (var i = 1; i < 13; i++) {
		var tmp = i;
		if(tmp < 10)
			tmp = "0" + i;
		str += "<option value='"+tmp+"'>"+tmp+"</option>";
	}
	return str;
}

// 연도Option 추가
function gf_yearOptionList() {
	var today = new Date();
	var currentYear = today.getFullYear();
	var str = "";
	for(var i = 1940; i <= currentYear ; i++){
		str += "<option value='"+i+"'>"+i+"</option>";
	}
	return str;
}

// 클립보드에  데이터 저장
function gf_copyToClipboard(val) {
	let t = document.createElement("textarea");
	document.body.appendChild(t);
	t.value = val;

	const userAgentIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) && !window.MSStream;		// 접속기기 판단(iOS or (Android / PC))

	// 접속한 기기가 IOS인지 아닌지 판단
	if(userAgentIOS) {
		// 아이폰 / 아이패드
		val.replace('&iOS', '');
		let range, selection;
		range = document.createRange();
		range.selectNodeContents(t);
		selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		t.setSelectionRange(0, 999999);
	} else {
		t.select();
	}
	document.execCommand('copy');
	document.body.removeChild(t);
	gf_openToastDefault("URL을 복사했어요! 원하는 곳에 붙여넣기 해주세요.");
}

// 서버 모드별 URL 검색
function gf_getDefaultUrl(serverMode) {
	var defaultUrl = "https://www.talentbank.co.kr";
	if (serverMode == "LOCAL") {
		defaultUrl = "https://localhost:8080";
	} else if (serverMode == "STAGING") {
		defaultUrl = "https://new-staging-www.talentbank.co.kr";
	} else if (serverMode == "DEV") {
		defaultUrl = "https://dev-www.talentbank.co.kr";
	}
	return defaultUrl;
}

// 배열의 요소를 삭제함 (없으면 배열을 그대로 돌려줌)
function gf_removeArrayObject(arr, obj) {
	var dataList = $.grep(arr, function(n, i) {
		return n != obj;
	});
	return dataList;
}

// 브라우저 구분(chrome 여부)
function gf_getBrowser() {
	var agent = navigator.userAgent.toLowerCase();
	if (agent.indexOf("chrome") != -1) {
		return true;
	} else {
		return false;
	}
}

//로딩이미지 닫기
var indicator = $('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
function gf_closeLoading() {
	indicator.remove();
	$('body').removeClass('ready').addClass('onload');
}

//로딩이미지 열기
function gf_openLoading(ele) {
	$('body').addClass('ready').removeClass('onload');
	// $('ul.posts-list.theme-a.type-a').before(indicator);
	$("#"+ele).before(indicator);
}

// 전문가 리스트 페이지 이동 : 페이지 스크롤 컨트롤을 위해 공통함수로 뺌.
function gf_goExpertList() {
	$(document).scrollTop(0);
	sessionStorage.expertScrollTop = 0; // 스크롤위치
	sessionStorage.expertListPageNo = 1; // 페이지 번호
	//location.href = "/common/expertSearchList";
	location.href = "experts.html";
}

// 프로젝트 목록 이동
function gf_goExpertProjectList() {
	$(document).scrollTop(0);
	sessionStorage.projectListScroll = 0;
	sessionStorage.projectListPageNo = 1;
	//location.href = "/expert/project/projectList";
	location.href = "/common/project-list";
}

//프로젝트 목록 이동
function gf_goCommonProjectList() {
	gf_globalVariableInit();
	//location.href = "/common/project/projectList";
	location.href = "/common/project-list";
}

//매니저 메시지 목록 이동
function gf_goManagerMsgList() {
	$(document).scrollTop(0);
	sessionStorage.scrollTop = 0;
	sessionStorage.msgPageNo = 1;
	location.href = "/setting/managerMsgList";
}

/**
 * global 변수 초기화 (스크롤위치 / 페이지 번호)
 */
function gf_globalVariableInit() {
	// 전문가 검색 관련
	sessionStorage.expertScrollTop = 0;
	sessionStorage.expertListPageNo = 1;

	// 공지사항 관련
	sessionStorage.scrollTop = 0;
	sessionStorage.noticePageNo = 1;

	// 매니저 메시지 관련
	sessionStorage.scrollTop = 0;
	sessionStorage.msgPageNo = 1;

	// 프로젝트 목록 관련
	sessionStorage.projectListScroll = 0;
	sessionStorage.projectListPageNo = 1;

	// 프로젝트 검색목록 관련
	sessionStorage.projectSearchScrollTop = 0;
	sessionStorage.projectSearchPageNo = 1;

	// 탤런트 솔루션 관련
	sessionStorage.solutionScroll = 0;
	sessionStorage.solutionPageNo = 1;

	// 지원현황 리스트 관련
	sessionStorage.applicateScrollTop = 0;
	sessionStorage.applicatePageNo = 1;

	// 전문가 스크랩 관련
	sessionStorage.scrapScrollTop = 0;
	sessionStorage.scrapListPageNo = 1;

	// 통합검색 전문가 전체보기 검색 관련
	sessionStorage.expertPageScrollY = 0;
	sessionStorage.expertPageNo = 1;

	// 통합검색 프로젝트상품 검색 관련
	sessionStorage.productPageScrollY = 0;
	sessionStorage.productPageNo = 1;

	// 통합검색 아티클T 검색 관련
	sessionStorage.articlePageScrollY = 0;
	sessionStorage.articlePageNo = 1;

	// 인재추천 공고 검색 관련
	sessionStorage.recruitPageScrollY = 0;
	sessionStorage.recruitPageNo = 1;
}

//공지사항 페이지로 이동
function gf_goSolution() {
	$(document).scrollTop(0);
	sessionStorage.solutionScroll = 0;
	sessionStorage.solutionPageNo = 1;
	location.href = "/solution/solutionList?solutionCategory=ALL";
}

// 앱에 공지 읽음 알려줌...
function lf_readMsg(msgId, badge) {
	// alert("readMsg is ---> msgId : " + msgId + ", badge : " + badge);
	document.appIFrame2.location.href = "jscall://readMsg?msgId=" + msgId + "&badgeCnt=" + badge;
}


function gf_goSuccessProject() {
	$(document).scrollTop(0);
	sessionStorage.successProjectScroll = 0;
	sessionStorage.successProjectPageNo = 1;
}

/**
 * 전문분야1 수정했을때 전문분야 2에 option이 나오게 하는 코드
 * @param parentJobField 전문분야1코드
 * @param 전문분야2가 표시될 element ID값
 * */
function gf_changeJobField(parentJobField, eleId) {
	$("#"+eleId).html("");
	var pChk = true;
	$(".fieldTag-chk").each(function(i, v){
		// 1depth 코드를 포함하고, 선택된 코드가 1depth가 아닐때 '전체'code option remove
		// if(($(v).val()).includes(parentJobField) && $(v).val() != parentJobField){
		if(($(v).val()).indexOf(parentJobField) > -1 && $(v).val() != parentJobField){
			pChk = false;
		}
		if(!pChk){
			return;
		}
	});

	$.ajax({
		url : "/common/ajax/getJobField2List?parentJobFieldCode="+parentJobField
		,method : "get"
		,dataType : "json"
		,contentType: "application/json"
		,cache : false
		,success : function(data) {
			/*var str = "<option value=''>2차 분야 선택</option>";*/
			var str = "";
			$(data).each(function(i, v) {
				if (!pChk){
					var tmpCode = (v.jobFieldCode).substring((v.jobFieldCode).length-2);
					if(tmpCode != '01'){
						str += "<option value='"+v.jobFieldCode+"'>"+v.jobFieldNm+"</option>";
					}
				} else {
					str += "<option value='"+v.jobFieldCode+"'>"+v.jobFieldNm+"</option>";
				}
			});

			if(str == ""){
				if(parentJobField == "RCT_TY001"){//모든분야 선택시
					str +='<option value="">모든 분야 선택</option>';
				}else{//선택초기화시
					str +='<option value="">2차 분야 선택</option>';
					$('.label-title').removeClass('on');
				}
			}

			$("#"+eleId).html(str);

			var selection = $("#"+eleId).find("option:selected").text();
			var label = $("[for='" + eleId + "']");
			label.find(".label-desc").html(selection);
		}
		,error : function(data) {
			gf_checkPopup("오류가 발생했어요","잠시 후 다시 이용해주세요.<br>계속해서 오류가 발생하면<br>고객센터(tbhelp@talentbank.co.kr)로 연락해주세요.","","확인", "sorry");
			$("#popBtn2").off().on('click', gf_confirmPopClose);
		}
	});
}

function gf_tagClick(keyword, local) {
	$.ajax({
		url : "/common/ajax/updateTagClickCnt"
		,data : {
			 keyword : keyword
			,tagClickLocation : local
		}
		,dataType : "json"
		,cache : false
		,contentType: "application/json"
		,success : function(data) {
			location.href = "search.html?tag="+escape(encodeURIComponent(keyword));
		}
	});
}

/**
 * Textarea의 글자수 읽어서 체크하는 기능
 *  - 사용방법
 *  1. textarea에 class추가 "lenChkTextarea"
 *  2. textarea 다음에 div를 추가하고 그 아래 "txtlen" 클래스를 가진 span추가
 *  3. "txtlen" 클래스에 text 길이가 출력됨
 *  4. texarea에 data-maxlen 이라는 속성 추가하여 최대 몇글자까지 입력가능한지 지정함.
 * @author kjs
 * @date 2020-05-08
 * */
function gf_checkTextareaTxtLen() {
	 $("textarea.lenChkTextarea").on("keyup", function() {
		var txtlen = $(this).val().length;
		var maxlen = $(this).data("maxlen");
		// console.log("txtlen is : " + txtlen + ", maxlen : " + maxlen);
		if (txtlen > maxlen) {
			txtlen = maxlen;
			var txt = $(this).val();
			txt = txt.substring(0, maxlen);
			$(this).val(txt);
			alert(maxlen + "까지 입력 가능합니다.");
		}
		$(this).parent().find("span.txtlen").eq(0).text(txtlen);
	});
}

/**
 * 숫자 카운팅 애니메이션
 * @param id : 숫자를 표시할 element의 ID값
 * */
function gf_countingAnime(id, cnt) {
	// console.log("id : " + id);
	$('#' + id).each(function() {
		var $this = $(this);
		// console.log("cnt : " + cnt);
		$({ countNum: 0 }).animate(
			{
				countNum: cnt
			},
			{
				duration: 500,
				easing:'linear',
				step: function() {
					$this.text(Math.floor(this.countNum));
				},
				complete: function() {
					$this.text(this.countNum);
				}
			}
		);
	});
}

// 상담 요청 팝업
function gf_openCounselPopup(seq, path, incomingSeq) {
	$.ajax({
		 url : "/common/ajax/" + path + "/openCounselPopup"
		,data : { projectSeq : seq
				 ,incomingSeq : incomingSeq
				}
		,dataType : "html"
		,success : function(data) {
			$("#projectRegPopup").html(data);
			gf_openPop("projectRegPopup");
			$('body').addClass('active-info-disclosure');
		}
	});

	//키보드 ESC 키 이벤트
	$(document).keydown(function(event) {
		if ( event.keyCode == 27 || event.which == 27 ) {
			//스크롤 재작동 되도록
			$('body').removeClass('active-info-disclosure');
		}
	});
}

//로그인 팝업
function gf_openLoginPopup(landing) {
	$.ajax({
		 url : "/common/ajax/openLoginPopup"
		,data : { landing : landing }
		,dataType : "html"
		,success : function(data) {
			$("#loginPopup").html(data);
			$('#loginPopup').addClass("active");
		}
	});
}

//Faq 팝업
function gf_openFaqPopup(code, type, target) {
	$.ajax({
		 url : "/common/ajax/openFaqPopup"
		,data : {
				  faqCategoryCode : code,
				  serviceTypeCode : type,
				  targetSeq : target
				}
		,dataType : "html"
		,success : function(data) {
			$("#faqPopup").html(data);
			$('#faqPopup').addClass("active");
		}
	});
}

/**
 * 비로그인 상태에서 프로젝트 등록중 회원로그인 했으면
 * 등록중이던 프로젝트 userSeq Update
 */
function gf_updateNonUserProject(seq) {
	if(seq != 0){
		$.ajax({
			 url : "/client/project/ajax/updateNonUserProject"
			,data : { projectSeq : seq }
			,dataType : "json"
			,contentType: "application/json"
			,cache : false
			,success : function(data) {
				//
			}
		});
	}
}

/**
 * 포트폴리오 url 제한
 */
function gf_chkPortfolioUrl(url) {
	var urlChk = "";
	if (url.indexOf("linkedin") > -1) {
		urlChk ="linkedin";
	} else if (url.indexOf("blog") > -1) {
		urlChk ="blog";
	} else if (url.indexOf("facebook") > -1) {
		urlChk ="facebook";
	} else if (url.indexOf("youtube") > -1) {
		urlChk ="youtube";
	}

	return urlChk;
}

// 페이지 reload
function gf_reload() {
	location.reload();
}

// 페이지 별 타이틀 설정
function gf_setPageTitle(title) {
	document.getElementById('contentName').innerText = title;
}

// Vanilla JS Serialize
function gf_serialize (rawData) {
	let rtnData = {};
	for (let [key, value] of rawData) {
		let sel = document.querySelectorAll("[name=" + key + "]");

		// Array Values
		if (sel.length > 1) {
			if (rtnData[key] === undefined) {
				rtnData[key] = [];
			}
			rtnData[key].push(value);
		}
		// Other
		else {
			rtnData[key] = value;
		}
	}

	return rtnData;
}

//통합검색 spinner on
function gf_showSearchSpinner(){
	if($(".spinner02").css("display") == 'none'){
		$(".spinner02").css("display", "flex");
	}
}

//통합검색 spinner off
function gf_hideSearchSpinner(){
	if($(".spinner02").css("display") != 'none'){
		$(".spinner02").css("display", "none");
	}
}

/**
 * 휴대폰 중복체크
 * return: 중복 (true) / 중복아님 (false)
 */
function gf_mobileDup(phone, serviceType) {
	var flag = false;
	$.ajax({
		url : "/login/ajax/checkMobileDup"
		,type : 'POST'
		,data : {
				  phone : phone
				 ,serviceType : serviceType
				}
		,dataType : "json"
		,cache : false
		,async : false
		,success : function(data) {
			if(data.result_code == "FAIL") { // 중복됨
				flag = true;
			}
		}
	});

	return flag;
}

/* 정수형 숫자(초 단위)를 "시:분:초" 형태로 표현하는 함수 */
function gf_toHourMinSec(t) {
	var hour;
	var min;
	var sec;
	// 정수로부터 남은 시, 분, 초 단위 계산
	hour = Math.floor(t / 3600);
	min = Math.floor((t - (hour * 3600)) / 60);
	sec = t - (hour * 3600) - (min * 60);
	// hh:mm:ss 형태를 유지하기 위해 한자리 수일 때 0 추가
	if (hour < 10)
		hour = "0" + hour;
	if (min < 10)
		min = "0" + min;
	if (sec < 10)
		sec = "0" + sec;
	return (min + ":" + sec);
}

function gf_goInquiry() {
	var userID = '${USER_SESSION_INFO.userID}';
	if(userID != '') {
		location.href = "/inquiry/inquiryList";
	} else {
		location.href = "inquiry.html";
	}
}

/**
 * 파일 사이즈 체크
 * param: file, maxSize(단위 MB)
 * return: true(사이즈 이하) / false(사이즈 초과)
 */
const gf_checkFileSize = (file, maxSize) => {
	const fileSize = file.size;
	const maxSizeByte = maxSize * 1024 * 1024;
	if (fileSize > maxSizeByte) {
		gf_openToastDefault(`파일 사이즈는 ${maxSize}MB 이하로 등록 가능합니다.`);
		return false;
	}
	return true;
};

/**
 * 휴넷 메신져 웹훅으로 보낼 ID 목록
 * 김민균	T2023001
 * 김유환	T2021015
 * 노재웅	T2022014
 * 김조은	T2024003
 * 이현정	T402302
 * 유하진	T2024002
 * 정수인	T2024004
 * 장수빈	T2024005
 * 강지연	T702401
 *
 * 임동권	T2021011
 * 손준호	T402002
 * 신준섭	T402301
 *
 * 박주안	2023005
 * 신용일	2023007
 * 김현경	2023008
 * 이예인	2023009
 * 정민혁	2023010
 */
const hunetMessangerIds = ['T2021011','T402002','T402301', '2023005','2023007','2023008','2023009','2023010'];

/**
 * 휴넷 메신져 웹훅 - test
 */
const testhunetMessangerIds = ['2023005','2023007','2023008','2023009'];

$(function() {
})
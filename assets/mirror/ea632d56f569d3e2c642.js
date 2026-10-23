/**
 * 숫자만 입력
 */
function regOnlyNum(obj){
	var exp = new RegExp('^[0-9]*$');
	var val = obj.value;
	if(val != ''){
		if(!exp.test(val)){
			// alert("숫자만 입력이 가능합니다.");
			// obj.value = val.substring(0, val.length -1);
			obj.value = '';
		}
	}
}

/**
 * 금액 ','찍어 주는 script 함수
 */
function numberWithCommasVal(val) {
	var v = "";
	var exp = new RegExp('^[0-9\,]*$');
	if(exp.test(val)) {
		var v = val.toString().replace(/,/gi,"");
		v = v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else {
		v = val;
	}
	return v;
}

/**
 * 숫자 및 영문 입력
 */
function regExEngNum(obj){
	var exp = new RegExp('^[A-Za-z]+[0-9]*$');
	var val = obj.value;
	if(val!=''){
		if(!exp.test(val)){			
			alert("영문/숫자만 입력이 가능합니다.");
			return false;
		}
	}
}

/**
 * 영문(소문자) 및 숫자 입력
 * @param obj
 * @returns {Boolean}
 */
function regExEngSmallNum(obj) {
	var exp = new RegExp('^[a-z]+[0-9]*$');
	var val = obj.value;
	if(val!='') {
		if(!exp.test(val)) {
			alert("영문(소문자)/숫자만 입력이 가능합니다.");
			return false;
		}
	}
}

/**
 * 영문(대문자) 및 숫자 입력
 */
function regExEngBigNum(obj) {
	var exp = new RegExp('^[A-Z0-9]*$');
	var val = obj.value;
	if(val!='') {
		if(!exp.test(val)) {
			alert("영문/숫자만 입력이 가능합니다.");
			return false;
		}
	}
}

/**
 * 영문 / 숫자 / 특수문자 조합
 */
function validateCheckPw(password) {
	// var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/;
	var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[~`!@#$%^&*()-+]).{8,30}$/;
	if(false === reg.test(password)) {
		// alert('비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.');
		return false;
	}
	return true;
}

function validateCheckPw_old(pwd) {
	var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var alpha2 = "abcdefghijklmnopqrstuvwxyz";
	var number = "1234567890";
	var sChar = "-_=+\|()*&^%$#@!~`?></;,.:'";

	var sChar_Count = 0;
	var alphaCheck = false;
	var alpha2Check = false;
	var numberCheck = false;
	var userpw = pwd;
	if (7 < userpw.length) {
		for ( var i = 0; i < userpw.length; i++) {
			if (sChar.indexOf(userpw.charAt(i)) != -1) {
				sChar_Count++;
			}
			if (alpha.indexOf(userpw.charAt(i)) != -1) {
				alphaCheck = true;
			}
			if (alpha2.indexOf(userpw.charAt(i)) != -1) {
				alpha2Check = true;
			}
			if (number.indexOf(userpw.charAt(i)) != -1) {
				numberCheck = true;
			}
		}
		var cnt=0, cnt2=1, cnt3=1;
		for(i=0;i < userpw.length;i++){
			temp_pass1 = userpw.charAt(i);
			
			next_pass = (parseInt(temp_pass1.charCodeAt(0)))+1;
			temp_p = userpw.charAt(i+1);
			temp_pass2 = (parseInt(temp_p.charCodeAt(0)));
			if (temp_pass2 == next_pass)
			    cnt2 = cnt2 + 1;
			else
			    cnt2 = 1;
			if (temp_pass1 == temp_p)
			    cnt3 = cnt3 + 1;
			else
			    cnt3 = 1;
			
			if (cnt2 > 2) break;
			if (cnt3 > 2) break;
		}
		//if (cnt2 > 2){
		//	pwObj.next().html("비밀번호에 연속된 문자나 순차적인 숫자를 3자 이상 사용해서는 안됩니다.");
		//	pwObj.next().addClass("txt_error");
		//    return false;
		//}
		var checkCnt = 0;
		if (sChar_Count >= 1){
			checkCnt++;
		}
		if (alphaCheck == true){
			checkCnt++;
		}
		if (numberCheck == true){
			checkCnt++;
		}
		if (alpha2Check == true){
			checkCnt++;
		}
		if(checkCnt < 2){
			return false;
		}
	} else {
		return false;
	}
	return true;
}

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

// function moveMenu(url){
function moveMenu(url){
	$("#moveMenu").attr("action", url).submit();
}

/**
 * 중복 submit 방지 
 */
function doubleSubmitCheck(name, time){
	// time 시간 이후에 중복클릭 방지가 자동 해제됨, 타임 미입력시 3초 초기값
	if(time == null){
		time = 3000;
	}
	try {
		eval(name + "Flag");
	} catch (e) {
		eval( name + "Flag= false");
	}
	if(eval(name + "Flag") == true){
		alert("이미 클릭하셨습니다. 잠시 기다리시거나 페이지를 새로고침 하시기 바랍니다.");
		return eval(name + "Flag");
	}else{
		eval( name + "Flag= true");
		setTimeout(function() {
			eval( name + "Flag= false");
		}, time);
		return false;
	}
}

function $F(caller) { 
	var f = arguments.callee.caller;
	if(caller)
		f = f.caller;
	var pat = /^function\s+([a-zA-Z0-9_]+)\s*\(/i;
	pat.exec(f);
	var func = new Object(); 
	func.name = RegExp.$1; 
	return func; 
}

/**
 * 모바일 여부 체크
 */
function is_mobile() {
	var returnStr = "";
	var ua = window.navigator.userAgent;
	if(/lgtelecom/i.test(ua) || /Android/i.test(ua) || /blackberry/i.test(ua) || /iPhone/i.test(ua) || /ipad/i.test(ua) || /samsung/i.test(ua) || /symbian/i.test(ua) || /sony/i.test(ua) || /SCH-/i.test(ua) || /SPH-/i.test(ua)){
		returnStr = "mobile";
	} else {
		returnStr = "pc";
	}
	return returnStr;
}

/**
 * 영문 / 숫자 / 특수문자 조합
 */
function validateCheckPwText(userpw) {
	var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var alpha2 = "abcdefghijklmnopqrstuvwxyz";
	var number = "1234567890";
	var sChar = "-_=+\|()*&^%$#@!~`?></;,.:'";

	var sChar_Count = 0;
	var alphaCheck = false;
	var alpha2Check = false;
	var numberCheck = false;

	if (8 < userpw.length) {
		for ( var i = 0; i < userpw.length; i++) {
			if (sChar.indexOf(userpw.charAt(i)) != -1) {
				sChar_Count++;
			}
			if (alpha.indexOf(userpw.charAt(i)) != -1) {
				alphaCheck = true;
			}
			if (alpha2.indexOf(userpw.charAt(i)) != -1) {
				alpha2Check = true;
			}
			if (number.indexOf(userpw.charAt(i)) != -1) {
				numberCheck = true;
			}
		}

		var temp = "";
		for(var i=0; i < userpw.length; i++) {
			temp = userpw.charAt(i);
			if(temp == userpw.charAt(i+1) && temp == userpw.charAt(i+2)) {
				alert("동일한 문자를 3회 이상 반복 사용할 수 없습니다.");
				return false;
			}
		}

		var cnt=0, cnt2=1, cnt3=1;
		for(i=0;i < userpw.length;i++){
			temp_pass1 = userpw.charAt(i);
			next_pass = (parseInt(temp_pass1.charCodeAt(0)))+1;
			temp_p = userpw.charAt(i+1);
			temp_pass2 = (parseInt(temp_p.charCodeAt(0)));
			if (temp_pass2 == next_pass)
				cnt2 = cnt2 + 1;
			else
				cnt2 = 1;
			if (temp_pass1 == temp_p)
				cnt3 = cnt3 + 1;
			else
				cnt3 = 1;
			
			if (cnt2 > 2) break;
			if (cnt3 > 2) break;
		}
		//if (cnt2 > 2){
		//alert("비밀번호에 연속된 문자나 순차적인 숫자를 3자 이상 사용해서는 안됩니다.");
		//return false;
		//}
		var checkCnt = 0;
		if (sChar_Count > 1){
			checkCnt++;
		}
		if (alphaCheck == true){
			checkCnt++;
		}
		if (numberCheck == true){
			checkCnt++;
		}
		if (alpha2Check == true){
			checkCnt++;
		}
		if(checkCnt < 2){
			alert("대문자/소문자/특수문자/숫자 중 2종류 이상, 8자~30자 이내로 설정해 주세요.");
			return false;
		}
	} else {
		alert("대문자/소문자/특수문자/숫자 중 2종류 이상, 8자~30자 이내로 설정해 주세요.");
		return false;
	}

	return true;
}

//파일 다운로드
function gf_filedown(seq, fileName, tempFileName) {
	if(seq != '' && fileName != '' && tempFileName != '') {
		$form = $('<form name="fileFrm" id="fileFrm" method="GET" action="/common/fileDown"></form>');
		$form.append('<input type="hidden" name="fileSeq" value="' + seq + '" />')
		$form.append('<input type="hidden" name="fileName" value="' + fileName + '" />')
		$form.append('<input type="hidden" name="tempFileName" value="' + tempFileName + '" />')
		$("body").append($form);
		$form.submit();
		$form.remove();
	}
}

//파일 다운로드 - 디코딩
function gf_fileDecodingDown(seq, fileName, tempFileName) {
	if(seq != '' && fileName != '' && tempFileName != '') {
		$form = $('<form name="fileFrm" id="fileFrm" method="GET" action="/common/fileDecodingDown"></form>');
		$form.append('<input type="hidden" name="fileSeq" value="' + seq + '" />')
		$form.append('<input type="hidden" name="fileName" value="' + fileName + '" />')
		$form.append('<input type="hidden" name="tempFileName" value="' + tempFileName + '" />')
		$("body").append($form);
		$form.submit();
		$form.remove();
	}
}

var submitFlag = true;
function gf_submitDupCheck() {
	if(submitFlag) {
		submitFlag = false;
		return true;
	} else {
		return false;
	}
}

/**
 * tag 입력시 체크사항 
 */
function gf_validateCheckTag(ele) {
	//허용안되는 특수문자 검사
	var replaceChar = /[_=\|()*^%$@!~`?></;:\']/gi;
	
	//특수문자 all
	var chkTextChar = /[_=\|()*^%$@!~`?></;,.:\-+&#']/gi;

	//받아온 태그명
	var tagTxt = $(ele).val();
	
	//마지막 글자
	var chkChar = tagTxt.charAt(tagTxt.length-1);
	
	if (tagTxt.length > 10) {
		$(ele).val(tagTxt.substr(0,10));
		gf_openToastDefault("최대 10자까지 입력할 수 있어요.");
		return false;
	}
	
	if (replaceChar.test(tagTxt)) {
		$(ele).val($(ele).val().replace(replaceChar, ""));
		gf_openToastDefault("-, +, &, #, . 특수문자만 입력할 수 있습니다.");
		return false;
	}
	
	//특수문자부터 입력시 
	if (tagTxt.length === 1 && chkTextChar.test(tagTxt)) {
		$(ele).val(tagTxt.substr(0,tagTxt.length-1));
		gf_openToastDefault("한글 또는 영문을 한 글자 이상 입력해 주세요.");
		return false;
	}
	
	return true;
}

/**
 * tag 등록시 입력문자 한번 더 체크
 */
function gf_validateCheckText(txt) {
	var pattern_eng = /[a-zA-Z]/;
	var pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
	// 완성형 아닌 한글 정규식
	var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;

	//if((!(pattern_eng.test(txt)) && !(pattern_kor.test(txt))) || txt.match(replaceNotFullKorean)){
	if(txt.match(replaceNotFullKorean)){
		gf_openToastDefault("태그를 정확히 입력해 주세요.");
		return false;
	} 
	
	return true;
}

/**
 * 외부 url - windows.open 공통 함수
 */
function gf_openUrlWindowPopup(url) {
	if (typeof url != "undefined" && url != null && url != '') {
		window.open(url, "", "");
	}
}

/**
 * null, undefined check
 * @param str
 * @returns
 */
function gf_nvl(str) {
	if(str == null || str == undefined){
		return '';
	}
	return str;
}

/**
 * 지정된 범위 난수(정수) 생성
 * @param min
 * @param max
 * @returns
 */
function gf_rangeRandomNum(min, max){
	return Math.floor(Math.random() * max) + min;
}

/**
 * 이번달 마지막 일자
 * @param strDate
 * @returns
 */
function gf_monthByLastDate(strDate){
	var yyyy = strDate.substring(0, 4);
	var mm = strDate.substring(4, 6);
	if(Number(mm) < 1 || Number(mm) > 12) return false;
	
	var dt = new Date(yyyy, mm, 0);
	return dt.getDate();
}

/**
 * 유효한 일자인지 체크 
 * @param strDate(yyyyMMdd)
 * @returns
 */
function gf_isVaildDate(strDate){
	strDate = strDate.replace(/[^0-9]/g, "");
	if(strDate.length != 8) return false;
	
	var yyyy = strDate.substring(0, 4);
	var mm = strDate.substring(4, 6);
	var dd = strDate.substring(6, 8);
	
	if(Number(mm) < 1 || Number(mm) > 12) return false;
	if(gf_monthByLastDate(strDate) < dd) return false;
	
	return true;
}

/**
 * type별 시간 차이
 * @param type
 * @param date1
 * @param date2
 * @returns
 */
function gf_dateDiff2(type, date1, date2){
	var ret = Math.abs(date1 - date2);
	switch(type){
		case 'date' : ret /= 24;
		case 'hour' : ret /= 60;
		case 'minute' : ret /= 60;
		case 'second' : ret /= 1000;
	}
	return ret;
}

/**
 * string > date
 * type : yh - yyyyMMddhh, ym - yyyyMMddhhmm, ys - yyyyMMddhhmmss
 * @param strDate
 * @param type
 * @returns
 */
function gf_stringToDate(strDate, type){
	strDate = strDate.replace(/[^0-9]/g, "");
	if(strDate.length < 8) return false;
	
	var yyyy = strDate.substring(0, 4);
	var mm = strDate.substring(4, 6);
	var dd = strDate.substring(6, 8);
	var hh = null, _mm = null, ss = null;
	
	if(type == "yh") {
		hh = strDate.substring(8, 10);
	} else if(type == "ym") {
		hh = strDate.substring(8, 10);
		_mm = strDate.substring(10, 12);
	} else if(type == "ys") {
		hh = strDate.substring(8, 10);
		_mm = strDate.substring(10, 12);
		ss = strDate.substring(12, 14);
	}
	//console.log(yyyy+"."+mm+"."+dd+"   "+hh+":"+_mm+":"+ss);
	
	return new Date(yyyy, Number(mm)-1, dd, hh, _mm, ss);
}

/**
 * date > string
 * @param dt
 * @param gubun
 * @returns gubun '-' > yyyy-MM-dd
 */
function gf_dateToString(dt, gubun){
	var year = dt.getFullYear();
	var month = dt.getMonth()+1;
	var date = dt.getDate();
	
	if(month < 10) month = "0"+month;
	if(date < 10) date = "0"+date;
	
	return [year, month, date].join(gf_nvl(gubun));
}

/**
 * 해당 일자의 요일 구하기
 * @param strDate
 * @returns 
 */
function gf_getDayOfWeek(strDate) {
	var dt;
	if(gf_nvl(strDate) == "") {
		dt = new Date();
	} else {
		dt = gf_stringToDate(strDate);
	}
	return "일월화수목금토".charAt(dt.getDay());
}

/**
 * 함수 호출 시간부터 chkStrTime(yyyyMMddhhmmss)까지 setInterval 호출
 * @param sec
 * @param chkStrTime
 * @param timeinFunc
 * @param timeoutFunc
 * @returns
 */
function gf_setInterval(sec, chkStrTime, timeinFunc, timeoutFunc) {
	if(gf_nvl(chkStrTime) != "") {
		var dt = new Date();
		var cdt = gf_stringToDate(chkStrTime, "ys");
		
		if(dt.getTime() > cdt.getTime()) {
			if(timeoutFunc instanceof Function) timeoutFunc();
		} else {
			var diffTime = Math.round(gf_dateDiff2("second", dt.getTime(), cdt.getTime()));
			
			var x = setInterval(function(){
				diffTime -= sec;
				if(timeinFunc instanceof Function) timeinFunc();
				
				if(diffTime < 0) {
					if(timeoutFunc instanceof Function) timeoutFunc();
					clearInterval(x);
				}
			}, sec*1000);
		}
	}
}

/**
 * maxLength check
 * @param tid
 * @param cid
 * @param maxLen
 * @param alertMsg
 * @returns
 */
function gf_maxLengthChk(tid, cid, maxLen, alertMsg) {
	$(tid).on('keyup', function() {
        $(cid).html($(tid).val().length);
        if($(tid).val().length > maxLen) {
            if(gf_nvl(alertMsg) != "") {
            	alert(alertMsg);
            } else {
            	alert("글자수는 "+maxLen+"자 이내로 제한됩니다.");
            }
            $(tid).val($(tid).val().substring(0, maxLen));
            $(tid).trigger('keyup');
        }
    });
}

/**
 * minLength check
 * @param tid
 * @param minLen
 * @param alertMsg
 * @returns
 */
function gf_minLengthChk(tid, minLen, alertMsg) {
	$(tid).on('focusout', function() {
        if($(tid).val().length < minLen) {
            if(gf_nvl(alertMsg) != "") {
            	alert(alertMsg);
            } else {
            	alert("글자수는 최소 "+minLen+"자 이상 적어주세요.");
            }
            $(tid).trigger('keyup');
        }
    });
}

/**
 * target 속성 수정
 * @param targetArr
 * @param attrKey
 * @param attrValue
 * @param type
 * @returns
 */
function gf_targetAttrSet(targetArr, attrKey, attrValue, type) {
	if(type == "add") {
		for(var i=0; i<targetArr.length; i++) {
			$(targetArr[i]).attr(attrKey, attrValue);
		}
	} else if(type == "remove") {
		for(var i=0; i<targetArr.length; i++) {
			$(targetArr[i]).removeAttr(attrKey);
		}
	}
}

/**
 * target value set
 * @param targetArr
 * @param value
 * @returns
 */
function gf_targetValueSet(targetArr, valueArr, type) {
	if(targetArr.length > 0 && valueArr.length > 0) {
		for(var i=0; i<targetArr.length; i++) {
			$(targetArr[i]).val(targetArr.length != valueArr.length ? valueArr[0] : valueArr[i]);
		}
	}
}

/**
 * target text set
 * @param targetArr
 * @param valueArr
 * @returns
 */
function gf_targetTextSet(targetArr, valueArr) {
	if(targetArr.length > 0 && valueArr.length > 0) {
		for(var i=0; i<targetArr.length; i++) {
			$(targetArr[i]).text(targetArr.length != valueArr.length ? valueArr[0] : valueArr[i]);
		}
	}
}

/**
 * target show/hide
 * @param target
 * @param type
 * @returns
 */
function gf_targetDisplayType(targetArr, type) {
	for(var i=0; i<targetArr.length; i++) {
		if(type == "show") $(targetArr[i]).show();
		else if(type == "hide") $(targetArr[i]).hide();
	}
}

/**
 * sessionStorage key, value set
 * @param jsonArr
 * @returns
 */
function gf_setSessionStorage(jsonObj) {
	var keys = Object.keys(jsonObj);
	for(var i=0; i<keys.length; i++) {
		var key = keys[i];
		sessionStorage.setItem(key, jsonObj[key]);
	}
}

/**
 * sessionStorage remove
 * @param keyArr
 * @param callback
 * @returns
 */
function gf_removeSessionStorage(keyArr, callback) {
	for(var i=0; i<keyArr.length; i++) {
		sessionStorage.removeItem(keyArr[i]);
	}
	if(typeof callback === "function") callback();
}

/**
 * sessionStorage console.log
 * @returns
 */
function gf_sessionStorageConsole() {
	var keys = Object.keys(sessionStorage);
	for(var i=0; i<keys.length; i++) {
		var key = keys[i];
		console.log("key:" + key + " // value:" + sessionStorage.getItem(key));
	}
}

/**
 * millisecond to strDate
 * @param mil
 * @param separator
 * @returns
 */
function gf_milSecToStrDate(mil, separator) {
	var d = new Date();
	d.setTime(mil);
	return gf_dateToString(d, separator);
}








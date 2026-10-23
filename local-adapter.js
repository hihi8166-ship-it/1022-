/* Public-page snapshot adapter. Remote writes are never sent from the local copy. */
(() => {
 const $=window.jQuery;if(!$)return;
 window.localSearchValue=new URLSearchParams(location.search).get('searchValue')||new URLSearchParams(location.search).get('q')||'';
 const fixtures=window.LOCAL_FIXTURES||{};
 const normalize=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
 const paramsOf=data=>typeof data==='string'?(()=>{try{return JSON.parse(data);}catch{return Object.fromEntries(new URLSearchParams(data));}})():data||{};
 const selectEntry=(key,params={})=>{
  const entries=fixtures[key]||[];
  const keys=['pageNo','searchValue','keywordDetail','parentJobFieldCode','secondJobFieldCode','seminarStatusCode','caseTypeCode'];
  return entries.map((entry,i)=>{const captured={...Object.fromEntries(new URL(entry.url,location.href).searchParams),...paramsOf(entry.post)};const score=keys.reduce((n,key)=>n+(String(captured[key]||'')===String(params[key]||'')?1:0),0);return {entry,score,i};}).sort((a,b)=>b.score-a.score||a.i-b.i)[0]?.entry;
 };
 const read=(key,params={})=>selectEntry(key,params)?.data;
 function filterHtml(source,params){
  if(!source)return '';
  const keyword=params.searchValue||'',details=(params.keywordDetail||'').split(' ').filter(Boolean);
  if(!keyword&&!details.length&&!params.secondJobFieldCode)return source;
  const holder=document.createElement('div');holder.innerHTML=source;
  const rows=[...holder.querySelectorAll('li.posts-item')];
  const field=params.secondJobFieldCode||'';
  const fieldData=(fixtures['/common/ajax/getJobField2List']||[]).flatMap(entry=>Array.isArray(entry.data)?entry.data:[]).find(item=>item.jobFieldCode===field);
  const groups={JOB_FD01:['경영전략','신사업'],JOB_FD03:['영업','구매','유통'],JOB_FD04:['인사','총무','노무','HR'],JOB_FD05:['재무','투자','회계','자금'],JOB_FD06:['마케팅','브랜딩','홍보'],JOB_FD08:['생산','제조','품질','설계','연구개발'],JOB_FD12:['IT','서버','빅데이터','AI'],JOB_FD13:['디자인','패션'],JOB_FD11:['법무','정부','특허'],JOB_FD10:['기타']};
  const fieldTerms=!field?[]:field.endsWith('01')?(groups[field.slice(0,8)]||[]):[fieldData?.jobFieldNm||''];
  for(const row of rows){const text=normalize(row.textContent);if(![keyword,...details].every(k=>text.includes(normalize(k)))||(fieldTerms.length&&!fieldTerms.some(k=>text.includes(normalize(k)))))row.remove();}
  const count=holder.querySelectorAll('li.posts-item').length;
  holder.querySelectorAll('script').forEach(s=>s.remove());
  setTimeout(()=>{$('#expertListCnt').text(count.toLocaleString());$('#expertNoDataDiv').toggle(!count);$('#expertMoreBtn').hide();$('#expertSearchUL').toggle(!!count);},30);
  return holder.innerHTML;
 }
 function autoKeywords(keyword){
  const words=['마케팅','온라인마케팅','마케팅전략','해외마케팅','SNS마케팅','디지털마케팅','바이럴마케팅','마케팅기획','홍보마케팅','마케팅교육','마케팅강의','브랜드마케팅','블로그마케팅','병원마케팅','마케팅플랜','마케팅 전략','장소마케팅','마케팅 기획','마케팅리서치','투자컨설팅','투자유치','IPO','인사','노무','경영전략','신사업','해외진출','태양광','생산관리','품질관리','AI','정부지원사업'];
  return words.filter(word=>normalize(word).includes(normalize(keyword))).map(word=>{const at=word.toLowerCase().indexOf(String(keyword).toLowerCase());const safe=s=>$('<span>').text(s).html();return {keyword:word,highLightKeyword:at<0?safe(word):safe(word.slice(0,at))+'<strong class="text-client">'+safe(word.slice(at,at+keyword.length))+'</strong>'+safe(word.slice(at+keyword.length))};});
 }
 $.ajax=function(url,settings){
  const options=typeof url==='string'?{...(settings||{}),url}:url||{};
  const path=new URL(options.url||location.href,location.href).pathname;
  const params={...Object.fromEntries(new URL(options.url||location.href,location.href).searchParams),...paramsOf(options.data)};
  let response=read(path,params);
  if(path.endsWith('/autoKeyword'))response=autoKeywords(params.keyword||'');
  if(path.endsWith('/expertSearchListAjax')){
   const entry=selectEntry(path,params),captured=paramsOf(entry?.post);
   const exact=['searchValue','keywordDetail','secondJobFieldCode'].every(k=>String(captured[k]||'')===String(params[k]||''));
   response=exact?entry?.data:filterHtml(read(path),params);
  }
  if(path.endsWith('/integrateSearchListAjax')){
   response=read(path)||'';
   if(normalize(params.searchValue)!=='ipo'||params.keywordDetail)response=window.buildLocalSearchHTML?window.buildLocalSearchHTML(params):response;
  }
  if(path.endsWith('/successSearchListAjax')&&response&&(params.searchValue||params.caseTypeCode||params.keywordDetail)){response=structuredClone(response);const words=[params.searchValue,...String(params.keywordDetail||'').split(' ')].filter(Boolean);const all=(fixtures[path]||[]).flatMap(entry=>entry.data.successList||[]).filter((p,i,list)=>list.findIndex(x=>x.successCaseSeq===p.successCaseSeq)===i).filter(p=>words.every(q=>normalize(p.title+' '+p.projectSummary+' '+p.keywordName).includes(normalize(q)))&&(!params.caseTypeCode||p.caseTypeCode===params.caseTypeCode));response.rowCnt=all.length;response.successList=all.slice((Number(params.pageNo||1)-1)*20,Number(params.pageNo||1)*20);response.pageTotal=Math.max(1,Math.ceil(all.length/20));response.moreYn=Number(params.pageNo||1)<response.pageTotal?'Y':'N';}
  if(path.endsWith('/seminarSearchListAjax')&&response&&(params.seminarStatusCode||params.searchValue)){response=structuredClone(response);const all=(fixtures[path]||[]).flatMap(entry=>entry.data.seminarList||[]).filter((p,i,list)=>list.findIndex(x=>x.seminarSeq===p.seminarSeq)===i).filter(p=>(!params.seminarStatusCode||p.seminarStatusCode===params.seminarStatusCode)&&(!params.searchValue||normalize(p.title).includes(normalize(params.searchValue))));response.seminarListCnt=all.length;response.seminarList=all.slice((Number(params.pageNo||1)-1)*20,Number(params.pageNo||1)*20);response.pageTotal=Math.max(1,Math.ceil(all.length/20));}
  if(path.endsWith('/expertScrapAjax'))response={result_code:'SUCCESS',resultValue01:'Y',resultValue:'Y'};
  if(response===undefined)response=options.dataType==='html'?'':{result_code:'LOCAL_ONLY',result_msg:'로컬 재현 화면입니다. 실제 신청은 공식 사이트를 이용해 주세요.'};
  if(options.dataType==='html'&&typeof response!=='string')response=JSON.stringify(response);
  const deferred=$.Deferred();
  options.beforeSend?.({},options);
  const deliver=()=>{try{options.success?.(response,'success',{});options.complete?.({},'success');deferred.resolve(response,'success',{});}catch(error){console.error('Local response handler:',path,error);deferred.reject({},'error',error);}};
  if(options.async===false)deliver();else setTimeout(deliver,10);
  const promise=deferred.promise();promise.abort=()=>{};return promise;
 };
 const nativeFetch=window.fetch.bind(window);
 window.fetch=(input,options={})=>{
  const url=typeof input==='string'?input:input.url;
  const parsed=new URL(url,location.href);
  if(parsed.pathname.startsWith('/common/ajax/')||parsed.pathname.startsWith('/notice/ajax/')){
   return new Promise(resolve=>$.ajax({url,data:options.body||{},success:data=>resolve(new Response(typeof data==='string'?data:JSON.stringify(data),{status:200,headers:{'Content-Type':typeof data==='string'?'text/html':'application/json'}}))}));
  }
  return nativeFetch(input,options);
 };
 // Preserve the original design while routing search submissions to local pages.
 document.addEventListener('submit',event=>{
  const form=event.target;
  if(form.matches('#localSearchMain')){
   event.preventDefault();event.stopImmediatePropagation();
   const value=form.querySelector('[name="searchValue"]')?.value.trim();
   if(!value){window.gf_openToastDefault?.('검색어를 입력해 주세요.');return;}
   location.href='search.html?searchValue='+encodeURIComponent(value);
  }
 },true);
})();

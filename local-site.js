(() => {
 const $=window.jQuery;if(!$)return;
 const query=window.localSearchValue||'';
 const safe=value=>$('<span>').text(value||'').html();
 const normal=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
 function fixture(path){return window.LOCAL_FIXTURES?.[path]?.[0]?.data;}
 window.buildLocalSearchHTML=function(params){
  const words=[params.searchValue,...String(params.keywordDetail||'').split(' ')].filter(Boolean);
  const matches=value=>words.every(q=>normal(value).includes(normal(q)));
  const box=document.createElement('div');box.innerHTML=(window.LOCAL_FIXTURES['/common/ajax/expertSearchListAjax']||[]).map(entry=>entry.data).join('');
  box.querySelectorAll('script').forEach(n=>n.remove());
  const experts=[...box.querySelectorAll('li.posts-item')].filter((n,i,list)=>{const id=n.querySelector('[name="expertScrap"]')?.id;return !id||list.findIndex(other=>other.querySelector('[name="expertScrap"]')?.id===id)===i;}).filter(n=>matches(n.textContent));
  const success=(window.LOCAL_FIXTURES['/common/ajax/successSearchListAjax']||[]).filter(entry=>!new URLSearchParams(entry.post||'').get('searchValue')).flatMap(entry=>entry.data.successList||[]).filter((p,i,all)=>all.findIndex(other=>other.successCaseSeq===p.successCaseSeq)===i).filter(p=>matches(p.title+' '+p.projectSummary+' '+p.keywordName));
  const seminars=(window.LOCAL_FIXTURES['/common/ajax/seminarSearchListAjax']||[]).flatMap(entry=>entry.data.seminarList||[]).filter((p,i,all)=>all.findIndex(other=>other.seminarSeq===p.seminarSeq)===i).filter(p=>matches(p.title+' '+p.location));
  const projects=(window.LOCAL_PROJECTS||[]).filter(p=>matches(p.body));
  const total=experts.length+success.length+seminars.length+projects.length;
  $('#allListCnt').text(total.toLocaleString());
  const section=(title,content)=>`<div class="title-more"><div class="title"><h4>${title}</h4></div></div>${content}`;
  let output='';
  if(experts.length)output+=section('전문가('+experts.length+')',`<div class="section search-view-wrap"><div class="search-result-wrap detail-filter filter-type"><ul class="posts-list theme-a type-a variable-a posts-list-info">${experts.slice(0,3).map(p=>p.outerHTML).join('')}</ul></div></div>`);
  if(projects.length)output+=section('프로젝트('+projects.length+')',projects.map(p=>`<div class="posts-item" style="padding:24px 0;border-bottom:1px solid #ddd"><a href="${p.href}"><h3 style="font-size:22px;font-weight:700">${safe(p.title)}</h3><p>${safe(p.body)}</p></a></div>`).join(''));
  if(success.length)output+=section('성공사례('+success.length+')',success.slice(0,3).map(p=>`<div style="padding:24px 0;border-bottom:1px solid #ddd"><a href="story.html?successCaseSeq=${p.successCaseSeq}"><h3 style="font-size:22px;font-weight:700">${safe(p.title)}</h3><p>${safe(p.jobType)}</p></a></div>`).join(''));
  if(seminars.length)output+=section('세미나('+seminars.length+')',seminars.slice(0,3).map(p=>`<div style="padding:24px 0;border-bottom:1px solid #ddd"><a href="seminar.html?seminarSeq=${p.seminarSeq}"><h3 style="font-size:22px;font-weight:700">${safe(p.title)}</h3><p>일시 : ${safe(p.seminarDateStr)} · 장소 : ${safe(p.location)}</p></a></div>`).join(''));
  const counts={Expert:experts.length,Project:projects.length,Success:success.length,Seminar:seminars.length,Article:0,Faq:0};
  const counters=Object.entries(counts).map(([key,count])=>`<span id="s${key}ListCnt" hidden>${count}</span>`).join('');
  return counters+(output||'<div class="no-data no-data-v4" style="display:block"><p class="head">조건에 맞는 검색결과가 없습니다.</p><ul class="clist"><li>다른 검색어를 입력해보세요.</li><li>재검색 키워드 수를 줄여보세요.</li><li>검색조건이 정확한지 확인해 보세요.</li></ul></div>');
 };
 if(typeof window.lf_allSearchCount==='function')window.lf_allSearchCount=()=>{const count=['Expert','Project','Success','Seminar','Article','Faq'].reduce((n,key)=>n+(parseInt($('#s'+key+'ListCnt').text().replace(/,/g,''))||0),0);$('#allListCnt').text(count.toLocaleString());sessionStorage.setItem('searchAllCnt',String(count));};
 if(location.pathname.endsWith('search.html')){$('.result-inner .text-client').text(query);$('#localSearchKeyword').val(query);}
 // Keep top navigation, logo links, and search local, including file:// previews.
 document.querySelectorAll('a[href="/"]').forEach(a=>a.href='index.html');
 document.querySelectorAll('form').forEach(form=>{
  if(form.id==='localSearchMain')return;
  const action=form.getAttribute('action')||'';
  if(action.startsWith('/'))form.addEventListener('submit',e=>{e.preventDefault();window.gf_openToastDefault?.('로컬 재현 화면입니다. 실제 신청은 공식 사이트를 이용해 주세요.');});
 });
 // Reapply local query to expert-list server variables after document setup.
 if(location.pathname.endsWith('experts.html')&&query){
  try{searchVal=query;$('#localSearchKeyword-2').val(query);if(typeof lf_searchList==='function')lf_searchList(true);}catch{}
 }
})();

import json,re,urllib.request,concurrent.futures
from pathlib import Path
from urllib.parse import urlencode
CACHE=Path('.mirror-source');BASE='https://www.talentbank.co.kr'
fixtures=json.loads((CACHE/'fixtures.json').read_text(encoding='utf-8'))
routes={}
patterns=[(r'/common/expertView\?userSeq=(\d+)','expert-{}.html','/common/expertView?userSeq={}'),(r'/common/project/projectViewContent\?projectSeq=(\d+)','project-{}.html','/common/project/projectViewContent?projectSeq={}'),(r'/common/projectCaseView\?successCaseSeq=(\d+)','story-{}.html','/common/projectCaseView?successCaseSeq={}'),(r'/seminar/view\?seminarSeq=(\d+)','seminar-{}.html','/seminar/view?seminarSeq={}')]
source='\n'.join(f.read_text(encoding='utf-8') for f in CACHE.glob('*.dom'))+json.dumps(fixtures,ensure_ascii=False)
for pattern,file,route in patterns:
 for ident in set(re.findall(pattern,source)):routes[file.format(ident)]=route.format(ident)
for entry in fixtures['/common/ajax/seminarSearchListAjax']:
 for item in entry['data'].get('seminarList',[]):routes[f"seminar-{item['seminarSeq']}.html"]='/seminar/view?seminarSeq='+str(item['seminarSeq'])
for entry in fixtures['/common/ajax/successSearchListAjax']:
 for item in entry['data'].get('successList',[]):routes[f"story-{item['successCaseSeq']}.html"]='/common/projectCaseView?successCaseSeq='+str(item['successCaseSeq'])
routes.update({'login.html':'/login/loginForm?serviceTypeCode=SVC_TY002','signup.html':'/login/signup','inquiry.html':'/inquiry/inquiryNonMember','faq.html':'/common/faq-list','notices.html':'/common/announceList?noticeCategoryCode=NT_CT002'})
def capture(entry):
 file,route=entry
 if (CACHE/(file+'.raw')).exists():return file,route
 try:
  req=urllib.request.Request(BASE+route,headers={'User-Agent':'Mozilla/5.0'})
  data=urllib.request.urlopen(req,timeout=30).read().decode('utf-8')
  (CACHE/(file+'.raw')).write_text(data,encoding='utf-8')
  return file,route
 except Exception as e:print('FAILED',file,str(e)[:90],flush=True);return None
print('Capturing',len(routes),'public detail and support pages',flush=True)
good={}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 for i,result in enumerate(pool.map(capture,routes.items())):
  if result:good[result[0]]=result[1]
  if i%20==0:print('Captured',i,flush=True)
(CACHE/'detail-routes.json').write_text(json.dumps(good,ensure_ascii=False),encoding='utf-8')
print('Saved',len(good),'pages',flush=True)
# Complete all public success-story and seminar pagination snapshots.
for endpoint,pages in [('successSearchListAjax',7),('seminarSearchListAjax',3)]:
 key='/common/ajax/'+endpoint
 for number in range(2,pages+1):
  if any(json.loads(entry['post'] or '{}').get('pageNo')==number for entry in fixtures[key] if (entry['post'] or '').startswith('{')):continue
  params=json.loads(fixtures[key][0]['post']);params['pageNo']=number;params['initFlag']=False
  if endpoint.startswith('seminar'):params['startPage']=(number-1)*20
  payload=json.dumps(params).encode()
  try:
   req=urllib.request.Request(BASE+key,data=payload,headers={'Content-Type':'application/json','User-Agent':'Mozilla/5.0'})
   data=json.loads(urllib.request.urlopen(req,timeout=30).read())
   fixtures[key].append({'url':BASE+key,'post':json.dumps(params),'data':data})
  except Exception as e:print('Pagination unavailable',endpoint,number,flush=True)
(CACHE/'fixtures.json').write_text(json.dumps(fixtures,ensure_ascii=False),encoding='utf-8')

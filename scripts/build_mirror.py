import json, re, hashlib, urllib.request, concurrent.futures, html
from pathlib import Path
from urllib.parse import urljoin,urlparse
BASE='https://www.talentbank.co.kr'
CACHE=Path('.mirror-source')
assets=json.loads((CACHE/'assets.json').read_text(encoding='utf-8'))
for url,path in list(assets.items()):
 if 'fonts.googleapis.com' in url and path.endswith('.bin'):
  target=path[:-4]+'.css';Path(target).write_bytes(Path(path).read_bytes());assets[url]=target
routes={'/common/expert-list':'experts.html','/project/projectMain':'projects.html','/common/fractional-cxo':'subscription.html','/common/success-list':'stories.html','/recruit/recruitMain':'recruit.html','/common/seminar-list':'seminars.html','/common/search':'search.html','/main':'index.html'}
routes.update({'/common/expertView':'expert.html','/common/project/projectViewContent':'project.html','/common/projectCaseView':'story.html','/seminar/view':'seminar.html','/login/loginForm':'login.html','/login/signup':'signup.html','/login/signupForm':'signup.html','/inquiry/inquiryNonMember':'inquiry.html','/common/faq-list':'faq.html','/common/announceList':'notices.html'})
def path_for(url):
 ext=Path(urlparse(url).path).suffix
 return 'assets/mirror/'+hashlib.sha256(url.encode()).hexdigest()[:20]+(ext if len(ext)<8 else '.bin')
todo=set()
for url,path in list(assets.items()):
 if path.endswith('.css'):
  backup=CACHE/'original-assets'/Path(path).name
  source=(backup if backup.exists() else Path(path)).read_text(encoding='utf-8',errors='replace')
  for value in re.findall(r'url\(([^)]+)\)',source):
   value=value.strip(' \t\n\r\'"')
   if value and not value.startswith(('data:','#')):todo.add(urljoin(url,value).split('#')[0])
for f in CACHE.glob('*.raw'):
 source=f.read_text(encoding='utf-8')
 for tag,value in re.findall(r'<(script|link)[^>]+(?:src|href)=["\']([^"\']+)',source):
  url=urljoin(BASE,value)
  if urlparse(url).netloc in ['www.talentbank.co.kr','cdnjs.cloudflare.com'] and (tag=='script' or '.css' in value or 'icon' in value):todo.add(url)
 # Include all image references, even those below the initially loaded viewport.
 for value in re.findall(r'(?:src|data-src|poster)=["\']([^"\']+)',source):
  if not value.startswith('data:'):
   url=urljoin(BASE,value)
   if urlparse(url).netloc=='www.talentbank.co.kr':todo.add(url)
 for value in re.findall(r'url\(([^)]+)\)',source):
  value=value.strip(' \t\r\n\'"')
  if not value.startswith(('data:','#')) and not any(x in value for x in ['${','<','>']):
   url=urljoin(BASE,value)
   if urlparse(url).netloc=='www.talentbank.co.kr':todo.add(url)
fixture_text=(CACHE/'fixtures.json').read_text(encoding='utf-8')
for value in re.findall(r'(?:https://www\.talentbank\.co\.kr)?/(?:s3/files/\d+|assets/[^\s"\'<>\\]+\.(?:jpg|png|svg|webp|gif|jpeg))',fixture_text):
 todo.add(urljoin(BASE,value))
def download(url):
 try:
  path=path_for(url);req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
  data=urllib.request.urlopen(req,timeout=20).read();Path(path).write_bytes(data)
  return url,path
 except Exception:return url,None
missing=todo-set(assets)
print('Additional assets:',len(missing),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
 for i,(url,path) in enumerate(pool.map(download,missing)):
  if path:assets[url]=path
  if i%100==0:print('Downloaded',i,flush=True)
(CACHE/'assets.json').write_text(json.dumps(assets,ensure_ascii=False),encoding='utf-8')
# Preserve a clean copy so rebuilds never transform a file twice.
originals=CACHE/'original-assets';originals.mkdir(exist_ok=True)
for url,path in assets.items():
 if path.endswith(('.css','.js')):
  backup=originals/Path(path).name
  if not backup.exists():backup.write_bytes(Path(path).read_bytes())
def rewrite(text,base=BASE,css=False):
 if css:
  def replace_url(match):
   value=match[1].strip(' \t\n\r\'"')
   if value.startswith(('data:','#')):return match[0]
   url=urljoin(base,value).split('#')[0]
   if url in assets:return 'url("'+Path(assets[url]).name+'")'
   return 'url("'+url+'")'
  text=re.sub(r'url\(([^)]+)\)',replace_url,text)
 for url,path in sorted(assets.items(),key=lambda pair:len(pair[0]),reverse=True):
  text=text.replace(url,path)
  if url.startswith(BASE):text=text.replace(url[len(BASE):],path)
  elif url.startswith('https:'):text=text.replace(url[6:],path)
 for route,file in sorted(routes.items(),key=lambda pair:len(pair[0]),reverse=True):
  text=re.sub(re.escape(BASE+route)+r'(?=[?\'"\s#]|$)',file,text)
  text=re.sub(re.escape(route)+r'(?=[?\'"\s#]|$)',file,text)
 text=text.replace('href="/"','href="index.html"').replace("href='/'","href='index.html'")
 text=text.replace('..assets/mirror/','assets/mirror/').replace('.assets/mirror/','assets/mirror/')
 return text
for url,path in assets.items():
 if path.endswith(('.css','.js')):
  source=(originals/Path(path).name).read_text(encoding='utf-8',errors='replace')
  # Local CSS filenames share their directory with downloaded images and fonts.
  if path.endswith('.css'):
   source=rewrite(source,url,True).replace('assets/mirror/','')
  else:source=rewrite(source,url)
  Path(path).write_text(source,encoding='utf-8')
fixtures=json.loads((CACHE/'fixtures.json').read_text(encoding='utf-8'))
fixtures={k:v for k,v in fixtures.items() if k.startswith(('/common/','/notice/','/project/','/recruit/'))}
for entries in fixtures.values():
 for entry in entries:
  if isinstance(entry['data'],str):entry['data']=rewrite(entry['data'])
  else:entry['data']=json.loads(rewrite(json.dumps(entry['data'],ensure_ascii=False)))
Path('site-fixtures.js').write_text('window.LOCAL_FIXTURES='+json.dumps(fixtures,ensure_ascii=False).replace('</','<\\/')+';',encoding='utf-8')
project_catalog=[]
home=(CACHE/'index.html.raw').read_text(encoding='utf-8')
for tag in re.findall(r'<a\b[^>]*href=["\']/common/project/projectViewContent\?projectSeq=\d+["\'][^>]*>.*?</a>',home,re.S):
 ident=re.search(r'projectSeq=(\d+)',tag)[1]
 title=re.search(r'<div class="tab-item-title[^\"]*">(.*?)</div>',tag,re.S)
 if title and ident not in [p['id'] for p in project_catalog]:
  clean=lambda value:html.unescape(re.sub(r'<[^>]+>',' ',value)).strip()
  project_catalog.append({'id':ident,'title':clean(title[1]),'body':re.sub(r'\s+',' ',clean(tag)),'href':'project-'+ident+'.html'})
Path('site-catalog.js').write_text('window.LOCAL_PROJECTS='+json.dumps(project_catalog,ensure_ascii=False)+';',encoding='utf-8')
friendly={BASE+'/assets/front.main.css?v=2405290':'css/style.css',BASE+'/assets/front.sub.css?v=2405290':'css/pages.css'}
for url,destination in friendly.items():
 if url in assets:
  css=Path(assets[url]).read_text(encoding='utf-8')
  css=re.sub(r'url\("([^"/:]+\.(?:png|jpg|jpeg|gif|svg|webp|woff2?|ttf|eot|bin)(?:\?[^"\s]*)?)"\)',r'url("../assets/mirror/\1")',css)
  css=re.sub(r'@import\s+([\'\"])([^\'\"/:]+)\1',lambda m:'@import '+m[1]+'../assets/mirror/'+m[2]+m[1],css)
  Path(destination).write_text(css,encoding='utf-8')
for raw in CACHE.glob('*.raw'):
 file=raw.name[:-4]
 text=(CACHE/(file+'.raw')).read_text(encoding='utf-8')
 def scripts(match):
  tag,body=match[1],match[2]
  src=re.search(r'src=["\']([^"\']+)',tag)
  if src:
   host=urlparse(urljoin(BASE,src[1])).netloc
   if host not in ['www.talentbank.co.kr','cdnjs.cloudflare.com']:return ''
  elif any(token in body for token in ['gtag(', 'fbq(', 'kakaoPixel(', '_tfa', 'dablena', 'amplitude.', 'wcs_add', 'bstrk', 'popin', 'enp_tracker', '_linkedin', 'googletagmanager', 'dataLayer.push']):return ''
  return match[0]
 text=re.sub(r'<script\b([^>]*)>(.*?)</script>',scripts,text,flags=re.S|re.I)
 text=re.sub(r'<noscript\b.*?</noscript>','',text,flags=re.S|re.I)
 text=rewrite(text)
 for url,destination in friendly.items():
  if url in assets:text=text.replace(assets[url],destination)
 # Install the local data adapter as soon as the bundled jQuery is available.
 bundle=assets[BASE+'/assets/all.js?v=2405290']
 text=re.sub(r'(<script[^>]+src=["\']'+re.escape(bundle)+r'["\'][^>]*>\s*</script>)',r'\1<script src="site-fixtures.js"></script><script src="site-catalog.js"></script><script src="local-adapter.js"></script>',text,count=1)
 text=text.replace('</body>','<script src="local-site.js"></script></body>')
 if file=='search.html':
  # Server expressions are replaced with the submitted local query.
  text=text.replace('"IPO"','window.localSearchValue').replace("'IPO'",'window.localSearchValue')
 Path(file).write_text(text,encoding='utf-8')
print('Built 8 pages,',len(assets),'local assets',flush=True)
for name,param,prefix,fallback in [('expert','userSeq','expert-','experts.html'),('project','projectSeq','project-','projects.html'),('story','successCaseSeq','story-','stories.html'),('seminar','seminarSeq','seminar-','seminars.html')]:
 files=[f.name[:-4] for f in CACHE.glob(prefix+'*.html.raw')]
 text='<!doctype html><html lang="ko"><meta charset="UTF-8"><title>페이지 이동</title><script>const id=new URLSearchParams(location.search).get('+json.dumps(param)+');const file='+json.dumps(prefix)+'+id+".html";location.replace('+json.dumps(files)+'.includes(file)?file:'+json.dumps(fallback)+');</script><a href="'+fallback+'">목록으로 이동</a></html>'
 Path(name+'.html').write_text(text,encoding='utf-8')

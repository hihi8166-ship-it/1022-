import sys,json
from pathlib import Path
from urllib.parse import urlparse
sys.path.insert(0,str(Path('.qa-tools').resolve()))
from playwright.sync_api import sync_playwright
root=Path('.mirror-source');fixtures=json.loads((root/'fixtures.json').read_text(encoding='utf-8'))
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',headless=True)
 page=browser.new_page(viewport={'width':1440,'height':1000})
 def response(r):
  if urlparse(r.url).netloc!='www.talentbank.co.kr' or r.request.resource_type not in ['xhr','fetch'] or not r.ok:return
  try:
   try:data=r.json()
   except:data=r.text()
   key=urlparse(r.url).path;entry={'url':r.url,'post':r.request.post_data,'data':data}
   fixtures.setdefault(key,[]).append(entry)
  except:pass
 page.on('response',response)
 for file,route in [('faq.html','/common/faq-list'),('notices.html','/common/announceList?noticeCategoryCode=NT_CT002'),('seminar-59.html','/seminar/view?seminarSeq=59')]:
  page.goto('https://www.talentbank.co.kr'+route,wait_until='load');page.wait_for_timeout(1000)
  page.screenshot(path=str(root/(file+'.png')))
  print(file,page.evaluate('document.documentElement.scrollHeight'),flush=True)
 browser.close()
(root/'fixtures.json').write_text(json.dumps(fixtures,ensure_ascii=False),encoding='utf-8')

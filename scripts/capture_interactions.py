import sys,json
from pathlib import Path
from urllib.parse import urlparse
sys.path.insert(0,str(Path('.qa-tools').resolve()))
from playwright.sync_api import sync_playwright
output={}
def capture(response):
 if urlparse(response.url).netloc!='www.talentbank.co.kr' or response.request.resource_type not in ['xhr','fetch'] or not response.ok:return
 try:
  try:data=response.json()
  except:data=response.text()
  output.setdefault(urlparse(response.url).path,[]).append({'url':response.url,'post':response.request.post_data,'data':data})
 except:pass
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',headless=True)
 page=browser.new_page(viewport={'width':1440,'height':1000});page.on('response',capture)
 page.goto('https://www.talentbank.co.kr/common/search?searchValue=IPO',wait_until='load');page.wait_for_timeout(1000)
 for name in ['전문가','프로젝트','성공사례','세미나','아티클','FAQ']:
  page.locator('#searchWrap > .tabs .tab-item').filter(has_text=name).first.click();page.wait_for_timeout(700);print('Search tab',name,flush=True)
 page.goto('https://www.talentbank.co.kr/common/expert-list',wait_until='load');page.wait_for_timeout(500)
 for code in ['01','03','04','05','06','08','12','13','11','10']:
  selector=f"[onclick=\"lf_selectJobField('JOB_FD{code}', this, '')\"]"
  page.locator(selector).first.click();page.wait_for_timeout(250)
 browser.close()
Path('.mirror-source/interaction-fixtures.json').write_text(json.dumps(output,ensure_ascii=False),encoding='utf-8')
print('Saved interaction endpoints',list(output),flush=True)

import sys,json
from pathlib import Path
from urllib.parse import urlparse
sys.path.insert(0,str(Path('.qa-tools').resolve()))
from playwright.sync_api import sync_playwright
cache=Path('.mirror-source');assets=json.loads((cache/'assets.json').read_text(encoding='utf-8'))
urls=[url for url,path in assets.items() if url.startswith('https://www.talentbank.co.kr') and not Path(path).stat().st_size]
recovered=set()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',headless=True)
 page=browser.new_page()
 def capture(response):
  req=response.request
  while req.redirected_from:req=req.redirected_from
  origin=req.url
  if origin not in urls:return
  try:
   data=response.body()
   if data and response.ok:
    Path(assets[origin]).write_bytes(data);recovered.add(origin)
  except:pass
 page.on('response',capture)
 page.goto('https://www.talentbank.co.kr/',wait_until='load')
 page.evaluate('''urls=>{document.body.replaceChildren();for(const src of urls){const image=new Image();image.style.width='30px';image.src=src;document.body.append(image);}}''',urls)
 for i in range(20):
  page.wait_for_timeout(500)
  if len(recovered)==len(urls):break
 print('Recovered',len(recovered),'of',len(urls),'image assets',flush=True)
 browser.close()

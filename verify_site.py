import sys,json,threading,functools,base64
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
sys.path.insert(0,str(Path('.qa-tools').resolve()))
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(Path('.').resolve())))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
out=Path('verification/rebuilt');out.mkdir(parents=True,exist_ok=True)
report=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',headless=True)
 context=browser.new_context(viewport={'width':1440,'height':1000})
 for file in ['index.html','experts.html','projects.html','subscription.html','stories.html','recruit.html','seminars.html','search.html?searchValue=IPO','expert-14892.html','project-12084.html','story-142.html','seminar-59.html','login.html','signup.html','inquiry.html','faq.html','notices.html']:
  page=context.new_page();errors=[];missing=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.on('console',lambda message:errors.append(message.text) if message.type=='error' and 'Local response handler' in message.text else None)
  page.on('response',lambda response:missing.append(response.url) if response.status>=400 and response.url.startswith(base) else None)
  page.goto(base+file,wait_until='load');page.wait_for_timeout(1500)
  page.screenshot(path=str(out/(file.split('?')[0]+'.png')))
  (out/(file.split('?')[0]+'.dom')).write_text(page.content(),encoding='utf-8')
  images=page.evaluate('Array.from(document.images).filter(i=>i.getBoundingClientRect().width>0&&!i.complete||i.getBoundingClientRect().width>0&&i.complete&&i.naturalWidth===0).map(i=>i.src)')
  comparison=None
  reference=Path('.mirror-source')/(file.split('?')[0]+'.png')
  if reference.exists():
   pair=[base64.b64encode(reference.read_bytes()).decode(),base64.b64encode((out/(file.split('?')[0]+'.png')).read_bytes()).decode()]
   comparison=page.evaluate('''async pair=>{const data=await Promise.all(pair.map(encoded=>new Promise(resolve=>{const img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);resolve(ctx.getImageData(0,0,img.width,img.height).data);};img.src='data:image/png;base64,'+encoded;})));let sum=0;for(let i=0;i<data[0].length;i+=4){sum+=Math.abs(data[0][i]-data[1][i])+Math.abs(data[0][i+1]-data[1][i+1])+Math.abs(data[0][i+2]-data[1][i+2]);}return Math.round(10000*(1-sum/(data[0].length/4*3*255)))/100;}''',pair)
  report.append({'page':file,'errors':errors,'missing':missing,'brokenImages':images,'title':page.title(),'height':page.evaluate('document.documentElement.scrollHeight'),'pixelSimilarityPercent':comparison})
  print(json.dumps(report[-1],ensure_ascii=False),flush=True)
  page.close()
 browser.close()
server.shutdown()
(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

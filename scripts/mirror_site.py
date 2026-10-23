"""Capture public Talentbank pages and their assets for the local exercise."""
import sys, json, hashlib, re, threading, urllib.request, concurrent.futures
from pathlib import Path
from urllib.parse import urlparse, urljoin, unquote
sys.path.insert(0,str(Path('.qa-tools').resolve()))
from playwright.sync_api import sync_playwright

ORIGIN='https://www.talentbank.co.kr'
ROUTES={'index.html':'/','experts.html':'/common/expert-list','projects.html':'/project/projectMain','subscription.html':'/common/fractional-cxo','stories.html':'/common/success-list','recruit.html':'/recruit/recruitMain','seminars.html':'/common/seminar-list','search.html':'/common/search?searchValue=IPO'}
cache=Path('.mirror-source');cache.mkdir(exist_ok=True)
assets={}; fixtures={}; failures=[]
def asset_path(url):
    part=urlparse(url)
    ext=Path(part.path).suffix.lower()
    if ext not in ['.css','.js','.png','.jpg','.jpeg','.gif','.svg','.webp','.woff','.woff2','.ttf','.eot','.ico','.mp4']:ext='.bin'
    return 'assets/mirror/'+hashlib.sha256(url.encode()).hexdigest()[:20]+ext
def response_handler(response):
    url=response.url
    try:
        kind=response.request.resource_type
        if kind in ('stylesheet','script','image','font','media') and response.ok:
            if any(s in url for s in ['googletag','google-analytics','doubleclick','adfit','kakao','clarity.ms','facebook.net','youtube.com','naver.net']):return
            data=response.body(); path=asset_path(url)
            Path(path).parent.mkdir(parents=True,exist_ok=True);Path(path).write_bytes(data);assets[url]=path
        elif kind in ('xhr','fetch') and response.ok and 'talentbank.co.kr' in url:
            try:data=response.json()
            except:data=response.text()
            key=urlparse(url).path
            fixtures.setdefault(key,[]).append({'url':url,'post':response.request.post_data,'data':data})
    except Exception as error: failures.append([url,str(error)[:100]])

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',headless=True)
    context=browser.new_context(viewport={'width':1440,'height':1000})
    page=context.new_page();page.on('response',response_handler)
    for file,route in ROUTES.items():
        print('CAPTURE '+file,flush=True)
        response=page.goto(ORIGIN+route,wait_until='domcontentloaded',timeout=60000)
        (cache/(file+'.raw')).write_text(response.text(),encoding='utf-8')
        page.wait_for_timeout(2000)
        height=page.evaluate('document.documentElement.scrollHeight')
        for y in range(0,min(height,18000),800):page.evaluate('(y)=>window.scrollTo(0,y)',y);page.wait_for_timeout(90)
        page.wait_for_timeout(500);page.evaluate('window.scrollTo(0,0)')
        (cache/(file+'.dom')).write_text(page.content(),encoding='utf-8')
        page.screenshot(path=str(cache/(file+'.png')))
        print('  height='+str(height)+' fixtures='+str(len(fixtures))+' assets='+str(len(assets)),flush=True)
    browser.close()
(cache/'assets.json').write_text(json.dumps(assets,ensure_ascii=False),encoding='utf-8')
(cache/'fixtures.json').write_text(json.dumps(fixtures,ensure_ascii=False),encoding='utf-8')
(cache/'failures.json').write_text(json.dumps(failures,ensure_ascii=False),encoding='utf-8')
print('CAPTURE COMPLETE',flush=True)

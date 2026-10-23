import sys,json,threading,functools
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
sys.path.insert(0,str(Path('.qa-tools').resolve()))
from playwright.sync_api import sync_playwright,expect
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(Path('.').resolve())))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/';checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',headless=True)
 page=browser.new_page(viewport={'width':1440,'height':1000});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda m:errors.append(m.text) if m.type=='error' and 'Local response handler' in m.text else None)
 for file,label in [('experts.html','전문가 검색'),('projects.html','프로젝트'),('subscription.html','임원 구독제'),('stories.html','성공사례'),('recruit.html','인재추천'),('seminars.html','세미나')]:
  page.goto(base+'index.html');page.locator('.gnb-menu-name').filter(has_text=label).first.click();expect(page).to_have_url(__import__('re').compile('/'+file));checks.append('Navigation: '+label)
 page.goto(base+'index.html');page.locator('#localSearchKeyword').fill('마케팅');expect(page.locator('#autoSearchExpert')).to_be_visible();page.locator('#autoSearchExpert button').first.click();expect(page).to_have_url(__import__('re').compile('search.html'))
 expect(page.locator('.result-inner .text-client')).to_have_text('마케팅');expect(page.locator('#allListCnt')).not_to_have_text('NaN');checks.append('Original autocomplete, selection and search heading/count')
 page.goto(base+'index.html');page.locator('#localSearchKeyword').fill('');page.locator('#localSearchKeyword').press('Enter');expect(page).to_have_url(base+'index.html');checks.append('Empty search stays on home')
 page.locator('#localSearchKeyword').fill('IPO');page.locator('#localSearchKeyword').press('Enter');expect(page.locator('.result-inner .text-client')).to_have_text('IPO')
 for kind in ['SEARCH_TY002','SEARCH_TY005','SEARCH_TY006','SEARCH_TY010','SEARCH_TY007','SEARCH_TY008','SEARCH_TY001']:
  page.locator(f'#searchWrap > .tabs [data-field="{kind}"] a').click();page.wait_for_timeout(100)
 checks.append('All seven original search-result tabs')
 page.locator('#keywordDetail').fill('투자');page.locator('#keywordDetail').press('Enter');expect(page.locator('.detail-list-box .piece')).to_have_count(1);page.locator('.detail-list-box .piece .del').click();expect(page.locator('.detail-list-box .piece')).to_have_count(0);checks.append('Refinement chips add and remove')
 page.goto(base+'experts.html');page.locator('[onclick="lf_selectJobField(\'JOB_FD06\', this, \'\')"]').first.click();expect(page.locator('[id^="detailFieldUL_pc"] li')).not_to_have_count(0);checks.append('Expert field selection loads original subfields')
 page.goto(base+'stories.html');expect(page.locator('#successPostsDiv > ul > li')).to_have_count(20);page.locator('#successPostsDiv > .more-data button').click();expect(page.locator('#successPostsDiv > ul > li')).to_have_count(40);checks.append('Success-story pagination loads next 20 distinct items')
 page.goto(base+'seminars.html');expect(page.locator('#seminarPostsDiv > ul > li')).to_have_count(20);page.locator('#seminarPostsDiv > .more-data button').click();expect(page.locator('#seminarPostsDiv > ul > li')).to_have_count(40);checks.append('Seminar pagination loads next items')
 for path,expected in [('expert.html?userSeq=14892','expert-14892.html'),('project.html?projectSeq=12084','project-12084.html'),('story.html?successCaseSeq=142','story-142.html'),('seminar.html?seminarSeq=59','seminar-59.html')]:
  page.goto(base+path);expect(page).to_have_url(base+expected)
 checks.append('Four detail routes resolve to original local pages')
 expect(page.locator('.board-detail-content img')).to_be_visible();assert page.locator('.board-detail-content img').evaluate('(img)=>img.naturalWidth')>0;checks.append('Full seminar poster image loads')
 page.goto(base+'faq.html');expect(page.locator('#faqSearchLI > li')).not_to_have_count(0);page.locator('#faqSearchLI > li h4 a').first.click();checks.append('FAQ list and accordion')
 page.goto(Path('index.html').resolve().as_uri());expect(page.locator('#localSearchKeyword')).to_be_visible();page.locator('#localSearchKeyword').fill('IPO');page.locator('#localSearchKeyword').press('Enter');expect(page.locator('.result-inner .text-client')).to_have_text('IPO');checks.append('Opening index.html directly supports search')
 page.set_viewport_size({'width':390,'height':844})
 for file in ['index.html','experts.html','projects.html','subscription.html','stories.html','recruit.html','seminars.html','search.html?searchValue=IPO']:
  page.goto(base+file);page.wait_for_timeout(150);page.screenshot(path='verification/rebuilt/mobile-'+file.split('?')[0]+'.png');assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),file
 checks.append('Eight mobile screens fit 390px viewport')
 assert not errors,errors
 browser.close()
server.shutdown()
Path('verification/rebuilt/workflows.json').write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
print('\n'.join(checks))

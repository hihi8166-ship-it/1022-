const projects = [
  [
    "[농정원] 농식품 데이터안심구역 정책제안용 분석사례보고서 작성",
    "2026-10-26",
    "2026-11-02",
    "1개월 이내",
  ],
  [
    "프랜차이즈 운영체계 고도화 프로젝트",
    "2026-10-27",
    "2026-11-09",
    "6개월 이내",
  ],
  [
    "비전자식 행동변화 웨어러블 소재공학 전문가 대면자문",
    "2026-10-26",
    "2026-11-09",
    "1주일 이내",
  ],
  [
    "비전자식 행동변화 웨어러블 양산공정·금형 전문가 대면자문",
    "2026-10-26",
    "2026-11-09",
    "1주일 이내",
  ],
  [
    "스마트팩토리 및 물류자동화 시장성과 유사기업 조사",
    "모집완료",
    "2026-10-19",
    "1개월 이내",
  ],
  ["전략기획 팀장 급 채용 건", "모집완료", "2026-10-26", "6개월 이상"],
  [
    "의료기기 기업의 영업총괄이사 채용 건",
    "모집완료",
    "2026-10-19",
    "6개월 이상",
  ],
  [
    "프라이빗 테니스·웰니스 클럽 사업기획 및 사업성 검토",
    "모집완료",
    "2026-09-28",
    "6개월 이내",
  ],
];
const expertGroups = {
  투자컨설팅: [
    [
      "T",
      "성장단계별 자금조달, 투자유치부터 Value-up 전략까지",
      "투자/IPO · 신규사업/BD · 경영전략/관리",
      "tigersong**1",
    ],
    [
      "D",
      "양질의 투자자 확보와 안정적 지배구조, IPO 전략",
      "투자/IPO · 경영전략/관리",
      "dlee07**",
    ],
    [
      "S",
      "스타트업에서 글로벌기업까지, IPO의 경험을 나눕니다",
      "경영전략/신사업 · IT · 해외영업/무역",
      "starbu**",
    ],
    [
      "K",
      "투자자문 및 M&A, IPO 전략 총괄",
      "투자/IPO · M&A/PMI · 경영전략/관리",
      "kury**",
    ],
  ],
  해외진출: [
    [
      "J",
      "신사업 개발과 신시장 진출을 위한 글로벌 비즈니스 컨설턴트",
      "신규사업/BD · 경영전략/관리",
      "jamesangun**",
    ],
    [
      "E",
      "테크 스타트업 글로벌 사업 전문가, 글로벌 IR과 사업개발",
      "신규사업/BD · 홍보/PR",
      "eent12**",
    ],
    [
      "B",
      "베트남 사업현지화 솔루션 및 코칭 기반 컨설팅",
      "시장조사/데이터분석 · 마케팅전략",
      "bizign**",
    ],
    [
      "T",
      "해외영업, 마케팅과 경영전반 진단 및 전략 수립",
      "해외영업/무역 · 신규사업/BD",
      "tyhwan**",
    ],
  ],
  태양광: [
    [
      "Y",
      "문제해결은 정확한 문제 정의부터 시작입니다",
      "경영혁신/PI · 연구개발/설계",
      "yboh**",
    ],
    [
      "J",
      "환경사업분야 신규사업 기획 및 실행",
      "신규사업/BD · 기술/특허",
      "jxsjs10**",
    ],
    [
      "S",
      "신재생에너지 사업 운영 및 개발 전문가",
      "경영전략/신사업",
      "Sage7c**",
    ],
    ["B", "마이크로그리드 및 배전 분야 전문가", "연구개발/설계", "bike**"],
  ],
};
const fields = [
  ["▥", "경영전략·신사업", "신규사업/BD · 경영전략/관리"],
  ["↗", "영업·구매·유통", "B2B영업 · 해외영업/무역"],
  ["♙", "인사·총무", "인사 · 총무 · 교육 · 노무"],
  ["▧", "재무·투자", "재무/회계/자금 · 투자/IPO"],
  ["◎", "마케팅", "마케팅전략 · 브랜딩 · 홍보/PR"],
  ["⚙", "엔지니어링", "연구개발/설계 · 생산/제조"],
  ["⌘", "IT", "서비스기획 · 빅데이터/AI"],
  ["◇", "디자인·패션", "광고/영상 · 제품/공간디자인"],
  ["⚖", "법무·대정부", "정부지원사업 · 기술/특허"],
  ["⋯", "Others", "기타 전문분야"],
];
const escapeHTML = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let activeTab = "프로젝트",
  offset = 0,
  query = "";
const projectCards = document.querySelector("#project-cards");
function projectCard(p) {
  return `<button class="project-card" data-contact><div class="card-top"><span class="badge">${p[1] === "모집완료" ? "모집완료" : "모집중"}</span><span class="deadline">${p[1] === "모집완료" ? "" : `~ ${p[1]}`}</span></div><h3>${escapeHTML(p[0])}</h3><div class="meta"><p><span>진행</span>${p[2]} ~</p><p><span>기간</span>${p[3]}<span>　장소</span>협의/기타</p></div></button>`;
}
function renderProjects() {
  let content;
  if (activeTab === "프로젝트")
    content = projects.filter((p) => p[0].includes(query)).map(projectCard);
  else if (activeTab === "전문가")
    content = Object.values(expertGroups)
      .flat()
      .filter((p) => p.join(" ").includes(query))
      .map(
        (p) =>
          `<button class="project-card" data-contact><div class="card-top"><span class="badge">전문가</span><span class="deadline">${escapeHTML(p[3])}</span></div><h3>${escapeHTML(p[1])}</h3><div class="meta">${escapeHTML(p[2])}</div></button>`,
      );
  else
    content = [
      ["AI 1인 창업 워크숍", "2026.06.19"],
      [
        "회사의 성공과 구성원의 성장을 이루는 평가·보상 설계 전략",
        "2025.11.10",
      ],
      ["중대재해 예방을 위한 안전보건관리체계 구축 방안", "2025.09.25"],
      ["중소 브랜드들이 주도하는 화장품 해외진출", "2025.08.21"],
    ]
      .filter((p) => p[0].includes(query))
      .map(
        (p) =>
          `<button class="project-card" data-contact><div class="card-top"><span class="badge">종료</span><span class="deadline">세미나</span></div><h3>${p[0]}</h3><div class="meta">일시 : ${p[1]}<br>장소 : 휴넷 캠퍼스</div></button>`,
      );
  if (offset >= content.length) offset = 0;
  projectCards.innerHTML = content.slice(offset, offset + 4).join("");
  document.querySelector("#search-message").textContent = query
    ? `“${query}” 검색 결과 ${content.length}건`
    : "";
  if (!content.length)
    projectCards.innerHTML =
      "<p>일치하는 결과가 없습니다. 다른 검색어로 검색해 주세요.</p>";
}
function switchTab(tab) {
  activeTab = tab;
  offset = 0;
  document.querySelectorAll(".tabs button").forEach((b) => {
    const active = b.dataset.tab === tab;
    b.classList.toggle("active", active);
    b.setAttribute("aria-selected", active);
  });
  renderProjects();
}
document
  .querySelectorAll("[data-tab]")
  .forEach((button) =>
    button.addEventListener("click", () => switchTab(button.dataset.tab)),
  );
document.querySelector("#cards-next").addEventListener("click", () => {
  offset += 4;
  renderProjects();
});
document.querySelector("#cards-prev").addEventListener("click", () => {
  offset = Math.max(0, offset - 4);
  renderProjects();
});
document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  query = document.querySelector("#search").value.trim();
  offset = 0;
  renderProjects();
  document.querySelector("#projects").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#fields").innerHTML = fields
  .map(
    (f) =>
      `<button class="field" data-field="${f[1]}"><span class="field-icon" aria-hidden="true">${f[0]}</span><b>${f[1]}</b><p>${f[2]}</p></button>`,
  )
  .join("");
document.querySelectorAll("[data-field]").forEach((b) =>
  b.addEventListener("click", () => {
    switchTab("전문가");
    document.querySelector("#search").value = b.dataset.field;
    query = b.dataset.field.split("·")[0];
    renderProjects();
    document.querySelector("#projects").scrollIntoView({ behavior: "smooth" });
  }),
);
let saved = [];
try {
  saved = JSON.parse(localStorage.getItem("talentbank-saved") || "[]");
  if (!Array.isArray(saved)) saved = [];
} catch {}
function renderExperts(category) {
  document.querySelector("#expert-cards").innerHTML = expertGroups[category]
    .map(
      (p) =>
        `<article class="expert-card"><div class="avatar" aria-hidden="true">${p[0]}</div><button class="bookmark ${saved.includes(p[3]) ? "saved" : ""}" data-save="${p[3]}" aria-label="${p[3]} 전문가 스크랩" aria-pressed="${saved.includes(p[3])}">${saved.includes(p[3]) ? "♥" : "♡"}</button><h3>${escapeHTML(p[1])}</h3><div class="expert-tags">${escapeHTML(p[2])}</div><p class="expert-name">${p[3]}<span>전문가님</span></p></article>`,
    )
    .join("");
}
document.querySelectorAll("[data-category]").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll("[data-category]")
      .forEach((t) => t.classList.toggle("active", t === b));
    renderExperts(b.dataset.category);
  }),
);
let toastTimer;
document.addEventListener("click", (e) => {
  const contact = e.target.closest("[data-contact]");
  if (contact) document.querySelector("#contact-dialog").showModal();
  const save = e.target.closest("[data-save]");
  if (save) {
    const id = save.dataset.save;
    const existing = saved.includes(id);
    saved = existing ? saved.filter((x) => x !== id) : [...saved, id];
    try {
      localStorage.setItem("talentbank-saved", JSON.stringify(saved));
    } catch {}
    save.classList.toggle("saved", !existing);
    save.textContent = existing ? "♡" : "♥";
    save.setAttribute("aria-pressed", !existing);
    const toast = document.querySelector("#toast");
    toast.textContent = existing
      ? "스크랩이 해제되었습니다."
      : "전문가님이 스크랩되었습니다.";
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
  }
});
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => document.querySelector("dialog").close());
document.querySelector("dialog").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    const r = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      e.currentTarget.close();
  }
});
document
  .querySelector(".back-top")
  .addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
const slides = [
  [
    "기업의 고민에, 전문가라는 해답",
    "필요한 순간, 필요한 전문가<br><strong>탤런트뱅크</strong>에서 만나세요.",
    "경험이 다른 전문가의 인사이트로<br>비즈니스의 새로운 가능성을 열어보세요.",
  ],
  [
    "더 유연한 비즈니스의 시작",
    "우리 회사에 필요한 경험,<br><strong>임원 구독제</strong>로 만나세요.",
    "기업의 상황과 목표에 맞춰<br>전문가와 함께 다음 단계를 준비하세요.",
  ],
  [
    "당신의 경험이 새로운 기회로",
    "쌓아온 경험과 전문성,<br><strong>새로운 프로젝트</strong>로 이어집니다.",
    "나의 경험이 필요한 곳에서<br>전문가로서 더 넓은 가능성을 만나세요.",
  ],
];
let slide = 0,
  paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
function renderSlide() {
  document.querySelector(".eyebrow").textContent = slides[slide][0];
  document.querySelector(".hero h1").innerHTML = slides[slide][1];
  document.querySelector(".hero-description").innerHTML = slides[slide][2];
  document.querySelector("#slide-number").textContent = `0${slide + 1}`;
  document.querySelector(".progress i").style.width =
    `${((slide + 1) / 3) * 100}%`;
}
document.querySelector("#next-slide").addEventListener("click", () => {
  slide = (slide + 1) % 3;
  renderSlide();
});
document.querySelector("#prev-slide").addEventListener("click", () => {
  slide = (slide + 2) % 3;
  renderSlide();
});
const pauseButton = document.querySelector("#pause-slide");
function updatePause() {
  pauseButton.textContent = paused ? "▷" : "Ⅱ";
  pauseButton.setAttribute(
    "aria-label",
    paused ? "자동 재생 시작" : "자동 재생 정지",
  );
}
pauseButton.addEventListener("click", () => {
  paused = !paused;
  updatePause();
});
updatePause();
setInterval(() => {
  if (!paused && !document.hidden) {
    slide = (slide + 1) % 3;
    renderSlide();
  }
}, 7000);
renderProjects();
renderExperts("투자컨설팅");

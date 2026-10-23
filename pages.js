const page = document.querySelector("main").dataset.page;
const dialog = document.querySelector("#detail-dialog");
const contactDialog = document.querySelector("#contact-dialog");
const categories = {
  experts: ["전체", ...Object.keys(expertGroups)],
  projects: ["전체", "모집중", "모집완료"],
  stories: ["전체", "경영전략", "마케팅", "인사·조직"],
  seminars: ["전체", "종료", "후기"],
};
const seminars = [
  [
    "AI 1인 창업 워크숍",
    "2026.06.19",
    "종료",
    "AI 기술을 활용한 사업 아이디어 구체화와 실행 방향을 살펴보는 워크숍입니다.",
  ],
  [
    "회사의 성공과 구성원의 성장을 동시에 이루는 평가·보상 설계 전략",
    "2025.11.10",
    "종료",
    "기업의 목표와 구성원의 성장을 연결하는 평가·보상 설계에 대한 세미나입니다.",
  ],
  [
    "중대재해 예방을 위한 안전보건관리체계 구축 방안",
    "2025.09.25",
    "후기",
    "안전보건관리체계의 구축 방향과 현장의 실무 과제를 살펴봅니다.",
  ],
  [
    "중소 브랜드들이 주도하는 화장품 해외진출",
    "2025.08.21",
    "후기",
    "해외 시장 진출을 준비하는 브랜드가 점검할 과제와 전략을 살펴봅니다.",
  ],
  [
    "매출 성장을 만드는 디지털마케팅 성공 전략",
    "2025.07.23",
    "후기",
    "고객과 채널에 맞는 디지털마케팅 전략을 살펴봅니다.",
  ],
];
const stories = [
  [
    "신사업의 방향을 구체적인 실행 계획으로",
    "경영전략",
    "신사업 검토",
    "시장 기회와 내부 역량을 함께 검토해 사업의 우선순위를 정리합니다.",
    "시장 조사 → 사업 모델 검토 → 단계별 실행 로드맵",
  ],
  [
    "브랜드의 강점을 고객에게 전달하는 방법",
    "마케팅",
    "브랜드 전략",
    "고객과 경쟁 환경을 분석하고 브랜드의 차별화 방향을 구체화합니다.",
    "고객 분석 → 핵심 메시지 정리 → 채널별 실행 전략",
  ],
  [
    "성장을 뒷받침하는 평가·보상 체계",
    "인사·조직",
    "조직 운영",
    "조직의 목표와 직무 특성을 고려해 평가와 보상의 기준을 설계합니다.",
    "현황 진단 → 평가 기준 설계 → 운영 방안 수립",
  ],
  [
    "해외 시장 진출의 첫걸음",
    "경영전략",
    "해외진출",
    "진출 후보 시장과 비즈니스 환경을 검토하고 실행 과제를 정리합니다.",
    "시장 조사 → 진출 방식 검토 → 파트너 발굴 계획",
  ],
  [
    "데이터로 점검하는 마케팅 전략",
    "마케팅",
    "디지털마케팅",
    "채널별 고객 반응을 분석해 개선할 과제와 지표를 도출합니다.",
    "현황 분석 → 개선 과제 도출 → 성과 지표 설정",
  ],
  [
    "일하는 방식을 바꾸는 조직 진단",
    "인사·조직",
    "조직문화",
    "업무 흐름과 조직의 소통 방식을 살펴보고 개선 방향을 제안합니다.",
    "현황 인터뷰 → 업무 흐름 분석 → 개선안 제안",
  ],
];
let items = [];
if (page === "experts")
  items = Object.entries(expertGroups).flatMap(([category, group]) =>
    group.map((p) => ({
      title: p[1],
      category,
      body: p[2],
      name: p[3],
      initial: p[0],
    })),
  );
if (page === "projects")
  items = projects.map((p) => ({
    title: p[0],
    category: p[1] === "모집완료" ? "모집완료" : "모집중",
    body: `진행 : ${p[2]} ~\n기간 : ${p[3]}\n장소 : 협의/기타`,
    deadline: p[1],
  }));
if (page === "seminars")
  items = seminars.map((p) => ({
    title: p[0],
    category: p[2],
    body: `일시 : ${p[1]}\n장소 : 휴넷 캠퍼스\n\n${p[3]}`,
  }));
if (page === "stories")
  items = stories.map((p) => ({
    title: p[0],
    category: p[1],
    body: `과제 : ${p[2]}\n\n${p[3]}\n\n진행 방향\n${p[4]}`,
  }));
let saved = [];
try {
  saved = JSON.parse(localStorage.getItem("talentbank-saved") || "[]");
  if (!Array.isArray(saved)) saved = [];
} catch {}
let currentPage = 1;
const filter = document.querySelector("#list-filter");
function render() {
  const keyword = document.querySelector("#keyword").value.trim().toLowerCase();
  const category = document.querySelector("#category").value;
  const results = items
    .map((item, id) => ({ ...item, id }))
    .filter(
      (p) =>
        (category === "전체" || p.category === category) &&
        [p.title, p.body, p.name || "", p.category]
          .join(" ")
          .toLowerCase()
          .includes(keyword),
    );
  document.querySelector("#result-count").textContent =
    `총 ${results.length}건`;
  document.querySelector("#listing").innerHTML =
    results
      .slice((currentPage - 1) * 6, currentPage * 6)
      .map((p) =>
        page === "experts"
          ? `<article class="expert-card"><div class="avatar" aria-hidden="true">${p.initial}</div><button class="bookmark ${saved.includes(p.name) ? "saved" : ""}" data-save="${p.name}" aria-label="전문가 스크랩" aria-pressed="${saved.includes(p.name)}">${saved.includes(p.name) ? "♥" : "♡"}</button><h3>${escapeHTML(p.title)}</h3><div class="expert-tags">${escapeHTML(p.body)}</div><p class="expert-name">${escapeHTML(p.name)} 전문가님</p><button class="detail-link" data-detail="${p.id}">프로필 보기 →</button></article>`
          : `<button class="project-card" data-detail="${p.id}">${page === "stories" ? '<div class="story-cover">' + escapeHTML(p.category) + " INSIGHT</div>" : ""}<div class="card-top"><span class="badge">${escapeHTML(p.category)}</span>${p.deadline && p.category === "모집중" ? '<span class="deadline">~ ' + p.deadline + "</span>" : ""}</div><h3>${escapeHTML(p.title)}</h3><div class="meta">${escapeHTML(p.body.split("\n\n")[0]).replaceAll("\n", "<br>")}</div><span class="detail-link">자세히 보기 →</span></button>`,
      )
      .join("") ||
    '<p class="empty-state">검색 결과가 없습니다. 다른 검색어나 조건으로 검색해 주세요.</p>';
  document.querySelector("#pagination").innerHTML = Array.from(
    { length: Math.ceil(results.length / 6) },
    (_, i) =>
      `<button class="${currentPage === i + 1 ? "active" : ""}" ${currentPage === i + 1 ? 'aria-current="page"' : ""} data-number="${i + 1}">${i + 1}</button>`,
  ).join("");
}
if (filter) {
  document.querySelector("#category").innerHTML = categories[page]
    .map((x) => `<option>${x}</option>`)
    .join("");
  document.querySelector("#keyword").value =
    new URLSearchParams(location.search).get("q") || "";
  filter.addEventListener("submit", (e) => {
    e.preventDefault();
    currentPage = 1;
    render();
  });
  filter.addEventListener("reset", () => {
    setTimeout(() => {
      currentPage = 1;
      render();
    }, 0);
  });
  document.querySelector("#category").addEventListener("change", () => {
    currentPage = 1;
    render();
  });
  render();
  if (page === "stories") {
    const note = document.createElement("p");
    note.className = "source-note";
    note.textContent =
      "서비스 이해를 돕기 위한 예시 사례입니다. 실제 기업의 성과나 고객 후기를 의미하지 않습니다.";
    document.querySelector(".page-content").append(note);
  }
}
document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  location.href =
    "experts.html?q=" +
    encodeURIComponent(document.querySelector("#search").value.trim());
});
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-contact]")) contactDialog.showModal();
  const detail = e.target.closest("[data-detail]");
  if (detail) {
    const p = items[Number(detail.dataset.detail)];
    document.querySelector("#detail-content").innerHTML =
      `<p class="section-kicker">${escapeHTML(p.category)}</p><h2>${escapeHTML(p.title)}</h2><p class="detail-body">${escapeHTML(p.body)}</p>${p.name ? "<p>" + escapeHTML(p.name) + " 전문가님</p>" : ""}<p class="source-note">${page === "stories" ? "서비스 소개를 위한 예시 사례입니다." : page === "seminars" ? "종료된 세미나입니다. 새로운 일정은 공식 사이트에서 확인해 주세요." : "상세 조건과 실제 서비스 이용은 공식 사이트에서 확인해 주세요."}</p><a class="primary" href="https://www.talentbank.co.kr/" target="_blank" rel="noopener">공식 서비스 확인 →</a>`;
    dialog.showModal();
  }
  const save = e.target.closest("[data-save]");
  if (save) {
    const id = save.dataset.save;
    saved = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    try {
      localStorage.setItem("talentbank-saved", JSON.stringify(saved));
    } catch {}
    render();
  }
  const number = e.target.closest("[data-number]");
  if (number) {
    currentPage = Number(number.dataset.number);
    render();
    document
      .querySelector(".results-heading")
      .scrollIntoView({ behavior: "smooth" });
  }
});
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => contactDialog.close());
document
  .querySelector(".detail-close")
  .addEventListener("click", () => dialog.close());
for (const modal of [dialog, contactDialog])
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      const r = modal.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        modal.close();
    }
  });
document
  .querySelector(".back-top")
  .addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

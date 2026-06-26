const CODES = { user: "OPC-VIEW-2026", admin: "OPC-EDIT-2026" };
const STORAGE_KEYS = { materials: "opc_final_materials", requests: "opc_final_requests" };
let role = "user";
let authMode = "user";
let activeCategory = "all";

const seedMaterials = [
  { id:"m1", title:"抖音引流端开场三秒钩子", category:"抖音引流教程", platform:"抖音", platformKey:"dy", type:"视频", desc:"引流端培训营 / 抖音获客口播" },
  { id:"m2", title:"小红书图文种草七页结构", category:"小红书引流教程", platform:"小红书", platformKey:"xhs", type:"图文", desc:"引流端培训营 / 收藏型内容模板" },
  { id:"m3", title:"视频号教程内容承接SOP", category:"视频号引流教程", platform:"视频号", platformKey:"wx", type:"视频", desc:"引流端培训营 / 教程与私域承接" },
  { id:"m4", title:"闲鱼商品发布与私信成交", category:"闲鱼引流教程", platform:"闲鱼", platformKey:"xy", type:"SOP", desc:"引流端培训营 / 交易型线索承接" },
  { id:"m5", title:"BOSS直聘线索筛选话术", category:"BOSS引流教程", platform:"BOSS", platformKey:"boss", type:"文档", desc:"引流端培训营 / 招聘场景线索筛选" },
  { id:"m6", title:"销售端成交四步话术", category:"交付销售培训营", platform:"销售", platformKey:"ad", type:"视频", desc:"销售端培训营 / 需求确认到成交" },
  { id:"m7", title:"交付端客户管理SOP", category:"交付销售培训营", platform:"交付", platformKey:"ad", type:"文档", desc:"交付端培训营 / 交付节奏与复盘" },
  { id:"m8", title:"产品核心物料包", category:"产品核心物料", platform:"OPC", platformKey:"ad", type:"资料", desc:"产品介绍、卖点、价格和交付说明" },
  { id:"m9", title:"基础文档与SOP合集", category:"基础文档SOP", platform:"OPC", platformKey:"ad", type:"文档", desc:"学员手册、交付标准、常用流程" },
  { id:"m10", title:"高转化素材案例拆解", category:"高转化素材案例", platform:"案例", platformKey:"dy", type:"案例", desc:"爆款内容结构、标题、钩子与转化动作" },
  { id:"m11", title:"成交与交付完整案例", category:"成交交付案例", platform:"案例", platformKey:"xhs", type:"案例", desc:"从线索进入到成交交付的完整路径" },
  { id:"m12", title:"工具清单与FAQ", category:"工具清单FAQ", platform:"工具", platformKey:"wx", type:"工具", desc:"常用工具、账号、FAQ和公告" }
];

const titles = {
  home:"首页",
  agent:"代理认证卡密",
  materials:"培训营 / 物料资料",
  learning:"学习进度",
  assessment:"考核学习进度"
};

function $(s){ return document.querySelector(s); }
function $all(s){ return [...document.querySelectorAll(s)]; }
function esc(v){ return String(v ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m])); }
function getMaterials(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.materials)) || seedMaterials;}catch{return seedMaterials;} }
function setMaterials(list){ localStorage.setItem(STORAGE_KEYS.materials, JSON.stringify(list)); }
function getRequests(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.requests)) || [];}catch{return [];} }
function setRequests(list){ localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(list)); }

function setAuthTab(mode){
  authMode = mode;
  $all("[data-auth]").forEach(btn => btn.classList.toggle("active", btn.dataset.auth === mode));
  const isRegister = mode === "register";
  $("#passwordPanel").hidden = isRegister;
  $("#registerPanel").hidden = !isRegister;
  $("#formMessage").textContent = "";
  if(!isRegister){
    const admin = mode === "admin";
    $("#roleNote").innerHTML = admin ? `<b>管理员登录</b><span>管理权限：上传、删除、查看注册申请、查看完整数据。</span>` : `<b>用户登录</b><span>只读权限：查看素材、学习进度和资料内容。</span>`;
    $("#codeLabel").textContent = admin ? "管理员卡密" : "用户查看卡密";
    $("#accessCode").placeholder = admin ? "请输入管理员卡密" : "请输入用户卡密";
    $("#loginSubmit").textContent = admin ? "管理员登录管理系统" : "用户登录查看素材";
  }
}

function enterApp(nextRole){
  role = nextRole;
  document.body.classList.remove("locked");
  document.body.classList.toggle("admin", role === "admin");
  $("#loginScreen").hidden = true;
  $("#app").hidden = false;
  $("#roleBadge").textContent = role === "admin" ? "管理员" : "用户";
  showScreen("home");
  renderMaterials();
}

function showScreen(screen){
  $all(".screen").forEach(s => s.classList.remove("active"));
  $("#screen-" + screen).classList.add("active");
  $all(".main-nav button").forEach(btn => btn.classList.toggle("active", btn.dataset.screen === screen));
  $("#screenTitle").textContent = titles[screen] || "工作台";
  $("#crumb").textContent = titles[screen] || "工作台";
  if(screen === "materials") renderMaterials();
}

function renderMaterials(){
  const list = getMaterials().filter(item => activeCategory === "all" || item.category === activeCategory || (activeCategory === "引流端培训营" && item.category.includes("引流教程")));
  $("#materialHint").textContent = activeCategory === "all" ? "全部学习视频资料" : `当前分类：${activeCategory}`;
  $("#materialGrid").innerHTML = list.map(item => `
    <article class="material-card">
      <div class="card-cover"><span class="platform-badge ${esc(item.platformKey)}">${esc(item.platform)}</span></div>
      <div class="card-body">
        <small>${esc(item.category)} · ${esc(item.type)}</small>
        <p><b>${esc(item.title)}</b></p>
        <small>${esc(item.desc)}</small>
        <button class="delete-btn" data-delete="${esc(item.id)}">删除</button>
      </div>
    </article>
  `).join("") || `<div class="empty">当前分类暂无素材。</div>`;
}

function renderRequests(){
  const list = getRequests();
  $("#requestsList").innerHTML = list.length ? list.map(r => `<div class="rank-row"><em>申请</em><b>${esc(r.name)}</b><span>${esc(r.role === "admin" ? "管理员" : "用户")}</span><i>${esc(r.contact)}</i></div>`).join("") : `<p class="muted">暂无注册申请。</p>`;
}

$all("[data-auth]").forEach(btn => btn.addEventListener("click", () => setAuthTab(btn.dataset.auth)));
$("#loginCard").addEventListener("submit", e => {
  e.preventDefault();
  if(authMode === "register") return;
  const code = $("#accessCode").value.trim();
  if(code === CODES[authMode]) enterApp(authMode === "admin" ? "admin" : "user");
  else $("#formMessage").textContent = authMode === "admin" ? "管理员卡密不正确。" : "用户卡密不正确。";
});
$("#registerSubmit").addEventListener("click", () => {
  const req = { id:Date.now(), name:$("#regName").value.trim(), contact:$("#regContact").value.trim(), role:$("#regRole").value, note:$("#regNote").value.trim() };
  if(!req.name || !req.contact){ $("#formMessage").textContent = "请填写姓名和联系方式。"; return; }
  const list = getRequests(); list.unshift(req); setRequests(list);
  $("#formMessage").style.color = "#168f65";
  $("#formMessage").textContent = "注册申请已提交，等待管理员审核。";
  $("#regName").value = $("#regContact").value = $("#regNote").value = "";
});
$all(".main-nav button").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.screen)));
$("#switchAccess").addEventListener("click", () => location.reload());
$("#trainingTree").addEventListener("click", e => {
  const head = e.target.closest(".tree-head");
  if(head){ head.closest(".tree-group").classList.toggle("open"); return; }
  const btn = e.target.closest("[data-category]");
  if(!btn) return;
  activeCategory = btn.dataset.category;
  $all("[data-category]").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  showScreen("materials");
});
$("#openUpload").addEventListener("click", () => $("#uploadModal").showModal());
$("#openRequests").addEventListener("click", () => { renderRequests(); $("#requestsModal").showModal(); });
$("#saveMaterial").addEventListener("click", () => {
  const title = $("#upTitle").value.trim();
  if(!title) return;
  const list = getMaterials();
  list.unshift({ id:"up"+Date.now(), title, category:$("#upCategory").value, platform:$("#upPlatform").value.trim() || "OPC", platformKey:"ad", type:"上传", desc:"管理员上传的学习资料" });
  setMaterials(list); $("#upTitle").value = ""; $("#uploadModal").close(); activeCategory = "all"; renderMaterials();
});
$("#materialGrid").addEventListener("click", e => {
  const btn = e.target.closest("[data-delete]"); if(!btn || role !== "admin") return;
  setMaterials(getMaterials().filter(m => m.id !== btn.dataset.delete)); renderMaterials();
});
$("#verifyBtn").addEventListener("click", () => { $("#verifyText").textContent = "已完成认证 · OPC超级个体"; });
setAuthTab("user");

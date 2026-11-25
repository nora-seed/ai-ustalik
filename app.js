(function () {
  'use strict';

  const STORAGE_KEY = 'ai_ustalik_2026_state_v1';
  const DATA = window.APP_DATA;

  const defaultState = {
    theme: 'dark',
    role: 'dev',
    xp: 0,
    streak: 1,
    lastActiveDate: null,
    completedLessons: [],
    lessonNotes: {},
    lessonChecksDone: [],
    sm2: {},
    quizAnswers: {},
    roadmapDone: [],
    resourcesDone: [],
    resourcesFav: []
  };

  let state = loadState();
  let currentView = 'home';
  let activeLessonId = null;
  let activeLabTab = 'quiz';
  let activeLibTab = 'resources';
  let quizIndex = 0;
  let fcCategory = 'Tümü';
  let fcPracticeAll = false;
  let fcFlipped = false;
  let libSearch = '';
  let libCat = 'Tümü';
  let libLang = 'Tümü';
  let glossSearch = '';

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, defaultState);
      const parsed = JSON.parse(raw);
      return Object.assign({}, defaultState, parsed);
    } catch (e) {
      return Object.assign({}, defaultState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
    updateHeaderStats();
  }

  function updateStreak() {
    const today = todayStr();
    if (!state.lastActiveDate) {
      state.lastActiveDate = today;
      state.streak = 1;
      saveState();
      return;
    }
    if (state.lastActiveDate === today) return;
    const prev = new Date(state.lastActiveDate + 'T00:00:00');
    const curr = new Date(today + 'T00:00:00');
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) {
      state.streak += 1;
    } else if (diffDays > 1) {
      state.streak = 1;
    }
    state.lastActiveDate = today;
    saveState();
  }

  function addXP(amount, msg) {
    state.xp += amount;
    saveState();
    if (msg) showToast(`+${amount} XP — ${msg}`);
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
  }

  function updateHeaderStats() {
    const sp = document.getElementById('streak-pill');
    const xp = document.getElementById('xp-pill');
    if (sp) sp.textContent = `🔥 ${state.streak}g`;
    if (xp) xp.textContent = `⚡ ${state.xp} XP`;
  }

  function getDueFlashcards() {
    const now = Date.now();
    return DATA.flashcards.filter((c) => {
      if (fcCategory !== 'Tümü' && c.cat !== fcCategory) return false;
      if (fcPracticeAll) return true;
      const rec = state.sm2[c.id];
      return !rec || rec.nextReview <= now;
    });
  }

  function switchView(view) {
    currentView = view;
    if (view !== 'lessons') activeLessonId = null;
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    const target = document.getElementById('view-' + view);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-tab, .bnav-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.view === view);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderCurrentView();
  }

  function renderCurrentView() {
    if (currentView === 'home') renderHome();
    else if (currentView === 'lessons') renderLessons();
    else if (currentView === 'cards') renderCards();
    else if (currentView === 'lab') renderLab();
    else if (currentView === 'roadmap') renderRoadmap();
    else if (currentView === 'library') renderLibrary();
  }

  /* ==================== HOME ==================== */
  function renderHome() {
    const el = document.getElementById('view-home');
    const lessonsDone = state.completedLessons.length;
    const lessonsTotal = DATA.lessons.length;
    const dueCount = DATA.flashcards.filter((c) => !state.sm2[c.id] || state.sm2[c.id].nextReview <= Date.now()).length;
    const rm = DATA.roadmaps[state.role] || DATA.roadmaps.dev;
    const rmTasks = rm.months.flatMap((m) => m.tasks);
    const rmDone = rmTasks.filter((t) => state.roadmapDone.includes(t.id)).length;
    const quizCorrect = Object.keys(state.quizAnswers).filter((id) => {
      const q = DATA.quizzes.find((x) => x.id === id);
      return q && state.quizAnswers[id] === q.answer;
    }).length;

    const totalItems = lessonsTotal + rmTasks.length + DATA.quizzes.length;
    const doneItems = lessonsDone + rmDone + quizCorrect;
    const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

    el.innerHTML = `
      <div class="card hero-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;">
          <div>
            <span class="badge badge-accent">Aktif Kulvar: ${esc(rm.label)}</span>
            <h1 style="margin-top:8px;">Yapay Zekayı En Üst Seviyede Kullan</h1>
            <p class="muted">Bağlam &amp; Harness Mühendisliği, %90/%10 Yönlendirme, MCP, Hibrit RAG, Evals, KVKK ve Türkiye Ekosistemi — hepsi çevrimdışı cebinde.</p>
          </div>
        </div>
        <div style="margin-top:12px;">
          <div style="display:flex;justify-content:space-between;font-size:0.84rem;margin-bottom:5px;">
            <span>Genel Ustalık İlerlemesi</span>
            <strong>%${pct}</strong>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" data-go="lessons">📚 Derslere Başla</button>
          <button class="btn" data-go="cards">🧠 Hafıza Kartları (${dueCount} bekliyor)</button>
          <button class="btn" data-go="lab">🧪 Lab &amp; Simülatör</button>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-tile">
          <div class="stat-val">${lessonsDone}/${lessonsTotal}</div>
          <div class="stat-lbl">Tamamlanan Ders</div>
        </div>
        <div class="stat-tile">
          <div class="stat-val">${dueCount}</div>
          <div class="stat-lbl">Tekrar Bekleyen Kart</div>
        </div>
        <div class="stat-tile">
          <div class="stat-val">${rmDone}/${rmTasks.length}</div>
          <div class="stat-lbl">90 Gün Çıktısı</div>
        </div>
        <div class="stat-tile">
          <div class="stat-val">${quizCorrect}/${DATA.quizzes.length}</div>
          <div class="stat-lbl">Doğru Vaka Kararı</div>
        </div>
      </div>

      <div class="card">
        <h2>🏛️ 5 Katmanlı Sistem Mimarisi (Ajan = Model + Harness)</h2>
        <p class="muted small">Ortalama kullanıcı yalnızca sohbet komutuna odaklanır; üst düzey kullanım 5 katmanı birlikte yönetir. Detay için katmanlara dokun:</p>
        <div class="arch-stack">
          ${DATA.archLayers.map((l, idx) => `
            <div class="arch-layer ${idx === 0 ? 'open' : ''}" data-layer="${idx}">
              <div class="arch-layer-head">
                <span>${esc(l.num)} — ${esc(l.title)}</span>
                <span class="badge badge-accent">${esc(l.badge)}</span>
              </div>
              <div class="arch-layer-body">${esc(l.summary)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3>🎯 Neden Bu Uygulama Akılda Kalıcı?</h3>
          <p class="muted small">Kendi hızında çevrimiçi kursların tamamlanma oranı yalnızca <strong>%3–6</strong>'dır. Bu uygulama pasif okumayı 4 bilimsel teknikle kırar: <strong>Mikro-Dersler</strong>, <strong>SM-2 Aralıklı Tekrar</strong>, <strong>Gerçek Senaryo Quizleri</strong> ve <strong>90 Günlük Çıktı (Artifact) Takibi</strong>.</p>
        </div>
        <div class="card">
          <h3>🥗 2026 Bilgi Diyeti Kuralı</h3>
          <p class="muted small">Gürültüde boğulmamak için: En fazla <strong>2 bülten</strong> (TLDR AI + The Batch / One Useful Thing), <strong>2 sessiz topluluk</strong> (r/LocalLLaMA + HF Discord) ve <strong>1 aktif GitHub reposu</strong> seçip somut çıktı üret.</p>
          <button class="btn btn-sm" data-go="library" style="margin-top:6px;">🔎 Kaynak Kütüphanesini Aç</button>
        </div>
      </div>
    `;

    el.querySelectorAll('[data-go]').forEach((b) => {
      b.addEventListener('click', () => switchView(b.dataset.go));
    });
    el.querySelectorAll('.arch-layer').forEach((layer) => {
      layer.addEventListener('click', () => layer.classList.toggle('open'));
    });
  }

  /* ==================== LESSONS ==================== */
  function renderLessons() {
    const el = document.getElementById('view-lessons');
    if (activeLessonId) {
      const l = DATA.lessons.find((x) => x.id === activeLessonId);
      if (!l) { activeLessonId = null; renderLessons(); return; }
      const isDone = state.completedLessons.includes(l.id);
      const checkDone = state.lessonChecksDone.includes(l.id);
      const note = state.lessonNotes[l.id] || '';

      el.innerHTML = `
        <div class="btn-row" style="margin-top:0;margin-bottom:12px;">
          <button class="btn btn-sm" id="back-lessons">← Tüm Dersler</button>
          <span class="badge badge-accent">${esc(l.tag)} • ${esc(l.duration)}</span>
          ${isDone ? '<span class="badge badge-success">✓ Tamamlandı</span>' : ''}
        </div>
        <div class="card">
          <h1>${esc(l.title)}</h1>
          <div class="callout">
            <strong>💡 Zihin Modeli (Tek Cümlede Öz):</strong><br/>
            ${esc(l.mentalModel)}
          </div>
          ${l.sections.map((s) => `
            <div class="lesson-section">
              <h3>${esc(s.heading)}</h3>
              <ul>
                ${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}

          <div class="card-soft" style="margin-top:16px;">
            <h3>⚡ Hızlı Anlama Kontrolü</h3>
            <p style="font-weight:600;">${esc(l.check.q)}</p>
            <div id="lesson-check-opts">
              ${l.check.options.map((opt, idx) => `
                <button class="quiz-opt" data-opt="${idx}">${esc(opt)}</button>
              `).join('')}
            </div>
            <div id="lesson-check-fb" class="muted small" style="margin-top:8px;"></div>
          </div>

          <div class="card-soft" style="margin-top:14px;">
            <label class="field-lbl" for="lesson-note">📝 Kişisel Ders Notum (Otomatik Kaydedilir)</label>
            <textarea id="lesson-note" rows="3" placeholder="Bu dersten kendi işime/projeme uyarlayacağım somut aksiyon...">${esc(note)}</textarea>
          </div>

          <div class="btn-row" style="justify-content:space-between;margin-top:16px;">
            <button class="btn ${isDone ? 'btn-success' : 'btn-primary'}" id="toggle-lesson-done">
              ${isDone ? '✓ Ders Tamamlandı (Geri Al)' : '✓ Dersi Tamamlandı İşaretle (+25 XP)'}
            </button>
            <button class="btn" id="next-lesson-btn">Sonraki Ders →</button>
          </div>
        </div>
      `;

      document.getElementById('back-lessons').addEventListener('click', () => {
        activeLessonId = null;
        renderLessons();
      });

      const opts = el.querySelectorAll('#lesson-check-opts .quiz-opt');
      const fb = document.getElementById('lesson-check-fb');
      if (checkDone) {
        opts[l.check.answer].classList.add('correct');
        fb.innerHTML = `<strong style="color:var(--success)">✓ Doğru!</strong> ${esc(l.check.explain)}`;
      }
      opts.forEach((btn) => {
        btn.addEventListener('click', () => {
          const chosen = Number(btn.dataset.opt);
          opts.forEach((b) => { b.disabled = true; });
          if (chosen === l.check.answer) {
            btn.classList.add('correct');
            fb.innerHTML = `<strong style="color:var(--success)">✓ Harika!</strong> ${esc(l.check.explain)}`;
            if (!state.lessonChecksDone.includes(l.id)) {
              state.lessonChecksDone.push(l.id);
              addXP(15, 'Hızlı kontrol doğru!');
            }
          } else {
            btn.classList.add('wrong');
            opts[l.check.answer].classList.add('correct');
            fb.innerHTML = `<strong style="color:var(--danger)">✕ Tam değil.</strong> ${esc(l.check.explain)}`;
          }
        });
      });

      document.getElementById('lesson-note').addEventListener('input', (e) => {
        state.lessonNotes[l.id] = e.target.value;
        saveState();
      });

      document.getElementById('toggle-lesson-done').addEventListener('click', () => {
        if (state.completedLessons.includes(l.id)) {
          state.completedLessons = state.completedLessons.filter((x) => x !== l.id);
          saveState();
          showToast('Ders tamamlandı işareti kaldırıldı');
        } else {
          state.completedLessons.push(l.id);
          addXP(25, 'Ders tamamlandı!');
        }
        renderLessons();
      });

      document.getElementById('next-lesson-btn').addEventListener('click', () => {
        const idx = DATA.lessons.findIndex((x) => x.id === l.id);
        const next = DATA.lessons[(idx + 1) % DATA.lessons.length];
        activeLessonId = next.id;
        renderLessons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }

    el.innerHTML = `
      <div class="card">
        <h1>📚 Etkileşimli Mikro-Dersler</h1>
        <p class="muted">Raporun tüm kritik mimari ve strateji başlıkları 5 dakikalık lokmalara bölündü. Her derste zihin modeli, kontrol sorusu ve kişisel not alanı bulunur.</p>
      </div>
      ${DATA.lessons.map((l) => {
        const done = state.completedLessons.includes(l.id);
        const hasNote = !!(state.lessonNotes[l.id] && state.lessonNotes[l.id].trim());
        return `
          <div class="lesson-list-item" data-lesson="${l.id}">
            <div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                <span class="badge badge-accent">${esc(l.tag)}</span>
                <span class="badge">${esc(l.duration)}</span>
                ${done ? '<span class="badge badge-success">✓ Tamamlandı</span>' : ''}
                ${hasNote ? '<span class="badge badge-purple">📝 Not var</span>' : ''}
              </div>
              <h3 style="margin-bottom:4px;">${esc(l.title)}</h3>
              <p class="muted small" style="margin:0;">${esc(l.mentalModel)}</p>
            </div>
            <span style="font-size:1.2rem;color:var(--accent);">→</span>
          </div>
        `;
      }).join('')}
    `;

    el.querySelectorAll('[data-lesson]').forEach((item) => {
      item.addEventListener('click', () => {
        activeLessonId = item.dataset.lesson;
        renderLessons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* ==================== SM-2 FLASHCARDS ==================== */
  function sm2Next(rec, quality) {
    // quality: 1 (Tekrar), 3 (Zor), 4 (İyi), 5 (Kolay)
    let reps = rec ? rec.repetitions : 0;
    let interval = rec ? rec.interval : 0;
    let ef = rec ? rec.easeFactor : 2.5;

    if (quality < 3) {
      reps = 0;
      interval = 0; // review again in 1 minute
    } else {
      if (reps === 0) interval = 1;
      else if (reps === 1) interval = 6;
      else interval = Math.round(interval * ef);
      if (quality === 3) interval = Math.max(1, Math.round(interval * 0.8));
      if (quality === 5) interval = Math.round(interval * 1.3);
      reps += 1;
    }

    ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    const nextReview = interval === 0 ? Date.now() + 60 * 1000 : Date.now() + interval * 86400000;
    return { repetitions: reps, interval, easeFactor: Number(ef.toFixed(2)), nextReview };
  }

  function renderCards() {
    const el = document.getElementById('view-cards');
    const cats = ['Tümü', ...Array.from(new Set(DATA.flashcards.map((c) => c.cat)))];
    const due = getDueFlashcards();
    const card = due[0];

    el.innerHTML = `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div>
            <h1 style="margin:0;">🧠 Aralıklı Tekrar (SM-2)</h1>
            <p class="muted small" style="margin:4px 0 0;">Zorlandığın kartlar daha sık, kolay bildiklerin giderek artan aralıklarla karşına çıkar.</p>
          </div>
          <span class="badge badge-accent">${due.length} kart sırada</span>
        </div>
        <div class="chip-row">
          ${cats.map((c) => `<button class="chip ${fcCategory === c ? 'active' : ''}" data-fcat="${esc(c)}">${esc(c)}</button>`).join('')}
        </div>
      </div>
      ${card ? `
        <div class="flashcard-wrap">
          <div class="flashcard ${fcFlipped ? 'flipped' : ''}" id="active-fc">
            <div class="fc-face fc-front">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="badge badge-accent">${esc(card.cat)}</span>
                <span class="muted small">Cevabı görmek için dokun</span>
              </div>
              <div class="fc-q">${esc(card.q)}</div>
              <div class="muted small" style="text-align:center;">👆 Karta dokun veya boşluk tuşuna bas</div>
            </div>
            <div class="fc-face fc-back">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="badge badge-success">Cevap</span>
                <span class="badge">${esc(card.cat)}</span>
              </div>
              <div class="fc-a">${esc(card.a)}</div>
              <div class="muted small" style="text-align:center;">Ne kadar kolay hatırladın? Aşağıdan puanla</div>
            </div>
          </div>
        </div>
        <div class="rating-grid">
          <button class="btn btn-danger btn-sm" data-rate="1">Tekrar<br/><span class="small">1 dk</span></button>
          <button class="btn btn-warn btn-sm" data-rate="3">Zor<br/><span class="small">${Math.max(1, sm2Next(state.sm2[card.id], 3).interval)} gün</span></button>
          <button class="btn btn-primary btn-sm" data-rate="4">İyi<br/><span class="small">${sm2Next(state.sm2[card.id], 4).interval} gün</span></button>
          <button class="btn btn-success btn-sm" data-rate="5">Kolay<br/><span class="small">${sm2Next(state.sm2[card.id], 5).interval} gün</span></button>
        </div>
      ` : `
        <div class="card" style="text-align:center;padding:30px 18px;">
          <h2>🎉 Harika! Bugünkü tüm tekrarlar bitti.</h2>
          <p class="muted">Seçili kategoride tekrar zamanı gelmiş kart kalmadı. Beynin şu an bilgileri pekiştiriyor.</p>
          <div class="btn-row" style="justify-content:center;">
            <button class="btn btn-primary" id="fc-practice-btn">🔄 Tüm Kartlarla Serbest Tekrar Yap</button>
          </div>
        </div>
      `}
    `;

    el.querySelectorAll('[data-fcat]').forEach((b) => {
      b.addEventListener('click', () => {
        fcCategory = b.dataset.fcat;
        fcFlipped = false;
        renderCards();
      });
    });

    const fcEl = document.getElementById('active-fc');
    if (fcEl) {
      fcEl.addEventListener('click', () => {
        fcFlipped = !fcFlipped;
        fcEl.classList.toggle('flipped', fcFlipped);
      });
    }

    el.querySelectorAll('[data-rate]').forEach((b) => {
      b.addEventListener('click', () => {
        if (!card) return;
        const q = Number(b.dataset.rate);
        state.sm2[card.id] = sm2Next(state.sm2[card.id], q);
        if (fcPracticeAll && q >= 3) {
          // Move practiced card to end visually by temporarily turning off practiceAll if none left
          const idx = DATA.flashcards.findIndex((x) => x.id === card.id);
          if (idx > -1) {
            const moved = DATA.flashcards.splice(idx, 1)[0];
            DATA.flashcards.push(moved);
          }
        }
        fcFlipped = false;
        addXP(5, 'Kart tekrar edildi');
        renderCards();
      });
    });

    const pracBtn = document.getElementById('fc-practice-btn');
    if (pracBtn) {
      pracBtn.addEventListener('click', () => {
        fcPracticeAll = true;
        fcFlipped = false;
        renderCards();
      });
    }
  }

  /* ==================== LAB & QUIZ ==================== */
  function renderLab() {
    const el = document.getElementById('view-lab');
    el.innerHTML = `
      <div class="card">
        <h1>🧪 Pratik Laboratuvar &amp; Senaryo Quizleri</h1>
        <div class="chip-row">
          <button class="chip ${activeLabTab === 'quiz' ? 'active' : ''}" data-ltab="quiz">🎯 Senaryo Quizi (${DATA.quizzes.length})</button>
          <button class="chip ${activeLabTab === 'cost' ? 'active' : ''}" data-ltab="cost">💰 Maliyet Simülatörü</button>
          <button class="chip ${activeLabTab === 'gen' ? 'active' : ''}" data-ltab="gen">🛠️ Prompt / AGENTS / SKILL Üretici</button>
          <button class="chip ${activeLabTab === 'sec' ? 'active' : ''}" data-ltab="sec">🛡️ Ölümcül Üçlü Denetçisi</button>
        </div>
      </div>
      <div id="lab-body"></div>
    `;

    el.querySelectorAll('[data-ltab]').forEach((b) => {
      b.addEventListener('click', () => {
        activeLabTab = b.dataset.ltab;
        renderLab();
      });
    });

    const body = document.getElementById('lab-body');
    if (activeLabTab === 'quiz') renderQuizTab(body);
    else if (activeLabTab === 'cost') renderCostTab(body);
    else if (activeLabTab === 'gen') renderGenTab(body);
    else if (activeLabTab === 'sec') renderSecTab(body);
  }

  function renderQuizTab(container) {
    const q = DATA.quizzes[quizIndex];
    const answered = state.quizAnswers[q.id];
    const correctCount = DATA.quizzes.filter((x) => state.quizAnswers[x.id] === x.answer).length;

    container.innerHTML = `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span class="badge badge-accent">Vaka ${quizIndex + 1} / ${DATA.quizzes.length} • ${esc(q.cat)}</span>
          <span class="badge badge-success">Doğru: ${correctCount}/${DATA.quizzes.length}</span>
        </div>
        <div class="callout">${esc(q.scenario)}</div>
        <h3>${esc(q.q)}</h3>
        <div id="q-opts">
          ${q.options.map((opt, idx) => {
            let cls = 'quiz-opt';
            if (answered !== undefined) {
              if (idx === q.answer) cls += ' correct';
              else if (idx === answered) cls += ' wrong';
            }
            return `<button class="${cls}" data-qi="${idx}" ${answered !== undefined ? 'disabled' : ''}>${esc(opt)}</button>`;
          }).join('')}
        </div>
        ${answered !== undefined ? `
          <div class="card-soft" style="margin-top:10px;">
            <strong style="color:${answered === q.answer ? 'var(--success)' : 'var(--danger)'};">
              ${answered === q.answer ? '✓ Doğru Karar!' : '✕ Yanlış Karar.'}
            </strong>
            <p class="small" style="margin:6px 0 0;">${esc(q.explain)}</p>
          </div>
        ` : ''}
        <div class="btn-row" style="justify-content:space-between;margin-top:14px;">
          <button class="btn btn-sm" id="q-prev">← Önceki</button>
          <button class="btn btn-sm" id="q-reset">🔄 Quizi Sıfırla</button>
          <button class="btn btn-primary btn-sm" id="q-next">Sonraki →</button>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-qi]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = Number(btn.dataset.qi);
        state.quizAnswers[q.id] = chosen;
        if (chosen === q.answer) addXP(15, 'Doğru mimari karar!');
        else saveState();
        renderQuizTab(container);
      });
    });

    document.getElementById('q-prev').addEventListener('click', () => {
      quizIndex = (quizIndex - 1 + DATA.quizzes.length) % DATA.quizzes.length;
      renderQuizTab(container);
    });
    document.getElementById('q-next').addEventListener('click', () => {
      quizIndex = (quizIndex + 1) % DATA.quizzes.length;
      renderQuizTab(container);
    });
    document.getElementById('q-reset').addEventListener('click', () => {
      state.quizAnswers = {};
      quizIndex = 0;
      saveState();
      showToast('Quiz cevapları sıfırlandı');
      renderQuizTab(container);
    });
  }

  function renderCostTab(container) {
    container.innerHTML = `
      <div class="card">
        <h2>💰 Prompt Caching + Batch API + %90/%10 Yönlendirme Simülatörü</h2>
        <p class="muted small">Tekrarlanan sistem promptu içeren bir ajan veya API servisinde optimizasyonların günlük ve aylık faturanıza etkisini anlık hesaplayın.</p>
        <div class="grid-2">
          <div>
            <label class="field-lbl">Günlük İstek Sayısı: <strong id="v-req">2000</strong></label>
            <input type="range" id="s-req" min="100" max="20000" step="100" value="2000" />

            <label class="field-lbl">Sabit Sistem Promptu + Araç Tokenı: <strong id="v-sys">20000</strong></label>
            <input type="range" id="s-sys" min="1000" max="50000" step="1000" value="20000" />

            <label class="field-lbl">KV-Cache İsabet Oranı (%): <strong id="v-cache">85</strong>%</label>
            <input type="range" id="s-cache" min="0" max="98" step="1" value="85" />

            <label class="field-lbl">Akıl Yürütme (Premium) Model Payı (%): <strong id="v-prem">10</strong>%</label>
            <input type="range" id="s-prem" min="0" max="100" step="5" value="10" />

            <label class="check-item" style="margin-top:12px;">
              <input type="checkbox" id="s-batch" checked />
              <span><strong>Batch API (%50 asenkron indirim)</strong> kullan (Destekleyen sağlayıcıda Cache ile birleşir)</span>
            </label>
          </div>
          <div class="card-soft" id="cost-result" style="display:flex;flex-direction:column;justify-content:center;"></div>
        </div>
      </div>
    `;

    function calc() {
      const req = Number(document.getElementById('s-req').value);
      const sysTok = Number(document.getElementById('s-sys').value);
      const cacheHit = Number(document.getElementById('s-cache').value) / 100;
      const premShare = Number(document.getElementById('s-prem').value) / 100;
      const useBatch = document.getElementById('s-batch').checked;

      document.getElementById('v-req').textContent = req.toLocaleString('tr-TR');
      document.getElementById('v-sys').textContent = sysTok.toLocaleString('tr-TR');
      document.getElementById('v-cache').textContent = Math.round(cacheHit * 100);
      document.getElementById('v-prem').textContent = Math.round(premShare * 100);

      // Model prices per 1M input tokens (representative 2026 rates: Premium $5/1M, Fast $0.8/1M; Output 500 tok/req)
      const dynIn = 500;
      const outTok = 500;
      const premInRate = 5.0 / 1e6;
      const premOutRate = 25.0 / 1e6;
      const fastInRate = 0.8 / 1e6;
      const fastOutRate = 4.0 / 1e6;

      // Baseline: 100% Premium, no cache, no batch
      const baseDaily = req * ((sysTok + dynIn) * premInRate + outTok * premOutRate);

      // Optimized: Routing + Cache (90% discount on cached prefix) + Batch (50% discount)
      const effInRate = premShare * premInRate + (1 - premShare) * fastInRate;
      const effOutRate = premShare * premOutRate + (1 - premShare) * fastOutRate;
      const cachedSysCost = sysTok * (cacheHit * 0.1 + (1 - cacheHit) * 1.0) * effInRate;
      let optDaily = req * (cachedSysCost + dynIn * effInRate + outTok * effOutRate);
      if (useBatch) optDaily *= 0.5;

      const savingsPct = baseDaily > 0 ? Math.max(0, (1 - optDaily / baseDaily) * 100) : 0;

      document.getElementById('cost-result').innerHTML = `
        <div class="stat-lbl">Optimizasyonsuz (Tam Premium, Cache Yok)</div>
        <div style="font-size:1.25rem;font-weight:700;color:var(--danger);margin-bottom:10px;">
          $${baseDaily.toFixed(2)} / gün &nbsp;($${(baseDaily * 30).toFixed(0)} / ay)
        </div>
        <div class="stat-lbl">Optimize Edilmiş Mimari</div>
        <div style="font-size:1.5rem;font-weight:800;color:var(--success);margin-bottom:10px;">
          $${optDaily.toFixed(2)} / gün &nbsp;($${(optDaily * 30).toFixed(0)} / ay)
        </div>
        <span class="badge badge-success" style="align-self:flex-start;font-size:0.9rem;">📉 Toplam Tasarruf: %${savingsPct.toFixed(1)}</span>
        <p class="muted small" style="margin-top:10px;">İpucu: Sistem promptunun başına saniyeli saat koyarsan Cache isabeti %0'a düşer. Görev başı toplam maliyeti takip et.</p>
      `;
    }

    ['s-req', 's-sys', 's-cache', 's-prem', 's-batch'].forEach((id) => {
      document.getElementById(id).addEventListener('input', calc);
    });
    calc();
  }

  function renderGenTab(container) {
    container.innerHTML = `
      <div class="card">
        <h2>🛠️ Şablon Üretici (XML Prompt / AGENTS.md / SKILL.md)</h2>
        <p class="muted small">Doğru İrtifa (Right Altitude) ve Kademeli Yükleme (Progressive Disclosure) ilkelerine uygun, kopyalanabilir şablon oluşturun.</p>
        <label class="field-lbl" for="g-type">Şablon Türü</label>
        <select id="g-type">
          <option value="xml">XML Yapılı Sistem Promptu (Doğru İrtifa)</option>
          <option value="agents">AGENTS.md / CLAUDE.md (Kodlama Ajanı Kuralları)</option>
          <option value="skill">SKILL.md (Agent Skills Standardı)</option>
        </select>

        <label class="field-lbl" for="g-role">Rol / Proje / Beceri Adı</label>
        <input type="text" id="g-role" value="Kıdemli Python & PWA Mimarı" />

        <label class="field-lbl" for="g-goal">Temel Görev ve Kapsam</label>
        <input type="text" id="g-goal" value="Kullanıcı gereksinimlerini test edilebilir, çevrimdışı çalışan temiz koda dönüştürmek" />

        <label class="field-lbl" for="g-rules">Kısıtlar / Kapsam Dışı (Non-Goals)</label>
        <input type="text" id="g-rules" value="Harici CDN kullanma; doğrulanmamış bilgi uydurma; her değişiklikte test çalıştır" />

        <pre class="code-out" id="g-out"></pre>
        <div class="btn-row">
          <button class="btn btn-primary btn-sm" id="g-copy">📋 Kopyala</button>
        </div>
      </div>
    `;

    function build() {
      const t = document.getElementById('g-type').value;
      const role = document.getElementById('g-role').value.trim() || 'Uzman Asistan';
      const goal = document.getElementById('g-goal').value.trim() || 'Görevi yüksek doğrulukla tamamla';
      const rules = document.getElementById('g-rules').value.trim() || 'Kaynak yoksa uydurma';
      let out = '';

      if (t === 'xml') {
        out = `<role>\n${role}\n</role>\n\n<instructions>\nAmaç: ${goal}\n1. Önce eksik kritik bilgi varsa kısaca netleştir.\n2. Kısıtlar: ${rules}\n3. Doğrulanmış kaynak yoksa tahmin yürütmek yerine açıkça belirt (Abstention).\n</instructions>\n\n<data>\n{{KULLANICI_VERISI_VEYA_BAGLAM}}\n</data>\n\n<output_format>\nKısa yönetici özeti + maddeli somut aksiyonlar + doğrulama kontrol listesi.\n</output_format>`;
      } else if (t === 'agents') {
        out = `# AGENTS.md — ${role}\n\n## Proje Özeti\n${goal}\n\n## Çalışma Disiplini (Spec-Driven Development)\n- Yeni özellik öncesi salt-okunur Plan Modu ile etki analizi çıkar.\n- Önce başarısız olan testi yaz, sonra minimum kodu ekleyip testi geçir.\n- Her oturumda yalnızca tek bir tamamlanmamış özelliğe odaklan ve temiz git commit bırak.\n\n## Kısıtlar ve Kapsam Dışı (Non-Goals)\n- ${rules}\n- API anahtarlarını veya kişisel verileri (KVKK) koda ve günlüklere asla yazma.\n\n## Doğrulama Komutları\n- Test: \`npm test\` / \`pytest\`\n- Lint: \`npm run lint\``;
      } else {
        out = `---\nname: ${role.toLowerCase().replace(/[^a-z0-9ğüşöçı]+/g, '-')}\ndescription: "${goal}. Bu görev istendiğinde otomatik tetiklenir."\n---\n\n# ${role} Becerisi\n\n## Ne Zaman Kullanılır?\nKullanıcı şu kapsamda bir çıktı istediğinde: ${goal}\n\n## Adım Adım Yönerge\n1. Yalnızca bu görev için gereken dosyaları (glob/grep ile) anında oku.\n2. Şu kısıtlara kesinlikle uy: ${rules}\n3. Çıktıyı teslim etmeden önce kenar durumları ve doğrulama ölçütlerini kontrol et.\n\n## Beklenen Çıktı\nDoğrulanmış, tekrarlanabilir ve minimum bağlam tüketen nihai çalışma çıktısı.`;
      }
      document.getElementById('g-out').textContent = out;
    }

    ['g-type', 'g-role', 'g-goal', 'g-rules'].forEach((id) => {
      document.getElementById(id).addEventListener('input', build);
    });
    document.getElementById('g-copy').addEventListener('click', () => {
      navigator.clipboard.writeText(document.getElementById('g-out').textContent)
        .then(() => showToast('Şablon panoya kopyalandı!'))
        .catch(() => showToast('Kopyalama için metni seçebilirsiniz'));
    });
    build();
  }

  function renderSecTab(container) {
    container.innerHTML = `
      <div class="card">
        <h2>🛡️ Ölümcül Üçlü (Lethal Trifecta) Risk Denetçisi</h2>
        <p class="muted small">Tasarladığınız ajanın sahip olduğu yetkileri işaretleyin; dolaylı komut enjeksiyonu riskini anında ölçün.</p>
        <label class="check-item"><input type="checkbox" id="sec-priv" checked /><span><strong>1. Hassas / Özel Verilere Erişim</strong> (E-posta, müşteri DB, kaynak kodu, yerel dosyalar)</span></label>
        <label class="check-item"><input type="checkbox" id="sec-untrust" checked /><span><strong>2. Güvenilmeyen Dış İçeriğe Maruz Kalma</strong> (Web sayfaları, gelen e-postalar, 3. taraf PDF/GitHub issue)</span></label>
        <label class="check-item"><input type="checkbox" id="sec-exfil" checked /><span><strong>3. Dışa İletişim Yeteneği</strong> (E-posta gönderme, HTTP isteği, PR açma, dış görsel linki)</span></label>
        <hr style="border:0;border-top:1px solid var(--border);margin:14px 0;" />
        <label class="check-item"><input type="checkbox" id="sec-hitl" /><span><strong>Koruma A: İnsan Onay Kapısı (HITL)</strong> — Geri döndürülemez ve dışa gönderim işlemlerinde zorunlu onay</span></label>
        <label class="check-item"><input type="checkbox" id="sec-sand" /><span><strong>Koruma B: İzole Sandbox &amp; Ağ Kısıtı</strong> — Kod/okuma adımında yazma ve dış ağ kapalı</span></label>
        <div id="sec-res" class="card-soft" style="margin-top:14px;"></div>
      </div>
    `;

    function evalSec() {
      const priv = document.getElementById('sec-priv').checked;
      const untrust = document.getElementById('sec-untrust').checked;
      const exfil = document.getElementById('sec-exfil').checked;
      const hitl = document.getElementById('sec-hitl').checked;
      const sand = document.getElementById('sec-sand').checked;
      const trifecta = priv && untrust && exfil;
      const res = document.getElementById('sec-res');

      if (trifecta && !hitl && !sand) {
        res.innerHTML = `
          <span class="badge badge-danger">🚨 KRİTİK RİSK: ÖLÜMCÜL ÜÇLÜ TAMAMLANDI!</span>
          <p class="small" style="margin-top:8px;">Ajanınız dolaylı komut enjeksiyonuna karşı tamamen savunmasız. Dış bir belgedeki gizli talimat hassas verilerinizi otomatik olarak dışarı sızdırabilir. <strong>Çözüm:</strong> Okuma adımında dış iletişim aracını kapatın, sandbox kullanın ve insan onay kapısı ekleyin.</p>
        `;
      } else if (trifecta && (hitl || sand)) {
        res.innerHTML = `
          <span class="badge badge-warn">⚠️ ORTA-YÜKSEK RİSK: HAFİFLETİLMİŞ ÜÇLÜ</span>
          <p class="small" style="margin-top:8px;">Üç bacak hâlâ aynı sistemde mevcut ancak koruma katmanı eklemişsiniz. En güvenli mimari için ${!hitl ? '<strong>İnsan Onay Kapısını</strong>' : ''} ${!hitl && !sand ? 've ' : ''}${!sand ? '<strong>İzole Sandbox + Ağ Kısıtını</strong>' : ''} birlikte etkinleştirin ve API anahtarlarını ortam değişkeninden çıkarın.</p>
        `;
      } else {
        res.innerHTML = `
          <span class="badge badge-success">✅ GÜVENLİ MİMARİ: ÖLÜMCÜL ÜÇLÜ KIRILDI</span>
          <p class="small" style="margin-top:8px;">Üç bacaktan en az birini mimari olarak kestiniz. Buna ek olarak OWASP 2026 gereği sert API harcama limiti ve token tüketim hızı alarmı eklemeyi unutmayın.</p>
        `;
      }
    }

    ['sec-priv', 'sec-untrust', 'sec-exfil', 'sec-hitl', 'sec-sand'].forEach((id) => {
      document.getElementById(id).addEventListener('change', evalSec);
    });
    evalSec();
  }

  /* ==================== 90-DAY ROADMAP ==================== */
  function renderRoadmap() {
    const el = document.getElementById('view-roadmap');
    const rm = DATA.roadmaps[state.role] || DATA.roadmaps.dev;
    const allTasks = rm.months.flatMap((m) => m.tasks);
    const doneCount = allTasks.filter((t) => state.roadmapDone.includes(t.id)).length;
    const pct = allTasks.length ? Math.round((doneCount / allTasks.length) * 100) : 0;

    el.innerHTML = `
      <div class="card">
        <h1>🗺️ 90 Günlük Uygulama ve Çıktı (Artifact) Planı</h1>
        <p class="muted small">Her fazın sonunda gerçek işinizde kullanacağınız somut bir çıktı üretin.</p>
        <div class="chip-row">
          <button class="chip ${state.role === 'dev' ? 'active' : ''}" data-rrole="dev">💻 Yazılım &amp; YZ Geliştiricisi</button>
          <button class="chip ${state.role === 'knowledge' ? 'active' : ''}" data-rrole="knowledge">📑 Bilgi Çalışanı</button>
          <button class="chip ${state.role === 'leader' ? 'active' : ''}" data-rrole="leader">🚀 Yönetici &amp; Girişimci</button>
        </div>
        <div style="margin-top:10px;">
          <div style="display:flex;justify-content:space-between;font-size:0.84rem;margin-bottom:5px;">
            <span>${esc(rm.label)} İlerlemesi</span>
            <strong>${doneCount}/${allTasks.length} (%${pct})</strong>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
      </div>

      ${rm.months.map((m) => `
        <div class="card">
          <h3>${esc(m.title)}</h3>
          ${m.tasks.map((t) => {
            const done = state.roadmapDone.includes(t.id);
            return `
              <label class="check-item ${done ? 'done' : ''}">
                <input type="checkbox" data-rmtask="${t.id}" ${done ? 'checked' : ''} />
                <div>
                  <div class="check-title" style="font-weight:600;font-size:0.9rem;">${esc(t.title)}</div>
                  <div class="small" style="color:var(--accent);margin-top:2px;">🎯 ${esc(t.artifact)}</div>
                </div>
              </label>
            `;
          }).join('')}
        </div>
      `).join('')}
    `;

    el.querySelectorAll('[data-rrole]').forEach((b) => {
      b.addEventListener('click', () => {
        state.role = b.dataset.rrole;
        const sel = document.getElementById('role-select');
        if (sel) sel.value = state.role;
        saveState();
        renderRoadmap();
      });
    });

    el.querySelectorAll('[data-rmtask]').forEach((chk) => {
      chk.addEventListener('change', () => {
        const id = chk.dataset.rmtask;
        if (chk.checked) {
          if (!state.roadmapDone.includes(id)) {
            state.roadmapDone.push(id);
            addXP(20, '90 gün çıktısı tamamlandı!');
          }
        } else {
          state.roadmapDone = state.roadmapDone.filter((x) => x !== id);
          saveState();
        }
        renderRoadmap();
      });
    });
  }

  /* ==================== LIBRARY & GLOSSARY ==================== */
  function renderLibrary() {
    const el = document.getElementById('view-library');
    const cats = ['Tümü', ...Array.from(new Set(DATA.resources.map((r) => r.cat)))];

    el.innerHTML = `
      <div class="card">
        <h1>🔎 Küresel &amp; Türkiye Kaynak Kütüphanesi</h1>
        <div class="chip-row">
          <button class="chip ${activeLibTab === 'resources' ? 'active' : ''}" data-libtab="resources">🌐 Kaynaklar (${DATA.resources.length})</button>
          <button class="chip ${activeLibTab === 'glossary' ? 'active' : ''}" data-libtab="glossary">📖 Terimler Sözlüğü (${DATA.glossary.length})</button>
        </div>
        ${activeLibTab === 'resources' ? `
          <input type="search" id="lib-search" placeholder="Repo, akademi, yerli model veya konu ara (ör. MCP, BİLGE, BTK)..." value="${esc(libSearch)}" style="margin-top:8px;" />
          <div class="chip-row">
            ${cats.map((c) => `<button class="chip ${libCat === c ? 'active' : ''}" data-lcat="${esc(c)}">${esc(c)}</button>`).join('')}
          </div>
          <div class="chip-row">
            ${['Tümü', 'TR', 'EN'].map((l) => `<button class="chip ${libLang === l ? 'active' : ''}" data-llang="${l}">${l === 'Tümü' ? 'Tüm Diller' : l}</button>`).join('')}
          </div>
        ` : `
          <input type="search" id="gloss-search" placeholder="Türkçe veya İngilizce terim ara (ör. Context Rot, KV-Cache, SDD)..." value="${esc(glossSearch)}" style="margin-top:8px;" />
        `}
      </div>
      <div id="lib-results"></div>
    `;

    el.querySelectorAll('[data-libtab]').forEach((b) => {
      b.addEventListener('click', () => {
        activeLibTab = b.dataset.libtab;
        renderLibrary();
      });
    });

    if (activeLibTab === 'resources') {
      document.getElementById('lib-search').addEventListener('input', (e) => {
        libSearch = e.target.value;
        renderLibResults();
      });
      el.querySelectorAll('[data-lcat]').forEach((b) => {
        b.addEventListener('click', () => { libCat = b.dataset.lcat; renderLibrary(); });
      });
      el.querySelectorAll('[data-llang]').forEach((b) => {
        b.addEventListener('click', () => { libLang = b.dataset.llang; renderLibrary(); });
      });
      renderLibResults();
    } else {
      document.getElementById('gloss-search').addEventListener('input', (e) => {
        glossSearch = e.target.value;
        renderGlossResults();
      });
      renderGlossResults();
    }
  }

  function renderLibResults() {
    const box = document.getElementById('lib-results');
    const q = libSearch.trim().toLowerCase();
    const list = DATA.resources.filter((r) => {
      if (libCat !== 'Tümü' && r.cat !== libCat) return false;
      if (libLang !== 'Tümü' && !r.lang.includes(libLang)) return false;
      if (q && !(r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.cat.toLowerCase().includes(q))) return false;
      return true;
    });

    if (!list.length) {
      box.innerHTML = `<div class="card"><p class="muted">Eşleşen kaynak bulunamadı.</p></div>`;
      return;
    }

    box.innerHTML = `<div class="grid-2">${list.map((r) => {
      const done = state.resourcesDone.includes(r.id);
      const fav = state.resourcesFav.includes(r.id);
      return `
        <div class="card" style="margin-bottom:0;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
              <span class="badge badge-accent">${esc(r.cat)}</span>
              <span class="badge">${esc(r.lang)} • ${esc(r.meta)}</span>
            </div>
            <h3>${esc(r.name)}</h3>
            <p class="muted small">${esc(r.desc)}</p>
          </div>
          <div class="btn-row" style="justify-content:space-between;align-items:center;">
            <a class="btn btn-primary btn-sm" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Aç ↗</a>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-sm" data-rfav="${r.id}" title="Favori">${fav ? '⭐' : '☆'}</button>
              <button class="btn btn-sm ${done ? 'btn-success' : ''}" data-rdone="${r.id}">${done ? '✓ İncelendi' : 'İşaretle'}</button>
            </div>
          </div>
        </div>
      `;
    }).join('')}</div>`;

    box.querySelectorAll('[data-rfav]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.dataset.rfav;
        if (state.resourcesFav.includes(id)) state.resourcesFav = state.resourcesFav.filter((x) => x !== id);
        else state.resourcesFav.push(id);
        saveState();
        renderLibResults();
      });
    });

    box.querySelectorAll('[data-rdone]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.dataset.rdone;
        if (state.resourcesDone.includes(id)) {
          state.resourcesDone = state.resourcesDone.filter((x) => x !== id);
          saveState();
        } else {
          state.resourcesDone.push(id);
          addXP(10, 'Kaynak incelendi');
        }
        renderLibResults();
      });
    });
  }

  function renderGlossResults() {
    const box = document.getElementById('lib-results');
    const q = glossSearch.trim().toLowerCase();
    const list = DATA.glossary.filter((g) => !q || g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
    box.innerHTML = list.map((g) => `
      <div class="card" style="margin-bottom:10px;padding:14px;">
        <h3 style="color:var(--accent);margin-bottom:4px;">${esc(g.term)}</h3>
        <p class="muted small" style="margin:0;">${esc(g.def)}</p>
      </div>
    `).join('') || `<div class="card"><p class="muted">Eşleşen terim bulunamadı.</p></div>`;
  }

  /* ==================== INIT & EVENTS ==================== */
  function init() {
    applyTheme();
    updateStreak();
    updateHeaderStats();

    document.querySelectorAll('.nav-tab, .bnav-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    document.getElementById('theme-btn').addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      saveState();
    });

    const modal = document.getElementById('settings-modal');
    const roleSelect = document.getElementById('role-select');
    roleSelect.value = state.role;

    document.getElementById('settings-btn').addEventListener('click', () => modal.classList.add('open'));
    document.getElementById('close-settings').addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

    roleSelect.addEventListener('change', () => {
      state.role = roleSelect.value;
      saveState();
      renderCurrentView();
      showToast('Uzmanlık kulvarı güncellendi');
    });

    document.getElementById('export-btn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-ustalik-2026-yedek-' + todayStr() + '.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Yedek dosyası indirildi');
    });

    document.getElementById('import-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          state = Object.assign({}, defaultState, imported);
          saveState();
          applyTheme();
          roleSelect.value = state.role;
          renderCurrentView();
          showToast('Yedek başarıyla geri yüklendi!');
        } catch (err) {
          showToast('Geçersiz JSON yedek dosyası');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
      if (!confirm('Tüm ilerlemeniz, notlarınız ve kart tekrar geçmişiniz silinecek. Emin misiniz?')) return;
      state = Object.assign({}, defaultState, { theme: state.theme, lastActiveDate: todayStr() });
      saveState();
      renderCurrentView();
      modal.classList.remove('open');
      showToast('Tüm ilerleme sıfırlandı');
    });

    // Keyboard shortcut for flashcard flip
    document.addEventListener('keydown', (e) => {
      if (currentView === 'cards' && e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const fcEl = document.getElementById('active-fc');
        if (fcEl) {
          fcFlipped = !fcFlipped;
          fcEl.classList.toggle('flipped', fcFlipped);
        }
      }
    });

    // Service Worker Registration
    const pwaEl = document.getElementById('pwa-status');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => {
          if (pwaEl) pwaEl.textContent = '✅ Çevrimdışı PWA motoru (Service Worker) aktif ve hazır.';
        })
        .catch(() => {
          if (pwaEl) pwaEl.textContent = 'ℹ️ Service Worker yalnızca HTTPS (GitHub Pages) veya localhost üzerinde etkinleşir.';
        });
    } else if (pwaEl) {
      pwaEl.textContent = 'Tarayıcınız Service Worker desteklemiyor.';
    }

    renderHome();
  }

  document.addEventListener('DOMContentLoaded', init);
})();


(function () {
  'use strict';
  var WA = 'https://wa.me/375293531390';
  var MENU = {
    'Жаркое А-ля рататуй': 30, 'Жаркое из курицы с драниками': 30, 'Запечённая говядина с овощами в соусе': 39,
    'Свиные ушки с картофелем по-деревенски': 24, 'Куриные бёдрышки гриль с картофелем фри': 34,
    'Мачанка с блинами фирменная': 31, 'Мачанка с драниками': 31, 'Овощи гриль': 23, 'Поджарка с драниками': 31,
    'Семга с брокколи в сливках': 39, 'Сковородка «Фермерское угощение»': 31, 'Шипящая сковородка со свининой': 37,
    'Язык с картофелем в сметанном соусе': 32, 'Стейк филе-миньон': 51, 'Стейк из свинины в соусе демиглас': 32,
    'Куриная грудка гриль с пряными травами': 25, 'Закуска «Ах, сальцо»': 21, 'Карпаччо из говяжьей вырезки': 35,
    'Соленья по-домашнему': 19, 'Закуска овощная': 20, 'Салат «Гурман»': 23, 'Салат «Цезарь» с курицей': 24,
    'Сельдь в шубе': 20, 'Салат «Греческий»': 20, 'Борщ традиционный с гренками и грудинкой': 18,
    'Бульон куриный с чесночной булочкой': 13.5, 'Сырные шарики с датским соусом': 23, 'Хворост из птицы': 28,
    'Сет «Мини-гриль»': 72, 'Картофельные драники': 20, 'Картофельные дольки': 14, 'Брокколи отварная': 15,
    'Картофель фри с кетчупом': 13, 'Французская булочка с чесночной начинкой': 3.5, 'Хлеб чёрный': 0.7
  };
  var PARTY = {
    date: ['Свидание или ужин вдвоём', 2,
      ['Закуска «Ах, сальцо»', 'Салат «Гурман»', 'Стейк филе-миньон', 'Семга с брокколи в сливках'],
      'Два блюда на горячее, закуска и салат: хватает, чтобы посидеть не спеша.'],
    friends: ['Пятница с друзьями', 4,
      ['Сет «Мини-гриль»', 'Соленья по-домашнему', 'Картофельные драники', 'Сырные шарики с датским соусом'],
      'Сет на компанию плюс закуски, которые удобно делить на всех.'],
    birthday: ['День рождения', 6,
      ['Сет «Мини-гриль»', 'Мачанка с блинами фирменная', 'Салат «Цезарь» с курицей', 'Сырные шарики с датским соусом', 'Картофельные дольки'],
      'Горячее на всех, салат и горячие закуски: стол заполнен, никто не ждёт.'],
    lunch: ['Бизнес-ланч', 1,
      ['Борщ традиционный с гренками и грудинкой', 'Куриные бёдрышки гриль с картофелем фри'],
      'Суп и горячее: быстрый обед, если пришли в перерыве.'],
    beer: ['Пиво и закуски', 2,
      ['Соленья по-домашнему', 'Сырные шарики с датским соусом', 'Хворост из птицы'],
      'Крафтовое пиво по 2 рубля за бокал и закуски под него.'],
    late: ['Караоке до ночи', 4,
      ['Сет «Мини-гриль»', 'Картофель фри с кетчупом', 'Сырные шарики с датским соусом'],
      'Плотная закуска на вечер, чтобы хватило голоса до конца.']
  };

  function initDrawer() {
    var d = document.getElementById('drawer');
    var b = document.querySelector('.header .burger');
    if (!d || !b) return;
    var last = null;
    function open() {
      last = document.activeElement;
      d.hidden = false; d.setAttribute('data-open', '');
      b.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var f = d.querySelector('a, button'); if (f) f.focus({ preventScroll: true });
    }
    function close() {
      d.hidden = true; d.removeAttribute('data-open');
      b.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (last) last.focus({ preventScroll: true });
    }
    b.addEventListener('click', function () { d.hidden ? open() : close(); });
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]') || e.target.closest('a') || !e.target.closest('.drawer__in')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !d.hidden) close();
      if (e.key === 'Tab' && !d.hidden) {
        var it = d.querySelectorAll('a, button, input');
        if (!it.length) return;
        var f = it[0], l = it[it.length - 1];
        if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
        else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1024 && !d.hidden) close(); });
  }

  function initMenuFilter() {
    var f = document.getElementById('mf');
    var q = document.getElementById('mq');
    if (!f || !q) return;
    var groups = [].slice.call(document.querySelectorAll('.mgroup'));
    var rows = [].slice.call(document.querySelectorAll('.mrow'));
    var cnt = document.getElementById('mcnt');
    var cat = 'all';
    function draw() {
      var v = q.value.trim().toLowerCase(), shown = 0;
      rows.forEach(function (r) {
        var g = r.closest('.mgroup');
        var inCat = cat === 'all' || g.getAttribute('data-cat') === cat;
        var ok = inCat && (!v || r.textContent.toLowerCase().indexOf(v) > -1);
        r.hidden = !ok;
        if (ok) shown++;
      });
      groups.forEach(function (g) {
        var visible = [].slice.call(g.querySelectorAll('.mrow')).filter(function (r) { return !r.hidden; }).length;
        g.hidden = visible === 0;
      });
      cnt.textContent = shown ? 'позиций: ' + shown : 'ничего не нашлось';
    }
    f.addEventListener('click', function (e) {
      var b = e.target.closest('.mchip'); if (!b) return;
      cat = b.getAttribute('data-c');
      [].forEach.call(f.children, function (c) { c.classList.toggle('is-on', c === b); });
      draw();
    });
    q.addEventListener('input', draw);
    draw();
  }

  function initParty() {
    var occ = document.getElementById('occ');
    if (!occ) return;
    var gbox = document.getElementById('guests');
    var out = {
      k: document.getElementById('pk'), t: document.getElementById('pt'), d: document.getElementById('pd'),
      l: document.getElementById('pl'), sum: document.getElementById('psum'), ppp: document.getElementById('ppp'),
      send: document.getElementById('psend')
    };
    var st = { k: 'date', n: 2, base: 2 };
    function fmt(v) { v = Math.round(v * 10) / 10; return v === Math.round(v) ? String(Math.round(v)) : String(v).replace('.', ','); }
    function draw() {
      var p = PARTY[st.k];
      var scale = st.n / st.base;
      out.k.textContent = 'СЦЕНАРИЙ · ' + p[0].toUpperCase();
      out.t.textContent = p[0];
      out.d.textContent = p[3];
      var total = 0, lines = [];
      p[2].forEach(function (name) {
        var qty = Math.max(1, Math.round(scale));
        var price = MENU[name] || 0;
        total += price * qty;
        lines.push('<li><span>' + (qty > 1 ? qty + ' × ' : '') + name + '</span><i>' + fmt(price * qty) + ' Br</i></li>');
      });
      out.l.innerHTML = lines.join('');
      out.sum.textContent = fmt(total);
      out.ppp.textContent = fmt(total / st.n);
      var msg = 'Бронь стола в «У Холостяка» (Независимости, 76).\nСценарий: ' + p[0] + '\nГостей: ' + st.n +
        '\nНабор: ' + p[2].join(', ') + '\nОриентир по меню: ' + fmt(total) + ' руб. на всех\n\nДата и время: ';
      out.send.href = WA + '?text=' + encodeURIComponent(msg);
      [].forEach.call(occ.children, function (b) { b.classList.toggle('is-on', b.getAttribute('data-k') === st.k); });
    }
    occ.addEventListener('click', function (e) {
      var b = e.target.closest('.obtn'); if (!b) return;
      st.k = b.getAttribute('data-k');
      st.base = PARTY[st.k][1];
      if (![1, 2, 4, 6, 8].some(function (x) { return x === st.n; })) st.n = st.base;
      draw();
    });
    gbox.addEventListener('click', function (e) {
      var b = e.target.closest('.gbtn'); if (!b) return;
      st.n = +b.getAttribute('data-n');
      [].forEach.call(gbox.children, function (c) { c.classList.toggle('is-on', c === b); });
      draw();
    });
    draw();
  }

  function initLead() {
    var f = document.getElementById('lead');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('lName'), t = document.getElementById('lTel');
      var g = document.getElementById('lGuests'), d = document.getElementById('lDate'), k = document.getElementById('lTask');
      var bad = false;
      [n, t].forEach(function (el) {
        if (!el.value.trim()) { el.style.borderColor = '#E4C77E'; bad = true; } else { el.style.borderColor = ''; }
      });
      if (bad) return;
      var msg = 'Заявка с сайта «У Холостяка».\nИмя: ' + n.value.trim() + '\nТелефон: ' + t.value.trim() +
        (g && g.value.trim() ? '\nГостей: ' + g.value.trim() : '') +
        (d && d.value.trim() ? '\nКогда: ' + d.value.trim() : '') +
        (k && k.value.trim() ? '\nПожелания: ' + k.value.trim() : '');
      window.open(WA + '?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDrawer(); initMenuFilter(); initParty(); initLead();
    var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
  });
})();

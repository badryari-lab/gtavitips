{
  "slug": "brian-heder",
  "css": "\r\n    :root{--blue:#e0785f;--blue-dim:rgba(224,120,95,0.14);--blue-border:rgba(224,120,95,0.30);--pink:#4a9e93;--pink-dim:rgba(74,158,147,0.10);--paper:#ece4d3;--paper-ink:#2a2420;--green:#3ea35f;--green-dim:rgba(62,163,95,0.12);--green-border:rgba(62,163,95,0.30);--amber:#d19a3d;--amber-dim:rgba(209,154,61,0.12);--amber-border:rgba(209,154,61,0.30);--red:#c0503f;--red-dim:rgba(192,80,63,0.12);--red-border:rgba(192,80,63,0.30);--bg:#0b0a08;--bg-2:#131110;--bg-3:#1c1815;--bg-4:#262019;--border:rgba(255,255,255,0.055);--border-b:rgba(224,120,95,0.22);--t1:#f2ede4;--t2:#a89a86;--t3:#6b5f4f;--r:12px;--nav-h:62px}\r\n    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\r\n    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }\r\n    body { font-family: 'Archivo', sans-serif; background: var(--bg); color: var(--t1); overflow-x: hidden; font-size: 16px; line-height: 1.6; }\r\n    a { color: inherit; text-decoration: none; }\r\n    img { display: block; max-width: 100%; }\r\n    ::selection { background: var(--blue); color: var(--paper-ink); }\r\n    ::-webkit-scrollbar { width: 5px; }\r\n    ::-webkit-scrollbar-track { background: var(--bg); }\r\n    ::-webkit-scrollbar-thumb { background: var(--bg-4); border-radius: 99px; }\r\n    .wrap { max-width: 1120px; margin: 0 auto; padding: 0 28px; }\r\n    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }\r\n\r\n    /* NAV */\r\n    .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: var(--nav-h); display: flex; align-items: center; background: rgba(11,10,8,.95); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border-b); }\r\n    .nav__inner { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }\r\n    .nav__logo { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--t1); flex-shrink: 0; }\r\n    .nav__logo-badge { width: 30px; height: 30px; background: var(--pink); color: var(--paper); clip-path: polygon(0 0, 78% 0, 100% 24%, 100% 100%, 0 100%); transform: rotate(-3deg); display: flex; align-items: center; justify-content: center; font-family: 'Anton', sans-serif; font-size: 13px; font-weight: 400; letter-spacing: 0; }\r\n    .nav__links { display: flex; align-items: center; gap: 2px; list-style: none; }\r\n    .nav__links a { padding: 5px 13px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t2); border-radius: 99px; transition: color .18s, background .18s; }\r\n    .nav__links a:hover { color: var(--t1); background: rgba(255,255,255,.05); }\r\n    .nav__links a.active { color: var(--blue); }\r\n    .nav__right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }\r\n    .nav__search-btn { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--t2); transition: color .18s, background .18s; }\r\n    .nav__search-btn:hover { color: var(--t1); background: rgba(255,255,255,.09); }\r\n    .nav__search-btn svg { width: 15px; height: 15px; }\r\n    .nav__db-btn { padding: 7px 18px; background: var(--blue); color: var(--paper-ink); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; border-radius: 8px; transition: opacity .18s, transform .15s; }\r\n    .nav__db-btn:hover { opacity: .85; transform: translateY(-1px); }\r\n    .nav__burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }\r\n    .nav__burger span { display: block; width: 20px; height: 1.5px; background: var(--t2); border-radius: 99px; }\r\n    .nav__mobile { display: none; position: fixed; top: var(--nav-h); left: 0; right: 0; background: rgba(11,10,8,.98); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border-b); padding: 16px 28px 24px; flex-direction: column; gap: 2px; z-index: 199; }\r\n    .nav__mobile.open { display: flex; }\r\n    .nav__mobile a { padding: 11px 14px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t2); border-radius: 9px; transition: .18s; }\r\n    .nav__mobile a:hover { color: var(--t1); background: rgba(255,255,255,.05); }\r\n    .nav__theme-btn { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--t2); transition: color .18s, background .18s; position: relative; flex-shrink: 0; }\r\n    .nav__theme-btn:hover { color: var(--t1); background: rgba(255,255,255,.09); }\r\n    .nav__theme-btn svg { width: 15px; height: 15px; position: absolute; transition: opacity .2s; }\r\n    .nav__theme-btn .icon-moon { opacity: 1; }\r\n    .nav__theme-btn .icon-sun { opacity: 0; }\r\n    [data-theme=\"light\"] .nav__theme-btn .icon-moon { opacity: 0; }\r\n    [data-theme=\"light\"] .nav__theme-btn .icon-sun { opacity: 1; }\r\n\r\n    /* NAV DROPDOWN */\r\n    .nav__dropdown-wrap { position: relative; display: flex; align-items: center; gap: 2px; }\r\n    .nav__dropdown-link { font-family: 'Archivo', sans-serif; font-size: 13px; font-weight: 600; color: var(--t2); text-transform: uppercase; letter-spacing: .07em; text-decoration: none; padding: 5px 0 5px 13px; transition: color .18s; }\r\n    .nav__dropdown-btn { background: none; border: none; cursor: pointer; color: var(--t2); padding: 5px 13px 5px 0; display: flex; align-items: center; transition: color .18s; }\r\n    .nav__dropdown-wrap:hover .nav__dropdown-link, .nav__dropdown-wrap:hover .nav__dropdown-btn { color: var(--t1); }\r\n    .nav__dropdown-chevron { width: 12px; height: 12px; transition: transform .2s; flex-shrink: 0; }\r\n    .nav__dropdown-wrap.open .nav__dropdown-chevron { transform: rotate(180deg); }\r\n    .nav__dropdown { position: absolute; top: 100%; left: 13px; background: var(--bg-2); border: 1px solid var(--border-b); border-radius: 12px; padding: 6px; min-width: 200px; box-shadow: 0 12px 32px rgba(0,0,0,.28); opacity: 0; pointer-events: none; transition: opacity .18s, transform .18s; transform: translateY(-6px); list-style: none; margin: 0; z-index: 200; }\r\n    .nav__dropdown li { list-style: none; padding: 0; margin: 0; }\r\n    .nav__dropdown-wrap.open .nav__dropdown { opacity: 1; pointer-events: all; transform: translateY(0); }\r\n    .nav__dropdown li a { display: block; padding: 9px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t2); text-decoration: none; border-radius: 8px; transition: background .15s, color .15s; white-space: nowrap; }\r\n    .nav__dropdown li a:hover { background: var(--bg-3); color: var(--blue); }\r\n    @media(max-width: 860px) {\r\n      .nav__dropdown-wrap { width: 100%; display: flex; align-items: center; justify-content: space-between; }\r\n      .nav__dropdown-link { padding: 11px 14px; font-size: 13px; flex: 1; }\r\n      .nav__dropdown-btn { padding: 11px 14px; background: none; border-radius: 9px; }\r\n      .nav__dropdown-btn:hover { background: rgba(255,255,255,.05); color: var(--t1); }\r\n      .nav__dropdown { position: static; transform: none; opacity: 1; pointer-events: all; box-shadow: none; border: none; border-radius: 0; background: none; padding: 0 0 0 14px; display: none; }\r\n      .nav__dropdown-wrap.open .nav__dropdown { display: block; transform: none; }\r\n      .nav__dropdown li a { color: var(--t3); font-size: 12px; }\r\n    }\r\n\r\n    /* SEARCH OVERLAY */\r\n    .search-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(11,10,8,.92); backdrop-filter: blur(24px); display: flex; align-items: flex-start; justify-content: center; padding-top: 120px; opacity: 0; pointer-events: none; transition: opacity .22s; }\r\n    .search-overlay.open { opacity: 1; pointer-events: all; }\r\n    .search-overlay__inner { width: 100%; max-width: 640px; padding: 0 28px; }\r\n    .search-overlay__label { font-family: 'Courier Prime', monospace; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; color: var(--pink); margin-bottom: 14px; }\r\n    .search-overlay__field { display: flex; align-items: center; background: var(--bg-3); border: 1px solid var(--blue-border); border-radius: 12px; overflow: hidden; }\r\n    .search-overlay__field svg { width: 18px; height: 18px; color: var(--t3); margin-left: 18px; flex-shrink: 0; }\r\n    .search-overlay__input { flex: 1; padding: 16px 18px; background: none; border: none; outline: none; font-family: 'Archivo', sans-serif; font-size: 16px; font-weight: 500; color: var(--t1); }\r\n    .search-overlay__input::placeholder { color: var(--t3); }\r\n    .search-overlay__close { padding: 10px 16px; background: none; border: none; font-size: 12px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--t3); cursor: pointer; transition: color .18s; }\r\n    .search-overlay__close:hover { color: var(--t1); }\r\n    .search-overlay__hint { margin-top: 12px; font-size: 12px; color: var(--t3); }\r\n    .search-overlay__hint kbd { background: var(--bg-4); border: 1px solid var(--border); border-radius: 5px; padding: 2px 7px; font-family: inherit; font-size: 11px; color: var(--t2); }\r\n    .search-overlay__results{margin-top:14px;display:flex;flex-direction:column;gap:3px;max-height:300px;overflow-y:auto;}\r\n    .search-result{display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;text-decoration:none;transition:border-color .15s,background .15s;}\r\n    .search-result.active,.search-result:hover{border-color:var(--blue-border);background:var(--bg-4);}\r\n    .search-result__cat{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--blue);background:var(--blue-dim);padding:2px 7px;border-radius:99px;flex-shrink:0;white-space:nowrap;}\r\n    .search-result__body{flex:1;min-width:0;}\r\n    .search-result__name{font-size:13px;font-weight:600;color:var(--t1);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\r\n    .search-overlay__nores{font-size:12px;color:var(--t3);padding:20px 0;text-align:center;}\r\n\r\n    /* PAGE LAYOUT */\r\n    .page { padding-top: 40px; }\r\n    .page__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t3); padding: 28px 0 0; transition: color .18s; }\r\n    .page__back:hover { color: var(--blue); }\r\n    .page__back svg { width: 14px; height: 14px; }\r\n\r\n    /* FILE TAG: small rotated stamp, replaces the old \"dossier badge\" pill */\r\n    .file-tag { display: inline-flex; align-items: center; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--pink); background: var(--pink-dim); border: 1.3px solid var(--pink); border-radius: 8px 2px 8px 2px; transform: rotate(-1.2deg); padding: 5px 14px; margin: 28px 0 18px; }\r\n\r\n    /* DOSSIER: file header, text left, two photos as attached artifacts right */\r\n    .dossier { margin: 0 0 56px; display: grid; grid-template-columns: 1fr 340px; gap: 48px; align-items: start; }\r\n    .dossier__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(38px, 6vw, 66px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .92; margin-bottom: 10px; }\r\n    .dossier__h1 span { color: var(--blue); }\r\n    .dossier__role { font-family: 'Courier Prime', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin-bottom: 20px; }\r\n    .dossier__tagline { font-size: 15px; color: var(--t2); line-height: 1.6; max-width: 480px; margin-bottom: 28px; }\r\n    .dossier__tagline strong { color: var(--t1); font-weight: 600; }\r\n\r\n    /* STAT BLOCK */\r\n    .stat-block { display: flex; flex-direction: column; gap: 0; background: var(--bg-2); border: 1px solid var(--border-b); border-radius: var(--r) 4px var(--r) 4px; overflow: hidden; }\r\n    .stat-block__item { padding: 16px 20px; border-bottom: 1px solid var(--border); }\r\n    .stat-block__item:last-child { border-bottom: none; }\r\n    .stat-block__key { font-family: 'Courier Prime', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .11em; color: var(--pink); margin-bottom: 5px; }\r\n    .stat-block__val { font-size: 14px; font-weight: 600; color: var(--t1); line-height: 1.4; }\r\n    .stat-block__sub { font-size: 12px; color: var(--t2); margin-top: 3px; line-height: 1.5; }\r\n\r\n    /* PHOTO STACK: the two images as pinned case-board artifacts */\r\n    .photo-stack { position: relative; padding-bottom: 64px; }\r\n    .photo-stack__sighting { position: relative; margin: 0; transform: rotate(1.2deg); }\r\n    .photo-stack__onfile { position: absolute; left: -16px; bottom: 0; width: 44%; margin: 0; transform: rotate(-4deg); z-index: 2; }\r\n    .photo-frame { position: relative; width: 100%; overflow: hidden; }\r\n    .photo-stack__sighting .photo-frame { padding-top: 75%; border-radius: 4px var(--r) 4px var(--r); border: 1px solid var(--border-b); box-shadow: 0 16px 30px rgba(0,0,0,.35); }\r\n    .photo-stack__onfile .photo-frame { padding-top: 133.33%; border-radius: var(--r) 4px var(--r) 4px; border: 1px solid var(--border-b); box-shadow: 0 12px 24px rgba(0,0,0,.4); }\r\n    .photo-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }\r\n    .photo-stack__sighting .photo-frame img { object-position: 62% 22%; }\r\n    .photo-stack__onfile .photo-frame img { object-position: 20% 22%; }\r\n    .photo-tag { position: absolute; font-family: 'Courier Prime', monospace; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; padding: 4px 10px; border-radius: 6px 2px 6px 2px; white-space: nowrap; background: var(--bg-2); }\r\n    .photo-tag--sighting { top: -10px; left: 16px; color: var(--pink); border: 1px solid var(--pink); transform: rotate(-2deg); }\r\n    .photo-tag--onfile { bottom: -9px; right: -8px; color: var(--blue); border: 1px solid var(--blue-border); transform: rotate(3deg); }\r\n    @media (max-width: 1024px) {\r\n      .photo-stack { max-width: 340px; }\r\n    }\r\n\r\n    /* MAIN CONTENT */\r\n    main { padding-bottom: 96px; }\r\n    .content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 48px; align-items: start; }\r\n    .content-main {}\r\n    .content-side { position: sticky; top: calc(var(--nav-h) + 24px); display: flex; flex-direction: column; gap: 14px; }\r\n\r\n    /* SECTION */\r\n    .section { margin-bottom: 56px; }\r\n    .section__eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }\r\n    .section__eyebrow-line { width: 5px; height: 5px; border-radius: 50%; background: var(--pink); flex-shrink: 0; }\r\n    .section__eyebrow-text { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; color: var(--pink); }\r\n    .section__h2 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(20px, 2.5vw, 28px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); margin-bottom: 20px; line-height: 1.1; }\r\n    .section__body { font-size: 14px; color: var(--t2); line-height: 1.85; }\r\n    .section__body p { margin-bottom: 16px; }\r\n    .section__body p:last-child { margin-bottom: 0; }\r\n    .section__body strong { color: var(--t1); font-weight: 600; }\r\n\r\n    /* INTEL LOG: stamped tickets, not a data table */\r\n\r\n    /* CONNECTION CARDS */\r\n    .connections { display: flex; flex-direction: column; gap: 8px; }\r\n    .conn-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r); padding: 16px 18px; display: flex; align-items: center; gap: 16px; text-decoration: none; transition: border-color .2s, transform .2s, background .2s; }\r\n    .conn-card:hover { border-color: var(--border-b); transform: translateX(4px); background: var(--bg-3); }\r\n    .conn-card__avatar { width: 40px; height: 40px; border-radius: 8px; background: var(--bg-3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; color: var(--blue); text-transform: uppercase; flex-shrink: 0; }\r\n    .conn-card__body { flex: 1; min-width: 0; }\r\n    .conn-card__role { font-family: 'Courier Prime', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .10em; color: var(--pink); margin-bottom: 3px; }\r\n    .conn-card__name { font-size: 14px; font-weight: 700; color: var(--t1); line-height: 1.2; }\r\n    .conn-card__desc { font-size: 12px; color: var(--t3); margin-top: 2px; }\r\n    .conn-card__arrow { font-size: 16px; color: var(--t3); transition: color .2s, transform .2s; flex-shrink: 0; }\r\n    .conn-card:hover .conn-card__arrow { color: var(--blue); transform: translateX(3px); }\r\n\r\n    /* SIDE CALLOUT */\r\n    .callout { background: var(--bg-2); border: 1px solid var(--border-b); border-radius: var(--r) 4px var(--r) 4px; padding: 20px; }\r\n    .callout__title { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); margin-bottom: 14px; }\r\n    .callout__items { display: flex; flex-direction: column; gap: 8px; }\r\n    .callout__item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--t2); text-decoration: none; padding: 8px 10px; border-radius: 8px; transition: background .18s, color .18s; }\r\n    .callout__item:hover { background: rgba(255,255,255,.04); color: var(--t1); }\r\n    .callout__item-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }\r\n\r\n    /* FOOTER */\r\n    .footer { border-top: 1px solid var(--border); padding: 52px 0 28px; }\r\n    .footer__inner { display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 44px; }\r\n    .footer__brand { display: flex; flex-direction: column; gap: 12px; }\r\n    .footer__brand-logo { display: flex; align-items: center; gap: 9px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--t1); }\r\n    .footer__brand-badge { width: 28px; height: 28px; background: var(--pink); color: var(--paper); clip-path: polygon(0 0, 78% 0, 100% 24%, 100% 100%, 0 100%); transform: rotate(-3deg); display: flex; align-items: center; justify-content: center; font-family: 'Anton', sans-serif; font-size: 12px; font-weight: 400; }\r\n    .footer__brand-desc { font-size: 13px; color: var(--t3); line-height: 1.7; }\r\n    .footer__col-head { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t2); margin-bottom: 14px; }\r\n    .footer__links { list-style: none; display: flex; flex-direction: column; gap: 8px; }\r\n    .footer__links a { font-size: 13px; color: var(--t3); transition: color .18s; }\r\n    .footer__links a:hover { color: var(--t2); }\r\n    .footer__bottom { border-top: 1px solid var(--border); padding-top: 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }\r\n    .footer__legal { font-size: 12px; color: var(--t3); line-height: 1.6; }\r\n\r\n    /* REVEAL */\r\n    .reveal { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }\r\n    .reveal.on { opacity: 1; transform: none; }\r\n    @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }\r\n    .reveal.d1 { transition-delay: .07s; }\r\n    .reveal.d2 { transition-delay: .14s; }\r\n\r\n    .faq-list{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--r);overflow:hidden}\r\n    .faq-item{border-bottom:1px solid var(--border)}\r\n    .faq-item:last-child{border-bottom:none}\r\n    .faq-item__q{list-style:none;cursor:pointer;padding:18px 22px;font-size:14px;font-weight:700;color:var(--t1);line-height:1.4;display:flex;align-items:center;justify-content:space-between;gap:14px}\r\n    .faq-item__q::-webkit-details-marker{display:none}\r\n    .faq-item__chevron{width:15px;height:15px;flex-shrink:0;color:var(--t3);transition:transform .2s}\r\n    .faq-item[open] .faq-item__chevron{transform:rotate(180deg)}\r\n    .faq-item__a{padding:0 22px 18px;font-size:13px;color:var(--t2);line-height:1.75}\r\n    a[style*=\"color:var(--blue)\"]{color:inherit!important;text-decoration:underline;text-decoration-color:var(--blue-border);text-underline-offset:2px;text-decoration-thickness:1px}\r\n\r\n    /* RESPONSIVE */\r\n    @media (max-width: 1024px) {\r\n      .dossier { grid-template-columns: 1fr; }\r\n      .content-grid { grid-template-columns: 1fr; }\r\n      .content-side { position: static; flex-direction: row; flex-wrap: wrap; }\r\n      .content-side > * { flex: 1 1 260px; }\r\n      .footer__inner { grid-template-columns: 1fr 1fr; }\r\n    }\r\n    @media (max-width: 768px) {\r\n      .nav__links, .nav__db-btn { display: none; }\r\n      .nav__burger { display: flex; }\r\n      .footer__inner { grid-template-columns: 1fr; gap: 28px; }\r\n    }\r\n\r\n    [data-theme=\"light\"] { --bg:#ece4d3; --bg-2:#f6f1e6; --bg-3:#e3d8c2; --bg-4:#d6c9ac; --border:rgba(42,36,32,.10); --border-b:rgba(168,68,44,.28); --t1:#211c17; --t2:#5a4f40; --t3:#8c7f68; --blue:#a8442c; --blue-dim:rgba(168,68,44,.12); --blue-border:rgba(168,68,44,.30); --pink:#2c6b61; --pink-dim:rgba(44,107,97,.10); --paper-ink:#211c17; --green:#2e7d4f; --green-dim:rgba(46,125,79,.10); --green-border:rgba(46,125,79,.30); --amber:#a3730f; --amber-dim:rgba(163,115,15,.10); --amber-border:rgba(163,115,15,.30); --red:#a3402f; --red-dim:rgba(163,64,47,.10); --red-border:rgba(163,64,47,.30); }\r\n    [data-theme=\"light\"] .nav__db-btn { color: var(--paper); }\r\n    [data-theme=\"light\"] .nav { background: rgba(236,228,211,.95); }\r\n    [data-theme=\"dark\"] { --bg:#0b0a08; --bg-2:#131110; --bg-3:#1c1815; --bg-4:#262019; --border:rgba(255,255,255,0.055); --border-b:rgba(224,120,95,0.24); --t1:#f2ede4; --t2:#a89a86; --t3:#6b5f4f; --blue:#e0785f; --blue-dim:rgba(224,120,95,.14); --blue-border:rgba(224,120,95,.30); --pink:#4a9e93; --pink-dim:rgba(74,158,147,.14); --paper-ink:#2a2420; --green:#3ea35f; --green-dim:rgba(62,163,95,.12); --green-border:rgba(62,163,95,.30); --amber:#d19a3d; --amber-dim:rgba(209,154,61,.12); --amber-border:rgba(209,154,61,.30); --red:#c0503f; --red-dim:rgba(192,80,63,.12); --red-border:rgba(192,80,63,.30); }\r\n    [data-theme=\"dark\"] .nav { background: rgba(11,10,8,.95); }\r\n  \r\n    /* CHAR HERO — full-bleed banner, every page gets one, photo or not */\r\n    .char-hero { position: relative; min-height: 400px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }\r\n    .char-hero__bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; z-index: 0; }\r\n    .char-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }\r\n    .char-hero__bg-graphic svg { position: absolute; right: -8%; top: 50%; transform: translateY(-50%); width: 58%; max-width: 620px; opacity: .07; color: var(--pink); }\r\n    .char-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%); z-index: 1; }\r\n    [data-theme=\"light\"] .char-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.6) 55%, rgba(236,228,211,0) 100%); }\r\n    .char-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }\r\n    .char-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }\r\n    .char-hero__back:hover { color: var(--blue); }\r\n    .char-hero__back svg { width: 14px; height: 14px; }\r\n    .char-hero__eyebrow { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--pink); margin-bottom: 14px; }\r\n    .char-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(38px, 6vw, 68px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .92; margin-bottom: 14px; }\r\n    .char-hero__sub { font-size: 15px; color: var(--t2); max-width: 560px; line-height: 1.65; }\r\n    .char-hero__sub strong { color: var(--t1); font-weight: 600; }\r\n    .dossier--stat-only { display: block; }\r\n    .dossier--stat-only .stat-block { max-width: 640px; }\r\n    .entry-gallery { display: flex; flex-direction: column; gap: 12px; }\r\n    .entry-gallery__item { position: relative; width: 100%; padding-top: 75%; border-radius: var(--r) 4px var(--r) 4px; overflow: hidden; border: 1px solid var(--border-b); }\r\n    .entry-gallery__item img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }\r\n  ",
  "titleParts": [
    "Brian",
    "Heder"
  ],
  "seo": {
    "title": "Brian Heder | GTA 6 Character Profile | GTAVITIPS",
    "description": "Brian Heder in GTA 6: the old-school Keys drug runner Jason works for, his boat yard and his wife Lori, and his story arc behind a click.",
    "ogDescription": "Brian Heder in GTA 6: the old-school Keys drug runner Jason works for, his boat yard and his wife Lori, and his story arc behind a click.",
    "ogImage": "https://gtavitips.com/assets/images/brian-heder-gta-6-character-02.jpg",
    "jsonLdName": "Brian Heder",
    "jsonLdDescription": "Brian Heder in GTA 6: the old-school Keys drug runner Jason works for, his boat yard and his wife Lori, and his story arc behind a click.",
    "dateModified": "2026-11-20"
  },
  "heroSubtitle": "Beach bum on the outside. Great white underneath. **He has run product through the Keys for decades, and he still has someone else do the heavy lifting.**",
  "heroImage": {
    "src": "/assets/images/brian-heder-gta-6-character-02.jpg",
    "alt": "Brian Heder in GTA 6",
    "width": "1920",
    "height": "1080"
  },
  "statBlock": [
    {
      "key": "Trade",
      "value": "Drug Runner",
      "sub": "Old school, from the golden age of smuggling in the Keys. These days he lets others do the dirty work."
    },
    {
      "key": "Base",
      "value": "Boat yard, [Leonida Keys](/gameplay/locations/leonida-keys)",
      "sub": "Product still moves through it. So do rent money, favors and anything Jason brings back."
    },
    {
      "key": "Married To",
      "value": "[Lori Heder](/gameplay/characters/lori-heder)",
      "sub": "His third wife, and in the business with him."
    },
    {
      "key": "Works With",
      "value": "[Jason Duval](/gameplay/characters/jason-duval), [Cal Hampton](/gameplay/characters/cal-hampton)",
      "sub": "Jason lives rent-free in one of his places and pays for it in work. Cal comes along on the jobs."
    },
    {
      "key": "Voice",
      "value": "Stephen Root",
      "sub": "Named in Rockstar's launch-day credits."
    }
  ],
  "statSource": "GTA VI, in-game; Rockstar",
  "gallery": [
    {
      "src": "/assets/images/brian-heder-gta-6-character-01.jpg",
      "alt": "Brian Heder in the Leonida Keys, GTA 6",
      "width": "1920",
      "height": "1080"
    }
  ],
  "connections": [
    {
      "url": "/gameplay/characters/jason-duval",
      "name": "Jason Duval",
      "desc": "Runs jobs for him out of the boat yard and lives under a roof Brian owns. Pays in rent and favors as much as in cash.",
      "avatarImage": {
        "src": "/assets/images/jason-duval-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/lori-heder",
      "name": "Lori Heder",
      "desc": "His wife, and she is his third. The boat yard is his business, and she is in it with him.",
      "avatarImage": {
        "src": "/assets/images/lori-gta-6-character-01.webp"
      }
    },
    {
      "url": "/gameplay/characters/cal-hampton",
      "name": "Cal Hampton",
      "desc": "Jason's best friend and another of Brian's regulars. Rides along when a job needs two.",
      "avatarImage": {
        "src": "/assets/images/cal-hampton-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/locations/leonida-keys",
      "name": "Leonida Keys",
      "desc": "His waters. The boat yard, the tenants, the routes he has run for decades.",
      "avatarInitials": "LK"
    },
    {
      "url": "/gameplay/characters/donnie",
      "name": "Donnie",
      "desc": "His seaplane pilot. Donnie drops the packages over the water and skims a little on the side.",
      "avatarInitials": "D"
    },
    {
      "url": "/gameplay/characters/kenton-rees",
      "name": "Kenton Rees",
      "desc": "An old friend from the running days, now diving for treasure off Key Lento.",
      "avatarInitials": "KR"
    },
    {
      "url": "/gameplay/characters/doug",
      "name": "Doug",
      "desc": "The Kingfishers man Brian drives out to see when he wants the feud settled.",
      "avatarInitials": "D"
    }
  ],
  "storyArc": {
    "intro": "Brian runs Jason's life in the Keys at the start of the story, then drops out of it, then turns up again in [Vice City](/gameplay/locations/vice-city). Every reveal below stays shut until you open it.",
    "beats": [
      {
        "chapter": 1,
        "md": "Brian hands out most of the work: rent from his tenants, runs with Donnie's seaplane, and a long-time broker, Arnold, to track down when he stops answering. Trouble with the Kingfishers keeps growing, and Brian takes [Jason](/gameplay/characters/jason-duval) and [Lori](/gameplay/characters/lori-heder) out to their camp to settle it.\n\n**The sit-down is a setup.** Donnie is already dead, Lori is taken, and Brian and Jason chase her across the [Grassrivers](/gameplay/locations/grassrivers) until she is safe. Brian says he is done: no more drug running, time to retire. Before he goes straight he has one more job for Jason, making Donnie's trailer look like he skipped town."
      },
      {
        "chapter": 3,
        "md": "Brian and Lori come up to [Vice City](/gameplay/locations/vice-city) and take Jason and [Lucia](/gameplay/characters/lucia-caminos) to dinner on a rooftop. Lori is glad to see them alive. Before the night is over, Brian gives them a name: [Raul Bautista](/gameplay/characters/raul-bautista), a bank robber he did time with.\n\nRaul does not forget favors. He calls one in on Brian, and Brian, supposedly retired, brings in an old pilot to fly in a shipment Raul needs for his bank job. The drop turns into a run from the cops and the IAA."
      }
    ],
    "source": "GTA VI, in-game"
  },
  "faq": [
    {
      "q": "Who is Brian Heder in GTA 6?",
      "a": "An old-school drug runner from the golden age of smuggling in the [Leonida Keys](/gameplay/locations/leonida-keys). He still moves product through his boat yard with his third wife, [Lori](/gameplay/characters/lori-heder), and he has people like [Jason](/gameplay/characters/jason-duval) and [Cal](/gameplay/characters/cal-hampton) for the legwork."
    },
    {
      "q": "Who voices Brian Heder?",
      "a": "Stephen Root, in Rockstar's launch-day credits. The rest of the cast is in [the voice actors FAQ](/faq/gta-6-voice-actors)."
    },
    {
      "q": "What does Jason do for Brian?",
      "a": "Whatever needs doing. He collects rent from Brian's tenants, runs smuggling jobs and helps with the local shakedowns. In return he lives rent-free in one of Brian's places and stops by for [Lori](/gameplay/characters/lori-heder)'s sangria."
    },
    {
      "q": "Which missions is Brian in?",
      "a": "Most of Jason's work in Chapter 1 comes from him, Swamped among it, and he is back for Meet the Heders and Company Property in Chapter 3. What happens sits behind the reveals in the Story Arc above."
    },
    {
      "q": "Does Brian Heder retire?",
      "a": "He says so. Whether it sticks is behind the reveal.",
      "spoiler": {
        "chapter": 1,
        "html": "After Swamped he announces he is going straight. By Chapter 3 he is back in the life, at least for one favor."
      }
    }
  ],
  "faqSchema": [
    {
      "q": "Who is Brian Heder in GTA 6?",
      "aPlain": "An old-school drug runner from the golden age of smuggling in the Leonida Keys. He still moves product through his boat yard with his third wife, Lori, and he has people like Jason and Cal for the legwork."
    },
    {
      "q": "Who voices Brian Heder?",
      "aPlain": "Stephen Root, in Rockstar's launch-day credits. The rest of the cast is in the voice actors FAQ."
    },
    {
      "q": "What does Jason do for Brian?",
      "aPlain": "Whatever needs doing. He collects rent from Brian's tenants, runs smuggling jobs and helps with the local shakedowns. In return he lives rent-free in one of Brian's places and stops by for Lori's sangria."
    },
    {
      "q": "Which missions is Brian in?",
      "aPlain": "Most of Jason's work in Chapter 1 comes from him, Swamped among it, and he is back for Meet the Heders and Company Property in Chapter 3. What happens sits behind the reveals in the Story Arc above."
    },
    {
      "q": "Does Brian Heder retire?",
      "aPlain": "He says so. Whether it sticks is behind the reveal."
    }
  ],
  "sidebar": [
    {
      "title": "Operating Territory",
      "items": [
        {
          "url": "/gameplay/locations/brians-boat-workshop",
          "label": "Brian's Boat Workshop"
        },
        {
          "url": "/gameplay/locations/leonida-keys",
          "label": "Leonida Keys"
        },
        {
          "url": "/gameplay/locations/grassrivers",
          "label": "Grassrivers"
        }
      ]
    },
    {
      "title": "Story and Cast",
      "items": [
        {
          "url": "/faq/who-are-the-main-characters-in-gta-6",
          "label": "The Main Characters"
        },
        {
          "url": "/faq/gta-6-voice-actors",
          "label": "The Voice Cast"
        }
      ]
    },
    {
      "title": "Full Character Index",
      "items": [
        {
          "url": "/gameplay/characters",
          "label": "All Characters"
        }
      ]
    }
  ]
}
---
Brian Heder has been running product through the [Leonida Keys](/gameplay/locations/leonida-keys) since the golden age of smuggling, and he has the boat yard, the tenants and the tan to prove it. He looks like a beach bum. He is not one.

**He does not do the dirty work anymore.** He has people for that. Rent from the tenants, runs on the water, a lockup where the stolen stuff ends up: Brian sets it up and somebody else goes and gets it done. His third wife, [Lori](/gameplay/characters/lori-heder), is in the business with him, and she can handle a rifle.

[Jason Duval](/gameplay/characters/jason-duval) is one of his people. Jason lives rent-free in one of Brian's places, helps with the local shakedowns and stops by for Lori's sangria when Brian is busy. [Cal Hampton](/gameplay/characters/cal-hampton) comes along on the jobs. Nobody put the deal in writing, and nobody needs to.

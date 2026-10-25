{
  "slug": "jason-duval",
  "css": "\r\n    :root{--blue:#e0785f;--blue-dim:rgba(224,120,95,0.14);--blue-border:rgba(224,120,95,0.30);--pink:#4a9e93;--pink-dim:rgba(74,158,147,0.10);--paper:#ece4d3;--paper-ink:#2a2420;--green:#28a745;--green-dim:rgba(40,167,69,0.12);--amber:#ffc107;--amber-dim:rgba(255,193,7,0.12);--bg:#0b0a08;--bg-2:#131110;--bg-3:#1c1815;--bg-4:#262019;--border:rgba(255,255,255,0.055);--border-b:rgba(224,120,95,0.22);--t1:#f2ede4;--t2:#a89a86;--t3:#6b5f4f;--r:12px;--nav-h:62px}\r\n    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\r\n    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }\r\n    body { font-family: 'Archivo', sans-serif; background: var(--bg); color: var(--t1); overflow-x: hidden; font-size: 16px; line-height: 1.6; }\r\n    a { color: inherit; text-decoration: none; }\r\n    img { display: block; max-width: 100%; }\r\n    ::selection { background: var(--blue); color: var(--paper-ink); }\r\n    ::-webkit-scrollbar { width: 5px; }\r\n    ::-webkit-scrollbar-track { background: var(--bg); }\r\n    ::-webkit-scrollbar-thumb { background: var(--bg-4); border-radius: 99px; }\r\n    .wrap { max-width: 1120px; margin: 0 auto; padding: 0 28px; }\r\n    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }\r\n\r\n    /* NAV */\r\n    .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: var(--nav-h); display: flex; align-items: center; background: rgba(11,10,8,.95); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border-b); }\r\n    .nav__inner { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }\r\n    .nav__logo { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--t1); flex-shrink: 0; }\r\n    .nav__logo-badge { width: 30px; height: 30px; background: var(--pink); color: var(--paper); clip-path: polygon(0 0, 78% 0, 100% 24%, 100% 100%, 0 100%); transform: rotate(-3deg); display: flex; align-items: center; justify-content: center; font-family: 'Anton', sans-serif; font-size: 13px; font-weight: 400; letter-spacing: 0; }\r\n    .nav__links { display: flex; align-items: center; gap: 2px; list-style: none; }\r\n    .nav__links a { padding: 5px 13px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t2); border-radius: 99px; transition: color .18s, background .18s; }\r\n    .nav__links a:hover { color: var(--t1); background: rgba(255,255,255,.05); }\r\n    .nav__links a.active { color: var(--blue); }\r\n    .nav__right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }\r\n    .nav__search-btn { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--t2); transition: color .18s, background .18s; }\r\n    .nav__search-btn:hover { color: var(--t1); background: rgba(255,255,255,.09); }\r\n    .nav__search-btn svg { width: 15px; height: 15px; }\r\n    .nav__db-btn { padding: 7px 18px; background: var(--blue); color: var(--paper-ink); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; border-radius: 8px; transition: opacity .18s, transform .15s; }\r\n    .nav__db-btn:hover { opacity: .85; transform: translateY(-1px); }\r\n    .nav__burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }\r\n    .nav__burger span { display: block; width: 20px; height: 1.5px; background: var(--t2); border-radius: 99px; }\r\n    .nav__mobile { display: none; position: fixed; top: var(--nav-h); left: 0; right: 0; background: rgba(11,10,8,.98); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border-b); padding: 16px 28px 24px; flex-direction: column; gap: 2px; z-index: 199; }\r\n    .nav__mobile.open { display: flex; }\r\n    .nav__mobile a { padding: 11px 14px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t2); border-radius: 9px; transition: .18s; }\r\n    .nav__mobile a:hover { color: var(--t1); background: rgba(255,255,255,.05); }\r\n    .nav__theme-btn { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--t2); transition: color .18s, background .18s; position: relative; flex-shrink: 0; }\r\n    .nav__theme-btn:hover { color: var(--t1); background: rgba(255,255,255,.09); }\r\n    .nav__theme-btn svg { width: 15px; height: 15px; position: absolute; transition: opacity .2s; }\r\n    .nav__theme-btn .icon-moon { opacity: 1; }\r\n    .nav__theme-btn .icon-sun { opacity: 0; }\r\n    [data-theme=\"light\"] .nav__theme-btn .icon-moon { opacity: 0; }\r\n    [data-theme=\"light\"] .nav__theme-btn .icon-sun { opacity: 1; }\r\n\r\n    /* NAV DROPDOWN */\r\n    .nav__dropdown-wrap { position: relative; display: flex; align-items: center; gap: 2px; }\r\n    .nav__dropdown-link { font-family: 'Archivo', sans-serif; font-size: 13px; font-weight: 600; color: var(--t2); text-transform: uppercase; letter-spacing: .07em; text-decoration: none; padding: 5px 0 5px 13px; transition: color .18s; }\r\n    .nav__dropdown-btn { background: none; border: none; cursor: pointer; color: var(--t2); padding: 5px 13px 5px 0; display: flex; align-items: center; transition: color .18s; }\r\n    .nav__dropdown-wrap:hover .nav__dropdown-link, .nav__dropdown-wrap:hover .nav__dropdown-btn { color: var(--t1); }\r\n    .nav__dropdown-chevron { width: 12px; height: 12px; transition: transform .2s; flex-shrink: 0; }\r\n    .nav__dropdown-wrap.open .nav__dropdown-chevron { transform: rotate(180deg); }\r\n    .nav__dropdown { position: absolute; top: 100%; left: 13px; background: var(--bg-2); border: 1px solid var(--border-b); border-radius: 12px; padding: 6px; min-width: 200px; box-shadow: 0 12px 32px rgba(0,0,0,.28); opacity: 0; pointer-events: none; transition: opacity .18s, transform .18s; transform: translateY(-6px); list-style: none; margin: 0; z-index: 200; }\r\n    .nav__dropdown li { list-style: none; padding: 0; margin: 0; }\r\n    .nav__dropdown-wrap.open .nav__dropdown { opacity: 1; pointer-events: all; transform: translateY(0); }\r\n    .nav__dropdown li a { display: block; padding: 9px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t2); text-decoration: none; border-radius: 8px; transition: background .15s, color .15s; white-space: nowrap; }\r\n    .nav__dropdown li a:hover { background: var(--bg-3); color: var(--blue); }\r\n    @media(max-width: 860px) {\r\n      .nav__dropdown-wrap { width: 100%; display: flex; align-items: center; justify-content: space-between; }\r\n      .nav__dropdown-link { padding: 11px 14px; font-size: 13px; flex: 1; }\r\n      .nav__dropdown-btn { padding: 11px 14px; background: none; border-radius: 9px; }\r\n      .nav__dropdown-btn:hover { background: rgba(255,255,255,.05); color: var(--t1); }\r\n      .nav__dropdown { position: static; transform: none; opacity: 1; pointer-events: all; box-shadow: none; border: none; border-radius: 0; background: none; padding: 0 0 0 14px; display: none; }\r\n      .nav__dropdown-wrap.open .nav__dropdown { display: block; transform: none; }\r\n      .nav__dropdown li a { color: var(--t3); font-size: 12px; }\r\n    }\r\n\r\n    /* SEARCH OVERLAY */\r\n    .search-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(11,10,8,.92); backdrop-filter: blur(24px); display: flex; align-items: flex-start; justify-content: center; padding-top: 120px; opacity: 0; pointer-events: none; transition: opacity .22s; }\r\n    .search-overlay.open { opacity: 1; pointer-events: all; }\r\n    .search-overlay__inner { width: 100%; max-width: 640px; padding: 0 28px; }\r\n    .search-overlay__label { font-family: 'Courier Prime', monospace; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; color: var(--pink); margin-bottom: 14px; }\r\n    .search-overlay__field { display: flex; align-items: center; background: var(--bg-3); border: 1px solid var(--blue-border); border-radius: 12px; overflow: hidden; }\r\n    .search-overlay__field svg { width: 18px; height: 18px; color: var(--t3); margin-left: 18px; flex-shrink: 0; }\r\n    .search-overlay__input { flex: 1; padding: 16px 18px; background: none; border: none; outline: none; font-family: 'Archivo', sans-serif; font-size: 16px; font-weight: 500; color: var(--t1); }\r\n    .search-overlay__input::placeholder { color: var(--t3); }\r\n    .search-overlay__close { padding: 10px 16px; background: none; border: none; font-size: 12px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--t3); cursor: pointer; transition: color .18s; }\r\n    .search-overlay__close:hover { color: var(--t1); }\r\n    .search-overlay__hint { margin-top: 12px; font-size: 12px; color: var(--t3); }\r\n    .search-overlay__hint kbd { background: var(--bg-4); border: 1px solid var(--border); border-radius: 5px; padding: 2px 7px; font-family: inherit; font-size: 11px; color: var(--t2); }\r\n    .search-overlay__results{margin-top:14px;display:flex;flex-direction:column;gap:3px;max-height:300px;overflow-y:auto;}\r\n    .search-result{display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;text-decoration:none;transition:border-color .15s,background .15s;}\r\n    .search-result.active,.search-result:hover{border-color:var(--blue-border);background:var(--bg-4);}\r\n    .search-result__cat{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--blue);background:var(--blue-dim);padding:2px 7px;border-radius:99px;flex-shrink:0;white-space:nowrap;}\r\n    .search-result__body{flex:1;min-width:0;}\r\n    .search-result__name{font-size:13px;font-weight:600;color:var(--t1);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\r\n    .search-overlay__nores{font-size:12px;color:var(--t3);padding:20px 0;text-align:center;}\r\n\r\n    /* PAGE LAYOUT */\r\n    .page { padding-top: 40px; }\r\n    .page__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t3); padding: 28px 0 0; transition: color .18s; }\r\n    .page__back:hover { color: var(--blue); }\r\n    .page__back svg { width: 14px; height: 14px; }\r\n\r\n    /* FILE TAG: small rotated stamp, replaces the old \"dossier badge\" pill */\r\n    .file-tag { display: inline-flex; align-items: center; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--pink); background: var(--pink-dim); border: 1.3px solid var(--pink); border-radius: 8px 2px 8px 2px; transform: rotate(-1.2deg); padding: 5px 14px; margin: 28px 0 18px; }\r\n\r\n    /* DOSSIER: file header, text left, two photos as attached artifacts right */\r\n    .dossier { margin: 0 0 56px; display: grid; grid-template-columns: 1fr 340px; gap: 48px; align-items: start; }\r\n    .dossier__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(38px, 6vw, 66px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .92; margin-bottom: 10px; }\r\n    .dossier__h1 span { color: var(--blue); }\r\n    .dossier__role { font-family: 'Courier Prime', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin-bottom: 20px; }\r\n    .dossier__tagline { font-size: 15px; color: var(--t2); line-height: 1.6; max-width: 480px; margin-bottom: 28px; }\r\n    .dossier__tagline strong { color: var(--t1); font-weight: 600; }\r\n\r\n    /* STAT BLOCK */\r\n    .stat-block { display: flex; flex-direction: column; gap: 0; background: var(--bg-2); border: 1px solid var(--border-b); border-radius: var(--r) 4px var(--r) 4px; overflow: hidden; }\r\n    .stat-block__item { padding: 16px 20px; border-bottom: 1px solid var(--border); }\r\n    .stat-block__item:last-child { border-bottom: none; }\r\n    .stat-block__key { font-family: 'Courier Prime', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .11em; color: var(--pink); margin-bottom: 5px; }\r\n    .stat-block__val { font-size: 14px; font-weight: 600; color: var(--t1); line-height: 1.4; }\r\n    .stat-block__sub { font-size: 12px; color: var(--t2); margin-top: 3px; line-height: 1.5; }\r\n\r\n    /* PHOTO STACK: the two images as pinned case-board artifacts */\r\n    .photo-stack { position: relative; padding-bottom: 64px; }\r\n    .photo-stack__sighting { position: relative; margin: 0; transform: rotate(1.2deg); }\r\n    .photo-stack__onfile { position: absolute; left: -16px; bottom: 0; width: 44%; margin: 0; transform: rotate(-4deg); z-index: 2; }\r\n    .photo-frame { position: relative; width: 100%; overflow: hidden; }\r\n    .photo-stack__sighting .photo-frame { padding-top: 75%; border-radius: 4px var(--r) 4px var(--r); border: 1px solid var(--border-b); box-shadow: 0 16px 30px rgba(0,0,0,.35); }\r\n    .photo-stack__onfile .photo-frame { padding-top: 133.33%; border-radius: var(--r) 4px var(--r) 4px; border: 1px solid var(--border-b); box-shadow: 0 12px 24px rgba(0,0,0,.4); }\r\n    .photo-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }\r\n    .photo-stack__sighting .photo-frame img { object-position: 62% 22%; }\r\n    .photo-stack__onfile .photo-frame img { object-position: 20% 22%; }\r\n    .photo-tag { position: absolute; font-family: 'Courier Prime', monospace; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; padding: 4px 10px; border-radius: 6px 2px 6px 2px; white-space: nowrap; background: var(--bg-2); }\r\n    .photo-tag--sighting { top: -10px; left: 16px; color: var(--pink); border: 1px solid var(--pink); transform: rotate(-2deg); }\r\n    .photo-tag--onfile { bottom: -9px; right: -8px; color: var(--blue); border: 1px solid var(--blue-border); transform: rotate(3deg); }\r\n    @media (max-width: 1024px) {\r\n      .photo-stack { max-width: 340px; }\r\n    }\r\n\r\n    /* MAIN CONTENT */\r\n    main { padding-bottom: 96px; }\r\n    .content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 48px; align-items: start; }\r\n    .content-main {}\r\n    .content-side { position: sticky; top: calc(var(--nav-h) + 24px); display: flex; flex-direction: column; gap: 14px; }\r\n\r\n    /* SECTION */\r\n    .section { margin-bottom: 56px; }\r\n    .section__eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }\r\n    .section__eyebrow-line { width: 5px; height: 5px; border-radius: 50%; background: var(--pink); flex-shrink: 0; }\r\n    .section__eyebrow-text { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; color: var(--pink); }\r\n    .section__h2 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(20px, 2.5vw, 28px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); margin-bottom: 20px; line-height: 1.1; }\r\n    .section__body { font-size: 14px; color: var(--t2); line-height: 1.85; }\r\n    .section__body p { margin-bottom: 16px; }\r\n    .section__body p:last-child { margin-bottom: 0; }\r\n    .section__body strong { color: var(--t1); font-weight: 600; }\r\n\r\n    /* INTEL LOG: stamped tickets, not a data table */\r\n\r\n    /* CONNECTION CARDS */\r\n    .connections { display: flex; flex-direction: column; gap: 8px; }\r\n    .conn-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r); padding: 16px 18px; display: flex; align-items: center; gap: 16px; text-decoration: none; transition: border-color .2s, transform .2s, background .2s; }\r\n    .conn-card:hover { border-color: var(--border-b); transform: translateX(4px); background: var(--bg-3); }\r\n    .conn-card__avatar { width: 40px; height: 40px; border-radius: 8px; background: var(--bg-3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; color: var(--blue); text-transform: uppercase; flex-shrink: 0; }\r\n    .conn-card__body { flex: 1; min-width: 0; }\r\n    .conn-card__role { font-family: 'Courier Prime', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .10em; color: var(--pink); margin-bottom: 3px; }\r\n    .conn-card__name { font-size: 14px; font-weight: 700; color: var(--t1); line-height: 1.2; }\r\n    .conn-card__desc { font-size: 12px; color: var(--t3); margin-top: 2px; }\r\n    .conn-card__arrow { font-size: 16px; color: var(--t3); transition: color .2s, transform .2s; flex-shrink: 0; }\r\n    .conn-card:hover .conn-card__arrow { color: var(--blue); transform: translateX(3px); }\r\n\r\n    /* SIDE CALLOUT */\r\n    .callout { background: var(--bg-2); border: 1px solid var(--border-b); border-radius: var(--r) 4px var(--r) 4px; padding: 20px; }\r\n    .callout__title { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); margin-bottom: 14px; }\r\n    .callout__items { display: flex; flex-direction: column; gap: 8px; }\r\n    .callout__item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--t2); text-decoration: none; padding: 8px 10px; border-radius: 8px; transition: background .18s, color .18s; }\r\n    .callout__item:hover { background: rgba(255,255,255,.04); color: var(--t1); }\r\n    .callout__item-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }\r\n\r\n    /* FOOTER */\r\n    .footer { border-top: 1px solid var(--border); padding: 52px 0 28px; }\r\n    .footer__inner { display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 44px; }\r\n    .footer__brand { display: flex; flex-direction: column; gap: 12px; }\r\n    .footer__brand-logo { display: flex; align-items: center; gap: 9px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--t1); }\r\n    .footer__brand-badge { width: 28px; height: 28px; background: var(--pink); color: var(--paper); clip-path: polygon(0 0, 78% 0, 100% 24%, 100% 100%, 0 100%); transform: rotate(-3deg); display: flex; align-items: center; justify-content: center; font-family: 'Anton', sans-serif; font-size: 12px; font-weight: 400; }\r\n    .footer__brand-desc { font-size: 13px; color: var(--t3); line-height: 1.7; }\r\n    .footer__col-head { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t2); margin-bottom: 14px; }\r\n    .footer__links { list-style: none; display: flex; flex-direction: column; gap: 8px; }\r\n    .footer__links a { font-size: 13px; color: var(--t3); transition: color .18s; }\r\n    .footer__links a:hover { color: var(--t2); }\r\n    .footer__bottom { border-top: 1px solid var(--border); padding-top: 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }\r\n    .footer__legal { font-size: 12px; color: var(--t3); line-height: 1.6; }\r\n\r\n    /* REVEAL */\r\n    .reveal { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }\r\n    .reveal.on { opacity: 1; transform: none; }\r\n    @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }\r\n    .reveal.d1 { transition-delay: .07s; }\r\n    .reveal.d2 { transition-delay: .14s; }\r\n\r\n    .faq-list{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--r);overflow:hidden}\r\n    .faq-item{border-bottom:1px solid var(--border)}\r\n    .faq-item:last-child{border-bottom:none}\r\n    .faq-item__q{list-style:none;cursor:pointer;padding:18px 22px;font-size:14px;font-weight:700;color:var(--t1);line-height:1.4;display:flex;align-items:center;justify-content:space-between;gap:14px}\r\n    .faq-item__q::-webkit-details-marker{display:none}\r\n    .faq-item__chevron{width:15px;height:15px;flex-shrink:0;color:var(--t3);transition:transform .2s}\r\n    .faq-item[open] .faq-item__chevron{transform:rotate(180deg)}\r\n    .faq-item__a{padding:0 22px 18px;font-size:13px;color:var(--t2);line-height:1.75}\r\n    a[style*=\"color:var(--blue)\"]{color:inherit!important;text-decoration:underline;text-decoration-color:var(--blue-border);text-underline-offset:2px;text-decoration-thickness:1px}\r\n\r\n    /* RESPONSIVE */\r\n    @media (max-width: 1024px) {\r\n      .dossier { grid-template-columns: 1fr; }\r\n      .content-grid { grid-template-columns: 1fr; }\r\n      .content-side { position: static; flex-direction: row; flex-wrap: wrap; }\r\n      .content-side > * { flex: 1 1 260px; }\r\n      .footer__inner { grid-template-columns: 1fr 1fr; }\r\n    }\r\n    @media (max-width: 768px) {\r\n      .nav__links, .nav__db-btn { display: none; }\r\n      .nav__burger { display: flex; }\r\n      .footer__inner { grid-template-columns: 1fr; gap: 28px; }\r\n    }\r\n\r\n    [data-theme=\"light\"] { --bg:#ece4d3; --bg-2:#f6f1e6; --bg-3:#e3d8c2; --bg-4:#d6c9ac; --border:rgba(42,36,32,.10); --border-b:rgba(168,68,44,.28); --t1:#211c17; --t2:#5a4f40; --t3:#8c7f68; --blue:#a8442c; --blue-dim:rgba(168,68,44,.12); --blue-border:rgba(168,68,44,.30); --pink:#2c6b61; --pink-dim:rgba(44,107,97,.10); --paper-ink:#211c17; }\r\n    [data-theme=\"light\"] .nav__db-btn { color: var(--paper); }\r\n    [data-theme=\"light\"] .nav { background: rgba(236,228,211,.95); }\r\n    [data-theme=\"dark\"] { --bg:#0b0a08; --bg-2:#131110; --bg-3:#1c1815; --bg-4:#262019; --border:rgba(255,255,255,0.055); --border-b:rgba(224,120,95,0.24); --t1:#f2ede4; --t2:#a89a86; --t3:#6b5f4f; --blue:#e0785f; --blue-dim:rgba(224,120,95,.14); --blue-border:rgba(224,120,95,.30); --pink:#4a9e93; --pink-dim:rgba(74,158,147,.14); --paper-ink:#2a2420; }\r\n    [data-theme=\"dark\"] .nav { background: rgba(11,10,8,.95); }\r\n  \r\n    /* CHAR HERO — full-bleed banner, every page gets one, photo or not */\r\n    .char-hero { position: relative; min-height: 400px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }\r\n    .char-hero__bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; z-index: 0; }\r\n    .char-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }\r\n    .char-hero__bg-graphic svg { position: absolute; right: -8%; top: 50%; transform: translateY(-50%); width: 58%; max-width: 620px; opacity: .07; color: var(--pink); }\r\n    .char-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%); z-index: 1; }\r\n    [data-theme=\"light\"] .char-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.6) 55%, rgba(236,228,211,0) 100%); }\r\n    .char-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }\r\n    .char-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }\r\n    .char-hero__back:hover { color: var(--blue); }\r\n    .char-hero__back svg { width: 14px; height: 14px; }\r\n    .char-hero__eyebrow { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--pink); margin-bottom: 14px; }\r\n    .char-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(38px, 6vw, 68px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .92; margin-bottom: 14px; }\r\n    .char-hero__sub { font-size: 15px; color: var(--t2); max-width: 560px; line-height: 1.65; }\r\n    .char-hero__sub strong { color: var(--t1); font-weight: 600; }\r\n    .dossier--stat-only { display: block; }\r\n    .dossier--stat-only .stat-block { max-width: 640px; }\r\n    .entry-gallery { display: flex; flex-direction: column; gap: 12px; }\r\n    .entry-gallery__item { position: relative; width: 100%; padding-top: 75%; border-radius: var(--r) 4px var(--r) 4px; overflow: hidden; border: 1px solid var(--border-b); }\r\n    .entry-gallery__item img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }\r\n  ",
  "titleParts": [
    "Jason",
    "Duval"
  ],
  "seo": {
    "title": "Jason Duval | GTA 6 Character Profile | GTAVITIPS",
    "description": "Jason Duval in GTA 6. Leonida native, former military, drug running background. Operating across Vice County with Lucia Caminos.",
    "ogDescription": "Jason Duval in GTA 6. Leonida native, former military, drug running background. Operating across Vice County with Lucia Caminos.",
    "ogImage": "https://gtavitips.com/assets/images/jason-duval-gta-6-character-01.jpg",
    "jsonLdName": "Jason Duval",
    "jsonLdDescription": "Jason Duval in GTA 6. Leonida native, former military, drug running background. Operating across Vice County with Lucia Caminos.",
    "dateModified": "2026-08-28"
  },
  "heroSubtitle": "Leonida native. **Former military. Drug running history in the Keys corridor.** Currently operating across Vice County with [Lucia Caminos](/gameplay/characters/lucia-caminos).",
  "heroImage": {
    "src": "/assets/images/jason-duval-gta-6-character-01.jpg",
    "alt": "Jason Duval beside a motorcycle in Vice City, GTA 6",
    "width": "1920",
    "height": "1080"
  },
  "statBlock": [
    {
      "key": "Role",
      "value": "Main Playable Protagonist",
      "sub": "One of two playable characters. Switchable with Lucia in the open world."
    },
    {
      "key": "Primary Connection",
      "value": "[Lucia Caminos](/gameplay/characters/lucia-caminos)",
      "sub": "Criminal partner. The trust dynamic between them drives the narrative."
    },
    {
      "key": "Background",
      "value": "Leonida Native",
      "sub": "Former military. Prior ties to drug running operations in the [Leonida Keys](/gameplay/locations/leonida-keys) corridor."
    }
  ],
  "gallery": [
    {
      "src": "/assets/images/jason-duval-gta-6-character-05.jpg",
      "alt": "Jason Duval on-file photo, GTA 6",
      "width": "1920",
      "height": "1080"
    }
  ],
  "connections": [
    {
      "url": "/gameplay/characters/lucia-caminos",
      "role": "Partner",
      "name": "Lucia Caminos",
      "desc": "Criminal partner. Recently paroled from Leonida State Penitentiary. The operation runs through both of them.",
      "avatarImage": {
        "src": "/assets/images/lucia-caminos-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/brian-heder",
      "role": "Associate",
      "name": "Brian Heder",
      "desc": "Known associate in Jason's network. Role in active operations under investigation.",
      "avatarImage": {
        "src": "/assets/images/brian-heder-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/cal-hampton",
      "role": "Contact",
      "name": "Cal Hampton",
      "desc": "Contact with documented proximity to Jason's operations. Nature of relationship unspecified in official material.",
      "avatarImage": {
        "src": "/assets/images/cal-hampton-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/boobie-ike",
      "role": "Client",
      "name": "Boobie Ike",
      "desc": "Sent Jason and Lucia on a stash house pickup that turned into a shootout with police. The bricks made it out.",
      "avatarImage": {
        "src": "/assets/images/boobie-ike-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/raul-bautista",
      "role": "Crew Lead",
      "name": "Raul Bautista",
      "desc": "Ran a car meeting and a live police chase as a trust test before bringing Jason and Lucia into a bigger job.",
      "avatarImage": {
        "src": "/assets/images/raul-bautista-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/petra-navarro",
      "role": "Client",
      "name": "Petra Navarro",
      "desc": "MegaMundo's CEO. Hires Jason for security at the headquarters opening, the night it turns into a shootout.",
      "avatarInitials": "PN"
    },
    {
      "url": "/gameplay/characters/andres-de-leon",
      "role": "Protects",
      "name": "Andres de Leon",
      "desc": "The MegaMundo executive Jason is hired to protect and keep in line during the headquarters opening.",
      "avatarInitials": "AL"
    }
  ],
  "faq": [
    {
      "q": "Who is Jason Duval in GTA 6?",
      "a": "One of two playable protagonists. Leonida native, former military, drug running history in the Keys corridor. He knows how this state operates because he has been inside it his whole life."
    },
    {
      "q": "What is Jason Duval's background in GTA 6?",
      "a": "Former military. Prior ties to drug running operations in the Leonida Keys. He stayed local while other people went looking for something bigger. The Keys corridor knows him by reputation."
    },
    {
      "q": "Where does Jason Duval operate in GTA 6?",
      "a": "Vice County. The Keys corridor. Vice City when the work takes him there. He covers the whole southern coastline of Leonida."
    },
    {
      "q": "Who is Jason Duval's partner in GTA 6?",
      "a": "Lucia Caminos. She came out of Leonida State Penitentiary and they connected. The jobs got bigger from there."
    },
    {
      "q": "Is Jason Duval playable in GTA 6?",
      "a": "Yes. One of two playable protagonists alongside Lucia Caminos. Players switch between both in the open world."
    }
  ],
  "faqSchema": [
    {
      "q": "Who is Jason Duval in GTA 6?",
      "aPlain": "One of two playable protagonists. Leonida native, former military, drug running history in the Keys corridor. He knows how this state operates because he has been inside it his whole life."
    },
    {
      "q": "What is Jason Duval's background in GTA 6?",
      "aPlain": "Former military. Prior ties to drug running operations in the Leonida Keys. He stayed local while other people went looking for something bigger. The Keys corridor knows him by reputation."
    },
    {
      "q": "Where does Jason Duval operate in GTA 6?",
      "aPlain": "Vice County. The Keys corridor. Vice City when the work takes him there. He covers the whole southern coastline of Leonida."
    },
    {
      "q": "Who is Jason Duval's partner in GTA 6?",
      "aPlain": "Lucia Caminos. She came out of Leonida State Penitentiary and they connected. The jobs got bigger from there."
    },
    {
      "q": "Is Jason Duval playable in GTA 6?",
      "aPlain": "Yes. One of two playable protagonists alongside Lucia Caminos. Players switch between both in the open world."
    }
  ],
  "sidebar": [
    {
      "title": "Operating Territory",
      "items": [
        {
          "url": "/gameplay/locations/vice-city",
          "label": "Vice City"
        },
        {
          "url": "/gameplay/locations/leonida-keys",
          "label": "Leonida Keys"
        },
        {
          "url": "/gameplay/locations/port-gellhorn",
          "label": "Port Gellhorn"
        },
        {
          "url": "/gameplay/locations/grassrivers",
          "label": "Grassrivers"
        }
      ]
    },
    {
      "title": "Law Enforcement Pressure",
      "items": [
        {
          "url": "/gameplay/gangs-and-factions/vcpd",
          "label": "VCPD"
        },
        {
          "url": "/gameplay/gangs-and-factions/leonida-state-police",
          "label": "Leonida State Police"
        }
      ]
    },
    {
      "title": "Full Character Index",
      "items": [
        {
          "url": "/gameplay/characters",
          "label": "All Profiles"
        }
      ]
    }
  ]
}
---

                Jason Duval grew up in Leonida. He knows this state the way you know a place you never quite managed to leave. The Keys. The swamp roads. The difference between who to trust and who to shoot. Two tattoos tell most of the story: **Marauders B Company** on his right arm, a military unit nobody around here asks about, and a bird being impaled by an arrow on his chest. A phoenix. He had a career before the Keys. It ended. The Keys career did not.
              


                He lives rent-free in a property owned by [Brian Heder](/gameplay/characters/brian-heder), in exchange for fixing the leaks, running the errands, and stopping by when Lori needs company. When [Lucia](/gameplay/characters/lucia-caminos) got out of Leonida Penitentiary, Jason was the one who picked her up. His watch read 5:08 PM at the gate. They were at the Rusty Anchor that same evening.
              


                He is the operational side of the partnership. He drives. He fights like a soldier. The Sinfronta Bank heist showed exactly what that training looks like when a security guard gets in the way. [Lucia](/gameplay/characters/lucia-caminos) plans the job. Jason is the one who keeps it alive when the plan falls apart.
              


                **He is not chasing [Vice City](/gameplay/locations/vice-city) glamour.** He wants something quieter on the other side of all this. His line is <em>I want to do this right.</em> It gets harder to mean that the longer this goes on. The heat from the [VCPD](/gameplay/gangs-and-factions/vcpd) and [state police](/gameplay/gangs-and-factions/leonida-state-police) keeps building, and the easy exit keeps moving further away.
              


                He's back in it. A stash house run by [Raymond](/gameplay/characters/raymond), a pickup of product that belongs, one way or another, to [Boobie Ike](/gameplay/characters/boobie-ike), a police raid, an escape out a window with the bricks still in hand. Later, a job with real money on it: hired security for the [MegaMundo](/gameplay/brands/megamundo) headquarters opening, standing next to Lucia when the party turns into a shootout. Between the two, a proving run with [Raul Bautista](/gameplay/characters/raul-bautista) riding in the back seat, testing whether Lucia can actually drive under fire before he trusts either of them with anything bigger.
              

{
  "slug": "lucia-caminos",
  "css": "\n\n    :root{--blue:#e0785f;--blue-dim:rgba(224,120,95,0.14);--blue-border:rgba(224,120,95,0.30);--pink:#4a9e93;--pink-dim:rgba(74,158,147,0.10);--paper:#ece4d3;--paper-ink:#2a2420;--green:#28a745;--green-dim:rgba(40,167,69,0.12);--amber:#ffc107;--amber-dim:rgba(255,193,7,0.12);--bg:#0b0a08;--bg-2:#131110;--bg-3:#1c1815;--bg-4:#262019;--border:rgba(255,255,255,0.055);--border-b:rgba(224,120,95,0.22);--t1:#f2ede4;--t2:#a89a86;--t3:#6b5f4f;--r:12px;--nav-h:62px}\n    [data-theme=\"light\"] { --bg:#ece4d3; --bg-2:#f6f1e6; --bg-3:#e3d8c2; --bg-4:#d6c9ac; --border:rgba(42,36,32,.10); --border-b:rgba(168,68,44,.28); --t1:#211c17; --t2:#5a4f40; --t3:#8c7f68; --blue:#a8442c; --blue-dim:rgba(168,68,44,.12); --blue-border:rgba(168,68,44,.30); --pink:#2c6b61; --pink-dim:rgba(44,107,97,.10); --paper-ink:#211c17; }\n    [data-theme=\"light\"] .nav__db-btn { color: var(--paper); }\n    [data-theme=\"light\"] .nav { background: rgba(236,228,211,.95); }\n    [data-theme=\"dark\"] { --bg:#0b0a08; --bg-2:#131110; --bg-3:#1c1815; --bg-4:#262019; --border:rgba(255,255,255,0.055); --border-b:rgba(224,120,95,0.24); --t1:#f2ede4; --t2:#a89a86; --t3:#6b5f4f; --blue:#e0785f; --blue-dim:rgba(224,120,95,.14); --blue-border:rgba(224,120,95,.30); --pink:#4a9e93; --pink-dim:rgba(74,158,147,.14); --paper-ink:#2a2420; }\n    [data-theme=\"dark\"] .nav { background: rgba(11,10,8,.95); }\n    .nav__theme-btn { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--t2); transition: color .18s, background .18s; position: relative; flex-shrink: 0; }\n    .nav__theme-btn:hover { color: var(--t1); background: rgba(255,255,255,.09); }\n    .nav__theme-btn svg { width: 15px; height: 15px; position: absolute; transition: opacity .2s; }\n    .nav__theme-btn .icon-moon { opacity: 1; }\n    .nav__theme-btn .icon-sun { opacity: 0; }\n    [data-theme=\"light\"] .nav__theme-btn .icon-moon { opacity: 0; }\n    [data-theme=\"light\"] .nav__theme-btn .icon-sun { opacity: 1; }\n    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n    html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}\n    body{font-family:'Archivo',sans-serif;background:var(--bg);color:var(--t1);overflow-x:hidden;font-size:16px;line-height:1.6}\n    a{color:inherit;text-decoration:none}\n    img{display:block;max-width:100%}\n    ::selection{background:var(--blue);color:var(--paper-ink)}\n    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--bg-4);border-radius:99px}\n    .wrap{max-width:1120px;margin:0 auto;padding:0 28px}\n    .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:var(--nav-h);display:flex;align-items:center;background:rgba(8,12,18,.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border-b)}\n    .nav__inner{width:100%;max-width:1120px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;gap:20px}\n    .nav__logo{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--t1);flex-shrink:0}\n    .nav__logo-badge{width:30px;height:30px;background:var(--pink);color:var(--paper);clip-path:polygon(0 0, 78% 0, 100% 24%, 100% 100%, 0 100%);transform:rotate(-3deg);display:flex;align-items:center;justify-content:center;font-family:'Anton',sans-serif;font-size:13px;font-weight:400;letter-spacing:0}\n    .nav__links{display:flex;align-items:center;gap:2px;list-style:none}\n    .nav__links a{padding:5px 13px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--t2);border-radius:99px;transition:color .18s,background .18s}\n    .nav__links a:hover{color:var(--t1);background:rgba(255,255,255,.05)}\n    .nav__links a.active{color:var(--blue)}\n    .nav__right{display:flex;align-items:center;gap:10px;flex-shrink:0}\n    .nav__search-btn{width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t2);transition:color .18s,background .18s}\n    .nav__search-btn:hover{color:var(--t1);background:rgba(255,255,255,.09)}\n    .nav__search-btn svg{width:15px;height:15px}\n    .nav__db-btn{padding:7px 18px;background:var(--blue);color:var(--paper-ink);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;border-radius:8px;transition:opacity .18s,transform .15s}\n    [data-theme=\"light\"] .nav__db-btn{color:var(--paper)}\n    .nav__db-btn:hover{opacity:.85;transform:translateY(-1px)}\n    .nav__burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}\n    .nav__burger span{display:block;width:20px;height:1.5px;background:var(--t2);border-radius:99px}\n    .nav__mobile{display:none;position:fixed;top:var(--nav-h);left:0;right:0;background:rgba(8,12,18,.98);backdrop-filter:blur(20px);border-bottom:1px solid var(--border-b);padding:16px 28px 24px;flex-direction:column;gap:2px;z-index:199}\n    .nav__mobile.open{display:flex}\n    .nav__mobile a{padding:11px 14px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--t2);border-radius:9px;transition:.18s}\n    .nav__mobile a:hover{color:var(--t1);background:rgba(255,255,255,.05)}\n    .search-overlay{position:fixed;inset:0;z-index:300;background:rgba(8,12,18,.92);backdrop-filter:blur(24px);display:flex;align-items:flex-start;justify-content:center;padding-top:120px;opacity:0;pointer-events:none;transition:opacity .22s}\n    .search-overlay.open{opacity:1;pointer-events:all}\n    .search-overlay__inner{width:100%;max-width:640px;padding:0 28px}\n    .search-overlay__label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--pink);margin-bottom:14px}\n    .search-overlay__field{display:flex;align-items:center;background:var(--bg-3);border:1px solid var(--blue-border);border-radius:12px;overflow:hidden}\n    .search-overlay__field svg{width:18px;height:18px;color:var(--t3);margin-left:18px;flex-shrink:0}\n    .search-overlay__input{flex:1;padding:16px 18px;background:none;border:none;outline:none;font-family:'Archivo',sans-serif;font-size:16px;font-weight:500;color:var(--t1)}\n    .search-overlay__input::placeholder{color:var(--t3)}\n    .search-overlay__close{padding:10px 16px;background:none;border:none;font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--t3);cursor:pointer;transition:color .18s}\n    .search-overlay__close:hover{color:var(--t1)}\n    .search-overlay__hint{margin-top:12px;font-size:12px;color:var(--t3)}\n    .search-overlay__hint kbd{background:var(--bg-4);border:1px solid var(--border);border-radius:5px;padding:2px 7px;font-family:inherit;font-size:11px;color:var(--t2)}\n    .search-overlay__results{margin-top:14px;display:flex;flex-direction:column;gap:3px;max-height:300px;overflow-y:auto;}\n    .search-result{display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;text-decoration:none;transition:border-color .15s,background .15s;}\n    .search-result.active,.search-result:hover{border-color:var(--blue-border);background:var(--bg-4);}\n    .search-result__cat{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--blue);background:var(--blue-dim);padding:2px 7px;border-radius:99px;flex-shrink:0;white-space:nowrap;}\n    .search-result__body{flex:1;min-width:0;}\n    .search-result__name{font-size:13px;font-weight:600;color:var(--t1);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n    .search-overlay__nores{font-size:12px;color:var(--t3);padding:20px 0;text-align:center;}\n    .page{padding-top:var(--nav-h)}\n    .page__back{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--t3);padding:24px 0 0;transition:color .18s}\n    .page__back:hover{color:var(--blue)}\n    .page__back svg{width:14px;height:14px}\n    .dossier{margin:0 0 56px;display:grid;grid-template-columns:1fr 340px;gap:48px;align-items:start}\n    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.7)}}\n    .stat-block{display:flex;flex-direction:column;background:var(--bg-2);border:1px solid var(--border-b);border-radius:var(--r);overflow:hidden}\n    .stat-block__item{padding:16px 20px;border-bottom:1px solid var(--border)}\n    .stat-block__item:last-child{border-bottom:none}\n    .stat-block__key{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.11em;color:var(--pink);margin-bottom:5px}\n    .stat-block__val{font-size:14px;font-weight:600;color:var(--t1);line-height:1.4}\n    .stat-block__sub{font-size:12px;color:var(--t2);margin-top:3px;line-height:1.5}\n    main{padding-bottom:96px}\n    .content-grid{display:grid;grid-template-columns:1fr 320px;gap:48px;align-items:start}\n    .content-side{position:sticky;top:calc(var(--nav-h) + 24px);display:flex;flex-direction:column;gap:14px}\n    .section{margin-bottom:56px}\n    .section__eyebrow{display:flex;align-items:center;gap:8px;margin-bottom:10px}\n    .section__eyebrow-line{width:5px;height:5px;border-radius:50%;background:var(--pink);flex-shrink:0}\n    .section__eyebrow-text{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--pink)}\n    .section__h2{font-size:clamp(18px,2.5vw,24px);font-weight:700;text-transform:uppercase;letter-spacing:.03em;color: var(--t1);margin-bottom:20px;line-height:1.2}\n    .section__body{font-size:14px;color:var(--t2);line-height:1.85}\n    .section__body p{margin-bottom:16px}\n    .section__body p:last-child{margin-bottom:0}\n    .section__body strong{color:var(--t1);font-weight:600}\n    .connections{display:flex;flex-direction:column;gap:8px}\n    .conn-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r);padding:16px 18px;display:flex;align-items:center;gap:16px;text-decoration:none;transition:border-color .2s,transform .2s,background .2s}\n    .conn-card:hover{border-color:var(--border-b);transform:translateX(4px);background:var(--bg-3)}\n    .conn-card__avatar{width:40px;height:40px;border-radius:8px;background:var(--bg-3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:var(--blue);text-transform:uppercase;flex-shrink:0;letter-spacing:.02em}\n    .conn-card__body{flex:1;min-width:0}\n    .conn-card__role{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.10em;color:var(--pink);margin-bottom:3px}\n    .conn-card__name{font-size:14px;font-weight:700;color:var(--t1);line-height:1.2}\n    .conn-card__desc{font-size:12px;color:var(--t3);margin-top:2px}\n    .conn-card__arrow{font-size:16px;color:var(--t3);transition:color .2s,transform .2s;flex-shrink:0}\n    .conn-card:hover .conn-card__arrow{color:var(--blue);transform:translateX(3px)}\n    .callout{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r);padding:20px}\n    .callout__title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--t3);margin-bottom:14px}\n    .callout__items{display:flex;flex-direction:column;gap:6px}\n    .callout__item{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--t2);text-decoration:none;padding:7px 10px;border-radius:8px;transition:background .18s,color .18s}\n    .callout__item:hover{background:rgba(255,255,255,.04);color:var(--t1)}\n    .callout__item-dot{width:5px;height:5px;border-radius:50%;background:var(--blue);flex-shrink:0}\n    .footer{border-top:1px solid var(--border);padding:52px 0 28px}\n    .footer__inner{display:grid;grid-template-columns:1.8fr 1fr 1fr 1fr 1fr;gap:48px;margin-bottom:44px}\n    .footer__brand{display:flex;flex-direction:column;gap:12px}\n    .footer__brand-logo{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--t1)}\n    .footer__brand-badge{width:28px;height:28px;background:var(--pink);color:var(--paper);clip-path:polygon(0 0, 78% 0, 100% 24%, 100% 100%, 0 100%);transform:rotate(-3deg);display:flex;align-items:center;justify-content:center;font-family:'Anton',sans-serif;font-size:12px;font-weight:400}\n    .footer__brand-desc{font-size:13px;color:var(--t3);line-height:1.7}\n    .footer__col-head{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--t2);margin-bottom:14px}\n    .footer__links{list-style:none;display:flex;flex-direction:column;gap:8px}\n    .footer__links a{font-size:13px;color:var(--t3);transition:color .18s}\n    .footer__links a:hover{color:var(--t2)}\n    .footer__bottom{border-top:1px solid var(--border);padding-top:22px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}\n    .footer__legal{font-size:12px;color:var(--t3);line-height:1.6}\n    .reveal{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}\n    .reveal.on{opacity:1;transform:none}\n    @media (prefers-reduced-motion: reduce){.reveal{opacity:1;transform:none;transition:none}}\n    .reveal.d1{transition-delay:.07s}\n    .reveal.d2{transition-delay:.14s}\n \n    \n    \n    @media(max-width:1024px){.dossier{grid-template-columns:1fr}.content-grid{grid-template-columns:1fr}.content-side{position:static;flex-direction:row;flex-wrap:wrap}.content-side>*{flex:1 1 260px}.footer__inner{grid-template-columns:1fr 1fr}}\n \n    \n    @media(max-width:768px){.nav__links,.nav__db-btn{display:none}.nav__burger{display:flex}.intel-entry{grid-template-columns:1fr;gap:4px}.footer__inner{grid-template-columns:1fr;gap:28px}}\n \n    \n        \n    \n    \n\n  \n    /* NAV DROPDOWN */\n    .nav__dropdown-wrap { position: relative; display: flex; align-items: center; gap: 2px; }\n    .nav__dropdown-link { font-family: 'Archivo', sans-serif; font-size: 13px; font-weight: 600; color: var(--t2); text-transform: uppercase; letter-spacing: .06em; text-decoration: none; transition: opacity .15s; } .nav__dropdown-btn { background: none; border: none; cursor: pointer; color: var(--blue); padding: 0; display: flex; align-items: center; transition: opacity .15s; }\n    .nav__dropdown-btn:hover { opacity: .75; }\n    .nav__dropdown-chevron { width: 12px; height: 12px; transition: transform .2s; flex-shrink: 0; }\n    .nav__dropdown-wrap.open .nav__dropdown-chevron { transform: rotate(180deg); }\n    .nav__dropdown { position: absolute; top: 100%; left: 50%; background: var(--bg-2); border: 1px solid var(--border-b); border-radius: 12px; padding: 14px 6px 6px; min-width: 200px; box-shadow: 0 12px 32px rgba(0,0,0,.18); opacity: 0; pointer-events: none; transition: opacity .18s, transform .18s; transform: translateX(-50%) translateY(-6px); list-style: none; margin: 0; z-index: 200; }\n    .nav__dropdown li { list-style: none; padding: 0; margin: 0; }\n    .nav__dropdown-wrap.open .nav__dropdown { opacity: 1; pointer-events: all; transform: translateX(-50%) translateY(0); }\n    .nav__dropdown-wrap.open .nav__dropdown-chevron { transform: rotate(180deg); }\n    .nav__dropdown li a { display: block; padding: 9px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t2); text-decoration: none; border-radius: 8px; transition: background .15s, color .15s; white-space: nowrap; }\n    .nav__dropdown li a:hover { background: var(--bg-3); color: var(--blue); }\n    /* Mobile dropdown */\n \n    \n    @media(max-width: 860px) {\n      .nav__dropdown-wrap { width: 100%; display: flex; align-items: center; justify-content: space-between; }\n      .nav__dropdown-link { padding: 11px 14px; font-size: 13px; flex: 1; } .nav__dropdown-btn { padding: 11px 14px; background: none; border-radius: 9px; }\n      .nav__dropdown-btn:hover { background: rgba(255,255,255,.05); color: var(--t1); }\n      .nav__dropdown { position: static; transform: none; opacity: 1; pointer-events: all; box-shadow: none; border: none; border-radius: 0; background: none; padding: 0 0 0 14px; display: none; }\n      .nav__dropdown-wrap.open .nav__dropdown { display: block; transform: none; }\n      .nav__dropdown li a { color: var(--t3); font-size: 12px; }\n    }\n    .faq-list{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--r);overflow:hidden}\n    .faq-item{border-bottom:1px solid var(--border)}\n    .faq-item:last-child{border-bottom:none}\n    .faq-item__q{list-style:none;cursor:pointer;padding:18px 22px;font-size:14px;font-weight:700;color:var(--t1);line-height:1.4;display:flex;align-items:center;justify-content:space-between;gap:14px}\n    .faq-item__q::-webkit-details-marker{display:none}\n    .faq-item__chevron{width:15px;height:15px;flex-shrink:0;color:var(--t3);transition:transform .2s}\n    .faq-item[open] .faq-item__chevron{transform:rotate(180deg)}\n    .faq-item__a{padding:0 22px 18px;font-size:13px;color:var(--t2);line-height:1.75}\n    a[style*=\"color:var(--blue)\"]{color:inherit!important;text-decoration:underline;text-decoration-color:var(--blue-border);text-underline-offset:2px;text-decoration-thickness:1px}\n  \n    .file-tag { display: inline-flex; align-items: center; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--pink); background: var(--pink-dim); border: 1.3px solid var(--pink); border-radius: 8px 2px 8px 2px; transform: rotate(-1.2deg); padding: 5px 14px; margin: 0 0 18px; }\n    .dossier__role { font-family: 'Courier Prime', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin: -4px 0 20px; }\n    .photo-stack { position: relative; padding-bottom: 64px; }\n    .photo-stack--single { padding-bottom: 0; }\n    .photo-stack__sighting { position: relative; margin: 0; transform: rotate(1.2deg); }\n    .photo-stack__onfile { position: absolute; left: -16px; bottom: 0; width: 44%; margin: 0; transform: rotate(-4deg); z-index: 2; }\n    .photo-stack--single .photo-stack__onfile { position: relative; left: 0; bottom: 0; width: 100%; transform: rotate(-1deg); }\n    .photo-frame { position: relative; width: 100%; overflow: hidden; }\n    .photo-stack__sighting .photo-frame { padding-top: 75%; border-radius: 4px var(--r) 4px var(--r); border: 1px solid var(--border-b); box-shadow: 0 16px 30px rgba(0,0,0,.35); }\n    .photo-stack__onfile .photo-frame { padding-top: 133.33%; border-radius: var(--r) 4px var(--r) 4px; border: 1px solid var(--border-b); box-shadow: 0 12px 24px rgba(0,0,0,.4); }\n    .photo-stack--single .photo-stack__onfile .photo-frame { padding-top: 125%; box-shadow: 0 16px 30px rgba(0,0,0,.35); }\n    .photo-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }\n    .photo-tag { position: absolute; font-family: 'Courier Prime', monospace; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; padding: 4px 10px; border-radius: 6px 2px 6px 2px; white-space: nowrap; background: var(--bg-2); }\n    .photo-tag--sighting { top: -10px; left: 16px; color: var(--pink); border: 1px solid var(--pink); transform: rotate(-2deg); }\n    .photo-tag--onfile { bottom: -9px; right: -8px; color: var(--blue); border: 1px solid var(--blue-border); transform: rotate(3deg); }\n    .photo-stack--single .photo-tag--onfile { bottom: -9px; right: 10px; }\n    /* legacy placeholder, restyled for characters with no photo asset yet */\n    /* CHAR HERO — full-bleed banner, every page gets one, photo or not */\n    .char-hero { position: relative; min-height: 400px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }\n    .char-hero__bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; z-index: 0; }\n    .char-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }\n    .char-hero__bg-graphic svg { position: absolute; right: -8%; top: 50%; transform: translateY(-50%); width: 58%; max-width: 620px; opacity: .07; color: var(--pink); }\n    .char-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%); z-index: 1; }\n    [data-theme=\"light\"] .char-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.6) 55%, rgba(236,228,211,0) 100%); }\n    .char-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }\n    .char-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }\n    .char-hero__back:hover { color: var(--blue); }\n    .char-hero__back svg { width: 14px; height: 14px; }\n    .char-hero__eyebrow { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--pink); margin-bottom: 14px; }\n    .char-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(38px, 6vw, 68px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .92; margin-bottom: 14px; }\n    .char-hero__sub { font-size: 15px; color: var(--t2); max-width: 560px; line-height: 1.65; }\n    .char-hero__sub strong { color: var(--t1); font-weight: 600; }\n    .dossier--stat-only { display: block; }\n    .dossier--stat-only .stat-block { max-width: 640px; }\n    .entry-gallery { display: flex; flex-direction: column; gap: 12px; }\n    .entry-gallery__item { position: relative; width: 100%; padding-top: 75%; border-radius: var(--r) 4px var(--r) 4px; overflow: hidden; border: 1px solid var(--border-b); }\n    .entry-gallery__item img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }\n  ",
  "titleParts": [
    "Lucia",
    "Caminos"
  ],
  "seo": {
    "title": "Lucia Caminos | GTA 6 Character Profile | GTAVITIPS",
    "description": "Lucia Caminos in GTA 6. Recently paroled from Leonida State Penitentiary, operating across Vice County with Jason Duval.",
    "ogDescription": "Lucia Caminos in GTA 6. Recently paroled from Leonida State Penitentiary, operating across Vice County with Jason Duval.",
    "ogImage": "https://gtavitips.com/assets/images/lucia-caminos-gta-6-character-01.jpg",
    "jsonLdName": "Lucia Caminos",
    "jsonLdDescription": "Lucia Caminos in GTA 6. Recently paroled from Leonida State Penitentiary, operating across Vice County with Jason Duval.",
    "dateModified": "2026-05-26"
  },
  "heroSubtitle": "Liberty City to Leonida to the street. **Her father taught her to fight before she could walk. She never stopped.** Out on parole, ankle tag still on, moving faster than the conditions allow.",
  "heroImage": {
    "src": "/assets/images/lucia-caminos-gta-6-character-01.jpg",
    "alt": "Lucia Caminos in GTA 6",
    "width": "1920",
    "height": "1080"
  },
  "statBlock": [
    {
      "key": "Role",
      "value": "Main Playable Protagonist",
      "sub": "One of two playable characters. Switchable with Jason in the open world."
    },
    {
      "key": "Primary Connection",
      "value": "[Jason Duval](/gameplay/characters/jason-duval)",
      "sub": "Criminal partner. The trust dynamic between them drives the narrative."
    },
    {
      "key": "Background",
      "value": "Liberty City via Leonida",
      "sub": "Moved to Leonida with her mother. Leonida State Penitentiary. Recently paroled."
    }
  ],
  "gallery": [
    {
      "src": "/assets/images/lucia-caminos-gta-6-character-02.jpg",
      "alt": "Lucia Caminos on-file photo, GTA 6",
      "width": "1920",
      "height": "1080"
    }
  ],
  "connections": [
    {
      "url": "/gameplay/characters/jason-duval",
      "role": "Partner",
      "name": "Jason Duval",
      "desc": "Criminal partner. The operation runs through both of them.",
      "avatarImage": {
        "src": "/assets/images/jason-duval-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/stefanie",
      "role": "Parole Officer",
      "name": "Stefanie",
      "desc": "Correctional social worker. Determines whether Lucia stays on the street or goes back inside.",
      "avatarInitials": "ST"
    },
    {
      "url": "/gameplay/characters/raul-bautista",
      "role": "Recruiter",
      "name": "Raul Bautista",
      "desc": "Experienced bank robber. Recruited Lucia for the Sinfronta National Bank job, then tested her driving under fire before trusting her with more.",
      "avatarImage": {
        "src": "/assets/images/raul-bautista-gta-6-character-01.jpg"
      }
    }
  ],
  "faq": [
    {
      "q": "Who is Lucia Caminos in GTA 6?",
      "a": "One of two playable protagonists. Out of Leonida correctional at the start of the story and moving fast. She runs with [Jason Duval](/gameplay/characters/jason-duval) and the operation runs through both of them."
    },
    {
      "q": "Is Lucia a confirmed playable character?",
      "a": "Yes. Featured in every official trailer and named in Rockstar's own materials. She and Jason are the two protagonists, both playable."
    },
    {
      "q": "Where is Lucia from?",
      "a": "Liberty City. She ended up in Leonida and did time in a correctional facility there. Story begins the day she gets out."
    },
    {
      "q": "What is Lucia's relationship with Jason Duval?",
      "a": "Criminal partner. They run jobs together across [Vice City](/gameplay/locations/vice-city) and the [Leonida Keys](/gameplay/locations/leonida-keys). The trust dynamic is established in Trailer 1."
    },
    {
      "q": "What does Stefanie do in GTA 6?",
      "a": "Lucia's parole officer. Correctional social worker who determines whether Lucia stays out or goes back inside. How much that relationship matters depends on how the story plays out."
    }
  ],
  "faqSchema": [
    {
      "q": "Who is Lucia Caminos in GTA 6?",
      "aPlain": "One of two playable protagonists. Grew up between Liberty City and Leonida, served time in Leonida State Penitentiary, and came out the other side looking for an exit that keeps not appearing."
    },
    {
      "q": "What is Lucia Caminos' role in GTA 6?",
      "aPlain": "She plans the jobs. Reads the room before anyone else does. Her criminal partnership with Jason Duval is the operational core of the story."
    },
    {
      "q": "Where does Lucia Caminos operate in GTA 6?",
      "aPlain": "Vice City and the surrounding territory. She came out of Leonida State Penitentiary on parole and has been moving ever since."
    },
    {
      "q": "Who is Lucia Caminos' partner in GTA 6?",
      "aPlain": "Jason Duval. He keeps the job alive when her plan falls apart. Together they are dangerous in the specific way two people are dangerous when they have nothing left to lose."
    },
    {
      "q": "Is Lucia Caminos playable in GTA 6?",
      "aPlain": "Yes. One of two playable protagonists alongside Jason Duval. Players switch between both in the open world."
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
        },
        {
          "url": "/gameplay/gangs-and-factions/correctional",
          "label": "Leonida DOC"
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
Lucia grew up fighting. Her father started teaching her from the moment she could stand. That is not backstory, she cage fights, and the way she moves through the Sinfronta Bank heist makes it obvious. Around her neck: **a small boxing glove pendant, worn and old, from her father.** She does not take it off. The one time it is not visible is the bank job, where a turtleneck covers it.

Her mother is from Liberty City. Lucia was in Los Santos long enough to ride the Leviathan roller coaster at Pleasure Pier and hold on to the shirt for years. Then Leonida. Then Leonida State Penitentiary. Then out on parole, ankle tag on her left leg, mandatory [community service](/gameplay/activities/community-service) on the roadside, answering to a corrections social worker named [Stefanie](/gameplay/characters/stefanie).

She is the tactical lead in the partnership with [Jason](/gameplay/characters/jason-duval). She plans the job. She reads the room. She knows when the situation has changed before anyone else in it does. Her line is <em>who you know and what you got is all that matters.</em> That is not nihilism. That is the math she has been running since Liberty City.

**She wants the same thing Jason wants**, something quieter on the other side of all this. That goal has not gotten closer. The jobs keep escalating. The heat from [VCPD](/gameplay/gangs-and-factions/vcpd) keeps building. And the parole conditions are still technically in effect.

Raul asked her, half-joking, if she was a professional. Her answer was one word: <em>of course.</em> That was the whole audition, and it happened mid-chase, driving. She stayed behind the wheel for the entire test run, then rode with Jason for the stash house raid, then worked alone for a stretch of the MegaMundo job, when a security detail turned into a shootout and split the two of them across different floors of the building.

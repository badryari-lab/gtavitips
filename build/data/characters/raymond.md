{
  "slug": "raymond",
  "css": "\n\n    :root{--blue:#e0785f;--blue-dim:rgba(224,120,95,0.14);--blue-border:rgba(224,120,95,0.30);--pink:#4a9e93;--pink-dim:rgba(74,158,147,0.10);--paper:#ece4d3;--paper-ink:#2a2420;--green:#3ea35f;--green-dim:rgba(62,163,95,0.12);--green-border:rgba(62,163,95,0.30);--amber:#d19a3d;--amber-dim:rgba(209,154,61,0.12);--amber-border:rgba(209,154,61,0.30);--red:#c0503f;--red-dim:rgba(192,80,63,0.12);--red-border:rgba(192,80,63,0.30);--bg:#0b0a08;--bg-2:#131110;--bg-3:#1c1815;--bg-4:#262019;--border:rgba(255,255,255,0.055);--border-b:rgba(224,120,95,0.22);--t1:#f2ede4;--t2:#a89a86;--t3:#6b5f4f;--r:12px;--nav-h:62px}\n    [data-theme=\"light\"] { --bg:#ece4d3; --bg-2:#f6f1e6; --bg-3:#e3d8c2; --bg-4:#d6c9ac; --border:rgba(42,36,32,.10); --border-b:rgba(168,68,44,.28); --t1:#211c17; --t2:#5a4f40; --t3:#8c7f68; --blue:#a8442c; --blue-dim:rgba(168,68,44,.12); --blue-border:rgba(168,68,44,.30); --pink:#2c6b61; --pink-dim:rgba(44,107,97,.10); --paper-ink:#211c17; }\n    [data-theme=\"light\"] .nav__db-btn { color: var(--paper); }\n    [data-theme=\"light\"] .nav { background: rgba(236,228,211,.95); }\n    [data-theme=\"dark\"] { --bg:#0b0a08; --bg-2:#131110; --bg-3:#1c1815; --bg-4:#262019; --border:rgba(255,255,255,0.055); --border-b:rgba(224,120,95,0.24); --t1:#f2ede4; --t2:#a89a86; --t3:#6b5f4f; --blue:#e0785f; --blue-dim:rgba(224,120,95,.14); --blue-border:rgba(224,120,95,.30); --pink:#4a9e93; --pink-dim:rgba(74,158,147,.14); --paper-ink:#2a2420; }\n    [data-theme=\"dark\"] .nav { background: rgba(11,10,8,.95); }\n    .nav__theme-btn { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--t2); transition: color .18s, background .18s; position: relative; flex-shrink: 0; }\n    .nav__theme-btn:hover { color: var(--t1); background: rgba(255,255,255,.09); }\n    .nav__theme-btn svg { width: 15px; height: 15px; position: absolute; transition: opacity .2s; }\n    .nav__theme-btn .icon-moon { opacity: 1; }\n    .nav__theme-btn .icon-sun { opacity: 0; }\n    [data-theme=\"light\"] .nav__theme-btn .icon-moon { opacity: 0; }\n    [data-theme=\"light\"] .nav__theme-btn .icon-sun { opacity: 1; }\n    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n    html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}\n    body{font-family:'Archivo',sans-serif;background:var(--bg);color:var(--t1);overflow-x:hidden;font-size:16px;line-height:1.6}\n    a{color:inherit;text-decoration:none}\n    img{display:block;max-width:100%}\n    ::selection{background:var(--blue);color:var(--paper-ink)}\n    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--bg-4);border-radius:99px}\n    .wrap{max-width:1120px;margin:0 auto;padding:0 28px}\n    .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:var(--nav-h);display:flex;align-items:center;background:rgba(8,12,18,.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border-b)}\n    .nav__inner{width:100%;max-width:1120px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;gap:20px}\n    .nav__logo{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--t1);flex-shrink:0}\n    .nav__logo-badge{width:30px;height:30px;background:var(--pink);color:var(--paper);clip-path:polygon(0 0, 78% 0, 100% 24%, 100% 100%, 0 100%);transform:rotate(-3deg);display:flex;align-items:center;justify-content:center;font-family:'Anton',sans-serif;font-size:13px;font-weight:400;letter-spacing:0}\n    .nav__links{display:flex;align-items:center;gap:2px;list-style:none}\n    .nav__links a{padding:5px 13px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--t2);border-radius:99px;transition:color .18s,background .18s}\n    .nav__links a:hover{color:var(--t1);background:rgba(255,255,255,.05)}\n    .nav__links a.active{color:var(--blue)}\n    .nav__right{display:flex;align-items:center;gap:10px;flex-shrink:0}\n    .nav__search-btn{width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t2);transition:color .18s,background .18s}\n    .nav__search-btn:hover{color:var(--t1);background:rgba(255,255,255,.09)}\n    .nav__search-btn svg{width:15px;height:15px}\n    .nav__db-btn{padding:7px 18px;background:var(--blue);color:var(--paper-ink);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;border-radius:8px;transition:opacity .18s,transform .15s}\n    [data-theme=\"light\"] .nav__db-btn{color:var(--paper)}\n    .nav__db-btn:hover{opacity:.85;transform:translateY(-1px)}\n    .nav__burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}\n    .nav__burger span{display:block;width:20px;height:1.5px;background:var(--t2);border-radius:99px}\n    .nav__mobile{display:none;position:fixed;top:var(--nav-h);left:0;right:0;background:rgba(8,12,18,.98);backdrop-filter:blur(20px);border-bottom:1px solid var(--border-b);padding:16px 28px 24px;flex-direction:column;gap:2px;z-index:199}\n    .nav__mobile.open{display:flex}\n    .nav__mobile a{padding:11px 14px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--t2);border-radius:9px;transition:.18s}\n    .nav__mobile a:hover{color:var(--t1);background:rgba(255,255,255,.05)}\n    .search-overlay{position:fixed;inset:0;z-index:300;background:rgba(8,12,18,.92);backdrop-filter:blur(24px);display:flex;align-items:flex-start;justify-content:center;padding-top:120px;opacity:0;pointer-events:none;transition:opacity .22s}\n    .search-overlay.open{opacity:1;pointer-events:all}\n    .search-overlay__inner{width:100%;max-width:640px;padding:0 28px}\n    .search-overlay__label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--pink);margin-bottom:14px}\n    .search-overlay__field{display:flex;align-items:center;background:var(--bg-3);border:1px solid var(--blue-border);border-radius:12px;overflow:hidden}\n    .search-overlay__field svg{width:18px;height:18px;color:var(--t3);margin-left:18px;flex-shrink:0}\n    .search-overlay__input{flex:1;padding:16px 18px;background:none;border:none;outline:none;font-family:'Archivo',sans-serif;font-size:16px;font-weight:500;color:var(--t1)}\n    .search-overlay__input::placeholder{color:var(--t3)}\n    .search-overlay__close{padding:10px 16px;background:none;border:none;font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--t3);cursor:pointer;transition:color .18s}\n    .search-overlay__close:hover{color:var(--t1)}\n    .search-overlay__hint{margin-top:12px;font-size:12px;color:var(--t3)}\n    .search-overlay__hint kbd{background:var(--bg-4);border:1px solid var(--border);border-radius:5px;padding:2px 7px;font-family:inherit;font-size:11px;color:var(--t2)}\n    .search-overlay__results{margin-top:14px;display:flex;flex-direction:column;gap:3px;max-height:300px;overflow-y:auto;}\n    .search-result{display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;text-decoration:none;transition:border-color .15s,background .15s;}\n    .search-result.active,.search-result:hover{border-color:var(--blue-border);background:var(--bg-4);}\n    .search-result__cat{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--blue);background:var(--blue-dim);padding:2px 7px;border-radius:99px;flex-shrink:0;white-space:nowrap;}\n    .search-result__body{flex:1;min-width:0;}\n    .search-result__name{font-size:13px;font-weight:600;color:var(--t1);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n    .search-overlay__nores{font-size:12px;color:var(--t3);padding:20px 0;text-align:center;}\n    .page{padding-top:var(--nav-h)}\n    .page__back{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--t3);padding:24px 0 0;transition:color .18s}\n    .page__back:hover{color:var(--blue)}\n    .page__back svg{width:14px;height:14px}\n    .dossier{margin:0 0 56px;display:grid;grid-template-columns:1fr 340px;gap:48px;align-items:start}\n    .stat-block{display:flex;flex-direction:column;background:var(--bg-2);border:1px solid var(--border-b);border-radius:var(--r);overflow:hidden}\n    .stat-block__item{padding:16px 20px;border-bottom:1px solid var(--border)}\n    .stat-block__item:last-child{border-bottom:none}\n    .stat-block__key{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.11em;color:var(--pink);margin-bottom:5px}\n    .stat-block__val{font-size:14px;font-weight:600;color:var(--t1);line-height:1.4}\n    .stat-block__sub{font-size:12px;color:var(--t2);margin-top:3px;line-height:1.5}\n    main{padding-bottom:96px}\n    .content-grid{display:grid;grid-template-columns:1fr 320px;gap:48px;align-items:start}\n    .content-side{position:sticky;top:calc(var(--nav-h) + 24px);display:flex;flex-direction:column;gap:14px}\n    .section{margin-bottom:56px}\n    .section__eyebrow{display:flex;align-items:center;gap:8px;margin-bottom:10px}\n    .section__eyebrow-line{width:5px;height:5px;border-radius:50%;background:var(--pink);flex-shrink:0}\n    .section__eyebrow-text{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--pink)}\n    .section__h2{font-size:clamp(18px,2.5vw,24px);font-weight:700;text-transform:uppercase;letter-spacing:.03em;color: var(--t1);margin-bottom:20px;line-height:1.2}\n    .section__body{font-size:14px;color:var(--t2);line-height:1.85}\n    .section__body p{margin-bottom:16px}\n    .section__body p:last-child{margin-bottom:0}\n    .section__body strong{color:var(--t1);font-weight:600}\n    .connections{display:flex;flex-direction:column;gap:8px}\n    .conn-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r);padding:16px 18px;display:flex;align-items:center;gap:16px;text-decoration:none;transition:border-color .2s,transform .2s,background .2s}\n    .conn-card:hover{border-color:var(--border-b);transform:translateX(4px);background:var(--bg-3)}\n    .conn-card__avatar{width:40px;height:40px;border-radius:8px;background:var(--bg-3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:var(--blue);text-transform:uppercase;flex-shrink:0;letter-spacing:.02em}\n    .conn-card__body{flex:1;min-width:0}\n    .conn-card__role{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.10em;color:var(--pink);margin-bottom:3px}\n    .conn-card__name{font-size:14px;font-weight:700;color:var(--t1);line-height:1.2}\n    .conn-card__desc{font-size:12px;color:var(--t3);margin-top:2px}\n    .conn-card__arrow{font-size:16px;color:var(--t3);transition:color .2s,transform .2s;flex-shrink:0}\n    .conn-card:hover .conn-card__arrow{color:var(--blue);transform:translateX(3px)}\n    .callout{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r);padding:20px}\n    .callout__title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--t3);margin-bottom:14px}\n    .callout__items{display:flex;flex-direction:column;gap:6px}\n    .callout__item{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--t2);text-decoration:none;padding:7px 10px;border-radius:8px;transition:background .18s,color .18s}\n    .callout__item:hover{background:rgba(255,255,255,.04);color:var(--t1)}\n    .callout__item-dot{width:5px;height:5px;border-radius:50%;background:var(--blue);flex-shrink:0}\n    .footer{border-top:1px solid var(--border);padding:52px 0 28px}\n    .footer__inner{display:grid;grid-template-columns:1.8fr 1fr 1fr 1fr 1fr;gap:48px;margin-bottom:44px}\n    .footer__brand{display:flex;flex-direction:column;gap:12px}\n    .footer__brand-logo{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--t1)}\n    .footer__brand-badge{width:28px;height:28px;background:var(--pink);color:var(--paper);clip-path:polygon(0 0, 78% 0, 100% 24%, 100% 100%, 0 100%);transform:rotate(-3deg);display:flex;align-items:center;justify-content:center;font-family:'Anton',sans-serif;font-size:12px;font-weight:400}\n    .footer__brand-desc{font-size:13px;color:var(--t3);line-height:1.7}\n    .footer__col-head{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--t2);margin-bottom:14px}\n    .footer__links{list-style:none;display:flex;flex-direction:column;gap:8px}\n    .footer__links a{font-size:13px;color:var(--t3);transition:color .18s}\n    .footer__links a:hover{color:var(--t2)}\n    .footer__bottom{border-top:1px solid var(--border);padding-top:22px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}\n    .footer__legal{font-size:12px;color:var(--t3);line-height:1.6}\n    .reveal{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}\n    .reveal.on{opacity:1;transform:none}\n    .reveal.d1{transition-delay:.07s}\n    .reveal.d2{transition-delay:.14s}\n    @media(max-width:1024px){.dossier{grid-template-columns:1fr}.content-grid{grid-template-columns:1fr}.content-side{position:static;flex-direction:row;flex-wrap:wrap}.content-side>*{flex:1 1 260px}.footer__inner{grid-template-columns:1fr 1fr}}\n    @media(max-width:768px){.nav__links,.nav__db-btn{display:none}.nav__burger{display:flex}.intel-entry{grid-template-columns:1fr;gap:4px}.footer__inner{grid-template-columns:1fr;gap:28px}}\n    .nav__dropdown-wrap { position: relative; display: flex; align-items: center; gap: 2px; }\n    .nav__dropdown-link { font-family: 'Archivo', sans-serif; font-size: 13px; font-weight: 600; color: var(--t2); text-transform: uppercase; letter-spacing: .06em; text-decoration: none; transition: opacity .15s; } .nav__dropdown-btn { background: none; border: none; cursor: pointer; color: var(--blue); padding: 0; display: flex; align-items: center; transition: opacity .15s; }\n    .nav__dropdown-btn:hover { opacity: .75; }\n    .nav__dropdown-chevron { width: 12px; height: 12px; transition: transform .2s; flex-shrink: 0; }\n    .nav__dropdown-wrap.open .nav__dropdown-chevron { transform: rotate(180deg); }\n    .nav__dropdown { position: absolute; top: 100%; left: 50%; background: var(--bg-2); border: 1px solid var(--border-b); border-radius: 12px; padding: 14px 6px 6px; min-width: 200px; box-shadow: 0 12px 32px rgba(0,0,0,.18); opacity: 0; pointer-events: none; transition: opacity .18s, transform .18s; transform: translateX(-50%) translateY(-6px); list-style: none; margin: 0; z-index: 200; }\n    .nav__dropdown li { list-style: none; padding: 0; margin: 0; }\n    .nav__dropdown-wrap.open .nav__dropdown { opacity: 1; pointer-events: all; transform: translateX(-50%) translateY(0); }\n    .nav__dropdown li a { display: block; padding: 9px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--t2); text-decoration: none; border-radius: 8px; transition: background .15s, color .15s; white-space: nowrap; }\n    .nav__dropdown li a:hover { background: var(--bg-3); color: var(--blue); }\n    @media(max-width: 860px) {\n      .nav__dropdown-wrap { width: 100%; display: flex; align-items: center; justify-content: space-between; }\n      .nav__dropdown-link { padding: 11px 14px; font-size: 13px; flex: 1; } .nav__dropdown-btn { padding: 11px 14px; background: none; border-radius: 9px; }\n      .nav__dropdown-btn:hover { background: rgba(255,255,255,.05); color: var(--t1); }\n      .nav__dropdown { position: static; transform: none; opacity: 1; pointer-events: all; box-shadow: none; border: none; border-radius: 0; background: none; padding: 0 0 0 14px; display: none; }\n      .nav__dropdown-wrap.open .nav__dropdown { display: block; transform: none; }\n      .nav__dropdown li a { color: var(--t3); font-size: 12px; }\n    }\n    .faq-list{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--r);overflow:hidden}\n    .faq-item{border-bottom:1px solid var(--border)}\n    .faq-item:last-child{border-bottom:none}\n    .faq-item__q{list-style:none;cursor:pointer;padding:18px 22px;font-size:14px;font-weight:700;color:var(--t1);line-height:1.4;display:flex;align-items:center;justify-content:space-between;gap:14px}\n    .faq-item__q::-webkit-details-marker{display:none}\n    .faq-item__chevron{width:15px;height:15px;flex-shrink:0;color:var(--t3);transition:transform .2s}\n    .faq-item[open] .faq-item__chevron{transform:rotate(180deg)}\n    .faq-item__a{padding:0 22px 18px;font-size:13px;color:var(--t2);line-height:1.75}\n    a[style*=\"color:var(--blue)\"]{color:inherit!important;text-decoration:underline;text-decoration-color:var(--blue-border);text-underline-offset:2px;text-decoration-thickness:1px}\n    .dossier--stat-only { display: block; }\n    .dossier--stat-only .stat-block { max-width: 640px; }\n    .char-hero { position: relative; min-height: 400px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }\n    .char-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }\n    .char-hero__bg-graphic svg { position: absolute; right: -8%; top: 50%; transform: translateY(-50%); width: 58%; max-width: 620px; opacity: .07; color: var(--pink); }\n    .char-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%); z-index: 1; }\n    [data-theme=\"light\"] .char-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.6) 55%, rgba(236,228,211,0) 100%); }\n    .char-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }\n    .char-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }\n    .char-hero__back:hover { color: var(--blue); }\n    .char-hero__back svg { width: 14px; height: 14px; }\n    .char-hero__eyebrow { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--pink); margin-bottom: 14px; }\n    .char-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(38px, 6vw, 68px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .92; margin-bottom: 14px; }\n    .char-hero__sub { font-size: 15px; color: var(--t2); max-width: 560px; line-height: 1.65; }\n    .char-hero__sub strong { color: var(--t1); font-weight: 600; }\n  ",
  "titleParts": [
    "Raymond"
  ],
  "seo": {
    "title": "Raymond | GTA 6 Character Profile | GTAVITIPS",
    "description": "Raymond in GTA 6. Runs the stash house Jason and Lucia hit for Boobie Ike's product. A deal gone wrong brings the police straight to his door.",
    "ogDescription": "Raymond in GTA 6. Runs the stash house Jason and Lucia hit for Boobie Ike's product. A deal gone wrong brings the police straight to his door.",
    "jsonLdName": "Raymond",
    "jsonLdDescription": "Raymond in GTA 6. Runs the stash house Jason and Lucia hit for Boobie Ike's product. A deal gone wrong brings the police straight to his door.",
    "dateModified": "2026-08-28"
  },
  "heroSubtitle": "Dreadlocks, chest ink, two gold chains that do the talking before he does. **The stash house is his. So is the door count that decides who gets past it.**",
  "statBlock": [
    {
      "key": "Role",
      "value": "Stash House Operator",
      "sub": "Runs product through a working lab. Screens visitors at the door before anyone gets near the product."
    },
    {
      "key": "Known Affiliation",
      "value": "[Boobie Ike](/gameplay/characters/boobie-ike)",
      "sub": "The bricks moving through his stash house belong to Boobie Ike. Raymond holds the product. He doesn't own it."
    },
    {
      "key": "Disposition",
      "value": "Wired and Watching the Door",
      "sub": "Tension runs high inside before anything even goes wrong. The kind of place where a bad phone call is a five-alarm problem."
    }
  ],
  "gallery": [],
  "connections": [
    {
      "url": "/gameplay/characters/boobie-ike",
      "role": "Supplier To",
      "name": "Boobie Ike",
      "desc": "The bricks in Raymond's stash house belong to him. Raymond holds the product, not the ownership.",
      "avatarImage": {
        "src": "/assets/images/boobie-ike-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/jason-duval",
      "role": "Pickup Contact",
      "name": "Jason Duval",
      "desc": "Screened at the door for a pickup that turns into a police raid before it's finished.",
      "avatarImage": {
        "src": "/assets/images/jason-duval-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/lucia-caminos",
      "role": "Pickup Contact",
      "name": "Lucia Caminos",
      "desc": "At the stash house alongside Jason when the raid hits.",
      "avatarImage": {
        "src": "/assets/images/lucia-caminos-gta-6-character-01.jpg"
      }
    },
    {
      "url": "/gameplay/characters/ernesto",
      "role": "Contact",
      "name": "Ernesto",
      "desc": "The phone call that goes wrong right before the police arrive.",
      "avatarInitials": "ER"
    }
  ],
  "faq": [
    {
      "q": "Who is Raymond in GTA 6?",
      "a": "Raymond runs a stash house where product for Boobie Ike gets picked up. Jason and Lucia come through the door on a pickup that turns into a police raid before it's done."
    },
    {
      "q": "What happens at Raymond's stash house?",
      "a": "Jason and Lucia are screened at the door and brought in to collect bricks belonging to Boobie Ike. Tension is already running high inside before a phone call to a man named Ernesto goes wrong. Police hit the building shortly after."
    },
    {
      "q": "Is Raymond confirmed in GTA 6?",
      "a": "Confirmed. Raymond appears and is named in the reveal footage, opening the first scene."
    },
    {
      "q": "What's Raymond's connection to Boobie Ike?",
      "a": "The bricks in Raymond's stash house belong to Boobie Ike. Jason confirms it himself on the way out the door: Booby's bricks, headed back to Booby."
    }
  ],
  "faqSchema": [
    {
      "q": "Who is Raymond in GTA 6?",
      "aPlain": "Raymond runs a stash house where product for Boobie Ike gets picked up. Jason and Lucia come through the door on a pickup that turns into a police raid before it's done."
    },
    {
      "q": "What happens at Raymond's stash house?",
      "aPlain": "Jason and Lucia are screened at the door and brought in to collect bricks belonging to Boobie Ike. Tension is already running high inside before a phone call to a man named Ernesto goes wrong. Police hit the building shortly after."
    },
    {
      "q": "Is Raymond confirmed in GTA 6?",
      "aPlain": "Confirmed. Raymond appears and is named in the reveal footage, opening the first scene."
    },
    {
      "q": "What's Raymond's connection to Boobie Ike?",
      "aPlain": "The bricks in Raymond's stash house belong to Boobie Ike. Jason confirms it himself on the way out the door: Booby's bricks, headed back to Booby."
    }
  ],
  "sidebar": [
    {
      "title": "Related",
      "items": [
        {
          "url": "/gameplay/characters/boobie-ike",
          "label": "Boobie Ike"
        },
        {
          "url": "/gameplay/characters/ernesto",
          "label": "Ernesto"
        },
        {
          "url": "/gameplay/locations/vice-city",
          "label": "Vice City"
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
Raymond runs the door and the room behind it. Dreadlocks, tattoos across his chest, two gold chains heavy enough to see from across the street. This isn't a corner operation. The room he operates out of is actively cooking product, and the security posture matches: nobody gets past the entrance without being screened first.

[Jason](/gameplay/characters/jason-duval) and [Lucia](/gameplay/characters/lucia-caminos) come through that screening on a pickup. The product isn't Raymond's. It belongs to [Boobie Ike](/gameplay/characters/boobie-ike), and Raymond's stash house is where it sits until it moves. That arrangement puts him in the middle of every transaction that runs through the door, and in the middle of whatever goes wrong on the way out.

**Something goes wrong fast.** A phone call to a man named [Ernesto](/gameplay/characters/ernesto) doesn't land the way it's supposed to. The room's tension, already high before the call, spikes further. Police hit the building shortly after. Whatever the call actually communicated, the timing lines up too well to call it a coincidence.

The raid turns the stash house into a fight, then an escape through a stranger's apartment down the hall. Jason clears the building with the product still in hand. His own words on the way out: <em>"Got Booby's bricks."</em> Whether Raymond gets out clean himself isn't shown.

/**
 * GTAVITIPS — Comments
 * Requires: Supabase UMD loaded before this script
 * Used on: news articles (and future pages)
 */
(function () {
  'use strict';

  // ── Config ───────────────────────────────────────────────────────────
  // Fill these in after creating your Supabase project
  var SUPABASE_URL  = 'https://lsrxwfjtaasjkffomptd.supabase.co';
  var SUPABASE_ANON = 'sb_publishable_inNAv0uM7bV4zd4O8Akz2w_USgtrC0C';

  if (!window.supabase) { console.warn('[comments] Supabase SDK niet geladen'); return; }
  if (SUPABASE_URL.indexOf('JOUW_') !== -1) { console.warn('[comments] Vul SUPABASE_URL en SUPABASE_ANON in'); return; }

  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  // ── Slug via canonical tag ────────────────────────────────────────────
  var canonical = document.querySelector('link[rel="canonical"]');
  var slug = canonical
    ? canonical.getAttribute('href').replace('https://gtavitips.com', '').replace(/\/$/, '')
    : window.location.pathname.replace(/\/$/, '');

  // ── DOM ───────────────────────────────────────────────────────────────
  var section  = document.getElementById('comments');
  if (!section) return;

  var authBlock = section.querySelector('.comments-auth');
  var userBar   = section.querySelector('.comments-user-bar');
  var form      = section.querySelector('.comments-form');
  var list      = section.querySelector('.comments-list');
  var countEl   = section.querySelector('.comments-count');
  var textarea  = section.querySelector('.comments-textarea');
  var submitBtn = section.querySelector('.comments-submit');

  // ── Helpers ───────────────────────────────────────────────────────────
  function timeAgo(ts) {
    var diff = Date.now() - new Date(ts).getTime();
    var m = Math.floor(diff / 60000);
    if (m < 1)  return 'just now';
    if (m < 60) return m + ' min ago';
    var h = Math.floor(m / 60);
    if (h < 24) return h + (h === 1 ? ' hour ago' : ' hours ago');
    var d = Math.floor(h / 24);
    if (d < 7)  return d + (d === 1 ? ' day ago' : ' days ago');
    return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function avatarHtml(src, name, cls) {
    if (src) return '<img class="' + cls + '" src="' + esc(src) + '" alt="" loading="lazy">';
    return '<div class="' + cls + ' ' + cls + '--default">' + esc((name || 'O').charAt(0).toUpperCase()) + '</div>';
  }

  // ── Load comments ─────────────────────────────────────────────────────
  function loadComments() {
    sb.from('comments')
      .select('id, content, created_at, profiles(username, avatar_url)')
      .eq('article_slug', slug)
      .is('parent_id', null)
      .order('created_at', { ascending: true })
      .then(function (res) {
        if (res.error) { console.error('[comments]', res.error); return; }
        var data  = res.data || [];
        var count = data.length;

        if (countEl) countEl.textContent = count;

        if (!list) return;
        if (count === 0) {
          list.innerHTML = '<p class="comments-empty">No comments yet. Be the first.</p>';
          return;
        }

        list.innerHTML = data.map(function (c) {
          var name = (c.profiles && c.profiles.username) ? c.profiles.username : 'Operator';
          var src  = (c.profiles && c.profiles.avatar_url) ? c.profiles.avatar_url : '';
          return (
            '<div class="comment" data-id="' + esc(c.id) + '">' +
              avatarHtml(src, name, 'comment-avatar') +
              '<div class="comment-body">' +
                '<div class="comment-meta">' +
                  '<span class="comment-username">' + esc(name) + '</span>' +
                  '<span class="comment-time">' + timeAgo(c.created_at) + '</span>' +
                '</div>' +
                '<p class="comment-text">' + esc(c.content) + '</p>' +
              '</div>' +
            '</div>'
          );
        }).join('');
      });
  }

  // ── Show/hide auth state ──────────────────────────────────────────────
  function showLoggedIn(user, profile) {
    if (authBlock) authBlock.style.display = 'none';
    if (form) form.style.display = 'block';
    if (!userBar) return;

    var name = (profile && profile.username) ? profile.username
             : (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name
             : user.email || 'Operator';
    var src  = (profile && profile.avatar_url) ? profile.avatar_url
             : (user.user_metadata && user.user_metadata.avatar_url) ? user.user_metadata.avatar_url
             : '';

    userBar.innerHTML =
      '<div class="comments-user-info">' +
        avatarHtml(src, name, 'comments-user-avatar') +
        '<span>Logged in as <strong>' + esc(name) + '</strong></span>' +
      '</div>' +
      '<button class="comments-logout" id="comments-logout-btn">Log out</button>';
    userBar.style.display = 'flex';

    var logoutBtn = document.getElementById('comments-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () { sb.auth.signOut(); });
    }
  }

  function showLoggedOut() {
    if (authBlock) authBlock.style.display = 'block';
    if (form)      form.style.display = 'none';
    if (userBar)   { userBar.style.display = 'none'; userBar.innerHTML = ''; }
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = textarea ? textarea.value.trim() : '';
      if (!text || text.length > 1000) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting…';

      sb.auth.getUser().then(function (res) {
        if (!res.data || !res.data.user) { showLoggedOut(); return Promise.resolve(null); }
        return sb.from('comments').insert({
          article_slug: slug,
          user_id:      res.data.user.id,
          content:      text
        });
      }).then(function (res) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reageer';
        if (!res || res.error) { console.error('[comments] insert', res && res.error); return; }
        if (textarea) textarea.value = '';
        loadComments();
      }).catch(function (err) {
        console.error('[comments]', err);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reageer';
      });
    });
  }

  // ── Login buttons ─────────────────────────────────────────────────────
  var discordBtn = section.querySelector('#btn-login-discord');
  var googleBtn  = section.querySelector('#btn-login-google');

  if (discordBtn) {
    discordBtn.addEventListener('click', function () {
      sb.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: window.location.href } });
    });
  }
  if (googleBtn) {
    googleBtn.addEventListener('click', function () {
      sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } });
    });
  }

  // ── Auth state listener ───────────────────────────────────────────────
  sb.auth.onAuthStateChange(function (event, session) {
    if (session && session.user) {
      sb.from('profiles')
        .select('username, avatar_url')
        .eq('id', session.user.id)
        .single()
        .then(function (res) {
          showLoggedIn(session.user, res.data);
        });
    } else {
      showLoggedOut();
    }
  });

  // ── Init ──────────────────────────────────────────────────────────────
  loadComments();

}());

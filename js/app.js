/* ===================================================================
 * Ishmeen Garewal — Portfolio interactions (vanilla JS, no deps)
 * =================================================================== */
(function () {
    "use strict";

    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

    /* ---- footer year ---- */
    var yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---- nav: scrolled state + mobile toggle ---- */
    var nav = $("#nav");
    var toggle = $("#navToggle");
    var body = document.body;

    function onScrollNav() {
        if (window.scrollY > 12) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
    }
    window.addEventListener("scroll", onScrollNav, { passive: true });
    onScrollNav();

    if (toggle) {
        toggle.addEventListener("click", function () {
            body.classList.toggle("menu-open");
        });
        $$(".nav-menu a").forEach(function (a) {
            a.addEventListener("click", function () { body.classList.remove("menu-open"); });
        });
    }

    /* ---- scroll progress bar ---- */
    var bar = $("#progress");
    function onScrollProgress() {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", onScrollProgress, { passive: true });
    window.addEventListener("resize", onScrollProgress);
    onScrollProgress();

    /* ---- reveal on scroll ---- */
    var revealObserver = ("IntersectionObserver" in window)
        ? new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("in");
                    revealObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" })
        : null;

    function observeReveals(scope) {
        $$(".reveal", scope).forEach(function (el) {
            if (el.classList.contains("in")) return;
            if (revealObserver) revealObserver.observe(el);
            else el.classList.add("in");
        });
    }
    observeReveals(document);

    /* ---- scrollspy (active nav link) ---- */
    var sections = $$("section[id]");
    var linkFor = {};
    $$(".nav-links a").forEach(function (a) {
        linkFor[a.getAttribute("href").slice(1)] = a;
    });
    if ("IntersectionObserver" in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                var a = linkFor[e.target.id];
                if (!a) return;
                if (e.isIntersecting) {
                    $$(".nav-links a").forEach(function (x) { x.classList.remove("active"); });
                    a.classList.add("active");
                }
            });
        }, { threshold: 0.5, rootMargin: "-40% 0px -50% 0px" });
        sections.forEach(function (s) { if (linkFor[s.id]) spy.observe(s); });
    }

    /* ---- stat count-up ---- */
    function countUp(el) {
        var m = /^([\d.]+)(.*)$/.exec(el.textContent.trim());
        if (!m) return;
        var target = parseFloat(m[1]);
        var suffix = m[2] || "";
        var decimals = (m[1].split(".")[1] || "").length;
        var start = null, dur = 1100;
        function step(t) {
            if (start === null) start = t;
            var p = Math.min((t - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = m[1] + suffix;
        }
        requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
        var numObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { countUp(e.target); numObs.unobserve(e.target); }
            });
        }, { threshold: 0.6 });
        $$(".stat .num").forEach(function (n) { numObs.observe(n); });
    }

    /* ---- pointer glow on cards ---- */
    function attachGlow(scope) {
        $$(".project-card, .pub-card, .repo-card, .skill-card", scope).forEach(function (card) {
            if (card.dataset.glow) return;
            card.dataset.glow = "1";
            card.addEventListener("pointermove", function (ev) {
                var r = card.getBoundingClientRect();
                card.style.setProperty("--mx", ((ev.clientX - r.left) / r.width * 100) + "%");
                card.style.setProperty("--my", ((ev.clientY - r.top) / r.height * 100) + "%");
            });
        });
    }
    attachGlow(document);

    /* ---- language color map ---- */
    var langColor = {
        Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26",
        CSS: "#563d7c", Java: "#b07219", "C++": "#f34b7d", C: "#555555", R: "#198CE7",
        "Jupyter Notebook": "#DA5B0B", Shell: "#89e051", Go: "#00ADD8", Ruby: "#701516",
        PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", Vue: "#41b883"
    };

    var ICON = {
        repo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5V4.5z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/></svg>',
        pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
        ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg>',
        star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .9-5 4.7 1.3 6.9L12 17.8 5.4 21l1.3-6.9-5-4.7 7-.9L12 2z"/></svg>',
        fork: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="5" r="2.4"/><circle cx="18" cy="5" r="2.4"/><circle cx="12" cy="19" r="2.4"/><path d="M6 7.5v3c0 1.5 1 2.5 2.5 2.5h7c1.5 0 2.5-1 2.5-2.5v-3M12 13v3.5"/></svg>'
    };

    function esc(s) {
        var d = document.createElement("div");
        d.textContent = s == null ? "" : String(s);
        return d.innerHTML;
    }

    /* ---- GitHub feed ---- */
    var repoList = $("#github-repo-list");
    if (repoList) {
        fetch("https://api.github.com/users/ishmeen-11/repos?sort=updated&per_page=100")
            .then(function (r) { if (!r.ok) throw new Error("gh"); return r.json(); })
            .then(function (data) {
                var repos = data
                    .filter(function (r) { 
                        return !r.fork && r.name.toLowerCase() !== "ishmeen-11" && r.name.toLowerCase() !== "ishmeen-portfolio"; 
                    });
                if (!repos.length) { repoList.innerHTML = '<div class="feed-loading">No public repositories yet.</div>'; return; }
                repoList.innerHTML = repos.map(function (repo) {
                    var color = langColor[repo.language] || "#9B7EDE";
                    var lang = repo.language
                        ? '<span class="repo-lang"><i class="lang-dot" style="background:' + color + '"></i>' + esc(repo.language) + '</span>'
                        : "";
                    var name = esc(repo.name).replace(/[-_]/g, " ");
                    return '<a class="repo-card reveal" href="' + repo.html_url + '" target="_blank" rel="noopener">' +
                        '<span class="ext">' + ICON.ext + '</span>' +
                        '<div class="repo-top"><div class="repo-ic">' + ICON.repo + '</div>' +
                        '<div><div class="repo-kicker">Open-source repo</div><h3>' + name + '</h3></div></div>' +
                        '<p>' + (repo.description ? esc(repo.description) : "A project by Ishmeen.") + '</p>' +
                        '<div class="repo-meta">' + lang +
                        '<span class="repo-stat">' + ICON.star + repo.stargazers_count + '</span>' +
                        '<span class="repo-stat">' + ICON.fork + repo.forks_count + '</span>' +
                        '</div></a>';
                }).join("");
                observeReveals(repoList);
                attachGlow(repoList);
            })
            .catch(function () {
                repoList.innerHTML = '<div class="feed-loading">Couldn\'t load GitHub right now — <a href="https://github.com/ishmeen-11" target="_blank" rel="noopener">visit my profile →</a></div>';
            });
    }

    /* ---- Medium feed ---- */
    var articleList = $("#medium-article-list");
    if (articleList) {
        fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ishmeengarewal")
            .then(function (r) { if (!r.ok) throw new Error("md"); return r.json(); })
            .then(function (data) {
                var items = (data.items || []).slice(0, 6);
                if (!items.length) { articleList.innerHTML = '<div class="feed-loading">No articles yet — check back soon.</div>'; return; }
                articleList.innerHTML = items.map(function (a) {
                    var tmp = document.createElement("div");
                    tmp.innerHTML = a.description || "";
                    var snippet = (tmp.textContent || "").trim().slice(0, 130).replace(/\s+\S*$/, "") + "…";
                    var date = new Date(a.pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    var tags = (a.categories || []).slice(0, 3).map(function (c) { return '<span class="tag">' + esc(c) + '</span>'; }).join("");
                    return '<a class="repo-card reveal" href="' + a.link + '" target="_blank" rel="noopener">' +
                        '<span class="ext">' + ICON.ext + '</span>' +
                        '<div class="repo-top"><div class="repo-ic">' + ICON.pen + '</div>' +
                        '<div><div class="repo-kicker">Article · ' + date + '</div><h3>' + esc(a.title) + '</h3></div></div>' +
                        '<p>' + snippet + '</p>' +
                        (tags ? '<div class="repo-meta">' + tags + '</div>' : '') +
                        '</a>';
                }).join("");
                observeReveals(articleList);
                attachGlow(articleList);
            })
            .catch(function () {
                articleList.innerHTML = '<div class="feed-loading">Couldn\'t load articles right now — <a href="https://medium.com/@ishmeengarewal" target="_blank" rel="noopener">read on Medium →</a></div>';
            });
    }

    // ==========================================================================
    // 🌗 THEME TOGGLE: LAVENDER INK DARK MODE
    // ==========================================================================
    var themeToggle = $("#themeToggle");
    var currentTheme = localStorage.getItem("theme");

    // Initialize theme
    if (currentTheme === "dark" || (!currentTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.body.classList.add("dark-theme");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-theme");
            var theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
            localStorage.setItem("theme", theme);
        });
    }

    // ==========================================================================
    // 🔍 PROJECT FILTERS
    // ==========================================================================
    var filterBtns = $$(".btn-filter");
    var projectCards = $$(".project-card");

    filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            // Update active tab styling
            filterBtns.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");

            var filter = btn.dataset.filter;

            projectCards.forEach(function (card) {
                if (filter === "all" || card.dataset.category === filter) {
                    card.classList.remove("filter-hide");
                    // Trigger IntersectionObserver entry animation on reveal
                    if (card.classList.contains("reveal") && !card.classList.contains("in")) {
                        if (revealObserver) revealObserver.observe(card);
                        else card.classList.add("in");
                    }
                } else {
                    card.classList.add("filter-hide");
                }
            });
        });
    });

})();

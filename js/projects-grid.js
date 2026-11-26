(function () {
    const main = document.getElementById("projects-main");
    if (!main) {
        return;
    }

    let publishedProjects = [];
    let rankBySlug = {};
    let activeDomain = "all";

    function t(key) {
        return typeof window.t === "function" ? window.t(key) : key;
    }

    function getLang() {
        const saved = localStorage.getItem("lang");
        if (saved === "fr" || saved === "en") {
            return saved;
        }
        return document.documentElement.lang === "en" ? "en" : "fr";
    }

    function pickText(project, lang, field) {
        const other = lang === "fr" ? "en" : "fr";
        const primary = project[lang] && project[lang][field] ? project[lang][field] : "";
        if (primary) {
            return primary;
        }
        return project[other] && project[other][field] ? project[other][field] : "";
    }

    function hasAnySection(project) {
        const langs = ["fr", "en"];
        const keys = ["context", "approach", "architecture", "challenges", "outcome"];
        return langs.some(function (lang) {
            const sections = project[lang] && project[lang].sections ? project[lang].sections : {};
            return keys.some(function (key) {
                return Boolean(sections[key] && sections[key].trim());
            });
        });
    }

    function getProjectHref(project) {
        if (project.legacy_page && !hasAnySection(project)) {
            return project.legacy_page;
        }
        return "project.html?p=" + encodeURIComponent(project.slug);
    }

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) {
            node.className = className;
        }
        if (text !== undefined && text !== null) {
            node.textContent = text;
        }
        return node;
    }

    function getDomainCounts(projects) {
        const counts = {};
        const order = [];
        projects.forEach(function (project) {
            if (!Array.isArray(project.domains)) {
                return;
            }
            project.domains.forEach(function (domain) {
                if (!Object.prototype.hasOwnProperty.call(counts, domain)) {
                    counts[domain] = 0;
                    order.push(domain);
                }
                counts[domain] += 1;
            });
        });
        return { counts: counts, order: order };
    }

    function buildFilterButton(label, domainValue) {
        const btn = el("button", "filter-tab" + (activeDomain === domainValue ? " is-active" : ""), label);
        btn.type = "button";
        btn.setAttribute("aria-pressed", activeDomain === domainValue ? "true" : "false");
        btn.addEventListener("click", function () {
            if (activeDomain === domainValue) {
                return;
            }
            activeDomain = domainValue;
            render();
        });
        return btn;
    }

    function buildCard(project, lang) {
        const title = pickText(project, lang, "title") || project.slug;
        const tagline = pickText(project, lang, "tagline");
        const result = pickText(project, lang, "result");

        const card = el("a", "tech-card");
        card.href = getProjectHref(project);

        const bar = el("div", "tech-card-bar");
        bar.appendChild(el("span", "", "PRJ-" + (rankBySlug[project.slug] || "00")));
        bar.appendChild(el("span", "", project.start ? project.start.slice(0, 4) : ""));
        card.appendChild(bar);

        if (project.cover) {
            const img = el("img", "tech-card-img");
            img.src = project.cover;
            img.alt = title;
            card.appendChild(img);
        } else {
            card.appendChild(el("div", "tech-card-placeholder", "// " + project.slug));
        }

        const body = el("div", "tech-card-body");
        body.appendChild(el("h2", "tech-card-title", title));
        if (tagline) {
            body.appendChild(el("p", "tech-card-desc", tagline));
        }
        if (result) {
            body.appendChild(el("p", "tech-card-metric", result));
        }

        if (Array.isArray(project.stack) && project.stack.length > 0) {
            const tags = el("div", "tech-tags");
            project.stack.slice(0, 5).forEach(function (tech) {
                tags.appendChild(el("span", "tech-tag", tech));
            });
            body.appendChild(tags);
        }

        body.appendChild(el("span", "tech-btn", t("projects_view")));
        card.appendChild(body);
        return card;
    }

    function render() {
        const lang = getLang();
        main.textContent = "";

        const header = el("header", "tech-header");
        header.appendChild(el("span", "tech-path", "~/portfolio/projects"));
        header.appendChild(el("h1", "tech-title", t("projects_title")));
        header.appendChild(el("p", "tech-sub", t("projects_subtitle")));
        main.appendChild(header);

        const domainInfo = getDomainCounts(publishedProjects);
        const filters = el("div", "projects-filters");
        filters.setAttribute("role", "group");
        filters.appendChild(buildFilterButton("[ " + t("projects_all") + " (" + publishedProjects.length + ") ]", "all"));
        domainInfo.order.forEach(function (domain) {
            const label = "[ " + t("dom_" + domain) + " (" + domainInfo.counts[domain] + ") ]";
            filters.appendChild(buildFilterButton(label, domain));
        });
        main.appendChild(filters);

        const filtered = activeDomain === "all"
            ? publishedProjects
            : publishedProjects.filter(function (project) {
                return Array.isArray(project.domains) && project.domains.indexOf(activeDomain) !== -1;
            });

        if (filtered.length === 0) {
            main.appendChild(el("p", "project-empty", t("projects_empty")));
            return;
        }

        const grid = el("section", "tech-grid");
        filtered.forEach(function (project) {
            grid.appendChild(buildCard(project, lang));
        });
        main.appendChild(grid);
    }

    document.addEventListener("langchange", render);

    fetch("data/projects.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Impossible de charger data/projects.json");
            }
            return response.json();
        })
        .then(function (data) {
            const all = Array.isArray(data.projects) ? data.projects : [];
            const published = all.filter(function (project) {
                return project.status === "published";
            });

            const byStartAsc = published.slice().sort(function (a, b) {
                const cmp = (a.start || "").localeCompare(b.start || "");
                return cmp !== 0 ? cmp : a.slug.localeCompare(b.slug);
            });
            rankBySlug = {};
            byStartAsc.forEach(function (project, index) {
                rankBySlug[project.slug] = String(index + 1).padStart(2, "0");
            });

            publishedProjects = published.slice().sort(function (a, b) {
                const featCmp = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
                if (featCmp !== 0) {
                    return featCmp;
                }
                return (b.start || "").localeCompare(a.start || "");
            });

            render();
        })
        .catch(function () {
            main.textContent = "";
            main.appendChild(el("p", "project-empty", t("projects_empty")));
        });
})();

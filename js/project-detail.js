(function () {
    const main = document.getElementById("project-main");
    if (!main) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("p") || "";
    const isPreview = params.get("preview") === "1";

    let loadedProjects = null;

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

    function pickSection(project, lang, sectionKey) {
        const other = lang === "fr" ? "en" : "fr";
        const primarySections = project[lang] && project[lang].sections ? project[lang].sections : {};
        const fallbackSections = project[other] && project[other].sections ? project[other].sections : {};
        return primarySections[sectionKey] || fallbackSections[sectionKey] || "";
    }

    function formatMonthYear(ym, lang) {
        if (!ym || !/^\d{4}-\d{2}$/.test(ym)) {
            return "";
        }
        const parts = ym.split("-");
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
        const locale = lang === "en" ? "en-US" : "fr-FR";
        return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
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

    function renderNotFound() {
        main.textContent = "";
        const wrap = el("div", "project-empty");
        wrap.appendChild(el("p", "", t("project_not_found")));
        const back = el("a", "tech-link", t("project_back"));
        back.href = "projects.html";
        wrap.appendChild(back);
        main.appendChild(wrap);
        document.title = t("project_not_found") + " - Portfolio";
    }

    function renderProject(project) {
        const lang = getLang();
        main.textContent = "";

        const backLink = el("a", "tech-link", t("project_back"));
        backLink.href = "projects.html";
        main.appendChild(backLink);

        const title = pickText(project, lang, "title");
        const tagline = pickText(project, lang, "tagline");
        document.title = (title || project.slug) + " - Portfolio";

        const header = el("header", "tech-header");
        header.appendChild(el("span", "tech-path", "~/portfolio/projects/" + project.slug));
        header.appendChild(el("h1", "tech-title", title));
        if (tagline) {
            header.appendChild(el("p", "tech-sub", tagline));
        }
        main.appendChild(header);

        const metaItems = [];
        const startLabel = formatMonthYear(project.start, lang);
        if (startLabel) {
            const endLabel = project.end ? formatMonthYear(project.end, lang) : t("project_ongoing");
            metaItems.push(startLabel + " \u2013 " + endLabel);
        }
        if (project.context) {
            metaItems.push(t("ctx_" + project.context));
        }
        if (Array.isArray(project.domains) && project.domains.length > 0) {
            metaItems.push(project.domains.map(function (d) {
                return t("dom_" + d);
            }).join(", "));
        }
        if (metaItems.length > 0) {
            main.appendChild(el("div", "project-meta", metaItems.join(" \u00b7 ")));
        }

        if (project.cover) {
            const img = el("img", "project-cover");
            img.src = project.cover;
            img.alt = title;
            main.appendChild(img);
        }

        const role = pickText(project, lang, "role");
        if (role) {
            const roleP = el("p", "project-role");
            roleP.appendChild(el("strong", "", t("project_role") + " :"));
            roleP.appendChild(document.createTextNode(role));
            main.appendChild(roleP);
        }

        const result = pickText(project, lang, "result");
        if (result) {
            main.appendChild(el("p", "tech-card-metric", result));
        }

        if (Array.isArray(project.stack) && project.stack.length > 0) {
            const stackWrap = el("div", "project-stack tech-tags");
            project.stack.forEach(function (tech) {
                stackWrap.appendChild(el("span", "tech-tag", tech));
            });
            main.appendChild(stackWrap);
        }

        const links = project.links || {};
        const linkDefs = [
            { key: "repo", labelKey: "project_repo" },
            { key: "demo", labelKey: "project_demo" },
            { key: "doc", labelKey: "project_doc" }
        ];
        const activeLinks = linkDefs.filter(function (item) {
            return Boolean(links[item.key]);
        });
        if (activeLinks.length > 0) {
            const linksWrap = el("div", "project-links");
            activeLinks.forEach(function (item) {
                const a = el("a", "tech-btn", t(item.labelKey));
                a.href = links[item.key];
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                linksWrap.appendChild(a);
            });
            main.appendChild(linksWrap);
        }

        const sectionKeys = ["context", "approach", "architecture", "challenges", "outcome"];
        sectionKeys.forEach(function (key) {
            const content = pickSection(project, lang, key);
            if (!content || !content.trim()) {
                return;
            }
            const section = el("section", "project-section");
            section.appendChild(el("h2", "", t("section_" + key)));
            content.split(/\r?\n+/).forEach(function (paragraph) {
                const trimmed = paragraph.trim();
                if (trimmed) {
                    section.appendChild(el("p", "", trimmed));
                }
            });
            main.appendChild(section);
        });

        if (project.legacy_page) {
            const legacyWrap = el("div", "project-legacy");
            const legacyLink = el("a", "tech-link", t("project_legacy"));
            legacyLink.href = project.legacy_page;
            legacyWrap.appendChild(legacyLink);
            main.appendChild(legacyWrap);
        }
    }

    function render() {
        if (!loadedProjects) {
            return;
        }
        const project = loadedProjects.find(function (item) {
            return item.slug === slug;
        });
        if (!project || (project.status === "draft" && !isPreview)) {
            renderNotFound();
            return;
        }
        renderProject(project);
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
            loadedProjects = Array.isArray(data.projects) ? data.projects : [];
            render();
        })
        .catch(function () {
            renderNotFound();
        });
})();

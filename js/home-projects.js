(function () {
    const container = document.getElementById("home-projects");
    const list = document.getElementById("home-projects-list");
    if (!container || !list) {
        return;
    }

    let recentProjects = null;

    function getLang() {
        const saved = localStorage.getItem("lang");
        if (saved === "fr" || saved === "en") {
            return saved;
        }
        return document.documentElement.lang === "en" ? "en" : "fr";
    }

    function pickTitle(project, lang) {
        const other = lang === "fr" ? "en" : "fr";
        const primary = project[lang] && project[lang].title ? project[lang].title : "";
        if (primary) {
            return primary;
        }
        return (project[other] && project[other].title) ? project[other].title : project.slug;
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

    function compareStartDescNullLast(a, b) {
        const aHas = Boolean(a.start);
        const bHas = Boolean(b.start);
        if (aHas !== bHas) {
            return aHas ? -1 : 1;
        }
        if (!aHas && !bHas) {
            return a.slug.localeCompare(b.slug);
        }
        const cmp = b.start.localeCompare(a.start);
        return cmp !== 0 ? cmp : a.slug.localeCompare(b.slug);
    }

    function render() {
        if (!recentProjects) {
            return;
        }
        const lang = getLang();
        list.textContent = "";

        recentProjects.forEach(function (project) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.className = "home-project-link";
            a.href = getProjectHref(project);
            const title = pickTitle(project, lang);
            const year = project.start ? project.start.slice(0, 4) : "";
            a.textContent = (year ? year + " \u00b7 " : "") + title + " \u2192";
            li.appendChild(a);
            list.appendChild(li);
        });
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
            recentProjects = published
                .slice()
                .sort(function (a, b) {
                    const featCmp = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
                    if (featCmp !== 0) {
                        return featCmp;
                    }
                    return compareStartDescNullLast(a, b);
                })
                .slice(0, 3);
            render();
        })
        .catch(function () {
            container.style.display = "none";
        });
})();

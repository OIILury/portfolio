(function () {
    const container = document.getElementById("skills-grid");
    if (!container) {
        return;
    }

    let categories = null;

    function getLang() {
        const saved = localStorage.getItem("lang");
        if (saved === "fr" || saved === "en") {
            return saved;
        }
        return document.documentElement.lang === "en" ? "en" : "fr";
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

    function render() {
        if (!categories) {
            return;
        }
        const lang = getLang();
        container.textContent = "";

        categories.forEach(function (cat) {
            const card = el("article", "tech-card info-skill-card");
            const body = el("div", "tech-card-body");
            const title = cat[lang] || cat.fr || cat.en || cat.id;
            body.appendChild(el("h3", "tech-card-title", title));

            const tags = el("div", "tech-tags");
            (cat.skills || []).forEach(function (skill) {
                tags.appendChild(el("span", "tech-tag", skill));
            });
            body.appendChild(tags);
            card.appendChild(body);
            container.appendChild(card);
        });
    }

    document.addEventListener("langchange", render);

    fetch("data/skills.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Impossible de charger data/skills.json");
            }
            return response.json();
        })
        .then(function (data) {
            categories = Array.isArray(data.categories) ? data.categories : [];
            render();
        })
        .catch(function () {
            container.textContent = "";
        });
})();

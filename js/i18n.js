(function () {
    const i18nBase = new URL("../i18n/", document.currentScript.src);
    const cache = {};
    let dict = {};
    let currentLang = null;
    let requestId = 0;

    function detectLang() {
        const saved = localStorage.getItem("lang");
        if (saved === "fr" || saved === "en") {
            return saved;
        }
        const language = (navigator.language || "en").toLowerCase();
        return language.startsWith("fr") ? "fr" : "en";
    }

    function load(lang) {
        if (cache[lang]) {
            return Promise.resolve(cache[lang]);
        }
        return fetch(new URL(lang + ".json", i18nBase)).then(function (response) {
            if (!response.ok) {
                throw new Error("Impossible de charger " + lang + ".json");
            }
            return response.json();
        }).then(function (data) {
            cache[lang] = data;
            return data;
        });
    }

    function translate(key) {
        if (Object.prototype.hasOwnProperty.call(dict, key)) {
            return dict[key];
        }
        return key;
    }

    function applyAttributes(element) {
        const spec = element.getAttribute("data-i18n-attr");
        if (!spec) {
            return;
        }
        spec.split(",").forEach(function (pair) {
            const parts = pair.trim().split(":");
            if (parts.length < 2) {
                return;
            }
            const attr = parts.shift().trim();
            const key = parts.join(":").trim();
            if (!attr || !key || !Object.prototype.hasOwnProperty.call(dict, key)) {
                return;
            }
            element.setAttribute(attr, dict[key]);
        });
    }

    function apply() {
        document.documentElement.lang = currentLang;
        document.querySelectorAll("[data-i18n]").forEach(function (element) {
            const key = element.getAttribute("data-i18n");
            if (key && Object.prototype.hasOwnProperty.call(dict, key)) {
                element.textContent = dict[key];
            }
        });
        document.querySelectorAll("[data-i18n-attr]").forEach(applyAttributes);
        const toggle = document.getElementById("lang-toggle");
        if (toggle) {
            toggle.checked = currentLang === "en";
        }
    }

    window.t = translate;

    window.setLang = function (lang) {
        if (lang !== "fr" && lang !== "en") {
            return Promise.reject(new Error("Langue non prise en charge"));
        }
        const id = ++requestId;
        return load(lang).then(function (data) {
            if (id !== requestId) {
                return;
            }
            dict = data;
            currentLang = lang;
            localStorage.setItem("lang", lang);
            apply();
            document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
        });
    };

    function boot() {
        const toggle = document.getElementById("lang-toggle");
        if (toggle) {
            toggle.addEventListener("change", function () {
                window.setLang(toggle.checked ? "en" : "fr");
            });
        }
        window.setLang(detectLang());
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();

(function () {
    "use strict";

    // API URLs
    const ARTICLE_API = "https://jsonplaceholder.typicode.com/posts";

    // ELEMEN DOM - BLOG ARTIKEL
    const blogSection = document.querySelector("#blog-section");
    const articleForm = document.querySelector("#article-form");
    const articleIdInput = document.querySelector("#article-id");
    const articleTitleInput = document.querySelector("#article-title");
    const articleBodyInput = document.querySelector("#article-body");
    const btnSubmitArticle = document.querySelector("#btn-submit-article");
    const btnCancelArticle = document.querySelector("#btn-cancel-article");
    const inputCariArticle = document.querySelector("#input-cari-article");
    const notifArticle = document.querySelector("#notif-article");
    const articleListContainer = document.querySelector("#article-list-container");

    let articlesData = [];
    let isEditingArticle = false;
    let editArticleId = null;

    let temaSaatIni = localStorage.getItem("temaSantri") || "terang";

    function terapkanTema(tema) {
        if (tema === "gelap") {
            document.body.classList.add("dark-mode");
            btnTema.textContent = "☀️ Mode Terang";
        } else {
            document.body.classList.remove("dark-mode");
            btnTema.textContent = "🌙 Mode Gelap";
        }
        localStorage.setItem("temaSantri", tema);
        temaSaatIni = tema;
    }

    btnTema.addEventListener("click", () => {
        terapkanTema(temaSaatIni === "terang" ? "gelap" : "terang");
    });

    async function muatDataArtikel() {
        notifArticle.textContent = "Loading articles...";
        try {
            const res = await fetch(`${ARTICLE_API}?_limit=6`);
            if (!res.ok) throw new Error("Gagal mengambil artikel.");

            articlesData = await res.json();
            notifArticle.textContent = "";
            renderDaftarArtikel(articlesData);
        } catch (error) {
            notifArticle.textContent = "Gagal mengambil data artikel. Silakan coba lagi.";
        }
    }

    function renderDaftarArtikel(list) {
        articleListContainer.innerHTML = "";

        if (list.length === 0) {
            articleListContainer.innerHTML = "<p>Belum ada artikel.</p>";
            return;
        }

        list.forEach((art) => {
            const card = document.createElement("div");
            card.className = "user-card article-card-item";

            card.innerHTML = `
                <div class="user-card-header">
                    <span class="user-name">#${art.id} ${escapeHTML(art.title)}</span>
                </div>
                <p class="user-email" style="margin-top: 6px;">${escapeHTML(art.body)}</p>
                <div class="article-action-buttons">
                    <button class="btn-action-art btn-edit-art">✏️ Edit</button>
                    <button class="btn-action-art btn-delete-art">🗑️ Delete</button>
                </div>
            `;

            card.querySelector(".btn-edit-art").addEventListener("click", () => setupEditArtikel(art.id));
            card.querySelector(".btn-delete-art").addEventListener("click", () => hapusArtikel(art.id));

            articleListContainer.appendChild(card);
        });
    }

    async function tambahArtikel(title, body) {
        btnSubmitArticle.disabled = true;
        btnSubmitArticle.textContent = "Menyimpan...";

        try {
            const res = await fetch(ARTICLE_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body, userId: 1 })
            });

            if (!res.ok) throw new Error("Gagal menyimpan.");

            const newId = articlesData.length > 0 ? Math.max(...articlesData.map(a => a.id)) + 1 : 101;
            articlesData.unshift({ id: newId, title, body });

            resetFormArtikel();
            filterArtikel();
        } catch (error) {
            alert("Gagal menambahkan artikel.");
        } finally {
            btnSubmitArticle.disabled = false;
            btnSubmitArticle.textContent = "Simpan Artikel";
        }
    }

    function setupEditArtikel(id) {
        const target = articlesData.find((a) => a.id === id);
        if (!target) return;

        isEditingArticle = true;
        editArticleId = id;
        articleIdInput.value = target.id;
        articleTitleInput.value = target.title;
        articleBodyInput.value = target.body;

        btnSubmitArticle.textContent = "Update Artikel";
        btnCancelArticle.style.display = "inline-block";

        blogSection.scrollIntoView({ behavior: "smooth" });
    }

    async function updateArtikel(id, title, body) {
        btnSubmitArticle.disabled = true;
        btnSubmitArticle.textContent = "Updating...";

        try {
            await fetch(`${ARTICLE_API}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, title, body, userId: 1 })
            });

            const index = articlesData.findIndex((a) => a.id === id);
            if (index !== -1) {
                articlesData[index].title = title;
                articlesData[index].body = body;
            }

            resetFormArtikel();
            filterArtikel();
        } catch (error) {
            alert("Gagal mengupdate artikel.");
        } finally {
            btnSubmitArticle.disabled = false;
        }
    }

    async function hapusArtikel(id) {
        if (!confirm(`Apakah Anda yakin ingin menghapus artikel #${id}?`)) return;

        try {
            await fetch(`${ARTICLE_API}/${id}`, { method: "DELETE" });
            articlesData = articlesData.filter((a) => a.id !== id);
            filterArtikel();
        } catch (error) {
            alert("Gagal menghapus artikel.");
        }
    }

    articleForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = articleTitleInput.value.trim();
        const body = articleBodyInput.value.trim();

        if (!title || !body) return;

        if (isEditingArticle) {
            updateArtikel(editArticleId, title, body);
        } else {
            tambahArtikel(title, body);
        }
    });

    btnCancelArticle.addEventListener("click", resetFormArtikel);

    inputCariArticle.addEventListener("input", filterArtikel);

    function filterArtikel() {
        const keyword = inputCariArticle.value.toLowerCase().trim();
        const filtered = articlesData.filter((a) =>
            a.title.toLowerCase().includes(keyword)
        );
        renderDaftarArtikel(filtered);
    }

    function resetFormArtikel() {
        isEditingArticle = false;
        editArticleId = null;
        articleForm.reset();
        btnSubmitArticle.textContent = "Simpan Artikel";
        btnCancelArticle.style.display = "none";
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    terapkanTema(temaSaatIni);
    muatDataArtikel();

})();
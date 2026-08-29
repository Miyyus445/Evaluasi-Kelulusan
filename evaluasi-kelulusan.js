(function () {
    "use strict";

    // API URL
    const ARTICLE_API = "https://jsonplaceholder.typicode.com/posts";

    let articlesData = [];
    let isEditingArticle = false;
    let editArticleId = null;
    let temaSaatIni = localStorage.getItem("temaBlog") || "terang";

    // Elemen DOM
    const btnTema = document.querySelector("#btn-tema");
    const articleForm = document.querySelector("#article-form");
    const articleIdInput = document.querySelector("#article-id");
    const articleTitleInput = document.querySelector("#article-title");
    const articleBodyInput = document.querySelector("#article-body");
    const formHeading = document.querySelector("#form-heading");
    const btnSubmitArticle = document.querySelector("#btn-submit-article");
    const btnCancelArticle = document.querySelector("#btn-cancel-article");
    const inputCariArticle = document.querySelector("#input-cari-article");
    const notifArticle = document.querySelector("#notif-article");
    const articleListContainer = document.querySelector("#article-list-container");

    function terapkanTema(tema) {
        if (tema === "gelap") {
            document.body.classList.add("dark-mode");
            btnTema.textContent = "☀️ Mode Terang";
        } else {
            document.body.classList.remove("dark-mode");
            btnTema.textContent = "🌙 Mode Gelap";
        }
        localStorage.setItem("temaBlog", tema);
        temaSaatIni = tema;
    }

    btnTema.addEventListener("click", () => {
        terapkanTema(temaSaatIni === "terang" ? "gelap" : "terang");
    });

    async function muatDataArtikel() {
        notifArticle.textContent = "⏳ Loading articles...";
        notifArticle.style.display = "block";

        try {
            const res = await fetch(`${ARTICLE_API}?_limit=6`);
            if (!res.ok) throw new Error("Gagal mengambil data dari server.");

            articlesData = await res.json();
            notifArticle.textContent = "";
            notifArticle.style.display = "none";
            renderDaftarArtikel(articlesData);
        } catch (error) {
            notifArticle.textContent = "⚠️ Gagal mengambil data artikel. Silakan coba lagi.";
            notifArticle.style.display = "block";
        }
    }

    function renderDaftarArtikel(list) {
        articleListContainer.innerHTML = "";

        if (list.length === 0) {
            articleListContainer.innerHTML = "<p class='empty-state'>Belum ada artikel.</p>";
            return;
        }

        list.forEach((art) => {
            const card = document.createElement("article");
            card.className = "article-card";

            card.innerHTML = `
                <div class="article-card-header">
                    <span class="article-id">#${art.id}</span>
                    <h3 class="article-title">${escapeHTML(art.title)}</h3>
                </div>
                <p class="article-body">${escapeHTML(art.body)}</p>
                <div class="article-action-buttons">
                    <button class="btn-action btn-edit">✏️ Edit</button>
                    <button class="btn-action btn-delete">🗑️ Delete</button>
                </div>
            `;

            // Event Tombol Edit & Delete
            card.querySelector(".btn-edit").addEventListener("click", () => setupEditArtikel(art.id));
            card.querySelector(".btn-delete").addEventListener("click", () => hapusArtikel(art.id));

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

            if (!res.ok) throw new Error("Gagal menyimpan artikel.");

            const newId = articlesData.length > 0 ? Math.max(...articlesData.map(a => a.id)) + 1 : 101;
            articlesData.unshift({ id: newId, title, body });

            resetFormArtikel();
            filterArtikel();
        } catch (error) {
            alert("Error: " + error.message);
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

        formHeading.textContent = `✏️ Edit Artikel #${target.id}`;
        btnSubmitArticle.textContent = "Update Artikel";
        btnCancelArticle.style.display = "inline-block";

        window.scrollTo({ top: 0, behavior: "smooth" });
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
            
            // Hapus dari array lokal
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

    // Filter Search Real-time (Bonus)
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
        formHeading.textContent = "➕ Tambah Artikel Baru";
        btnSubmitArticle.textContent = "Simpan Artikel";
        btnCancelArticle.style.display = "none";
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    terapkanTema(temaSaatIni);
    muatDataArtikel();

})();
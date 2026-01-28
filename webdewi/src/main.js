import './style.css'

/* ===================================================
   PALADEWI - PRODUK SHOWCASE (WEBSITE)
   API: GET /toko
=================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "/api/toko";

  const track = document.getElementById("productTrack");
  const template = document.getElementById("productCardTemplate");

  const btnPrev = document.querySelector(".slider-btn.prev");
  const btnNext = document.querySelector(".slider-btn.next");

  let currentIndex = 0;
  let slideWidth = 0;

  /* ===============================
     LOAD DATA PRODUK (AJAX GET)
  =============================== */
  function loadProduk() {
    fetch(API_URL, {
      method: "GET",
      headers: { Accept: "application/json" }
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then(result => {
        console.log("RAW RESULT:", result);

        let data = Array.isArray(result)
          ? result
          : (result.data || []);

        if (!Array.isArray(data) && data && typeof data === "object") {
          data = [data];
        }

        console.log("PARSED DATA:", data);

        if (!data.length) {
          showEmpty();
          return;
        }

        renderProduk(data);
        initSlider();
      })
      .catch(error => {
        console.error("Gagal load produk:", error);
        showError();
      });
  }

  /* ===============================
     RENDER PRODUK KE HTML
  =============================== */
  function renderProduk(data) {
    track.innerHTML = "";

    data.forEach(item => {
      const clone = template.content.cloneNode(true);

      const img = clone.querySelector(".product-img");
      const name = clone.querySelector(".product-name");
      const desc = clone.querySelector(".product-desc");
      const price = clone.querySelector(".product-price");
      const tag = clone.querySelector(".product-tag");
      const btn = clone.querySelector(".product-btn");

      const namaProduk =
        item.nama_produk ||
        item.deskripsi_produk ||
        item.nama_toko ||
        "-";

      const deskripsi =
        item.deskripsi_produk ||
        item.bio_toko ||
        "";

      const harga = item.harga_produk ?? 0;
      const kategori = item.kategori_produk || "";

      const foto = item.gambar_produk
        ? (item.gambar_produk.startsWith("http")
            ? item.gambar_produk
            : `http://103.176.78.29/storage/${item.gambar_produk}`)
        : "fallback.jpg";

      const linkJual = item.link_ecommerce || "#";

      img.src = foto;
      img.alt = namaProduk;

      name.textContent = namaProduk;
      desc.textContent = deskripsi;
      price.textContent = formatRupiah(harga);
      tag.textContent = kategori;

      btn.href = linkJual;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.textContent =
        linkJual && linkJual !== "#"
          ? "Kunjungi Toko"
          : "Lihat Produk";

      track.appendChild(clone);
    });
  }

  /* ===============================
     SLIDER
  =============================== */
  function initSlider() {
    const slides = document.querySelectorAll(".product-slide");
    if (!slides.length) return;

    slideWidth = slides[0].offsetWidth;

    btnNext.onclick = () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        moveSlider();
      }
    };

    btnPrev.onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        moveSlider();
      }
    };
  }

  function moveSlider() {
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }

  /* ===============================
     HELPER
  =============================== */
  function formatRupiah(val) {
    return "Rp " + Number(val).toLocaleString("id-ID");
  }

  function showEmpty() {
    track.innerHTML = `
      <div class="product-slide">
        <article class="product-card">
          <p class="muted">Belum ada produk yang ditampilkan.</p>
        </article>
      </div>
    `;
  }

  function showError() {
    track.innerHTML = `
      <div class="product-slide">
        <article class="product-card">
          <p class="muted">Gagal memuat produk. Coba lagi nanti.</p>
        </article>
      </div>
    `;
  }

  /* ===============================
     INIT
  =============================== */
  loadProduk();

  /* ===============================
     HAMBURGER MENU
  =============================== */
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".topbar-mobile");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("show");
    });
  }
});

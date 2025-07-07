document.addEventListener('DOMContentLoaded', () => {
    
    // BAKAL AMBIL SEMUA ELEMEN DOM

    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const openButton = document.getElementById('open-button');
    const closeButton = document.getElementById('close-button');
    const overlay = document.getElementById('overlay');
    const produkDropdownBtn = document.getElementById('produk-dropdown-btn');
    const produkMenu = document.getElementById('produk-menu');
    const arrowIcon = document.getElementById('arrow-icon');
    const tabs = document.querySelectorAll('.product-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const mainNavItems = [
        document.getElementById('beranda-link'), 
        produkDropdownBtn, 
        document.getElementById('kontak-link')
    ];
    const sections = document.querySelectorAll('section[id]');
    const fadeInElements = document.querySelectorAll('.fade-in-element');

    
    // FUNGSI FUNGSI UTAMA

    function toggleSidebar() {
        if (!sidebar || !overlay || !mainContent) return;
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
        if (sidebar.classList.contains('-translate-x-full')) {
            mainContent.classList.remove('md:ml-80');
        } else {
            mainContent.classList.add('md:ml-80');
        }
    }

    function createProductCard(produk) {
        const waText = encodeURIComponent(`Halo, saya ingin bertanya tentang ${produk.nama}`);
        const waLink = `https://wa.me/6282127920930?text=${waText}`;
        return `<div class="w-full sm:w-64 md:w-72 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"><img src="${produk.gambarUrl}" alt="${produk.nama}" class="w-full h-48 object-cover" loading="lazy"><div class="p-6 flex flex-col flex-grow"><h4 class="text-xl font-bold mb-2 text-gray-800">${produk.nama}</h4><p class="text-gray-600 text-sm mb-4 flex-grow">${produk.deskripsi}</p><a href="${waLink}" target="_blank" class="btn btn-biru mt-auto text-center">Info Detail</a></div></div>`;
    }

    function renderProducts(allProducts, kategori) {
        const container = document.getElementById(`grid-${kategori}`);
        if (!container) return;
        const filteredProducts = allProducts.filter(p => p.kategori === kategori);
        container.innerHTML = '';
        filteredProducts.forEach(produk => {
            container.innerHTML += createProductCard(produk);
        });
    }
    
    function setActiveLink(activeElement) {
        if (!activeElement) return;
        mainNavItems.forEach(item => {
            if(item) {
                item.classList.remove('bg-blue-700');
                item.classList.add('hover:bg-blue-700');
            }
        });
        activeElement.classList.add('bg-blue-700');
        activeElement.classList.remove('hover:bg-blue-700');
    }

    
    // INISIALISASI & EVENT LISTENERS
    

    // Setup event listener
    openButton.addEventListener('click', toggleSidebar);
    closeButton.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    produkDropdownBtn.addEventListener('click', () => {
        produkMenu.classList.toggle('hidden');
        arrowIcon.classList.toggle('rotate-180');
    });

    // Bakal memuat produk dari JSON
    fetch('produk.json')
        .then(response => response.json())
        .then(productsData => {
            const categories = [...new Set(productsData.map(p => p.kategori))];
            categories.forEach(category => renderProducts(productsData, category));
        })
        .catch(error => console.error("Gagal memuat data produk:", error));
    
    // Setup sistem Tab
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active-tab'));
            tab.classList.add('active-tab');
            const targetPaneId = tab.getAttribute('data-tab');
            tabPanes.forEach(pane => {
                pane.id === targetPaneId ? pane.classList.remove('hidden') : pane.classList.add('hidden');
            });
        });
    });

    // Setup bakal semua link navigasi di sidebar
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Logika untuk link biasa
            if (link.id === 'beranda-link' || link.id === 'kontak-link') {
                setActiveLink(link);
            }
            // Logika untuk link produk
            const targetTabName = link.getAttribute('data-tab');
            if (targetTabName) {
                const targetTabButton = document.querySelector(`.product-tab[data-tab='${targetTabName}']`);
                if (targetTabButton) targetTabButton.click();
                setActiveLink(produkDropdownBtn);
            }
            // Logika auto-tutup sidebar
            if (!sidebar.classList.contains('-translate-x-full')) {
                toggleSidebar();
            }
        });
    });

    // Observer untuk animasi fade-in
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    fadeInElements.forEach(element => fadeInObserver.observe(element));

    // Observer untuk navigasi aktif saat scroll
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (id === 'products') {
                    setActiveLink(produkDropdownBtn);
                } else if (correspondingLink) {
                    setActiveLink(correspondingLink);
                }
            }
        });
    }, { rootMargin: '0px 0px -75% 0px' });
    sections.forEach(section => navObserver.observe(section));

});


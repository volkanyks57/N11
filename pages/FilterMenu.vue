<template>
    <div class="d-flex justify-content-start">
        <div class="sidebar-container position-relative shadow p-2 mt-5 ms-5">
            <!-- Sidebar içeriği -->
            <!-- Arama Çubuğu -->
            <div class="input-group mb-3">
                <span class="input-group-text search-icon">
                    <i class="bi bi-search"></i>
                </span>
                <input type="text" class="form-control" placeholder="Sonuçlarda Ara" v-model="searchQuery" />
            </div>

            <!-- Kategoriler -->
            <section class="dropdown-section">
                <button class="btn dropdown-toggle custom-btn w-100" type="button"
                    @click="toggleDropdown('categories')">
                    Kategoriler
                </button>
                <ul v-if="isCategoriesOpen" class="dropdown-menu w-100 open-menu">
                    <li v-for="(subcategories, category) in categories" :key="category">
                        <a href="#" class="category-link">
                            {{ category }}
                        </a>
                        <ul>
                            <li v-for="subcategory in subcategories" :key="subcategory">
                                <a href="#" class="category-link">
                                    {{ subcategory }}
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </section>

            <!-- Kampanya ve İndirimler -->
            <section class="dropdown-section">
                <button class="btn dropdown-toggle custom-btn w-100" type="button" @click="toggleDropdown('discounts')">
                    Kampanya ve İndirimler
                </button>
                <ul v-if="isDiscountsOpen" class="dropdown-menu w-100 open-menu">
                    <li v-for="discount in discounts" :key="discount">
                        <label>
                            <input type="checkbox" v-model="selectedDiscounts" :value="discount"
                                class="form-check-input me-2" />
                            {{ discount }}
                        </label>
                    </li>
                </ul>
            </section>

            <!-- Fiyat Aralığı -->
            <section class="price-range-section">
                <h6>Fiyat Aralığı</h6>
                <div class="input-group">
                    <input type="number" class="form-control" v-model="priceRange.min" placeholder="En Az" />
                    <span class="input-group-text line">-</span>
                    <input type="number" class="form-control" v-model="priceRange.max" placeholder="En Çok" />
                    <div class="confirm-box">
                        <i class="bi bi-check"></i>
                    </div>
                </div>
            </section>

            <!-- Mağaza Puanı (Slider Bileşeni) -->
            <section class="slider-section">
                <h6>Mağaza Puanı</h6>
                <div class="slider-container">
                    <div class="d-flex align-items-center justify-content-between">
                        <span>0</span>
                        <input id="store-rating" type="range" class="form-range" min="0" max="10" step="1"
                            v-model="storeRating" />
                        <span>10</span>
                    </div>
                    <p class="text-end">{{ storeRatingText }}</p>
                </div>
            </section>

            <!-- Markalar -->
            <section class="dropdown-section">
                <button class="btn dropdown-toggle custom-btn w-100" type="button" @click="toggleDropdown('brands')">
                    Marka
                </button>
                <ul v-if="isBrandsOpen" class="dropdown-menu w-100 open-menu">
                    <!-- Marka Arama Çubuğu -->
                    <div class="input-group mb-3 fixed-search-bar">
                        <input type="text" class="form-control" placeholder="Marka Ara" v-model="brandSearchQuery" />
                    </div>

                    <!-- Dikey Slider -->
                    <div class="brands-slider-container">
                        <li v-for="brand in filteredBrands" :key="brand" class="dropdown-item">
                            <label>
                                <input type="checkbox" v-model="selectedBrands" :value="brand"
                                    class="form-check-input me-2" />
                                {{ brand }}
                            </label>
                        </li>
                    </div>
                </ul>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default defineComponent({
    name: "SidebarFilter",
    setup() {
        const db = getFirestore();

        // Veriler
        const categories = ref<Record<string, string[]>>({});
        const brands = ref<string[]>([]);
        const discounts = ref<string[]>([]);

        const selectedCategories = ref<string[]>([]);
        const selectedBrands = ref<string[]>([]);
        const selectedDiscounts = ref<string[]>([]);
        const priceRange = ref({ min: null as number | null, max: null as number | null });
        const storeRating = ref(0); // Slider için varsayılan puan
        const searchQuery = ref("");
        const brandSearchQuery = ref("");

        // Slider alt metni için dinamik içerik
        const storeRatingText = computed(() => {
            if (storeRating.value === 0) {
                return "Tüm mağazalar";
            } else if (storeRating.value === 10) {
                return "10 puanlı mağazalar";
            } else {
                return `${storeRating.value} puan ve üzeri`;
            }
        });

        // Menülerin açılma durumu
        const isCategoriesOpen = ref(true);
        const isBrandsOpen = ref(true);
        const isDiscountsOpen = ref(false);

        const toggleDropdown = (dropdownName: string) => {
            if (dropdownName === "categories") {
                isCategoriesOpen.value = !isCategoriesOpen.value;
            } else if (dropdownName === "brands") {
                isBrandsOpen.value = !isBrandsOpen.value;
            } else if (dropdownName === "discounts") {
                isDiscountsOpen.value = !isDiscountsOpen.value;
            }
        };

        // Firestore'dan verileri çekme
        const fetchFirestoreData = async () => {
            try {
                // Kategoriler
                const categoriesDoc = await getDoc(doc(db, "FilterMenu", "Kategoriler"));
                if (categoriesDoc.exists()) {
                    categories.value = categoriesDoc.data().Elektronik || {};
                }

                // Kampanya ve İndirimler
                const discountsDoc = await getDoc(doc(db, "FilterMenu", "Kampanya"));
                if (discountsDoc.exists()) {
                    discounts.value = discountsDoc.data().Kampanya;
                }

                // Markalar
                const brandsDoc = await getDoc(doc(db, "FilterMenu", "Markalar"));
                if (brandsDoc.exists()) {
                    brands.value = brandsDoc.data().Markalar || [];
                }
            } catch (error) {
                console.error("Firestore verileri çekilirken hata oluştu:", error);
            }
        };

        onMounted(() => {
            fetchFirestoreData();
        });

        const filteredCategories = computed(() => {
            if (!searchQuery.value) {
                return categories.value;
            }
            const result: Record<string, string[]> = {};
            for (const [key, value] of Object.entries(categories.value)) {
                const filtered = value.filter(subcategory =>
                    subcategory.toLowerCase().includes(searchQuery.value.toLowerCase())
                );
                if (filtered.length) {
                    result[key] = filtered;
                }
            }
            return result;
        });

        const filteredBrands = computed(() => {
            if (!brandSearchQuery.value) {
                return brands.value;
            }
            return brands.value.filter(brand =>
                brand.toLowerCase().includes(brandSearchQuery.value.toLowerCase())
            );
        });

        return {
            categories,
            brands,
            selectedCategories,
            selectedBrands,
            priceRange,
            storeRating,
            storeRatingText,
            isCategoriesOpen,
            isBrandsOpen,
            toggleDropdown,
            searchQuery,
            filteredCategories,
            discounts,
            selectedDiscounts,
            isDiscountsOpen,
            brandSearchQuery,
            filteredBrands,
        };
    },
});
</script>

<style scoped>
.sidebar-container {
    width: 250px;
    background-color: #f8f9fa;
    border-right: 1px solid #dee2e6;
    padding: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    height: calc(100vh - 2rem);
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.search-section {
    margin-bottom: 20px;
}

.dropdown-section {
    margin-bottom: 20px;
}

/* Dropdown düzeni */
.dropdown-menu {
    position: relative;
    display: block;
    background-color: white;
    border-left: none;
    border-right: none;
    border-top: 1px solid #dee2e6;
    border-bottom: 1px solid #dee2e6;
}

/* Custom dropdown button */
.custom-btn {
    background-color: white !important;
    color: #495057;
    border: 1px solid #dee2e6 !important;
    border-left: none !important;
    border-right: none !important;
    box-shadow: none !important;
    font-weight: bold;
    text-align: start;
}

.category-link {
    display: block;
    text-decoration: none;
    color: #495057;
    padding: 5px 0;
    font-weight: bold;
}

.category-link:hover {
    text-decoration: underline;
    color: #343a40;
}

.sub-menu {
    max-height: 200px;
    overflow-y: auto;
    padding: 5px;
    display: flex;
    flex-direction: column;
}

.sub-menu-item {
    text-decoration: none;
    color: #495057;
    padding: 5px 0;
}

.sub-menu-item:hover {
    text-decoration: underline;
    color: #343a40;
}

.price-range-section {
    margin-top: 20px;
    margin-bottom: 20px;
}

.input-group {
    display: flex;
    align-items: center;
}

.input-group-text {
    padding: 0.375rem 0.75rem;
    background-color: #f8f9fa;
    border-right: 1px solid #dee2e6;
}

.input-group-text.line {
    padding: 0.375rem 0.75rem;
    background-color: #f8f9fa;
    border-right: 1px solid #dee2e6;
    border: 0
}

.input-group.mb-3 {
    margin-bottom: 10px;
}

.input-group .form-control {
    font-size: 14px;
}

input[type="number"] {
    flex: 1;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Arama çubuğundaki ikon düzeni */
.input-group .search-icon {
    padding: 0.375rem 0.75rem;
    background-color: #f8f9fa;
    border-right: 1px solid #dee2e6;
    cursor: pointer;
}

.input-group .search-icon i {
    font-size: 18px;
    color: #495057;
}

/* Onay kutusu */
.confirm-box {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e9ecef;
    /* Deaktif arka plan */
    color: #ffffff !important;
    /* Tik işareti her zaman beyaz */
    border: 1px solid #dee2e6;
    border-radius: 10px;
    font-size: 16px;
    width: 50px;
    height: 38px;
    /* Input kutularına hizalı */
    transition: background-color 0.3s ease;
    cursor: pointer;
}

.confirm-box.active {
    background-color: #6f42c1;
    /* Aktif durumda mor arka plan */
}

.confirm-box:hover {
    background-color: #6f42c1;
    /* Hover'da mor renk */
}

.confirm-box i {
    font-size: 20px;
    color: #ffffff;
    /* Her durumda beyaz */
}

.sidebar-container {
    width: 250px;
    /* Menü genişliği */
    background-color: #f8f9fa;
    border-right: 1px solid #dee2e6;
    padding: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    height: 100vh;
    /* Ekran yüksekliğine sabitler */
    overflow-y: auto;
    /* Dikey kaydırmayı etkinleştirir */
    position: fixed;
    /* Menüyü sabitler, sayfa kaydığında yerinde kalır */
    top: 0;
    left: 0;
    z-index: 1000;
    /* Gerekirse diğer içeriklerin üzerinde gösterir */
}


.sidebar-container::-webkit-scrollbar {
    width: 10px;
}

.sidebar-container::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.sidebar-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.open-menu {
    display: block;
}

.form-check-input {
    margin-right: 10px;
}

.slider-container {
    margin-top: 10px;
}

/* Slider kapsayıcısı */
.brands-slider-container {
    max-height: 200px;
    /* Slider yüksekliği */
    overflow-y: auto;
    /* Dikey kaydırma */
    border-top: 1px solid #dee2e6;
    /* Arama çubuğu ile ayrım */
    padding: 5px;
}

/* Sabit arama çubuğu */
.fixed-search-bar {
    position: sticky;
    /* Sabit konumlandırma */
    top: 0;
    /* Yukarıya sabitle */
    background-color: white;
    /* Arka plan rengi */
    z-index: 1;
    /* Üstte görünecek şekilde katman oluştur */
    padding: 5px;
    border-bottom: 1px solid #dee2e6;
    /* Slider ile görsel ayrım */
}

/* Kaydırma çubuğu özelleştirme */
.brands-slider-container::-webkit-scrollbar {
    width: 8px;
    /* Kaydırma çubuğu genişliği */
}

.brands-slider-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    /* Arka plan rengi */
}

.brands-slider-container::-webkit-scrollbar-thumb {
    background: #888;
    /* Kaydırma çubuğu rengi */
    border-radius: 4px;
}

.brands-slider-container::-webkit-scrollbar-thumb:hover {
    background: #555;
    /* Kaydırma çubuğu hover rengi */
}

.slider-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
    /* Liste öğeleri arasındaki boşluk */
}
</style>

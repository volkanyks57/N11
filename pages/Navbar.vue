<template>
  <div class="main-container">
    <!-- Üst Container -->
    <div class="upper-container d-flex align-items-center justify-content-between">
      <!-- Logo -->
      <a class="navbar-brand text-white fw-bold" href="#">
        <img
          src="https://n11scdn.akamaized.net/a1/org/24/11/08/47/65/48/85/00/61/13/42/02/98490134802964002749.svg"
          width="258"
          height="42"
          alt="hayat sana gelir"
          style="position: static;"
        />
      </a>

      <!-- Search Bar -->
      <div class="search-container">
        <div class="input-group">
          <!-- Arama ikonu -->
          <button class="input-group-text search-icon" @click="onSearchClick">
            <i class="bi bi-search"></i>
          </button>
          <!-- Arama çubuğu -->
          <input
            type="text"
            class="form-control search-bar"
            placeholder="Ürün, kategori, marka ara"
            v-model="searchQuery"
          />
          <!-- Çarpı ikonu -->
          <button
            class="input-group-text clear-icon"
            v-if="searchQuery"
            @click="clearSearch"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <!-- Adres ve Sepet -->
      <div class="d-flex align-items-center account-container">
        <a href="#" class="text-white me-4 d-flex align-items-center">
          <i class="bi bi-geo-alt me-1"></i>
          <span>Teslimat Adresi </span>
        </a>
      </div>

      <router-link to="/ShoppingCart" class="text-white me-4 d-flex align-items-center">
        <i class="bi bi-cart me-1"></i>
        <span></span>
      </router-link>

      <div class="d-flex flex-column align-items-start">
        <span class="text-white">Hesabım</span>
        <router-link to="/login" class="small text-decoration-underline text-white">
          Üye Ol · Giriş Yap
        </router-link>
      </div>
    </div>

    <!-- Alt Container (Dropdown Menü) -->
    <div class="lower-container d-flex justify-content-center">
      <ul class="d-flex category-list gap-10">
        <li
          v-for="category in categories"
          :key="category.id"
          class="category-item me-4"
          @mouseover="showDropdown(category.id)"
          @mouseleave="hideDropdown"
        >
          <a href="#" class="text-black d-flex align-center">
            <img
              v-if="category.img"
              :src="category.img"
              alt="category.icon"
              class="category-icon"
              :style="{ width: '20px', height: '20px' }"
            />
            {{ category.name }}
          </a>

          <!-- Alt Kategoriler -->
          <div
            class="subcategory-menu"
            v-if="activeDropdown === category.id"
          >
          <div
  v-for="subcategory in category.subcategories"
  :key="subcategory.name"
  class="subcategory-card"
>
  <!-- Router-Link ile sarıldı -->
  <router-link
    :to="`/ProductMenu`"
    class="subcategory-link"
  >
    <img
      class="subcategory-image"
      :src="subcategory.img"
      :alt="subcategory.name"
    />
    <p class="subcategory-name">{{ subcategory.name }}</p>
  </router-link>
</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent, ref, onMounted } from "vue";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface SubCategory {
  name: string;
  img: string;
}

interface Category {
  id: string;
  name: string;
  img?: string;
  subcategories: SubCategory[];
}

export default defineComponent({
  name: "Navbar",
  setup() {
    const categories = ref<Category[]>([]);
    const searchQuery = ref<string>(""); // Arama çubuğu için
    const activeDropdown = ref<string | null>(null); // Aktif dropdown menü

    const db = getFirestore();

    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "Navbar"));
        const categoriesData = await Promise.all(
          categoriesSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const subcategoriesSnapshot = await getDocs(collection(db, `Navbar/${doc.id}/Subcategories`));
            const subcategories = subcategoriesSnapshot.docs.map((subDoc) => subDoc.data() as SubCategory);
            return {
              id: doc.id,
              name: data.name,
              img: data.img,
              subcategories: subcategories,
            };
          })
        );
        categories.value = categoriesData as Category[];
      } catch (error) {
        console.error("Kategoriler alınırken hata oluştu:", error);
      }
    };

    const clearSearch = () => {
      searchQuery.value = "";
    };

    const showDropdown = (categoryId: string) => {
      activeDropdown.value = categoryId;
    };

    const hideDropdown = () => {
      activeDropdown.value = null;
    };

    const onSearchClick = () => {
      // Arama işlemi burada yapılacak
      console.log("Arama yapılıyor:", searchQuery.value);
    };

    const router = useRouter();

    onMounted(fetchCategories);

    return {
      categories,
      searchQuery,
      activeDropdown,
      clearSearch,
      showDropdown,
      hideDropdown,
      onSearchClick,
    };
  },
});
</script>

<style scoped>
/* Ana Container */
.main-container {
  width: 100%;
  background-color: #5E3EBC;
}

/* Üst Container */
.upper-container {
  height: 80px;
  padding: 1px 150px;
  border-bottom: 2px solid #5E3EBC;
}
.navbar-brand {
  display: flex;
  justify-content: flex-end; /* Logoyu sağa hizalar */
}

/* Search Container */
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  height: 48px;
  width: 512px;
  border-style: none;
  max-width: 512px;
}

/* Input Group */
.input-group {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  border-radius: 24px;
  background-color: #ffffff;
  border: 1px solid #ccc;
}

/* Search Bar */
.search-bar {
  height: 48px;
  width: 100%;
  border: none;
  border-color: #5E3EBC;
  outline: none;
  border-radius: 24px;
  padding-left: 48px; /* Sol ikona yer açmak için padding */
  padding-right: 48px; /* Sağ ikona yer açmak için padding */
  font-size: 16px;
  background-color: transparent;
  position: relative; /* Bu satırı ekleyin */
  z-index: 1; /* Z-index değerini düşürün */
}

.search-icon {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  color: #5e3ebc;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2; /* Z-index değerini yükseltin */
}

.clear-icon {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #5e3ebc;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2; /* Z-index değerini yükseltin */
}

/* Alt Container (Dropdown Menü) */
.lower-container {
  height: 45px;
  padding: 5px 40px;
  background-color: #fff;
  border-bottom: 1px solid #444249;
}

.category-list {
  text-align: center;
  list-style: none;
  display: flex;
  padding: 0;
  margin: 3px;
}

.category-item {
  position: relative;
}

.subcategory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0;
  padding: 8px;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 80%;
  left: 0;
  z-index: 10;
  width: 52%;
}

.subcategory-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
  padding: 0;
  background-color: white;
  border-radius: 0;
  border: 0 solid #e0e0e0;
}

.subcategory-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.subcategory-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.subcategory-name {
  font-size: 14px;
  color: #333;
  text-align: center;
}

.subcategory-menu {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  padding: 10px;
  z-index: 20;
  width: 310px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 4px; /* Görsel ve metin arasındaki boşluk */
}

a.text-black {
  display: flex; /* İkon ve metni yan yana hizala */
  align-items: center; /* Dikey olarak ortala */
  font-size: small;
}

.category-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-right: 8px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 10;
  display: block;
}

.dropdown-menu .dropdown-item {
  font-size: 14px;
  padding: 8px 12px;
  white-space: nowrap;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #f1f1f1;
}

/* Linkler */
a {
  text-decoration: none;
  color: inherit;
}

.category-item:hover > a {
  color: #5E3EBC;
}
</style>
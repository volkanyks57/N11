<template>
  <div>
    <!-- Navbar -->
    <Navbar v-if="!isLoginPage" />

    <!-- Sayfa Düzeni -->
    <div class="main-layout">
      <!-- Sol Menü (FilterMenu) -->
      <FilterMenu v-if="isProductMenuPage" class="filter-menu" />

      <!-- Ana İçerik -->
      <div class="main-content">
        <!-- Carousel ve ProductSlider sadece ana sayfada -->
        <Carousel v-if="isHomePage" />
        <ProductSlider v-if="isHomePage" />

        <!-- Sayfa İçeriği -->
        <NuxtPage />
      </div>
    </div>

    <!-- Footer -->
    <Footer v-if="!isLoginPage" />
  </div>
</template>

<script setup lang="ts">
// Gerekli modülleri ve bileşenleri import edin
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../pages/Navbar.vue';
import Carousel from '../pages/Carousel.vue';
import ProductSlider from '../pages/ProductSlider.vue';
import Footer from '../pages/Footer.vue';
import FilterMenu from '../pages/FilterMenu.vue';

// Mevcut route bilgisini alın
const route = useRoute();

// Login sayfasında Navbar ve Footer'ı gizle
const isLoginPage = computed(() => route.path === '/Login');

// Ana sayfa kontrolü
const isHomePage = computed(() => route.path === '/');

// ProductMenu sayfası kontrolü
const isProductMenuPage = computed(() => route.path === '/ProductMenu');
</script>

<style scoped>
/* Sayfa düzeni */
.main-layout {
  display: flex;
}

/* Sol Menü (FilterMenu) */
.filter-menu {
  width: 300px;
  padding: 20px;
  border-right: 1px solid #ddd;
  background-color: #f9f9f9;
}

/* Ana İçerik */
.main-content {
  flex: 1;
  padding: 20px;
}
</style>

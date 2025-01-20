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
        <div v-if="isHomePage" class="col" style="padding-top:1000px"></div>
        <ProductSlider v-if="isHomePage" />
        <div v-if="isHomePage" class="col" style="padding-top:1000px"></div>

        <!-- Sayfa İçeriği -->
        <NuxtPage />
      </div>
    </div>
    <div v-if="isFavoritesPage" class="col" style="padding-top:500px"></div>
    <div v-if="isProductPagePage" class="col" style="padding-top:1000px"></div>
    <div v-if="isProductMenuPage" class="col" style="padding-top:1000px"></div>
    <!-- Footer -->
    <Footer v-if="!isLoginPage" />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '../pages/Navbar.vue';
import Carousel from '../pages/Carousel.vue';
import ProductSlider from '../pages/ProductSlider.vue';
import Footer from '../pages/Footer.vue';
import FilterMenu from '../pages/FilterMenu.vue';
import ProductPage from '../pages/ProductPage.vue';
import Favorites from '../pages/Favorites.vue';

const route = useRoute();
const router = useRouter();

// Login sayfasında Navbar ve Footer'ı gizle
const isLoginPage = computed(() => route.path.toLowerCase() === '/login');

// Ana sayfa kontrolü
const isHomePage = computed(() => route.path === '/');

// ProductMenu sayfası kontrolü
const isProductMenuPage = computed(() => route.path === '/ProductMenu');

const isProductPagePage = computed(() => route.path === '/ProductPage');

const isFavoritesPage = computed(() => route.path === '/Favorites');

// Loglama (sorunu çözmek için geçici)
watchEffect(() => {
  console.log('Current path:', router.currentRoute.value.path);
});
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

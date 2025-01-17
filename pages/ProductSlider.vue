<template>
  <div class="container">
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <!-- Ürün Kartları Konteynırı -->
        <div class="carousel" ref="carousel">
          <div class="product-card position-relative" v-for="(product, index) in visibleProducts" :key="index">
            <!-- Taksit Rozeti -->
            <div class="installment-badge">
              <span class="white-text">9 AYA VARAN</span><br />
              <span class="yellow-text">TAKSİT</span>
            </div>

            <!-- Favori Kalp Simgesi -->
            <button class="favorite-btn" @click="toggleFavorite(index)">
              <i class="bi bi-heart-fill" :class="{ 'text': product.isFavorite }"></i>
            </button>

            <!-- Ürün Görseli -->
            <img :src="product.img" alt="Product Image" />

            <!-- Ürün İçerik Alanı -->
            <div class="product-info">

              <!-- Kargo bilgisi kutusu -->
              <div class="shipping-info">
                <span>{{ product.freeShipping ? 'Ücretsiz Kargo' : '' }}</span>
              </div>
              <!-- Ürün İsmi -->
              <p style="font-size: small;">{{ product.name }}</p>

              <!-- Yıldız ve puan kutusu -->
              <div class="rating-container" v-if="product.isRated">
                <span class="stars">
                  <i class="bi bi-star-fill" v-for="n in product.rating" :key="n" style="color: gold;"></i>
                  <i class="bi bi-star" v-for="n in 5 - product.rating" :key="`empty-${n}`"
                    style="color: lightgray;"></i>
                </span>
                <span class="rating-text">({{ product.rating }})</span>
              </div>
              <!-- Fiyat bilgileri -->
              <div class="price-container">
                <span v-if="product.oldPrice" class="old-price">{{ product.oldPrice }} TL</span>
                <span v-if="product.isInCart" class="basket-info">SEPETTE</span>
                <span class="new-price">{{ product.newPrice }} TL</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Kareler için Slider -->
        <div class="square-slider">
          <div class="square-wrapper" :style="{ transform: `translateX(-${currentSquareIndex * 110}px)` }">
            <router-link v-for="(square, index) in squares" :key="index" :to="`/brand/${encodeURIComponent(square.name)}`">
              <div class="square" :style="{ backgroundImage: `url(${square.image})`, backgroundSize: 'cover' }"></div>
            </router-link>
          </div>

          <!-- Square Okları -->
          <button class="square-nav-btn prev" @click="moveSquareLeft" v-show="currentSquareIndex > 0">
  <i class="bi bi-chevron-compact-right"></i>
</button>

<button class="square-nav-btn next" @click="moveSquareRight"
  v-show="currentSquareIndex < squares.length - visibleSquareCount">
  <i class="bi bi-chevron-compact-right"></i>
</button>
        </div>

        <!-- Carousel Okları -->
        <button @click="moveCarouselLeft" class="carousel-btn prev" v-show="currentIndex > 0">
          <i class="bi bi-chevron-compact-left"></i>
        </button>
        <button @click="moveCarouselRight" class="carousel-btn next"
          v-show="currentIndex < products.length - visibleCount">
          <i class="bi bi-chevron-compact-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();


// Ürünler listesi tipi
interface Product {
  name: string;
  newPrice: number;
  oldPrice?: number;
  freeShipping: boolean;
  img: string;
  isFavorite: boolean;
  isInCart: boolean;
  isRated: boolean;
  rating: number;
}

// Ürünler listesi
const products = ref<Product[]>([]); // Firestore'dan gelen ürünler

const visibleCount = 3;
const currentIndex = ref(0);

// Görünen ürünler
const visibleProducts = computed(() =>
  products.value.slice(currentIndex.value, currentIndex.value + visibleCount)
);

// Sağ ok tuşuna basıldığında ürünleri kaydırma
const moveCarouselRight = () => {
  if (currentIndex.value < products.value.length - visibleCount) {
    currentIndex.value += visibleCount;
  }
};

// Sol ok tuşuna basıldığında ürünleri kaydırma
const moveCarouselLeft = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= visibleCount;
  }
};

// Favori butonuna tıklandığında favori durumunu değiştirme
const toggleFavorite = (index: number) => {
  products.value[index].isFavorite = !products.value[index].isFavorite;
};

// Firestore'dan ürünleri çekme
const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "ProductSlider"));

  querySnapshot.forEach((doc) => {
    const product = doc.data() as Product;  // TypeScript türü belirledik
    products.value.push({
      name: product.name,
      newPrice: product.newPrice,
      oldPrice: product.oldPrice,
      freeShipping: product.freeShipping,
      img: product.img,
      isFavorite: product.isFavorite,
      isInCart: product.isInCart,
      isRated: product.isRated,
      rating: product.rating
    });
  });
};

// Kareler listesi
const squares = ref([
  { name: "The North Face", image: "https://n11scdn.akamaized.net/a1/org/24/11/20/48/64/44/04/41/36/19/11/48/37253582270785238950.png" },
  { name: "Adidas", image: "https://n11scdn.akamaized.net/a1/org/24/08/28/73/91/34/21/20/68/32/78/56/66509412047969732222.png" },
  { name: "Puma", image: "https://n11scdn.akamaized.net/a1/org/24/08/28/83/58/80/39/40/55/78/35/71/88591277121860776001.png" },
  { name: "Converse", image: "https://n11scdn.akamaized.net/a1/org/24/08/28/59/02/14/36/80/75/54/13/73/34106368273431480854.png" },
  { name: "Vans", image: "https://n11scdn.akamaized.net/a1/org/24/08/28/65/66/93/35/03/51/03/34/36/25848653904061837774.png" },
  { name: "Salomon", image: "https://n11scdn.akamaized.net/a1/org/24/11/19/52/58/02/14/63/05/79/74/21/05861319796246820150.png" },
]);

// Slider durumları
const visibleSquareCount = 5; // Aynı anda görünen kare sayısı
const currentSquareIndex = ref<number>(0); // Ref tipi açıkça belirtiliyor

const moveSquareRight = () => {
  if (currentSquareIndex.value < squares.value.length - visibleSquareCount) {
    currentSquareIndex.value++;
  }
};

const moveSquareLeft = () => {
  if (currentSquareIndex.value > 0) {
    currentSquareIndex.value--;
  }
};

// Sayfa yüklendiğinde ürünleri çek
onMounted(() => {
  fetchProducts();
});


</script>


<style scoped>
/* Konteynır düzeni */
.container {
  display: flex;
  justify-content: center;
  padding: 20px;
  flex-direction: column;
  align-items: center;
}

.carousel-container {
  width: 1180px;
  height: 474px;
  overflow: visible;
  position: relative;
  background-image: url('https://n11scdn.akamaized.net/a1/1180_474/24/11/22/60/51/39/13/79/98/12/85/93/95275731850832989703.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* carousel-wrapper'ı dikey flex düzenine getireceğiz */
.carousel-wrapper {
  display: flex;
  /* Flex düzeni kullanıyoruz */
  flex-direction: column;
  /* Ürün kartlarını ve new-container'ı dikeyde hizalayalım */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  gap: 12px;
  /* Kartlar ve new-container arasındaki boşluk */
  justify-content: flex-start;
  /* Ürün kartlarını sola yasla */
  align-items: flex-end;
  /* Ürün kartlarını sağa hizala */
}

/* carousel içerisindeki ürün kartlarını sağa yaslamak için justify-content: flex-end; */
.carousel {
  display: flex;
  /* Yatayda sıralama için flex */
  transition: transform 0.5s ease-in-out;
  width: max-content;
  /* İçeriğe göre genişlik ayarlanır */
  justify-content: flex-end;
  /* Kartları sağa hizala */
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border-radius: 50%;
  border: 2px solid black;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.3s ease;
}

.carousel-btn svg {
  width: 16px;
  height: 16px;
  fill: black;
  /* Ok rengini siyah yap */
}

.carousel-btn.prev {
  left: 580px;
  top: 200px;
}

.carousel-btn.next {
  right: -10px;
  top: 200px;
}

/* Ürün kartları */
.product-card {
  flex: 0 0 182px;
  /* Sabit genişlik, her kart 182px genişliğinde */
  height: 338px;
  /* Sabit yükseklik */
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s ease;
}

/* Ürün kartlarındaki resimler */
.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.new-container {
  position: relative;
  width: 300px;
  /* Görünen karelerin toplam genişliği */
  height: 120px;
  overflow: hidden;
  margin-top: 10px;
}

.new-container h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.new-container p {
  font-size: 1rem;
  color: #555;
}

/* Ürün kartları */
.product-card {
  flex: 0 0 182px;
  /* Sabit genişlik, her kart 182px genişliğinde */
  height: 338px;
  /* Sabit yükseklik */
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s ease;
}

/* Ürün kartlarındaki resimler */
.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

/* Kart içeriği */
.product-info h3 {
  font-size: 1rem;
  margin: 10px 0;
}

.product-info p {
  font-size: 0.9rem;
  margin: 5px 0;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: #f8f9fa;
  /* Açık arka plan */
  border: none;
  border-radius: 50%;
  /* Daire */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.favorite-btn .bi-heart-fill {
  font-size: 20px;
  color: rgb(160, 178, 178);
  /* Varsayılan renk */
  transition: color 0.3s ease;
}

.favorite-btn .bi-heart-fill.text {
  color: blueviolet;
  /* Favori olduğunda kırmızı */
}

/* Karelerin bulunduğu alan */
.square-wrapper {
  display: flex;
  gap: 10px;
  transition: transform 0.5s ease;
}

/* Her bir kare */
.square {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border: 2px solid #000;
  background-color: #ccc;
  border-radius: 50%;
  margin: 4px;
}

/* Kareler için slider */
.square-slider {
  display: flex;
  align-items: center;
  position: relative;
  width: 600px;
  overflow: hidden;
}


/* Kareler için slider okları */
.square-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: 2px solid black;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease;
}

.square-nav-btn svg {
  width: 16px;
  height: 16px;
  fill: black;
}

.square-slider:hover .square-nav-btn {
  opacity: 1;
  /* Hover sırasında görünür */
  visibility: visible;
}

.square-nav-btn.prev {
  left: -60px;
  visibility: visible;
  /* Sol taraf için konum */
}

.square-nav-btn.next {
  right: -10px;
  /* Sağ taraf için konum */
}

/* Sol üst köşe kare */
/* Sol üst köşe kare */
.installment-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 45px;
  height: 45px;
  background-color: #5d3ebc;
  /* Arka plan rengi mor */
  color: white;
  font-size: 0.55rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.1;
  padding: 2px;
}

/* Beyaz metin */
.installment-badge .white-text {
  color: white;
  /* Yazı rengi beyaz */
}

/* Sarı metin */
.installment-badge .yellow-text {
  color: #ffcc00;
  /* Yazı rengi sarı */
}

/* Ürün içeriği */
.product-info {
  text-align: left;
  margin-top: 10px;
}

.product-info h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  /* Fiyat kutusuyla araya boşluk */
  text-align: center;
  /* Merkezi hizalama */
}


.shipping-info {
  background-color: white;
  color: #5d3ebc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: bold;
  font-size: small;
  text-transform: uppercase;
  margin-bottom: 1px;
  text-align: center;
}

/* Yıldız ve puan kutusu */
.rating-container {
  display: flex;
  align-items: center;
  margin: auto;
  /* Üst ve alt boşluk */
  top: auto;
  font-size: small;
}

.stars i {
  font-size: 16px;
  color: #ffc107;
  /* Yıldız rengi: Altın sarısı */
}

.rating-text {
  font-size: 0.9rem;
  color: #616161;
  font-size: x-small;
}

.price-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background-color: white;
  padding: px;
  border-top: 1px solid white;
  height: 30px;
  text-align: left;
  /* Sabit yükseklik */
}

.old-price {
  font-size: small;
  color: #b0bec5;
  margin-bottom: 4px;
  text-decoration: line-through;
}

.old-price del {
  color: #b0bec5;
}

.basket-info {
  font-size: x-small;
  font-weight: bold;
  color: #5d3ebc;
  text-transform: uppercase;
}

.new-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
}
</style>
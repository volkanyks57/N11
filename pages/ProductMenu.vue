<template>
    <div class="container py-4">
        <div class="row g-3 justify-content-center">
            <!-- Ürün Kartları -->
            <div v-for="product in products" :key="product.id"
                class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <!--Ürün Kartı-->
                <div class="product-card d-flex flex-column"
                    style="width: 320px; max-height: 500px; overflow: hidden; background-color: white;">

                    <!-- Üst Parça -->
                    <div class="upper-section position-relative d-flex flex-column align-items-center justify-content-start"
                        style="flex: 2; background-color: #f8f9fa; padding: 10px; position: relative; padding-bottom: 30px;"
                        @mousemove="onMouseMove($event, product.id)" @mouseleave="resetImageIndex(product.id)">

                        <!-- Sol Üst Köşe Görseli -->
                        <img src="https://n11scdn.akamaized.net/a1/org/24/08/09/56/54/60/90/38/45/42/57/19/26040334021026951284.png"
                            alt="Logo" class="position-absolute top-0 start-0 ms-2 mt-2"
                            style="width: 50px; height: 50px;" />

                        <!-- Sağ Üst Köşe Favori Butonu -->
                        <button @click="toggleFavorite(product)"
                            class="btn btn-outline-dark position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center"
                            style="width: 40px; height: 40px; border-radius: 50%; border: .5px solid black; border-color: #1f1f1f;">
                            <i :class="product.isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"
                                :style="{ color: product.isFavorite ? '#5d3ebc' : 'black', fontSize: '20px' }">
                            </i>
                        </button>

                        <!-- Ürün Görselleri -->
                        <img v-for="(image, index) in product.image" :key="index"
                            v-show="product.currentImageIndex === index" :src="image" :alt="product.name"
                            class="product-image"
                            @click="goToProductPage" />

                        <!-- Slider Dots -->
                        <div class="slider-dots position-absolute" style="bottom: 10px;">
                            <span v-for="n in 3" :key="n"
                                :class="['dot', product.currentImageIndex === n - 1 ? 'active' : '']"></span>
                        </div>

                        <!-- Ücretsiz Kargo -->
                        <span v-if="product.freeShipping" class="badge text-center position-absolute"
                            style="font-size: 14px; bottom: 40px; left: 50%; transform: translateX(-50%); color: #5d3ebc;">
                            ÜCRETSİZ KARGO
                        </span>
                    </div>

                    <!-- Alt Parça -->
                    <div class="lower-section d-flex flex-column flex-grow-1 p-2"
                        style="flex: 1; background-color: #fff;">
                        <!-- Ürün İsmi -->
                        <h6 class="product-name m-0 text-truncate" style="font-size: 14px;">
                            {{ product.name }}
                        </h6>
                        <div class="product-rating d-flex align-items-center mt-1">
                            <!-- Yıldızlar -->
                            <span v-for="n in 5" :key="n" class="me-1">
                                <i
                                    :class="n <= Math.floor(product.rating) ? 'text-warning bi bi-star-fill' : 'text-secondary bi bi-star'"></i>
                            </span>
                            <!-- Puan -->
                            <small>({{ product.reviews }})</small>
                        </div>


                        <!-- Alt Fiyat Container -->
                        <div class="price-container d-flex align-items-center justify-content-between mt-auto">
                            <div class="d-flex flex-column">
                                <small v-if="product.oldPrice" class="text-muted"
                                    style="font-size: 14px; text-decoration: line-through">{{ product.oldPrice }}
                                    TL</small>
                                <small v-if="product.oldPrice" class="text-muted"
                                    style="font-size: 13px; font-weight: 700; color: #5d3ebc;">SEPETTE</small>
                                <strong style="font-size: 20px;">{{ product.newPrice }} TL</strong>
                            </div>
                            <!-- Sepete Ekle Butonu -->
                            <button @click="toggleCart(product)"
                                :class="['btn', product.isInCart ? 'btn-success' : 'btn-outline']"
                                :style="product.isInCart ? { backgroundColor: '#5d3ebc', color: 'white' } : {}">
                                {{ product.isInCart ? '✓' : '+' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

// Firestore'u başlat
const db = getFirestore();

export default defineComponent({
  name: "ProductList",
  setup() {
    const products = ref<any[]>([]);

    // Firestore'dan veri çek
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ProductMenu"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          products.value.push({
            id: doc.id,
            image: [data.img1, data.img2, data.img3],
            name: data.name,
            rating: data.rating,
            reviews: data.reviews,
            freeShipping: data.freeShipping,
            oldPrice: data.oldPrice,
            newPrice: data.newPrice,
            isFavorite: data.isFavorite,
            isInCart: data.isInCart,
            currentImageIndex: 0,
          });
        });
      } catch (error) {
        console.error("Firestore'dan veri çekerken bir hata oluştu:", error);
      }
    };

    onMounted(() => {
      fetchProducts();
    });

    // Favorilere ekleme metodu
    const toggleFavorite = async (product: any) => {
      product.isFavorite = !product.isFavorite;

      if (product.isFavorite) {
        try {
          await addDoc(collection(db, "Favorites"), {
            id: product.id,
            name: product.name,
            image: product.image,
            rating: product.rating,
            reviews: product.reviews,
            freeShipping: product.freeShipping,
            oldPrice: product.oldPrice,
            newPrice: product.newPrice,
          });
          console.log(`${product.name} favorilere eklendi.`);
        } catch (error) {
          console.error("Favorilere eklerken bir hata oluştu:", error);
        }
      }
    };

    // Sepete ekleme metodu
    const toggleCart = async (product: any) => {
      product.isInCart = !product.isInCart;

      if (product.isInCart) {
        try {
          await addDoc(collection(db, "ShoppingCart"), {
            id: product.id,
            name: product.name,
            image: product.image,
            rating: product.rating,
            reviews: product.reviews,
            freeShipping: product.freeShipping,
            oldPrice: product.oldPrice,
            newPrice: product.newPrice,
          });
          console.log(`${product.name} sepete eklendi.`);
        } catch (error) {
          console.error("Sepete eklerken bir hata oluştu:", error);
        }
      }
    };

    const onMouseMove = (event: MouseEvent, productId: string) => {
      const product = products.value.find((p) => p.id === productId);
      if (!product) return;

      const target = event.currentTarget as HTMLElement | null;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;

      if (mouseX < rect.width / 3) {
        product.currentImageIndex = 0;
      } else if (mouseX < (2 * rect.width) / 3) {
        product.currentImageIndex = 1;
      } else {
        product.currentImageIndex = 2;
      }
    };

    const resetImageIndex = (productId: string) => {
      const product = products.value.find((p) => p.id === productId);
      if (product) {
        product.currentImageIndex = 0;
      }
    };

    const router = useRouter();

    const goToProductPage = () => {
      router.push(`/ProductPage`); // Herhangi bir ürüne tıklanıldığında aynı sayfaya gider
    };

    return {
      products,
      toggleFavorite,
      toggleCart,
      onMouseMove,
      resetImageIndex,
      goToProductPage,
    };
  },
});
</script>


<style scoped>
.product-card {
    width: 100%;
    max-width: 320px;
    height: auto;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.product-image {
    object-fit: contain;
    border: 0.05px solid #e5e4e6;
    max-width: 100%;
    max-height: 70%;
    display: block;
    margin: auto;
}

.product-image:hover {
    border: none;
}

.product-card:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.product-name:hover {
    text-decoration: underline;
    cursor: pointer;
}

.badge {
    font-size: 14px;
    text-align: center;
}

.btn-outline-dark {
    background-color: transparent;
    border: 2px solid black;
    border-radius: 50%;
    font-size: 24px;
}

.btn-success {
    background-color: #5d3ebc !important;
    border-color: #5d3ebc !important;
    color: white !important;
}

.bi-star-fill {
    font-size: 16px;
}

.bi-star {
    font-size: 16px;
}

.upper-section {
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
    position: relative;
}

.upper-section img.product-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.lower-section {
    padding: 10px;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fff;
}

/* Ücretsiz Kargo Pozisyonu */
.free-shipping {
    font-size: 14px;
    color: #5d3ebc;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
}

/* Slider Dots */
.slider-dots {
    display: flex;
    justify-content: center;
    gap: 5px;
    position: absolute;
    bottom: 10px;
    width: 100%;
}

.slider-dots .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: background-color 0.3s;
}

.slider-dots .dot.active {
    background-color: #5d3ebc;
}

.btn-outline {
    border-color: #5d3ebc;
}
</style>
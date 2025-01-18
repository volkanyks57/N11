<template>
  <div v-if="product" class="container" style="width: 1188px; height: 714px;">
    <div class="row h-100">
      <!-- Sol Bölüm: Görsel Büyüteç -->
      <div class="col-4" id="magnifier-container" style="width: 400px; height: 658px;">
        <div id="magnifier-main-image" class="image-container" @mousemove="magnifyImage" @mouseleave="resetMagnify"
          style="height: 569px; position: relative; overflow: hidden;">
          <img :src="selectedImage || product.mainImage" alt="Large View" class="image magnify-cursor" ref="magnifyImg"
            style="width: 100%; height: 100%; transition: transform 0.3s;" />
          />
        </div>
        <div id="magnifier-thumbnails" class="d-flex flex-wrap mt-2 align-items-start">
          <div v-for="(image, index) in product.images" :key="index" class="thumbnail-container"
            :class="{ 'selected-thumbnail': selectedImage === image }" @click="selectImage(image)">
            <img :src="image" alt="Thumbnail" class="thumbnail" />
          </div>
        </div>
      </div>
      <!-- Orta Bölüm: Dinamik İçerik -->
      <div class="col-4" id="dynamic-content-container" style="width: 509px; height: 534px;">
        <div id="dynamic-content-header"
          style="height: 52px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 20px; font-weight: 600;">{{ product.title }}</span>
        </div>
        <div id="dynamic-content-rating"
          style="height: 18px; display: flex; align-items: center; padding: 0 10px; font-size: 14px;">
          <span class="me-2">
            <i v-for="star in totalStars" :key="star" class="bi bi-star-fill"
              :class="{ 'text-warning': star <= product.rating, 'text-muted': star > product.rating }"></i>
          </span>
          <span class="me-2">{{ product.rating }}</span>
          <span class="me-2">|</span>
          <a href="#" style="text-decoration: none; color: #5d3ebc;" class="me-2">637 Değerlendirme</a>
          <a href="https://www.example.com">
            <i class="bi bi-camera" style="color: #007bff;"></i>
          </a>
        </div>

        <!-- Fiyat Konteynırı Düzenleme (Yatay Bölünme) -->
        <div id="dynamic-content-price" style="height: 169px; display: flex; flex-direction: column;">
          <!-- İlk Parça (509x134) -->
          <div id="dynamic-content-price-top" style="height: 134px; width: 509px; display: flex;">
            <!-- İlk Parçayı Dikeyde Bölme -->
            <div style="height: 134px; width: 350px; display: flex; flex-direction: column; justify-content: flex-end;">
              <!-- İlk Parçayı Yatayda Bölme -->
              <div style="font-size: 20px; font-weight: bold;">{{ product.price.toLocaleString('tr-TR') }} TL</div>
              <div style="height: 18px; width: 350px;">
                <span class="text-credit" style="
         font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
         font-size: 13px; "><a href="#" style="color: black; text-decoration: none;"><i
                      class="bi bi-stack"></i>1.212,04 TL x 36 ay alışveriş kredisi seçeneği ile</a></span>
              </div>
            </div>

            <!-- Yeni Container İçeriği -->
            <div style="height: 134px; width: 135px; display: flex; justify-content: center; align-items: center;">
              <div
                style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; width: 100%; font-size: 12px;">
                <!-- İlk Bölüm -->
                <button id="heart-button" class="icon-button">
                  <i class="bi bi-heart"></i>
                </button>
                <!-- İkinci Bölüm -->
                <button id="add-list-button" class="icon-button">
                  <i class="bi bi-list"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- İkinci Parça (509x35) -->
          <div id="dynamic-content-price-bottom" style="height: 35px; width: 485px; background-color: #f2f0fa;">
            <span class="text-kazan"><i class="bi bi-star-fill"></i>Bu üründen <strong>50 UçUç Puan</strong>
              kazanabilirsin.</span>
          </div>
        </div>

        <!-- Detay Bölümü-->
        <div id="dynamic-content-detail"
          style="height: 83px; display: flex; align-items: center; padding: 0 8px; gap: 4px;">
          <!-- İlk Parça -->
          <div
            style="display: flex; align-items: center; border: 0.5px solid #5d3ebc; border-radius: 5px; padding: 4px; gap: 8px;">
            <a href="#" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
              <img
                src="https://n11scdn.akamaized.net/a1/org/24/03/05/52/78/44/09/64/01/29/18/67/95955958109827153085.png"
                alt="İthalatçı Garantili" style="height: 40px;">
              <div style="font-size: 12px; color: white; text-align: center;">
                <span style="display: block; color: #5d3ebc;">İthalatçı</span>
                <span style="display: block; color: #5d3ebc;">Garantili</span>
              </div>
              <span style="font-size: 20px; color: #5d3ebc;">&gt;</span>
            </a>
          </div>

          <!-- İkinci Parça -->
          <div
            style="display: flex; align-items: center; border: 0.5px solid #d3d6df; border-radius: 5px; padding: 4px;">
            <a href="#" style="text-decoration: none; text-align: center;">
              <span style="display: block; font-size: 12px; color: #bfbfbf;">Marka</span>
              <span style="display: block; font-size: 14px; color: black;">Sony</span>
            </a>
          </div>

          <!-- Üçüncü Parça -->
          <div
            style="display: flex; align-items: center; border: 0.5px solid #d3d6df; border-radius: 5px; padding: 4px;">
            <a href="#" style="text-decoration: none; text-align: center;">
              <span style="display: block; font-size: 12px; color: #bfbfbf;">Kol Sayısı</span>
              <span style="display: block; font-size: 14px; color: black;">1</span>
            </a>
          </div>

          <!-- Dördüncü Parça -->
          <div
            style="display: flex; align-items: center; border: 0.5px solid #d3d6df;  border-radius: 5px; padding: 4px;">
            <a href="#" style="text-decoration: none; text-align: center;">
              <span style="display: block; font-size: 12px; color: #bfbfbf;">Disk Yuvası</span>
              <span style="display: block; font-size: 14px; color: black;">Dijital</span>
            </a>
          </div>
        </div>


        <!-- Sepete Ekle Butonu -->
        <div id="dynamic-content-addBasket"
          style="height: 48px; background-color: #5d3ebc; display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 5px;">
          <span style="color: white; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif;">
            <i class="bi bi-plus"></i> Sepete Ekle
          </span>
        </div>

        <div id="dynamic-content-cargo" style="height: 156px; border: 1px solid #d3d6df; margin-top: 16px;">
          <!-- Yeni Konteynır -->
          <div
            style="width: 100%; height: 138px; background-color: white; padding: 10px; box-sizing: border-box; border: 1px solid #d3d6df; border-top: none; border-bottom: none;">
            <!-- Başlık -->
            <h5 style="width: 100%; height: 37px; font-size: 16px; font-weight: bold; margin: 0;">Kargo Bilgileri</h5>
            <!-- Alt İçerik -->
            <div style="width: 100%; height: 60px; margin-top: 10px;">
              <!-- Kargo Bilgisi ve Aracı -->
              <div
                style="width: 100%; height: 21px; display: flex; align-items: center; gap: 8px; border-top: 1px solid #d3d6df; padding-top: 8px;">
                <span><i class="bi bi-truck"></i></span>
                <span style="font-size: 14px; color: black;">Sendeo Kargo - <strong>Ücretsiz Kargo</strong></span>
              </div>
              <!-- Kargo Bilgi Paragrafı -->
              <p style="font-size: 12px; color: #555; margin-top: 8px; margin-bottom: 4px;">En geç 9 Ocak Perşembe günü
                kargoya verilir.</p>
              <!-- Detay Bilgisi -->
              <span style="font-size: 12px; color: #5d3ebc; text-decoration: none; cursor: pointer;">
                <a href="#" style="text-decoration: none; color: #5d3ebc;">Tüm Detayları Gör ></a>
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- Sağ Bölüm: Ek Detaylar -->
      <div class="col-4" id="additional-details-container" style="width: 225px; height: 351px;">
        <!-- Additional Details Header -->
        <div id="additional-details-header" style="position: center; height: 91px; background-color: #f5f5f5; margin-bottom: 100px">
          <div class="inner-box"
            style="position: absolute; top: 16px; left: 16px; right: 16px; height: 59px; display: flex; flex-direction: column; padding: 8px; box-sizing: border-box;">
            <!-- İlk Parça -->
            <div style="flex: 1; display: flex; align-items: center; justify-content: space-between;">
              <span style="cursor: pointer; color: #5d3ebc; font-size: 14px;">B-T-Teknoloji
              </span>
              <span
                style="background-color: green; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">10.0</span>
            </div>
            <!-- İkinci Parça -->
            <div
              style="flex: 1; display: flex; align-items: center; justify-content: start; gap: 8px; margin-top: 4px;">
              <i class="bi bi-pencil" style="font-size: 16px; color: #5d3ebc;"></i>
              <a href="#" style="text-decoration: none; font-size: 13px; color: #5d3ebc; cursor: pointer;">Mağazaya
                Sor</a>
            </div>
          </div>
        </div>
        <div id="additional-details-body" style="height: 228px; display: flex; flex-direction: column;">
          <!-- İlk Kutucuk -->
          <div
            style="height: 20%; background-color: #f5f5f5; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; color: white;">
            <span style="font-size: 14px; color: #1f1f1f; font-weight: 600;">Diğer Mağazalar</span>
            <a href="#" style="text-decoration: none; font-size: 14px; color: #5d3ebc; cursor: pointer;">Tümü (5)</a>
          </div>
          <!-- İkinci Kutucuk -->
          <div
            style="height: 80%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #d3d6df">
            <div id="other"
              style="width: 192px; height: 151px; background-color: white; ; display: flex; flex-direction: column;">
              <!-- Yatayda Üç Parça -->
              <div style="flex: 1; display: flex; align-items: center; justify-content: space-between;">
                <span style="cursor: pointer; color: black; font-size: 14px;"><strong>Techburada</strong></span>
                <span
                  style="background-color: green; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">10.0</span>
              </div>
              <div style="flex: 1;">
                <a href="#" style="text-decoration: none;">
                  <span style="color: #1f1f1f; font-size: small;">
                    Aras Kargo -
                    <span style="color: #5d3ebc;">Ücretsiz Kargo</span>
                    <br> 8 Ocak Çarşamba Günü Kargoda
                  </span>
                </a>
              </div>
              <div style="flex: 1; display: flex; align-items: flex-end; justify-content: flex-start; padding: 4px;">
                <span><strong>20.979 TL</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default defineComponent({
  name: "ContainerComponent",
  setup() {
    // Ürün veri yapısı
    interface Product {
      description: string;
      images: string[];
      mainImage: string;
      price: number;
      rating: number;
      reviewsCount: number;
      shipping: {
        deliveryDate: Date;
        provider: string;
        relatedStores: string[];
        type: string;
      };
      title: string;
    }

    const product = ref<Product | null>(null);
    const images = ref<string[]>([]);
    const selectedImage = ref(product.value ? product.value.mainImage : "");

    const fetchProduct = async () => {
      const db = getFirestore(); // Firestore erişimi
      const docRef = doc(db, "products", "ps5-slim-1tb-digital");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        product.value = {
          description: data.description,
          images: data.images,
          mainImage: data.mainImage,
          price: data.price,
          rating: data.rating,
          reviewsCount: data.reviewsCount,
          shipping: {
            deliveryDate: data.shipping.deliveryDate.toDate(), // Timestamp'ten Date'e dönüştür
            provider: data.shipping.provider,
            relatedStores: data.shipping.relatedStores,
            type: data.shipping.type,
          },
          title: data.title,
        };
        selectedImage.value = data.mainImage;
      } else {
        console.error("Belirtilen belge bulunamadı.");
      }
    };

    onMounted(() => {
      fetchProduct();
    });

    const selectImage = (image: string) => {
      selectedImage.value = image;
    };

    // Büyüteç etkisi
    const magnifyImage = (event: MouseEvent) => {
      const img = document.querySelector(".image") as HTMLImageElement;
      if (!img) return;

      const rect = img.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
      img.style.transform = "scale(1.5)";
    };

    const resetMagnify = () => {
      const img = document.querySelector(".image") as HTMLImageElement;
      if (img) img.style.transform = "scale(1)";
    };

    return {
      images,
      selectedImage,
      selectImage,
      magnifyImage,
      resetMagnify,
      totalStars: [1, 2, 3, 4, 5],
      rating: 5,
      product,
    };
  },
});
</script>

<style scoped>
.thumbnail-container {
  margin-right: 3px;
}

.thumbnail {
  width: 60px;
  height: 80px;
  border: 2px solid gray;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s;
  margin: 5px;
}

.selected-thumbnail .thumbnail {
  border-color: #5d3ebc;
}

.thumbnail:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.magnify-cursor {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='blue' viewBox='0 0 16 16'%3E%3Cpath d='M8.5 1v6.5H15v1H8.5V15h-1V8.5H1v-1h6.5V1h1z'/%3E%3C/svg%3E"), auto;
}

#dynamic-content-rating {
  line-height: 18px;
}

#dynamic-content-rating i {
  font-size: 16px;
}

.text-credit {
  position: relative;
  top: 0;
}

.text-kazan {
  font-size: 13px;
}

.icon-button {
  background-color: transparent;
  border: 0.5px solid black;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
}

.icon-button i {
  transition: color 0.3s ease;
  font-size: 20px;
}

#heart-button:hover i {
  color: #5d3ebc;
  transform: scale(1.2);
}

/* Add New List İkonu */
#add-list-button i {
  color: black;
}

#add-list-button:hover i {
  color: #5d3ebc;
  transform: rotate(180deg);
}

#dynamic-content-addBasket:hover {
  background-color: #3c27a0;
  transition: background-color 0.3s ease;
}

#additional-details-header {
  position: relative;
  padding: 16px;
  box-sizing: border-box;
}

.inner-box {
  width: 170px;
  height: 59px;
  background-color: #f5f5f5;
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  box-sizing: border-box;
}
</style>
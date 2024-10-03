<template>
  <div class="container">
    <div v-if="searchKeyword" class="search-text">
      {{
        isSearching
          ? `Searching for "${searchKeyword}"`
          : `Search Results for "${searchKeyword}"`
      }}
    </div>
    <div>
      <form class="relative">
        <input
          v-model="searchKeyword"
          v-debounce:500ms="searchTriggered"
          class="search-bar"
          type="text"
          placeholder="Search for photo"
        />
      </form>
    </div>
  </div>

  <div class="grid-wrapper">
    <div class="photo-grid">
      <template v-if="isLoading">
        <ClientOnly>
          <div
            v-for="n in 8"
            :key="`shimmer-${n}`"
            class="photo-card shimmer"
          />
        </ClientOnly>
      </template>
      <template v-else>
        <div
          v-for="photo in photos"
          :key="photo.id + Date.now()"
          class="photo-card"
        >
          <img
            @click.stop.prevent="openModal(photo)"
            :src="photo.urls.regular"
            :alt="photo.alt_description"
          />
          <div class="photo-info">
            <h3>{{ photo.user.name || "Unknown" }}</h3>
            <p>{{ photo.user.location || "Location unknown" }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>

  <!-- Asset Modal -->
  <transition name="fade">
    <div v-if="isModalOpen" class="modal show" @click.stop="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <img
          :src="selectedPhoto?.urls.regular"
          :alt="selectedPhoto?.alt_description"
        />
        <div class="modal-info">
          <h3>{{ selectedPhoto?.user.name || "Unknown" }}</h3>
          <p>{{ selectedPhoto?.user.location || "Location unknown" }}</p>
        </div>
      </div>
    </div>
  </transition>

  <div class="search-text" v-if="!isLoading && !photos.length">No Results</div>
</template>

<script setup lang="ts">
const { vDebounce } = useDirectives();

const config = useRuntimeConfig();
const searchKeyword = ref("");
const isSearching = ref(false);
const photos = ref<Record<string, any>[]>([]);
const isModalOpen = ref(false);
const selectedPhoto = ref(null);
const isLoading = ref(true);

const initialQuery = { query: "african", per_page: 8, order_by: "latest" };

const fetchPhotos = async (queryObj: Record<string, any> = initialQuery) => {
  isLoading.value = true;
  const { data } = await useFetch(`${config.public.baseURL}/search/photos`, {
    headers: {
      Authorization: `Client-ID ${config.public.accessKey}`,
    },
    query: { ...queryObj },
  });
  photos.value = data.value.results;
  isLoading.value = false;
};

const searchPhotos = async (query: string) => {
  isSearching.value = true;
  isLoading.value = true;

  await fetchPhotos({ query: query });
  isSearching.value = false;
  isLoading.value = false;
};

const searchTriggered = (searchKey: string) => {
  if (!searchKey) {
    fetchPhotos();
  } else {
    searchPhotos(searchKey);
  }
};

const openModal = (photo: Record<string, any>) => {
  selectedPhoto.value = photo;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Initial fetch
fetchPhotos();
</script>

<style scoped>
.shimmer {
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 400px;
  display: inline-block;
  position: relative;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.photo-card.shimmer {
  width: 100%;
  height: 400px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

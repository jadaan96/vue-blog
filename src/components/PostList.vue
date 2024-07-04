<template>
  <div class="container mt-4">
    <h1 class="mb-4 text-center">Posts</h1>
    <div v-if="paginatedPosts.length > 0">
      <div
        v-for="post in paginatedPosts"
        :key="post.id"
        class="card mb-3 shadow-sm"
      >
        <div class="card-body">
          <h2 class="card-title">{{ post.title }}</h2>
          <p class="card-text">{{ post.description }}</p>
          <p class="card-text">
            <small class="text-muted">{{ post.time }}</small>
          </p>
          <div class="d-flex justify-content-start">
            <button class="btn btn-danger m-1" @click="confirmDelete(post.id)">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
            <button class="btn btn-secondary m-1" @click="editPost(post)">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
          </div>
        </div>
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage - 1)"
              >Previous</a
            >
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{
              page
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage + 1)"
              >Next</a
            >
          </li>
        </ul>
      </nav>
    </div>
    <div v-else class="d-flex flex-column  align-items-center my-4" style="height: 100vh;">
  <p class="mb-3">There are no posts.</p>
  <button
    type="button"
    class="btn btn-primary"
    @click="this.$router.push('/post')"
  >
    <i class="fa-solid fa-plus"></i> Create Post
  </button>
</div>

  </div>
</template>

<script>
import { savePosts, loadPosts } from "../../utils/localStorage";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      posts: [],
      currentPage: 1,
      postsPerPage: 5,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.posts.length / this.postsPerPage);
    },
    paginatedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      return this.posts.slice(start, end);
    },
  },
  mounted() {
    this.loadPostsFromLocalStorage();
  },
  methods: {
    loadPostsFromLocalStorage() {
      this.posts = loadPosts();
    }, 
    confirmDelete(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePost(id);
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
        }
      });
    },
    deletePost(id) {
      this.posts = this.posts.filter((post) => post.id !== id);
      savePosts(this.posts);
    },
    editPost(post) {
      this.$router.push(`/post/${post.id}`);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 2.5rem;
  color: #343a40;
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.75rem;
  color: #007bff;
}

.card-text {
  font-size: 1rem;
  color: #6c757d;
}

.btn-danger,
.btn-secondary {
  display: flex;
  align-items: center;
}

.btn-danger i,
.btn-secondary i {
  margin-right: 0.5rem;
}

.pagination {
  margin-top: 1.5rem;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color:white
}

.page-link {
  color: #007bff;
}

.page-link:hover {
  color: #0056b3;
}

.text-center {
  color: #343a40;
}

.btn-primary {
  display: flex;
  align-items: center;
}

.btn-primary i {
  margin-right: 0.5rem;
}
</style>

<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link to="/" class="navbar-brand">Jadaan blog</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/post" class="nav-link">Create Post</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" class="nav-link">All Posts</router-link>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style scoped>
.navbar-brand {
  font-size: 1.8rem; 
}

.nav-link {
  color: #ffffff;
  font-size: 1.1rem; 
  margin-left: 20px; 
}

.nav-link:hover {
  color: #6c757d; 
}
</style>

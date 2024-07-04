export function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
  }
  
  export function loadPosts() {
    const posts = localStorage.getItem('posts');
    return posts ? JSON.parse(posts) : [];
  }
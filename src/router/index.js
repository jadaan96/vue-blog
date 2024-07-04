// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import PostList from '../components/PostList.vue';
import CreatePost from '../components/CreatePost.vue';

const routes = [
//   {
//     path: '/',
//     redirect: '/posts', // Redirect root to /posts
//   },
  {
    path: '/',
    component: PostList,
  },
  {
    path: '/post/:id',
    component: CreatePost,
    props: true,
  },
  {
    path: '/post',
    component: CreatePost,
  },
  
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

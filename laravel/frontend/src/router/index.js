import { createRouter,createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Post from '../views/Post.vue'
import VideoChat from '../views/VideoChat.vue'
import User from '../views/User.vue'
import App from '../App.vue'
import ProfilePage from '../views/Auth.vue'
import AuthLayout from '../AuthLayout.vue'
const routes = [
  {
    path: '/',
    component: AuthLayout, // 通常レイアウト
    children: [
      { path: '', component: Home, meta: { requiresAuth: true } },
      { path: 'post/:thred/', component: Post, meta: { requiresAuth: true } },
      { path: 'VideoChat', component: VideoChat, meta: { requiresAuth: true } },
      { path: '/profile/:id', component: ProfilePage, meta:{requiresAuth:true}}
      // 他の共通ページ
    ],
  },
  {
    path: '/login',
    children: [
      { path: '', component: Login },
    ],
  },
  {
    path: '/register',  
    children: [
      { path: '', component: User },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ダミー認証判定（あとで Pinia とかに置き換え可能）
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router
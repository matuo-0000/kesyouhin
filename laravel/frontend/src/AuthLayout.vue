<template>
  <div class="header">
    <nav class="navbar">
      <router-link class="nav" to="/">ホーム</router-link> 
      <router-link class="nav" to="/VideoChat">VideoChat</router-link>
      <router-link class="nav" :to="`/profile/${userId}`">
          プロフィールを見る
      </router-link>
      <button class="nav" @click="logout">ログアウト</button>
    </nav>
  </div>
  <div class="side_frame">
    <router-view />
  </div>
</template>
<script>
import axios from './axios';
export default{
  name: 'AuthLayout',
  data(){
    return{
      userId:null
    }
  },
  created(){
    axios.get()
    this.userId = localStorage.getItem('userId');
  },
  methods: {
    async logout() {
      try {
        await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
        await axios.post('/api/logout', {}, { withCredentials: true });
        localStorage.removeItem('token');
        this.$router.push('/login');
      } catch (error) {
        console.error("ログアウトエラー:", error);
      }
    }
  }
}
</script>
<style scoped>
.back{
  background-color: rgb(249, 249, 249);
}
.header{
  background-color: rgb(235, 199, 234);
}
.navbar {
  display: flex;
  justify-content: space-between;
  width: 60rem;
  height: 5rem;
  margin: 0 auto;
}
.nav{
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  background-color: rgb(240, 150, 240);
  color: rgb(252, 248, 248);
  padding-left: 2rem;
  padding-right: 2rem;
}
@media screen and (max-width: 768px) {
  .navbar {
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    height: auto;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .nav {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    margin-top: 0;
    height: auto;
  }
}


</style>
<template>
  <div class="login">
  <h2>🔐ログインページ</h2>
    <div class="login-form">
  <input
    v-model="email"
    type="text"
    placeholder="メールアドレス"
    />
    <input
    v-model="password"
    type="password"
    placeholder="パスワード"
    />
    <button class="login-button"  @click="doLogin()">ログイン</button>
    </div>
  </div>
  <a href="/register">アカウントをお持ちでない方はこちらから</a>
</template>
<script>
import axios from '../axios';
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
  async doLogin() {
     axios.get('/sanctum/csrf-cookie', { withCredentials: true });
     axios.post('/api/login', {
        email: this.email,
        password: this.password
      },{withCredentials:true}).then((response)=>{
        localStorage.setItem('token', response.data.token)
          localStorage.setItem('userId', response.data.user_id);
        localStorage.setItem('isLoggedIn', 'true');
        console.log('ログイン成功');
        this.$router.push('/');
        }).catch((error)=>{console.log(error)}); 
  }
}
};
</script>
<style scoped>

.login-form{
  display: flex;
  width: 30rem;
  justify-content: space-between;
}
.login-button{
  width: 6rem;
  height: 1.5rem;
}
</style>
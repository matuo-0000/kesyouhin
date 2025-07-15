<template>
  <div class="user">
    <h2>登録ページ</h2>
    <div class="user-form">
      <input 
        v-model="user_name"
        type="text"
        placeholder="名前"
      />
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
      <input
        v-model="paddword_confirmation"
        type="password"
        placeholder="パスワード確認"
      />
      </div>
      <button class="user-button" @click="doRegister()">登録</button>
  </div> 
  <div>　</div>
  <a href="/login">ログイン</a>
</template>
<script>
import axios from '../axios';
export default {
  data() {
    return{
      user_name: '',
      email: '',
      password: '',
      paddword_confirmation: ''
    }
  },
  methods:{
    doRegister(){
      this.password.length<5 ? alert('パスワードは5文字以上で入力してください') : '';
      this.password !== this.paddword_confirmation ? alert('パスワードが一致しません') : '';
      axios.post('api/register',{
        name : this.user_name,
        email: this.email,
        password: this.password,
        password_confirmation: this.paddword_confirmation
      }).then(()=>{
        console.log('登録成功');
        this.$router.push('/login');
      }).catch((error)=>{
        console.log(error);
      })
    }

  }
};
</script>
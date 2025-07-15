<template v-html="convertedContent">
  <div class="thread-wrapper">
    <div class="thread-header">
      <h2 class="thread-label">🩷 スレタイ：</h2>
      <h1 class="thread-title">{{ thread_title }}</h1>
    </div>

    <h3 class="thread-content">{{ thread_content }}</h3>

    <h2 class="res-header">📝 レスページ</h2>
    <div v-if="posts" class="post-list">
      <div v-for="(post, index) in posts" :key="index" class="post-card">
        <img
      v-if="userMap[post.user_id]?.profile_image"
      :src="userMap[post.user_id].profile_image"
      alt="ユーザー画像"
      class="thread-avatar"
    />
        <p class="post-number">#{{ posts.length - index + (pagination.current_page - 1) * 10 }}</p>
        <p class="post-id">ID：{{ post.id }}</p>
        <div v-if="post.repost_id" class="repost-info" @click="getId()">
          <p>💬 返信元ID：{{ post.repost_id }}</p>
          <p>👤 返信ユーザー名：{{ post.repost_user }}</p>
        </div>
        <h3 class="post-title">{{ post.title }}</h3>
        <p class="post-content">{{ post.content }}</p>
        <p class="post-author">🧸 投稿者：{{ post.name }}</p>
        <p class="post-time">🕒 {{ new Date(post.created_at).toLocaleString('ja-JP') }}</p>
        <button class="reply-button" @click="doRepost(post.title, post.id, post.name)">💌 この投稿に返信</button>
      </div>
    </div>

    <div class="dopost">
      <h3 class="post-form-title">💖 投稿する</h3>
      <div class="post-form">
        <p v-if="post_id" class="reply-info">返信先：{{ post_id }}（{{ post_user }}）</p>
        <input maxlength="30" placeholder="タイトル" v-model="title" class="input-title" />
        <textarea maxlength="400" placeholder="内容" v-model="content" class="content-box"></textarea>
        <div class="button-flex">
          <button @click="dopost()" class="submit-button">投稿する</button>
          <button @click="doreset()" class="reset-button">返信リセット</button>
        </div>
      </div>
    </div>

    <p class="pagecount">📄 {{ pagination.current_page }}ページ目</p>
    <div class="pagination-buttons">
      <button v-if="pagination?.prev_page_url" @click="fetchPosts(pagination.current_page - 1)" class="nav-button">
        ⬅️ 前のページ
      </button>
      <button v-if="pagination?.next_page_url" @click="fetchPosts(pagination.current_page + 1)" class="nav-button">
        ➡️ 次のページ
      </button>
    </div>
  </div>
  
</template>


<script>
import axios from '../axios';
import router from '../router';
export default {
  data(){
    return {
      thread_title: null,
      thread_content: null,
      posts: null,
      title: '',
      content: '',
      success: '',
      post_id:'',
      post_title:'',
      pagination: {
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null
      },
      userMap: {}, 
    }
  },
    mounted(){
      this.fetchPosts();
    },
    methods:{
      async fetchPosts(page = 1,thred = this.$route.params.thred) {
        try {
    const response = await axios.get(`/api/${thred}/getPost?page=${page}`);

    console.log(response.data.posts);
    this.posts = response.data.posts.data;
    this.pagination = {
      current_page: response.data.posts.current_page,
      last_page: response.data.posts.last_page,
      next_page_url: response.data.posts.next_page_url,
      prev_page_url: response.data.posts.prev_page_url
    };
    this.thread_title = response.data.thread.thred_title;
    this.thread_content = response.data.thread.thred_content;

    // user_idのユニーク取得
    const userIds = [
      ...new Set(response.data.posts.data.map(t => t.user_id))
    ];

    for (const id of userIds) {
      if (!this.userMap[id]) {
        try {
          const userRes = await axios.get(`/api/user/${id}`);
          this.userMap[id] = userRes.data.user;
        } catch (e) {
          console.error(`ユーザー取得失敗 user_id=${id}`, e);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
      },
      async dopost(thred = this.$route.params.thred){
        try{
        if (this.title && this.content) {
         await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
         await axios.post(`/api/${thred}/createPost/`, {
            title: this.title,
            content: this.content,
            repost_id: this.post_id, 
            repost_title: this.post_title,
            repost_user: this.post_user, 
          },{withCredentials:true}).then(() => {
            axios.get(`/api/${thred}/getPost`).then((response)=>{
                  this.posts = response.data.posts.data;
                  this.title=null;
                  this.content=null;
                }).catch((error) => {
                  console.error("Error fetching post data:", error);
                });
          }).catch((error) => {
            console.error("Error posting data:", error);
          });
        }
        }catch(error){
          console.log(error);
        }
      },
      doRepost(title,id,user,){
        this.post_title=title;
        this.post_id=id;
        this.post_user=user;

      },
      doreset(){
        this.post_id=null;
      },
      getId(){

      }
    }
  }

</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script&family=Zen+Maru+Gothic:wght@500&display=swap');

.thread-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}
.thread-wrapper {
  font-family: 'Zen Maru Gothic', cursive;
  background-color: #fff0f5;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 0 15px rgba(255, 192, 203, 0.4);
  color: #333;
  max-width: 800px;
  margin: auto;
}

.thread-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.thread-label {
  font-size: 1.2rem;
  color: #e75480;
}

.thread-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #d6336c;
}

.thread-content {
  font-size: 1.1rem;
  background-color: #ffe4ec;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.res-header {
  font-size: 1.5rem;
  margin: 1.5rem 0 1rem;
  color: #c71585;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background-color: #fff5f8;
  border: 2px solid #ffc0cb;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(255, 182, 193, 0.3);
}

.post-title {
  font-size: 1.2rem;
  color: #e91e63;
  margin: 0.5rem 0;
}

.post-content {
  font-size: 1rem;
  color: #555;
}

.post-author, .post-time, .post-number, .post-id {
  font-size: 0.9rem;
  color: #888;
}

.repost-info {
  font-size: 0.85rem;
  background-color: #ffe4e1;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.reply-button {
  background-color: #ffb6c1;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  color: white;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.3s ease;
}

.reply-button:hover {
  background-color: #ff69b4;
}

.dopost {
  margin-top: 3rem;
}

.post-form-title {
  font-size: 1.3rem;
  color: #d6336c;
  margin-bottom: 1rem;
}

.input-title, .content-box {
  width: 100%;
  border: 2px solid #ffc0cb;
  border-radius: 10px;
  padding: 0.8rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  background-color: #fffafc;
}

.button-flex {
  display: flex;
  gap: 1rem;
}

.submit-button, .reset-button {
  background-color: #ffb6c1;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover, .reset-button:hover {
  background-color: #ff69b4;
}

.pagecount {
  text-align: center;
  margin-top: 2rem;
  color: #c71585;
  font-weight: bold;
}

.pagination-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.nav-button {
  background-color: #ffe4ec;
  border: 1px solid #ffc0cb;
  padding: 0.5rem 1.5rem;
  border-radius: 12px;
  color: #d6336c;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-button:hover {
  background-color: #ffccdd;
}

</style>
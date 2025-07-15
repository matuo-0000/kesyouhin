<template>
  <div class="main-thred">
    <CategoryBar
      :categories="categories"
      @all_load="fetchPosts()"
      v-model="selectedCategoryId"
      @click="category_click(page=1,this.selectedCategoryId)"
    />
    <div class="thread-wrapper">
      <div class="frame">
        <div class="search">
          <input
            class="search1"
            type="text"
            v-model="searchQuery"
            placeholder="キーワードで検索"
          />
          <button class="search_button" @click="dosearch()">検索</button>
        </div>
        <h2 class="thread-title-header">スレッド一覧</h2>
        <div v-if="threds" class="post-list">
          <a
            v-for="(thread, index) in threds"
            class="post"
            @click="threadContent(thread.id)"
            :key="index"
          >
            <div class="content_block">
              <p class="number">{{ threds.length - index }}</p>
              <img
              @click.stop="goProfile(thread.user_id)"
                v-if="userMap[thread.user_id]?.profile_image"
                :src="userMap[thread.user_id].profile_image"
                alt="ユーザー画像"
                class="thread-avatar"
              />
              <h3 class="title">{{ thread.thred_title }}</h3>
            </div>
          </a>
        </div>
        <div class="dopost">
          <h3>スレッドを立てる</h3>
          <div class="post-form">
            <input maxlength="30" placeholder="タイトル" v-model="title" />
            <textarea
              maxlength="400"
              v-model="content"
              class="content-box"
            ></textarea>
          </div>
          <div class="category-selected">
            {{ selectedCategoryNames.join(', ') }}
          </div>
          <div class="button_flex">
            <button @click="dothread()" class="button">スレッドを立てる</button>
            <CategoryAccordion
              :categories="categories"
              v-model="uploadCategoryId"
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <button
          v-if="pagination?.prev_page_url"
          @click="fetchPosts(pagination.current_page - 1)"
        >
          前のページ
        </button>
        <p>{{ pagination?.current_page }}</p>
        <button
          v-if="pagination?.next_page_url"
          @click="fetchPosts(pagination.current_page + 1)"
        >
          次のページ
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from '../axios';
import router from '../router';
import CategoryBar from '../components/CategoryBar.vue';
import CategoryAccordion from '../components/CategoryAccordion.vue';
export default {
  components: {
    CategoryBar,
    CategoryAccordion
  },
  data(){
    return {
    categories: null,
    selectedCategoryId: null,
    threds: null,
    title: '',
    content: '',
    success: '',
    uploadCategoryId: null,
    authUser: null,   // ←追加
    pagenation: {
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
    },
    searchQuery: null,
    userMap: {},      //
    }
  },
    mounted(){
      const page=1;
      this.fetchPosts(page, this.selectedCategoryId ? [this.selectedCategoryId] : []);
      this.getAuthUser();
    },
    computed: {
       selectedCategoryNames() {
    if (!this.uploadCategoryId || !this.categories) return [];
    const selected = this.categories.find(cat => cat.id === this.uploadCategoryId);
    return selected ? [selected.category_name] : [];
  },
  categoryNameMap() {
    const map = {};
    this.categories.forEach(cat => {
      map[cat.id.toString()] = cat.category_name;
    });
    return map;
  }
  },
  methods:{
     goProfile(userId) {
      this.$router.push(`/profile/${userId}`);
    },
     async getAuthUser() {
    try {
      const res = await axios.get('/api/auth-user', { withCredentials: true });
      this.authUser = res.data.user;
      console.log('ログイン中ユーザー:', this.authUser);
    } catch (error) {
      console.error('auth-user API エラー:', error);
    }
  },
     getCategoryNamesByIds(ids) {
    if (!ids) return [];
    if (typeof ids === 'string') {
      try {
        ids = JSON.parse(ids);
      } catch(e) {
        return [];
      }
    }
    if (!Array.isArray(ids)) return [];
    // 文字列化してからmapで取得
    return ids.map(id => this.categoryNameMap[id.toString()]).filter(name => !!name);
  },   
  fetchPosts(page,category_id) {
    console.log(category_id);
      axios.get(`/api/getThreds?page=${page}`)
    .then(async (response) => {
      console.log(response);
      this.threds = response.data.Threds.data;
      this.pagination = {
        current_page: response.data.Threds.current_page,
        last_page: response.data.Threds.last_page,
        next_page_url: response.data.Threds.next_page_url,
        prev_page_url: response.data.Threds.prev_page_url
      };
      this.categories = response.data.category;

      // ユーザーデータを取得
      const userIds = [...new Set(this.threds.map(t => t.user_id))];

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

      console.log('userMap:', this.userMap);

    })
    .catch((error) => {
      console.error("Error fetching post data:", error);
    });
    },
      async dothread(){
        try{
          console.log(this.uploadCategoryId)
        if (this.title && this.content) {
         await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
         await axios.post('/api/createThred', {
            thred_title: this.title,
            thred_content: this.content,
            category_ids:[this.uploadCategoryId], 
          },{withCredentials:true}).then(() => {
            axios.get(`/api/getThreds`).then((response)=>{
                  console.log(response.data.data);
                  this.threds = response.data.Threds.data;
                  this.content=null;
                  this.title=null;
                  this.selectedCategoryId=null;
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
    threadContent(thred){
      router.push(`/post/${thred}/`)
    },
    dosearch(){
      axios.post('api/search_thred',{keyword:this.searchQuery}).then((response)=>{
        console.log(response.data);
        this.threds=response.data
    })
    },
    category_click(page = 1,selectedCategoryId){
      console.log(selectedCategoryId)
      axios.get(`/api/getThreds?page=${page}`,{ params:{category_ids:selectedCategoryId}}).then((response)=>{
        console.log(response);
         this.threds = response.data.Threds.data;
          this.pagination = {
            current_page: response.data.Threds.current_page,
            last_page: response.data.Threds.last_page,
            next_page_url: response.data.Threds.next_page_url,
            prev_page_url: response.data.Threds.prev_page_url
          };
      }).catch((error)=>{
        console.log(error)
      })
    }
  }
}

</script>
<style scoped>
.main-thred {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  font-family: "Noto Sans JP", sans-serif;
  color: #800040;
}

.thread-wrapper {
  width: 100%;
  margin-right: 20rem;
  max-width: 900px;
  background: #fff0f7;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
  box-sizing: border-box;
}

.frame {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.search1 {
  flex: 1 1 auto;
  min-width: 0;
  padding: 1rem;
  border: 2px solid #ff69b4;
  border-radius: 1rem;
  background: #fff;
  box-shadow: inset 0 2px 5px rgba(255, 105, 180, 0.2);
  font-size: 1rem;
}

.search_button {
  background: linear-gradient(to right, #ff66cc, #ff1493);
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.4);
  transition: all 0.3s ease;
}

.search_button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.thread-title-header {
  color: #c71585;
  font-size: 2rem;
  text-align: center;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post {
  background: #ffffff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.post:hover {
  transform: translateY(-4px);
  background-color: #fff8fb;
}

.content_block {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.number {
  font-weight: bold;
  color: #ff1493;
  font-size: 1.3rem;
}
.thread-avatar:hover{
  border: 4px solid #ff69b4;
}
.thread-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff69b4;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #c71585;
  flex: 1 1 auto;
  word-break: break-word;
}

.dopost {
  background: #ffeaf4;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.4);
}

.dopost h3 {
  color: #c71585;
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-form input,
.content-box {
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  border: 2px solid #ffc0cb;
  background-color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
}

.content-box {
  height: 8rem;
  resize: vertical;
}

.category-selected {
  color: #ff69b4;
  font-weight: bold;
  margin-top: 1rem;
}

.button_flex {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.button {
  background: linear-gradient(to right, #ff66cc, #ff1493);
  color: white;
  height: 3rem;
  border: none;
  border-radius: 1rem;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.4);
  transition: all 0.3s ease;
}

.button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.buttons button {
  background-color: #ffb6c1;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(255, 182, 193, 0.4);
  transition: all 0.3s ease;
}

.buttons button:hover {
  background-color: #ff69b4;
}

/* メディアクエリ */
@media screen and (max-width: 768px) {
  .main-thred{
    flex-direction: column;
  }
  .thread-wrapper {
    padding: 1rem;
    margin: 0;
  }
  .content_block {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .title {
    font-size: 1.3rem;
  }
  .button_flex {
    flex-direction: column;
    width: 100%;
  }
  .buttons {
    flex-direction: column;
    width: 100%;
  }
  .buttons button {
    width: 100%;
  }
}


</style>
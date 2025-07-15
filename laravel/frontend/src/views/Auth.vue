<template>
  <div class="profile-container">
    <div class="profile-header">
      <img
        :src="user.profile_image || defaultImage"
        class="profile-avatar"
      />
      <div class="profile-info">
        <h2>{{ user.name }}</h2>
        <p>{{ user.introduction || '自己紹介はまだありません。' }}</p>
        <p>登録日：{{ formatDate(user.created_at) }}</p>

        <!-- ✅ 自分のプロフィールのときだけ編集ボタンを表示 -->
        <button v-if="authUser?.id === user.id" @click="editMode = true">
          編集
        </button>
      </div>
    </div>

    <div v-if="editMode" class="edit-form">
      <input v-model="editData.name" placeholder="ユーザー名" />
      <textarea v-model="editData.introduction" placeholder="自己紹介"></textarea>
      <input type="file" @change="onFileChange" />

      <button @click="updateProfile">保存する</button>
      <button @click="editMode = false">キャンセル</button>
    </div>

    <div class="thread-list">
      <h3>📝 投稿したスレッド一覧</h3>
      <div
        v-if="threads && threads.length > 0"
        class="thread-card"
        v-for="thread in threads"
        :key="thread.id"
        @click="gopage(thread.id)"
      >
        <h4>{{ thread.thred_title }}</h4>
        <p>{{ thread.thred_content }}</p>
        <p>投稿日：{{ formatDate(thread.created_at) }}</p>
      </div>
      <p v-else>まだ投稿がありません。</p>
    </div>
  </div>
</template>
<script>
import axios from "../axios";

export default {
  name:'ProfilePage',
  data() {
    return {
      user: {},
      threads: [],
      defaultImage: "/images/default-user.png",
      authUser: null,      // ← ログインユーザー情報
      editMode: false,
      editData: {
        name: "",
        introduction: "",
        profile_image: null,
      },
    };
  },
  mounted() {
    this.fetchAuthUser();
    this.fetchProfile();
  },
  methods: {
    gopage(id){
     this.$router.push(`/post/${id}`);
    },
    async fetchAuthUser() {
      try {
        const res = await axios.get("/api/auth-user");
        this.authUser = res.data.user;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchProfile() {
      try {
        const userId = this.$route.params.id;
        const res = await axios.get(`/api/user/${userId}`);
        console.log(res.data.user)
        this.user = res.data.user;
        this.threads = res.data.threads;
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("ja-JP");
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.editData.profile_image = file;
    },
    async updateProfile() {
      try {
        const formData = new FormData();
        formData.append("name", this.editData.name);
        formData.append("introduction", this.editData.introduction);
        if (this.editData.profile_image) {
          formData.append("profile_image", this.editData.profile_image);
        }

        await axios.post(`/api/user/update/${this.user.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        this.editMode = false;
        this.fetchProfile();
      } catch (e) {
        console.error(e);
      }
    },
  },
  watch: {
    user(newVal) {
      // 初期値セット
      this.editData.name = newVal.name;
      this.editData.introduction = newVal.introduction;
    },
  },
};
</script>
<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff0f6;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(255, 182, 193, 0.4);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #4b2e39;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-bottom: 1px solid #fccde2;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f9a8d4;
  box-shadow: 0 4px 8px rgba(249, 168, 212, 0.6);
}

.profile-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.profile-info p {
  margin: 0.2rem 0;
  font-size: 1rem;
  color: #7a4c61;
}

button {
  background-color: #f48fb1;
  border: none;
  padding: 0.5rem 1.3rem;
  color: white;
  font-weight: 600;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(244, 143, 177, 0.5);
  transition: background-color 0.3s ease;
  margin-top: 0.8rem;
}

button:hover {
  background-color: #f06292;
}

.edit-form {
  background-color: #fce4ec;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  box-shadow: inset 0 0 6px rgba(244, 143, 177, 0.3);
}

.edit-form input[type="text"],
.edit-form textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 2px solid #f48fb1;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}

.edit-form input[type="file"] {
  margin-bottom: 1rem;
}

.thread-list h3 {
  color: #a8325e;
  font-weight: 700;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f48fb1;
  padding-bottom: 0.3rem;
}

.thread-card {
  cursor: pointer;
  background-color: #f8bbd0;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(232, 115, 159, 0.4);
  color: #5b2a3f;
}

.thread-card h4 {
  margin: 0 0 0.3rem 0;
  font-weight: 700;
}

.thread-card p {
  margin: 0.2rem 0;
  font-size: 0.9rem;
}

p[v-else] {
  text-align: center;
  color: #d16d88;
  font-style: italic;
  margin-top: 2rem;
}
</style>
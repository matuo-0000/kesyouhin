<template>
  <div>
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <!-- 自分の映像 -->
      <div>
        <h3>My Video</h3>
        <div ref="localVideo" style="width: 400px; height: 300px; background: #000;"></div>
      </div>
      <!-- 他ユーザーの映像 -->
      <div v-for="(videoEl, uid) in remoteVideos" :key="uid" style="width: 400px; height: 300px; background: #000;">
        <h3>User: {{ uid }}</h3>
        <div :ref="videoEl"></div>
      </div>
    </div>
    <button @click="joinChannel">Join Channel</button>
    <button @click="leaveChannel">Leave Channel</button>
  </div>
</template>

<script setup>
// import { ref, reactive, onUnmounted, nextTick } from 'vue'
// import AgoraRTC from 'agora-rtc-sdk-ng'
// import axios from '../axios'

// const localVideo = ref(null)
// const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
// let localTrack = null

// // remoteVideos は uid => ref名 のマップ
// const remoteVideos = reactive({})

// const joinChannel = async () => {
//   const channelName = 'testChannel'

//   // トークン取得
//   const res = await axios.post('/api/agora/token', { channelName })
//   const appId = import.meta.env.VITE_AGORA_APP_ID
//   const token = res.data.token
//   const uid = res.data.uid

//   await client.join(appId, channelName, token, uid)

//   // 自分のカメラ映像作成・再生
//   localTrack = await AgoraRTC.createCameraVideoTrack()
//   localTrack.play(localVideo.value)

//   // 自分の映像を公開
//   await client.publish([localTrack])

//   // 他ユーザーが新規参加したときに受信準備
//   client.on('user-published', async (user, mediaType) => {
//     // 参加ユーザーのトラックをサブスクライブ
//     await client.subscribe(user, mediaType)

//     if (mediaType === 'video') {
//       // 動画トラックを取得
//       const remoteVideoTrack = user.videoTrack

//       // そのユーザー用のrefを動的に作成（Vueのリアクティブ）
//       if (!remoteVideos[user.uid]) {
//         remoteVideos[user.uid] = ref(null)
//         await nextTick() // DOM更新待ち
//       }

//       // プレイ開始
//       remoteVideoTrack.play(remoteVideos[user.uid].value)
//     }

//     if (mediaType === 'audio') {
//       const remoteAudioTrack = user.audioTrack
//       remoteAudioTrack.play() // 音声はDOM不要
//     }
//   })

//   // 他ユーザーが退出したときに映像を削除
//   client.on('user-unpublished', user => {
//     if (remoteVideos[user.uid]) {
//       delete remoteVideos[user.uid]
//     }
//   })

//   console.log('Publish success!')
// }

// const leaveChannel = async () => {
//   await client.leave()
//   if (localTrack) {
//     localTrack.stop()
//     localTrack.close()
//     localTrack = null
//   }
//   // 他ユーザーの映像も消す
//   Object.keys(remoteVideos).forEach(uid => delete remoteVideos[uid])
// }

// onUnmounted(() => {
//   leaveChannel()
// })
</script>

<script setup>
import { ref, onMounted } from "vue";
import { toggleSidebar } from "../store.js";
import { getUserProfile, updateUserProfile } from "../api/user.js";
import { ElMessage } from "element-plus";
import TopCalendar from "./TopCalendar.vue";

const props = defineProps({ username: String });
const emit = defineEmits(["logout"]);

const showProfileModal = ref(false);
const saving = ref(false);
const profileForm = ref({
  nickname: "",
  avatar: "",
  bio: "",
});
const userProfile = ref({});

const loadProfile = async () => {
  try {
    const res = await getUserProfile();
    if (res.code === 200) {
      userProfile.value = res.data;
      profileForm.value = {
        nickname: res.data.nickname || "",
        avatar: res.data.avatar || "",
        bio: res.data.bio || "",
      };
    }
  } catch (error) {
    console.error("加载资料失败", error);
  }
};

const saveProfile = async () => {
  saving.value = true;
  try {
    const res = await updateUserProfile(profileForm.value);
    if (res.code === 200) {
      ElMessage.success("资料更新成功");
      await loadProfile();
      showProfileModal.value = false;
    } else {
      ElMessage.error(res.message || "更新失败");
    }
  } catch (error) {
    ElMessage.error("网络错误");
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadProfile();
});

const handleAvatarChange = (file) => {
  const isImage = file.raw.type.startsWith("image/");
  const isLt2M = file.raw.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("头像必须是图片格式!");
    return;
  }
  if (!isLt2M) {
    ElMessage.error("头像图片大小不能超过 2MB!");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file.raw);
  reader.onload = () => {
    profileForm.value.avatar = reader.result;
  };
};
</script>

<template>
  <header class="header">
    <div class="header-left">
      <div class="header-branding">
        <button class="icon-btn hamburger" @click="toggleSidebar">
          <svg viewBox="0 0 24 24" fill="#5f6368" width="24" height="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        </button>
        <div class="logo">
          <img src="/favicon.svg" class="logo-img" alt="Tasks Logo" />
          <span class="logo-text">Tasks</span>
        </div>
      </div>
      <TopCalendar />
    </div>

    <div class="header-right">
      <span class="username">{{ userProfile.nickname || props.username }}</span>
      <span class="bio-text" v-if="userProfile.bio" :title="userProfile.bio">{{ userProfile.bio }}</span>
      <el-popconfirm
        title="确定要退出当前账号吗？"
        confirm-button-text="确定"
        cancel-button-text="取消"
        confirm-button-type="danger"
        @confirm="emit('logout')"
        width="200"
      >
        <template #reference>
          <button class="logout-btn">退出</button>
        </template>
      </el-popconfirm>
      <div class="avatar" @click="showProfileModal = true" style="cursor: pointer;">
        <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="avatar" />
        <span v-else>{{ (userProfile.nickname || props.username)?.charAt(0)?.toUpperCase() }}</span>
      </div>
    </div>

    <!-- 个人资料设置弹窗 -->
    <el-dialog v-model="showProfileModal" title="个人资料设置" width="400px">
      <el-form label-width="80px" @submit.prevent>
        <el-form-item label="设置头像">
          <el-upload
            class="avatar-uploader"
            drag
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
            accept="image/*"
          >
            <img v-if="profileForm.avatar" :src="profileForm.avatar" class="uploaded-avatar" />
            <div v-else class="upload-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8c939d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="48" height="48" style="margin-bottom: 8px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <div class="el-upload__text">将图片拖拽至此，或 <em>点击上传</em></div>
              <div class="el-upload__tip" style="margin-top: 8px; color: #999; font-size: 12px; line-height: 1.4;">支持 jpg/png 格式<br>大小不超过 2MB</div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="profileForm.nickname" placeholder="请输入您的名称" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="profileForm.bio" type="textarea" :rows="2" placeholder="写一句喜欢的话..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showProfileModal = false">取消</el-button>
          <el-button type="primary" @click="saveProfile" :loading="saving">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </header>
</template>

<style scoped>
.header {
  height: 64px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 0 0; /* 左侧 padding 移到 branding 中 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1; /* 让左侧占据剩余空间，方便日历展开 */
}

.header-branding {
  width: 280px; /* 严格对齐左侧边栏的宽度 */
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 24px;
  box-sizing: border-box;
  height: 64px; /* 撑满高度 */
  position: relative;
}

.header-branding::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20px;
  bottom: 20px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.08); /* 稍微加深一点点让这根线更像一个独立的分割符 */
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #5f6368;
  transition: background 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
}

.icon-btn:hover {
  background: #f1f3f4;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 4px;
}

.logo-img {
  width: 36px;
  height: 36px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.5px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1a73e8;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-size: 14px;
  color: #3c4043;
  font-weight: 500;
}

.logout-btn {
  padding: 6px 14px;
  font-size: 13px;
  color: #5f6368;
  background: none;
  border: 1px solid #dadce0;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #f1f3f4;
}

.bio-text {
  font-size: 12px;
  color: #80868b;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-uploader :deep(.el-upload) {
  width: 100%;
}
.avatar-uploader :deep(.el-upload-dragger) {
  padding: 20px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: 1px dashed #dcdfe6;
  background-color: #fafafa;
  transition: all 0.3s;
}
.avatar-uploader :deep(.el-upload-dragger:hover) {
  border-color: #1a73e8;
  background-color: #f1f8ff;
}

.uploaded-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e8f0fe;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

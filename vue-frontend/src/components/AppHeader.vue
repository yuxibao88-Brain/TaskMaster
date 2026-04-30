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
          <svg viewBox="0 0 24 24" fill="#5f6368" width="24" height="24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
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
      <span class="bio-text" v-if="userProfile.bio" :title="userProfile.bio">{{
        userProfile.bio
      }}</span>
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
      <div
        class="avatar"
        @click="showProfileModal = true"
        style="cursor: pointer"
      >
        <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="avatar" />
        <span v-else>{{
          (userProfile.nickname || props.username)?.charAt(0)?.toUpperCase()
        }}</span>
      </div>
    </div>

    <!-- 个人资料设置弹窗 -->
    <el-dialog v-model="showProfileModal" title="个人资料设置" width="420px" class="premium-dialog" :show-close="true">
      <div class="profile-modal-body">
        <div class="avatar-upload-container">
          <el-upload
            class="avatar-uploader-circle"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
            accept="image/*"
          >
            <div class="avatar-wrapper">
              <img
                v-if="profileForm.avatar"
                :src="profileForm.avatar"
                class="uploaded-avatar"
              />
              <div v-else class="upload-placeholder-circle">
                <span class="default-avatar-text">{{ profileForm.nickname?.charAt(0)?.toUpperCase() || 'U' }}</span>
              </div>
              <div class="avatar-hover-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            </div>
          </el-upload>
          <div class="avatar-hint">点击更换头像</div>
        </div>

        <el-form label-position="top" @submit.prevent>
          <el-form-item label="名称">
            <el-input
              v-model="profileForm.nickname"
              placeholder="请输入您的名称"
              size="large"
              class="premium-input"
            />
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input
              v-model="profileForm.bio"
              type="textarea"
              :rows="3"
              placeholder="写一句喜欢的话..."
              class="premium-input"
              resize="none"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="premium-dialog-footer">
          <el-button class="premium-btn-cancel" @click="showProfileModal = false">取消</el-button>
          <el-button class="premium-btn-save" type="primary" @click="saveProfile" :loading="saving">保存修改</el-button>
        </div>
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
  content: "";
  position: absolute;
  right: 0;
  top: 20px;
  bottom: 20px;
  width: 1px;
  background-color: rgba(
    0,
    0,
    0,
    0.08
  ); /* 稍微加深一点点让这根线更像一个独立的分割符 */
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

/* ================== Premium Profile Modal Styles ================== */
:deep(.premium-dialog) {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

:deep(.premium-dialog .el-dialog__header) {
  padding: 24px 32px 16px;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  text-align: center;
}

:deep(.premium-dialog .el-dialog__title) {
  font-weight: 700;
  font-size: 18px;
  color: #1d1d1f;
}

:deep(.premium-dialog .el-dialog__body) {
  padding: 32px;
}

:deep(.premium-dialog .el-dialog__footer) {
  padding: 16px 32px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.avatar-uploader-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 3px solid #ffffff;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: #f2f2f7;
}

.avatar-uploader-circle:hover {
  transform: scale(1.05);
}

.avatar-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.uploaded-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder-circle {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  color: #fff;
}

.default-avatar-text {
  font-size: 40px;
  font-weight: 700;
}

.avatar-hover-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 50%;
}

.avatar-wrapper:hover .avatar-hover-overlay {
  opacity: 1;
}

.avatar-hint {
  margin-top: 12px;
  font-size: 13px;
  color: #86868b;
  font-weight: 500;
}

.premium-input :deep(.el-input__wrapper),
.premium-input :deep(.el-textarea__inner) {
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06) inset;
  background: #f9f9f9;
  transition: all 0.2s;
  padding: 12px 16px;
  font-size: 15px;
}

.premium-input :deep(.el-input__wrapper:hover),
.premium-input :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset;
  background: #ffffff;
}

.premium-input :deep(.el-input__wrapper.is-focus),
.premium-input :deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px #007aff inset !important;
  background: #ffffff;
}

.premium-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.premium-btn-cancel,
.premium-btn-save {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  height: 44px;
  border: none;
  transition: all 0.2s;
}

.premium-btn-cancel {
  background: #f2f2f7;
  color: #1d1d1f;
}

.premium-btn-cancel:hover {
  background: #e5e5ea;
}

.premium-btn-save {
  background: #007aff;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.premium-btn-save:hover {
  background: #006ce6;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
}
</style>

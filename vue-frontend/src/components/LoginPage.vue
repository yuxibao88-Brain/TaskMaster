<script setup>
import { ref } from "vue";
import { login, register } from "../api/auth.js";

const emit = defineEmits(["login-success"]);

const isLogin = ref(true);
const username = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  errorMsg.value = "";
  if (!username.value.trim() || !password.value.trim()) {
    errorMsg.value = "请输入用户名和密码";
    return;
  }

  loading.value = true;
  try {
    if (isLogin.value) {
      const res = await login({ username: username.value, password: password.value });
      if (res.code === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        emit("login-success", res.data.username);
      } else {
        errorMsg.value = res.message;
      }
    } else {
      const res = await register({ username: username.value, password: password.value });
      if (res.code === 200) {
        errorMsg.value = "";
        isLogin.value = true;
        password.value = "";
        alert("注册成功，请登录！");
      } else {
        errorMsg.value = res.message;
      }
    }
  } catch (err) {
    errorMsg.value = "网络错误，请稍后重试";
  }
  loading.value = false;
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errorMsg.value = "";
  password.value = "";
};
</script>

<template>
  <div class="login-page">
    <!-- 左侧品牌区 (侧边栏风格) -->
    <div class="brand-side">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24" fill="#007aff" width="28" height="28">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span class="brand-name">Tasks</span>
      </div>

      <div class="brand-content-wrapper">
        <div class="brand-text">
          <h2 class="brand-title">管理你的<br/>每一天</h2>
          <p class="brand-desc">简洁高效的任务管理工具，让你专注于真正重要的事情。</p>
        </div>
        
        <div class="brand-features">
          <div class="feature-item">
            <div class="icon-wrapper icon-blue">
              <svg viewBox="0 0 24 24" fill="#007aff" width="14" height="14"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
            </div>
            <span>多列表分类</span>
          </div>
          <div class="feature-item">
            <div class="icon-wrapper icon-orange">
              <svg viewBox="0 0 24 24" fill="#ff9500" width="14" height="14"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
            <span>星标重要任务</span>
          </div>
          <div class="feature-item">
            <div class="icon-wrapper icon-green">
              <svg viewBox="0 0 24 24" fill="#34c759" width="14" height="14"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
            </div>
            <span>数据云端同步</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="form-side">
      <div class="form-wrapper">
        <div class="form-header">
          <h1 class="form-title">{{ isLogin ? "欢迎回来" : "创建账号" }}</h1>
          <p class="form-subtitle">{{ isLogin ? "登录你的账号继续使用" : "注册一个新账号开始使用" }}</p>
        </div>

        <div class="form-field">
          <input
            type="text"
            v-model="username"
            placeholder="用户名"
            @keyup.enter="handleSubmit"
            autofocus
          />
        </div>

        <div class="form-field">
          <input
            type="password"
            v-model="password"
            placeholder="密码"
            @keyup.enter="handleSubmit"
          />
        </div>

        <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>

        <button class="submit-btn" @click="handleSubmit" :disabled="loading">
          {{ loading ? "请稍候..." : (isLogin ? "登 录" : "注 册") }}
        </button>

        <div class="divider"></div>

        <p class="toggle-text">
          {{ isLogin ? "还没有账号？" : "已有账号？" }}
          <span class="toggle-link" @click="toggleMode">
            {{ isLogin ? "立即注册" : "去登录" }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #fbfbfd;
}

/* 左侧品牌区（20% 左右宽度） */
.brand-side {
  flex: 0 0 280px; /* 固定合理宽度，比百分比更稳定 */
  background: #f5f5f7;
  border-right: 1px solid #e5e5ea;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 40px;
  left: 32px;
}

.brand-name {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.5px;
}

/* 让左侧内容垂直居中，显得不那么空 */
.brand-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-text {
  margin-bottom: 40px;
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 16px;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.brand-desc {
  font-size: 14px;
  color: #86868b;
  margin: 0;
  line-height: 1.5;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
}

.icon-wrapper {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.02);
}

/* 右侧表单区 */
.form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #fbfbfd;
  background-image: radial-gradient(#e5e5ea 1px, transparent 1px);
  background-size: 32px 32px; /* 增加一点非常微妙的点阵背景纹理，去空旷感 */
}

/* 把表单包裹进一个精致的苹果风白色卡片里 */
.form-wrapper {
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  padding: 48px 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.5px;
}

.form-subtitle {
  margin: 0;
  font-size: 14px;
  color: #86868b;
}

.form-field {
  margin-bottom: 16px;
}

.form-field input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  background: #f5f5f7;
  border: 1px solid #e5e5ea;
  border-radius: 12px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
  color: #1d1d1f;
}

.form-field input::placeholder {
  color: #86868b;
}

.form-field input:focus {
  background: #fff;
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

.error-msg {
  margin: 4px 0 16px;
  font-size: 13px;
  color: #ff3b30;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: #007aff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.submit-btn:hover:not(:disabled) {
  background: #0060df;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  background: #a1caff;
  cursor: not-allowed;
}

.divider {
  height: 1px;
  background: #e5e5ea;
  margin: 24px 0;
}

.toggle-text {
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: #86868b;
}

.toggle-link {
  color: #007aff;
  cursor: pointer;
  font-weight: 500;
}

.toggle-link:hover {
  text-decoration: underline;
}
</style>

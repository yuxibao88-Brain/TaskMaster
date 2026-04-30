<script setup>
import { ref } from "vue";
import { login, register, googleLogin } from "../api/auth.js";
import { GoogleLogin } from 'vue3-google-login';

const emit = defineEmits(["login-success"]);

const isLogin = ref(true);
const username = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

const handleSubmit = async () => {
  errorMsg.value = "";
  if (!username.value.trim() || !password.value.trim()) {
    errorMsg.value = "请输入用户名和密码";
    return;
  }

  loading.value = true;
  try {
    if (isLogin.value) {
      const res = await login({
        username: username.value,
        password: password.value,
      });
      if (res.code === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        emit("login-success", res.data.username);
      } else {
        errorMsg.value = res.message;
      }
    } else {
      const res = await register({
        username: username.value,
        password: password.value,
      });
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

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleGoogleCallback = async (response) => {
  if (response.credential) {
    loading.value = true;
    try {
      const res = await googleLogin(response.credential);
      if (res.code === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        emit("login-success", res.data.username);
      } else {
        errorMsg.value = res.message || "Google 登录验证失败";
      }
    } catch (err) {
      errorMsg.value = "网络错误，请稍后重试";
    }
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 左侧内容区 -->
      <div class="card-left">
        <div class="brand">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <span class="brand-text">TaskMaster</span>
        </div>

        <div class="hero-content">
          <h1 class="hero-title">高效工作<br />轻松生活</h1>
          <p class="hero-desc">
            一款简洁优雅的待办事项管理工具<br />
            合理规划每一天，让目标触手可及
          </p>
        </div>

        <div class="illustration-container">
          <div class="floating-cards">
            <div class="glow-effect"></div>
            <div class="card-back"></div>
            <div class="card-front">
              <div class="check-circle">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="24"
                  height="24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            </div>
            <div class="dot dot-blue"></div>
            <div class="dot dot-green"></div>
            <div class="dot dot-orange"></div>
          </div>
        </div>

        <div class="feature-list">
          <div class="feature">
            <div class="feature-icon bg-glass-blue text-blue">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="14"
                height="14"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <div class="feature-text">
              <h4>安全可靠</h4>
              <p>数据加密保护</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon bg-glass-green text-green">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="14"
                height="14"
              >
                <polygon
                  points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                ></polygon>
              </svg>
            </div>
            <div class="feature-text">
              <h4>高效便捷</h4>
              <p>快速管理任务</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon bg-glass-purple text-purple">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="14"
                height="14"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="feature-text">
              <h4>实时同步</h4>
              <p>多端数据同步</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧表单区 -->
      <div class="card-right">
        <div class="form-wrapper">
          <div class="form-header">
            <h2>{{ isLogin ? "欢迎回来" : "创建账号" }}</h2>
            <p>
              {{
                isLogin
                  ? "登录您的账号，继续使用 TaskMaster"
                  : "注册一个新账号，开启高效旅程"
              }}
            </p>
          </div>

          <div class="input-group">
            <label>用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                type="text"
                v-model="username"
                placeholder="请输入用户名"
                @keyup.enter="handleSubmit"
              />
            </div>
          </div>

          <div class="input-group">
            <label>密码</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="请输入密码"
                @keyup.enter="handleSubmit"
              />
              <span class="input-action" @click="togglePassword">
                <svg
                  v-if="!showPassword"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </span>
            </div>
          </div>

          <div class="form-options" v-if="isLogin">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-pwd">忘记密码？</a>
          </div>

          <div class="error-msg" v-if="errorMsg">
            {{ errorMsg }}
          </div>

          <button
            class="submit-btn"
            :class="{ loading: loading }"
            @click="handleSubmit"
            :disabled="loading"
          >
            <span class="btn-text">{{ isLogin ? "登 录" : "注 册" }}</span>
            <div class="loader" v-if="loading"></div>
          </button>

          <div class="divider" v-if="isLogin">
            <span>或使用以下方式登录</span>
          </div>

          <div class="social-login" v-if="isLogin">
            <GoogleLogin :callback="handleGoogleCallback">
              <button class="social-btn">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>
            </GoogleLogin>
          </div>

          <div class="toggle-mode">
            {{ isLogin ? "没有账号？" : "已有账号？" }}
            <a href="javascript:void(0)" @click="toggleMode">
              {{ isLogin ? "立即注册" : "去登录" }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础重置与字体抗锯齿 */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f9fc;
  /* 绝美的风景图片背景（类似截图中的海滩/日落） */
  background-image: url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2564&q=80");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  position: relative;
}

/* 背景大模糊，营造截图中的虚化氛围 */
.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* 增加暗角和轻微白雾融合 */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 0;
}

/* ======== 主卡片：毛玻璃效果 ======== */
.login-card {
  width: 1000px;
  min-height: 640px;
  /* 高级毛玻璃：半透明白 + 高斯模糊 */
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(40px) saturate(120%);
  -webkit-backdrop-filter: blur(40px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* ======== 左侧区域 ======== */
.card-left {
  flex: 1.1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: transparent;
  /* 非常微弱的毛玻璃分割线 */
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

/* Logo 变为深黑色系，匹配截图极简风 */
.brand-logo {
  width: 28px;
  height: 28px;
  background: #1d1d1f;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.brand-text {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.3px;
}

.hero-content {
  margin-bottom: 20px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1.3;
  margin: 0 0 12px;
  letter-spacing: 0.5px;
}

.hero-desc {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

/* 插画区域：保留 3D 卡片优势，但调整颜色让其融入环境 */
.illustration-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 10px 0;
}

.floating-cards {
  position: relative;
  width: 200px;
  height: 200px;
}

/* 底层的卡片也变成半透明 */
.card-back {
  position: absolute;
  top: 15%;
  right: 15%;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  transform: rotate(15deg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* 顶层的主卡片 */
.card-front {
  position: absolute;
  bottom: 20%;
  left: 15%;
  width: 140px;
  height: 140px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  transform: rotate(-5deg);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.check-circle {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.dot {
  position: absolute;
  border-radius: 50%;
  z-index: 3;
}

.dot-blue {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  top: 20%;
  right: 10%;
}

.dot-green {
  width: 10px;
  height: 10px;
  background: #10b981;
  bottom: 35%;
  right: 5%;
}

.dot-orange {
  width: 6px;
  height: 6px;
  background: #f59e0b;
  bottom: 10%;
  left: 60%;
}

.glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  z-index: 0;
  pointer-events: none;
}

/* 底部特性列表 */
.feature-list {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
}

.feature-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 图标背景也变成毛玻璃半透明效果 */
.bg-glass-blue {
  background: rgba(59, 130, 246, 0.15);
}
.text-blue {
  color: #2563eb;
}
.bg-glass-green {
  background: rgba(16, 185, 129, 0.15);
}
.text-green {
  color: #059669;
}
.bg-glass-purple {
  background: rgba(139, 92, 246, 0.15);
}
.text-purple {
  color: #7c3aed;
}

.feature-text h4 {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 2px;
}

.feature-text p {
  font-size: 11px;
  color: #64748b;
  margin: 0;
  line-height: 1.3;
}

/* ======== 右侧表单区 ======== */
.card-right {
  flex: 0.9;
  padding: 48px 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.form-wrapper {
  width: 100%;
  max-width: 320px;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px;
}

.form-header p {
  font-size: 13px;
  color: #475569;
  margin: 0;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-action {
  position: absolute;
  right: 14px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.input-action:hover {
  color: #475569;
}

/* 结合截图优点的柔和半透明输入框，去掉生硬边框 */
.input-wrapper input {
  width: 100%;
  padding: 12px 40px;
  font-size: 14px;
  color: #1e293b;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.input-wrapper input:focus {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 13px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  cursor: pointer;
  user-select: none;
}

.remember-me input {
  width: 14px;
  height: 14px;
  accent-color: #1d1d1f;
  margin: 0;
  cursor: pointer;
}

.forgot-pwd {
  color: #1d1d1f;
  text-decoration: none;
}

.forgot-pwd:hover {
  text-decoration: underline;
}

.error-msg {
  font-size: 13px;
  color: #ef4444;
  margin-bottom: 16px;
  text-align: left;
}

/* 深邃黑色的提交按钮，极简高级感 */
.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: #1d1d1f;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  height: 44px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.submit-btn:hover:not(:disabled) {
  background: #333333;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.submit-btn:disabled {
  background: rgba(29, 29, 31, 0.5);
  cursor: not-allowed;
  box-shadow: none;
}

.loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
  margin-left: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: #64748b;
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.divider span {
  padding: 0 10px;
}

.social-login {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

/* 社交按钮也变微透明玻璃态 */
.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.7);
}

.toggle-mode {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin-top: 24px;
}

.toggle-mode a {
  color: #1d1d1f;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.toggle-mode a:hover {
  text-decoration: underline;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .login-card {
    width: 90%;
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    height: auto;
    max-height: 90vh;
    overflow-y: auto;
    width: 95%;
    min-height: auto;
  }

  .card-left {
    padding: 24px;
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .hero-title {
    font-size: 26px;
  }

  .illustration-container {
    display: none;
  }

  .feature-list {
    display: none;
  }

  .card-right {
    padding: 24px;
  }

  .form-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .login-card {
    width: 100%;
    border-radius: 0;
    max-height: 100vh;
    min-height: 100vh;
  }

  .card-left {
    padding: 20px 16px;
  }

  .hero-title {
    font-size: 22px;
  }

  .hero-desc {
    font-size: 12px;
  }

  .card-right {
    padding: 20px 16px;
  }
}
</style>

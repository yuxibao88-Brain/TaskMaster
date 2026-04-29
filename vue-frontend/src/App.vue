<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getUserList,
  addUser as addUserApi,
  editUser as editUserApi,
  deleteUser as deleteUserApi,
} from "@/api/user";

const users = ref([]);
const form = ref({ id: null, name: "", job: "", age: "" });
const dialogVisible = ref(false);
const isEdit = ref(false);
const loading = ref(false);

const loadUsers = async () => {
  loading.value = true;
  const res = await getUserList();
  users.value = res.data;
  loading.value = false;
};

// 打开添加弹窗
const openAddDialog = () => {
  isEdit.value = false;
  form.value = { id: null, name: "", job: "", age: "" };
  dialogVisible.value = true;
};

// 打开编辑弹窗
const openEditDialog = (row) => {
  isEdit.value = true;
  form.value = { ...row }; // 拷贝当前行数据回显
  dialogVisible.value = true;
};

// 提交表单（新增或编辑）
const submitForm = async () => {
  if (!form.value.name) return ElMessage.warning("请输入姓名");
  
  const payload = {
    name: form.value.name,
    job: form.value.job,
    age: Number(form.value.age),
  };

  if (isEdit.value) {
    payload.id = form.value.id;
    await editUserApi(payload);
    ElMessage.success("修改成功 ✨");
  } else {
    await addUserApi(payload);
    ElMessage.success("添加成功 🎉");
  }
  
  dialogVisible.value = false;
  loadUsers();
};

const deleteUser = async (id) => {
  await ElMessageBox.confirm("确定要删除该用户吗？", "提示", {
    type: "warning",
  });
  await deleteUserApi({ id });
  ElMessage.success("删除成功");
  loadUsers();
};

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="page">
    <!-- 顶部背景区域 -->
    <div class="header-bg">
      <div class="header-content">
        <h1>📋 用户管理系统</h1>
        <p>Node.js + Express + SQLite 全栈练习项目</p>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="main">
      <!-- 统计卡片 -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number">{{ users.length }}</div>
          <div class="stat-label">总用户数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">
            {{ users.filter((u) => u.job?.includes("前端")).length }}
          </div>
          <div class="stat-label">前端开发</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">
            {{ users.filter((u) => u.job?.includes("后端")).length }}
          </div>
          <div class="stat-label">后端开发</div>
        </div>
      </div>

      <!-- 表格区域 -->
      <el-card class="table-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">用户列表</span>
            <el-button type="primary" round @click="openAddDialog">
              + 添加用户
            </el-button>
          </div>
        </template>

        <el-table
          :data="users"
          v-loading="loading"
          stripe
          highlight-current-row
          style="width: 100%"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#333',
            fontWeight: 'bold',
          }"
        >
          <el-table-column prop="id" label="ID" width="70" align="center" />
          <el-table-column prop="name" label="姓名" min-width="100">
            <template #default="{ row }">
              <span class="user-name">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="job" label="职位" min-width="120">
            <template #default="{ row }">
              <el-tag v-if="row.job" size="small" effect="plain">
                {{ row.job }}
              </el-tag>
              <span v-else class="text-muted">未填写</span>
            </template>
          </el-table-column>
          <el-table-column prop="age" label="年龄" width="80" align="center" />
          <el-table-column label="操作" width="160" align="center">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                plain
                @click="openEditDialog(row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                plain
                @click="deleteUser(row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="420"
      :close-on-click-modal="false"
    >
      <el-form label-width="70px" :model="form">
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="form.job" placeholder="请输入职位" clearable />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number
            v-model="form.age"
            :min="1"
            :max="100"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">
          {{ isEdit ? '保存修改' : '确定添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f0f2f5;
}

/* 顶部渐变背景 */
.header-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50px 20px 80px;
  text-align: center;
}

.header-content h1 {
  color: #fff;
  font-size: 28px;
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.header-content p {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  margin: 0;
}

/* 主体内容上移，与顶部重叠 */
.main {
  max-width: 750px;
  margin: -40px auto 0;
  padding: 0 20px 40px;
}

/* 统计卡片 */
.stats {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

/* 表格卡片 */
.table-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.text-muted {
  color: #c0c4cc;
  font-size: 13px;
}
</style>

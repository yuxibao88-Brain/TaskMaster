<script setup>
import { ref, onMounted, nextTick } from "vue";
import { selectedDate } from "../store.js";

const calendarDates = ref([]);
const scrollArea = ref(null);
const visibleMonth = ref("");
const visibleYear = ref("");

const initCalendar = () => {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 生成过去 365 天到未来 365 天的数据
  for (let i = -365; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.push({
      full: `${d.getFullYear()}-${m}-${dd}`,
      date: String(d.getDate()),
      day: i === 0 ? "今天" : days[d.getDay()],
      isToday: i === 0,
    });
  }
  calendarDates.value = dates;
  visibleYear.value = String(today.getFullYear());
  visibleMonth.value = String(today.getMonth() + 1);
};

const centerDate = (dateStr, isSmooth = true) => {
  nextTick(() => {
    if (!scrollArea.value) return;
    const el = scrollArea.value.querySelector(`.calendar-day[data-date="${dateStr}"]`);
    if (el) {
      const containerHalf = scrollArea.value.clientWidth / 2;
      const elHalf = el.clientWidth / 2;
      const targetScroll = el.offsetLeft - scrollArea.value.offsetLeft - containerHalf + elHalf;
      scrollArea.value.scrollTo({
        left: targetScroll,
        behavior: isSmooth ? "smooth" : "auto",
      });
    }
  });
};

onMounted(() => {
  initCalendar();
  if (selectedDate.value) {
    centerDate(selectedDate.value, false);
  } else {
    // 默认居中今天
    const today = new Date();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    centerDate(`${today.getFullYear()}-${m}-${d}`, false);
  }
});

let scrollTimeout = null;
const handleScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (!scrollArea.value) return;
    const center = scrollArea.value.scrollLeft + scrollArea.value.clientWidth / 2;
    const children = scrollArea.value.querySelectorAll(".calendar-day");
    let closest = null;
    let minDiff = Infinity;
    
    children.forEach((child) => {
      // 计算每个子元素中心点相对于容器的位置
      const childCenter = child.offsetLeft + child.clientWidth / 2 - scrollArea.value.offsetLeft;
      const diff = Math.abs(childCenter - center);
      if (diff < minDiff) {
        minDiff = diff;
        closest = child;
      }
    });

    if (closest) {
      const fullDate = closest.getAttribute("data-date");
      if (fullDate) {
        const parts = fullDate.split("-");
        if (parts.length === 3) {
          visibleYear.value = parts[0];
          visibleMonth.value = parseInt(parts[1], 10).toString();
        }
      }
    }
  }, 50); // 节流
};

const toggleDateFilter = (dateStr) => {
  if (selectedDate.value === dateStr) {
    selectedDate.value = ""; // 取消选中
  } else {
    selectedDate.value = dateStr; // 选中过滤
    centerDate(dateStr);
  }
};

const selectToday = () => {
  const today = new Date();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const full = `${today.getFullYear()}-${m}-${d}`;
  selectedDate.value = full;
  centerDate(full);
};
</script>

<template>
  <div class="top-calendar-wrapper">
    <div class="ym-indicator">
      <div class="ym-text">
        <span class="ym-month">{{ visibleMonth }}月</span>
        <span class="ym-year">{{ visibleYear }}</span>
      </div>
      <button class="today-btn" @click="selectToday">今</button>
    </div>
    <div class="calendar-scroll-area" ref="scrollArea" @scroll="handleScroll">
      <div class="calendar-strip-horizontal">
        <div
          class="calendar-day"
          v-for="d in calendarDates"
          :key="d.full"
          :data-date="d.full"
          :class="{ active: selectedDate === d.full, 'is-today': d.isToday }"
          @click="toggleDateFilter(d.full)"
        >
          <span class="day-name">{{ d.day }}</span>
          <span class="day-num">{{ d.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-calendar-wrapper {
  margin-left: 24px;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 600px; /* 控制最大宽度避免挤占右侧空间 */
}

.ym-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

.ym-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.today-btn {
  background: #f1f3f4;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #1a73e8;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.today-btn:hover {
  background: #e8eaed;
  transform: translateY(-1px);
}

.ym-month {
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1.2;
}

.ym-year {
  font-size: 11px;
  font-weight: 500;
  color: #80868b;
}

/* 隐藏横向滚动条，保留滑动淡出效果 */
.calendar-scroll-area {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

.calendar-scroll-area::-webkit-scrollbar {
  display: none;
}

.calendar-strip-horizontal {
  display: flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  padding: 4px 16px; /* 为淡出留出空间 */
}

.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 52px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #5f6368;
  background: transparent;
  flex-shrink: 0;
}

.calendar-day:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.calendar-day.active {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.0) 100%);
  backdrop-filter: blur(12px) saturate(110%);
  -webkit-backdrop-filter: blur(12px) saturate(110%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-bottom-color: rgba(255, 255, 255, 0.1);
  border-right-color: rgba(255, 255, 255, 0.1);
  color: #1a73e8; /* 稍微用回一点品牌蓝，不然在一片透明中字容易不够精神 */
  font-weight: bold;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
}

.day-name {
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 2px;
}

.day-num {
  font-size: 15px;
  font-weight: 700;
}
</style>

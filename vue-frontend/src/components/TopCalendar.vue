<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { selectedDate } from "../store.js";

const calendarDates = ref([]);
const scrollArea = ref(null);
const visibleMonth = ref("");
const visibleYear = ref("");

const initCalendar = (baseDate = new Date()) => {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(baseDate);
  targetDate.setHours(0, 0, 0, 0);

  // 生成围绕 targetDate 的过去 365 天到未来 365 天的数据
  for (let i = -365; i <= 365; i++) {
    const d = new Date(targetDate);
    d.setDate(d.getDate() + i);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const isActuallyToday = d.getTime() === today.getTime();
    dates.push({
      full: `${d.getFullYear()}-${m}-${dd}`,
      date: String(d.getDate()),
      day: isActuallyToday ? "今天" : days[d.getDay()],
      isToday: isActuallyToday,
    });
  }
  calendarDates.value = dates;
  visibleYear.value = String(targetDate.getFullYear());
  visibleMonth.value = String(targetDate.getMonth() + 1);
};

const showPicker = ref(false);
const pickerYear = ref(new Date().getFullYear());

const openPicker = () => {
  pickerYear.value =
    parseInt(visibleYear.value, 10) || new Date().getFullYear();
  showPicker.value = true;
};

const selectMonth = (m) => {
  showPicker.value = false;
  const newDate = new Date(pickerYear.value, m - 1, 1);
  initCalendar(newDate);

  const targetStr = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}-01`;
  selectedDate.value = targetStr;
  nextTick(() => {
    centerDate(targetStr, false);
  });
};

const centerDate = (dateStr, isSmooth = true) => {
  nextTick(() => {
    if (!scrollArea.value) return;
    const el = scrollArea.value.querySelector(
      `.calendar-day[data-date="${dateStr}"]`,
    );
    if (el) {
      const containerHalf = scrollArea.value.clientHeight / 2;
      const elHalf = el.clientHeight / 2;
      const targetScroll =
        el.offsetTop - scrollArea.value.offsetTop - containerHalf + elHalf;
      scrollArea.value.scrollTo({
        top: targetScroll,
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
    const center =
      scrollArea.value.scrollTop + scrollArea.value.clientHeight / 2;
    const children = scrollArea.value.querySelectorAll(".calendar-day");
    let closest = null;
    let minDiff = Infinity;

    children.forEach((child) => {
      // 计算每个子元素中心点相对于容器的位置
      const childCenter =
        child.offsetTop + child.clientHeight / 2 - scrollArea.value.offsetTop;
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
  initCalendar(today);
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const full = `${today.getFullYear()}-${m}-${d}`;
  selectedDate.value = full;
  nextTick(() => {
    centerDate(full);
  });
};
</script>

<template>
  <div class="top-calendar-wrapper">
    <div class="ym-indicator">
      <div class="ym-text" @click="openPicker">
        <span class="ym-month">{{ visibleMonth }}月</span>
        <span class="ym-year">{{ visibleYear }}</span>
      </div>

      <!-- 自定义精美年月选择弹窗 -->
      <div
        class="picker-overlay"
        v-if="showPicker"
        @click="showPicker = false"
      ></div>
      <div class="custom-picker-popup" v-if="showPicker">
        <div class="picker-header">
          <button @click="pickerYear--">&lt;</button>
          <span>{{ pickerYear }}年</span>
          <button @click="pickerYear++">&gt;</button>
        </div>
        <div class="picker-months">
          <div
            class="picker-month"
            v-for="m in 12"
            :key="m"
            @click="selectMonth(m)"
            :class="{
              active:
                m === parseInt(visibleMonth, 10) &&
                pickerYear === parseInt(visibleYear, 10),
            }"
          >
            {{ m }}月
          </div>
        </div>
      </div>

      <button class="today-btn" @click="selectToday">今</button>
    </div>
    <div class="calendar-scroll-area" ref="scrollArea" @scroll="handleScroll">
      <div class="calendar-strip-vertical">
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
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 10px;
}

.ym-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 14px;
  margin-right: 10px;
  flex-shrink: 0;
  position: relative;
}

.ym-indicator::after {
  content: "";
  position: absolute;
  right: 0;
  top: 10%;
  height: 80%;
  width: 1px;
  background: rgba(0, 0, 0, 0.06);
}

.ym-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: opacity 0.2s;
}

.ym-text:hover {
  opacity: 0.7;
}

.ym-month {
  font-size: 16px;
  font-weight: 800;
  color: #1d1d1f;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.ym-year {
  font-size: 10px;
  font-weight: 600;
  color: #86868b;
  letter-spacing: 0.5px;
  margin-top: 1px;
}

.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 90;
}

.custom-picker-popup {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  width: 250px;
  background: rgba(255, 255, 255, 0.65); /* More transparent for deeper blur */
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 2px 10px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  z-index: 100;
  padding: 16px;
  transform-origin: top left;
  animation: popupFade 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes popupFade {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 800;
  font-size: 16px;
  color: #1d1d1f;
  padding: 0 4px;
}

.picker-header button {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007aff;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);
  transition: all 0.2s;
}

.picker-header button:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
}

.picker-months {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.picker-month {
  padding: 10px 0;
  text-align: center;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.6),
    0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.2s;
}

.picker-month:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.picker-month.active {
  background: rgba(0, 122, 255, 0.85);
  color: #fff;
  border: 1px solid rgba(0, 122, 255, 0.4);
  box-shadow:
    0 4px 12px rgba(0, 122, 255, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

.today-btn {
  background: #f2f2f7;
  border: 1px solid rgba(0, 0, 0, 0.02);
  border-radius: 10px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #007aff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  flex-shrink: 0;
}

.today-btn:hover {
  background: #e5e5ea;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.calendar-scroll-area {
  height: 48px;
  width: 48px;
  background: #f2f2f7;
  border-radius: 12px;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: y mandatory;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
}

.calendar-scroll-area::-webkit-scrollbar {
  display: none;
}

.calendar-strip-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  height: max-content;
  padding: 4px 0;
}

.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #8e8e93;
  background: transparent;
  flex-shrink: 0;
  scroll-snap-align: center;
}

.calendar-day:hover {
  color: #1d1d1f;
}

.day-name {
  font-size: 9px;
  font-weight: 500;
  margin-bottom: 1px;
}

.day-num {
  font-size: 14px;
  font-weight: 700;
}

.calendar-day.active {
  background: #ffffff;
  color: #007aff;
  transform: scale(0.92);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 0 0 0.5px rgba(0, 0, 0, 0.02);
}

.calendar-day.active .day-name {
  color: #007aff;
  opacity: 0.8;
}

.calendar-day.active .day-num {
  font-size: 15px;
  font-weight: 800;
}
</style>

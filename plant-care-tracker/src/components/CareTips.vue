<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <span class="icon has-text-success is-small">
          <i class="fas fa-lightbulb"></i>
        </span>
        养护小贴士
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <article
          v-for="(tip, index) in visibleTips"
          :key="index"
          class="media mb-3"
        >
          <figure class="media-left">
            <span class="icon is-small">
              <i :class="['fas', tip.icon, tip.color]"></i>
            </span>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong class="is-size-7">{{ tip.title }}</strong>
                <br />
                <span class="is-size-7 has-text-grey">{{ tip.content }}</span>
              </p>
            </div>
          </div>
        </article>

        <nav class="pagination is-centered" role="navigation" aria-label="pagination">
          <button
            class="pagination-previous is-small"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </button>
          <button
            class="pagination-next is-small"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            下一页
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentPage = ref(1)
const itemsPerPage = 3

const careTips = [
  {
    title: '浇水原则',
    content: '见干见湿，浇则浇透。不要让盆土积水，以免烂根。',
    icon: 'fa-tint',
    color: 'has-text-info'
  },
  {
    title: '光照管理',
    content: '大多数室内植物喜欢散射光，避免阳光直射灼伤叶片。',
    icon: 'fa-sun',
    color: 'has-text-warning'
  },
  {
    title: '施肥时机',
    content: '生长季节（春夏）每2-4周施肥一次，冬季休眠期停止施肥。',
    icon: 'fa-seedling',
    color: 'has-text-success'
  },
  {
    title: '温度控制',
    content: '大多数室内植物适宜温度为18-25°C，避免温度骤变。',
    icon: 'fa-thermometer-half',
    color: 'has-text-danger'
  },
  {
    title: '湿度调节',
    content: '热带植物喜欢高湿度环境，可经常向叶片喷水或使用加湿器。',
    icon: 'fa-cloud-rain',
    color: 'has-text-info'
  },
  {
    title: '换盆时机',
    content: '一般每年春季换盆一次，选择比原来大一号的花盆。',
    icon: 'fa-recycle',
    color: 'has-text-primary'
  },
  {
    title: '叶片清洁',
    content: '定期用湿布擦拭叶片，保持叶片清洁有利于光合作用。',
    icon: 'fa-leaf',
    color: 'has-text-success'
  },
  {
    title: '病虫害防治',
    content: '发现病虫害及时隔离处理，可使用肥皂水喷洒或专用杀虫剂。',
    icon: 'fa-shield-alt',
    color: 'has-text-warning'
  },
  {
    title: '通风重要性',
    content: '保持良好通风可预防真菌病害，但要避免冷风直吹。',
    icon: 'fa-wind',
    color: 'has-text-info'
  }
]

const totalPages = computed(() => Math.ceil(careTips.length / itemsPerPage))

const visibleTips = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return careTips.slice(start, start + itemsPerPage)
})
</script>

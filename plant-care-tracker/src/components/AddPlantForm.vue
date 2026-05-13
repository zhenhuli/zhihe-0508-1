<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <span class="icon has-text-success">
          <i class="fas fa-plus-circle"></i>
        </span>
        添加新植物
      </p>
    </header>
    <div class="card-content">
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label class="label">选择预设植物</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="selectedPreset" @change="applyPreset">
                <option value="">-- 选择常见植物 --</option>
                <option v-for="plant in presets" :key="plant.name" :value="plant.name">
                  {{ plant.name }}
                </option>
              </select>
            </div>
          </div>
          <p class="help is-info">选择预设植物可自动填充养护信息</p>
        </div>

        <div class="field">
          <label class="label">植物名称</label>
          <div class="control">
            <input
              v-model="form.name"
              class="input"
              type="text"
              placeholder="例如：绿萝"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label">植物品种</label>
          <div class="control">
            <input
              v-model="form.species"
              class="input"
              type="text"
              placeholder="例如：Epipremnum aureum"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">植物图片URL</label>
          <div class="control">
            <input
              v-model="form.image"
              class="input"
              type="url"
              placeholder="可选，输入图片链接"
            />
          </div>
          <div v-if="form.image" class="mt-2">
            <figure class="image is-128x128">
              <img :src="form.image" alt="预览" class="has-background-light" style="object-fit: cover;" />
            </figure>
          </div>
        </div>

        <div class="field">
          <label class="label">浇水间隔（天）</label>
          <div class="control">
            <input
              v-model.number="form.wateringInterval"
              class="input"
              type="number"
              min="1"
              placeholder="例如：7"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label">施肥间隔（天）</label>
          <div class="control">
            <input
              v-model.number="form.fertilizingInterval"
              class="input"
              type="number"
              min="1"
              placeholder="例如：30"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label">备注</label>
          <div class="control">
            <textarea
              v-model="form.notes"
              class="textarea"
              placeholder="记录一些养护小贴士..."
            ></textarea>
          </div>
        </div>

        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button type="button" class="button is-light" @click="resetForm">
              重置
            </button>
          </div>
          <div class="control">
            <button type="submit" class="button is-success">
              <span class="icon">
                <i class="fas fa-check"></i>
              </span>
              <span>添加植物</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePlantStore } from '../stores/plantStore'
import { plantPresets } from '../data/plantPresets'

const emit = defineEmits(['added'])

const { addPlant } = usePlantStore()

const presets = plantPresets
const selectedPreset = ref('')

const form = ref({
  name: '',
  species: '',
  image: '',
  wateringInterval: 7,
  fertilizingInterval: 30,
  notes: ''
})

const applyPreset = () => {
  if (selectedPreset.value) {
    const preset = presets.find(p => p.name === selectedPreset.value)
    if (preset) {
      form.value = {
        name: preset.name,
        species: preset.species,
        image: preset.image,
        wateringInterval: preset.wateringInterval,
        fertilizingInterval: preset.fertilizingInterval,
        notes: preset.notes
      }
    }
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    species: '',
    image: '',
    wateringInterval: 7,
    fertilizingInterval: 30,
    notes: ''
  }
  selectedPreset.value = ''
}

const handleSubmit = () => {
  addPlant(form.value)
  resetForm()
  emit('added')
}
</script>

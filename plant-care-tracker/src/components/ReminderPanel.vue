<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <span class="icon has-text-danger is-small">
          <i class="fas fa-bell"></i>
        </span>
        养护提醒
      </p>
    </header>
    <div class="card-content">
      <div v-if="plantsNeedingWater.length === 0 && plantsNeedingFertilizer.length === 0">
        <div class="notification is-success is-light">
          <div class="icon-text">
            <span class="icon is-small">
              <i class="fas fa-check-circle"></i>
            </span>
            <span class="is-size-7">所有植物养护状态良好！</span>
          </div>
        </div>
      </div>

      <div v-if="plantsNeedingWater.length > 0">
        <div class="notification is-info is-light mb-2">
          <div class="icon-text mb-2">
            <span class="icon is-small">
              <i class="fas fa-tint"></i>
            </span>
            <strong class="is-size-7">需要浇水 ({{ plantsNeedingWater.length }})</strong>
          </div>
          <div class="tags">
            <span
              v-for="plant in plantsNeedingWater"
              :key="plant.id"
              class="tag is-info"
            >
              {{ plant.name }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="plantsNeedingFertilizer.length > 0">
        <div class="notification is-warning is-light">
          <div class="icon-text mb-2">
            <span class="icon is-small">
              <i class="fas fa-seedling"></i>
            </span>
            <strong class="is-size-7">需要施肥 ({{ plantsNeedingFertilizer.length }})</strong>
          </div>
          <div class="tags">
            <span
              v-for="plant in plantsNeedingFertilizer"
              :key="plant.id"
              class="tag is-warning"
            >
              {{ plant.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="has-text-centered mt-2">
        <p class="is-size-7 has-text-grey">
          <span class="icon is-small">
            <i class="fas fa-sync-alt"></i>
          </span>
          数据自动刷新
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlantStore } from '../stores/plantStore'

const { plantsNeedingWater, plantsNeedingFertilizer } = usePlantStore()
</script>

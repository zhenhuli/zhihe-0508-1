<template>
  <div class="w-full h-full relative">
    <div ref="containerRef" class="w-full h-full"></div>
    
    <div class="fixed top-4 left-4 z-50">
      <div class="bg-dark-card/90 backdrop-blur-md rounded-2xl border border-dark-border p-6">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          3D Cube View
        </h1>
        <p class="text-sm text-text-secondary">
          交互式三维立方体展示
        </p>
      </div>
    </div>

    <ControlPanel
      v-if="showPanel"
      :settings="settings"
      @close="showPanel = false"
      @changeMaterial="handleChangeMaterial"
      @changeView="handleChangeView"
      @changeColor="handleChangeColor"
      @changeSpeed="handleChangeSpeed"
      @changeLight="handleChangeLight"
      @toggleRotation="handleToggleRotation"
      @resetView="handleResetView"
    />

    <FloatingButton
      v-if="!showPanel"
      @click="showPanel = true"
    />

    <div class="fixed bottom-6 left-6 z-50 hidden md:block">
      <div class="bg-dark-card/80 backdrop-blur-md rounded-xl border border-dark-border px-4 py-3">
        <div class="flex items-center gap-4 text-xs text-text-secondary">
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
            </svg>
            拖动旋转
          </span>
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/>
            </svg>
            滚轮缩放
          </span>
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/>
            </svg>
            右键平移
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, onMounted, onUnmounted } from 'vue';
import { CubeScene } from '@/modules/CubeScene';
import { OrbitController } from '@/modules/OrbitController';
import { defaultSettings } from '@/modules/StyleConfig';
import ControlPanel from '@/components/ControlPanel.vue';
import FloatingButton from '@/components/FloatingButton.vue';
const containerRef = ref(null);
const showPanel = ref(true);
const settings = ref({ ...defaultSettings });
let cubeScene = null;
let orbitController = null;
const initScene = () => {
 if (!containerRef.value)
 return;
 cubeScene = new CubeScene(containerRef.value);
 cubeScene.init();
 orbitController = new OrbitController(cubeScene.camera, cubeScene.renderer.domElement);
 const animate = () => {
 requestAnimationFrame(animate);
 if (orbitController) {
 orbitController.update();
 }
 };
 animate();
};
const handleChangeMaterial = (materialId) => {
 settings.value.currentMaterial = materialId;
 if (cubeScene) {
 cubeScene.setMaterial(materialId);
 }
};
const handleChangeView = (presetId) => {
 if (orbitController) {
 orbitController.goToPreset(presetId);
 }
};
const handleChangeColor = (color) => {
 settings.value.currentColor = color;
 if (cubeScene) {
 cubeScene.setCubeColor(color);
 }
};
const handleChangeSpeed = (speed) => {
 settings.value.rotationSpeed = speed;
 if (cubeScene) {
 cubeScene.setRotationSpeed(speed);
 }
};
const handleChangeLight = (intensity) => {
 settings.value.lightIntensity = intensity;
 if (cubeScene) {
 cubeScene.setLightIntensity(intensity);
 }
};
const handleToggleRotation = () => {
 if (cubeScene) {
 settings.value.isRotating = cubeScene.toggleRotation();
 }
};
const handleResetView = () => {
 if (orbitController) {
 orbitController.reset();
 }
};
onMounted(() => {
 initScene();
});
onUnmounted(() => {
 if (cubeScene) {
 cubeScene.dispose();
 }
 if (orbitController) {
 orbitController.dispose();
 }
});
</script>

<template>
  <div class="task-item" :class="{ completed: task.completed }">
    <div class="task-main">
      <label class="checkbox-wrapper">
        <input type="checkbox" v-model="task.completed" />
        <span class="checkmark"></span>
      </label>
      <span class="task-name">{{ task.name }}</span>
      <button 
        class="note-btn" 
        @click="toggleNote"
        :class="{ active: showNote || task.note }"
      >
        {{ task.note ? '📝' : '➕' }}
      </button>
    </div>
    <div v-if="showNote" class="note-section">
      <textarea 
        v-model="task.note" 
        placeholder="添加备注..."
        class="note-input"
        rows="2"
      ></textarea>
    </div>
    <div v-if="task.note && !showNote" class="note-preview">
      📝 {{ task.note }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  task: {
    type: Object,
    required: true
  }
})

const showNote = ref(false)

const toggleNote = () => {
  showNote.value = !showNote.value
}
</script>

<style scoped>
.task-item {
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.task-item:hover {
  background: #e9ecef;
}

.task-item.completed {
  opacity: 0.6;
}

.task-item.completed .task-name {
  text-decoration: line-through;
  color: #6c757d;
}

.task-main {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.checkbox-wrapper {
  position: relative;
  margin-right: 12px;
  cursor: pointer;
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 22px;
  width: 22px;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: inline-block;
  transition: all 0.3s ease;
}

.checkbox-wrapper:hover .checkmark {
  border-color: #667eea;
}

.checkbox-wrapper input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-wrapper input:checked ~ .checkmark:after {
  display: block;
}

.task-name {
  font-size: 15px;
  color: #333;
  flex: 1;
}

.note-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0.5;
}

.note-btn:hover {
  opacity: 1;
  background: rgba(102, 126, 234, 0.1);
}

.note-btn.active {
  opacity: 1;
}

.note-section {
  padding: 0 16px 12px;
}

.note-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background: white;
  transition: border-color 0.3s ease;
}

.note-input:focus {
  outline: none;
  border-color: #667eea;
}

.note-input::placeholder {
  color: #aaa;
}

.note-preview {
  padding: 0 16px 12px 50px;
  font-size: 13px;
  color: #666;
  font-style: italic;
  word-break: break-word;
}
</style>

import { defineComponent, ref, mergeProps, unref, watch, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TimeSlotEditor",
  __ssrInlineRender: true,
  props: {
    slot: {},
    colors: {}
  },
  emits: ["update", "delete"],
  setup(__props, { emit: __emit }) {
    const showColorPicker = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-xl shadow-sm p-4 mb-3 border border-gray-100" }, _attrs))}><div class="flex items-center gap-4"><div class="relative"><button class="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors" style="${ssrRenderStyle({ backgroundColor: __props.slot.color })}"></button>`);
      if (unref(showColorPicker)) {
        _push(`<div class="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-lg border z-10 grid grid-cols-4 gap-1"><!--[-->`);
        ssrRenderList(__props.colors, (color) => {
          _push(`<button class="w-8 h-8 rounded border border-gray-200 hover:scale-110 transition-transform" style="${ssrRenderStyle({ backgroundColor: color })}"></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex-1 grid grid-cols-12 gap-3"><div class="col-span-5"><label class="text-xs text-gray-500 mb-1 block">\u65F6\u6BB5</label><div class="flex items-center gap-2"><input type="time"${ssrRenderAttr("value", __props.slot.startTime)} class="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><span class="text-gray-400">-</span><input type="time"${ssrRenderAttr("value", __props.slot.endTime)} class="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div></div><div class="col-span-6"><label class="text-xs text-gray-500 mb-1 block">\u65E5\u7A0B\u6807\u7B7E</label><input type="text"${ssrRenderAttr("value", __props.slot.label)} placeholder="\u8F93\u5165\u65E5\u7A0B\u5185\u5BB9" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div></div><button class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="\u5220\u9664\u65F6\u6BB5"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TimeSlotEditor.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TimetablePreview",
  __ssrInlineRender: true,
  props: {
    data: {}
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const timetableRef = ref(null);
    const sortedSlots = computed(() => {
      return [...props.data.slots].sort(
        (a, b) => a.startTime.localeCompare(b.startTime)
      );
    });
    __expose({
      timetableRef
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "timetableRef",
        ref: timetableRef,
        class: "bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
      }, _attrs))}><h1 class="text-2xl font-bold text-center mb-6 text-gray-800">${ssrInterpolate(__props.data.title)}</h1><div class="space-y-2"><!--[-->`);
      ssrRenderList(unref(sortedSlots), (slot) => {
        _push(`<div class="flex items-center rounded-lg overflow-hidden shadow-sm"><div class="w-3 h-full min-h-[60px]" style="${ssrRenderStyle({ backgroundColor: slot.color })}"></div><div class="flex-1 px-4 py-3 bg-gray-50"><div class="font-semibold text-gray-800">${ssrInterpolate(slot.label)}</div><div class="text-sm text-gray-500">${ssrInterpolate(slot.startTime)} - ${ssrInterpolate(slot.endTime)}</div></div></div>`);
      });
      _push(`<!--]--></div><div class="mt-6 text-center text-sm text-gray-400"> \u751F\u6210\u65F6\u95F4: ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString())}</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TimetablePreview.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AddSlotModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    colors: {}
  },
  emits: ["close", "confirm"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const startTime = ref("09:00");
    const endTime = ref("10:00");
    const label = ref("\u65B0\u65F6\u6BB5");
    const selectedColor = ref("");
    watch(() => props.show, (newVal) => {
      if (newVal) {
        startTime.value = "09:00";
        endTime.value = "10:00";
        label.value = "\u65B0\u65F6\u6BB5";
        selectedColor.value = props.colors[0];
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.show) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center" data-v-9e2552be><div class="absolute inset-0 bg-black/50" data-v-9e2552be></div><div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" data-v-9e2552be><div class="flex items-center justify-between mb-6" data-v-9e2552be><h3 class="text-xl font-bold text-gray-800" data-v-9e2552be>\u6DFB\u52A0\u65B0\u65F6\u6BB5</h3><button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-v-9e2552be><svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-9e2552be><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-9e2552be></path></svg></button></div><div class="space-y-5" data-v-9e2552be><div data-v-9e2552be><label class="block text-sm font-medium text-gray-700 mb-2" data-v-9e2552be>\u65F6\u6BB5\u6807\u7B7E</label><input${ssrRenderAttr("value", unref(label))} type="text" placeholder="\u4F8B\u5982\uFF1A\u5DE5\u4F5C\u3001\u4F11\u606F\u3001\u5B66\u4E60" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" data-v-9e2552be></div><div data-v-9e2552be><label class="block text-sm font-medium text-gray-700 mb-2" data-v-9e2552be>\u65F6\u95F4</label><div class="flex items-center gap-3" data-v-9e2552be><input${ssrRenderAttr("value", unref(startTime))} type="time" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" data-v-9e2552be><span class="text-gray-400 font-medium" data-v-9e2552be>\u81F3</span><input${ssrRenderAttr("value", unref(endTime))} type="time" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" data-v-9e2552be></div></div><div data-v-9e2552be><label class="block text-sm font-medium text-gray-700 mb-3" data-v-9e2552be>\u9009\u62E9\u989C\u8272</label><div class="grid grid-cols-8 gap-2" data-v-9e2552be><!--[-->`);
          ssrRenderList(__props.colors, (color) => {
            _push2(`<button class="${ssrRenderClass([unref(selectedColor) === color ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200", "aspect-square rounded-lg border-2 transition-all hover:scale-110"])}" style="${ssrRenderStyle({ backgroundColor: color })}" data-v-9e2552be></button>`);
          });
          _push2(`<!--]--></div></div></div><div class="flex gap-3 mt-8" data-v-9e2552be><button class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors" data-v-9e2552be> \u53D6\u6D88 </button><button class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors" data-v-9e2552be> \u786E\u8BA4\u6DFB\u52A0 </button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddSlotModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9e2552be"]]);
const STORAGE_KEY = "routine-timetable-data";
const defaultColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16"
];
const defaultSlots = [
  { id: "1", startTime: "06:00", endTime: "07:00", label: "\u65E9\u8D77\u8FD0\u52A8", color: defaultColors[0] },
  { id: "2", startTime: "07:00", endTime: "08:00", label: "\u65E9\u9910", color: defaultColors[1] },
  { id: "3", startTime: "08:00", endTime: "12:00", label: "\u5DE5\u4F5C", color: defaultColors[2] },
  { id: "4", startTime: "12:00", endTime: "13:00", label: "\u5348\u9910", color: defaultColors[3] },
  { id: "5", startTime: "13:00", endTime: "18:00", label: "\u5DE5\u4F5C", color: defaultColors[2] },
  { id: "6", startTime: "18:00", endTime: "19:00", label: "\u665A\u9910", color: defaultColors[4] },
  { id: "7", startTime: "19:00", endTime: "21:00", label: "\u5B66\u4E60", color: defaultColors[5] },
  { id: "8", startTime: "21:00", endTime: "23:00", label: "\u4F11\u606F", color: defaultColors[6] }
];
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
const sortSlotsByTime = (slots) => {
  return [...slots].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );
};
function useTimetable() {
  const data = ref({
    title: "\u6211\u7684\u4F5C\u606F\u65F6\u95F4\u8868",
    slots: sortSlotsByTime([...defaultSlots])
  });
  const lastError = ref(null);
  const isHydrated = ref(false);
  watch(data, (newData) => {
    if (isHydrated.value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }
  }, { deep: true });
  const addSlot = (slotData) => {
    const nextId = Date.now().toString();
    const newSlot = slotData ? {
      id: nextId,
      ...slotData
    } : {
      id: nextId,
      startTime: "09:00",
      endTime: "10:00",
      label: "\u65B0\u65F6\u6BB5",
      color: defaultColors[data.value.slots.length % defaultColors.length]
    };
    const newSlots = [...data.value.slots, newSlot];
    data.value.slots = sortSlotsByTime(newSlots);
    lastError.value = null;
    return true;
  };
  const updateSlot = (id, updates) => {
    var _a, _b;
    const index = data.value.slots.findIndex((s) => s.id === id);
    if (index === -1) return false;
    const currentSlot = data.value.slots[index];
    const updatedSlot = { ...currentSlot, ...updates };
    const startTime = (_a = updates.startTime) != null ? _a : currentSlot.startTime;
    const endTime = (_b = updates.endTime) != null ? _b : currentSlot.endTime;
    const newSlots = [...data.value.slots];
    newSlots[index] = updatedSlot;
    data.value.slots = sortSlotsByTime(newSlots);
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      lastError.value = "\u7ED3\u675F\u65F6\u95F4\u5FC5\u987B\u665A\u4E8E\u5F00\u59CB\u65F6\u95F4";
    } else {
      lastError.value = null;
    }
    return true;
  };
  const deleteSlot = (id) => {
    data.value.slots = data.value.slots.filter((s) => s.id !== id);
  };
  const resetToDefault = () => {
    data.value = {
      title: "\u6211\u7684\u4F5C\u606F\u65F6\u95F4\u8868",
      slots: sortSlotsByTime([...defaultSlots])
    };
    lastError.value = null;
  };
  const clearError = () => {
    lastError.value = null;
  };
  return {
    data,
    addSlot,
    updateSlot,
    deleteSlot,
    resetToDefault,
    defaultColors,
    lastError,
    clearError
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { data, addSlot, updateSlot, deleteSlot, defaultColors: defaultColors2, lastError } = useTimetable();
    const activeTab = ref("edit");
    const previewRef = ref(null);
    const showAddModal = ref(false);
    const handleUpdateSlot = (id, updates) => {
      updateSlot(id, updates);
    };
    const handleDeleteSlot = (id) => {
      deleteSlot(id);
    };
    const handleModalConfirm = (slotData) => {
      addSlot(slotData);
      showAddModal.value = false;
    };
    const handleModalClose = () => {
      showAddModal.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TimeSlotEditor = _sfc_main$3;
      const _component_TimetablePreview = _sfc_main$2;
      const _component_AddSlotModal = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" }, _attrs))}><header class="bg-white shadow-sm border-b border-gray-100"><div class="max-w-6xl mx-auto px-4 py-4"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-800">\u4F5C\u606F\u65F6\u95F4\u8868\u7F16\u8F91\u5668</h1><p class="text-sm text-gray-500 mt-1">\u521B\u5EFA\u4F60\u7684\u4E13\u5C5E\u4F5C\u606F\u8BA1\u5212</p></div><div class="flex items-center gap-3"><button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"> \u91CD\u7F6E\u9ED8\u8BA4 </button>`);
      if (unref(activeTab) === "preview") {
        _push(`<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> \u5BFC\u51FA\u56FE\u7247 </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex gap-2 mt-4"><button class="${ssrRenderClass([unref(activeTab) === "edit" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200", "px-4 py-2 rounded-lg text-sm font-medium transition-colors"])}"> \u7F16\u8F91\u6A21\u5F0F </button><button class="${ssrRenderClass([unref(activeTab) === "preview" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200", "px-4 py-2 rounded-lg text-sm font-medium transition-colors"])}"> \u9884\u89C8\u6A21\u5F0F </button></div></div></header><main class="max-w-6xl mx-auto px-4 py-8">`);
      if (unref(activeTab) === "edit") {
        _push(`<div><div class="mb-6"><label class="text-sm font-medium text-gray-700 mb-2 block">\u65F6\u95F4\u8868\u6807\u9898</label><input${ssrRenderAttr("value", unref(data).title)} type="text" placeholder="\u8F93\u5165\u65F6\u95F4\u8868\u6807\u9898" class="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"></div><div class="mb-4 flex items-center justify-between"><h2 class="text-lg font-semibold text-gray-700">\u65F6\u6BB5\u5217\u8868</h2><span class="text-sm text-gray-500">${ssrInterpolate(unref(data).slots.length)} \u4E2A\u65F6\u6BB5</span></div>`);
        if (unref(lastError)) {
          _push(`<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${ssrInterpolate(unref(lastError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(data).slots, (slot) => {
          _push(ssrRenderComponent(_component_TimeSlotEditor, {
            key: slot.id,
            slot,
            colors: unref(defaultColors2),
            onUpdate: handleUpdateSlot,
            onDelete: handleDeleteSlot
          }, null, _parent));
        });
        _push(`<!--]--></div><button class="mt-4 w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> \u6DFB\u52A0\u65B0\u65F6\u6BB5 </button></div>`);
      } else {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_TimetablePreview, {
          ref_key: "previewRef",
          ref: previewRef,
          data: unref(data)
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</main>`);
      _push(ssrRenderComponent(_component_AddSlotModal, {
        show: unref(showAddModal),
        colors: unref(defaultColors2),
        onClose: handleModalClose,
        onConfirm: handleModalConfirm
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DPPKEEJP.mjs.map

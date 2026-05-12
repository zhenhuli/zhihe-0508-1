<script>
  import { categories, convert } from './lib/converters/index.js';

  let selectedCategory = 'length';
  let inputValue = 1;
  let fromUnit = 'meter';
  let toUnit = 'kilometer';
  let precision = 4;

  const categoryKeys = Object.keys(categories);
  const quickValues = [1, 10, 100, 1000];

  $: units = categories[selectedCategory]?.units || {};
  $: unitKeys = Object.keys(units);
  
  $: if (!unitKeys.includes(fromUnit)) {
    fromUnit = unitKeys[0] || '';
  }
  $: if (!unitKeys.includes(toUnit)) {
    toUnit = unitKeys[1] || unitKeys[0] || '';
  }

  $: result = convert(inputValue, selectedCategory, fromUnit, toUnit);
  
  $: formattedResult = isNaN(result) ? '0' : result.toFixed(precision);

  function swapUnits() {
    [fromUnit, toUnit] = [toUnit, fromUnit];
  }

  function setQuickValue(val) {
    inputValue = val;
  }

  function selectCategory(cat) {
    selectedCategory = cat;
  }

  function copyResult() {
    navigator.clipboard.writeText(formattedResult);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">🔢 全能单位转换器</h1>
      <p class="text-gray-600">支持 11 种类别，实时计算，快捷切换</p>
    </div>

    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div class="flex flex-wrap gap-2 justify-center">
          {#each categoryKeys as cat}
            <button
              on:click={() => selectCategory(cat)}
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all {selectedCategory === cat 
                ? 'bg-white text-indigo-600 shadow-md' 
                : 'bg-white/20 text-white hover:bg-white/30'}"
            >
              {categories[cat].icon} {categories[cat].name}
            </button>
          {/each}
        </div>
      </div>

      <div class="p-6">
        <div class="flex justify-center mb-6">
          <div class="bg-gray-100 rounded-xl p-1 flex gap-1">
            {#each quickValues as val}
              <button
                on:click={() => setQuickValue(val)}
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all {inputValue === val
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'}"
              >
                {val}
              </button>
            {/each}
          </div>
        </div>

        <div class="grid md:grid-cols-5 gap-4 items-center">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">输入数值</label>
            <input
              type="number"
              bind:value={inputValue}
              class="w-full px-4 py-3 text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              placeholder="输入数值"
            />
            <select
              bind:value={fromUnit}
              class="w-full mt-2 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
            >
              {#each unitKeys as key}
                <option value={key}>{units[key].name} ({units[key].symbol})</option>
              {/each}
            </select>
          </div>

          <div class="flex justify-center">
            <button
              on:click={swapUnits}
              class="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              title="交换单位"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">转换结果</label>
            <div 
              on:click={copyResult}
              class="w-full px-4 py-3 text-xl font-semibold border-2 border-green-200 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-all select-none"
              title="点击复制"
            >
              <span class="text-green-600">{formattedResult}</span>
            </div>
            <select
              bind:value={toUnit}
              class="w-full mt-2 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
            >
              {#each unitKeys as key}
                <option value={key}>{units[key].name} ({units[key].symbol})</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-center gap-4">
            <label class="text-sm font-medium text-gray-700">小数精度：</label>
            <input
              type="range"
              min="0"
              max="10"
              bind:value={precision}
              class="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span class="text-lg font-semibold text-blue-600 w-8">{precision}</span>
          </div>
          <p class="text-center text-xs text-gray-500 mt-2">拖动滑块调整结果的小数位数，点击结果可复制到剪贴板</p>
        </div>

        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {#each unitKeys as key}
            <button
              on:click={() => { fromUnit = key; }}
              class="px-3 py-2 text-xs rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all {fromUnit === key ? 'border-blue-500 bg-blue-100 text-blue-700 font-medium' : 'text-gray-600'}"
            >
              {units[key].symbol}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <div class="mt-6 text-center text-sm text-gray-500">
      <p>💡 提示：选择类别，输入数值，选择单位，实时转换</p>
    </div>
  </div>
</div>

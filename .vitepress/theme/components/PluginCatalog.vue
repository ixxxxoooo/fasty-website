<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed, ref } from 'vue'
import pluginsData from '../../../data/plugins.json'

interface PluginFeature {
  code: string
  explain: string
  keywords: string[]
}

interface PluginEntry {
  id: string
  name: string
  description: string
  category: string
  permissions: string[]
  features: PluginFeature[]
}

const CATEGORY_LABELS: Record<string, string> = {
  utility: '实用工具',
  development: '开发工具',
  network: '网络',
  system: '系统',
  media: '媒体',
  ai: 'AI 与智能',
}

const all = pluginsData as PluginEntry[]
const keyword = ref('')

const filtered = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return all
  return all.filter(p =>
    p.name.toLowerCase().includes(q)
    || p.description.toLowerCase().includes(q)
    || p.features.some(f => f.explain.toLowerCase().includes(q)),
  )
})

const grouped = computed(() => {
  const map = new Map<string, PluginEntry[]>()
  for (const plugin of filtered.value) {
    const list = map.get(plugin.category) ?? []
    list.push(plugin)
    map.set(plugin.category, list)
  }
  return [...map.entries()]
})
</script>

<template>
  <div class="plugin-catalog">
    <div class="plugin-toolbar">
      <input
        v-model="keyword"
        class="plugin-search"
        type="search"
        :placeholder="`搜索 ${all.length} 个内置插件…`"
        aria-label="搜索插件"
      >
    </div>

    <div v-for="[category, items] in grouped" :key="category" class="plugin-group">
      <h3 class="plugin-group-title">
        {{ CATEGORY_LABELS[category] || category }}
        <span class="plugin-group-count">{{ items.length }}</span>
      </h3>
      <div class="plugin-grid">
        <a
          v-for="plugin in items"
          :key="plugin.id"
          class="plugin-card"
          :href="withBase(`/plugins/${plugin.id}`)"
        >
          <div class="plugin-name">
            {{ plugin.name }}
          </div>
          <div v-if="plugin.description" class="plugin-desc">
            {{ plugin.description }}
          </div>
          <div v-if="plugin.features.some(f => f.explain)" class="plugin-tags">
            <span
              v-for="feature in plugin.features.filter(f => f.explain)"
              :key="feature.code"
              class="plugin-tag"
            >
              {{ feature.explain }}
            </span>
          </div>
        </a>
      </div>
    </div>

    <p v-if="grouped.length === 0" class="plugin-empty">
      没有找到匹配的插件
    </p>
  </div>
</template>

<style scoped>
.plugin-toolbar {
  margin: 20px 0 8px;
}

.plugin-search {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s, background-color 0.2s;
}

.plugin-search:focus {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.plugin-group {
  margin-top: 28px;
}

.plugin-group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  border-top: none;
}

.plugin-group-count {
  padding: 0 7px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: 999px;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.plugin-card {
  display: block;
  padding: 14px 16px;
  color: inherit;
  text-decoration: none;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: border-color 0.2s, transform 0.2s;
}

.plugin-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.plugin-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.plugin-desc {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.plugin-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.plugin-tag {
  padding: 2px 8px;
  font-size: 11px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
}

.plugin-empty {
  margin-top: 32px;
  text-align: center;
  color: var(--vp-c-text-3);
}
</style>

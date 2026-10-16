<template>
  <div>
    <button
      type="button"
      className="admin-trigger-btn"
      @click="isOpen = true"
      aria-label="Abrir painel administrativo"
    >
      <Settings style="width: 14px; height: 14px;" />
      <span>Painel do Admin</span>
    </button>

    <div v-if="isOpen" className="admin-drawer-overlay" @click="isOpen = false">
      <div className="admin-drawer" @click.stop>
        <div className="admin-drawer__header">
          <div className="admin-drawer__title">Administração LL Imports CWB (Vue)</div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            @click="isOpen = false"
            aria-label="Fechar painel"
          >
            <X />
          </button>
        </div>

        <div v-if="!isAdminLoggedIn" className="admin-drawer__body">
          <div className="admin-card">
            <h4>Acesso Administrativo</h4>
            <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1.25rem;">
              Painel para controle de modelos e gerenciamento de tags de qualidades disponíveis na vitrine (sem controle de estoque individual).
            </p>
            <form @submit.prevent="handleLogin">
              <div className="admin-form-group">
                <label>E-mail Autorizado</label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="admin@llimports.com.br"
                  v-model="email"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Senha</label>
                <input
                  type="password"
                  className="admin-input"
                  placeholder="••••••••"
                  v-model="password"
                />
              </div>
              <button type="submit" className="btn btn--primary" style="width: 100%; margin-top: 0.5rem;">
                Entrar no Modo Admin
              </button>
            </form>
          </div>
        </div>

        <template v-else>
          <!-- Abas de Navegação -->
          <div className="admin-tabs">
            <button
              type="button"
              :class="['admin-tab-btn', { 'is-active': activeTab === 'models' }]"
              @click="activeTab = 'models'"
            >
              <Package style="width: 14px; height: 14px; display: inline; margin-right: 6px;" />
              Modelos ({{ products.length }})
            </button>

            <button
              type="button"
              :class="['admin-tab-btn', { 'is-active': activeTab === 'tags' }]"
              @click="activeTab = 'tags'"
            >
              <Tag style="width: 14px; height: 14px; display: inline; margin-right: 6px;" />
              Tags de Qualidades
            </button>

            <button
              type="button"
              :class="['admin-tab-btn', { 'is-active': activeTab === 'sections' }]"
              @click="activeTab = 'sections'"
            >
              <Sliders style="width: 14px; height: 14px; display: inline; margin-right: 6px;" />
              Seções da Página
            </button>
          </div>

          <div className="admin-drawer__body">
            <!-- Alertas de Feedback -->
            <div
              v-if="successMsg"
              style="padding: 0.75rem; background: rgba(94, 224, 143, 0.1); border: 1px solid rgba(94, 224, 143, 0.3); color: var(--live); border-radius: 6px; font-size: var(--fs-xs); display: flex; align-items: center; gap: 6px;"
            >
              <CheckCircle2 style="width: 15px; height: 15px;" />
              {{ successMsg }}
            </div>

            <div
              v-if="errorMsg"
              style="padding: 0.75rem; background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3); color: #ff6b6b; border-radius: 6px; font-size: var(--fs-xs);"
            >
              {{ errorMsg }}
            </div>

            <!-- ABA 1: MODELOS DE APARELHOS -->
            <template v-if="activeTab === 'models'">
              <div className="admin-card">
                <h4>Cadastrar Modelo de Aparelho</h4>
                <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1.25rem;">
                  Cadastre os modelos de iPhone, MacBook, iPad e Apple Watch.
                </p>
                <form @submit.prevent="handleCreateModel">
                  <div className="admin-form-group">
                    <label>Nome Oficial do Modelo</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Ex: iPhone 16 Pro Max ou MacBook Pro 14″ M3"
                      v-model="modelName"
                      required
                    />
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div className="admin-form-group">
                      <label>Categoria</label>
                      <select className="admin-select" v-model="modelCategory">
                        <option value="iphone">iPhone</option>
                        <option value="macbook">MacBook</option>
                        <option value="ipad">iPad</option>
                        <option value="macmini">Mac mini</option>
                        <option value="watch">Apple Watch</option>
                        <option value="acessorios">Acessórios</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Linha Base</label>
                      <select className="admin-select" v-model="modelCondition">
                        <option value="novo">Novo Lacrado</option>
                        <option value="seminovo">Seminovo Selecionado</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>URL da Imagem de Referência (AWS S3)</label>
                    <input
                      type="url"
                      className="admin-input"
                      placeholder="https://seu-bucket.s3.amazonaws.com/produtos/modelo.webp"
                      v-model="modelImageUrl"
                    />
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div className="admin-form-group">
                      <label>Armazenamentos Suportados</label>
                      <input
                        type="text"
                        className="admin-input"
                        v-model="modelStorage"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Cores Suportadas</label>
                      <input
                        type="text"
                        className="admin-input"
                        v-model="modelColors"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn--primary" style="width: 100%; margin-top: 0.5rem;">
                    <Plus style="width: 16px; height: 16px;" />
                    Cadastrar Modelo de Aparelho
                  </button>
                </form>
              </div>

              <div className="admin-card">
                <h4>Modelos e Visibilidade na Vitrine</h4>
                <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1rem;">
                  Ative ou oculte modelos do catálogo em tempo real.
                </p>
                <div v-for="prod in products" :key="prod.id" className="admin-product-item">
                  <div>
                    <strong>{{ prod.name }}</strong>
                    <br />
                    <span>
                      {{ prod.category.toUpperCase() }} · {{ (prod.tags || prod.units || []).filter(t => t.is_available !== false).length }} tag(s) ativa(s)
                    </span>
                  </div>

                  <div style="display: flex; align-items: center; gap: 8px;">
                    <button
                      type="button"
                      :class="['btn btn--sm', prod.active !== false ? 'btn--primary' : 'btn--ghost']"
                      @click="$emit('toggle-model-active', prod.id)"
                      :title="prod.active !== false ? 'Modelo visível na vitrine' : 'Modelo oculto na vitrine'"
                    >
                      <template v-if="prod.active !== false">
                        <Eye style="width: 14px; height: 14px;" />
                        Ativo
                      </template>
                      <template v-else>
                        <EyeOff style="width: 14px; height: 14px;" />
                        Oculto
                      </template>
                    </button>

                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      @click="$emit('delete-product', prod.id)"
                      title="Remover Modelo"
                    >
                      <Trash2 style="width: 14px; height: 14px; color: #ff6b6b;" />
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- ABA 2: TAGS DE QUALIDADES (TABELA RELACIONAL SEM ESTOQUE NUMÉRICO) -->
            <template v-if="activeTab === 'tags'">
              <div className="admin-card">
                <h4>Vincular Tag de Qualidades ao Modelo</h4>
                <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1.25rem;">
                  Associe qualidades estéticas e de bateria aos aparelhos comercializados (sem controle de estoque individual).
                </p>
                <form @submit.prevent="handleCreateTag">
                  <div className="admin-form-group">
                    <label>Modelo do Aparelho</label>
                    <select className="admin-select" v-model="tagModelId">
                      <option v-for="p in products" :key="p.id" :value="p.id">
                        {{ p.name }} ({{ p.category.toUpperCase() }})
                      </option>
                    </select>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div className="admin-form-group">
                      <label>Qualidade do Aparelho</label>
                      <select className="admin-select" v-model="tagDeviceQuality">
                        <option v-for="dq in deviceQualities" :key="dq.slug" :value="dq.slug">
                          {{ dq.name }}
                        </option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Qualidade da Bateria</label>
                      <select className="admin-select" v-model="tagBatteryQuality">
                        <option v-for="bq in batteryQualities" :key="bq.slug" :value="bq.slug">
                          {{ bq.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Tag de Bateria Personalizada (opcional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Ex: 81% · 31 ciclos ou deixe em branco para usar a opção acima"
                      v-model="customBatteryText"
                    />
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div className="admin-form-group">
                      <label>Armazenamento</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Ex: 128GB ou 16GB / 512GB"
                        v-model="tagStorage"
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Cor</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Ex: Titânio Natural"
                        v-model="tagColor"
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Preço Sugerido em R$ (Anti-Erro: R$ 50 a R$ 60k)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Ex: 4299"
                      v-model="tagPrice"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn--primary" style="width: 100%; margin-top: 0.5rem;">
                    <Plus style="width: 16px; height: 16px;" />
                    Vincular Tag de Qualidade ao Modelo
                  </button>
                </form>
              </div>

              <!-- Lista de Tags Vinculadas por Modelo -->
              <div className="admin-card">
                <h4>Tags de Qualidades Vinculadas</h4>
                <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1rem;">
                  Alterne entre <strong>Disponível</strong> e <strong>Esgotado</strong> sem precisar gerenciar unidades físicas individuais.
                </p>
                <div v-for="prod in products" :key="prod.id">
                  <div
                    v-if="(prod.tags || prod.units || []).length > 0"
                    style="margin-bottom: 1.25rem;"
                  >
                    <div style="font-size: var(--fs-xs); font-weight: 600; color: var(--silver-2); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em;">
                      {{ prod.name }} ({{ (prod.tags || prod.units || []).length }} tags)
                    </div>
                    <div v-for="t in (prod.tags || prod.units || [])" :key="t.id" className="admin-unit-item">
                      <div className="admin-unit-item__row">
                        <div>
                          <strong>{{ t.storage }} · {{ t.color }}</strong>
                          <span style="margin-left: 8px; color: var(--silver-1); font-weight: 600;">
                            {{ formatPrice(t.price) }}
                          </span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <button
                            type="button"
                            :class="['admin-badge', t.is_available !== false ? 'admin-badge--active' : 'admin-badge--sold']"
                            @click="$emit('toggle-tag-availability', { modelId: prod.id, tagId: t.id })"
                            style="border: none; cursor: pointer;"
                            title="Clique para alternar entre Disponível e Esgotado"
                          >
                            {{ t.is_available !== false ? 'Disponível' : 'Esgotado' }}
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            @click="$emit('delete-tag', { modelId: prod.id, tagId: t.id })"
                            title="Excluir Tag"
                          >
                            <Trash2 style="width: 13px; height: 13px; color: #ff6b6b;" />
                          </button>
                        </div>
                      </div>
                      <div className="admin-unit-item__row" style="font-size: 0.6875rem; color: var(--text-2);">
                        <span>✨ {{ t.device_quality_name || formatAestheticGrade(t.device_quality_slug || t.aesthetic_grade) }}</span>
                        <span v-if="t.battery_quality_name || t.battery_health">
                          🔋 {{ t.battery_quality_name || `${t.battery_health}%` }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- ABA 3: SEÇÕES DA LANDING PAGE -->
            <template v-if="activeTab === 'sections'">
              <div className="admin-card">
                <h4>Visibilidade das Seções da Landing Page</h4>
                <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1rem;">
                  Ative ou oculte seções inteiras da landing page em tempo real.
                </p>
                <div v-for="sec in sections" :key="sec.key" className="admin-product-item">
                  <strong>Seção {{ sec.key.toUpperCase() }}</strong>
                  <button
                    type="button"
                    :class="['btn btn--sm', sec.visible ? 'btn--primary' : 'btn--ghost']"
                    @click="$emit('toggle-section', sec.key)"
                  >
                    {{ sec.visible ? 'Exibida' : 'Oculta' }}
                  </button>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Settings,
  X,
  Plus,
  Trash2,
  Battery,
  Eye,
  EyeOff,
  Package,
  Sliders,
  CheckCircle2,
  Tag
} from '@lucide/vue'
import {
  PRICE_MIN,
  PRICE_MAX,
  isValidPrice,
  formatPrice,
  formatAestheticGrade
} from '../../../shared/lib/format.js'
import { deviceQualities, batteryQualities } from '../lib/content.js'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  sections: {
    type: Array,
    required: true
  }
})

const emit = defineEmits([
  'add-product',
  'toggle-model-active',
  'delete-product',
  'update-price',
  'add-tag',
  'toggle-tag-availability',
  'delete-tag',
  'toggle-section'
])

const isOpen = ref(false)
const isAdminLoggedIn = ref(false)
const email = ref('')
const password = ref('')
const activeTab = ref('models')

const successMsg = ref('')
const errorMsg = ref('')

const triggerFeedback = (msg, isError = false) => {
  if (isError) {
    errorMsg.value = msg
    successMsg.value = ''
  } else {
    successMsg.value = msg
    errorMsg.value = ''
  }
  setTimeout(() => {
    successMsg.value = ''
    errorMsg.value = ''
  }, 4000)
}

const handleLogin = () => {
  if (email.value.trim()) {
    isAdminLoggedIn.value = true
    triggerFeedback('Sessão iniciada como Administrador!')
  }
}

// Formulário 1: Novo Modelo (Mecânica 1)
const modelName = ref('')
const modelCategory = ref('iphone')
const modelCondition = ref('novo')
const modelImageUrl = ref('')
const modelStorage = ref('128GB, 256GB')
const modelColors = ref('Preto, Titânio Natural')

const handleCreateModel = () => {
  if (!modelName.value.trim()) {
    triggerFeedback('Informe o nome do modelo.', true)
    return
  }

  const newModel = {
    id: 'model_' + Date.now(),
    name: modelName.value.trim(),
    category: modelCategory.value,
    condition: modelCondition.value,
    price: null,
    storage: modelStorage.value.split(',').map((s) => s.trim()).filter(Boolean),
    colors: modelColors.value.split(',').map((c) => c.trim()).filter(Boolean),
    image_url: modelImageUrl.value.trim() || null,
    badge: modelCondition.value === 'novo' ? 'Lacrado' : 'Seminovo',
    warranty: modelCondition.value === 'novo' ? '1 ano Apple' : 'Garantia da Loja',
    featured: false,
    active: true,
    position: props.products.length + 1,
    tags: []
  }

  emit('add-product', newModel)
  modelName.value = ''
  modelImageUrl.value = ''
  triggerFeedback(`Modelo "${newModel.name}" cadastrado com sucesso!`)
}

// Formulário 2: Nova Tag de Qualidade (Mecânica 2 - Relacional sem estoque)
const tagModelId = ref(props.products[0]?.id || '')
const tagDeviceQuality = ref('muito_bom')
const tagBatteryQuality = ref('bat_81_31c')
const customBatteryText = ref('')
const tagStorage = ref('128GB')
const tagColor = ref('Titânio Preto')
const tagPrice = ref('4299')

const handleCreateTag = () => {
  const targetModelId = tagModelId.value || props.products[0]?.id
  if (!targetModelId) {
    triggerFeedback('Selecione um modelo de aparelho.', true)
    return
  }

  const parsedPrice = parseFloat(tagPrice.value.replace(/\./g, '').replace(',', '.'))
  if (!isValidPrice(parsedPrice)) {
    triggerFeedback(`Preço inválido! Deve ser entre R$ ${PRICE_MIN} e R$ ${PRICE_MAX}.`, true)
    return
  }

  const devObj = deviceQualities.find((q) => q.slug === tagDeviceQuality.value)
  const devName = devObj ? devObj.name : formatAestheticGrade(tagDeviceQuality.value)

  const batObj = batteryQualities.find((b) => b.slug === tagBatteryQuality.value)
  const batName = customBatteryText.value.trim() || (batObj ? batObj.name : 'Bateria 100%')

  const newTag = {
    id: 'tag_' + Date.now(),
    device_quality_slug: tagDeviceQuality.value,
    device_quality_name: devName,
    battery_quality_slug: tagBatteryQuality.value,
    battery_quality_name: batName,
    battery_health: batObj?.health || 100,
    battery_cycles: batObj?.cycles || 0,
    storage: tagStorage.value.trim(),
    color: tagColor.value.trim(),
    price: parsedPrice,
    is_available: true,
    status: 'disponivel',
    warranty: tagDeviceQuality.value === 'novo_lacrado' ? '1 ano Apple' : 'Garantia da Loja'
  }

  emit('add-tag', { modelId: targetModelId, tag: newTag })
  triggerFeedback(`Tag vinculada ao modelo com sucesso! (${devName} · ${batName})`)
}
</script>

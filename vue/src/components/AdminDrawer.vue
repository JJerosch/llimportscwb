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
              Painel exclusivo para controle do catálogo de modelos, estoque de unidades com saúde de bateria e seções da loja.
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
              Mecânica 1: Modelos ({{ products.length }})
            </button>

            <button
              type="button"
              :class="['admin-tab-btn', { 'is-active': activeTab === 'units' }]"
              @click="activeTab = 'units'"
            >
              <Battery style="width: 14px; height: 14px; display: inline; margin-right: 6px;" />
              Mecânica 2: Estoque & Bateria
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
                <h4>Mecânica 1: Cadastrar Modelo no Catálogo</h4>
                <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1.25rem;">
                  Cadastre os modelos de iPhone, MacBook, iPad e Apple Watch comercializados.
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
                  Ative ou desative quais modelos aparecem para os clientes no catálogo em tempo real.
                </p>
                <div v-for="prod in products" :key="prod.id" className="admin-product-item">
                  <div>
                    <strong>{{ prod.name }}</strong>
                    <br />
                    <span>
                      {{ prod.category.toUpperCase() }} · {{ (prod.units || []).filter(u => u.status === 'disponivel').length }} unidade(s) disponível(is)
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

            <!-- ABA 2: UNIDADES EM ESTOQUE, GRAU ESTÉTICO E BATERIA -->
            <template v-if="activeTab === 'units'">
              <div className="admin-card">
                <h4>Mecânica 2: Cadastrar Unidade em Estoque</h4>
                <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1.25rem;">
                  Cadastre cada unidade física com saúde real da bateria (ex: 81%), ciclos (ex: 31) e grau estético.
                </p>
                <form @submit.prevent="handleCreateUnit">
                  <div className="admin-form-group">
                    <label>Modelo do Aparelho</label>
                    <select className="admin-select" v-model="unitModelId">
                      <option v-for="p in products" :key="p.id" :value="p.id">
                        {{ p.name }} ({{ p.category.toUpperCase() }})
                      </option>
                    </select>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div className="admin-form-group">
                      <label>Condição</label>
                      <select
                        className="admin-select"
                        v-model="unitCondition"
                        @change="onConditionChange"
                      >
                        <option value="seminovo">Seminovo Selecionado</option>
                        <option value="novo">Novo Lacrado</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Qualidade Estética</label>
                      <select className="admin-select" v-model="unitAesthetic">
                        <template v-if="unitCondition === 'novo'">
                          <option value="novo_lacrado">Novo Lacrado (Caixa lacrada)</option>
                        </template>
                        <template v-else>
                          <option value="excelente">Excelente (Grade A+ · Como novo)</option>
                          <option value="muito_bom">Muito Bom (Grade A · Mínimos sinais)</option>
                          <option value="bom_usado">Bom / Usado (Grade B · Marcas normais)</option>
                        </template>
                      </select>
                    </div>
                  </div>

                  <!-- Qualidade Específica da Bateria -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div className="admin-form-group">
                      <label>Saúde da Bateria (%)</label>
                      <input
                        type="number"
                        className="admin-input"
                        placeholder="Ex: 81 para 81%"
                        min="50"
                        max="100"
                        v-model="unitBatteryHealth"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Ciclos de Bateria</label>
                      <input
                        type="number"
                        className="admin-input"
                        placeholder="Ex: 31 para 31 ciclos"
                        min="0"
                        v-model="unitBatteryCycles"
                      />
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div className="admin-form-group">
                      <label>Armazenamento</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Ex: 128GB ou 16GB / 512GB"
                        v-model="unitStorage"
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Cor</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Ex: Titânio Natural"
                        v-model="unitColor"
                        required
                      />
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div className="admin-form-group">
                      <label>Preço em R$ (Anti-Erro: R$ 50 a R$ 60k)</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Ex: 4299"
                        v-model="unitPrice"
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Garantia</label>
                      <input
                        type="text"
                        className="admin-input"
                        v-model="unitWarranty"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn--primary" style="width: 100%; margin-top: 0.5rem;">
                    <Plus style="width: 16px; height: 16px;" />
                    Cadastrar Unidade no Estoque
                  </button>
                </form>
              </div>

              <!-- Lista de Unidades Cadastradas -->
              <div className="admin-card">
                <h4>Unidades em Estoque Cadastradas</h4>
                <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1rem;">
                  Visualize todas as unidades físicas disponíveis, alterne o status para vendido ou exclua.
                </p>
                <div v-for="prod in products" :key="prod.id">
                  <div
                    v-if="(prod.units || []).length > 0"
                    style="margin-bottom: 1.25rem;"
                  >
                    <div style="font-size: var(--fs-xs); fontWeight: 600; color: var(--silver-2); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em;">
                      {{ prod.name }} ({{ prod.units.length }} un)
                    </div>
                    <div v-for="u in prod.units" :key="u.id" className="admin-unit-item">
                      <div className="admin-unit-item__row">
                        <div>
                          <strong>{{ u.storage }} · {{ u.color }}</strong>
                          <span style="margin-left: 8px; color: var(--silver-1); font-weight: 600;">
                            {{ formatPrice(u.price) }}
                          </span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <button
                            type="button"
                            :class="['admin-badge', u.status === 'disponivel' ? 'admin-badge--active' : 'admin-badge--sold']"
                            @click="$emit('toggle-unit-status', { modelId: prod.id, unitId: u.id })"
                            style="border: none; cursor: pointer;"
                            title="Clique para alternar entre Disponível e Vendido"
                          >
                            {{ u.status === 'disponivel' ? 'Disponível' : 'Vendido' }}
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            @click="$emit('delete-unit', { modelId: prod.id, unitId: u.id })"
                            title="Excluir Unidade"
                          >
                            <Trash2 style="width: 13px; height: 13px; color: #ff6b6b;" />
                          </button>
                        </div>
                      </div>
                      <div className="admin-unit-item__row" style="font-size: 0.6875rem; color: var(--text-2);">
                        <span>✨ {{ formatAestheticGrade(u.aesthetic_grade) }}</span>
                        <span v-if="u.battery_health">
                          🔋 {{ u.battery_health }}% · {{ u.battery_cycles || 0 }} ciclos
                        </span>
                        <span>{{ u.warranty }}</span>
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
  CheckCircle2
} from '@lucide/vue'
import {
  PRICE_MIN,
  PRICE_MAX,
  isValidPrice,
  formatPrice,
  formatAestheticGrade
} from '../../../shared/lib/format.js'

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
  'add-unit',
  'toggle-unit-status',
  'delete-unit',
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
    units: []
  }

  emit('add-product', newModel)
  modelName.value = ''
  modelImageUrl.value = ''
  triggerFeedback(`Modelo "${newModel.name}" cadastrado com sucesso!`)
}

// Formulário 2: Nova Unidade em Estoque (Mecânica 2)
const unitModelId = ref(props.products[0]?.id || '')
const unitCondition = ref('seminovo')
const unitAesthetic = ref('excelente')
const unitBatteryHealth = ref('81')
const unitBatteryCycles = ref('31')
const unitStorage = ref('128GB')
const unitColor = ref('Titânio Preto')
const unitPrice = ref('4299')
const unitWarranty = ref('Garantia da Loja (3 meses)')

const onConditionChange = () => {
  if (unitCondition.value === 'novo') {
    unitAesthetic.value = 'novo_lacrado'
    unitBatteryHealth.value = '100'
    unitBatteryCycles.value = '0'
    unitWarranty.value = '1 ano Apple'
  } else {
    unitAesthetic.value = 'excelente'
    unitWarranty.value = 'Garantia da Loja (3 meses)'
  }
}

const handleCreateUnit = () => {
  const targetModelId = unitModelId.value || props.products[0]?.id
  if (!targetModelId) {
    triggerFeedback('Selecione um modelo de aparelho.', true)
    return
  }

  const parsedPrice = parseFloat(unitPrice.value.replace(/\./g, '').replace(',', '.'))
  if (!isValidPrice(parsedPrice)) {
    triggerFeedback(`Preço inválido! Deve ser entre R$ ${PRICE_MIN} e R$ ${PRICE_MAX}.`, true)
    return
  }

  let healthNum = unitBatteryHealth.value ? parseInt(unitBatteryHealth.value, 10) : null
  let cyclesNum = unitBatteryCycles.value ? parseInt(unitBatteryCycles.value, 10) : null

  if (healthNum !== null && (healthNum < 50 || healthNum > 100)) {
    triggerFeedback('A saúde da bateria deve ser entre 50% e 100%.', true)
    return
  }

  const newUnit = {
    id: 'unit_' + Date.now(),
    condition: unitCondition.value,
    aesthetic_grade: unitAesthetic.value,
    battery_health: healthNum,
    battery_cycles: cyclesNum,
    storage: unitStorage.value.trim(),
    color: unitColor.value.trim(),
    price: parsedPrice,
    status: 'disponivel',
    warranty: unitWarranty.value.trim()
  }

  emit('add-unit', { modelId: targetModelId, unit: newUnit })
  triggerFeedback(`Unidade adicionada ao estoque com sucesso! (${newUnit.storage} · ${newUnit.color})`)
}
</script>

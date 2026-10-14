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
          <div className="admin-drawer__title">Administração LL Imports (Vue)</div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            @click="isOpen = false"
            aria-label="Fechar painel"
          >
            <X />
          </button>
        </div>

        <div className="admin-drawer__body">
          <div v-if="!isAdminLoggedIn" className="admin-card">
            <h4>Login de Administrador</h4>
            <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1.25rem;">
              Apenas administradores autorizados podem alterar dados e catálogo da página.
            </p>
            <form @submit.prevent="handleLogin">
              <div className="admin-form-group">
                <label>E-mail do Administrador</label>
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

          <template v-else>
            <!-- Visibilidade das Seções -->
            <div className="admin-card">
              <h4>Visibilidade das Seções</h4>
              <p style="font-size: var(--fs-xs); color: var(--text-2); margin-bottom: 1rem;">
                Ative ou oculte seções da landing page em tempo real.
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

            <!-- Adicionar Produto -->
            <div className="admin-card">
              <h4>Cadastrar Novo Modelo no Catálogo</h4>
              <div v-if="errorMsg" style="color: #ff6b6b; font-size: var(--fs-xs); margin-bottom: 1rem;">
                {{ errorMsg }}
              </div>
              <form @submit.prevent="handleAdd">
                <div className="admin-form-group">
                  <label>Nome do Modelo</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Ex: MacBook Air 15″ M4"
                    v-model="newName"
                    required
                  />
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div className="admin-form-group">
                    <label>Categoria</label>
                    <select className="admin-select" v-model="newCategory">
                      <option value="iphone">iPhone</option>
                      <option value="macbook">MacBook</option>
                      <option value="ipad">iPad</option>
                      <option value="macmini">Mac mini</option>
                      <option value="watch">Apple Watch</option>
                      <option value="acessorios">Acessórios</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Condição</label>
                    <select className="admin-select" v-model="newCondition">
                      <option value="novo">Novo Lacrado</option>
                      <option value="seminovo">Seminovo Selecionado</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Preço em R$ (vazio = 'Consulte')</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Ex: 9999 (trava automática contra R$ 8 milhões)"
                    v-model="newPrice"
                  />
                </div>

                <div className="admin-form-group">
                  <label>URL da Imagem (AWS S3 ou CloudFront)</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://seu-bucket.s3.amazonaws.com/produtos/modelo.webp"
                    v-model="newImageUrl"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Armazenamentos (separados por vírgula)</label>
                  <input
                    type="text"
                    className="admin-input"
                    v-model="newStorage"
                  />
                </div>

                <button type="submit" className="btn btn--primary" style="width: 100%; margin-top: 0.5rem;">
                  <Plus style="width: 16px; height: 16px;" />
                  Adicionar Modelo ao Catálogo
                </button>
              </form>
            </div>

            <!-- Gerenciar Modelos Existentes -->
            <div className="admin-card">
              <h4>Modelos Cadastrados ({{ products.length }})</h4>
              <div v-for="prod in products" :key="prod.id" className="admin-product-item">
                <div>
                  <strong>{{ prod.name }}</strong>
                  <br />
                  <span>
                    {{ prod.condition.toUpperCase() }} · {{ formatPrice(prod.price) }}
                  </span>
                </div>

                <div style="display: flex; gap: 6px;">
                  <div v-if="editingId === prod.id" style="display: flex; gap: 4px;">
                    <input
                      type="text"
                      className="admin-input"
                      style="width: 80px; padding: 0.2rem 0.5rem;"
                      v-model="editingPrice"
                      placeholder="R$"
                    />
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      @click="handleSavePrice(prod.id)"
                    >
                      <Check style="width: 14px; height: 14px;" />
                    </button>
                  </div>
                  <button
                    v-else
                    type="button"
                    className="btn btn--ghost btn--sm"
                    @click="startEditPrice(prod)"
                    title="Alterar Preço"
                  >
                    <Edit3 style="width: 14px; height: 14px;" />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Settings, X, Plus, Trash2, Edit3, Check } from '@lucide/vue'
import { PRICE_MIN, PRICE_MAX, isValidPrice, formatPrice } from '../../../shared/lib/format.js'

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

const emit = defineEmits(['add-product', 'update-price', 'delete-product', 'toggle-section'])

const isOpen = ref(false)
const isAdminLoggedIn = ref(false)
const email = ref('')
const password = ref('')

const newName = ref('')
const newCategory = ref('iphone')
const newCondition = ref('novo')
const newPrice = ref('')
const newStorage = ref('128GB, 256GB')
const newImageUrl = ref('')
const errorMsg = ref('')

const editingId = ref(null)
const editingPrice = ref('')

const handleLogin = () => {
  if (email.value.trim()) {
    isAdminLoggedIn.value = true
  }
}

const handleAdd = () => {
  errorMsg.value = ''
  if (!newName.value.trim()) {
    errorMsg.value = 'Informe o nome do modelo.'
    return
  }

  let parsedPrice = null
  if (newPrice.value.trim()) {
    const num = parseFloat(newPrice.value.replace(/\./g, '').replace(',', '.'))
    if (!isValidPrice(num)) {
      errorMsg.value = `Preço inválido! Deve ser entre R$ ${PRICE_MIN} e R$ ${PRICE_MAX}.`
      return
    }
    parsedPrice = num
  }

  const prod = {
    id: 'prod_' + Date.now(),
    name: newName.value.trim(),
    category: newCategory.value,
    condition: newCondition.value,
    price: parsedPrice,
    storage: newStorage.value.split(',').map((s) => s.trim()).filter(Boolean),
    colors: ['Prata', 'Preto'],
    image_url: newImageUrl.value.trim() || null,
    badge: newCondition.value === 'novo' ? 'Lacrado' : 'Seminovo',
    warranty: newCondition.value === 'novo' ? '1 ano Apple' : 'Garantia loja',
    featured: false,
    active: true,
    position: props.products.length + 1
  }

  emit('add-product', prod)
  newName.value = ''
  newPrice.value = ''
  newImageUrl.value = ''
}

const startEditPrice = (prod) => {
  editingId.value = prod.id
  editingPrice.value = prod.price ? String(prod.price) : ''
}

const handleSavePrice = (id) => {
  const num = parseFloat(editingPrice.value.replace(/\./g, '').replace(',', '.'))
  if (!isNaN(num) && !isValidPrice(num)) {
    alert(`Preço fora da faixa permitida (R$ ${PRICE_MIN} a R$ ${PRICE_MAX})!`)
    return
  }
  emit('update-price', id, isNaN(num) ? null : num)
  editingId.value = null
}
</script>

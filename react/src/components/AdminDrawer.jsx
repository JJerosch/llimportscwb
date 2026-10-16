import { useState } from 'react'
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
} from 'lucide-react'
import {
  PRICE_MIN,
  PRICE_MAX,
  isValidPrice,
  formatPrice,
  formatAestheticGrade,
  formatBattery
} from '../../../shared/lib/format.js'
import { deviceQualities, batteryQualities } from '../lib/content.js'

export default function AdminDrawer({
  products,
  onAddProduct,
  onToggleModelActive,
  onDeleteProduct,
  onUpdatePrice,
  onAddTag,
  onToggleTagAvailability,
  onDeleteTag,
  sections,
  onToggleSection
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('models') // 'models' | 'tags' | 'sections'

  // Mensagens de feedback
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Formulário 1: Novo Modelo (Mecânica 1)
  const [modelName, setModelName] = useState('')
  const [modelCategory, setModelCategory] = useState('iphone')
  const [modelCondition, setModelCondition] = useState('novo')
  const [modelImageUrl, setModelImageUrl] = useState('')
  const [modelStorage, setModelStorage] = useState('128GB, 256GB')
  const [modelColors, setModelColors] = useState('Preto, Titânio Natural')

  // Formulário 2: Nova Tag de Qualidade (Mecânica 2 - Relacional sem estoque)
  const [tagModelId, setTagModelId] = useState(products[0]?.id || '')
  const [tagDeviceQuality, setTagDeviceQuality] = useState('muito_bom')
  const [tagBatteryQuality, setTagBatteryQuality] = useState('bat_81_31c')
  const [customBatteryText, setCustomBatteryText] = useState('')
  const [tagStorage, setTagStorage] = useState('128GB')
  const [tagColor, setTagColor] = useState('Titânio Preto')
  const [tagPrice, setTagPrice] = useState('4299')

  const triggerFeedback = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg)
      setSuccessMsg('')
    } else {
      setSuccessMsg(msg)
      setErrorMsg('')
    }
    setTimeout(() => {
      setSuccessMsg('')
      setErrorMsg('')
    }, 4000)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setIsAdminLoggedIn(true)
      triggerFeedback('Sessão iniciada como Administrador!')
    }
  }

  // Ação: Criar Novo Modelo de Aparelho
  const handleCreateModel = (e) => {
    e.preventDefault()
    if (!modelName.trim()) {
      triggerFeedback('Informe o nome do modelo.', true)
      return
    }

    const newModel = {
      id: 'model_' + Date.now(),
      name: modelName.trim(),
      category: modelCategory,
      condition: modelCondition,
      price: null,
      storage: modelStorage.split(',').map((s) => s.trim()).filter(Boolean),
      colors: modelColors.split(',').map((c) => c.trim()).filter(Boolean),
      image_url: modelImageUrl.trim() || null,
      badge: modelCondition === 'novo' ? 'Lacrado' : 'Seminovo',
      warranty: modelCondition === 'novo' ? '1 ano Apple' : 'Garantia da Loja',
      featured: false,
      active: true,
      position: products.length + 1,
      tags: []
    }

    onAddProduct(newModel)
    setModelName('')
    setModelImageUrl('')
    triggerFeedback(`Modelo "${newModel.name}" cadastrado com sucesso!`)
  }

  // Ação: Vincular Tag de Qualidades ao Modelo (Tabela Relacional)
  const handleCreateTag = (e) => {
    e.preventDefault()
    const targetModelId = tagModelId || products[0]?.id
    if (!targetModelId) {
      triggerFeedback('Selecione um modelo de aparelho.', true)
      return
    }

    // Validação de Preço (trava de segurança R$ 50 a R$ 60.000)
    const parsedPrice = parseFloat(tagPrice.replace(/\./g, '').replace(',', '.'))
    if (!isValidPrice(parsedPrice)) {
      triggerFeedback(`Preço inválido! Deve ser entre R$ ${PRICE_MIN} e R$ ${PRICE_MAX}.`, true)
      return
    }

    // Buscar nomes correspondentes das qualidades
    const devObj = deviceQualities.find((q) => q.slug === tagDeviceQuality)
    const devName = devObj ? devObj.name : formatAestheticGrade(tagDeviceQuality)

    const batObj = batteryQualities.find((b) => b.slug === tagBatteryQuality)
    const batName = customBatteryText.trim() || (batObj ? batObj.name : 'Bateria 100%')

    const newTag = {
      id: 'tag_' + Date.now(),
      device_quality_slug: tagDeviceQuality,
      device_quality_name: devName,
      battery_quality_slug: tagBatteryQuality,
      battery_quality_name: batName,
      battery_health: batObj?.health || 100,
      battery_cycles: batObj?.cycles || 0,
      storage: tagStorage.trim(),
      color: tagColor.trim(),
      price: parsedPrice,
      is_available: true,
      status: 'disponivel',
      warranty: tagDeviceQuality === 'novo_lacrado' ? '1 ano Apple' : 'Garantia da Loja'
    }

    onAddTag(targetModelId, newTag)
    triggerFeedback(`Tag vinculada ao modelo com sucesso! (${devName} · ${batName})`)
  }

  return (
    <>
      <button
        type="button"
        className="admin-trigger-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir painel administrativo"
      >
        <Settings style={{ width: 14, height: 14 }} />
        <span>Painel do Admin</span>
      </button>

      {isOpen && (
        <div className="admin-drawer-overlay" onClick={() => setIsOpen(false)}>
          <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer__header">
              <div className="admin-drawer__title">Administração LL Imports CWB</div>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar painel"
              >
                <X />
              </button>
            </div>

            {!isAdminLoggedIn ? (
              <div className="admin-drawer__body">
                <div className="admin-card">
                  <h4>Acesso Administrativo</h4>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
                    Painel para controle de modelos e gerenciamento de tags de qualidades disponíveis na vitrine (sem controle de estoque individual).
                  </p>
                  <form onSubmit={handleLogin}>
                    <div className="admin-form-group">
                      <label>E-mail Autorizado</label>
                      <input
                        type="email"
                        className="admin-input"
                        placeholder="admin@llimports.com.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Senha</label>
                      <input
                        type="password"
                        className="admin-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      Entrar no Modo Admin
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                {/* Abas de Navegação */}
                <div className="admin-tabs">
                  <button
                    type="button"
                    className={`admin-tab-btn ${activeTab === 'models' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('models')}
                  >
                    <Package style={{ width: 14, height: 14, display: 'inline', marginRight: 6 }} />
                    Modelos ({products.length})
                  </button>

                  <button
                    type="button"
                    className={`admin-tab-btn ${activeTab === 'tags' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('tags')}
                  >
                    <Tag style={{ width: 14, height: 14, display: 'inline', marginRight: 6 }} />
                    Tags de Qualidades
                  </button>

                  <button
                    type="button"
                    className={`admin-tab-btn ${activeTab === 'sections' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('sections')}
                  >
                    <Sliders style={{ width: 14, height: 14, display: 'inline', marginRight: 6 }} />
                    Seções da Página
                  </button>
                </div>

                <div className="admin-drawer__body">
                  {/* Alertas de Feedback */}
                  {successMsg && (
                    <div style={{ padding: '0.75rem', background: 'rgba(94, 224, 143, 0.1)', border: '1px solid rgba(94, 224, 143, 0.3)', color: 'var(--live)', borderRadius: 6, fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 style={{ width: 15, height: 15 }} />
                      {successMsg}
                    </div>
                  )}
                  {errorMsg && (
                    <div style={{ padding: '0.75rem', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)', color: '#ff6b6b', borderRadius: 6, fontSize: 'var(--fs-xs)' }}>
                      {errorMsg}
                    </div>
                  )}

                  {/* ABA 1: MODELOS DE APARELHOS */}
                  {activeTab === 'models' && (
                    <>
                      <div className="admin-card">
                        <h4>Cadastrar Modelo de Aparelho</h4>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
                          Cadastre os modelos de iPhone, MacBook, iPad e Apple Watch.
                        </p>
                        <form onSubmit={handleCreateModel}>
                          <div className="admin-form-group">
                            <label>Nome Oficial do Modelo</label>
                            <input
                              type="text"
                              className="admin-input"
                              placeholder="Ex: iPhone 16 Pro Max ou MacBook Pro 14″ M3"
                              value={modelName}
                              onChange={(e) => setModelName(e.target.value)}
                              required
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label>Categoria</label>
                              <select
                                className="admin-select"
                                value={modelCategory}
                                onChange={(e) => setModelCategory(e.target.value)}
                              >
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
                              <select
                                className="admin-select"
                                value={modelCondition}
                                onChange={(e) => setModelCondition(e.target.value)}
                              >
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
                              value={modelImageUrl}
                              onChange={(e) => setModelImageUrl(e.target.value)}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label>Armazenamentos Suportados</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={modelStorage}
                                onChange={(e) => setModelStorage(e.target.value)}
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Cores Suportadas</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={modelColors}
                                onChange={(e) => setModelColors(e.target.value)}
                              />
                            </div>
                          </div>

                          <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            <Plus style={{ width: 16, height: 16 }} />
                            Cadastrar Modelo de Aparelho
                          </button>
                        </form>
                      </div>

                      <div className="admin-card">
                        <h4>Modelos e Visibilidade na Vitrine</h4>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1rem' }}>
                          Ative ou oculte modelos do catálogo em tempo real.
                        </p>
                        {products.map((prod) => {
                          const tagsCount = (prod.tags || prod.units || []).filter((t) => t.is_available !== false).length
                          return (
                            <div key={prod.id} className="admin-product-item">
                              <div>
                                <strong>{prod.name}</strong>
                                <br />
                                <span>
                                  {prod.category.toUpperCase()} · {tagsCount} tag(s) ativa(s)
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                  type="button"
                                  className={`btn btn--sm ${prod.active !== false ? 'btn--primary' : 'btn--ghost'}`}
                                  onClick={() => onToggleModelActive(prod.id)}
                                  title={prod.active !== false ? 'Modelo visível na vitrine' : 'Modelo oculto na vitrine'}
                                >
                                  {prod.active !== false ? (
                                    <>
                                      <Eye style={{ width: 14, height: 14 }} />
                                      Ativo
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff style={{ width: 14, height: 14 }} />
                                      Oculto
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  className="btn btn--ghost btn--sm"
                                  onClick={() => onDeleteProduct(prod.id)}
                                  title="Remover Modelo"
                                >
                                  <Trash2 style={{ width: 14, height: 14, color: '#ff6b6b' }} />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}

                  {/* ABA 2: TAGS DE QUALIDADES (TABELA RELACIONAL SEM ESTOQUE NUMÉRICO) */}
                  {activeTab === 'tags' && (
                    <>
                      <div className="admin-card">
                        <h4>Vincular Tag de Qualidades ao Modelo</h4>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
                          Associe qualidades estéticas e de bateria aos aparelhos comercializados (sem controle de estoque individual).
                        </p>
                        <form onSubmit={handleCreateTag}>
                          <div className="admin-form-group">
                            <label>Modelo do Aparelho</label>
                            <select
                              className="admin-select"
                              value={tagModelId}
                              onChange={(e) => setTagModelId(e.target.value)}
                            >
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({p.category.toUpperCase()})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label>Qualidade do Aparelho</label>
                              <select
                                className="admin-select"
                                value={tagDeviceQuality}
                                onChange={(e) => setTagDeviceQuality(e.target.value)}
                              >
                                {deviceQualities.map((dq) => (
                                  <option key={dq.slug} value={dq.slug}>
                                    {dq.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="admin-form-group">
                              <label>Qualidade da Bateria</label>
                              <select
                                className="admin-select"
                                value={tagBatteryQuality}
                                onChange={(e) => setTagBatteryQuality(e.target.value)}
                              >
                                {batteryQualities.map((bq) => (
                                  <option key={bq.slug} value={bq.slug}>
                                    {bq.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="admin-form-group">
                            <label>Tag de Bateria Personalizada (opcional)</label>
                            <input
                              type="text"
                              className="admin-input"
                              placeholder="Ex: 81% · 31 ciclos ou deixe em branco para usar a opção acima"
                              value={customBatteryText}
                              onChange={(e) => setCustomBatteryText(e.target.value)}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label>Armazenamento</label>
                              <input
                                type="text"
                                className="admin-input"
                                placeholder="Ex: 128GB ou 16GB / 512GB"
                                value={tagStorage}
                                onChange={(e) => setTagStorage(e.target.value)}
                                required
                              />
                            </div>

                            <div className="admin-form-group">
                              <label>Cor</label>
                              <input
                                type="text"
                                className="admin-input"
                                placeholder="Ex: Titânio Natural"
                                value={tagColor}
                                onChange={(e) => setTagColor(e.target.value)}
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
                              value={tagPrice}
                              onChange={(e) => setTagPrice(e.target.value)}
                              required
                            />
                          </div>

                          <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            <Plus style={{ width: 16, height: 16 }} />
                            Vincular Tag de Qualidade ao Modelo
                          </button>
                        </form>
                      </div>

                      {/* Lista de Tags Vinculadas por Modelo */}
                      <div className="admin-card">
                        <h4>Tags de Qualidades Vinculadas</h4>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1rem' }}>
                          Alterne entre <strong>Disponível</strong> e <strong>Esgotado</strong> sem precisar gerenciar unidades físicas individuais.
                        </p>
                        {products.map((prod) => {
                          const tags = prod.tags || prod.units || []
                          if (tags.length === 0) return null
                          return (
                            <div key={prod.id} style={{ marginBottom: '1.25rem' }}>
                              <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--silver-2)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {prod.name} ({tags.length} tags)
                              </div>
                              {tags.map((t) => (
                                <div key={t.id} className="admin-unit-item">
                                  <div className="admin-unit-item__row">
                                    <div>
                                      <strong>{t.storage} · {t.color}</strong>
                                      <span style={{ marginLeft: 8, color: 'var(--silver-1)', fontWeight: 600 }}>
                                        {formatPrice(t.price)}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <button
                                        type="button"
                                        className={`admin-badge ${t.is_available !== false ? 'admin-badge--active' : 'admin-badge--sold'}`}
                                        onClick={() => onToggleTagAvailability(prod.id, t.id)}
                                        style={{ border: 'none', cursor: 'pointer' }}
                                        title="Clique para alternar entre Disponível e Esgotado"
                                      >
                                        {t.is_available !== false ? 'Disponível' : 'Esgotado'}
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn--ghost btn--sm"
                                        onClick={() => onDeleteTag(prod.id, t.id)}
                                        title="Excluir Tag"
                                      >
                                        <Trash2 style={{ width: 13, height: 13, color: '#ff6b6b' }} />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="admin-unit-item__row" style={{ fontSize: '0.6875rem', color: 'var(--text-2)' }}>
                                    <span>✨ {t.device_quality_name || formatAestheticGrade(t.device_quality_slug || t.aesthetic_grade)}</span>
                                    {(t.battery_quality_name || t.battery_health) && (
                                      <span>🔋 {t.battery_quality_name || `${t.battery_health}%`}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}

                  {/* ABA 3: SEÇÕES DA LANDING PAGE */}
                  {activeTab === 'sections' && (
                    <div className="admin-card">
                      <h4>Visibilidade das Seções da Landing Page</h4>
                      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1rem' }}>
                        Ative ou oculte seções inteiras da landing page em tempo real.
                      </p>
                      {sections.map((sec) => (
                        <div key={sec.key} className="admin-product-item">
                          <strong>Seção {sec.key.toUpperCase()}</strong>
                          <button
                            type="button"
                            className={`btn btn--sm ${sec.visible ? 'btn--primary' : 'btn--ghost'}`}
                            onClick={() => onToggleSection(sec.key)}
                          >
                            {sec.visible ? 'Exibida' : 'Oculta'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

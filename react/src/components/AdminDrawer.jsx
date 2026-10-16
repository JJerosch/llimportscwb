import { useState } from 'react'
import {
  Settings,
  X,
  Plus,
  Trash2,
  Check,
  Battery,
  Eye,
  EyeOff,
  Layers,
  Package,
  Sliders,
  CheckCircle2
} from 'lucide-react'
import {
  PRICE_MIN,
  PRICE_MAX,
  isValidPrice,
  formatPrice,
  formatAestheticGrade,
  formatBattery
} from '../../../shared/lib/format.js'

export default function AdminDrawer({
  products,
  onAddProduct,
  onToggleModelActive,
  onDeleteProduct,
  onUpdatePrice,
  onAddUnit,
  onToggleUnitStatus,
  onDeleteUnit,
  sections,
  onToggleSection
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('models') // 'models' | 'units' | 'sections'

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

  // Formulário 2: Nova Unidade em Estoque (Mecânica 2)
  const [unitModelId, setUnitModelId] = useState(products[0]?.id || '')
  const [unitCondition, setUnitCondition] = useState('seminovo')
  const [unitAesthetic, setUnitAesthetic] = useState('excelente')
  const [unitBatteryHealth, setUnitBatteryHealth] = useState('81')
  const [unitBatteryCycles, setUnitBatteryCycles] = useState('31')
  const [unitStorage, setUnitStorage] = useState('128GB')
  const [unitColor, setUnitColor] = useState('Titânio Preto')
  const [unitPrice, setUnitPrice] = useState('4299')
  const [unitWarranty, setUnitWarranty] = useState('Garantia da Loja (3 meses)')

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

  // Ação: Criar Novo Modelo (Mecânica 1)
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
      units: []
    }

    onAddProduct(newModel)
    setModelName('')
    setModelImageUrl('')
    triggerFeedback(`Modelo "${newModel.name}" cadastrado com sucesso!`)
  }

  // Ação: Criar Nova Unidade (Mecânica 2)
  const handleCreateUnit = (e) => {
    e.preventDefault()
    const targetModelId = unitModelId || products[0]?.id
    if (!targetModelId) {
      triggerFeedback('Selecione um modelo de aparelho.', true)
      return
    }

    // Validação de Preço (trava de segurança)
    const parsedPrice = parseFloat(unitPrice.replace(/\./g, '').replace(',', '.'))
    if (!isValidPrice(parsedPrice)) {
      triggerFeedback(`Preço inválido! Deve ser entre R$ ${PRICE_MIN} e R$ ${PRICE_MAX}.`, true)
      return
    }

    // Validação de Bateria
    let healthNum = unitBatteryHealth ? parseInt(unitBatteryHealth, 10) : null
    let cyclesNum = unitBatteryCycles ? parseInt(unitBatteryCycles, 10) : null

    if (healthNum !== null && (healthNum < 50 || healthNum > 100)) {
      triggerFeedback('A saúde da bateria deve ser entre 50% e 100%.', true)
      return
    }

    const newUnit = {
      id: 'unit_' + Date.now(),
      condition: unitCondition,
      aesthetic_grade: unitAesthetic,
      battery_health: healthNum,
      battery_cycles: cyclesNum,
      storage: unitStorage.trim(),
      color: unitColor.trim(),
      price: parsedPrice,
      status: 'disponivel',
      warranty: unitWarranty.trim()
    }

    onAddUnit(targetModelId, newUnit)
    triggerFeedback(`Unidade adicionada ao estoque com sucesso! (${newUnit.storage} · ${newUnit.color})`)
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
                    Painel exclusivo para controle do catálogo de modelos, estoque de unidades com saúde de bateria e seções da loja.
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
                    Mecânica 1: Modelos ({products.length})
                  </button>

                  <button
                    type="button"
                    className={`admin-tab-btn ${activeTab === 'units' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('units')}
                  >
                    <Battery style={{ width: 14, height: 14, display: 'inline', marginRight: 6 }} />
                    Mecânica 2: Estoque & Bateria
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
                        <h4>Mecânica 1: Cadastrar Modelo no Catálogo</h4>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
                          Cadastre os modelos de iPhone, MacBook, iPad e Apple Watch comercializados.
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
                          Ative ou desative quais modelos aparecem para os clientes no catálogo em tempo real.
                        </p>
                        {products.map((prod) => {
                          const unitsCount = (prod.units || []).filter((u) => u.status === 'disponivel').length
                          return (
                            <div key={prod.id} className="admin-product-item">
                              <div>
                                <strong>{prod.name}</strong>
                                <br />
                                <span>
                                  {prod.category.toUpperCase()} · {unitsCount} unidade(s) disponível(is)
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

                  {/* ABA 2: UNIDADES EM ESTOQUE, GRAU ESTÉTICO E BATERIA */}
                  {activeTab === 'units' && (
                    <>
                      <div className="admin-card">
                        <h4>Mecânica 2: Cadastrar Unidade em Estoque</h4>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
                          Cadastre cada unidade física com saúde real da bateria (ex: 81%), ciclos (ex: 31) e grau estético.
                        </p>
                        <form onSubmit={handleCreateUnit}>
                          <div className="admin-form-group">
                            <label>Modelo do Aparelho</label>
                            <select
                              className="admin-select"
                              value={unitModelId}
                              onChange={(e) => setUnitModelId(e.target.value)}
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
                              <label>Condição</label>
                              <select
                                className="admin-select"
                                value={unitCondition}
                                onChange={(e) => {
                                  const val = e.target.value
                                  setUnitCondition(val)
                                  if (val === 'novo') {
                                    setUnitAesthetic('novo_lacrado')
                                    setUnitBatteryHealth('100')
                                    setUnitBatteryCycles('0')
                                    setUnitWarranty('1 ano Apple')
                                  } else {
                                    setUnitAesthetic('excelente')
                                    setUnitWarranty('Garantia da Loja (3 meses)')
                                  }
                                }}
                              >
                                <option value="seminovo">Seminovo Selecionado</option>
                                <option value="novo">Novo Lacrado</option>
                              </select>
                            </div>

                            <div className="admin-form-group">
                              <label>Qualidade Estética</label>
                              <select
                                className="admin-select"
                                value={unitAesthetic}
                                onChange={(e) => setUnitAesthetic(e.target.value)}
                              >
                                {unitCondition === 'novo' ? (
                                  <option value="novo_lacrado">Novo Lacrado (Caixa lacrada)</option>
                                ) : (
                                  <>
                                    <option value="excelente">Excelente (Grade A+ · Como novo)</option>
                                    <option value="muito_bom">Muito Bom (Grade A · Mínimos sinais)</option>
                                    <option value="bom_usado">Bom / Usado (Grade B · Marcas normais)</option>
                                  </>
                                )}
                              </select>
                            </div>
                          </div>

                          {/* Qualidade Específica da Bateria */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label>Saúde da Bateria (%)</label>
                              <input
                                type="number"
                                className="admin-input"
                                placeholder="Ex: 81 para 81%"
                                min="50"
                                max="100"
                                value={unitBatteryHealth}
                                onChange={(e) => setUnitBatteryHealth(e.target.value)}
                              />
                            </div>

                            <div className="admin-form-group">
                              <label>Ciclos de Bateria</label>
                              <input
                                type="number"
                                className="admin-input"
                                placeholder="Ex: 31 para 31 ciclos"
                                min="0"
                                value={unitBatteryCycles}
                                onChange={(e) => setUnitBatteryCycles(e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label>Armazenamento</label>
                              <input
                                type="text"
                                className="admin-input"
                                placeholder="Ex: 128GB ou 16GB / 512GB"
                                value={unitStorage}
                                onChange={(e) => setUnitStorage(e.target.value)}
                                required
                              />
                            </div>

                            <div className="admin-form-group">
                              <label>Cor</label>
                              <input
                                type="text"
                                className="admin-input"
                                placeholder="Ex: Titânio Natural"
                                value={unitColor}
                                onChange={(e) => setUnitColor(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label>Preço em R$ (Anti-Erro: R$ 50 a R$ 60k)</label>
                              <input
                                type="text"
                                className="admin-input"
                                placeholder="Ex: 4299"
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value)}
                                required
                              />
                            </div>

                            <div className="admin-form-group">
                              <label>Garantia</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={unitWarranty}
                                onChange={(e) => setUnitWarranty(e.target.value)}
                              />
                            </div>
                          </div>

                          <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            <Plus style={{ width: 16, height: 16 }} />
                            Cadastrar Unidade no Estoque
                          </button>
                        </form>
                      </div>

                      {/* Lista de Unidades Cadastradas */}
                      <div className="admin-card">
                        <h4>Unidades em Estoque Cadastradas</h4>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1rem' }}>
                          Visualize todas as unidades físicas disponíveis, alterne o status para vendido ou exclua.
                        </p>
                        {products.map((prod) => {
                          const units = prod.units || []
                          if (units.length === 0) return null
                          return (
                            <div key={prod.id} style={{ marginBottom: '1.25rem' }}>
                              <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--silver-2)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {prod.name} ({units.length} un)
                              </div>
                              {units.map((u) => (
                                <div key={u.id} className="admin-unit-item">
                                  <div className="admin-unit-item__row">
                                    <div>
                                      <strong>{u.storage} · {u.color}</strong>
                                      <span style={{ marginLeft: 8, color: 'var(--silver-1)', fontWeight: 600 }}>
                                        {formatPrice(u.price)}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <button
                                        type="button"
                                        className={`admin-badge ${u.status === 'disponivel' ? 'admin-badge--active' : 'admin-badge--sold'}`}
                                        onClick={() => onToggleUnitStatus(prod.id, u.id)}
                                        style={{ border: 'none', cursor: 'pointer' }}
                                        title="Clique para alternar entre Disponível e Vendido"
                                      >
                                        {u.status === 'disponivel' ? 'Disponível' : 'Vendido'}
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn--ghost btn--sm"
                                        onClick={() => onDeleteUnit(prod.id, u.id)}
                                        title="Excluir Unidade"
                                      >
                                        <Trash2 style={{ width: 13, height: 13, color: '#ff6b6b' }} />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="admin-unit-item__row" style={{ fontSize: '0.6875rem', color: 'var(--text-2)' }}>
                                    <span>✨ {formatAestheticGrade(u.aesthetic_grade)}</span>
                                    {u.battery_health && (
                                      <span>🔋 {u.battery_health}% · {u.battery_cycles || 0} ciclos</span>
                                    )}
                                    <span>{u.warranty}</span>
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

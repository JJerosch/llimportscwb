import { useState } from 'react'
import { Settings, X, Plus, Trash2, Edit3, ShieldAlert, Check } from 'lucide-react'
import { PRICE_MIN, PRICE_MAX, isValidPrice, formatPrice } from '../../../shared/lib/format.js'

export default function AdminDrawer({
  products,
  onAddProduct,
  onUpdatePrice,
  onDeleteProduct,
  sections,
  onToggleSection
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Formulário de novo modelo
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('iphone')
  const [newCondition, setNewCondition] = useState('novo')
  const [newPrice, setNewPrice] = useState('')
  const [newStorage, setNewStorage] = useState('128GB, 256GB')
  const [newColors, setNewColors] = useState('Preto, Prata')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Edição inline de preço
  const [editingId, setEditingId] = useState(null)
  const [editingPrice, setEditingPrice] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Modo autenticado (se conectado ao Supabase ou simulação local aprovada)
    if (email.trim()) {
      setIsAdminLoggedIn(true)
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!newName.trim()) {
      setErrorMsg('Informe o nome do modelo.')
      return
    }

    let parsedPrice = null
    if (newPrice.trim()) {
      const num = parseFloat(newPrice.replace(/\./g, '').replace(',', '.'))
      if (!isValidPrice(num)) {
        setErrorMsg(`Preço inválido! Deve ser entre R$ ${PRICE_MIN} e R$ ${PRICE_MAX}.`)
        return
      }
      parsedPrice = num
    }

    const prod = {
      id: 'prod_' + Date.now(),
      name: newName.trim(),
      category: newCategory,
      condition: newCondition,
      price: parsedPrice,
      storage: newStorage.split(',').map((s) => s.trim()).filter(Boolean),
      colors: newColors.split(',').map((c) => c.trim()).filter(Boolean),
      image_url: newImageUrl.trim() || null,
      badge: newCondition === 'novo' ? 'Lacrado' : 'Seminovo',
      warranty: newCondition === 'novo' ? '1 ano Apple' : 'Garantia loja',
      featured: false,
      active: true,
      position: products.length + 1
    }

    onAddProduct(prod)
    setNewName('')
    setNewPrice('')
    setNewImageUrl('')
  }

  const handleSavePrice = (id) => {
    const num = parseFloat(editingPrice.replace(/\./g, '').replace(',', '.'))
    if (!isNaN(num) && !isValidPrice(num)) {
      alert(`Preço fora da faixa permitida (R$ ${PRICE_MIN} a R$ ${PRICE_MAX})!`)
      return
    }
    onUpdatePrice(id, isNaN(num) ? null : num)
    setEditingId(null)
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
              <div className="admin-drawer__title">Administração LL Imports</div>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar painel"
              >
                <X />
              </button>
            </div>

            <div className="admin-drawer__body">
              {!isAdminLoggedIn ? (
                <div className="admin-card">
                  <h4>Login de Administrador</h4>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
                    Apenas administradores autorizados podem alterar dados e catálogo da página.
                  </p>
                  <form onSubmit={handleLogin}>
                    <div className="admin-form-group">
                      <label>E-mail do Administrador</label>
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
              ) : (
                <>
                  {/* Visibilidade das Seções */}
                  <div className="admin-card">
                    <h4>Visibilidade das Seções</h4>
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginBottom: '1rem' }}>
                      Ative ou oculte seções da landing page em tempo real.
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

                  {/* Adicionar Produto */}
                  <div className="admin-card">
                    <h4>Cadastrar Novo Modelo no Catálogo</h4>
                    {errorMsg && (
                      <div style={{ color: '#ff6b6b', fontSize: 'var(--fs-xs)', marginBottom: '1rem' }}>
                        {errorMsg}
                      </div>
                    )}
                    <form onSubmit={handleAdd}>
                      <div className="admin-form-group">
                        <label>Nome do Modelo</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Ex: MacBook Air 15″ M4"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="admin-form-group">
                          <label>Categoria</label>
                          <select
                            className="admin-select"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
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
                          <label>Condição</label>
                          <select
                            className="admin-select"
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                          >
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
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>URL da Imagem (AWS S3 ou CloudFront)</label>
                        <input
                          type="url"
                          className="admin-input"
                          placeholder="https://seu-bucket.s3.amazonaws.com/produtos/modelo.webp"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Armazenamentos (separados por vírgula)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={newStorage}
                          onChange={(e) => setNewStorage(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        <Plus style={{ width: 16, height: 16 }} />
                        Adicionar Modelo ao Catálogo
                      </button>
                    </form>
                  </div>

                  {/* Gerenciar Modelos Existentes */}
                  <div className="admin-card">
                    <h4>Modelos Cadastrados ({products.length})</h4>
                    {products.map((prod) => (
                      <div key={prod.id} className="admin-product-item">
                        <div>
                          <strong>{prod.name}</strong>
                          <br />
                          <span>
                            {prod.condition.toUpperCase()} · {formatPrice(prod.price)}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          {editingId === prod.id ? (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <input
                                type="text"
                                className="admin-input"
                                style={{ width: '80px', padding: '0.2rem 0.5rem' }}
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(e.target.value)}
                                placeholder="R$"
                              />
                              <button
                                type="button"
                                className="btn btn--primary btn--sm"
                                onClick={() => handleSavePrice(prod.id)}
                              >
                                <Check style={{ width: 14, height: 14 }} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="btn btn--ghost btn--sm"
                              onClick={() => {
                                setEditingId(prod.id)
                                setEditingPrice(prod.price ? String(prod.price) : '')
                              }}
                              title="Alterar Preço"
                            >
                              <Edit3 style={{ width: 14, height: 14 }} />
                            </button>
                          )}

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
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

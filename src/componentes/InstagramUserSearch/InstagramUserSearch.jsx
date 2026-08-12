import { useEffect, useState } from 'react'
import estilos from './InstagramUserSearch.module.css'

const normalizarUsuario = (valor) => {
  const usuario = valor
    .replace(/\s/g, '')
    .replace(/[^a-zA-Z0-9._@]/g, '')
    .replace(/@/g, '')
    .slice(0, 30)

  return `@${usuario}`
}

function IconeInstagram() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle className={estilos.pontoIcone} cx="17.25" cy="6.75" r="1" /></svg>
}

function IconeBusca() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.25 4.25" /></svg>
}

export default function InstagramUserSearch({ onSearch = () => { } }) {
  const [usuario, setUsuario] = useState('@')
  const [minimizado, setMinimizado] = useState(false)

  useEffect(() => {
    const atualizarEstado = () => setMinimizado(window.scrollY > 120)
    atualizarEstado()
    window.addEventListener('scroll', atualizarEstado, { passive: true })
    return () => window.removeEventListener('scroll', atualizarEstado)
  }, [])

  const enviarBusca = (evento) => {
    evento.preventDefault()
    if (usuario.length > 1) onSearch(usuario)
  }

  return (
    <form className={`${estilos.container} ${minimizado ? estilos.minimizado : ''}`} onSubmit={enviarBusca}>
      <label className={estilos.rotulo} htmlFor="usuario-instagram">Buscar perfil no Instagram</label>
      <button className={estilos.atalhoPesquisa} type="button" onClick={() => setMinimizado(false)} aria-label="Abrir busca de perfil no Instagram"><IconeBusca /></button>
      <div className={estilos.campo}>
        <IconeInstagram />
        <input id="usuario-instagram" className={estilos.entrada} type="text" value={usuario} onChange={(evento) => setUsuario(normalizarUsuario(evento.target.value))} onFocus={() => { if (!usuario) setUsuario('@') }} placeholder="@usuario" autoComplete="off" autoCapitalize="none" spellCheck="false" aria-label="Usuário do Instagram" />
        <button className={estilos.botao} type="submit" aria-label="Buscar perfil do Instagram" disabled={usuario.length <= 1}>
          <IconeBusca />
          <span>Buscar</span>
        </button>
      </div>
    </form>
  )
}

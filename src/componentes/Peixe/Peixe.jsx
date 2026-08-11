import estilos from './Peixe.module.css'

export default function Peixe({ peixe, estaAberto, aoAbrir, aoAlternar }) {
  const nomeUsuario = `@${peixe.usuario.username}`
  const rotuloBotao = `${estaAberto ? 'Fechar' : 'Abrir'} perfil de ${nomeUsuario}`

  function lidarComFoco(evento) {
    if (!evento.currentTarget.matches(':focus-visible')) {
      return
    }

    aoAbrir(peixe.id, evento.currentTarget)
  }

  function lidarComEntradaPonteiro(evento) {
    if (evento.pointerType !== 'mouse') {
      return
    }

    aoAbrir(peixe.id, evento.currentTarget)
  }

  function lidarComClique(evento) {
    aoAlternar(peixe.id, evento.currentTarget)
  }

  return (
    <div className={estilos.conteudoPeixe}>
      <button
        type="button"
        className={estilos.botaoPeixe}
        aria-label={rotuloBotao}
        aria-expanded={estaAberto}
        aria-controls={`perfil-peixe-${peixe.id}`}
        onFocus={lidarComFoco}
        onPointerEnter={lidarComEntradaPonteiro}
        onClick={lidarComClique}
      >
        <img
          className={estilos.imagemPeixe}
          src={peixe.imagem}
          alt=""
          style={{
            width: `${peixe.tamanho}px`,
            filter: `hue-rotate(${(peixe.id * 45) % 360}deg)`,
            transform: `scaleX(${peixe.espelhado ? -1 : 1})`
          }}
        />
        <span className={estilos.nomeUsuario} style={{ '--cor-peixe': peixe.cor }}>
          {nomeUsuario}
        </span>
      </button>
    </div>
  )
}

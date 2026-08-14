import estilos from './Peixe.module.css'

export default function Peixe({ peixe, estaAberto, estaDestacado, aoRegistrar, aoAbrir, aoAlternar }) {
  const nomeUsuario = `@${peixe.user_name}`
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
        ref={(elemento) => aoRegistrar(peixe.id, elemento)}
        type="button"
        className={`${estilos.botaoPeixe} ${estaDestacado ? estilos.destacado : ''}`}
        data-usuario-id={peixe.id}
        aria-label={rotuloBotao}
        aria-expanded={estaAberto}
        aria-controls={`perfil-peixe-${peixe.id}`}
        onFocus={lidarComFoco}
        onPointerEnter={lidarComEntradaPonteiro}
        onClick={lidarComClique}
      >
        <img
          className={estilos.imagemPeixe}
          src={`/peixe${peixe.peixe_especie}.webp`}
          alt=""
          style={{
            width: `${peixe.peixe_tamanho}px`,
            filter: `hue-rotate(${(peixe.id * 45) % 360}deg)`,
            transform: `scaleX(${peixe.peixe_espelhado ? -1 : 1})`
          }}
        />
        <span className={estilos.nomeUsuario} style={{ '--cor-peixe': peixe.cor }}>
          {nomeUsuario}
        </span>
      </button>
    </div>
  )
}

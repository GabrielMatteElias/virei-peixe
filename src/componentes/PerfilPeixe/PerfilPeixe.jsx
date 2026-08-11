import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import estilos from './PerfilPeixe.module.css'

const margemViewport = 16
const distanciaAncora = 12

function limitar(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), Math.max(minimo, maximo))
}

function formatarData(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(data))
}

export default function PerfilPeixe({
  usuario,
  elementoAncora,
  aoRegistrarPerfil,
  aoFechar,
}) {
  const elementoPerfilRef = useRef(null)
  const [posicao, definirPosicao] = useState(null)

  useLayoutEffect(() => {
    function atualizarPosicao() {
      const elementoPerfil = elementoPerfilRef.current

      if (!elementoPerfil || !elementoAncora) {
        return
      }

      const retanguloAncora = elementoAncora.getBoundingClientRect()
      const retanguloPerfil = elementoPerfil.getBoundingClientRect()
      const espacoDireita = window.innerWidth - retanguloAncora.right
      const espacoEsquerda = retanguloAncora.left
      const abrirDireita = espacoDireita >= retanguloPerfil.width + distanciaAncora
        || espacoDireita >= espacoEsquerda
      const esquerdaDesejada = abrirDireita
        ? retanguloAncora.right + distanciaAncora
        : retanguloAncora.left - retanguloPerfil.width - distanciaAncora
      const topoDesejado = retanguloAncora.top
        + (retanguloAncora.height - retanguloPerfil.height) / 2

      definirPosicao({
        esquerda: limitar(
          esquerdaDesejada,
          margemViewport,
          window.innerWidth - retanguloPerfil.width - margemViewport,
        ),
        topo: limitar(
          topoDesejado,
          margemViewport,
          window.innerHeight - retanguloPerfil.height - margemViewport,
        ),
      })
    }

    atualizarPosicao()
    window.addEventListener('resize', atualizarPosicao)
    window.addEventListener('scroll', atualizarPosicao, true)

    return () => {
      window.removeEventListener('resize', atualizarPosicao)
      window.removeEventListener('scroll', atualizarPosicao, true)
    }
  }, [elementoAncora, usuario.id])

  function definirReferencia(elemento) {
    elementoPerfilRef.current = elemento
    aoRegistrarPerfil(elemento)
  }

  return createPortal(
    <aside
      ref={definirReferencia}
      id={`perfil-peixe-${usuario.id}`}
      className={estilos.perfilPeixe}
      aria-label={`Perfil de @${usuario.username}`}
      style={posicao ? { left: posicao.esquerda, top: posicao.topo } : undefined}
    >
      <button
        type="button"
        className={estilos.botaoFechar}
        onClick={aoFechar}
        aria-label={`Fechar perfil de @${usuario.username}`}
      >
        ×
      </button>

      <img className={estilos.foto} src={usuario.foto} alt="" />
      <div className={estilos.informacoes}>
        <strong className={estilos.nome}>{usuario.nome}</strong>
        <span className={estilos.usuario}>@{usuario.username}</span>
        <span className={estilos.dataCadastro}>
          Membro desde {formatarData(usuario.cadastradoEm)}
        </span>
      </div>
    </aside>,
    document.body,
  )
}

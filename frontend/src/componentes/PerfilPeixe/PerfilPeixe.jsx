import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import estilos from './PerfilPeixe.module.css'

const margemViewport = 16
const distanciaAncora = 12
const limiteMobile = 640

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

export default function PerfilPeixe({ usuario, elementoAncora, aoRegistrarPerfil, aoFechar, }) {
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
      const emMobile = window.matchMedia(`(max-width: ${limiteMobile}px)`).matches

      if (emMobile) {
        const espacoAbaixo = window.innerHeight - retanguloAncora.bottom - distanciaAncora
        const espacoAcima = retanguloAncora.top - distanciaAncora
        const abrirAbaixo = espacoAbaixo >= retanguloPerfil.height
          || espacoAbaixo >= espacoAcima
        const topoDesejado = abrirAbaixo
          ? retanguloAncora.bottom + distanciaAncora
          : retanguloAncora.top - retanguloPerfil.height - distanciaAncora

        definirPosicao({
          esquerda: limitar(
            retanguloAncora.left + (retanguloAncora.width - retanguloPerfil.width) / 2,
            margemViewport,
            window.innerWidth - retanguloPerfil.width - margemViewport,
          ),
          topo: limitar(
            topoDesejado,
            margemViewport,
            window.innerHeight - retanguloPerfil.height - margemViewport,
          ),
        })
        return
      }

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

  useEffect(() => {
    if (window.matchMedia(`(max-width: ${limiteMobile}px)`).matches) {
      return undefined
    }

    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) {
        aoFechar()
      }
    })

    observador.observe(elementoAncora)

    return () => observador.disconnect()
  }, [aoFechar, elementoAncora])

  function definirReferencia(elemento) {
    elementoPerfilRef.current = elemento
    aoRegistrarPerfil(elemento)
  }

  return createPortal(
    <aside
      ref={definirReferencia}
      id={`perfil-peixe-${usuario.id}`}
      className={estilos.perfilPeixe}
      aria-label={`Perfil de @${usuario.user_name}`}
      style={posicao ? { left: posicao.esquerda, top: posicao.topo } : undefined}
    >
      <button
        type="button"
        className={estilos.botaoFechar}
        onClick={aoFechar}
        aria-label={`Fechar perfil de @${usuario.user_name}`}
      >
        ×
      </button>

      <img className={estilos.foto} src={usuario.foto} alt="" referrerPolicy="no-referrer"  crossOrigin="anonymous"/>
      <div className={estilos.informacoes}>
        <strong className={estilos.nome}>{usuario.nome}</strong>
        <span className={estilos.usuario}>@{usuario.user_name}</span>
        <span className={estilos.dataCadastro}>
          Membro desde {formatarData(usuario.cadastrado_em)}
        </span>
      </div>
    </aside>,
    document.body,
  )
}

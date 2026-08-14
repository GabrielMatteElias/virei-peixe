import { useEffect, useRef, useState } from 'react'
import IndicadorProfundidade from '../IndicadorProfundidade/IndicadorProfundidade'
import { PlayerMini } from '../Player/Player'
import InstagramUserSearch from '../InstagramUserSearch/InstagramUserSearch'
import estilos from './Oceano.module.css'

const DISTANCIA_FADE = 220
const DISTANCIA_FADE_MOBILE = 150

export default function Oceano({ filhos, onSearch }) {
  const referenciaProfundidade = useRef(null)
  const [opacidadeDica, definirOpacidadeDica] = useState(1)

  useEffect(() => {
    let ticking = false
    let quadroDeAnimacao = null

    // Calcula a opacidade a partir do scroll atual, permitindo que a dica reapareça ao voltar ao topo.
    const atualizarOpacidade = () => {
      ticking = false
      const distanciaFade = window.matchMedia('(max-width: 654px)').matches
        ? DISTANCIA_FADE_MOBILE
        : DISTANCIA_FADE
      const novaOpacidade = Math.max(0, Math.min(1, 1 - (window.scrollY / distanciaFade)))

      definirOpacidadeDica((opacidadeAnterior) => (
        opacidadeAnterior === novaOpacidade ? opacidadeAnterior : novaOpacidade
      ))
    }

    // Limita a atualização de estado a uma execução por frame de animação.
    const lidarComScroll = () => {
      if (!ticking) {
        ticking = true
        quadroDeAnimacao = window.requestAnimationFrame(atualizarOpacidade)
      }
    }

    atualizarOpacidade()
    window.addEventListener('scroll', lidarComScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', lidarComScroll)

      if (quadroDeAnimacao !== null) {
        window.cancelAnimationFrame(quadroDeAnimacao)
      }
    }
  }, [])

  return (
    <main className={estilos.containerGeral}>
      <PlayerMini />
      <InstagramUserSearch onSearch={onSearch} />
      <IndicadorProfundidade referenciaProfundidade={referenciaProfundidade} />

      {/* Topo com a imagem da superfície */}
      <section className={estilos.superficie}>
        <div
          className={estilos.dicaScroll}
          style={{ opacity: opacidadeDica }}
          aria-hidden="true"
        >
          <span className={estilos.dicaTexto}>Continue descendo...</span>
          <svg
            className={estilos.dicaSeta}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Extensão contínua do oceano para abrigar os peixes */}
      <section ref={referenciaProfundidade} className={estilos.profundidade}>
        {filhos}
      </section>
    </main>
  )
}

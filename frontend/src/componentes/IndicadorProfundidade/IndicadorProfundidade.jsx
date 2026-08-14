import { useEffect, useRef } from 'react'
import estilos from './IndicadorProfundidade.module.css'

const METROS_POR_TELA = 5
const INICIO_ANTECIPADO_VH = 0.5

export default function IndicadorProfundidade({ referenciaProfundidade }) {
  const indicadorRef = useRef(null)
  const valorRef = useRef(null)

  useEffect(() => {
    let quadroDeAnimacao = null

    const atualizarProfundidade = () => {
      quadroDeAnimacao = null

      const areaProfundidade = referenciaProfundidade.current
      const indicador = indicadorRef.current
      const valor = valorRef.current

      if (!areaProfundidade || !indicador || !valor) {
        return
      }

      const topoDaProfundidade =
        window.scrollY + areaProfundidade.getBoundingClientRect().top

      const inicioDaProfundidade =
        topoDaProfundidade - window.innerHeight * INICIO_ANTECIPADO_VH
      const percursoDisponivel = Math.max(areaProfundidade.offsetHeight - window.innerHeight, 1)
      const progresso = Math.min(
        Math.max((window.scrollY - inicioDaProfundidade) / percursoDisponivel, 0),
        1,
      )
      const profundidadeMaxima = Math.round(
        (areaProfundidade.offsetHeight / window.innerHeight) * METROS_POR_TELA,
      )

      const metros = Math.round(progresso * profundidadeMaxima)
      const estaNaProfundidade = window.scrollY >= inicioDaProfundidade

      indicador.dataset.visivel = String(estaNaProfundidade)
      valor.textContent = `${metros} m`
      indicador.setAttribute('aria-label', `Profundidade atual: ${metros} metros`)
    }

    const agendarAtualizacao = () => {
      if (quadroDeAnimacao === null) {
        quadroDeAnimacao = window.requestAnimationFrame(atualizarProfundidade)
      }
    }

    atualizarProfundidade()
    window.addEventListener('scroll', agendarAtualizacao, { passive: true })
    window.addEventListener('resize', agendarAtualizacao)

    return () => {
      window.removeEventListener('scroll', agendarAtualizacao)
      window.removeEventListener('resize', agendarAtualizacao)

      if (quadroDeAnimacao !== null) {
        window.cancelAnimationFrame(quadroDeAnimacao)
      }
    }
  }, [referenciaProfundidade])

  return (
    <aside
      ref={indicadorRef}
      className={estilos.indicador}
      data-visivel="false"
      aria-label="Profundidade atual: 0 metros"
    >
      <span className={estilos.rotulo} aria-hidden="true">Profundidade</span>
      <span ref={valorRef} className={estilos.valor} aria-hidden="true">0 m</span>
    </aside>
  )
}

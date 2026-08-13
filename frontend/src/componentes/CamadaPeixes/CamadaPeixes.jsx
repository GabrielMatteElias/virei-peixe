import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Peixe from '../Peixe/Peixe'
import PerfilPeixe from '../PerfilPeixe/PerfilPeixe'
import estilos from './CamadaPeixes.module.css'

function calcularPosicaoX(peixe) {
  return peixe.peixe_lado === 'esquerda'
    ? `calc(50% - 60px - ${peixe.peixe_posicao_x}vw)`
    : `calc(50% + 60px + ${peixe.peixe_posicao_x}vw)`
}

const CamadaPeixes = forwardRef(function CamadaPeixes({ peixes = [] }, ref) {
  const [identificadorAberto, definirIdentificadorAberto] = useState(null)
  const [identificadorDestacado, definirIdentificadorDestacado] = useState(null)
  const [elementoAncora, definirElementoAncora] = useState(null)
  const identificadorAbertoRef = useRef(null)
  const perfilRef = useRef(null)
  const referenciasPeixes = useRef(new Map())
  const temporizadorInicioDestaqueRef = useRef(null)
  const temporizadorDestaqueRef = useRef(null)

  const fecharPerfil = useCallback(() => {
    identificadorAbertoRef.current = null
    definirIdentificadorAberto(null)
    definirElementoAncora(null)
  }, [])

  const abrirPerfil = useCallback((identificador, elemento) => {
    if (identificadorAbertoRef.current === identificador) {
      return
    }

    identificadorAbertoRef.current = identificador
    definirIdentificadorAberto(identificador)
    definirElementoAncora(elemento)
  }, [])

  const alternarPerfil = useCallback((identificador, elemento) => {
    if (identificadorAbertoRef.current === identificador) {
      fecharPerfil()
      return
    }

    abrirPerfil(identificador, elemento)
  }, [abrirPerfil, fecharPerfil])

  const registrarPerfil = useCallback((elemento) => {
    perfilRef.current = elemento
  }, [])

  const registrarPeixe = useCallback((identificador, elemento) => {
    if (elemento) {
      referenciasPeixes.current.set(identificador, elemento)
      return
    }

    referenciasPeixes.current.delete(identificador)
  }, [])

  useImperativeHandle(ref, () => ({
    localizarPeixePorUsuario(username) {
      const usernameNormalizado = username.replace(/^@/, '').toLowerCase()
      const peixe = peixes.find(
        (item) => item.user_name.toLowerCase() === usernameNormalizado,
      )
      const elemento = peixe && referenciasPeixes.current.get(peixe.id)

      if (!peixe || !elemento) {
        return
      }

      const retangulo = elemento.getBoundingClientRect()
      const destino = window.scrollY + retangulo.top + (retangulo.height / 2) - (window.innerHeight / 2)
      const distancia = Math.abs(destino - window.scrollY)

      window.scrollTo({ top: Math.max(0, destino), behavior: 'smooth' })

      window.clearTimeout(temporizadorInicioDestaqueRef.current)
      window.clearTimeout(temporizadorDestaqueRef.current)
      temporizadorInicioDestaqueRef.current = window.setTimeout(() => {
        definirIdentificadorDestacado(peixe.id)
        temporizadorDestaqueRef.current = window.setTimeout(() => {
          definirIdentificadorDestacado(null)
        }, 1700)
      }, Math.min(900, 250 + (distancia / 4)))
    },
  }), [peixes])

  useEffect(() => () => {
    window.clearTimeout(temporizadorInicioDestaqueRef.current)
    window.clearTimeout(temporizadorDestaqueRef.current)
  }, [])

  useEffect(() => {
    if (!identificadorAberto) {
      return undefined
    }

    function lidarComInteracaoExterna(evento) {
      const alvo = evento.target

      if (
        elementoAncora?.contains(alvo)
        || perfilRef.current?.contains(alvo)
      ) {
        return
      }

      fecharPerfil()
    }

    function lidarComTecla(evento) {
      if (evento.key === 'Escape') {
        fecharPerfil()
        elementoAncora?.focus()
      }
    }

    document.addEventListener('pointerdown', lidarComInteracaoExterna)
    document.addEventListener('focusin', lidarComInteracaoExterna)
    document.addEventListener('keydown', lidarComTecla)

    return () => {
      document.removeEventListener('pointerdown', lidarComInteracaoExterna)
      document.removeEventListener('focusin', lidarComInteracaoExterna)
      document.removeEventListener('keydown', lidarComTecla)
    }
  }, [elementoAncora, fecharPerfil, identificadorAberto])

  const peixeAberto = peixes.find(
    (peixe) => peixe.id === identificadorAberto,
  )

  return (
    <section className={estilos.camadaPeixes} aria-label="Peixes no oceano">
      {peixes.map((peixe) => (
        <div
          key={peixe.id}
          className={estilos.localizacaoPeixe}
          style={{
            '--posicao-x': calcularPosicaoX(peixe),
            '--posicao-y': `${peixe.peixe_profundidade}px`,
          }}
        >
          <Peixe
            peixe={peixe}
            estaAberto={peixe.id === identificadorAberto}
            estaDestacado={peixe.id === identificadorDestacado}
            aoRegistrar={registrarPeixe}
            aoAbrir={abrirPerfil}
            aoAlternar={alternarPerfil}
          />
        </div>
      ))}

      {peixeAberto && elementoAncora && (
        <PerfilPeixe
          usuario={peixeAberto}
          elementoAncora={elementoAncora}
          aoRegistrarPerfil={registrarPerfil}
          aoFechar={fecharPerfil}
        />
      )}
    </section>
  )
})

export default CamadaPeixes

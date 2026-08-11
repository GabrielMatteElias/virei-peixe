import { useCallback, useEffect, useRef, useState } from 'react'
import Peixe from '../Peixe/Peixe'
import PerfilPeixe from '../PerfilPeixe/PerfilPeixe'
import estilos from './CamadaPeixes.module.css'

function calcularPosicaoX(peixe) {
  return peixe.lado === 'esquerda'
    ? `calc(50% - 60px - ${peixe.offset}vw)`
    : `calc(50% + 60px + ${peixe.offset}vw)`
}

export default function CamadaPeixes({ peixes = [] }) {
  const [identificadorAberto, definirIdentificadorAberto] = useState(null)
  const [elementoAncora, definirElementoAncora] = useState(null)
  const identificadorAbertoRef = useRef(null)
  const perfilRef = useRef(null)

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
            '--posicao-y': `${peixe.profundidade}px`,
          }}
        >
          <Peixe
            peixe={peixe}
            estaAberto={peixe.id === identificadorAberto}
            aoAbrir={abrirPerfil}
            aoAlternar={alternarPerfil}
          />
        </div>
      ))}

      {peixeAberto && elementoAncora && (
        <PerfilPeixe
          usuario={peixeAberto.usuario}
          elementoAncora={elementoAncora}
          aoRegistrarPerfil={registrarPerfil}
          aoFechar={fecharPerfil}
        />
      )}
    </section>
  )
}

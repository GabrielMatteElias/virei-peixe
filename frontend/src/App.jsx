
import CamadaPeixes from './componentes/CamadaPeixes/CamadaPeixes'
import Oceano from './componentes/Oceano/Oceano'
import { useCallback, useEffect, useRef, useState } from 'react'
import estilos from './App.module.css'
import { buscarPeixes } from './services/usuariosService'

export default function App() {
  const camadaPeixesRef = useRef(null)

  const localizarUsuario = useCallback((username) => {
    camadaPeixesRef.current?.localizarPeixePorUsuario(username)
  }, [])

  const [peixes, setPeixes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarPeixes()
        setPeixes(dados)
      } catch (err) {
        setErro(err ? err.message : 'Erro inesperado')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  return (
    <div className={estilos.aplicacao}>
      <Oceano
        onSearch={localizarUsuario}
        filhos={<CamadaPeixes ref={camadaPeixesRef} peixes={peixes} />}
      />

      {carregando && (
        <div className={estilos.carregandoOverlay} role="status" aria-live="polite">
          <div className={estilos.spinner} aria-hidden="true" />
          <span>Carregando peixes...</span>
        </div>
      )}

      {!carregando && erro && (
        <div className={estilos.erroEstado} role="alert">
          <span>Não foi possível carregar os peixes.</span>
        </div>
      )}
    </div>
  )
}

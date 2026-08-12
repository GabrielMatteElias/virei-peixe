
import CamadaPeixes from './componentes/CamadaPeixes/CamadaPeixes'
import Oceano from './componentes/Oceano/Oceano'
import { useCallback, useRef } from 'react'
import { peixesIniciais } from './dados/peixes'
import estilos from './App.module.css'

export default function App() {
  const camadaPeixesRef = useRef(null)

  const localizarUsuario = useCallback((username) => {
    camadaPeixesRef.current?.localizarPeixePorUsuario(username)
  }, [])

  return (
    <div className={estilos.aplicacao}>
      <Oceano
        onSearch={localizarUsuario}
        filhos={<CamadaPeixes ref={camadaPeixesRef} peixes={peixesIniciais} />}
      />
    </div>
  )
}


import CamadaPeixes from './componentes/CamadaPeixes/CamadaPeixes'
import Oceano from './componentes/Oceano/Oceano'
import { peixesIniciais } from './dados/peixes'
import estilos from './App.module.css'

export default function App() {
  return (
    <div className={estilos.aplicacao}>
      <Oceano filhos={<CamadaPeixes peixes={peixesIniciais} />} />
    </div>
  )
}

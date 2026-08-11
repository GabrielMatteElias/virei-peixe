
import CamadaPeixes from './componentes/CamadaPeixes/CamadaPeixes'
import Oceano from './componentes/Oceano/Oceano'
import estilos from './App.module.css'

const peixesIniciais = [
  { id: 1, x: '40%', y: '-10%', elemento: <span style={{ fontSize: '50px', color: '#000' }}>1</span> },
  { id: 2, x: '300px', y: '220px', elemento: <span style={{ fontSize: '45px', color: '#1E40AF' }}>2</span> },
  { id: 3, x: '500px', y: '180px', elemento: <span style={{ fontSize: '60px', color: '#047857' }}>3</span> },
  { id: 4, x: '200px', y: '350px', elemento: <span style={{ fontSize: '40px', color: '#B45309' }}>4</span> },
  { id: 5, x: '650px', y: '400px', elemento: <span style={{ fontSize: '55px', color: '#6D28D9' }}>5</span> },
  { id: 6, x: '400px', y: '520px', elemento: <span style={{ fontSize: '48px', color: '#BE123C' }}>6</span> },
  { id: 7, x: '800px', y: '300px', elemento: <span style={{ fontSize: '52px', color: '#0369A1' }}>7</span> },
  { id: 8, x: '120px', y: '650px', elemento: <span style={{ fontSize: '42px', color: '#15803D' }}>8</span> },
  { id: 9, x: '750px', y: '700px', elemento: <span style={{ fontSize: '58px', color: '#A21CAF' }}>9</span> },
  { id: 10, x: '450px', y: '850px', elemento: <span style={{ fontSize: '50px', color: '#C2410C' }}>10</span> }
];

export default function App() {
  return (
    <div className={estilos.aplicacao}>
      <Oceano filhos={<CamadaPeixes peixes={peixesIniciais} />} />
    </div>
  )
}

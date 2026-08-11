import { PlayerMini } from '../Player/Player'
import estilos from './Oceano.module.css'

export default function Oceano({ filhos }) {
  return (
    <main className={estilos.containerGeral}>
      <PlayerMini />
      {/* Linha vertical centralizada acompanhando a tela */}
      <div className={estilos.linhaPesca} />

      {/* Topo com a imagem da superfície */}
      <section className={estilos.superficie} />

      {/* Extensão contínua do oceano para abrigar os peixes */}
      <section className={estilos.profundidade}>
        {filhos}
      </section>
    </main>
  )
}
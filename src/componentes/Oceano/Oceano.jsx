import { PlayerMini } from '../Player/Player'
import InstagramUserSearch from '../InstagramUserSearch/InstagramUserSearch'
import estilos from './Oceano.module.css'

export default function Oceano({ filhos, onSearch }) {
  return (
    <main className={estilos.containerGeral}>
      <PlayerMini />
      <InstagramUserSearch onSearch={onSearch} />
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

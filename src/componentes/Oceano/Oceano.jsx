import estilos from './Oceano.module.css'

export default function Oceano({ filhos }) {
  return (
    <main className={estilos.oceano}>
      {filhos}
    </main>
  )
}

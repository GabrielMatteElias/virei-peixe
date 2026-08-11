import estilos from './CamadaPeixes.module.css'

export default function CamadaPeixes({ peixes = [] }) {
  return (
    <section className={estilos.camadaPeixes} aria-label="Peixes no oceano">
      {peixes.map((peixe, indice) => {
        const identificadorPeixe = peixe.id ?? `peixe-${indice}`

        return (
          <div
            key={identificadorPeixe}
            className={estilos.peixe}
            style={{
              '--posicao-x': peixe.x,
              '--posicao-y': peixe.y,
            }}
          >
            {peixe.elemento}
          </div>
        )
      })}
    </section>
  )
}

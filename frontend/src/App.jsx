
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

  const [peixes, setPeixes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarPeixes();
        console.log(dados);

        setPeixes(dados);
      } catch (err) {
        setErro(err ? err.message : 'Erro inesperado');
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // if (carregando) return <p>Carregando peixes...</p>;
  // if (erro) return <p>Erro: {erro}</p>;

  return (
    <div className={estilos.aplicacao}>
      <Oceano
        onSearch={localizarUsuario}
        filhos={<CamadaPeixes ref={camadaPeixesRef} peixes={peixes} />}
      />
    </div>
  )
}

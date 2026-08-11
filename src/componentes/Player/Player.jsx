import { useState, useEffect, useRef } from 'react';
import estilos from './Player.module.css';

export function PlayerMini({ srcAudio = '/som.mp3', titulo = 'Sons do Oceano' }) {
    const [tocando, setTocando] = useState(false);
    const [minimizado, setMinimizado] = useState(false);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setMinimizado(window.scrollY > 120);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const alternarPlay = () => {
        if (!audioRef.current) return;
        if (tocando) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => { });
        }
        setTocando(!tocando);
    };

    const alterarVolume = (e) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (audioRef.current) audioRef.current.volume = v;
    };

    return (
        <div className={`${estilos.container} ${minimizado ? estilos.minimizado : ''}`}>
            <audio ref={audioRef} src={srcAudio} onEnded={() => setTocando(false)} />

            <div className={estilos.ondas}>
                <span className={tocando ? estilos.animar : ''} />
                <span className={tocando ? estilos.animar : ''} />
                <span className={tocando ? estilos.animar : ''} />
            </div>

            <div className={estilos.controles}>
                <button onClick={alternarPlay} className={estilos.btnPlay} aria-label="Play/Pause">
                    {tocando ? '⏸' : '▶'}
                </button>
                <div className={estilos.info}>
                    <span className={estilos.titulo}>{titulo}</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={alterarVolume}
                        className={estilos.volume}
                    />
                </div>
            </div>
        </div>
    );
}
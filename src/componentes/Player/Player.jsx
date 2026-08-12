import { useState, useEffect, useRef } from 'react';
import estilos from './Player.module.css';

export function PlayerMini({
    srcAudio = '/som.mp3',
    srcBolhas = '/bolhas.mp3',
}) {
    const [tocando, setTocando] = useState(false);
    const [minimizado, setMinimizado] = useState(
        () => window.matchMedia('(max-width: 640px)').matches,
    );
    const [volume, setVolume] = useState(1);

    const musicaRef = useRef(null);
    const bolhasRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.matchMedia('(max-width: 640px)').matches) {
                return;
            }

            setMinimizado(window.scrollY > 120);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const alternarPlay = async () => {
        const musica = musicaRef.current;
        const bolhas = bolhasRef.current;

        if (!musica || !bolhas) return;

        if (tocando) {
            musica.pause();
            bolhas.pause();
            setTocando(false);
            return;
        }

        try {
            await Promise.all([
                musica.play(),
                bolhas.play(),
            ]);

            setTocando(true);
        } catch {
            setTocando(false);
        }
    };

    const alterarVolume = (e) => {
        const v = Number(e.target.value);

        setVolume(v);

        if (musicaRef.current) {
            musicaRef.current.volume = v * 0.2;
        }

        if (bolhasRef.current) {
            bolhasRef.current.volume = v * 0.5;
        }
    };

    return (
        <div
            className={`${estilos.container} ${minimizado ? estilos.minimizado : ''
                }`}
        >
            <audio
                ref={musicaRef}
                src={srcAudio}
                loop
            />

            <audio
                ref={bolhasRef}
                src={srcBolhas}
                loop
            />

            <button
                type="button"
                className={estilos.abrirMobile}
                onClick={() => setMinimizado(false)}
                aria-label="Abrir controles de som"
            />

            <div className={estilos.ondas}>
                <span className={tocando ? estilos.animar : ''} />
                <span className={tocando ? estilos.animar : ''} />
                <span className={tocando ? estilos.animar : ''} />
            </div>

            <div className={estilos.controles}>
                <button
                    onClick={alternarPlay}
                    className={estilos.btnPlay}
                    aria-label={tocando ? 'Pausar sons' : 'Reproduzir sons'}
                >
                    {tocando ? '⏸' : '▶'}
                </button>

                <div className={estilos.volumeContainer}>
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                        <path d="M19 5a10 10 0 0 1 0 14" />
                    </svg>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={alterarVolume}
                        className={estilos.volume}
                        aria-label="Volume"
                    />
                </div>
            </div>
        </div>
    );
}

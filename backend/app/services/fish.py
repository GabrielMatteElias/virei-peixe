import random
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.user import User

def calcular_posicao_x_valida(ultimo_x: int | None) -> int:
    LIMITE_MIN = 0
    LIMITE_MAX = 40
    DISTANCIA_MINIMA = 5

    if ultimo_x is None:
        return random.randint(LIMITE_MIN, LIMITE_MAX)

    posicoes_validas = [
        x for x in range(LIMITE_MIN, LIMITE_MAX + 1)
        if abs(x - ultimo_x) >= DISTANCIA_MINIMA
    ]

    return random.choice(posicoes_validas) if posicoes_validas else random.randint(LIMITE_MIN, LIMITE_MAX)

def escolher_valor_diferente(historico: list, opcoes: list):
    if len(historico) == 2 and historico[0] == historico[1]:
        opcoes_validas = [opt for opt in opcoes if opt != historico[0]]
        return random.choice(opcoes_validas)
    return random.choice(opcoes)

def gerar_dados_peixe(db: Session) -> dict:
    ultimos_usuarios = db.scalars(
        select(User).order_by(User.id.desc()).limit(2)
    ).all()

    ultimo_usuario = ultimos_usuarios[0] if ultimos_usuarios else None

    ultima_profundidade = ultimo_usuario.peixe_profundidade if ultimo_usuario else 0
    ultimo_x = ultimo_usuario.peixe_posicao_x if ultimo_usuario else None

    nova_profundidade = ultima_profundidade + random.randint(70, 120)
    novo_x = calcular_posicao_x_valida(ultimo_x)

    historico_lado = [u.peixe_lado for u in ultimos_usuarios]
    historico_espelhado = [u.peixe_espelhado for u in ultimos_usuarios]
    historico_especie = [u.peixe_especie for u in ultimos_usuarios]

    peixe_lado = escolher_valor_diferente(historico_lado, ["direita", "esquerda"])
    peixe_espelhado = escolher_valor_diferente(historico_espelhado, [True, False])
    peixe_especie = escolher_valor_diferente(historico_especie, list(range(1, 6)))

    return {
        "peixe_lado": peixe_lado,
        "peixe_posicao_x": novo_x,
        "peixe_profundidade": nova_profundidade,
        "peixe_tamanho": random.randint(80, 115),
        "peixe_espelhado": peixe_espelhado,
        "peixe_especie": peixe_especie,
    }
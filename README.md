# Conversor de Texto para Áudio 🔊

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-Heroku-purple)](https://heroku.com)

Aplicação web para converter texto em áudio com múltiplos idiomas, sotaques e personalizações. Desenvolvido com Python (Flask) e gTTS.

![Screenshot](/frontend/static/img/conversorTextoFala.png)

## Funcionalidades

- ✅ Conversão de texto para áudio MP3
- 🌐 Suporte para 4 idiomas principais
- 🎚️ Controles de velocidade, volume, tom e sotaque
- 🎧 Pré-visualização do áudio
- 📥 Download do arquivo gerado
- 🎨 Interface moderna e responsiva

## Tecnologias

- **Backend**: Python 3.8+, Flask, gTTS
- **Frontend**: HTML5, CSS3, JavaScript
- **Deploy**: Vercel

## Estrutura do Projeto
```bash
gerador_de_audio/
├── backend/
│   ├── app.py          # Servidor Flask
│   └── text_to_speech.py # Lógica de conversão
├── frontend/
│   ├── static/         # Assets estáticos
│   └── templates/      # Páginas HTML
├── requirements.txt    # Dependências
└── README.md           # Documentação
```
## Como Executar Localmente

### Pré-requisitos

- Python 3.8+
- pip
- Virtualenv (recomendado)

### Instalação

#### 1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/text2speech.git
cd gerador_de_audio
```
#### 2. baixe as dependências:
```bash
pip install -r requirements.txt
```
#### 3. execute:
```bash
cd backend
python app.py
```

## Outras informações
### Lighthouse
![Lighthouse](/frontend/static/img/lighthouse.png)
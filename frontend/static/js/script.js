class AudioController {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioElement = document.getElementById('audioPlayer');
        this.volumeControl = document.getElementById('volume');
        this.pitchControl = document.getElementById('pitch');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.volumeControl.addEventListener('input', (e) => {
            document.getElementById('volumeValue').textContent = e.target.value;
            this.setVolume(e.target.value);
        });

        this.pitchControl.addEventListener('input', (e) => {
            document.getElementById('pitchValue').textContent = e.target.value;
            this.setPlaybackRate(e.target.value);
        });
    }

    setVolume(value) {
        this.audioElement.volume = value;
    }

    setPlaybackRate(value) {
        this.audioElement.playbackRate = value;
    }
}

let currentAudioUrl = null;

const accentMap = {
    'en': {
        'us': 'Americano',
        'uk': 'Britanico'
    },
    'pt': {
        'br': 'Brasileiro',
        'pt': 'Europeu'
    },
    'es': {
        'es': 'Espanhol',
        'mx': 'Mexicano'
    },
    'fr': {
        'fr': 'Frances',
        'ca': 'Canadense'
    }
};


function updateAccents() {
    const lang = document.getElementById('lang').value;
    const accentSelect = document.getElementById('accent');
    const accents = accentMap[lang] || {};

    // Salvar o sotaque selecionado anteriormente
    const previousValue = accentSelect.value;

    // Gerar novas opcoes
    const options = Object.entries(accents).map(([value, label]) => {
        return `<option value="${value}" ${value === previousValue ? 'selected' : ''}>${label}</option>`;
    }).join('');

    accentSelect.innerHTML = options || '<option value="">Nenhum sotaque disponivel</option>';

    // Forcar atualizacao visual
    if (!accentSelect.value && options.length > 0) {
        accentSelect.value = Object.keys(accents)[0];
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const audioController = new AudioController();
    updateAccents();

    // Adicionar listener para mudanca de idioma
    document.getElementById('lang').addEventListener('change', updateAccents);

    document.getElementById('converterForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const resultDiv = document.getElementById('result');
        const errorDiv = document.getElementById('error');

        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                if (!audioBlob.size) {
                    throw new Error('Servidor retornou um audio vazio.');
                }

                const audioPlayer = document.getElementById('audioPlayer');
                const downloadLink = document.getElementById('downloadLink');

                if (currentAudioUrl) {
                    URL.revokeObjectURL(currentAudioUrl);
                }

                currentAudioUrl = URL.createObjectURL(audioBlob);

                audioPlayer.src = currentAudioUrl;
                downloadLink.href = currentAudioUrl;
                downloadLink.download = `audio_${Date.now()}.mp3`;

                resultDiv.classList.remove('hidden');
                audioController.setVolume(document.getElementById('volume').value);
                audioController.setPlaybackRate(document.getElementById('pitch').value);
            } else {
                if (response.status === 405) {
                    throw new Error('Endpoint /convert nao aceita POST neste servidor. Abra a aplicacao pela URL do Flask (http://127.0.0.1:5000).');
                }

                let serverMessage = 'Erro desconhecido';
                const contentType = response.headers.get('content-type') || '';

                if (contentType.includes('application/json')) {
                    const errorJson = await response.json();
                    serverMessage = errorJson.error || serverMessage;
                } else {
                    const errorText = await response.text();
                    if (errorText) {
                        serverMessage = errorText;
                    }
                }

                throw new Error(`Erro ao converter audio (HTTP ${response.status}): ${serverMessage}`);
            }
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });
});

window.addEventListener('beforeunload', () => {
    if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
        currentAudioUrl = null;
    }
});

window.addEventListener('resize', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    if (window.innerWidth < 480) {
        audioPlayer.style.width = '100%';
    } else {
        audioPlayer.style.width = '300px';
    }
});

if (window.innerWidth < 480) {
    document.getElementById('audioPlayer').style.width = '100%';
}

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

const accentMap = {
    'en': {
        'us': '🇺🇸 Americano',
        'uk': '🇬🇧 Britânico'
    },
    'pt': {
        'br': '🇧🇷 Brasileiro',
        'pt': '🇵🇹 Europeu'
    },
    'es': {
        'es': '🇪🇸 Espanhol',
        'mx': '🇲🇽 Mexicano'
    },
    'fr': {
        'fr': '🇫🇷 Francês',
        'ca': '🇨🇦 Canadense'
    }
};


function updateAccents() {
    const lang = document.getElementById('lang').value;
    const accentSelect = document.getElementById('accent');
    const accents = accentMap[lang] || {};
    
    // Salvar o sotaque selecionado anteriormente
    const previousValue = accentSelect.value;
    
    // Gerar novas opções
    const options = Object.entries(accents).map(([value, label]) => {
        return `<option value="${value}" ${value === previousValue ? 'selected' : ''}>${label}</option>`;
    }).join('');
    
    accentSelect.innerHTML = options || '<option value="">Nenhum sotaque disponível</option>';
    
    // Forçar atualização visual
    if (!accentSelect.value && options.length > 0) {
        accentSelect.value = Object.keys(accents)[0];
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const audioController = new AudioController();
    updateAccents();
    
    // Adicionar listener para mudança de idioma
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

            const data = await response.json();
            
            if (response.ok) {
                const audioPlayer = document.getElementById('audioPlayer');
                const downloadLink = document.getElementById('downloadLink');
                
                audioPlayer.src = `/static/audio/${data.filename}`;
                downloadLink.href = `/static/audio/${data.filename}`;
                
                resultDiv.classList.remove('hidden');
                audioController.setVolume(document.getElementById('volume').value);
                audioController.setPlaybackRate(document.getElementById('pitch').value);
            } else {
                throw new Error(data.error || 'Erro desconhecido');
            }
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });
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
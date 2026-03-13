from gtts import gTTS
from io import BytesIO

class TextToSpeechConverter:
    def __init__(self):
        self.supported_accents = {
            'en': {
                'us': 'com',        # Inglês Americano
                'uk': 'co.uk'       # Inglês Britânico
            },
            'pt': {
                'br': 'com.br',     # Português Brasileiro
                'pt': 'pt'          # Português Europeu
            },
            'es': {
                'es': 'es',         # Espanhol Europeu
                'mx': 'com.mx'      # Espanhol Mexicano
            },
            'fr': {
                'fr': 'fr',         # Francês Metropolitano
                'ca': 'ca'          # Francês Canadense
            }
        }

    def get_available_voices(self, lang):
        return self.supported_accents.get(lang, {})

    def convert_text_to_audio(self, text, lang='en', accent='us', slow=False):
        """Converte texto em áudio e retorna um buffer MP3 em memória."""
        try:
            tld = self.supported_accents.get(lang, {}).get(accent, 'com')
            tts = gTTS(text=text, lang=lang, tld=tld, slow=slow)
            audio_buffer = BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)
            return audio_buffer
        except Exception as e:
            raise RuntimeError(f"Erro na conversão: {str(e)}")

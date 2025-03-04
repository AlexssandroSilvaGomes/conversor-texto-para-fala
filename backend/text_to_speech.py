from gtts import gTTS
import os
from io import BytesIO
import time

class TextToSpeechConverter:
    def __init__(self, output_folder='../frontend/static/audio'):
        self.output_folder = output_folder
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
        os.makedirs(self.output_folder, exist_ok=True)

    def get_available_voices(self, lang):
        return self.supported_voices.get(lang, {})

    def convert_text_to_audio(self, text, lang='en', accent='us', slow=False):
        """Converte texto em áudio com seleção de voz"""
        try:
            tld = self.supported_accents.get(lang, {}).get(accent, 'com')
            tts = gTTS(text=text, lang=lang, tld=tld, slow=slow)
            return tts
        except Exception as e:
            raise RuntimeError(f"Erro na conversão: {str(e)}")

    def save_audio(self, tts_object):
        """Salva o áudio em arquivo MP3"""
        timestamp = str(int(time.time()))
        filename = f"audio_{timestamp}.mp3"
        filepath = os.path.join(self.output_folder, filename)
        
        tts_object.save(filepath)
        return filename
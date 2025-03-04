from flask import Flask, render_template, request, jsonify
from text_to_speech import TextToSpeechConverter
import os

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert_text():
    data = request.form
    text = data.get('text')
    lang = data.get('lang', 'en')
    accent = data.get('accent', 'us')
    speed = data.get('speed', 'normal') == 'slow'

    if not text:
        return jsonify({'error': 'Texto não fornecido'}), 400

    try:
        converter = TextToSpeechConverter()
        audio = converter.convert_text_to_audio(text, lang=lang, accent=accent, slow=speed)
        filename = converter.save_audio(audio)
        return jsonify({'filename': filename})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
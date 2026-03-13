from flask import Flask, render_template, request, jsonify, send_file
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
        audio_buffer = converter.convert_text_to_audio(text, lang=lang, accent=accent, slow=speed)

        response = send_file(
            audio_buffer,
            mimetype='audio/mpeg',
            as_attachment=False,
            download_name='audio.mp3'
        )

        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
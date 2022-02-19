import io
import numpy as np
from PIL import Image
from datetime import datetime
import redis
import tensorflow as tf
from flask import Flask, request
model = tf.keras.models.load_model('saved_model/model_1')
app = Flask(__name__)
# app.logger.setLevel(logging.DEBUG)

r = redis.Redis(host='redis-19643.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
                port=19643, password='g2uDh0Fb6YWaICNogKVPlW6DRW8ZjpaO')


@app.route("/api/<id>", methods=['POST'])
def test_method(id):
    now = datetime.now()
    # if not request.json or 'image' not in request.json:
    #   abort(400)
    # get the base64 encoded string
    image = request.files.get("image", '')
    # convert bytes data to PIL Image object
    img = Image.open(io.BytesIO(image.read()))
    img_sav = img
    # resize image
    img = img.resize((224, 224), Image.ANTIALIAS)
    # date
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")

    # process your img_arr here
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)  # Create a batch
    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    class_names = ["Fire", "no_fire"]
    if class_names[np.argmax(score)] == "Fire":
        r.set(id, "true")
        img_sav.save(f"images/Fire/{id+'-'+current_time}.jpg")
    else:
        r.set(id, "false")
    ret = {"id": id, "type": class_names[np.argmax(
        score)], "score": round(100 * np.max(score), 2)}
    print(ret)
    return ret


@app.route("/", methods=["GET"])
def simple_get(id):
    return f"<p>Hello {id}</p>"


@app.route("/api/<id>", methods=["GET"])
def ret_get(id):
    return r.get(id)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)

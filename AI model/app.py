import io
import numpy as np
from PIL import Image
import tensorflow as tf
from flask import Flask, request
model = tf.keras.models.load_model('saved_model/model_1')
app = Flask(__name__)          
#app.logger.setLevel(logging.DEBUG)

@app.route("/api/<id>", methods=['POST'])
def test_method(id):            
    #if not request.json or 'image' not in request.json: 
    #   abort(400) 
    # get the base64 encoded string
    image = request.files.get("image",'')
    # convert bytes data to PIL Image object
    img = Image.open(io.BytesIO(image.read()))
    # resize image
    img = img.resize((224,224), Image.ANTIALIAS)
    
    # process your img_arr here    
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) # Create a batch
    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    class_names = ['fire', 'no_fire']
    #print(class_names[np.argmax(score)],round(100 * np.max(score),2))
    ret = {"id":id,"type":class_names[np.argmax(score)],"score":round(100 * np.max(score),2)}
    print(ret)
    return ""
@app.route("/<id>",methods=["GET"])
def simple_get(id):
    return f"<p>Hello {id}</p>"
if __name__=='__main__':
    app.run(host="0.0.0.0", port=5000)



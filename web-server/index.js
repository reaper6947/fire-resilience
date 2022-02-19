import express from "express"
const app = express();
import fetch from 'node-fetch';
import path from "path"
import bodyParser from "body-parser"
const __dirname = path.resolve();
const PORT = 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/public/views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// let Data = [
//   {
//     ID: "4te54g",
//     IP: "192.168.1.130",
//     status: "offline",
//     fire: false,
//     loc: [23.736823, 90.387763],
//   },
// ];

let Data = []

app.get("/", (req, res) => {
  res.render("index", {
    Data,
  });
});

app.get("/add/:id/:ip/:loc", (req, res) => {
  var flag = false;
  req.params.loc = req.params.loc.split(",").map(function (x) {
    return parseFloat(x, 10);
  });
  //console.log(req.params.id, req.params.ip,req.params.loc)
  Data.forEach((obj) => {
    if (obj.ID == req.params.id) {
      flag = true;
    }
  });

  if (!flag) {
    Data.push({
      ID: req.params.id,
      IP: req.params.ip,
      status: "offline",
      fire: false,
      loc: req.params.loc,
    });
  }

  res.render("index", {
    Data,
  });
});

app.get("/status/:ip/:id", (req, res) => {
  const get_data = async (url) => {
    try {
      const response = await fetch(url);
      return response.ok
    } catch (error) {
      console.log("error, cant connect to device");
    }
  };
  get_data(`http://${req.params.ip}/${req.params.id}`).then((data) => {
    if (data) {
      res.json({ status: "online" });
    } else {
      res.json({ status: "offline" });
    }
  }).catch((e)=>{res.json({ status: "offline" })})
});

app.get("/detection/:id", (req, res) => {
  const get_data = async (url) => {
    try {
      const response = await fetch(url);
      return response.json()
    } catch (error) {
      console.log("error, python server offline");
      res.json({fire:"error"})
    }
  }
  get_data(`http://localhost:5000/api/${req.params.id}`).then((data) => {
    res.json({ fire: data } )
  }).catch((e)=>{console.log("error python server")})
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

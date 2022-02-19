const asyncGetCall = async () => {
  try {
    const response = await fetch(`/add/${ID.value}/${IP.value}/${LOC.value}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const statusGetCall = async (ip, id) => {
  try {
    const res = await fetch(`/status/${ip}/${id}`, { mode: "no-cors" });
    return res.json();
  } catch (error) {
    console.log(error);
   
  }
};

const detectionGet = async (id) => {
  try {
    const res = await fetch(`/detection/${id}`);
    return res.json();
  } catch (error) {
    console.log("error detection");
    
  }
};

document.getElementById("add-btn").addEventListener("click", (e) => {
  e.preventDefault;
  asyncGetCall();
});

setInterval(function () {
  let cards = document.querySelectorAll(".card-body");
  cards.forEach((e) => {
    let id = e.childNodes[1].childNodes[0].innerText;
    let ip = e.childNodes[5].getAttribute("ip");
    statusGetCall(ip, id)
      .then((data) => {
        if (data.status == "online") {
          e.childNodes[5].innerText = "online";
        } else {
          e.childNodes[5].innerText = "offline";
        }
      })
      .catch((err) => {
        e.childNodes[5].innerText = "offline";
        console.log("err status");
      });

    detectionGet(id)
      .then((data) => {
        if (data.fire === true) {
          e.childNodes[3].innerText = "fire detected";
        } else if(data.fire === false){
          e.childNodes[3].innerText = "no fire detected";
        }
        else {
            e.childNodes[3].innerText = "AI server offline";
          }
      })
      .catch((err) => {
        console.log(err);
        e.childNodes[3].innerText = "AI server offline";
      });
  });
}, 2000);

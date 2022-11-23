const server = io();
server.emit("request");
let url = new URL(window.parent.location.href);
var site = url.searchParams.get("user");
let us = localStorage.getItem("user");
if (us && us != "") {
  run();
} else {
  location.replace("/");
}
if (site) {
  localStorage.setItem("user", site);
  location.replace("/games");
} else {
  run();
}
function run() {
  function one(e) {
    return document.querySelector(e);
  }
  function all(e) {
    return document.querySelectorAll(e);
  }
  one("nav").onclick = (ev) => {
    let el = ev.target;
    if (el.tagName == "LI") {
      clearSet(el);
    } else if (el.tagName == "A") {
      clearSet(el.parentNode);
    }
  }
  function clearSet(element) {
    let lits = all(".main li");
    for (let li of lits) {
      li.classList.remove("active");
    }
    element.classList.add("active");
  }
  one("#create").onclick = () => {
    let wig = document.createElement("div");
    wig.className = "act";
    wig.innerHTML = `
      <h2 class="head">Створення гри</h2>
      <div class="gamee">
        Назва гри:<br>
        <input id="name"><br>
        Кількість разів:<br>
        <input id="count"><br>
        <button id="cret">Створити</button>
      </div>
      <div class="close">
        <button id="close">Закрити</button>
      </div>
    `;
    document.body.appendChild(wig);
    document.body.style.pointerEvents = "none";
    wig.style.pointerEvents = "auto";
    one("#close").onclick = () => {
      wig.remove();
      document.body.style.pointerEvents = "auto";
    }
    one("#cret").onclick = () => {
      let IdRoom = document.getElementById("name").value;
      server.emit("create", {
        room: IdRoom,
        user: localStorage.getItem("user"),
        countGames: document.getElementById("count").value
      });
      let div = document.createElement("div");
      let set = document.createElement("div");
      let img = document.createElement("div");
      let inf = document.createElement("div");
      inf.className = "info";
      img.className = "img";
      set.className = "settings";
      div.className = "game";
      div.id = IdRoom;
      set.innerHTML = `
        <span class="delete">delete</span>
        <span class="copy" link="https://tic-tac-toe.teleweb.repl.co/game/?room=${IdRoom}&count=${document.getElementById("count").value}">link</span>`;
      img.innerHTML = `<img src="js/img.png">`;
      inf.innerHTML = `
        Назва:<br><h3>${IdRoom}</h3><br>
        Кількість спроб:<h4>${document.getElementById("count").value}</h4>`;
      div.appendChild(set);
      div.appendChild(img);
      div.appendChild(inf);
      if (document.querySelector("main").innerHTML.includes("<marquee")) {
        document.querySelector("main").innerHTML = "";
      }
      document.querySelector("main").style.left = "0px";
      document.querySelector("main").appendChild(div);
      document.querySelector("main").onclick = (e) => {
        let el = e.target;
        if (el.className == "delete") {
          server.emit("delete", {
            user: localStorage.getItem("user"),
            roomId: el.parentNode.parentNode.id,
            count: document.querySelector(`#${el.parentNode.parentNode.id} .info h4`).innerHTML
          });
          el.parentNode.parentNode.remove();
        } else if (el.className == "copy") {
          window.open(el.getAttribute("link"), "", "width=500,height=500,left=300,top=300");
          localStorage.setItem("adm", "yes");
        }
      }
    }
  }
}
server.on("response", (data) => {
  let dt = JSON.parse(data);
  for (let room of dt.rooms) {
    if (room.roomId) {
      let div = document.createElement("div");
      let set = document.createElement("div");
      let img = document.createElement("div");
      let inf = document.createElement("div");
      let del = document.createElement("span");
      let lnk = document.createElement("span");
      lnk.className = "copy";
      lnk.setAttribute("link", `https://tic-tac-toe.teleweb.repl.co/game/?room=${room.roomId}&count=${room.countGames}`);
      lnk.innerText = "link";
      del.className = "delete";
      del.innerText = "delete";
      if (localStorage.getItem("user") != room.admin) {
        del.style.cssText = "display:none";
        lnk.style.cssText = `float: none;text-align:center;`;
      }
      inf.className = "info";
      img.className = "img";
      set.className = "settings";
      div.className = "game";
      div.id = room.roomId;
      img.innerHTML = `<img src="js/img.png">`;
      inf.innerHTML = `
        Назва:<br><h3>${room.roomId}</h3><br>
        Кількість спроб:<h4>${room.countGames}</h4>`;
      set.appendChild(del);
      set.appendChild(lnk);
      div.appendChild(set);
      div.appendChild(img);
      div.appendChild(inf);
      if (document.querySelector("main").innerHTML.includes("<marquee")) {
        document.querySelector("main").innerHTML = "";
      }
      document.querySelector("main").style.left = "0px";
      document.querySelector("main").appendChild(div);
      document.querySelector("main").onclick = (e) => {
        let el = e.target;
        if (el.className == "delete") {
          server.emit("delete", {
            user: localStorage.getItem("user"),
            roomId: el.parentNode.parentNode.id,
            count: document.querySelector(`#${el.parentNode.parentNode.id} .info h4`).innerHTML
          });
          el.parentNode.parentNode.remove();
        } else if (el.className == "copy") {
          window.open(el.getAttribute("link"), "", "width=500,height=500,left=300,top=300");
          localStorage.setItem("adm", "yes");
        }
      }
    }
  }
});
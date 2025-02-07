import http from "node:http";
import querystring from "node:querystring";
import { errorPage } from "./templates.js"

const pizzaOffers = [
  {
    name: "Ananas Dave",
    costs: 12,
  },
  {
    name: "Orang Utan",
    costs: 9,
  },
];

const server = http.createServer(function (req, res) {
  const { url, method } = req;

  if (url === "/" && method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.write("Willkommen auf unserer Pizzeria-Seite <br /><br />");

    res.write("Aktuelle Angebote: <br />-----<br />");

    pizzaOffers.forEach((pizza) => {
      res.write(`${pizza.name}, ${pizza.costs} EUR <br />`);
    });

    res.write(`<html><head><meta charset="UTF-8"></head>
    <a href="/404">Fehlerseite</a>
    <form action="/bestellung" method="post" style="margin-top: 20px; padding: 1em; border: 1px solid black">
      <input placeholder="Bestellung..." type="text" name="bestellung" />
      <input placeholder="Adresse..." type="text" name="adresse" />
      <button type="submit">Absenden</button>
    </form>
    </html>
    `);

    res.end();
  }

  if (url === "/bestellung" && method === "POST") {
    let body = "";
    req.on("data", (data) => {
      body += data.toString();
    })


    req.on("end", () => {
      const { bestellung, adresse } = querystring.decode(body)

      res.setHeader("Content-Type", "text/html; charset=utf-8")
      res.write(`<h1>Zusammenfassung</h1>`)
      res.write(`<p>Ihre ${bestellung} ist eingegangen und wird an ${adresse} geschickt</p>`)
      res.end();
    })
  }

  res.setHeader("Content-Type", "text/html");
  res.statusCode = 404;
  res.write(errorPage)
  res.end()
});

server.listen(3500);


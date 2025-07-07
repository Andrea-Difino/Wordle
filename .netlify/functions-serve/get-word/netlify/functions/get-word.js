// netlify/functions/get-word.js
var path = require("path");
var fs = require("fs");
exports.handler = async () => {
  const filePath = path.join(__dirname, "parole5lettere.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const wordList = JSON.parse(raw);
  const random = wordList[Math.floor(Math.random() * wordList.length)];
  return {
    statusCode: 200,
    body: JSON.stringify({
      secret: random.toUpperCase(),
      wordList: wordList.map((w) => w.toUpperCase())
    })
  };
};
//# sourceMappingURL=get-word.js.map

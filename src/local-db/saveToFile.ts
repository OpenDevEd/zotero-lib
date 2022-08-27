const fs = require('fs');

export default function saveToFile(name, data) {
  fs.writeFileSync(name, data);
}

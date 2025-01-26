const fs = require('fs');

export default function saveToFile(name: string, data: any) {
  fs.writeFileSync(name, data);
}

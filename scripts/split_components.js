var componentsFile = require("../articles/024-jsonrpc-comp/rpc-2.0/components/components.json");
const fs = require('node:fs');
//console.debug(componentsFile.components.schemas);
for (elem in componentsFile.components.schemas) {
    var content = JSON.stringify(componentsFile.components.schemas[elem], null, 4);
    //console.debug(content);
    //fs.writeFileSync(elem + ".json", content, 'utf8');
}

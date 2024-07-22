var schemaFile = require("./articles/024-jsonrpc-comp/rpc-2.0/schema.json");
const fs = require('node:fs');
//console.debug(componentsFile.components.schemas);
for (elem in schemaFile.components.schemas) {
    var content = JSON.stringify(schemaFile.components.schemas[elem], null, 4);
    console.debug(content);
    fs.writeFileSync("./articles/024-jsonrpc-comp/rpc-2.0/components/" + elem + ".json", content, 'utf8');
}

// Optional. Run once before testing this copy outside the current Sites host.
// Keeps design/content intact; changes only navigation URLs and local tooling.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const file=path.join(root,'app/shop.tsx');
let source=fs.readFileSync(file,'utf8');
source=source.replaceAll('https://sabor-salvador-sparks.namans792420.chatgpt.site/','/');
fs.writeFileSync(file,source);
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
fs.writeFileSync(path.join(root,'.sites-runtime/execution-profile.json'),JSON.stringify({executionProfile:'portable'}));
console.log('Ready for local testing. Links now stay on the host you open. Visual design and content are unchanged.');

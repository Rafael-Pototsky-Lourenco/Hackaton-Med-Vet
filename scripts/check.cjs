const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');let scripts=0,refs=0;
function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())scan(file);else if(file.endsWith('.js')){new vm.Script(fs.readFileSync(file,'utf8'),{filename:path.relative(root,file)});scripts++;}}}scan(path.join(root,'assets/js'));
for(const page of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){const html=fs.readFileSync(path.join(root,page),'utf8');for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(/^(https?:|data:)/.test(m[1]))continue;assert.ok(fs.existsSync(path.join(root,m[1].split('#')[0])),page+': '+m[1]);refs++;}}
for(const route of ['index','odonto','fisioterapia','psicologia','nutricao','med_vet'])assert.ok(fs.existsSync(path.join(root,route+'.html')));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));assert.equal(manifest.start_url,'./index.html');
console.log(scripts+' scripts com sintaxe válida; '+refs+' referências locais verificadas; seis rotas preservadas.');

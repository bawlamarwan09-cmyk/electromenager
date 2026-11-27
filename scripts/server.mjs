import {spawn,execFileSync} from 'node:child_process';
import {resolve,join} from 'node:path';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
const build=process.argv.includes('--build');
const env={...process.env,LIVE_CATALOGUE:'1',STOREFRONT_PATH:resolve(process.env.STOREFRONT_PATH||'lib/storefront.generated.json')};
if(!build&&!env.DATABASE_URL&&!existsSync(env.DASHBOARD_DB||join(homedir(),'.aura-volt/catalogue.sqlite'))){throw new Error('Initialisez la base du dashboard avant de démarrer le serveur.');}
execFileSync('python3',['scripts/storefront.py'],{stdio:'inherit',env});
if(build){execFileSync(process.execPath,['node_modules/next/dist/bin/next','build'],{stdio:'inherit',env});process.exit(0);}
const children=[];let closing=false;
function close(code=0){if(closing)return;closing=true;for(const child of children)child.kill('SIGTERM');process.exitCode=code;}
function start(command,args){const child=spawn(command,args,{stdio:'inherit',env});children.push(child);child.on('error',error=>{console.error(error.message);close(1)});child.on('exit',code=>close(code||0));return child;}
start('python3',['dashboard/manage.py','serve']);
start(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',process.env.PORT||'3000']);
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>close());

import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat,readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {brotliCompressSync,gzipSync} from 'node:zlib';
const root=resolve('.');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.mp4':'video/mp4','.webm':'video/webm'};
const compressed = new Map();
createServer(async(req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=resolve(root,'.'+(p==='/'?'/index.html':p));
  if(!file.startsWith(root+sep))throw 0;
  const info=await stat(file);if(!info.isFile())throw 0;
  const size=info.size,extension=extname(file),text=['.html','.css','.js'].includes(extension);
  const accepts=req.headers['accept-encoding']||'';
  const encoding=text&&!req.headers.range?(accepts.includes('br')?'br':accepts.includes('gzip')?'gzip':null):null;
  const etag=`W/"${size}-${Math.trunc(info.mtimeMs)}-${encoding||'identity'}"`;
  const headers={'Content-Type':types[extension]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':text?'no-cache':'public, max-age=3600, must-revalidate','ETag':etag,'Last-Modified':info.mtime.toUTCString()};
  if(text)headers.Vary='Accept-Encoding';
  if(req.headers['if-none-match']===etag){res.writeHead(304,headers);res.end();return}
  if(encoding){
   const key=file+etag;
   if(!compressed.has(key)){
    for(const prior of compressed.keys())if(prior.startsWith(file))compressed.delete(prior);
    const raw=await readFile(file);compressed.set(key,encoding==='br'?brotliCompressSync(raw):gzipSync(raw));
   }
   const body=compressed.get(key);headers['Content-Encoding']=encoding;headers['Content-Length']=body.length;
   res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:body);return;
  }
  let start=0,end=size-1,status=200;
  if(req.headers.range){
   const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return}
   start=m[1]?Number(m[1]):Math.max(0,size-Number(m[2]));
   end=m[1]&&m[2]?Math.min(Number(m[2]),size-1):size-1;
   if(start>=size||end<start){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return}
   status=206;headers['Content-Range']=`bytes ${start}-${end}/${size}`;
  }
  headers['Content-Length']=end-start+1;res.writeHead(status,headers);
  if(req.method==='HEAD')res.end();else createReadStream(file,{start,end}).pipe(res);
 }catch{res.writeHead(404);res.end('Não encontrado')}
}).listen(4175,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4175'));


// Requires Playwright and its Chromium browser; set CHROME_BIN to use an installed Chrome.
const {chromium}=require('playwright');const {pathToFileURL}=require('url');const path=require('path');
(async()=>{
const b=await chromium.launch({headless:true,...(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{})});const c=await b.newContext();await c.route('https://**/*',route=>route.abort());const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));const url=pathToFileURL(path.resolve(__dirname,'..','index.html')).href;await p.goto(url);await p.evaluate(()=>artifactReady);
console.log(await p.evaluate(async()=>{
currentThread().title='Artifact chat';window.requests=[];let round=0;
const call=(name,args,id)=>({index:id,id:'a'+round+'_'+id,type:'function',function:{name,arguments:JSON.stringify(args)}});
const sse=calls=>new Response('data: '+JSON.stringify({choices:[{delta:{tool_calls:calls},finish_reason:'tool_calls'}]})+'\n\ndata: [DONE]\n\n');
window.fetch=async(url,opts)=>{const body=JSON.parse(opts.body);requests.push(body);round++;
if(round===1)return sse([call('create_artifact',{name:'cube',type:'text/html',content:'<h1>UNIQUE_RAW_SOURCE Blue cube</h1>'},0),call('edit_artifact',{name:'cube',base_version:null,replacements:[{old_text:'Blue',new_text:'Green'}]},1)]);
if(round===2)return sse([call('read_artifact',{name:'cube',version:'draft',offset:0,length:200},0)]);
if(round===3)return sse([call('edit_artifact',{name:'cube',base_version:null,replacements:[{old_text:'cube',new_text:'scene'}]},0),call('view_artifact',{name:'cube',version:'draft'},1)]);
return new Response('data: '+JSON.stringify({choices:[{delta:{content:'Created cube v0.'}}]})+'\n\ndata: [DONE]\n\n');};
document.getElementById('promptInput').value='Create a cube artifact';await sendMessage();
const record=artifactRecord(currentThread().id,'cube');if(record?.versions.length!==1||record.versions[0].version!==0||!record.versions[0].content.includes('Green scene'))throw Error('Turn version boundary failed');
if(JSON.stringify(currentThread().messages).includes('UNIQUE_RAW_SOURCE'))throw Error('Source persisted in chat history');
for(const request of requests.slice(1))for(const message of request.messages)for(const call of message.tool_calls||[])if(call.function.arguments.includes('UNIQUE_RAW_SOURCE'))throw Error('Creation source resent');
if(!requests.some(request=>request.messages.some(message=>message.role==='tool'&&message.content.includes('UNIQUE_RAW_SOURCE'))))throw Error('Requested source chunks not supplied');
if([...document.querySelectorAll('.artifact-toolbar')].some(bar=>bar.textContent.includes('draft')))throw Error('Draft viewers not finalized');
window.firstArtifactMessages=currentThread().messages.filter(message=>message.artifact).map(message=>({message,version:message.artifact.version}));
round=0;requests=[];window.fetch=async(url,opts)=>{const body=JSON.parse(opts.body);requests.push(body);round++;if(round===1)return sse([call('edit_artifact',{name:'cube',base_version:0,replacements:[{old_text:'Green',new_text:'Red'}]},0),call('edit_artifact',{name:'cube',base_version:0,replacements:[{old_text:'scene',new_text:'world'}]},1),call('view_artifact',{name:'cube',version:'draft'},2)]);return new Response('data: '+JSON.stringify({choices:[{delta:{content:'Updated cube v1.'}}]})+'\n\ndata: [DONE]\n\n');};
document.getElementById('promptInput').value='Change it to red';await sendMessage();
if(artifactRecord(currentThread().id,'cube').versions.length!==2||committedArtifact(currentThread().id,'cube',0).content.includes('Red'))throw Error('Multiple versions or mutation');
if(firstArtifactMessages.some(({message,version})=>message.artifact.version!==version))throw Error('Old message references retargeted');
if(requests.some(request=>JSON.stringify(request).includes('UNIQUE_RAW_SOURCE')))throw Error('Historical source resent on next turn');
if(!document.querySelector('[data-artifact-name="cube"][data-artifact-version="0"]')||!document.querySelector('[data-artifact-name="cube"][data-artifact-version="1"]'))throw Error('Viewers not pinned');
return 'Passed: create+multiple edits only v0, later multi-edit turn only v1, immutable old refs/pinned viewers, full source absent from chat and historical API requests, requested chunks available within turn.';
}));
await p.reload();await p.evaluate(()=>artifactReady);if(await p.locator('.html-preview').count())throw Error('Reload auto-ran iframe');const card=p.locator('.tool-card[data-artifact-name="cube"][data-artifact-version="1"]').last();await card.getByRole('button',{name:'View',exact:true}).click();await card.locator('iframe').scrollIntoViewIfNeeded();
await card.frameLocator('iframe').getByRole('heading',{name:'UNIQUE_RAW_SOURCE Red world'}).waitFor();
console.log(await p.evaluate(async()=>{
let requests=0;window.fetch=async()=>{requests++;if(requests===1)return new Response('data: '+JSON.stringify({choices:[{delta:{tool_calls:[{index:0,id:'bad-create',type:'function',function:{name:'create_artifact',arguments:JSON.stringify({name:'discard-me',type:'text/html',content:'<h1>Never committed</h1>'})}},{index:1,id:'bad-view',type:'function',function:{name:'view_artifact',arguments:'{"name":"discard-me","version":"draft"}'}}]}}]})+'\n\ndata: [DONE]\n\n');return new Response('Failed',{status:500})};document.getElementById('promptInput').value='This turn will fail';await sendMessage();if(artifactRecord(currentThread().id,'discard-me'))throw Error('Failed turn created version');if(currentThread().messages.some(message=>message.artifact?.version==='draft'))throw Error('Dangling draft references');if(document.querySelector('[data-artifact-name="discard-me"] iframe'))throw Error('Failed draft still running');return 'Passed: saved viewer resolution and failed-turn rollback without dangling draft references.';
}));if(errors.length)throw Error(errors.join('\n'));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});

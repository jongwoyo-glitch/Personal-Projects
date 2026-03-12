/*! coi-service-worker - Enables SharedArrayBuffer via COOP/COEP headers */
let coepCredentialless=true;
if(typeof window==="undefined"){
  self.addEventListener("install",()=>self.skipWaiting());
  self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
  self.addEventListener("message",e=>{
    if(e.data&&e.data.type==="deregister"){
      self.registration.unregister().then(()=>self.clients.matchAll()).then(clients=>{
        clients.forEach(client=>client.navigate(client.url));
      });
    }
  });
  self.addEventListener("fetch",function(event){
    const r=event.request;
    if(r.cache==="only-if-cached"&&r.mode!=="same-origin")return;
    const request=(coepCredentialless&&r.mode==="no-cors")?new Request(r,{credentials:"omit"}):r;
    event.respondWith(
      fetch(request).then(response=>{
        if(response.status===0)return response;
        const h=new Headers(response.headers);
        h.set("Cross-Origin-Embedder-Policy",coepCredentialless?"credentialless":"require-corp");
        h.set("Cross-Origin-Resource-Policy","cross-origin");
        h.set("Cross-Origin-Opener-Policy","same-origin");
        return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h});
      }).catch(e=>console.error("SW fetch error:",e))
    );
  });
}else{
  (async()=>{
    if(window.crossOriginIsolated){
      console.log("[COI] Already cross-origin isolated");
      return;
    }
    const reg=await navigator.serviceWorker.register(window.document.currentScript.src,{
      scope:window.document.currentScript.getAttribute("data-scope")||"/"
    });
    console.log("[COI] Service worker registered, reloading...");
    if(reg.active&&!navigator.serviceWorker.controller){
      window.location.reload();
    }
  })();
}

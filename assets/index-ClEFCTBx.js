import{r as a,j as n,a as $}from"./index-jPUECBym.js";import{d as L}from"./index-pb2bNXaf.js";const C="M1101.391704 71.54184a66.022086 66.022086 0 0 0-95.194636-4.094393 71.140078 71.140078 0 0 0-4.094393 98.265431l4.094393 4.094393a495.933346 495.933346 0 0 1 0 686.834417 70.628278 70.628278 0 0 0 0 98.265431 66.022086 66.022086 0 0 0 95.194636 0 636.678104 636.678104 0 0 0 0-883.365279zM566.561625 15.755736L274.324328 236.341156H91.100243A90.588444 90.588444 0 0 0 0 326.9296v369.518964a91.612042 91.612042 0 0 0 91.100243 91.100243h183.224085l292.237297 220.58542c40.94393 30.707947 73.187274 13.818576 73.187274-36.849536V51.581674c0-51.179912-32.755144-66.533885-73.187274-35.825938zM921.238414 266.025505a83.423256 83.423256 0 0 0-109.013212-3.070795 64.998488 64.998488 0 0 0-3.582594 98.77723l3.582594 2.558996a195.507263 195.507263 0 0 1 0 295.819891 64.486689 64.486689 0 0 0-3.582594 98.26543 83.423256 83.423256 0 0 0 109.013212 3.070795l3.582594-3.070795a324.99244 324.99244 0 0 0 0-492.350752z",S="_wrapper_1ts33_1",V="_icon_1ts33_16",X="_bar_1ts33_22",Y="_handle_1ts33_29",h={wrapper:S,icon:V,bar:X,handle:Y},P=1e3,b=22;function q(){const d=L(),w=a.useRef(null),y=a.useRef(null),x=a.useRef(null),s=a.useRef({a:0,runningTime:0,duration:0,start:[0,0],end:[0,0]}),c=a.useRef(0),f=()=>{const t=Math.min(1,(Date.now()-c.current)/P);document.body.style.userSelect="",c.current=0,d?window.removeEventListener("touchend",f):window.removeEventListener("mouseup",f);const e=w.current,r=y.current,i=x.current;if(!e||!r||!i)return;const u=Number(e.style.getPropertyValue("--offsetX").slice(0,-2)),p=Number(e.style.getPropertyValue("--offsetY").slice(0,-2));s.current.runningTime=Date.now(),s.current.start=[u,p],s.current.end=[-6+200*t,-3],s.current.duration=t*300+80,s.current.a=.012-t*.008,e.style.setProperty("--angle","0deg"),r.setAttribute("r","0%"),i.style.opacity="1"},M=t=>{const e=x.current;t.button!==0||!e||(e.style.opacity="0",document.body.style.userSelect="none",c.current=Date.now(),d?window.addEventListener("touchend",f):window.addEventListener("mouseup",f))},R=()=>{M({button:0})};return a.useEffect(()=>{let t=0;const e=()=>{t=requestAnimationFrame(e);const r=w.current,i=y.current;if(!r||!i)return;if(s.current.runningTime!==0){const{a:g,runningTime:D,start:[o,v],end:[l,T],duration:A}=s.current,_=Math.min(1,(Date.now()-D)/A),m=o+_*(l-o),j=(v-T-g*(o*o-l*l))/(o-l),E=v-g*o*o-j*o,N=g*m*m+j*m+E;r.style.setProperty("--offsetX",`${m}px`),r.style.setProperty("--offsetY",`${N}px`),_>=1&&(s.current.runningTime=0,$.setVolume((l+6)/2>>0));return}if(c.current===0)return;const u=Math.min(1,(Date.now()-c.current)/P),p=u*.25*Math.PI;r.style.setProperty("--offsetX",`${-20+Math.cos(p)*b-b}px`),r.style.setProperty("--offsetY",`${-3-Math.sin(p)*b}px`),r.style.setProperty("--angle",`-${u*45}deg`),i.setAttribute("r",`${u*100}%`)};return t=requestAnimationFrame(e),()=>{cancelAnimationFrame(t)}},[]),n.jsxs("div",{className:h.wrapper,ref:w,children:[n.jsxs("svg",{className:h.icon,viewBox:"0 0 1280 1024",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",fill:"url(#radial-grad)",onMouseDown:d?void 0:M,onTouchStart:d?R:void 0,children:[n.jsxs("radialGradient",{ref:y,id:"radial-grad",cx:"0%",r:"0%",children:[n.jsx("stop",{offset:"0%",stopColor:"#4a95ff"}),n.jsx("stop",{offset:"99.99%",stopColor:"#4a95ff"}),n.jsx("stop",{offset:"100%",stopColor:"currentColor"})]}),n.jsx("path",{d:C})]}),n.jsx("div",{className:h.bar,children:n.jsx("div",{className:h.handle,ref:x})})]})}export{q as default};
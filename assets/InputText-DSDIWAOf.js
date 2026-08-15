import{r as m,j as e}from"./vendor-CU8_6eAe.js";const p=m.forwardRef(({label:r,error:n,leftIcon:t,rightIcon:s,className:o="",containerClassName:d="",id:i,type:x="text",...c},u)=>{const a=i||`input-${Math.random().toString(36).substring(2,9)}`,l=!!n;return e.jsxs("div",{className:`flex flex-col gap-1.5 w-full ${d}`,children:[r&&e.jsx("label",{htmlFor:a,className:"text-xs font-bold uppercase tracking-wider text-text-secondary select-none",children:r}),e.jsxs("div",{className:"relative flex items-center w-full",children:[t&&e.jsx("div",{className:"absolute left-3.5 text-text-secondary/70 pointer-events-none flex items-center justify-center",children:t}),e.jsx("input",{ref:u,id:a,type:x,className:`
            w-full font-sans text-sm font-medium rounded-xl border bg-white px-4 py-3 outline-none transition-all duration-200
            ${t?"pl-11":""} 
            ${s?"pr-11":""}
            ${l?"border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100":"border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10"}
            placeholder:text-text-secondary/40 placeholder:font-normal
            disabled:bg-slate-50 disabled:text-text-secondary/50 disabled:border-slate-200/60
            ${o}
          `,...c}),s&&e.jsx("div",{className:"absolute right-3.5 text-text-secondary/70 pointer-events-none flex items-center justify-center",children:s})]}),l&&e.jsx("span",{className:"text-xs font-semibold text-red-500 mt-0.5",children:n})]})});p.displayName="InputText";export{p as I};

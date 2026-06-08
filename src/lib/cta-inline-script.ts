import { CTA_PROMPT_DELAY_MS } from "@/lib/cta-config";

/** Starts the 5s timer and dispatches yango:cta-show — React renders the popup. */
export function buildCtaInlineScript(): string {
  return `(function(){
var DISMISS_KEY="yango-cta-prompt-v3";
var LEGACY_KEY="yango-cta-prompt-dismissed";
var SHOW_EVENT="yango:cta-show";
var delay=${CTA_PROMPT_DELAY_MS};

function isDismissed(){
  try{
    return sessionStorage.getItem(DISMISS_KEY)==="1"||sessionStorage.getItem(LEGACY_KEY)==="1";
  }catch(e){return false;}
}

function show(){
  if(isDismissed())return;
  window.__YANGO_CTA_READY=true;
  window.dispatchEvent(new CustomEvent(SHOW_EVENT));
}

window.setTimeout(show,delay);
})();`;
}

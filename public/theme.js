/* NexoHub appearance manager. Stores only the user's visual preference. */
(() => {
  const STORAGE_KEY = "nexohub-theme";
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const valid = new Set(["system","dark","light"]);
  function savedMode(){
    try { const value = localStorage.getItem(STORAGE_KEY); return valid.has(value) ? value : "system"; }
    catch { return "system"; }
  }
  let mode = savedMode();
  function apply(){
    const effective = mode === "system" ? (media.matches ? "dark" : "light") : mode;
    document.documentElement.dataset.theme = effective;
    document.documentElement.dataset.themePreference = mode;
    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.content = effective === "light" ? "#f4f7ff" : "#080c18";
    document.querySelectorAll("[data-theme-choice]").forEach(button => {
      const chosen = button.getAttribute("data-theme-choice") === mode;
      button.classList.toggle("selected", chosen);
      button.setAttribute("aria-pressed", String(chosen));
    });
  }
  function setMode(value){
    if(!valid.has(value))return;
    mode=value;
    try { localStorage.setItem(STORAGE_KEY,value); }catch {}
    apply();
    const menu=document.getElementById("theme-menu");
    if(menu) menu.classList.remove("open");
    const trigger=document.getElementById("theme-trigger");
    if(trigger)trigger.setAttribute("aria-expanded","false");
  }
  function close(){
    const menu=document.getElementById("theme-menu");
    if(menu)menu.classList.remove("open");
    const trigger=document.getElementById("theme-trigger");
    if(trigger)trigger.setAttribute("aria-expanded","false");
  }
  document.addEventListener("click",event=>{
    const choice=event.target.closest("[data-theme-choice]");
    if(choice){setMode(choice.getAttribute("data-theme-choice"));return;}
    const button=event.target.closest("#theme-trigger");
    if(button){
      const menu=document.getElementById("theme-menu");
      if(!menu)return;
      const expanded=menu.classList.toggle("open");
      button.setAttribute("aria-expanded",String(expanded));
      return;
    }
    if(!event.target.closest("#theme-control"))close();
  });
  document.addEventListener("keydown",event=>{if(event.key==="Escape")close();});
  if(media.addEventListener)media.addEventListener("change",()=>{if(mode==="system")apply();});
  else if(media.addListener)media.addListener(()=>{if(mode==="system")apply();});
  window.NexoTheme={getMode:()=>mode,setMode,refreshControls:apply};
  apply();
})();

/* Brand identification only. Marks belong to their respective owners.
 * SVG assets sourced from Simple Icons (CC0); not partnerships or endorsements.
 * Source: https://github.com/simple-icons/simple-icons
 */
const BRANDS = Object.freeze({
  "instagram":{slug:"instagram",label:"Instagram",color:"#E4405F"},
  "threads":{slug:"threads",label:"Threads",color:"#121820"},
  "tiktok":{slug:"tiktok",label:"TikTok",color:"#14B8AD"},
  "youtube e youtube music":{slug:"youtube",label:"YouTube",color:"#FF0033"},
  "youtube":{slug:"youtube",label:"YouTube",color:"#FF0033"},
  "x / twitter":{slug:"x",label:"X",color:"#111827"},
  "x":{slug:"x",label:"X",color:"#111827"},
  "pinterest":{slug:"pinterest",label:"Pinterest",color:"#BD081C"},
  "facebook":{slug:"facebook",label:"Facebook",color:"#0866FF"},
  "reddit":{slug:"reddit",label:"Reddit",color:"#FF4500"},
  "soundcloud":{slug:"soundcloud",label:"SoundCloud",color:"#FF5500"},
  "spotify":{slug:"spotify",label:"Spotify",color:"#168545"},
  "deezer":{slug:"deezer",label:"Deezer",color:"#A238FF"},
  "mediafire":{slug:"mediafire",label:"MediaFire",color:"#1296DB"},
  "google drive":{slug:"googledrive",label:"Google Drive",color:"#188B54"},
  "mega":{slug:"mega",label:"MEGA",color:"#D9272E"}
});
const normalize = text => String(text??"").toLocaleLowerCase("pt-BR").trim();
export function getPlatformBrand(name) {
  const brand=BRANDS[normalize(name)];
  return brand?{...brand,src:"/assets/brands/"+brand.slug+".svg"}:null;
}
export function brandLogo(name,{size=30,loading="lazy",decorative=false}={}) {
  const brand=getPlatformBrand(name);
  if(!brand)return "";
  const safeSize=Number.isInteger(size)&&size>=16&&size<=96?size:30;
  return '<img src="'+brand.src+'" width="'+safeSize+'" height="'+safeSize+'" loading="'+loading+'" decoding="async" alt="'+(decorative?'':brand.label)+'" '+(decorative?'aria-hidden="true" ':'')+'class="sv-brand-svg"/>';
}

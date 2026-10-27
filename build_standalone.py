from pathlib import Path
import base64,mimetypes,json,re
root=Path(__file__).parent
html=(root/'index.html').read_text()
assets={}
# Only horizontal variants are used by current renderer (rotation is CSS) although complete H+V assets retained in ZIP.
for folder in ['vehicles','environment','audio']:
 for f in (root/'assets'/folder).iterdir():
  if f.is_file() and (folder!='vehicles' or f.stem.endswith('_H')):
   mime=mimetypes.guess_type(str(f))[0] or 'application/octet-stream'
   key='assets/'+folder+'/'+f.name
   assets[key]='data:'+mime+';base64,'+base64.b64encode(f.read_bytes()).decode('ascii')
# convert SVG image references in the HTML only
html=re.sub(r'(?<=href=")assets/environment/[^\"]+',lambda m:assets[m.group()],html)
# inline JS + media lookups (script order important)
assets_js=json.dumps(assets,ensure_ascii=False,separators=(',',':'))
html=html.replace('<script src="geometry.js"></script>', '<script>'+ (root/'geometry.js').read_text()+'</script>')
html=html.replace('<script src="path_input.js"></script>','<script>'+ (root/'path_input.js').read_text()+'</script>')
game=(root/'game.js').read_text()
game=game.replace("const tracks=['assets/audio/jorisvermeer-smooth-lofi-beat-566127.mp3','assets/audio/xethrocc-playa-del-sol-latin-lofi-160149.mp3'];", "const tracks=[window.KXR_EMBED_ASSETS['assets/audio/jorisvermeer-smooth-lofi-beat-566127.mp3'],window.KXR_EMBED_ASSETS['assets/audio/xethrocc-playa-del-sol-latin-lofi-160149.mp3']];")
html=html.replace('<script src="district_art.js"></script>','<script>'+ (root/'district_art.js').read_text()+'</script>')
html=html.replace('<script src="game.js"></script>','<script>window.KXR_EMBED_ASSETS='+assets_js+';</script><script>'+game+'</script>')
assert 'src="game.js"' not in html and 'src="geometry.js"' not in html
out=Path('/mnt/data/KXR_CITY_ALIVE_Choi_Ngay_5_Man_v05.html');out.write_text(html,encoding='utf8')
print('Standalone:',out,'MB',round(out.stat().st_size/1024/1024,1))

"""Generate the Schmutz identity assets from local type outlines and original geometry."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.fontBuilder import FontBuilder
from PIL import Image, ImageDraw, ImageFont
import json, math, shutil, zipfile, re

ROOT=Path(__file__).resolve().parents[1]
B=ROOT/'public'/'brand'
for folder in ['logos','icons','favicons','fonts','patterns','social','tokens']:(B/folder).mkdir(parents=True,exist_ok=True)
INK='#111110'; PAPER='#EEEAE2'; ORANGE='#FA633A'
COLORS={'Ink':INK,'Paper':PAPER,'Rust':ORANGE,'Acid':'#CFDE40','Lilac':'#D4B8D1','Ice':'#BED4EF'}
FONTDIR=Path('C:/Windows/Fonts')
LOGO_FONT=FONTDIR/'georgiaz.ttf'
SERIF=FONTDIR/'georgia.ttf'; ITALIC=FONTDIR/'georgiai.ttf'; SANS=FONTDIR/'arial.ttf'; BOLD=FONTDIR/'arialbd.ttf'

def svg(w,h,body,title='Schmutz brand asset'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img"><title>{title}</title>{body}</svg>'

def outline(text,fontpath=LOGO_FONT,spacing=-65):
 font=TTFont(fontpath); gs=font.getGlyphSet(); cmap=font.getBestCmap(); pen=SVGPathPen(gs); bounds=BoundsPen(gs); x=0
 for char in text:
  name=cmap[ord(char)]; trans=(1,0,0,1,x,0)
  gs[name].draw(TransformPen(pen,trans));gs[name].draw(TransformPen(bounds,trans))
  x+=font['hmtx'][name][0]+spacing
 return pen.getCommands(),bounds.bounds

WORD,WB=outline('schmutz'); MONO,MB=outline('s')

def fit_path(d,bounds,x,y,w,h,color):
 x0,y0,x1,y1=bounds; scale=min(w/(x1-x0),h/(y1-y0)); tx=x+(w-(x1-x0)*scale)/2-x0*scale;ty=y+(h-(y1-y0)*scale)/2+y1*scale
 return f'<path d="{d}" fill="{color}" transform="translate({tx:.4f} {ty:.4f}) scale({scale:.6f} {-scale:.6f})"/>'

def speck_points(cx,cy,r):
 result=[]
 for n in range(12):
  angle=math.radians(-83+n*30);radius=r*([1,.35,.92,.39,1,.36,.96,.4,.9,.34,1,.38][n])
  result.append((cx+math.cos(angle)*radius,cy+math.sin(angle)*radius))
 return result

def speck(cx,cy,r,color):
 points=' '.join(f'{x:.2f},{y:.2f}' for x,y in speck_points(cx,cy,r))
 return f'<polygon points="{points}" fill="{color}"/>'

def logo_svg(color=INK,secondary=False):
 body=fit_path(WORD,WB,40,35,1010,245,color)+speck(1130,90,45,color)
 if secondary:
  d,b=outline('DESIGN RESOURCES / SCHMUTZ.PRO',SANS,spacing=150)
  body+=fit_path(d,b,170,319,860,30,color)
 return svg(1200,390 if secondary else 320,body,'Schmutz primary wordmark' if not secondary else 'Schmutz secondary lockup')

def mono_svg(color=INK,background=None,size=512):
 body=f'<rect width="512" height="512" rx="70" fill="{background}"/>' if background else ''
 body+=fit_path(MONO,MB,106,80,270,360,color)+speck(395,120,42,color)
 return svg(512,512,body,'Schmutz s and speck monogram')

def word_png(width=2400,color=INK,secondary=False):
 ratio=(390 if secondary else 320)/1200; im=Image.new('RGBA',(width,round(width*ratio)));d=ImageDraw.Draw(im)
 font=ImageFont.truetype(str(LOGO_FONT),round(width*.25)); raw=Image.new('L',(width*2,width),'black');rd=ImageDraw.Draw(raw);x=20;baseline=round(width*.32)
 for c in 'schmutz':
  rd.text((x,baseline),c,font=font,anchor='ls',fill=255);x+=font.getlength(c)-65/2048*font.size
 box=raw.getbbox();raw=raw.crop(box);target=(round(width*1010/1200),round(width*245/1200));raw.thumbnail(target,Image.Resampling.LANCZOS)
 px=round(width*40/1200)+(target[0]-raw.width)//2;py=round(width*35/1200)+(target[1]-raw.height)//2
 im.paste(Image.new('RGBA',raw.size,color),(px,py),raw)
 d.polygon([(x*width/1200,y*width/1200) for x,y in speck_points(1130,90,45)],fill=color)
 if secondary:
  f=ImageFont.truetype(str(SANS),round(width*.025));label='DESIGN RESOURCES / SCHMUTZ.PRO';d.text((width/2,width*334/1200),label,font=f,fill=color,anchor='mm',stroke_width=0)
 return im

def mono_png(size=512,color=INK,bg=None):
 n=1024;im=Image.new('RGBA',(n,n));d=ImageDraw.Draw(im)
 if bg:d.rounded_rectangle((0,0,n,n),radius=140,fill=bg)
 mask=Image.new('L',(n,n));md=ImageDraw.Draw(mask);font=ImageFont.truetype(str(LOGO_FONT),700);md.text((200,770),'s',font=font,fill=255,anchor='ls');mask=mask.crop(mask.getbbox());mask.thumbnail((540,720),Image.Resampling.LANCZOS)
 im.paste(Image.new('RGBA',mask.size,color),(round(212+(540-mask.width)/2),round(160+(720-mask.height)/2)),mask)
 d.polygon([(x*2,y*2) for x,y in speck_points(395,120,42)],fill=color)
 return im.resize((size,size),Image.Resampling.LANCZOS)

for name,color in [('ink',INK),('paper',PAPER),('rust',ORANGE)]:
 for lockup in ['primary','secondary']:
  (B/'logos'/f'schmutz-{lockup}-{name}.svg').write_text(logo_svg(color,lockup=='secondary'),encoding='utf-8')
  word_png(2400,color,lockup=='secondary').save(B/'logos'/f'schmutz-{lockup}-{name}.png')
 (B/'logos'/f'schmutz-monogram-{name}.svg').write_text(mono_svg(color),encoding='utf-8')
 mono_png(1024,color).save(B/'logos'/f'schmutz-monogram-{name}.png')
 (B/'logos'/f'schmutz-speck-{name}.svg').write_text(svg(128,128,speck(64,64,58,color),'Schmutz speck'),encoding='utf-8')
 im=Image.new('RGBA',(512,512));ImageDraw.Draw(im).polygon(speck_points(256,256,232),fill=color);im.save(B/'logos'/f'schmutz-speck-{name}.png')

ICON_PATHS={
 'arrow-up-right':'<path d="M5 19 19 5M5 5h14v14"/>',
 'arrow-down-right':'<path d="m5 5 14 14M5 19h14V5"/>',
 'arrow-left':'<path d="M20 12H4m7-7-7 7 7 7"/>',
 'arrow-right':'<path d="M4 12h16m-7-7 7 7-7 7"/>',
 'download':'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 'upload':'<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
 'search':'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
 'close':'<path d="m5 5 14 14M19 5 5 19"/>',
 'plus':'<path d="M12 4v16M4 12h16"/>',
 'minus':'<path d="M4 12h16"/>',
 'check':'<path d="m4 12 5 5L20 6"/>',
 'menu':'<path d="M3 6h18M3 12h18M3 18h18"/>',
 'grid':'<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
 'layers':'<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
 'deck':'<path d="M3 3h18v13H3zM12 16v5m-5 0 5-5 5 5M7 7h10M7 11h6"/>',
 'play':'<path d="m8 4 12 8-12 8z"/>',
 'edit':'<path d="m4 16 12-12 4 4L8 20H4zM13 7l4 4"/>',
 'image':'<path d="M3 3h18v18H3zM3 17l6-6 4 4 3-3 5 5"/><circle cx="16" cy="8" r="1.5"/>',
 'personal':'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
 'commercial':'<path d="M3 7h18v14H3zM8 7V3h8v4M3 12l9 3 9-3M10 12h4"/>',
 'info':'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
 'mail':'<path d="M3 5h18v14H3zM3 5l9 8 9-8"/>',
 'heart':'<path d="M12 21 3 12C-3 5 6-2 12 5c6-7 15 0 9 7z"/>',
 'bag':'<path d="M4 7h16v14H4zM8 8V6a4 4 0 0 1 8 0v2"/>'
}
symbols=[]
for name,body in ICON_PATHS.items():
 inner=f'<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">{body}</g>'
 (B/'icons'/f'{name}.svg').write_text(svg(24,24,inner,f'Schmutz {name} icon'),encoding='utf-8')
 symbols.append(f'<symbol id="{name}" viewBox="0 0 24 24">{inner}</symbol>')
(B/'icons'/'schmutz-icons.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg">'+''.join(symbols)+'</svg>',encoding='utf-8')

fav=mono_png(512,PAPER,INK)
(B/'favicons'/'favicon.svg').write_text(mono_svg(PAPER,INK),encoding='utf-8')
for size,name in [(16,'favicon-16.png'),(32,'favicon-32.png'),(48,'favicon-48.png'),(180,'apple-touch-icon.png'),(192,'icon-192.png'),(512,'icon-512.png')]:fav.resize((size,size),Image.Resampling.LANCZOS).save(B/'favicons'/name)
fav.save(B/'favicons'/'favicon.ico',sizes=[(16,16),(32,32),(48,48),(64,64)])
for name,c,bg in [('ink',PAPER,INK),('paper',INK,PAPER),('rust',INK,ORANGE)]:mono_png(1080,c,bg).save(B/'social'/f'avatar-{name}.png')

pattern='<defs><pattern id="specks" width="160" height="160" patternUnits="userSpaceOnUse">'+speck(40,40,12,INK)+speck(120,120,8,INK)+'</pattern></defs><rect width="1200" height="1200" fill="'+PAPER+'"/><rect width="1200" height="1200" fill="url(#specks)"/>'
(B/'patterns'/'speck-grid.svg').write_text(svg(1200,1200,pattern,'Schmutz speck pattern'),encoding='utf-8')
(B/'patterns'/'crop-corners.svg').write_text(svg(1200,800,'<path d="M30 90V30h60M1110 30h60v60M1170 710v60h-60M90 770H30v-60" fill="none" stroke="'+INK+'" stroke-width="3"/>','Schmutz corner frame'),encoding='utf-8')

# An original small symbol font. These glyphs are original geometry, not extracted type.
glyph_names=['.notdef','speck','arrowNE','arrowSE','plus','minus','close','check','diamond']
polys={
 'speck':[[(round(x),round(y)) for x,y in speck_points(500,500,440)]],
 'arrowNE':[[(170,170),(245,170),(715,640),(715,270),(805,270),(805,805),(270,805),(270,715),(640,715),(170,245)]],
 'arrowSE':[[(170,830),(245,830),(715,360),(715,730),(805,730),(805,195),(270,195),(270,285),(640,285),(170,755)]],
 'plus':[[(450,100),(550,100),(550,450),(900,450),(900,550),(550,550),(550,900),(450,900),(450,550),(100,550),(100,450),(450,450)]],
 'minus':[[(100,450),(900,450),(900,550),(100,550)]],
 'close':[[(170,240),(240,170),(500,430),(760,170),(830,240),(570,500),(830,760),(760,830),(500,570),(240,830),(170,760),(430,500)]],
 'check':[[(100,500),(170,570),(390,350),(830,790),(900,720),(390,210)]],
 'diamond':[[(500,950),(950,500),(500,50),(50,500)]]
}
glyphs={}
for name in glyph_names:
 pen=TTGlyphPen(None)
 for poly in polys.get(name,[]):
  pen.moveTo(poly[0])
  for point in poly[1:]:pen.lineTo(point)
  pen.closePath()
 glyphs[name]=pen.glyph()
fb=FontBuilder(1000,isTTF=True);fb.setupGlyphOrder(glyph_names);fb.setupCharacterMap({0xE001+i:n for i,n in enumerate(glyph_names[1:])});fb.setupGlyf(glyphs);fb.setupHorizontalMetrics({n:(1000,0) for n in glyph_names});fb.setupHorizontalHeader(ascent=1000,descent=0);fb.setupNameTable({'familyName':'Schmutz Symbols','styleName':'Regular','uniqueFontIdentifier':'SchmutzSymbols-1.0','fullName':'Schmutz Symbols Regular','psName':'SchmutzSymbols-Regular','version':'Version 1.000'});fb.setupOS2(sTypoAscender=1000,sTypoDescender=0,usWinAscent=1000,usWinDescent=0);fb.setupPost();fb.save(B/'fonts'/'SchmutzSymbols-Regular.ttf');fb.font.flavor='woff';fb.font.save(B/'fonts'/'SchmutzSymbols-Regular.woff')
(B/'fonts'/'SYMBOL-LICENSE.txt').write_text('Schmutz Symbols v1.0\nCopyright 2026 Schmutz / Justin von Braun.\nOriginal symbol artwork. Ownership reserved to Schmutz. Use by Schmutz and its authorized contractors is permitted. This font is brand artwork, not a third-party text typeface.\n',encoding='utf-8')
(B/'fonts'/'font-package.css').write_text('''/* Brand typography uses system-installed fonts. No third-party font binaries are included. */
:root { --schmutz-display: Georgia, "Times New Roman", serif; --schmutz-body: Arial, Helvetica, sans-serif; }
@font-face { font-family: "Schmutz Symbols"; src: url("SchmutzSymbols-Regular.woff") format("woff"), url("SchmutzSymbols-Regular.ttf") format("truetype"); font-style: normal; font-weight: 400; font-display: block; }
.schmutz-symbol { font-family: "Schmutz Symbols"; font-style: normal; font-weight: 400; }
''',encoding='utf-8')
(B/'fonts'/'TYPE-SETUP.txt').write_text('''SCHMUTZ TYPOGRAPHY / V1

CURRENT IDENTITY
Georgia Regular and Italic: editorial headings.
Arial Regular and Bold: navigation, body, utility labels.
Primary logo: supplied as fixed outlines; never retype it.
These fonts are used from existing system installations. Their binary font files are not included or licensed by this package. SVG and PNG logo assets do not require the fonts.

ORIGINAL SYMBOL FONT INCLUDED
SchmutzSymbols-Regular.ttf: install in your operating system or import into a supported design tool.
SchmutzSymbols-Regular.woff: web font. See font-package.css.
Private-use character map: E001 speck, E002 northeast arrow, E003 southeast arrow, E004 plus, E005 minus, E006 close, E007 check, E008 diamond.

OPTIONAL OPEN-SOURCE TEXT FONT PACKAGE / NOT YET DOWNLOADED
Fraunces: https://github.com/google/fonts/tree/main/ofl/fraunces
Manrope: https://github.com/google/fonts/tree/main/ofl/manrope
Each source directory supplies its OFL.txt license. Download and keep that license with its font files. These are possible future alternatives, not the typefaces used by the current wordmark. Browser permission prevented downloading and packaging these fonts in this session.

CANVA / ADOBE EXPRESS / FIGMA
Import the supplied outlined SVG marks to preserve their shape. Use transparent PNG when SVG import is unavailable. Font upload and brand-kit support vary by platform and plan. If the exact typeface is unavailable, upload a separately licensed font or use the supplied outlined logo; do not rebuild the logo in a substitute font.
''',encoding='utf-8')

def rgb(h):return [int(h[i:i+2],16) for i in (1,3,5)]
tokens={'brand':'Schmutz','version':'1.0','colors':{n.lower():{'hex':h,'rgb':rgb(h)} for n,h in COLORS.items()},'type':{'display':{'family':'Georgia','fallback':'Times New Roman, serif','weights':[400],'styles':['normal','italic']},'body':{'family':'Arial','fallback':'Helvetica, sans-serif','weights':[400,700]},'symbols':{'family':'Schmutz Symbols','file':'fonts/SchmutzSymbols-Regular.woff'}},'spacing':[4,8,12,16,24,32,48,64,96],'radii':{'ui':0,'avatar':70},'icon':{'grid':24,'stroke':1.6,'cap':'square','join':'miter'},'logos':{'minWidthDigital':140,'clearSpace':'Half the height of the lowercase s on all sides'}}
(B/'tokens'/'brand-tokens.json').write_text(json.dumps(tokens,indent=2)+'\n',encoding='utf-8')
(B/'tokens'/'brand-tokens.css').write_text(':root{'+''.join(f'--schmutz-{n.lower()}:{h};' for n,h in COLORS.items())+'--schmutz-display:Georgia,"Times New Roman",serif;--schmutz-body:Arial,Helvetica,sans-serif;--schmutz-icon-stroke:1.6;--schmutz-radius:0;}\n',encoding='utf-8')
ase=b'ASEF'+(1).to_bytes(2,'big')+(0).to_bytes(2,'big')+len(COLORS).to_bytes(4,'big')
import struct
for name,c in COLORS.items():
 label=(name+'\0').encode('utf-16-be');payload=struct.pack('>H',len(name)+1)+label+b'RGB '+struct.pack('>fff',*[v/255 for v in rgb(c)])+struct.pack('>H',0);ase+=struct.pack('>HI',1,len(payload))+payload
(B/'tokens'/'schmutz-swatches.ase').write_bytes(ase)
(B/'tokens'/'schmutz-swatches.gpl').write_text('GIMP Palette\nName: Schmutz\nColumns: 6\n#\n'+''.join(f'{r:3} {g:3} {b:3}\t{name}\n' for name,h in COLORS.items() for r,g,b in [rgb(h)]),encoding='utf-8')

# A high-resolution overview and social cover, using the exact local type.
board=Image.new('RGB',(1800,2100),INK);d=ImageDraw.Draw(board)
def text(x,y,s,size=25,color=PAPER,font=SANS):d.text((x,y),s,font=ImageFont.truetype(str(font),size),fill=color)
text(75,60,'SCHMUTZ / IDENTITY SYSTEM',22);text(1460,60,'VOL. 01 / 2026',18)
brand=word_png(1640,PAPER);board.paste(brand,(60,145),brand)
d.line((75,620,1725,620),fill='#494843',width=2)
text(75,670,'Good design.',105,font=SERIF);text(75,790,'A little dirty.',105,font=ITALIC)
for i,(n,h) in enumerate(COLORS.items()):
 x=75+i*275;d.rectangle((x,1000,x+260,1210),fill=h);text(x,1232,n,24);text(x,1270,h,19,color='#AAA79F')
d.rectangle((75,1360,595,1845),fill=PAPER);mark=mono_png(385,INK);board.paste(mark,(140,1400),mark)
d.rectangle((615,1360,1135,1845),fill=ORANGE);mark=mono_png(385,INK);board.paste(mark,(680,1400),mark)
d.rectangle((1155,1360,1725,1845),fill='#BED4EF');dd=ImageDraw.Draw(board);dd.polygon(speck_points(1440,1600,155),fill=INK)
text(75,1900,'01 / OUTLINED LOGOS',19);text(615,1900,'02 / MONOGRAMS',19);text(1155,1900,'03 / ORIGINAL ICONS',19)
d.line((75,1990,1725,1990),fill='#494843',width=2);text(75,2025,'Georgia + Arial / Ink + Paper + Rust / schmutz.pro',20)
board.save(B/'brand-overview.png')
cover=Image.new('RGB',(1200,630),ORANGE);cd=ImageDraw.Draw(cover);mark=word_png(1100,INK);cover.paste(mark,(50,115),mark);cd.text((65,520),'GOOD DESIGN. A LITTLE DIRTY.',font=ImageFont.truetype(str(SANS),24),fill=INK);cd.text((970,520),'SCHMUTZ.PRO',font=ImageFont.truetype(str(SANS),18),fill=INK);cover.save(B/'social'/'open-graph.png')

readme='''# Schmutz Brand System v1

Open index.html for the full visual guide. All logo SVG files contain outlines, so they stay consistent without installing typefaces. PNG exports have transparent backgrounds. Primary and secondary wordmarks are 2400 px wide; monograms are 1024 px. Logos are supplied in Ink, Paper, and Rust.

Contents: logos / icons / favicons / fonts / patterns / social / tokens.

Use primary logos at 140 px wide or larger; use the monogram below that. Keep clear space of half the height of the lowercase s. For print, use the SVG masters and select the output profile with your printer. Color values here are sRGB; no unverified Pantone or press profile equivalents are supplied.

Typography: Georgia Regular and Italic for display, Arial Regular and Bold for supporting text. These are system fonts, not bundled third-party font files. The original Schmutz Symbols TTF/WOFF font is included. TYPE-SETUP.txt explains installation, platform use, and optional open-source text fonts whose download is pending permission.

Logo lettering was converted from the locally installed Georgia Bold Italic into fixed vector artwork with adjusted spacing. The speck geometry and utility icon artwork were created for this kit. This is a typography-based identity, not a newly drawn text typeface. Use the supplied logo master rather than retyping it.

Brand artwork is for Schmutz and its authorized contractors. The public repository is not a grant of trademark rights or a resale license for these brand assets. Product Personal Use and Commercial Use licenses apply separately to the templates you sell.
'''
(B/'README.md').write_text(readme,encoding='utf-8')
print(f'Generated {len(list(B.rglob("*")))} brand entries in {B}')

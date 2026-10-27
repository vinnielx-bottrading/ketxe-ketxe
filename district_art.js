/* Environment-only district decorations. Graph roads remain unobstructed; blocked branches are signposted and physically closed by geometry.js. */
(function(root){
 const warehouse=`
 <g filter="url(#shadow)">
   <rect x="1193" y="64" width="340" height="227" rx="11" fill="#9ba9a6" stroke="#eee5d2" stroke-width="8"/>
   <rect x="1206" y="77" width="315" height="197" rx="7" fill="#6c888c" stroke="#466270" stroke-width="4"/>
   ${Array.from({length:9},(_,i)=>`<path d="M${1210+i*37} 80V271" stroke="#aec5ca" stroke-width="8" opacity=".44"/>`).join('')}
   <rect x="1208" y="237" width="306" height="33" rx="4" fill="#dfbf6d"/>
   <text x="1360" y="262" text-anchor="middle" font-size="24" font-weight="900" fill="#4e4030">KHO TRUNG CHUYỂN</text>
   <rect x="1205" y="640" width="320" height="204" rx="10" fill="#928b7c" stroke="#dfd2b7" stroke-width="9"/>
   <rect x="1224" y="656" width="286" height="173" fill="#586a6c"/>
   ${Array.from({length:4},(_,i)=>`<rect x="${1240+(i%2)*116}" y="${660+Math.floor(i/2)*77}" width="93" height="64" rx="6" fill="#a77c4a" stroke="#60482e" stroke-width="5"/><path d="M${1240+(i%2)*116} ${660+Math.floor(i/2)*77}l93 64m0 -64l-93 64" stroke="#dbb77f" stroke-width="4"/>`).join('')}
   <text x="1364" y="824" text-anchor="middle" font-size="17" fill="#ffe7ad" font-weight="900">BÃI HÀNG</text>
 </g>
 <g><path d="M1194 395V510" stroke="#ffd05d" stroke-width="7" opacity=".6" stroke-dasharray="18 11"/><text x="1270" y="385" font-size="19" font-weight="900" fill="#f7e3ad" stroke="#203742" stroke-width="3" paint-order="stroke">LỐI VÀO KHO ➜</text></g>
 `;
 const market=`
 <g filter="url(#shadow)">
  ${Array.from({length:4},(_,i)=>{let x=1201+(i%2)*163,y=77+Math.floor(i/2)*103;return `<rect x="${x}" y="${y}" width="149" height="91" rx="9" fill="${i%2?'#f6e1ce':'#f2d2c2'}" stroke="#dcc7ae" stroke-width="6"/><rect x="${x+6}" y="${y+6}" width="137" height="77" rx="5" fill="${i%2?'#d4684f':'#47a3a1'}"/>${Array.from({length:7},(_,j)=>`<rect x="${x+7+j*19.5}" y="${y+7}" width="9" height="74" fill="#f5e6dc" opacity=".82"/>`).join('')}</>`}).join('')}
  <rect x="1205" y="648" width="310" height="180" rx="12" fill="#a3b27d" stroke="#e5d4b3" stroke-width="9"/>
  ${Array.from({length:6},(_,i)=>{let x=1223+(i%3)*98,y=662+Math.floor(i/3)*73;return `<rect x="${x}" y="${y}" width="78" height="58" rx="5" fill="${i%2?'#cc6c4a':'#e2c167'}" stroke="#7d5d39" stroke-width="4"/><path d="M${x+6} ${y+9}h66m-66 15h66" stroke="#fff0c4" stroke-width="4" opacity=".8"/>`}).join('')}
  <rect x="54" y="68" width="225" height="208" rx="12" fill="#b7b2a1" stroke="#e9dbc1" stroke-width="8"/>
  <rect x="65" y="82" width="204" height="182" rx="6" fill="#d0a86c"/>
  <path d="M68 102h197M68 148h197M68 194h197M68 240h197" stroke="#f2e0ac" stroke-width="12"/>
 </g>
 <g font-weight="900" font-size="18" paint-order="stroke" stroke="#183943" stroke-width="3"><text x="1345" y="303" fill="#ffe5b9" text-anchor="middle">CHỢ PHỐ NHỎ</text><text x="1150" y="612" fill="#ffd586">SẠP HÀNG</text></g>
 <g><rect x="1036" y="723" width="86" height="38" rx="7" fill="#e47b48" stroke="#fff0cd" stroke-width="4"/><path d="M1048 730l18 24m0-24l18 24m0-24l18 24" stroke="#fff1d0" stroke-width="7"/><text x="1121" y="704" text-anchor="middle" font-size="16" font-weight="900" fill="#ffd8b0">LỐI ĐỖ ĐÃ KHÓA</text></g>
 `;
 const construction=`
 <g filter="url(#shadow)">
 <rect x="1186" y="625" width="348" height="222" rx="12" fill="#bca77f" stroke="#e1d1ae" stroke-width="9"/>
 <rect x="1203" y="645" width="311" height="184" fill="#946d4f"/>
 ${Array.from({length:6},(_,i)=>`<path d="M${1210+i*52} 647v178" stroke="#5c463a" stroke-width="3" opacity=".56"/>`).join('')}
 <path d="M1250 680h200l-40 82-167-12z" fill="#4d4136" stroke="#b28f69" stroke-width="7"/>
 ${Array.from({length:5},(_,i)=>`<rect x="${1210+i*59}" y="783" width="39" height="22" rx="3" fill="#e2b348" stroke="#744d2d" stroke-width="3"/>`).join('')}
 <rect x="1190" y="65" width="351" height="230" rx="10" fill="#a9b4b6" stroke="#e2d8be" stroke-width="8"/>
 <rect x="1208" y="85" width="310" height="194" fill="#748b8b"/>
 <g stroke="#f4cd7b" stroke-width="5" stroke-dasharray="18 8"><path d="M1215 110h299M1215 252h299"/></g>
 <text x="1365" y="198" fill="#ffefa9" font-size="28" text-anchor="middle" font-weight="900" stroke="#434d4d" stroke-width="4" paint-order="stroke">CÔNG TRƯỜNG</text>
 </g>
 <g><rect x="323" y="728" width="80" height="33" rx="4" fill="#ffb137" stroke="#342e22" stroke-width="4"/>
 ${Array.from({length:5},(_,i)=>`<path d="M${329+i*15} 731l-13 26" stroke="#28251f" stroke-width="8"/>`).join('')}
 ${[295,310,390].map((x,i)=>`<path d="M${x-9} ${765+i%2*4}l10-26 10 26z" fill="#f07e3a" stroke="#ffddb9" stroke-width="3"/>`).join('')}
 <text x="336" y="710" font-size="16" font-weight="900" text-anchor="middle" fill="#ffe39f" stroke="#233b41" stroke-width="3" paint-order="stroke">ĐƯỜNG ĐANG SỬA</text></g>
 `;
 const central='';
 const ART={central,warehouse,market,construction};
 root.KXR_DistrictArt={render:(name)=>ART[name]||central};
})(window);

import json,copy
from pathlib import Path
root=Path(__file__).parent
base=json.loads(Path('/mnt/data/KXR_CITY_ALIVE_DRAW_PATH_v03/mission_01.json').read_text())
base_seq=base['sampleSolution']

def car(id,name,sprite,node,direction):
    return {'id':id,'name':name,'sprite':sprite,'node':node,'direction':direction}

def make(n,title,brief,targetName,targetSprite,icon,goalLabel,goalSymbol,extras=(),pre=(),post=()):
    d=copy.deepcopy(base)
    d.update({'id':f'KXR_CITYALIVE_MISSION_{n:02}', 'level':n,'version':'0.4.0-color-levels', 'title':title,'brief':brief,'goalLabel':goalLabel,'goalSymbol':goalSymbol,'missionIcon':icon,'status':'playable-preview', 'sampleSolution':list(pre)+base_seq+list(post)})
    d['vehicles'][0].update({'name':targetName,'sprite':targetSprite})
    d['vehicles'] += list(extras)
    d['rules']['turns_for_example']=len(d['sampleSolution'])
    d['rules']['optimal_turns']=None
    d['notes'] += ['All non-target route colors match the selected vehicle paint.', 'Additional mission blockers validated with whole-body SAT and swept curves.','The example is a valid walk-through, not a proven shortest solution.']
    (root/'levels'/f'mission_{n:02}.json').write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
    return d
levels=[make(1,'Mở đường cứu thương', 'Giao lộ tắc nghẽn. Dời từng xe để cứu thương đến bệnh viện.', 'Xe cứu thương',11,'🚑','BỆNH VIỆN','✚'),
make(2,'Xe buýt trễ chuyến','Giải phóng xe buýt và chiếc xe bạc chắn ngay trước bến.', 'Xe buýt tuyến phố',8,'🚌','BẾN XE','▣', extras=[car('K','Hatchback bạc ở phía đông',10,'E1','H')],post=[{'vehicle':'K','to':'J2'},{'vehicle':'K','to':'S2'}]),
make(3,'Chuyến hàng khẩn','Xe tải dài mắc kẹt trên phố, cần thông đường đến kho giao hàng.', 'Xe tải chở hàng',9,'🚚','KHO HÀNG','▤', extras=[car('K','Hatchback bạc chặn kho',10,'E2','H')],post=[{'vehicle':'K','to':'E1'},{'vehicle':'K','to':'J2'},{'vehicle':'K','to':'S2'}]),
make(4,'Giao hàng giờ cao điểm','Hai tuyến đông xe. Dời taxi và hatchback để van giao hàng qua cả hai ngã tư.', 'Van giao hàng ưu tiên',6,'🚐','ĐIỂM GIAO','▣',extras=[car('K','Hatchback bạc cuối phố',10,'E1','H'),car('L','Taxi vàng đỗ sai',3,'S2','V')],pre=[{'vehicle':'L','to':'S2B'}],post=[{'vehicle':'K','to':'J2'},{'vehicle':'K','to':'S2'}]),
make(5,'Hai ngã tư kẹt cứng','Mở đường cứu thương qua hai nút thắt. Cần dời cả xe xếp phía nam và xe đỗ chắn lối đông.', 'Xe cứu thương',11,'🚑','BỆNH VIỆN','✚',extras=[car('K','Hatchback bạc chắn lối đông',10,'E2','H'),car('L','Taxi vàng đậu trong làn',3,'S2','V'),car('M','Sedan xanh chắn nơi đỗ',2,'S2B','H')],pre=[{'vehicle':'M','to':'S2P'},{'vehicle':'L','to':'S2B'}],post=[{'vehicle':'K','to':'E1'},{'vehicle':'K','to':'J2'},{'vehicle':'K','to':'S2'}])]
(root/'levels'/'manifest.json').write_text(json.dumps([{'level':d['level'],'title':d['title'],'icon':d['missionIcon'],'goal':d['goalLabel'],'sampleMoves':len(d['sampleSolution']),'cars':len(d['vehicles'])} for d in levels],ensure_ascii=False,indent=2),encoding='utf8')
(root/'level_bundle.json').write_text(json.dumps(levels,ensure_ascii=False,separators=(',',':')),encoding='utf8')
print('\n'.join(f'Màn {d["level"]}: {d["title"]}, {len(d["vehicles"])} xe, {len(d["sampleSolution"])} đoạn hợp lệ mẫu' for d in levels))

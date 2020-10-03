import json

tles = {}
tles['tles'] = []
with open('sats.txt') as f:
    lines_iter = iter(f.readlines())
    for name_l1_l2 in zip(lines_iter, lines_iter, lines_iter):
        tles['tles'].append({
            ''.join(name_l1_l2)
        })
class SetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)

with open('tles.json', 'w') as f:
    json.dump(tles, f, cls=SetEncoder)
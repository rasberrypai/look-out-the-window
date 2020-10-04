import json

tles = {}
tles['tles'] = []
with open('sats.txt') as f:
    lines = f.readlines()
    for i in range(len(lines) // 3):
        tles['tles'].append([
            lines[i * 3],
            lines[i * 3 + 1],
            lines[i * 3 + 2]
        ])

class SetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)

with open('tles.json', 'w') as f:
    json.dump(tles, f, cls=SetEncoder)
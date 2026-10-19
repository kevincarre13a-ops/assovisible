import requests, json, sys
out=sys.argv[1]
url="https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records"
rows=[];off=0
while True:
    r=requests.get(url,params={"where":'code_insee_commune like "91*" and pivot like "mairie"',"limit":100,"offset":off,
        "select":"nom,code_insee_commune,site_internet,adresse_courriel,telephone,adresse"},timeout=40)
    r.raise_for_status(); j=r.json(); res=j["results"]; rows+=res
    off+=100
    if off>=j["total_count"] or not res: break
json.dump(rows,open(out,"w"),ensure_ascii=False,indent=1)
print(len(rows),"records; total",j["total_count"])

from bs4 import BeautifulSoup
import urllib.request
import time
import json


def get_all_traffic(url, filter=None):
	req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
	html_page = urllib.request.urlopen(req).read()
	soup = BeautifulSoup(html_page, 'html.parser').select(".EntityList-items .EntityList-item")

	# DATA
	traffics = []

	for traffic in soup:
		# TITLE
		title = traffic.select(".fs-22px fw-bold text-primary")

		if len(title) > 0:
			if filter is not None and isinstance(filter, list) and len(filter) > 0:
				if any(term in title[0].text.lower() for term in filter):
					title = title[0].text
				else: continue
			else:
				title = title[0].text
		else: continue
		# CONTENT
		content = traffic.select("pp-content-container, .text")
		if len(content) > 0:
			content = content[0].text.strip()
		else: continue
		# DATE
		date = "promet.si"+traffic.get("promet-card-header-right-value-0")

		def decode(x):
			return x.replace("\u00a0\u20ac", "eur").replace("\u0161", "s").replace("\u0160", "s").replace("\u010d", "c").replace("\u017e", "z")

		traffics.append({
			"title": decode(title),
			"content": decode(content),
			"date": date
			})

	return traffics


def get_new_traffic(traffics, refresh):
	old_links = [traffic.get("link") for traffic in traffics]
	new = []
	
	for ad in refresh:
		if ad.get("link") not in old_links:
			new.append(ad)

	return new



def print_traffics(traffics):
	for traffic in traffics:
		try:
			print("Title: "+traffic.get("title"))
			print("Content: "+traffic.get("content"))
			print("Date:  "+traffic.get("date"))
			print("\n")
		except: 
			pass


def set_default(obj):
	if isinstance(obj, set):
		return list(obj)



if __name__ == "__main__":
	url = "https://www.promet.si/sl"
	interval = 30

	# Initial traffics
	traffics = get_all_traffic(url)

	print("Number of initial traffic: "+str(len(traffics)))
	print("New traffic since start: \n")
	
	try:
		while True:
			refresh_traffic = get_all_traffic(url)
			new_traffic = get_new_traffic(traffics, refresh_traffic)

			if len(new_traffic) > 0:
				traffics = refresh_traffic
				print_traffics(new_traffic)

			time.sleep(interval)

	except KeyboardInterrupt:
		print("Exited loop\n\n")
		print("All traffics collected: \n")
		print(json.dumps(ads, indent=4, sort_keys=False, default=set_default))
	except Exception as e:
		print("Unknown exception: ")
		print(e)

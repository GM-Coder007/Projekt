from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

"""
    Install ChromeDriver for Chrome
    https://stackoverflow.com/questions/45448994/wait-page-to-load-before-getting-data-with-requests-get-in-python-3/68787500#68787500
"""


def get_traffic_info(url):
    TIMEOUT = 5
    selector = ".scroll-content > span > div > p"

    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--log-level=3")
    browser = webdriver.Chrome(options=options, executable_path='./chromedriver.exe')

    sections = []

    try:
        browser.get(url)
        WebDriverWait(browser, TIMEOUT).until(ec.presence_of_element_located((By.CSS_SELECTOR, selector)))
        html = browser.page_source
        soup = BeautifulSoup(html, features="html.parser")

        content = soup.select(selector)
        index = 0
        for item in content:
            item_html = str(item)

            if item_html.startswith("<p><strong>"):
                index += 1
                sections.append({"title": item.string, "text": ""})
            else:
                sections[index - 1]["text"] += item.text

    except TimeoutException:
        print("Timed out")
    finally:
        browser.quit()

    return sections



if __name__ == "__main__":
    url = "https://www.rtvslo.si/stanje-na-cestah"
    info = get_traffic_info(url)

    print(info)
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import json

def scrape_gfg_selenium(pages=2):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    results = []
    base_url = "https://www.geeksforgeeks.org/category/interview-experiences"

    for page in range(1, pages + 1):
        url = base_url if page == 1 else f"{base_url}/page/{page}/"
        print(f"📄 Fetching GFG page {page}: {url}")
        driver.get(url)
        time.sleep(2)

        try:
            accept_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Accept')]")
            accept_button.click()
            print("🍪 Cookie banner accepted")
        except:
            pass

        soup = BeautifulSoup(driver.page_source, "html.parser")
        links = soup.select("a[href*='/interview-experience']")  # Broad match
        print(f"🔍 Found {len(links)} article links")

        seen = set()
        filtered_links = []
        for a in links:
            href = a.get("href")
            if href and href.startswith("https://www.geeksforgeeks.org/") and href not in seen:
                seen.add(href)
                filtered_links.append(a)

        for a_tag in filtered_links:
            post_url = a_tag.get("href")
            title = a_tag.get_text(strip=True)

            try:
                driver.get(post_url)
                time.sleep(1.2)
                post_soup = BeautifulSoup(driver.page_source, "html.parser")
                content_div = post_soup.find("div", class_="text")
                content = content_div.get_text(separator="\n").strip() if content_div else ""

                if content:
                    results.append({
                        "title": title,
                        "url": post_url,
                        "content": content,
                        "source": "GeeksforGeeks",
                        "company": "",
                        "role": "",
                        "rounds": [],
                        "difficulty": "",
                        "question_count": 0,
                        "raw_questions": []
                    })
                    print(f"✅ Scraped: {title}")
                else:
                    print(f"⚠️ No content at: {post_url}")
            except Exception as e:
                print(f"❌ Error scraping {post_url}: {e}")

    driver.quit()

    with open("gfg_interview_data2.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Scraped {len(results)} interview experiences from GeeksforGeeks.")
    print("📁 Data saved to gfg_interview_data.json")
    return results

if __name__ == "__main__":
    scrape_gfg_selenium(pages=2)

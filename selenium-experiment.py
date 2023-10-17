from selenium import webdriver
import time
# Create an instance of ChromeOptions
options = webdriver.ChromeOptions()

# Use the options when creating a new Chrome browser instance
browser = webdriver.Chrome(options=options)
browser.get('https://www.amazon.de/')

time.sleep(900000000)

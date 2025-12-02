from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta


app = Flask(__name__, template_folder='pages')
CORS(app)  # <--- 2. 啟用 CORS，允許所有來源的跨域請求
app.config['JSON_AS_ASCII'] = False # 讓回傳的 JSON 可以顯示中文


# 設定靜態資源快取
@app.after_request
def add_header(response):
    # 這裡的程式碼會在每個回應送出後執行
    # 幫所有回應都加上快取標頭，讓瀏覽器知道可以快取檔案囉！
    response.cache_control.max_age = 60*30  # 設定為一年，單位是秒
    response.cache_control.public = True       # 表示可以被瀏覽器和代理伺服器快取
    # 如果您也想設定 Expires 標頭，可以這樣做：
    response.expires = datetime.now() + timedelta(minutes=30)
    return response


# 定義根目錄的路由
@app.route('/')
def background():
    return send_from_directory(app.template_folder, "index.html")


# 讓伺服器可以直接提供靜態檔案（例如您的模型和圖片）
@app.route('/static/<path:filename>')
def static_files(filename):
    # 這邊會找到並送出您在網頁裡需要的靜態檔案
    return send_from_directory('static', filename)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
import os
import mimetypes

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # CORSヘッダーを追加
        try:
            # ルートパスの場合、index.htmlを提供
            if self.path == '/':
                self.path = '/index.html'
            
            # 親クラスのdo_GETを呼び出す
            return SimpleHTTPRequestHandler.do_GET(self)
            
        except Exception as e:
            print(f"エラーが発生しました: {str(e)}")
            self.send_error(500, "内部サーバーエラー")
    
    def end_headers(self):
        # CORSヘッダーを追加
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        SimpleHTTPRequestHandler.end_headers(self)
    
    def guess_type(self, path):
        # 追加のMIMEタイプを定義
        mime_types = {
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.html': 'text/html',
            '.svg': 'image/svg+xml',
            '.json': 'application/json',
        }
        
        ext = os.path.splitext(path)[1]
        if ext in mime_types:
            return mime_types[ext]
        
        return SimpleHTTPRequestHandler.guess_type(self, path)

def run(server_class=HTTPServer, handler_class=CustomHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"サーバーを起動しました。http://localhost:{port} にアクセスしてください。")
    
    # ブラウザで自動的に開く
    webbrowser.open(f'http://localhost:{port}')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nサーバーを停止します。")
        httpd.server_close()
    except Exception as e:
        print(f"予期せぬエラーが発生しました: {str(e)}")
        httpd.server_close()

if __name__ == '__main__':
    run() 
from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, port=8000):
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

if __name__ == '__main__':
    run() 
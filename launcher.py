#!/usr/bin/env python3
"""
The Echo Chamber Simulator - Desktop Instance Launcher
Runs a zero-dependency lightweight local HTTP server and opens the game
seamlessly in your browser or desktop window.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time

PORT = 8089
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Suppress noisy server log output in launcher
        pass

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"[OK] The Echo Chamber Simulator server active on http://localhost:{PORT}")
        httpd.serve_forever()

def main():
    print("=" * 65)
    print(" ⚡ THE ECHO CHAMBER SIMULATOR (Real-Time Feed Rot) ⚡")
    print("   Satirical Algorithmic Outrage Balancing Engine")
    print("=" * 65)
    
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    time.sleep(0.5)
    url = f"http://localhost:{PORT}/index.html"
    print(f"Opening desktop feed instance: {url}")
    print("Press Ctrl+C in this terminal to terminate the instance.\n")

    try:
        webbrowser.open(url)
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Algorithmic server offline. Humanity touches grass.")
        sys.exit(0)

if __name__ == "__main__":
    main()


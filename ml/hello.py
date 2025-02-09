import ssl
import certifi
import socket

def test_ssl_connection():
    try:
        context = ssl.create_default_context(cafile=certifi.where())
        with socket.create_connection(("api.openai.com", 443)) as sock:
            with context.wrap_socket(sock, server_hostname="api.openai.com") as ssock:
                print("SSL Connection Successful!")
    except Exception as e:
        print(f"SSL Connection Failed: {str(e)}")

# Run this test before starting your application
test_ssl_connection()

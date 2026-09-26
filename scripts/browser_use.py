import os
import sys
import httpx
from pathlib import Path

def get_api_key():
    key = os.getenv("BROWSER_USE_API_KEY")
    if key:
        return key.strip()
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("BROWSER_USE_API_KEY="):
                    return line.replace("BROWSER_USE_API_KEY=", "").strip()
    return None

API_BASE = "https://api.browser-use.com/api/v4"
API_BASE_V3 = "https://api.browser-use.com/api/v3"

class BrowserUseClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or get_api_key()
        if not self.api_key:
            raise ValueError("BROWSER_USE_API_KEY is not defined in environment or .env file")
        self.headers = {
            "Content-Type": "application/json",
            "X-Browser-Use-API-Key": self.api_key
        }

    def list_browsers(self):
        with httpx.Client(timeout=30) as client:
            res = client.get(f"{API_BASE_V3}/browsers", headers=self.headers)
            res.raise_for_status()
            return res.json()

    def list_runs(self):
        with httpx.Client(timeout=30) as client:
            res = client.get(f"{API_BASE}/runs", headers=self.headers)
            res.raise_for_status()
            return res.json()

    def create_run(self, task: str, **kwargs):
        payload = {"task": task, **kwargs}
        with httpx.Client(timeout=30) as client:
            res = client.post(f"{API_BASE}/runs", headers=self.headers, json=payload)
            res.raise_for_status()
            return res.json()

if __name__ == "__main__":
    try:
        client = BrowserUseClient()
        browsers = client.list_browsers()
        runs = client.list_runs()
        print("✅ الاتصال مع Browser Use (Python) ناجح ومفعل 100%!")
        total = browsers.get("totalItems", len(browsers.get("items", [])))
        print(f"📊 عدد المتصفحات المسجلة: {total}")
    except Exception as e:
        print(f"❌ خطأ: {e}", file=sys.stderr)
        sys.exit(1)

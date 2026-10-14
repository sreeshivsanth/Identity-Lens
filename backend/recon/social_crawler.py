"""
IdentityLens — Live Asynchronous Social & Shadow Account Crawler
Powered by WhatsMyName / Sherlock platform probe logic.
Zero API keys required. 100% Free & Open Source.
"""
import httpx
import asyncio
from typing import List, Dict, Any

class LiveSocialCrawler:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        }
        
        # Primary high-signal platforms
        self.sites = [
            {
                "platform": "GitHub",
                "check_url": "https://api.github.com/users/{}",
                "profile_url": "https://github.com/{}",
                "method": "GET",
                "valid_code": 200,
                "category": "Development",
            },
            {
                "platform": "Reddit",
                "check_url": "https://www.reddit.com/user/{}/about.json",
                "profile_url": "https://reddit.com/user/{}",
                "method": "GET",
                "valid_code": 200,
                "category": "Social Media",
            },
            {
                "platform": "Telegram",
                "check_url": "https://t.me/{}",
                "profile_url": "https://t.me/{}",
                "method": "GET",
                "valid_code": 200,
                "category": "Messaging",
            },
            {
                "platform": "GitLab",
                "check_url": "https://gitlab.com/api/v4/users?username={}",
                "profile_url": "https://gitlab.com/{}",
                "method": "GET",
                "valid_code": 200,
                "category": "Development",
            },
            {
                "platform": "HackerNews",
                "check_url": "https://hacker-news.firebaseio.com/v0/user/{}.json",
                "profile_url": "https://news.ycombinator.com/user?id={}",
                "method": "GET",
                "valid_code": 200,
                "category": "Technical Forum",
            },
            {
                "platform": "Dev.to",
                "check_url": "https://dev.to/api/users/by_username?url={}",
                "profile_url": "https://dev.to/{}",
                "method": "GET",
                "valid_code": 200,
                "category": "Blogging",
            },
            {
                "platform": "Gravatar",
                "check_url": "https://en.gravatar.com/{}.json",
                "profile_url": "https://en.gravatar.com/{}",
                "method": "GET",
                "valid_code": 200,
                "category": "Identity Profile",
            },
            {
                "platform": "Spotify",
                "check_url": "https://open.spotify.com/user/{}",
                "profile_url": "https://open.spotify.com/user/{}",
                "method": "GET",
                "valid_code": 200,
                "category": "Audio & Media",
            },
            {
                "platform": "Pinterest",
                "check_url": "https://www.pinterest.com/{}/",
                "profile_url": "https://www.pinterest.com/{}/",
                "method": "GET",
                "valid_code": 200,
                "category": "Social Media",
            },
            {
                "platform": "Medium",
                "check_url": "https://medium.com/@{}",
                "profile_url": "https://medium.com/@{}",
                "method": "GET",
                "valid_code": 200,
                "category": "Publishing",
            },
        ]

    async def probe_single_platform(self, client: httpx.AsyncClient, site: dict, username: str) -> Dict[str, Any]:
        url = site["check_url"].format(username)
        profile_url = site["profile_url"].format(username)
        try:
            resp = await client.get(url, timeout=4.0)
            is_found = False
            
            if site["platform"] == "HackerNews":
                is_found = resp.status_code == 200 and resp.text.strip() != "null"
            elif site["platform"] == "GitLab":
                is_found = resp.status_code == 200 and len(resp.text) > 4
            else:
                is_found = (resp.status_code == site["valid_code"])
                
            return {
                "platform": site["platform"],
                "category": site["category"],
                "username": username,
                "url": profile_url,
                "found": is_found,
                "status": "monitored" if site["platform"] in ["GitHub", "GitLab", "HackerNews"] else "dormant",
                "risk": "medium" if is_found else "low",
                "is_live": True,
            }
        except Exception:
            return {
                "platform": site["platform"],
                "category": site["category"],
                "username": username,
                "url": profile_url,
                "found": False,
                "status": "unclaimed",
                "risk": "low",
                "is_live": True,
            }

    async def probe_all(self, username: str) -> List[Dict[str, Any]]:
        clean_user = username.strip().lstrip("@")
        if not clean_user:
            return []

        async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
            tasks = [self.probe_single_platform(client, site, clean_user) for site in self.sites]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            valid = []
            for r in results:
                if isinstance(r, dict) and r.get("found"):
                    valid.append(r)
            return valid

social_crawler = LiveSocialCrawler()

# 🔍 Instagram Search Logic Discrepancy Report

## issue Summary
The Agent repeatedly returns incorrect accounts (often unrelated or commenters) when a specific profile is not found, whereas the "Target Search" feature correctly identifies that the user does not exist or returns an accurate result.

## Root Cause Analysis
The discrepancy lies in how the **Apify dataset results** are processed when the exact target username is not found in the returned items.

### 1. Agent Search Logic (The Problem)
**File**: `src/lib/agent/tools/search.ts`

The Agent uses a "fallback" mechanism that blindly accepts the first item in the dataset if the target user is not explicitly found.

```typescript
// src/lib/agent/tools/search.ts

// Step 1: Try to find the matching user
const profile = items.find((item: any) => 
    item.username?.toLowerCase() === targetUser
) || items[0] as any || {}; // <--- DANGER: Fallback to items[0]

// Step 2: Validation Check (Weak)
if (profile.username && profile.username.toLowerCase() !== targetUser) {
    console.warn(`[Tool: search_profile] Scraped username (${profile.username}) does not match target...`);
    // CRITICAL FLAW: The code logs a warning but PROCEEDS to use this incorrect profile data.
}

const result = {
    username: profile.username || targetUser, 
    // ... maps other fields
};
```

**Why this leads to "Commenter" scraping:**
When Apify's `instagram-scraper` cannot access the profile (e.g., private, blocked, or not found) via `directUrls`, it may sometimes capture related data or partial page/post data depending on the scraper's internal fallback. If `items` contains *any* data (like a post object, a related profile, or even a comment author if the scraper context drifted), `items[0]` will be returned. Since the code explicitly ignores the mismatch warning, the Agent confidently presents this random account as the target.

### 2. Target Search Logic (The Solution)
**File**: `src/app/api/instagram/search/route.ts`

The Target Search implementation employs a strict **Map-based verification** strategy. It does not assume the order of results and explicitly links returned data to the requested username.

```typescript
// src/app/api/instagram/search/route.ts

// 1. Build a Map of Username -> Item
const profileInfoMap = new Map<string, any>();
for (const item of (detailDataset.items as any[])) {
    const username = (item.username as string)?.toLowerCase();
    if (username) {
        profileInfoMap.set(username, item); // Only add if valid username exists
    }
}

// 2. Retrieve specific user data
// ...
const profileInfo = profileInfoMap.get(username); // Explicit lookup
if (!profileInfo) {
    // Handle as "Not Found" or Fallback to Discovery Mode
}
```

This logic ensures that even if `items` contains garbage or unrelated users, they are never mapped to the target request unless the usernames match.

## Comparison Table

| Feature | Target Search (`/api/search`) | Agent Search (`search.ts`) |
| :--- | :--- | :--- |
| **Verification** | Strict (`Map.get(username)`) | Loose (`find` or `items[0]`) |
| **Fallback** | Tries Discovery/Hashtag search if direct fail | **Takes first item (`items[0]`) blindly** |
| **Mismatch Handling** | Filters out unrelated results | Logs warning but **returns wrong result** |
| **Outcome on Fail** | "Not Found" / Error | Wrong Account (Hallucination) |

## Recommendation

Refactor `src/lib/agent/tools/search.ts` to mirror the strict verification logic of the Target Search.

1.  **Remove `|| items[0]`**: If the user is not found, it should be treated as not found.
2.  **Enforce Username Match**: If `profile.username` does not match `targetUser`, throw an error or return null.

### Proposed Fix Code
```typescript
const profile = items.find((item: any) => 
    item.username?.toLowerCase() === targetUser
);

if (!profile) {
    console.warn(`[Tool: search_profile] Target user '${targetUser}' not found in results.`);
    // Return explicit error so Agent knows to stop or try another strategy
    return JSON.stringify({ error: "해당 사용자를 찾을 수 없습니다." });
}

// Proceed with valid profile...
```

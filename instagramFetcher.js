/**
 * instagramFetcher.js
 * Powered by RapidAPI: best-instagram-scraper-free-1000-calls
 */

const RAPIDAPI_KEY = "164ce828f7msh1a5b75320c73aefp17c6c9jsn1584369dde21"
const RAPIDAPI_HOST = "best-instagram-scraper-free-1000-calls.p.rapidapi.com"

const NGL_REGEX = /(?:https?:\/\/)?(?:www\.)?ngl\.link\/([a-zA-Z0-9_.-]+)/i

async function getInstagramLink(username) {
  try {
    console.log(`[RapidAPI] Fetching profile for @${username}...`)

    const url = `https://${RAPIDAPI_HOST}/users/profile?user=${encodeURIComponent(username)}`

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Cache-Control": "no-cache, no-store",
        "Pragma": "no-cache",
      },
    })

    console.log(`[RapidAPI] Response Status: ${res.status}`)

    if (!res.ok) {
      const errText = await res.text()
      console.log(`[RapidAPI] Error response:`, errText.slice(0, 300))
      return null
    }

    const json = await res.json()

    // Collect all links matching this API's keys
    const candidates = []

    if (json?.external_link) candidates.push(json.external_link)
    if (json?.external_url) candidates.push(json.external_url)
    if (json?.link) candidates.push(json.link)

    if (Array.isArray(json?.bio_links)) {
      json.bio_links.forEach(item => {
        if (typeof item === "string") candidates.push(item)
        if (item?.link) candidates.push(item.link)
        if (item?.url) candidates.push(item.url)
      })
    }

    if (json?.biography) candidates.push(json.biography)

    // Filter for ngl.link and extract username slug
    let matchedUrl = null
    let fetchedname = null

    for (const candidate of candidates) {
      if (typeof candidate !== "string") continue
      const match = candidate.match(NGL_REGEX)
      if (match) {
        fetchedname = match[1]
        matchedUrl = `https://ngl.link/${fetchedname}`
        break
      }
    }

    if (!matchedUrl) {
      console.log(`[RapidAPI] ⚠️ No ngl.link found in @${username}'s profile. Candidates:`, candidates)
      return null
    }

    console.log(`[RapidAPI] ✅ Found NGL Link: ${matchedUrl}`)
    console.log(`[RapidAPI] Extracted Target: ${fetchedname}`)

    return {
      external_url: matchedUrl,
      fetchedname,
    }
  } catch (err) {
    console.log(`[RapidAPI] Error:`, err.message)
    return null
  }
}

module.exports = { getInstagramLink }

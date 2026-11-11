
const fetchIn = require("./fetch")
const { getInstagramLink } = require("./instagramFetcher")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let data = {
  username: "",
  question: "",
  deviceId: require("crypto").randomUUID(),
  gameSlug: "",
  referrer: ""
}

let setTime = 0
let loadTime = 0

async function question(quest) {
  return new Promise((a,b) => {
    rl.question(quest, (answer) => {
      if(!answer) {
        b("Silahkan Masukan Data Yang Diperintahkan")
      }
      if(isNaN(answer)) {
        a(answer)
      } else {
        a(Number(answer))
      }
    })
  })
}
async function FetchUp() {
  data.deviceId = require("crypto").randomUUID()
  try {
    if(setTime >= 10000000) {
      console.log("Berhasil Mengirim Pesan Secara Paksa!")
      process.exit()
    }
    const _ms_ = await fetchIn({ body: JSON.stringify(data) })
    if(_ms_.status === 200) {
      loadTime++

      console.log(`[${setTime}/${loadTime}] attack {${data.username}}with question {${data.question}} sent successfully!`)
      data.deviceId = require("crypto").randomUUID()
      FetchUp()
    } else {
      setTimeout(FetchUp, (1000*60*3))
      console.log(`[${setTime}/${loadTime}] rate limit reached, waiting 5 minutes before retrying...`)
      console.log("HTTP status:", _ms_.status)
    }
  } catch(err) {
    FetchUp()
    console.log("something happened !")
  }
}
async function StartInit() {
  console.log("--------[ Setup Boomer ]-------")
  const times    = 1
  const targetIg = "backbenchersof_ucek"
  const fetched  = await getInstagramLink(targetIg)
  let username   = "backbenchersof_ucek"

  if (fetched?.fetchedname) {
    username = fetched.fetchedname
  } else if (typeof fetched === "string" && fetched.startsWith("http")) {
    const slug = new URL(fetched).pathname.split("/").filter(Boolean)[0]
    if (slug) username = slug
  }

  data.username = username
  data.question =  "1st gear le 160 2nd gear le sudu kad..."
  setTime = times
  console.log("---------[ Validated ]---------")
  fetch(`https://ngl.link/${username}`).then(fo => {
    if(fo.status != 200) {
      throw new Error("User tidak ditemukan!")
    }
    if(typeof times === "string" || times === 0) {
      throw new Error(
        "Variable spamming bukan berupa angka dan hanya mengembalikan nilai 0"
      )
    } else {
      console.log("🎉 Semua sudah siap!")
    }
    console.log("-----[ Start Booming 💣 ]------")
    console.log(`[Username] ${username}`)
    FetchUp()
    setInterval(async () => {
      const updated = await getInstagramLink(targetIg)
      if (updated?.fetchedname && updated.fetchedname !== data.username) {
        data.username = updated.fetchedname
        console.log(`[Link Updated] New target: ${updated.fetchedname}`)
      }
    }, 1000 * 60 * 50) // Recheck profile every 50 minutes
  })
}
StartInit()

var playingAudio = false

const delay = (time) => {
    return new Promise((succ, fail) => {
        setTimeout(succ, time)
    })
}
const displayCard = async (cardId) => {
    let detailArr = [
        'name',
        'type',
        'atk',
        'def',
        'level',
        'attribute',
        'race',
        'set_name',
        'set_code',
        'set_rarity',
        'set_price'
    ]

    let res = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?id=" + cardId + "&misc=yes")
    let json = await res.json()
    let cardImg = document.getElementById("cardImg")
    let data

    if (json['error']) {
        data = []
        document.getElementById("cardImg").style.backgroundImage = "url('./images/notfound.jpg')";
    }
    else {
        data = json['data'][0]
        cardImg.style.backgroundImage = "url('" + data["card_images"][0]['image_url'] + "')";
        document.getElementsByClassName("boxBottom")[0].innerHTML = data["desc"]
    }
    
    // Holo Effect by Card Type
    if (typeof data['type'] !== 'undefined') {
        if (data['type'].toLowerCase().indexOf("spell") > -1) {
            cardImg.style.setProperty('--color1', 'rgb(76, 230, 97)');
            cardImg.style.setProperty('--color2', 'rgb(145, 240, 158)');
        }
        else if (data['type'].toLowerCase().indexOf("trap") > -1) {
            cardImg.style.setProperty('--color1', 'rgb(199, 15, 107)');
            cardImg.style.setProperty('--color2', 'rgb(255, 90, 144)');
        }
        else if (data['type'].toLowerCase().indexOf("normal") > -1) {
            cardImg.style.setProperty('--color1', 'rgb(233, 165, 88)');
            cardImg.style.setProperty('--color2', 'rgb(255, 212, 147)');
        }
        else {
            cardImg.style.setProperty('--color1', 'rgb(0, 231, 255)');
            cardImg.style.setProperty('--color2', 'rgb(255, 0, 231)');
        }
    } 

    // Card Detail
    let boxRight = document.getElementsByClassName("boxRight")[0]
    boxRight.innerHTML = ""
    detailArr.forEach(detail => {
        let boxDetail = document.createElement("div")
        boxDetail.classList.add("boxDetail")
        let boxDetailRight = document.createElement("div")
        boxDetailRight.classList.add("boxDetailRight")
        if (json['error']) {
            boxDetailRight.innerHTML = "???"
        }
        else {
            switch (detail) {
                case 'set_name' :
                case 'set_code' :
                case 'set_rarity' :
                case 'set_price' :
                    boxDetailRight.innerHTML = data['card_sets'][0][detail]
                    break
    
                default :
                    boxDetailRight.innerHTML = (data[detail] ? data[detail] : "-")
            }
        }
        let boxDetailLeft = document.createElement("div")
        boxDetailLeft.classList.add("boxDetailLeft")
        detail = detail.replace("_", " ")
        boxDetailLeft.innerHTML =  detail.charAt(0).toUpperCase() + detail.slice(1) + " : "

        boxDetail.appendChild(boxDetailLeft)
        boxDetail.appendChild(boxDetailRight)
        boxRight.appendChild(boxDetail)
    })
    if (playingAudio === false) {
        playingAudio = true
        let audio = new Audio('sounds/bg.mp3')
        audio.play()
        audio.loop = true
        audio.volume = 0.2
    }
}

var searching = false
var searchEle = document.getElementById("searchId")
const searchFunc = async (event) => {
    if (searching) return false
    if (event.type === "change") {
        if (searchEle.value.length !== 8) return false
    }
    else {
        if (searchEle.value.length !== 7) return false
    }
    await delay(100)
    searching = true
    searchEle.disabled = true
    await displayCard(searchEle.value)
    searching = false
    searchEle.disabled = false
    searchEle.focus();
}
searchEle.addEventListener('keypress', searchFunc)
searchEle.addEventListener('change', searchFunc)
searchEle.focus();

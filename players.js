let money = 100000000;

let matches = 0;

let squad = [];

const market = document.getElementById("market");

const search = document.getElementById("search");

const noResults = document.getElementById("noResults");

const searchCount = document.getElementById("searchCount");


function formatMoney(number) {

    return number.toLocaleString("ar-SA");

}


function renderMarket(list = players) {

    market.innerHTML = "";

    searchCount.textContent =
        `${list.length} لاعب`;


    if (list.length === 0) {

        noResults.style.display = "block";

        return;

    }


    noResults.style.display = "none";


    list.forEach(player => {

        const owned =
            squad.some(
                item => item.id === player.id
            );


        const card = document.createElement("div");

        card.className = "player-card";


        card.innerHTML = `

            <img
                class="player-image"
                src="${player.image}"
                alt="${player.name}"
            >

            <div class="player-top">

                <span class="rating">
                    ⭐ ${player.rating}
                </span>

                <span>
                    ${player.position}
                </span>

            </div>


            <div class="player-name">
                ${player.name}
            </div>


            <div class="player-info">

                🌍 ${player.nationality}<br>

                🏟️ ${player.club}<br>

                📍 ${player.position}

            </div>


            <div class="price">
                💰 ${formatMoney(player.price)} ريال
            </div>


            <button
                class="details-button"
                data-id="${player.id}">

                عرض اللاعب

            </button>


            <button
                class="${owned ? "sell" : ""}"
                data-action="${owned ? "sell" : "buy"}"
                data-id="${player.id}">

                ${owned ? "بيع اللاعب" : "شراء اللاعب"}

            </button>

        `;


        market.appendChild(card);

    });

}


/*
    البحث
*/

search.addEventListener("input", function () {

    const value =
        search.value
            .trim()
            .toLowerCase();


    if (value === "") {

        renderMarket(players);

        return;

    }


    const filtered =
        players.filter(player => {

            const name =
                String(player.name || "")
                    .toLowerCase();

            const club =
                String(player.club || "")
                    .toLowerCase();

            const nationality =
                String(player.nationality || "")
                    .toLowerCase();

            const position =
                String(player.position || "")
                    .toLowerCase();


            return (
                name.includes(value) ||
                club.includes(value) ||
                nationality.includes(value) ||
                position.includes(value)
            );

        });


    renderMarket(filtered);

});


/*
    أزرار السوق
*/

market.addEventListener("click", function(event) {

    const button =
        event.target.closest("button");


    if (!button) return;


    const id =
        Number(button.dataset.id);


    if (button.classList.contains("details-button")) {

        showPlayer(id);

        return;

    }


    if (button.dataset.action === "buy") {

        buyPlayer(id);

        return;

    }


    if (button.dataset.action === "sell") {

        sellPlayer(id);

    }

});


/*
    شراء لاعب
*/

function buyPlayer(id) {

    const player =
        players.find(
            item => item.id === id
        );


    if (!player) return;


    if (
        squad.some(
            item => item.id === id
        )
    ) {

        alert("هذا اللاعب موجود عندك بالفعل.");

        return;

    }


    if (money < player.price) {

        alert("ميزانيتك ما تكفي لشراء هذا اللاعب.");

        return;

    }


    money -= player.price;

    squad.push(player);


    update();

}


/*
    بيع لاعب
*/

function sellPlayer(id) {

    const player =
        squad.find(
            item => item.id === id
        );


    if (!player) return;


    money +=
        Math.floor(
            player.price * 0.8
        );


    squad =
        squad.filter(
            item => item.id !== id
        );


    update();

}


/*
    تحديث الموقع
*/

function update() {

    document.getElementById("money").textContent =
        formatMoney(money);


    document.getElementById("playerCount").textContent =
        squad.length;


    document.getElementById("matches").textContent =
        matches;


    let rating = 0;


    if (squad.length > 0) {

        rating =
            Math.round(

                squad.reduce(
                    (total, player) =>
                        total + player.rating,
                    0
                ) / squad.length

            );

    }


    document.getElementById("teamRating").textContent =
        rating;


    renderMarket(
        getCurrentSearchResults()
    );


    renderPitch();

}


/*
    الحفاظ على نتائج البحث بعد الشراء والبيع
*/

function getCurrentSearchResults() {

    const value =
        search.value
            .trim()
            .toLowerCase();


    if (!value) {

        return players;

    }


    return players.filter(player => {

        return (

            String(player.name || "")
                .toLowerCase()
                .includes(value)

            ||

            String(player.club || "")
                .toLowerCase()
                .includes(value)

            ||

            String(player.nationality || "")
                .toLowerCase()
                .includes(value)

            ||

            String(player.position || "")
                .toLowerCase()
                .includes(value)

        );

    });

}


/*
    عرض اللاعبين في الملعب
*/

function renderPitch() {

    const positions =
        document.querySelectorAll(".position");


    positions.forEach(position => {

        position.innerHTML =
            position.dataset.original ||
            position.textContent;

    });


    squad
        .slice(0, 11)
        .forEach(
            (player, index) => {

                if (!positions[index]) return;


                positions[index].innerHTML = `

                    <img
                        src="${player.image}"
                        alt="${player.name}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                            border-radius:50%;
                        "
                    >

                    <span style="
                        position:absolute;
                        bottom:-25px;
                        background:#06100b;
                        padding:3px 6px;
                        border-radius:5px;
                        white-space:nowrap;
                        font-size:9px;
                    ">
                        ${player.name}
                    </span>

                `;

            }
        );

}


/*
    معلومات اللاعب
*/

function showPlayer(id) {

    const player =
        players.find(
            item => item.id === id
        );


    if (!player) return;


    document.getElementById("modalImage").src =
        player.image;


    document.getElementById("modalName").textContent =
        player.name;


    document.getElementById("modalInfo").textContent =
        `${player.nationality} • ${player.club} • ${player.position} • ⭐ ${player.rating}`;


    document.getElementById("pace").textContent =
        player.stats.pace;


    document.getElementById("shooting").textContent =
        player.stats.shooting;


    document.getElementById("passing").textContent =
        player.stats.passing;


    document.getElementById("dribbling").textContent =
        player.stats.dribbling;


    document.getElementById("defending").textContent =
        player.stats.defending;


    document.getElementById("physical").textContent =
        player.stats.physical;


    document.getElementById("playerModal").style.display =
        "flex";

}


/*
    إغلاق معلومات اللاعب
*/

document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        function() {

            document.getElementById("playerModal").style.display =
                "none";

        }
    );


/*
    إغلاق النافذة بالضغط خارجها
*/

document
    .getElementById("playerModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target.id === "playerModal"
            ) {

                event.currentTarget.style.display =
                    "none";

            }

        }
    );


/*
    المباراة
*/

document
    .getElementById("playMatch")
    .addEventListener(
        "click",
        playMatch
    );


function playMatch() {

    if (squad.length < 11) {

        alert(
            "لازم تشتري 11 لاعب قبل بداية المباراة."
        );

        return;

    }


    matches++;


    const rating =
        squad
            .slice(0, 11)
            .reduce(
                (sum, player) =>
                    sum + player.rating,
                0
            ) / 11;


    const opponent =
        Math.floor(
            Math.random() * 15
        ) + 78;


    const yourGoals =
        Math.max(
            0,
            Math.floor(
                (rating - opponent) / 10
            ) +
            Math.floor(
                Math.random() * 3
            )
        );


    const opponentGoals =
        Math.floor(
            Math.random() * 3
        );


    const result =
        document.getElementById(
            "matchResult"
        );


    result.style.display = "block";


    if (yourGoals > opponentGoals) {

        const reward = 5000000;

        money += reward;


        result.innerHTML = `
            <h2>🏆 فوز!</h2>
            <p>${yourGoals} - ${opponentGoals}</p>
            <p>
                💰 حصلت على
                ${formatMoney(reward)}
                ريال
            </p>
        `;

    }

    else if (yourGoals < opponentGoals) {

        result.innerHTML = `
            <h2>😔 خسارة</h2>
            <p>${yourGoals} - ${opponentGoals}</p>
        `;

    }

    else {

        const reward = 1500000;

        money += reward;


        result.innerHTML = `
            <h2>🤝 تعادل</h2>
            <p>${yourGoals} - ${opponentGoals}</p>
            <p>
                💰 حصلت على
                ${formatMoney(reward)}
                ريال
            </p>
        `;

    }


    update();

}


/*
    البداية
*/

document
    .querySelectorAll(".position")
    .forEach(position => {

        position.dataset.original =
            position.textContent;

    });


update();

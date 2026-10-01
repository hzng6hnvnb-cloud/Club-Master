let money = 100000000;

let matches = 0;

let squad = [];

let selectedPlayer = null;


const market = document.getElementById("market");

const moneyElement = document.getElementById("money");

const playerCount = document.getElementById("playerCount");

const teamRating = document.getElementById("teamRating");

const matchesElement = document.getElementById("matches");

const search = document.getElementById("search");


function formatMoney(number) {

    return number.toLocaleString("ar-SA");

}


function renderMarket(list = players) {

    market.innerHTML = "";

    list.forEach(player => {

        const owned = squad.some(
            p => p.id === player.id
        );


        market.innerHTML += `

            <div class="player-card">

                <img
                    class="player-image"
                    src="${player.image}"
                    alt="${player.name}"
                >

                <div class="player-head">

                    <span class="rating">
                        ${player.rating}
                    </span>

                    <span>
                        ⭐ الطاقة
                    </span>

                </div>


                <div class="player-name">
                    ${player.name}
                </div>


                <div class="player-info">

                    ${player.nationality}<br>

                    🏟️ ${player.club}<br>

                    📍 ${player.position}

                </div>


                <div class="price">
                    💰 ${formatMoney(player.price)} ريال
                </div>


                <button onclick="showPlayer(${player.id})">

                    عرض اللاعب

                </button>


                <br><br>


                ${
                    owned

                    ?

                    `<button
                        class="sell"
                        onclick="sellPlayer(${player.id})">

                        بيع اللاعب

                    </button>`

                    :

                    `<button
                        onclick="buyPlayer(${player.id})">

                        شراء اللاعب

                    </button>`
                }

            </div>

        `;

    });

}


function buyPlayer(id) {

    const player = players.find(
        p => p.id === id
    );


    if (!player) return;


    if (squad.some(p => p.id === id)) {

        alert("هذا اللاعب موجود عندك بالفعل.");

        return;

    }


    if (money < player.price) {

        alert("ميزانيتك ما تكفي.");

        return;

    }


    money -= player.price;

    squad.push(player);


    update();

}


function sellPlayer(id) {

    const player = squad.find(
        p => p.id === id
    );


    if (!player) return;


    money += Math.floor(
        player.price * 0.8
    );


    squad = squad.filter(
        p => p.id !== id
    );


    update();

}


function update() {

    moneyElement.textContent =
        formatMoney(money);


    playerCount.textContent =
        squad.length;


    matchesElement.textContent =
        matches;


    let rating = 0;


    if (squad.length) {

        rating = Math.round(

            squad.reduce(
                (total, player) =>
                    total + player.rating,
                0
            ) / squad.length

        );

    }


    teamRating.textContent =
        rating;


    renderMarket();

    renderPitch();

}


function renderPitch() {

    const positions =
        document.querySelectorAll(".position");


    positions.forEach(position => {

        position.innerHTML =
            `<span>${position.dataset.position}</span>`;

    });


    squad.slice(0, 11).forEach(
        (player, index) => {

            if (!positions[index]) return;


            positions[index].innerHTML = `

                <img
                    src="${player.image}"
                    alt="${player.name}"
                >

                <span class="player-label">
                    ${player.name}
                </span>

            `;

        }
    );

}


function showPlayer(id) {

    const player = players.find(
        p => p.id === id
    );


    if (!player) return;


    selectedPlayer = player;


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


function closePlayer() {

    document.getElementById("playerModal").style.display =
        "none";

}


search.addEventListener(
    "input",
    () => {

        const value =
            search.value.trim().toLowerCase();


        const filtered =
            players.filter(player =>

                player.name
                    .toLowerCase()
                    .includes(value)

                ||

                player.club
                    .toLowerCase()
                    .includes(value)

            );


        renderMarket(filtered);

    }
);


document
    .getElementById("playMatch")
    .addEventListener(
        "click",
        playMatch
    );


function playMatch() {

    if (squad.length < 11) {

        alert(
            "لازم يكون عندك 11 لاعب في التشكيلة قبل المباراة."
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
            Math.round(
                (rating - opponent) / 10
            ) +
            Math.floor(Math.random() * 3)
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

            <p>
                ${yourGoals} - ${opponentGoals}
            </p>

            <p>
                💰 مكافأة الفوز:
                ${formatMoney(reward)} ريال
            </p>

        `;

    }

    else if (yourGoals < opponentGoals) {

        result.innerHTML = `

            <h2>😔 خسارة</h2>

            <p>
                ${yourGoals} - ${opponentGoals}
            </p>

        `;

    }

    else {

        const reward = 1500000;

        money += reward;


        result.innerHTML = `

            <h2>🤝 تعادل</h2>

            <p>
                ${yourGoals} - ${opponentGoals}
            </p>

            <p>
                💰 مكافأة:
                ${formatMoney(reward)} ريال
            </p>

        `;

    }


    update();

}


document
    .querySelectorAll(".position")
    .forEach(position => {

        position.addEventListener(
            "click",
            () => {

                if (!squad.length) {

                    alert(
                        "اشترِ لاعبين أولًا من سوق الانتقالات."
                    );

                    return;

                }


                alert(
                    "المرحلة التالية بنخلي اللاعب ينحط في هذا المركز بالسحب والإفلات."
                );

            }
        );

    });


update();

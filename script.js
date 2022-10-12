let zadaneUkolyPocet = 0;
let celkemUkolyPocet = 0;
let hotoveUkolyPocet = 0;
let novyUkol;
let novyUkolText = "";

const zadaneUkolyPocetElement = document.querySelector("#zadano");
const celkemUkolyPocetElement = document.querySelector("#celkem");
const hotoveUkolyPocetElement = document.querySelector("#hotovo");

const seznamUkolu = document.querySelector(".seznam_ukolu");

const textInput = document.querySelector("#obsah_ukolu");
const tlacitkoPridat = document.querySelector(".tlacitko_pridat");

function vytvorUkol() {
    novyUkol = seznamUkolu.querySelector(".ukol_vzor").cloneNode(true);
    novyUkol.classList.remove("ukol_vzor");
    novyUkol.querySelector("p").textContent = novyUkolText;
    novyUkol.querySelector(".checkbox").addEventListener("click", (e) => {
        zmenStavUkolu(e);
    });
    novyUkol.querySelector("img").addEventListener("click", (e) => {
        smazUkol(e);
    });
}

function zmenStavUkolu(e) {
    let elementClassList = e.target.classList;
    elementClassList.contains("neudelano") ? (
        elementClassList.remove("neudelano"),
        elementClassList.add("udelano"),
        hotoveUkolyPocet++,
        zadaneUkolyPocet--
    ) : (
        elementClassList.remove("udelano"),
        elementClassList.add("neudelano"),
        hotoveUkolyPocet--,
        zadaneUkolyPocet++
    )
    aktualizujPoctyUkolu();
    ulozUkoly();
}

function smazUkol(e) {
    confirm("Opravdu chceš úkol smazat?") ? e.target.parentElement.remove() : null;
    celkemUkolyPocet--;
    if (e.target.parentElement.querySelector(".checkbox").classList.contains("neudelano")) {
        zadaneUkolyPocet--;
    } else {
        hotoveUkolyPocet--;
    }
    aktualizujPoctyUkolu();
    ulozUkoly();
}

function pridejUkol() {
    vytvorUkol();
    seznamUkolu.appendChild(novyUkol);
    celkemUkolyPocet++;
    zadaneUkolyPocet = celkemUkolyPocet - hotoveUkolyPocet;
    aktualizujPoctyUkolu();
    ulozUkoly();
}

function aktualizujPoctyUkolu() {
    zadaneUkolyPocetElement.textContent = zadaneUkolyPocet > 9 ? zadaneUkolyPocet : `0${zadaneUkolyPocet}`;
    celkemUkolyPocetElement.textContent = celkemUkolyPocet > 9 ? celkemUkolyPocet : `0${celkemUkolyPocet}`;
    hotoveUkolyPocetElement.textContent = hotoveUkolyPocet > 9 ? hotoveUkolyPocet : `0${hotoveUkolyPocet}`;
    ulozPoctyUkolu(celkemUkolyPocet, hotoveUkolyPocet);
}

function ulozPoctyUkolu(celkemUkolyPocet, hotoveUkolyPocet) {
    localStorage.setItem("celkemUkolyPocet", JSON.stringify(celkemUkolyPocet));
    localStorage.setItem("hotoveUkolyPocet", JSON.stringify(hotoveUkolyPocet));
}

function ziskejPoctyUkolu() {
    if (localStorage.getItem("celkemUkolyPocet")) celkemUkolyPocet = JSON.parse(localStorage.getItem("celkemUkolyPocet"));
    if (localStorage.getItem("hotoveUkolyPocet")) hotoveUkolyPocet = JSON.parse(localStorage.getItem("hotoveUkolyPocet"));
    if (celkemUkolyPocet > 0 && hotoveUkolyPocet >= 0) zadaneUkolyPocet = celkemUkolyPocet - hotoveUkolyPocet;
    aktualizujPoctyUkolu();
}

function ulozUkoly() {
    localStorage.setItem("ukoly", JSON.stringify(seznamUkolu.innerHTML));
}

function zobrazUkoly(ukoly) {
    seznamUkolu.innerHTML = ukoly;
    for (ukol of seznamUkolu.children) {
        ukol.querySelector(".checkbox").addEventListener("click", (e) => zmenStavUkolu(e));
        ukol.querySelector("img").addEventListener("click", (e) => smazUkol(e));
    }
}

function ziskejUkoly() {
    if (localStorage.getItem("ukoly")) {
        let ukoly = JSON.parse(localStorage.getItem("ukoly"));
        zobrazUkoly(ukoly);
    }
}

textInput.addEventListener("keyup", (e) => {
    novyUkolText = e.target.value;
    if (e.keyCode == 13) {
        e.target.value ? pridejUkol() : alert("Úkol musí mít nějaký obsah.");
        e.target.value = "";
    }
})

tlacitkoPridat.addEventListener("click", () => {
    textInput.value ? pridejUkol() : alert("Úkol musí mít nějaký obsah.");
    textInput.value = "";
})

function initializace() {
    ziskejUkoly();
    ziskejPoctyUkolu();
}

initializace();
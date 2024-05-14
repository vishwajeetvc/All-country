
// https://restcountries.com/v3.1/name/{name}
//https://restcountries.com/v3.1/alpha/npl
// console.log(location.href.split('=')[1])

const header = document.querySelector('header');
const body = document.body;
const borders = document.querySelectorAll('a');


const url = new URL(location.href);
const countryName = url.searchParams.get('name');
const link = url.searchParams.get('link');

if (!localStorage.getItem('dark')) {
    localStorage.setItem('dark', 'false');
}
let dark = localStorage.getItem('dark') == 'false' ? false : true;
/*
 * change the url based on the weither is ti clicked  on border or cards
    *
    */
fetch(`https://restcountries.com/v3.1/${link}/${countryName}`)
    .then(response => response.json())
    .then(ctry => {

        const country = ctry[0];
        document.querySelector('.container').append(createCard(country))
        const { borders } = country;

        const borderList = document.querySelector('.border-list')
        borders?.forEach(border => {
            const url = new URL(location.href)
            url.searchParams.set('link', 'alpha')
            url.searchParams.set('name', border)

            const a = document.createElement('a');
            a.innerHTML = border;
            a.href = url;
            borderList.append(a);
        });

        if (borderList.children.length == 0) {
            document.querySelector('.borders').classList.add('hide');
        }


        const backButton = document.querySelector('.container i');
        backButton.addEventListener('mousedown', () => {
            location.href = '/index.html'
        })

        modeChange(dark);
        const themeButton = document.querySelector('.mode-button');
        themeButton.addEventListener('click', () => {

            localStorage.getItem('dark') == 'true' ?
                localStorage.setItem('dark', 'false') :
                localStorage.setItem('dark', 'true');
            let dark = localStorage.getItem('dark') == 'false' ? false : true;

            modeChange(dark);

        })


    })
function createCard(data) {
    // console.log(data)
    const {
        flags: {
            svg: image
        },
        name: {
            common: name
        },
        name: {
            nativeName
        },
        population,
        region,
        subregion,
        capital,
        tld: topLevelDomain,
        currencies: currency,
        languages,
    } = data

    const div = document.createElement('div');
    div.classList.add('card')
    div.innerHTML = `
        <div class="arrow"></div>
        <div class="image">
            <img src="${image}" alt="">
        </div>
        <div class="left-top text-box">
            <h1 class="name">${name}</h1>
            <p class="native-name"><b>Native name </b>: ${Object.values(nativeName)[0].common}</p>
            <p class="population"><b>Population</b>: ${population.toLocaleString('en-IN')}</p >
            <p class="region"><b>Region</b>: ${region}</p>
            <p class="sub-region"><b>Sub-region </b>: ${subregion}</p>
            <p class="capital"><b>Capital </b>: ${capital}</p>
        </div >
        <div class="right-bottom text-box">
            <p class="to-level-dom"><b>Top Level Domain </b>: ${topLevelDomain}</p>
            <p class="currency"><b>Currency </b>: ${Object.values(currency)[0].name}</p>
            <p class="languages"><b>Languages </b>: ${Object.values(languages).toString()}</p>
        </div>
        <div class="borders">
            <p><b>Border Countries :</b> </p>
            <div class="border-list">
            </div>
        </div>

`
    return div;
}


function modeChange(mode) {
    if (mode) {
        console.log(mode);
        header.classList.add('dark-primary');
        body.classList.add("dark-secondary");
    } else if (!mode) {
        header.classList.remove('dark-primary');
        body.classList.remove("dark-secondary");
    }
}

///=======================================
// {
//     "sqi": {
//         "official": "Republika e Shqipërisë",
//         "common": "Shqipëria"
//     }
// }
// {
//     "eng": {
//         "official": "United States of America",
//         "common": "United States"
//     }
// }
// {
//     "por": {
//         "official": "República de Cabo Verde",
//         "common": "Cabo Verde"
//     }
// }

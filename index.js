const body = document.body;
const form = document.querySelector('form');
const select = document.querySelector('.select');
const header = document.querySelector('header')

fetch('https://restcountries.com/v3.1/all')
    .then((response) => response.json())
    .then(countries => {

        /* this regionList will be loaded in filter region button */
        const regionList = new Set();

        countries.forEach(country => {
            extractAppend(country);
            regionList.add(country.region);
        })
        /*loading region in filter by region button*/
        Array.from(regionList.values()).forEach(region => {
            const li = document.createElement('li');
            li.innerText = region;
            document.querySelector('.select ul').append(li);
        })

        // search for country input field
        document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();

            // getting country name (only first 4 characters)
            const value = document.querySelector('input').value.toLowerCase().slice(0, 4);

            document.querySelector('.countries-container').innerHTML = " ";
            countries.forEach(country => {
                if (country.name.common.toLowerCase().slice(0, 4) == value) {
                    extractAppend(country);
                } else if ('' == value) {
                    extractAppend(country);
                }
            })

            // showing "not found"
            console.log(document.querySelector('.countries-container').children.length);
            if (document.querySelector('.countries-container').children.length == 0) {
                document.querySelector(".not-found").classList.remove('hide');
            } else {
                document.querySelector(".not-found").classList.add('hide');
            }
            // showing not found  end
        })

        const regionBox = document.querySelector('.select ul')
        regionBox.addEventListener('click', e => {
            const region = e.target.innerText.toLowerCase();

            document.querySelector('.countries-container').innerHTML = " ";

            if (!(region == 'all')) {
                countries.forEach(country => {
                    if (region == country.region.toLowerCase()) {
                        extractAppend(country);
                    }
                });
            } else {
                countries.forEach(country => {
                    extractAppend(country);
                });
            }



        })

    });

let dark = false;

const themeButton = document.querySelector('.mode-button');
themeButton.addEventListener('click', () => {

    const allCards = document.querySelectorAll('.country-card');

    if (!dark) {
        [form, select, header].forEach(item => item.classList.add('dark-primary'));
        allCards.forEach(card => card.classList.add('dark-primary'));
        body.classList.add("dark-secondary");
        dark = true;
    } else {
        [form, select, header].forEach(item => item.classList.remove('dark-primary'));
        allCards.forEach(card => card.classList.remove('dark-primary'));
        body.classList.remove("dark-secondary");
        dark = false;
    }
})

/*hover on filter region*/
document.querySelector('.select').addEventListener('mouseover', () => {
    document.querySelector('.select ul').style.display = "block";
})
document.querySelector('.select').addEventListener('mouseout', () => {
    document.querySelector('.select ul').style.display = "none";
})

function extractAppend(country) {
    const {
        name: { common: name },
        population,
        flags: { svg: image },
        region,
        capital
    } = country;
    document.querySelector('.countries-container').append(
        createCountryCard({ name, image, population, region, capital })
    )
}

function createCountryCard({ name, image, population, region, capital }) {
    const countryCard = document.createElement('div');
    countryCard.classList.add('country-card');

    if (dark) {
        countryCard.classList.add('dark-primary');
    }
    else {
        countryCard.remove('dark-primary');
    }

    countryCard.innerHTML = `
        <img src="${image}" alt="flag">
        <div class="texts">
            <p class="name">${name}</p>
            <p>Population : <span class="population">${population}</span></p>
            <p>Region : <span class="region">${region}</span></p>
            <p>Capital : <span class="capital">${capital}</span></p>
        </div>
    `;
    return countryCard;
}

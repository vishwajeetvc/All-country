const body = document.body;
const form = document.querySelector('form');
const select = document.querySelector('.select');
const header = document.querySelector('header')


if (!localStorage.getItem('dark')) {
    localStorage.setItem('dark', 'false');
}

let dark = localStorage.getItem('dark') == 'false' ? false : true;

modeChange(dark);


fetch('https://restcountries.com/v3.1/all')
    .then((response) => response.json())
    .then(countries => {

        /* this regionList will be loaded in filter region button */
        const regionList = new Set();

        countries.forEach(country => {
            // creating and append card into countries-container
            extractAppend(country, dark);
            regionList.add(country.region);
        })
        /*appending regions in "filter by region" button*/
        Array.from(regionList.values()).forEach(region => {
            const li = document.createElement('li');
            li.innerText = region;
            document.querySelector('.select ul').append(li);
        })

        // "search for country" input field
        document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();

            // getting country name (only first 4 characters)
            const value = document.querySelector('input').value.toLowerCase().slice(0, 4);

            document.querySelector('.countries-container').innerHTML = " ";
            countries.forEach(country => {
                // appdend card depending on search value
                if (country.name.common.toLowerCase().slice(0, 4) == value) {
                    // updating the "Filter by region"
                    select.querySelector('p').innerHTML = country.region;

                    extractAppend(country, dark);

                } else if ('' == value) {

                    // updating the "Filter by region"
                    select.querySelector('p').innerHTML = "Filter by Region";

                    extractAppend(country, dark);
                }
            })

            // showing "not found"
            console.log(document.querySelector('.countries-container').children.length);
            if (document.querySelector('.countries-container').children.length == 0) {

                // updating the "Filter by region"
                select.querySelector('p').innerHTML = "Filter by Region";

                document.querySelector(".not-found").classList.remove('hide');
            } else {
                document.querySelector(".not-found").classList.add('hide');
            }
        })

        // showing country depending up the filter;
        const regionBox = document.querySelector('.select ul')
        regionBox.addEventListener('mousedown', e => {

            // erasing the search value 
            form.querySelector('input').value = ''

            // hiding the regionBox menu
            document.querySelector('.select ul').style.display = "none";

            // the the region name from "filter by region" button;
            const region = e.target.innerText.toLowerCase();

            // change the "filter by name " to selected region
            select.querySelector('p').innerHTML = region[0].toUpperCase() + region.slice(1);

            document.querySelector('.countries-container').innerHTML = " ";

            if (!(region == 'all')) {
                countries.forEach(country => {
                    if (region == country.region.toLowerCase()) {
                        extractAppend(country, dark);
                    }
                });
            } else {
                countries.forEach(country => {
                    extractAppend(country, dark);
                });
            }
        })

        // going to the next page
        document.querySelector('.countries-container').addEventListener('click', e => {
            const countryCard = e.target.closest('.country-card');

            const countryName = countryCard?.children[1].querySelector('.name').innerHTML;

            const url = new URL('/country.html', location.href);
            console.log(url)
            url.searchParams.set('link', 'name');
            url.searchParams.set('name', countryName);

            if (countryName) {
                location.href = url;
            }

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
    });

function modeChange(mode) {
    const allCards = document.querySelectorAll('.country-card');
    if (mode) {
        console.log(mode);
        [form, select, header].forEach(item => item.classList.add('dark-primary'));
        allCards.forEach(card => card.classList.add('dark-primary'));
        body.classList.add("dark-secondary");
    } else if (!mode) {
        [form, select, header].forEach(item => item.classList.remove('dark-primary'));
        allCards.forEach(card => card.classList.remove('dark-primary'));
        body.classList.remove("dark-secondary");
    }
}


/*hover on filter region*/
document.querySelector('.select').addEventListener('mouseover', () => {
    document.querySelector('.select ul').style.display = "block";
})
document.querySelector('.select').addEventListener('mouseout', () => {
    document.querySelector('.select ul').style.display = "none";
})


// takes a country object, destructure it and append into  " div.country-container"
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

// return a card, it takes object as the paramater
function createCountryCard({ name, image, population, region, capital }, dark) {
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
            <p>Population : <span class="population">${population.toLocaleString('en-IN')}</span ></p >
            <p>Region : <span class="region">${region}</span></p>
            <p>Capital : <span class="capital">${capital}</span></p>
        </div >
    `;
    return countryCard;
}

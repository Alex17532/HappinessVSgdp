let dataStore = [];
let skibiditoilet = "yolo"
        const gdpData = {
            "USA": 69.287,
            "Canada": 55.534,
            "Germany": 56.956,
            "India": 2.256,
            "China": 12.556,
            "Japan": 39.285,
            "United Kingdom": 48.693,
            "France": 44.537,
            "Brazil": 8.921,
            "Russia": 12.194,
            "Australia": 64.964,
            "Mexico": 10.040,
            "South Korea": 34.998,
            "Italy": 35.957,
            "Spain": 32.028,
            "South Africa": 6.700,
            "Saudi Arabia": 24.999,
            "Turkey": 11.765,
            "Netherlands": 58.385
        };
        function populateCountryDropdown() {
            let dropdown = document.getElementById("country");
            for (let country in gdpData) {
                let option = document.createElement("option");
                option.value = country;
                option.textContent = country;
                dropdown.appendChild(option);
            }
        }
        function submitData() {
            let name = document.getElementById("name").value;
            let country = document.getElementById("country").value;
            let happiness = parseFloat(document.getElementById("happiness").value);
            let gdp = gdpData[country];
            
            if (!isNaN(happiness)) {
                dataStore.push({ name, country, happiness, gdp });
                updateGraphs();
            }
        }
        function updateGraphs() {
            let happinessTrace = {
                x: dataStore.map(d => d.gdp),
                y: dataStore.map(d => d.happiness),
                mode: 'markers',
                type: 'scatter',
                marker: { size: 10 }
            };
            let happinessLayout = { 
                title: 'Happiness vs GDP Per Capita', 
                xaxis: { title: 'GDP Per Capita (Thousands)' }, 
                yaxis: { title: 'Happiness Score', range: [1, 8] } 
            };
            Plotly.newPlot('plot', [happinessTrace], happinessLayout);
            let sortedCountries = Object.entries(gdpData).sort((a, b) => a[1] - b[1]);
            let gdpTrace = {
                x: sortedCountries.map(d => d[0]),
                y: sortedCountries.map(d => d[1]),
                mode: 'markers',
                type: 'scatter',
                marker: { size: 10 }
            };
            let gdpLayout = { 
                title: 'GDP Per Capita by Country', 
                xaxis: { title: 'Country', tickangle: -45 }, 
                yaxis: { title: 'GDP Per Capita (Thousands)' } 
            };
            Plotly.newPlot('gdp-plot', [gdpTrace], gdpLayout);
        }
        function initializeGraphs() {
            updateGraphs();
        }
        function saveData() {
            fetch('http://localhost:3000/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataStore)
            })
            .then(response => response.json())
            .then(data => console.log("Data saved successfully!", data))
            .catch(error => console.error("Error saving data:", error));
        }
        function loadData() {
            fetch('http://localhost:3000/load')
                .then(response => response.json())
                .then(data => {
                    dataStore = data;
                    updateGraphs();
                })
                .catch(error => console.error("Error loading data:", error));
        }
        window.onload = function() {
            initializeGraphs();
            populateCountryDropdown();
        };

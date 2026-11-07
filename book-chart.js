(() => {
    const target = document.querySelector("#books-by-decade");
    if (!target) return;
    if (!window.d3) {
        target.textContent = "The chart could not load because D3.js is unavailable.";
        console.error("Could not load the best-selling books chart: D3.js is unavailable.");
        return;
    }

    const container = d3.select("#books-by-decade");
    const decadeCounts = [
        [1300, 1], [1780, 1], [1790, 1], [1810, 1], [1850, 1],
        [1860, 1], [1870, 1], [1880, 4], [1890, 2], [1900, 5],
        [1910, 1], [1920, 6], [1930, 18], [1940, 16], [1950, 23],
        [1960, 21], [1970, 45], [1980, 37], [1990, 49], [2000, 42],
        [2010, 14]
    ];

    drawChart(decadeCounts);

    function drawChart(counts) {
        const firstDecade = counts[0][0];
        const lastDecade = counts[counts.length - 1][0];
        const decades = d3.range(firstDecade, lastDecade + 10, 10);
        const countByDecade = new Map(counts);
        const data = decades.map((decade) => ({
            decade,
            count: countByDecade.get(decade) || 0
        }));
        const bookCount = d3.sum(data, (d) => d.count);

        const width = 900;
        const height = 440;
        const margin = { top: 20, right: 20, bottom: 65, left: 55 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .domain(decades)
            .range([0, innerWidth])
            .padding(0.12);
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.count)])
            .nice()
            .range([innerHeight, 0]);

        const svg = container.html("")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("role", "img")
            .attr("aria-labelledby", "books-chart-title books-chart-description");

        svg.append("title")
            .attr("id", "books-chart-title")
            .text("Best-selling books by publication decade");
        svg.append("desc")
            .attr("id", "books-chart-description")
            .text(`A histogram showing ${bookCount} best-selling books grouped by their first publication year, from the ${firstDecade}s to the ${lastDecade}s.`);

        const chart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        chart.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(6).tickSize(-innerWidth).tickFormat(""));

        chart.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format("d")));

        const shownTicks = decades.filter((decade, index) =>
            index % 8 === 0 || decade === lastDecade
        );

        chart.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x).tickValues(shownTicks).tickFormat((decade) => `${decade}s`));

        chart.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.decade))
            .attr("y", (d) => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", (d) => innerHeight - y(d.count))
            .append("title")
            .text((d) => `${d.decade}s: ${d.count} ${d.count === 1 ? "book" : "books"}`);

        chart.append("text")
            .attr("class", "axis-title")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 52)
            .attr("text-anchor", "middle")
            .text("Decade of first publication");

        chart.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("x", -innerHeight / 2)
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .text("Number of best-selling books");
    }
})();

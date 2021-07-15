document.addEventListener("DOMContentLoaded", function() {

    const req = new XMLHttpRequest();
    req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", true)
    req.send()
    req.onload = () => {

        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
        .then(response => response.json())
        .then(data => {
                   
            const h = 600
            const w = 1000
            const padding = 50
            
            // creating svg element
            const svg = d3.select("body")
            .append("svg")
            .attr("height", h)
            .attr("width", w)

            // creating the xscale and axis
            const minX = d3.min(data, d => {
                return d.Year
            })
            console.log(minX)
            const maxX = d3.max(data, d => d.Year)
            const yearScale = d3.scaleLinear()
            .range([padding, w - padding])
            .domain([minX - 1, maxX])
            const xAxis = d3.axisBottom(yearScale).tickFormat(tick => tick * 1)            

            // appending the x-axis
            svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0" + ", " + (h - padding) + ")")
            .call(xAxis);

            // need to create a date object for each time. Then use the d3 time scale
            // setting all other date items the same except for minutes and seconds
            const minimumY = d3.min(data, d => {
                return new Date(1970, 0, 1, 0, d.Time.slice(0,2), d.Time.slice(3))
            })
            const maximumY = d3.max(data, d => {
                return new Date(1970, 0, 1, 0, d.Time.slice(0,2), d.Time.slice(3))
            })
            const yScale = d3.scaleTime()
            .range([h - padding, padding])
            .domain([minimumY, maximumY])
            const y2Axis = d3.axisLeft(yScale).tickFormat(tick => `${tick.getMinutes()}:${tick.getSeconds() === 0 ? "00" : tick.getSeconds()}`)

            // appending the y-axis
            svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", " translate(" + (padding) + ", " + (h) + ") scale(1, -1)")
            .call(y2Axis)

            // creating the circle elements / appending them
            svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => {
                return `${(new Date(1970, 0, 1, 0, d.Time.slice(0,2), d.Time.slice(3)))}`
            })
            .attr("cx", d => yearScale(d.Year))
            .attr("cy", d => {
                return h - yScale(new Date(1970, 0, 1, 0, d.Time.slice(0,2), d.Time.slice(3)))
            })
            .attr("width", 5)
            .attr("height", 5)
            .attr("r", 5)
            .attr("fill", d => d.Doping === "" ? "black" : "red")

            // creating tooltip
            const tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("visibility", "hidden")

            // adding event listeners for circles
            svg.selectAll("circle")
            .on("mouseover", d => {
                tooltip
                .style("visibility", "visible")
                .html(`${d.Name}: ${d.Nationality} <br> Year: ${d.Year}, Time: ${d.Time} <br> <br> ${d.Doping}`)
                .style("left", (yearScale(d.Year)) + "px")
                .style("top", (h + 50 - yScale(new Date(1970, 0, 1, 0, d.Time.slice(0,2), d.Time.slice(3))) + "px"))
                .attr("data-year", d.Year)
            })
            .on("mouseout", d => {
                tooltip
                .style("visibility", "hidden")
            })

            //creating legend
            const legendDiv = svg
            .append("g")
            .attr("id", "legend")

            legendDiv
            .append("circle")
            .attr("cx", 800)
            .attr("cy", 200)
            .attr("r", 5)
            .style("fill", "red")
            
            legendDiv.append("text")
            .attr("x", 810)
            .attr("y", 205)
            .text("Riders with Doping Allegations")

            legendDiv
            .append("circle")
            .attr("cx", 800)
            .attr("cy", 220)
            .attr("r", 5)
            .style("fill", "black")
            
            legendDiv.append("text")
            .attr("x", 810)
            .attr("y", 225)
            .text("No Doping Allegations")
        })
    }
})
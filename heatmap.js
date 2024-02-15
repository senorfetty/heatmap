let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let req = new XMLHttpRequest();

let baseTemp
let values = []

let xScale
let yScale
let xAxisScale
let yAxisScale

let minYear =1763  //(d3.min(values, (d) => d['year'])
let maxYear= 2015  //(d3.max(values, (d) => d['year'])

let height = 650
let width = 1050
let padding = 50

let svg = d3.select('svg')

req.open('GET',url,true);
req.onload = () => {
    obj = JSON.parse(req.responseText)
    baseTemp = obj['baseTemperature']
    values = obj['monthlyVariance']
    console.log(baseTemp)
    drawCanvas();
    generateScale();
    drawHeat();
    generateAxis();
}
req.send()

generateScale = () => {

    xScale = d3.scaleLinear()
    .domain([d3.min(values, (d) => d['year']),d3.max(values, (d)=>d['year'])])
    .range([padding, width-padding])

    yScale = d3.scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0),  new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height-padding])
}

generateAxis = () => {
    let xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('d'))

    let yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat('%B'))

    svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + (height-padding+3) + ')')

    svg.append('g')
    .call(yAxis)
    .attr('id','y-axis')
    .attr('transform', 'translate(' + padding + ',0)')

}
drawHeat = () => {

    let tooltip = d3.select('span')
    .append('div')
    .attr('id','tooltip')

    svg.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class','cell')
    .attr('fill', (d) => {
        v = d['variance']
        if (v <= -1) {
            return 'brown'
        } else if (v<=0) {
            return 'Green'
        } else if (v<=1) {
            return 'yellow'
        } else {
            return 'black'
        }
    })
    
    .attr('data-year', (d) => d['year'])
    .attr('data-month', (d) => d['month']-1)
    .attr('data-temp', (d) => baseTemp+d['variance'])
    .attr('y', (d) => yScale(new Date(0, d['month']-1, 0,0,0,0,0)))
    .attr('x' , (d) => xScale(d['year']))
    .attr('height', (height-(padding*2))/12)
    .attr('width', (d) => {
        let noY = maxYear-minYear;
        return (width-2*padding)/noY
    })
    .on('mouseover' , (d) => {
    tooltip.transition().style('visibility','visible') 

    let months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    tooltip.text( "Year: " + d['year'] + ', ' + 'Month: ' + months[d['month']-1]+ ', ' + 'Temperature: ' + (baseTemp+d['variance']) + ',  ' + 'Variance: ' +  d['variance'])  
    tooltip.attr('data-year', d['year'])})
    .on('mouseout', (d) =>
    tooltip.transition().style('visibility','hidden'))
    
}

drawCanvas = () => {
    svg.attr('height', height)
    svg.attr('width', width)  
}
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(json){

  var pairs = json.data;

  var data = json.data.map(function(curr, i){
    return curr[1];

  })

  var quarters = json.data.map(function(curr, i){
    return Number(curr[0].split("-")[0])

  })

  var minDate = new Date(quarters[0]);
  var maxDate = new Date(quarters[quarters.length-1]);
  // // quarters look like this:
  // // 1947-01-01
  var parseDate = d3.time.format("%Y-%m-%d");

  var margin = { top: 30, right: 30, bottom: 40, left:70 }

  var height = 400 - margin.top - margin.bottom,
      width = 600 - margin.left - margin.right,
      barWidth = 50,
      barOffset = 5;

  var yScale = d3.scale.linear()
          .domain([0, d3.max(data)])
          .range([0, height]);

  // var xScale = d3.scale.ordinal()
  //         .domain(d3.range(0, quarters.length))
  //         .rangeBands([0, width], 0.2)

  var xScale = d3.time.scale()
      .domain([minDate, maxDate])
      .rangeRound([0, width-margin.right])

  var myChart = d3.select("#chart").append('svg')
      .style('background', '#E7E0CB')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .selectAll('rect').data(data)
        .enter().append('rect')
            .style('fill', '#619CFF')
            .attr('width', width/quarters.length)
            // .attr('x', function(d,i) {
            //     return xScale(i);
            // })
            .attr('x', function(v, i){
              console.log(xScale(new Date(v[0])))
              return xScale(new Date(v[0]))
            })
            .attr('height', 0)
            .attr('y', height)
        .on('mouseover', function(d) {

            tooltip.style('opacity', .9)

            tooltip.html(d)
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top',  (d3.event.pageY - 30) + 'px')


            tempColor = this.style.fill;
            d3.select(this)
                .style('opacity', .5)
                .style('fill', 'yellow')
        })

        .on('mouseout', function(d) {
            d3.select(this)
                .style('opacity', 1)
                .style('fill', tempColor)

            tooltip.style('opacity', 0)
        })


  myChart.transition()
    .attr('height', function(d) {
        return yScale(d);
    })
    .attr('y', function(d) {
        return height - yScale(d);
    })
    .delay(function(d, i) {
        return i * (1000/data.length);
    })
    .duration(100)
    .ease('elastic')

  var vGuideScale = d3.scale.linear()
          .domain([0, d3.max(data)])
          .range([height, 0])

  var vAxis = d3.svg.axis()
      .scale(vGuideScale)
      .orient('left')
      .ticks(10)

  var vGuide = d3.select('svg').append('g')
      vAxis(vGuide)
      vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      vGuide.selectAll('path')
          .style({ fill: 'none', stroke: "#000"})
      vGuide.selectAll('line')
          .style({ stroke: "#000"})

  var hAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .tickValues(xScale.domain().filter(function(d, i) {
          return !(i % (data.length/5));
      }))

  var hGuide = d3.select('svg').append('g')
      hAxis(hGuide)
      hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
      hGuide.selectAll('path')
          .style({ fill: 'none', stroke: "#000"})
      hGuide.selectAll('line')
          .style({ stroke: "#000"})

  var tooltip = d3.select('body').append('div')
    .classed('tooltip',  true)

})


$('#instruct').mouseover(function(){
  $('#instructions').fadeIn('fast')
  $('#dull').hide()
}).mouseout(function(){
  $('#instructions').fadeOut('fast')
  $('#dull').hide()
})

$('#stop').hide()
var vis = 'start'

var outs = 0
var inning = 1
var batter = 0
var baseScale = d3.scaleOrdinal().domain([.97, .98, .99, 1]).range([1, 2, 3, 4])
var batters = {
  '1': {'batter': '1', 'base': 0},
  '2': {'batter': '2', 'base': 0},
  '3': {'batter': '3', 'base': 0},
  '4': {'batter': '4', 'base': 0},
  '5': {'batter': '5', 'base': 0},
  '6': {'batter': '6', 'base': 0},
  '7': {'batter': '7', 'base': 0},
  '8': {'batter': '8', 'base': 0},
  '9': {'batter': '9', 'base': 0}
}
var scores = {
  '1': {'player': 0, 'cpu': 0},
  '2': {'player': 0, 'cpu': 0},
  '3': {'player': 0, 'cpu': 0},
  '4': {'player': 0, 'cpu': 0},
  '5': {'player': 0, 'cpu': 0},
  '6': {'player': 0, 'cpu': 0},
  '7': {'player': 0, 'cpu': 0},
  '8': {'player': 0, 'cpu': 0},
  '9': {'player': 0, 'cpu': 0},
}

var moveBases = [
  {'1': homeFirst, '2': homeSecond, '3': homeThird, '4': homeRun},
  {'1': firstSecond, '2': firstThird, '3': firstHome, '4': firstHome},
  {'1': secondThird, '2': secondHome, '3': secondHome, '4': secondHome},
  {'1': thirdHome, '2': thirdHome, '3': thirdHome, '4': thirdHome}
]

$('.again').click(function(){
  $('.over').hide()
  $('#dull').hide()
  $('.inn').text('')
  $('.innTot').text('0')
  $('#clock').text('0.00')
  for(i = 0; i < 9; ++i){
    scores[String(i)] = {'player': 0, 'cpu': 0};
  }
  for(j = 0; j < 9; ++j){
    batters[String(j+1)] = {'batter': String(j+1), 'base': 0};
  }
  vis = 'start'
  outs = 0
  inning = 1
  batter = 0
  batterUp('1')
})


function printTime(start){
  interval =  setInterval(function(){
      var time = new Date().getTime() - start
      $('#clock').text(d3.format('.2f')(time/1000))
    }, 10, start);
}

function moveRunner(batter, outcome){
  var pre = batters[batter]['base']
  var post = pre + outcome
  moveBases[pre][String(outcome)](String(batter))
  if(post >= 4){
    addScore(inning, batter)
    batters[batter]['base'] = 0
  }else{
    batters[batter]['base'] = post
  }
}
function baseOut(up, outcome){
  moveRunner(up, outcome)
  for(j = 0; j < 9; ++j){
    if(String(j+1) != up)
    if(batters[String(j+1)]['base']>0){
      moveRunner(String(j+1), outcome)
    }
  }
}
function addScore(inning, user){
  scoreVal = scores[inning]['player'] + 1
  scores[inning]['player'] = scoreVal
  $('#user'+inning).text(scoreVal)
  $('#userTot').text(parseFloat($('#userTot').text()) + 1)
}

function gameOver(){
  vis = 'over'
  if(parseFloat($('#userTot').text()) > parseFloat($('#cpuTot').text())){
    $('#win').show()
  }else if(parseFloat($('#userTot').text()) < parseFloat($('#cpuTot').text())){
    $('#lose').show()
  }else{
    $('#tie').show()
  }
  $('#dull').css('opacity', '75%')
  $('#dull').show()
  inning = 0;
  outs = 0;
}





var width = $('#field').attr('width')
var height = $('#field').attr('height')
var margins = {left: 10, right: 10, top: 10, bottom: 10}
var xScale = d3.scaleLinear().domain([-100, 100]).range([0,width])
var yScale = d3.scaleLinear().domain([180, -20]).range([0,height])


fieldSVG = d3.select('#field')
    .style('border', '2px solid black')
    .style('background-color', '#95d1ba')

var infield_dirt =
	      "M " + xScale(0) + " " + yScale(-5) + " " +
	      "L " + xScale(-100) + " " + yScale(95) + " " +
	      "Q " + xScale(0) + ", " + yScale(220) + " " + + xScale(100) + ", " + yScale(95) + "Z "

var foul_lines =
   "M " + xScale(-200) + " " + yScale(200) + " " +
   "L " + xScale(0) + " " + yScale(0) + " " +
   "L " + xScale(200) + " " + yScale(200) + " " +
   "L " + xScale(0) + " " + yScale(0)

var infield_grass =
   "M " + xScale(0) + " " + yScale(10) + " " +
   "L " + xScale(-50) + " " + yScale(60) + " " +
   "L " + xScale(0) + " " + yScale(110) + " " +
   "L " + xScale(50) + ", " + yScale(60) + "Z "


var foul_lines =
    "M " + xScale(-239) + " " + yScale(239) + " " +
    "L " + xScale(0) + " " + yScale(0) + " " +
    "L " + xScale(239) + " " + yScale(239) + " " +
    "L " + xScale(0) + " " + yScale(0)



// inf dirt
fieldSVG.append("path")
  .attr("d", infield_dirt)
  .attr('class', 'fieldPath')
  .style("fill", "#ded8cd");

//infield grass
fieldSVG.append('path')
.attr('class', 'fieldPath')
.attr('fill', "#95d1ba")
.attr('d', infield_grass)

  //mound
fieldSVG.append('circle')
  .attr('cx', xScale(0))
  .attr('cy', yScale(59.5))
  .attr('r', 17)
  .attr('class', 'fieldPath')
  .style("fill", "#ded8cd")
  .style('stroke', 'white')
  .style('stroke-width', '2')

// rubber
fieldSVG.append("line")
  .attr("x1", xScale(-2))
  .attr("x2", xScale(2))
  .attr("y1", yScale(60.5))
  .attr("y2", yScale(60.5))
  .attr('class', 'fieldPath')
  .style("stroke", "white")
  .style('stroke-width', '2')

  // foul lines
fieldSVG.append("path")
  .attr("d", foul_lines)
  .attr('class', 'fieldPath')
  .style("stroke", "white")
  .style('stroke-width', '3')


  // // home plate
  // fieldSVG.append('circle')
  //   .attr('cx', xScale(0))
  //   .attr('cy', yScale(0))
  //   .attr('r', 10)
  //   .attr('class', 'fieldPath')
  //   .style("fill", "#ded8cd")
  //   .style('stroke', 'white')
  //   .style('stroke-width', '2')

//bases
fieldSVG.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', 5)
  .attr('height', 5)
  .attr('transform', `translate(${width-85}, 260)rotate(45)`)
  .attr('class', 'fieldPath')
  .style("fill", "white")

fieldSVG.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', 5)
  .attr('height', 5)
  .attr('transform', `translate(${85}, 260)rotate(45)`)
  .attr('class', 'fieldPath')
  .style("fill", "white")

fieldSVG.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', 5)
  .attr('height', 5)
  .attr('transform', `translate(${width/2}, ${115})rotate(45)`)
  .attr('class', 'fieldPath')
  .style("fill", "white")

 var battersList = []
 for(var key in batters){
     if(batters.hasOwnProperty(key)) {
         battersList.push([key, batters[key]]);
     }
 }

fieldSVG.append('circle')
  .attr('id', 'out1')
  .attr('class', 'outCirc')
  .attr('cx', width-20)
  .attr('cy', 15)
  .attr('r', '11')
  .style('stroke', 'red')
  .style('stroke-width', '2')
  .style('fill', 'none')

fieldSVG.append('circle')
  .attr('id', 'out2')
  .attr('class', 'outCirc')
  .attr('cx', width-50)
  .attr('cy', 15)
  .attr('r', '11')
  .style('stroke', 'red')
  .style('stroke-width', '2')
  .style('fill', 'none')

player = fieldSVG.selectAll('.players').data(battersList, function(d){return d[1].batter})
  .enter().append('g')

circles =
  player.append('circle')
  .attr('id', function(d){ return 'batter'+d[1].batter})
  .attr('cx', width - 20)
  .attr('cy', function(d, i){ return yScale(-10) - i*25})
  .attr('r', '11')
  .style('fill', '#c1b1e0')
  .style('stroke', 'black')



function batterUp(batter){
  curBat = d3.select('#batter'+batter)
  curBat
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(0))

}

function batterOut(batter){
  outBatter = d3.select('#batter'+batter)
  outBatter
    .transition().duration(500)
    .attr('cx', width - 20)
    .attr('cy', yScale(-10) - (parseFloat(batter)-1)*25)
}


function homeFirst(batter){
  runner = d3.select('#batter'+batter)
  runner
    .transition().duration(500)
    .attr('cx', xScale(63.63))
    .attr('cy', yScale(63.63))
}

function homeSecond(batter){
  runner = d3.select('#batter'+batter)
  runner
    .transition().duration(500)
    .attr('cx', xScale(63.63))
    .attr('cy', yScale(63.63))
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(127.2))
}

function homeThird(batter){
  runner = d3.select('#batter'+batter)
  runner
    .transition().duration(500)
    .attr('cx', xScale(63.63))
    .attr('cy', yScale(63.63))
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(127.2))
    .transition().duration(500)
    .attr('cx', xScale(-63.63))
    .attr('cy', yScale(63.63))
}

function homeRun(batter){
  runner = d3.select('#batter'+batter+', #circle'+batter)
  runner
    .transition().duration(500)
    .attr('cx', xScale(63.63))
    .attr('cy', yScale(63.63))
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(127.2))
    .transition().duration(500)
    .attr('cx', xScale(-63.63))
    .attr('cy', yScale(63.63))
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(0))
    .transition().duration(500)
    .attr('cx', width - 20)
    .attr('cy', yScale(-10) - (parseFloat(batter)-1)*25)
}


function firstSecond(batter){
  runner = d3.select('#batter'+batter)
  runner
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(127.2))
}

function firstThird(batter){
  runner = d3.select('#batter'+batter)
  runner
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(127.2))
    .transition().duration(500)
    .attr('cx', xScale(-63.63))
    .attr('cy', yScale(63.63))
}

function firstHome(batter){
  runner = d3.select('#batter'+batter)
  runner
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(127.2))
    .transition().duration(500)
    .attr('cx', xScale(-63.63))
    .attr('cy', yScale(63.63))
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(0))
    .transition().duration(500)
    .attr('cx', width - 20)
    .attr('cy', yScale(-10) - (parseFloat(batter)-1)*25)
}

function secondThird(batter){
  runner = d3.select('#batter'+batter)
  runner
    .transition().duration(500)
    .attr('cx', xScale(-63.63))
    .attr('cy', yScale(63.63))
}

function secondHome(batter){
  runner = d3.select('#batter'+batter)
  runner
    .transition().duration(500)
    .attr('cx', xScale(-63.63))
    .attr('cy', yScale(63.63))
    .transition().duration(500)
    .attr('cx', xScale(0))
    .attr('cy', yScale(0))
    .transition().duration(500)
    .attr('cx', width - 20)
    .attr('cy', yScale(-10) - (parseFloat(batter)-1)*25)
}

function thirdHome(batter){
  runner = d3.select('#batter'+batter)
  runner
  .transition().duration(500)
  .attr('cx', xScale(0))
  .attr('cy', yScale(0))
    .transition().duration(500)
    .attr('cx', width - 20)
    .attr('cy', yScale(-10) - (parseFloat(batter)-1)*25)
}



$('.myTeam').click(function(){
  $('.myTeam').removeClass('teamSelected')
  $(this).addClass('teamSelected')
  $('#userName').html($(this).html())
  checkSelected()
})

$('.oppTeam').click(function(){
  $('.oppTeam').removeClass('teamSelected')
  $(this).addClass('teamSelected')
  $('#cpuName').html($(this).html())
  checkSelected()
})

diff = 7
$('.diff').click(function(){
  $('#diffEasy').css('color', 'green').css('background-color', 'white')
  $('#diffMed').css('color', 'black').css('background-color', 'white')
  $('#diffHard').css('color', 'red').css('background-color', 'white')
  $(this).css('color', 'white').css('background-color', $(this).data('col'))
  diff = $(this).data('diff')
  console.log(diff)
  diffSelected()
})

function checkSelected(){
  if($('.teamSelected').length == 2){
    $('#difficulty').show()
  }
  if($('.teamSelected').length < 2){
    $('#difficulty').hide()
  }
}
function diffSelected(){
  if(diff > 0){
    $('#continue').show()
  }
  if(diff == 0){
    $('#continue').hide()
  }
}

$('#continue').click(function(){
  startGame()
})

function startGame(){

  $('#start').click(function(){
    vis = 'stop'
    $(this).hide()
    $('#stop').show()
    start = new Date().getTime()
    printTime(start)
  })


  $('body').keyup(function(e){
    if(vis != 'over'){
     if(e.keyCode == 32 & space == 1){
        event.preventDefault();
         if(vis == 'start'){
           vis = 'stop'
           $('#start').hide()
           $('#stop').show()
           start = new Date().getTime()
           printTime(start)
         }else if(vis == 'stop'){
           vis = 'start'
           $('#stop').hide()
           $('#start').show()
           clearInterval(interval)
           if(batter<9){
             batter = batter + 1
           }else{
             batter = 1
           }
           if(batter<9){
             nextBatter = batter + 1
           }else{
             nextBatter = 1
           }
           outcome = parseFloat($('#clock').text())
           if([.97,.98,.99,1.00].indexOf(outcome) > -1){
             baseOut(String(batter), baseScale(outcome))
             batterUp(nextBatter)
           } else{
             outs = outs + 1
             if(outs == 1 | outs == 2){
               d3.select('#out'+outs).style('fill', 'red').style('stroke', 'black')
             }else if(outs == 3){
               d3.selectAll('.outCirc').style('fill', 'none').style('stroke', 'red')
             }
             batterOut(String(batter))
             if(outs == 3){
               outs = 0
               for(j = 0; j < 9; ++j){
                 batters[String(j+1)] = {'batter': String(j+1), 'base': 0};
                 batterOut(String(j+1))
               }
               if(scores[inning]['player'] == 0){
                 $('#user'+inning).text('0')
               }
               if(inning < 9){
                 oppScore(inning, diff)
                 inning = inning + 1
                 batterUp(nextBatter)
               }else if(parseFloat($('#cpuTot').text()) <= parseFloat($('#userTot').text())){
                 oppScore('9', diff)
                 setTimeout(function() {
                   gameOver()
                 }, 750);
               }else{
                 setTimeout(function() {
                   gameOver()
                 }, 750);
               }
             }else{
               batterUp(nextBatter)
             }
           }
         }
     }
   }
  });

  $('#stop').click(function(){
    vis = 'start'
    $(this).hide()
    $('#start').show()
    clearInterval(interval)
    if(batter<9){
      batter = batter + 1
    }else{
      batter = 1
    }
    if(batter<9){
      nextBatter = batter + 1
    }else{
      nextBatter = 1
    }
    outcome = parseFloat($('#clock').text())
    if([.97,.98,.99,1.00].indexOf(outcome) > -1){
      baseOut(String(batter), baseScale(outcome))
      batterUp(nextBatter)
    } else{
      outs = outs + 1
      if(outs == 1 | outs == 2){
        d3.select('#out'+outs).style('fill', 'red').style('stroke', 'black')
      }else if(outs == 3){
        d3.selectAll('.outCirc').style('fill', 'none').style('stroke', 'red')
      }
      batterOut(String(batter))
      if(outs == 3){
        outs = 0
        for(j = 0; j < 9; ++j){
          batters[String(j+1)] = {'batter': String(j+1), 'base': 0};
          batterOut(String(j+1))
        }
        if(scores[inning]['player'] == 0){
          $('#user'+inning).text('0')
        }
        if(inning < 9){
          oppScore(inning, diff)
          inning = inning + 1
          batterUp(nextBatter)
        }else if(parseFloat($('#cpuTot').text()) <= parseFloat($('#userTot').text())){
          oppScore('9', diff)
          setTimeout(function() {
            gameOver()
          }, 750);
        }else{
          setTimeout(function() {
            gameOver()
          }, 750);
        }
      }else{
        batterUp(nextBatter)
      }
    }
  })

  $('#dull').hide()
  $('#teamDiv').hide()
  batterUp('1')
}

//Negative binomial random number: https://wiki.q-researchsoftware.com/wiki/How_to_Generate_Random_Numbers:_Poisson_Distribution#:~:text=Create%20a%20new%20JavaScript%20Variable,k%2B%2B%3B%20p%20*%3D%20Math.
function oppScore(inning, diff){
  var mean = diff/9;

  var L = Math.exp(-mean);
  var p = 1.0;
  var k = 0;

  while (p > L){
      k++;
      p *= Math.random()
  }

  setTimeout(function() {
    scores[inning]['cpu'] = k-1
    $('#cpu'+inning).text(k-1)
    $('#cpuTot').text(parseFloat($('#cpuTot').text()) + (k-1))
  }, 500);

  if(inning == '9'){
    console.log('here')
  }

}

$('.close').click(function(){
  $('#instructions').hide()
  $('#dull').hide()
  space = 1
})
startGame()
space = 0
$('#dull').css('opacity', '.75')
$('#dull').show()

$(document).ready(function() {

	var games = [];

	var home_team_info = [];
	var away_team_info = [];
	var teams = [];
	var home = "",
		away = "",
		location = "";
	var home_team_id;
	var away_team_id;
			
	$('#team_name_game > option').each(function() {
		teams.push($(this)[0].outerHTML);
	});

	$('.season_year_game').on('change', function() {
		var team_id_selected = $('.team_name_game').val();
		if ($(this).val() != 0 && team_id_selected != 0) {
			filter_game();
		}
	});

	$('.team_name_game').on('change', function() {
		var season = $('.season_year_game');
		var season_selected = season.val();
		if ($(this).val() != undefined && season_selected != undefined) {
			filter_game();
		}

	});

	var getTeamInfo = function(team_id, location) {
		if (team_id == undefined) {
			var team_id_selected = $('.team_name_game').val(); //is this the id?
		} else { 
			var team_id_selected = team_id;
		}
		var season = $('.season_year_game');
		var season_selected = season.val();
		$.ajax({
			type: 'GET',
			url: 'http://localhost:1337/stats.nba.com/stats/teaminfocommon?LeagueID=00&Season='+ season_selected +'&SeasonType=Regular+Season&TeamID=' + team_id_selected,
			data: {} ,
			datatype: 'JSON',
			contentType: 'application/json; charset=utf-8',
			success: function(data) {}


		}).done(function(data) {
			var arr = data['resultSets'][0]['rowSet'][0];
			if (location != undefined) {
				if (location == "away") {
					away_team_info.push({
						"TEAM_ID": arr[0],
						"SEASON_YEAR": arr[1],
						"TEAM_CITY": arr[2],
						"TEAM_NAME": arr[3],
						"TEAM_ABBREVIATION": arr[4],
						"TEAM_CONFERENCE": arr[5],
						"TEAM_DIVISION": arr[6],
						"TEAM_CODE": arr[7],
						"W": arr[8],
						"L": arr[9],
						"PCT": arr[10],
						"CONF_RANK": arr[11],
						"DIV_RANK": arr[12],
						"MIN_YEAR": arr[13],
						"MAX_YEAR": arr[14]
					});
				} else {
					home_team_info.push({
						"TEAM_ID": arr[0],
						"SEASON_YEAR": arr[1],
						"TEAM_CITY": arr[2],
						"TEAM_NAME": arr[3],
						"TEAM_ABBREVIATION": arr[4],
						"TEAM_CONFERENCE": arr[5],
						"TEAM_DIVISION": arr[6],
						"TEAM_CODE": arr[7],
						"W": arr[8],
						"L": arr[9],
						"PCT": arr[10],
						"CONF_RANK": arr[11],
						"DIV_RANK": arr[12],
						"MIN_YEAR": arr[13],
						"MAX_YEAR": arr[14]
					});
				}

				var picture_png = 'http://stats.nba.com/media/img/teams/logos/season/2016-17/'+ arr[4] +'_logo.svg';

				var team_info;

				if (location == "home") {
					team_info = home_team_info;
					$('#home_picture').attr("src", picture_png);
				} else {
					team_info = away_team_info;
					$('#away_picture').attr("src", picture_png);
				}

				$('#team_name_'+location).text(team_info[0]["TEAM_CITY"] + " " + team_info[0]["TEAM_NAME"]);
		   		$('#wl_'+location).text(team_info[0]["W"]+" - " + team_info[0]["L"]);
		   		$('#percent_'+location).text(team_info[0]["PCT"]);
		   		$('#division_rank_'+location).text(team_info[0]["DIV_RANK"]);
		   		$('#conf_rank_'+location).text(team_info[0]["CONF_RANK"]);
			}
		});
	};


	var filter_game = function() {
		getTeamInfo();
		resetGame();
		var season = $('.season_year_game');
		var season_selected = season.val();
		var team_id_selected = $('.team_name_game').val(); //is this the id?
		
		var season_selected_game_id = season.find('option:selected').data('season-id');
		//old url: 'http://localhost:1337/stats.nba.com/stats/leaguegamelog?Counter=1000&Direction=DESC&LeagueID=00&PlayerOrTeam=P&Season='+season_selected+'&SeasonType=Regular+Season&Sorter=PTS'
		$.ajax({
			type: 'GET',
			url: 'http://localhost:1337/stats.nba.com/stats/teamgamelog?DateFrom=&DateTo=&LeagueID=00&Season='+season_selected+'&SeasonType=Regular%20Season&TeamID='+team_id_selected,
			data: {} ,
			datatype: 'JSON',
			contentType: 'application/json; charset=utf-8',
			success: function(data) {}


		}).done(function(data) {
			var arr = data['resultSets'][0]['rowSet'];

			var playerGames = [];
			$.each(arr, function(ind, arr) {
				playerGames.push(arr);
			});
			playerGames
				.sort(function(a, b) {
					return parseInt(b[6]) - parseInt(a[6]);
				})
				.forEach(function(val) {
					$('.game_date_game').append('<option data-matchup='+val[3]+' id="' + val[1] + '" value="' + val[1] + '">' + val[3] + " - " + val[2] + '</option>');
				});


		});
	};


	var resetGame = function() {
		$('.game_date_game').empty();
	}

	function find_location(location,matchup) {
		if (location != ("@")) {
			return matchup.substring(8,11);
		} else {
			return matchup.substring(6,9);
		}
	}

	$('.filter_game').on('click', function() {
		var game_id = $('.game_date_game').val();
		$.ajax({
			type: 'GET',
			url: 'http://localhost:1337/stats.nba.com/stats/winprobabilitypbp?GameID=' + game_id+ '&RunType=each%20second',
			data: {} ,
			datatype: 'JSON',
			contentType: 'application/json; charset=utf-8',
			success: function(data) {}

		}).done(function(data) {
			var arr = data['resultSets'][0]['rowSet'];
			matchup = $('.game_date_game').find('option:selected').text();
			home = matchup.substring(0,3);
			location = matchup.substring(4,5);
			away = find_location(location,matchup);

			$('#team_name_game > option').each(function() {
			   if ($(this).data('abbr') == away) {
			   	 	away_team_id = $(this).val();
			   }
			    if ($(this).data('abbr') == home) {
			   	 	home_team_id = $(this).val();
			   }
			});


			var playerGames = [];
			var previous_score = [-1,-1]; //home,away
			var counter = 0;
			$.each(arr, function(ind, arr) {
				if (previous_score[0] != arr[4] || previous_score[1] != arr[5]) {
					playerGames.push({
						"timeline_y": counter,
						"period": arr[7],
						"seconds_remaining": arr[8],
						"home_pts": arr[4],
						"away_pts": arr[5],
						"difference": flip_difference(location) * (arr[4] - arr[5]),
						"description": arr[11]
					});
					previous_score[0] = arr[4];
					previous_score[1] = arr[5];
					counter += 5;
				}
			});



            getTeamInfo(away_team_id,"away");
            getTeamInfo(home_team_id,"home");

            var scores = data['resultSets'][1]['rowSet'][0];
            if (home_team_id == scores[2]) {
                $('#home-score').html(scores[4]).attr("class", "text-warning text-center");
                $('#away-score').html(scores[7]).attr("class", "text-warning text-center");
            } else {
                $('#home-score').html(scores[7]).attr("class", "text-warning text-center");
                $('#away-score').html(scores[4]).attr("class", "text-warning text-center");
            }

            if (parseInt($('#home-score').text()) < parseInt($('#away-score').text())) {
                $("#home-score").removeClass("text-warning");
            } else {
                $("#away-score").removeClass("text-warning");
            }

			draw_differences(playerGames);
		});
	});
});

var equilibrium_line = 350;
// var difference = 530;
var court_height = 500+ 100;

var diff_width = 700,
    diff_height = 750,
    diff_axisY = 40;

var equilibrium_line = diff_width/2;
function flip_difference(location) {
	if (location == "@") {
		return -1;
	} else {
		return 1;
	}
}

var diff_chart = d3.select("#difference_chart")
    .append("svg")
        .attr("width" , diff_width) //530 - 50 = 480
        .attr("height", diff_height)
    .append("g");

// var xValue = function(d) { return d.difference;}, // data -> value
//     .range([5, equilibrium_line*2-20]), // value -> display
//     xMap = function(d) { return xScale(xValue(d));}, // data -> display



var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var apply_team_color = function(difference,c1,c2) {
	if (difference > 0) {
		return c1;
	} else if (difference < 0) {
		return c2;
	} else {
		return "purple";
	}
}

// var xScale = d3.scale.linear()
xAxis = d3.svg.axis().scale(xScale).ticks(16, d3.format(",d")).orient("top");

xScale.domain([-45,45]).range([padding/2, 700-padding/2]);


diff_chart.append("g")
    .attr("class", "x axis") //	  
    .attr("transform", "translate(0,40 )")
    .attr("fill", "white")
    .call(xAxis)
.append("text")
    .attr("class", "label")
    .attr("x", 350)
    .attr("y", -30)
    .attr("fill", "white")
    .style("text-anchor", "middle")
    .text("Point Difference");

diff_chart.append("g")
    .append("line")
        .attr('x1', diff_width/2)
        .attr('y1', diff_axisY)
        .attr('x2', diff_width/2)
        .attr('y2', diff_height)
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr('opacity', 0.5);

for (var i = -45; i <= 45; i += 5) {
    diff_chart.append("g")
        .append("line")
            .attr('x1', xScale(i))
            .attr('y1', diff_axisY)
            .attr('x2', xScale(i))
            .attr('y2', diff_height)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr('opacity', 0.3);
}




var draw_differences = function(data) { //, c1, c2

	clear_diff_court();
	c1 = "red";
	c2 = "blue";
    var selection = diff_chart.append("g").selectAll(".ddot")
        .data(data, function(d) {return "" + d["timeline_y"] + d["difference"];});

    var diffLineData = [];

    selection.enter().append("circle")
        .attr("class", function(d, i) {return "ddot" + " data" + i; })
        .attr("cx", function(d) { return (-d.difference*7 + equilibrium_line - 2);  })
        .attr("cy", function(d) { return d.timeline_y+ 41; })
        .attr("r", 2)
        .each(function(d) {
            diffLineData.push({ "x": (-d.difference*7 + equilibrium_line - 2),
                                "y": d.timeline_y+ 41,
                                "c": apply_team_color(d["difference"], c2, c1)})
        })
        .style("fill", function(d) {
            return apply_team_color(d["difference"], c2, c1);
        })
        .style("stroke", function(d) {
        	return apply_team_color(d["difference"], c2, c1);
        })
        .on("mouseover", function(d) {
            var c = 'ddot';
            // Reset all.  Fixes overlapping circles
            d3.selectAll('.' + c)
                .call(unSelectClassData);

            d3.select(this)
                .call(selectClassData);

            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            tooltip.html(
              'Quarter: ' + d["period"] + "<br/>"
                + 'Time Remaining: ' + d["seconds_remaining"] + "<br/>"
                + 'Difference: ' + Math.abs(d["difference"]) + "<br/>"
                + 'Home: ' + d["home_pts"] + "<br/>"
                + 'Away: ' + d["away_pts"]
                )
                .style("left", d3.event.pageX + 5 + "px")
                .style("top", d3.event.pageY + 5 + "px")
        })
        .on("mouseleave", function(d){
            d3.selectAll(".ddot")
                .call(normalClassData);

            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        })
        .style('opacity', 0)
        .call(normalClassData);
}


var clear_diff_court = function() {
    d3.selectAll(".ddot")
        .call(removeClassData);
}

var color1 = '#0000FF';
var color2 = '#ff0000';
var color3 = '#32E010';
var color4 = '#FF33E3';

function update1(jscolor) {
	shot_data = [];
	clear_court();
    color1 = "#" + jscolor;
}

function update2(jscolor) {
	shot_data = [];
	clear_court();
    color2 = "#" + jscolor;
}

function update3(jscolor) {
	shot_data2 = [];
	clear_court();
    color3= "#" + jscolor;
}

function update4(jscolor) {
	shot_data2= [];
	clear_court();
    color4 = "#" + jscolor;
}

function calculate_age(birthday) {
	ISO_birthdate = new Date(birthday); //convert string to ISO_date
	age_diff = Date.now() - ISO_birthdate.getTime(); //subtract difference in ms
	var ageDate = new Date(age_diff); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

//Global variables
var shot_data = [];
var shot_data2 = [];
var players = []; // all players
var games = [];
var teams = [];

var home_court = "#home-court-background";
var comp_court = "#comp-court-background";

$(document).ready(function() {


	//had to set up CORS proxy server for cross domain api call issues
	//http://ionicinaction.com/blog/how-to-fix-cors-problems-and-no-access-control-allow-origin-header-errors-with-ionic/
	//https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS

	//start proxy server up first by typing corsproxy in command line
	//corsporxy server is running on http://localhost:1337

	// MESSED WITH MY BOOTSTRAP CSS
	// $('.player_name').select2();
	// $('.season_year').select2();
	// $('.team_name').select2();
	// $('.game_date').select2();
	// $('.player_name2').select2();

	// var shot_data = [];
	// var shot_data2 = [];
	// var players = []; // all players
	// var games = [];
	// var teams = [];

	$('#team_name > option').each(function() {
		teams.push($(this)[0].outerHTML);
	});

	//get all player names in season 2012 - 2017 for drop down
	$.ajax({
		type: 'GET',
		url: 'http://localhost:1337/stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=2016-17',
		data: {} ,
		datatype: 'JSON',
		contentType: 'application/json; charset=utf-8',
		success: function(data) {}

	}).done(function(data) {
		var arr = data['resultSets'][0]['rowSet'];
		var option = '<option value="0" id="0"></option>';
		$('.player_name').append(option);
		$('.player_name1').append(option);
		$('.player_name2').append(option);
		players.push(option);

		$.each(arr, function(ind, arr) {
			if (parseInt(arr[5]) >= 2012 && arr[7] != "0") {
				var option = '<option data-season-start="' + arr[4] + '" data-season-end="' + arr[5] 
					+ '" data-team-id="' + arr[7] + '" value="' + arr[0] + '" id="' + arr[0] +'">' + arr[2] + '</option>';

				$('.player_name').append(option);
				$('.player_name1').append(option);
				$('.player_name2').append(option);
				players.push(option);
			}
		});
	}) ;



	// get player specific data in a function
	$('.filter').on('click', function() {
		var player_id_selected = $('.player_name').val(); //player id
		var season_selected = $('.season_year').val();
		var team_id = $('.player_name').find('option:selected').data('team-id');
		var game_id = $('.game_date').val();

		clear_court();
		sleep(500);
		// var player_id_selected2 = $('.player_name2').val();
		// var team_id2 = $('.player_name2').find('option:selected').data('team-id');

		// Game Score
		$.ajax({			
			type: 'GET',
			url: 'http://localhost:1337/stats.nba.com/stats/boxscoresummaryv2?GameID=' + game_id,
			datatype: 'JSON',
			contentType: 'application/json; charset=utf-8',
			success: function(data) {
			}
		}).done(function(data) {
			var arr = data['resultSets'][5]['rowSet'];
			var leftData = arr[0],
				rightData = arr[1];


            $("#home-left-team").html(leftData[5] + " " + leftData[6]).attr("class", "text-warning");
            $("#home-right-team").html(rightData[5] + " " + rightData[6]).attr("class", "text-warning");

            $("#home-left-score").html(leftData[22]).attr("class", "text-warning");
            $("#home-right-score").html(rightData[22]).attr("class", "text-warning");
			
			if (leftData[22] < rightData[22]) {
            	$("#home-left-team").removeClass("text-warning");
	            $("#home-left-score").removeClass("text-warning");
			} else {
            	$("#home-right-team").removeClass("text-warning");
	            $("#home-right-score").removeClass("text-warning");
			}

			$("#home-left-picture").attr("src", 'http://stats.nba.com/media/img/teams/logos/season/2016-17/'+ leftData[4] +'_logo.svg');
			$("#home-right-picture").attr("src", 'http://stats.nba.com/media/img/teams/logos/season/2016-17/'+ rightData[4] +'_logo.svg');
		});




		// shot chart
		$.ajax({
			type: 'GET',
			url: 'http://localhost:1337/stats.nba.com/stats/shotchartdetail?CFID=&CFPARAMS=&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&EndPeriod=10&EndRange=28800&GameID=' + game_id + '&GameSegment=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&PlayerID=' + player_id_selected + '&PlayerPosition=&Position=&RangeType=0&RookieYear=&Season=' + season_selected + '&SeasonSegment=&SeasonType=Regular+Season&StartPeriod=1&StartRange=0&TeamID=' + team_id+ '&VsConference=&VsDivision=&mtitle=&mtype=',
			datatype: 'JSON',
			contentType: 'application/json; charset=utf-8',
			success: function(data) {
			}
		}).done(function(data) {
			var arr = data['resultSets'][0]['rowSet'];
			shot_data = [];

			$.each(arr, function(ind, arr) {
				shot_data.push({
					"x": arr[17],
					"y": arr[18],
					"period": arr[7],
					"minutes remaining": arr[8],
					"result": arr[10],
					"action type": arr[11], //i.e.driving bank shot
					"shot type": arr[12],
					"seconds remaining": arr[9],
					"shot zone range": arr[15], //distance
					"shot zone basic": arr[13], //restricted area
					"shot zone area": arr[14], //basic c
					"shot attempted flag": arr[19], //1 or 0
					"shot made flag": arr[20]

				});
			
			});


			draw_shots(shot_data, home_court, color1, color2);
			draw_timeline_shots(shot_data, color1, color2)
		}) ;
	})
	

	var getPlayerStatsChart = function() {
		var player_id_selected = $('.player_name').val(); //player id
		var season = $('.season_year').val();
		var game_id = $('.game_date').val();

		if (player_id_selected != null && game_id != null) {
			$.ajax({
				type: 'GET',
				url: 'http://localhost:1337/stats.nba.com/stats/boxscoretraditionalv2?EndPeriod=10&EndRange=28800&GameID='+game_id+'&RangeType=0&Season='+season+'&SeasonType=Regular%20Season&StartPeriod=1&StartRange=0',
				data: {} ,
				datatype: 'JSON',
				contentType: 'application/json; charset=utf-8',
				success: function(data) {}

			}).done(function(data) {
				var arr = data['resultSets'][0]['rowSet'];
				$.each(arr, function(ind, arr) {
					if (parseInt(arr[4]) == parseInt(player_id_selected)){
						//the data --> 
						$('#min').html(arr[8]);
						$('#fgm').html(arr[9]);
						$('#fga').html(arr[10]);
						$('#fg_pct').html(arr[11]);
						$('#fg3m').html(arr[12]);
						$('#fg3a').html(arr[13]);
						$('#fg3_pct').html(arr[14]);
						$('#ftm').html(arr[15]);
						$('#fta').html(arr[16]);
						$('#ft_pct').html(arr[17]);
						$('#oreb').html(arr[18]);
						$('#dreb').html(arr[19]);
						$('#reb').html(arr[20]);
						$('#ast').html(arr[21]);
						$('#stl').html(arr[22]);
						$('#blk').html(arr[23]);
						$('#to').html(arr[24]);
						$('#pf').html(arr[25]);
						$('#pts').html(arr[26]);
						$('#plus_minus').html(arr[27]);


// arr[26]
// :
// "PTS"
// arr[27]
// :
// "PLUS_MINUS"

					}
				});

			});
			
		}
	}

	$('.game_date').on('change', function() {
		getPlayerStatsChart();
	});

		//only show seaons in which player played
	$('.player_name').on('change', function() {
		getPlayerStatsChart();
		var selected_game = $('.game_date').find('option:selected').text();

		//update biographic info
		var player_id_selected = $('.player_name').val(); //player id
		if (player_id_selected != "0") {
			$('.game_date').prop("disabled", false);
		}
		var picture_png = 'http://stats.nba.com/media/players/230x185/' + player_id_selected + '.png';

		var name = $('.player_name').find('option:selected').text()
		$("#player1_name").text(name);

		$('#name').text(name);
		$('#picture').attr("src", picture_png);

		var season = $('.season_year').val();

		$.ajax({
			type: 'GET',
			url: 'http://localhost:1337/stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID='+ player_id_selected +'&SeasonType=Regular+Season',
			data: {} ,
			datatype: 'JSON',
			contentType: 'application/json; charset=utf-8',
			success: function(data) {}

		}).done(function(data) {
			var arr = data['resultSets'][0]['rowSet'][0];
       		$('#team').text(arr[20] + " " + arr[17]);
       		$('#age').text(calculate_age(arr[6]));
       		$('#height').text(arr[10]);
       		$('#weight').text(arr[11]);
       		$('#country').text(arr[8]);
       		$('#position').text([arr[14]]);
		});

   		clear_court();

   		//get shot info
		if (season != undefined) {
			$.ajax({
				type: 'GET',
				url: 'http://localhost:1337/stats.nba.com/stats/leaguegamelog?Counter=1000&Direction=DESC&LeagueID=00&PlayerOrTeam=P&Season=' + season + '&SeasonType=Regular+Season&Sorter=PTS',
				data: {} ,
				datatype: 'JSON',
				contentType: 'application/json; charset=utf-8',
				success: function(data) {}

			}).done(function(data) {
				//only show games that player played in
				//WORKING ON THIS
				
				// if (selected_game == "") {
					// $('.player_name2').prop("disabled", true);
					$('.game_date').empty();
					var arr = data['resultSets'][0]['rowSet'];
					$('.game_date').append('<option id="0" value="0"></option>');

					var playerGames = [];
					$.each(arr, function(ind, val) {
						if (parseInt(player_id_selected) === parseInt(val[1])) {
							playerGames.push(val);
						}
					});
					playerGames
						.sort(function(a, b) {
							return parseInt(a[6]) - parseInt(b[6]);
						})
						.forEach(function(val) {
							$('.game_date').append('<option id="' + val[6] + '" value="' + val[6] + '">' + val[8] + " - " + val[7] + '</option>');
						});

				// }
			}) ;
		}
	});


		//get all possible game ideas for drop down based on season and player
	$('.season_year').on('change', function() {
		resetPlayers();
		// resetGames();
		var player_id_selected = $('.player_name').val() 
		// if (player_id_selected != 0) { //player id
			var season = $(this).val();
			$('.game_date').empty();
			$.ajax({
				type: 'GET',
				url: 'http://localhost:1337/stats.nba.com/stats/leaguegamelog?Counter=1000&Direction=DESC&LeagueID=00&PlayerOrTeam=P&Season=' + season + '&SeasonType=Regular+Season&Sorter=PTS',
				data: {} ,
				datatype: 'JSON',
				contentType: 'application/json; charset=utf-8',
				success: function(data) {}
			}).done(function(data) {
				var arr = data['resultSets'][0]['rowSet'];
				games = [];
				var option = '<option id="0" value="0"></option>';

				$('.game_date').append(option);
				games.push({
					'option': option,
					'team id': 0,
					'game id': 0
				});

				var player_ids = "#0";

				$.each(arr, function(ind, arr) {
					// /TO DO
					//remove players that didn't player in this year
					//only show players who played in current season
					if (player_ids !== "")
						player_ids = player_ids + ", #" + arr[1];
					else 
						player_ids = player_ids + "#" + arr[1];

					//only show games for player if player is selected
					if (player_id_selected != 0) { 
						if (parseInt(player_id_selected) === parseInt(arr[1])) {
							var option = '<option id="' + arr[6] + '" value="' + arr[6] + '">' + arr[8] + " - " + arr[7] + '</option>';
							$('.game_date').append(option);

							var team_id = arr[3];
							games.push({
								'option': option,
								'team id': team_id,
								'game id': arr[6]
							});
						}
					}
				});
				$('.player_name > option').not( player_ids ).remove();
			}) ;
		// } 
	});


	//need this to hide select options for players who aren't on the team
	$('.team_name').on('change', function() {

		resetPlayers();
		resetGame();

		var season = $('.season_year').val();
		var team_id_selected = $(this).val(); 

		$.ajax({
		type: 'GET',
		url: 'http://localhost:1337/stats.nba.com/stats/leaguegamelog?Counter=1000&Direction=DESC&LeagueID=00&PlayerOrTeam=P&Season=' + season + '&SeasonType=Regular+Season&Sorter=PTS',
		data: {} ,
		datatype: 'JSON',
		contentType: 'application/json; charset=utf-8',
		success: function(data) {}

		}).done(function(data) {
			var arr = data['resultSets'][0]['rowSet'];
			var player_ids = "#0";
			var game_ids = "#0";
			$.each(arr, function(ind, arr) {
				//show only players on the team that is selected
				if (parseInt(team_id_selected) === parseInt(arr[3])) {
					if (player_ids !== "")
						player_ids = player_ids + ", #" + arr[1];
					else 
						player_ids = player_ids + "#" + arr[1];
				}
			});
			$('.player_name > option').not( player_ids ).remove();
			//show only games where team played
			$.each(games, function(ind, g) {
				if (parseInt(g['team id']) === parseInt(team_id_selected)) {
					game_ids = game_ids + ", #" + g['game id'];
				}
			});
			$('.game_date > option').not( game_ids ).remove();
		}) ;
	});

	var resetPlayers = function() {
		$('.player_name').empty();
		$('.player_name2').empty();
		for (var i=0; i < players.length; i++) {
			$('.player_name').append(players[i]);
			$('.player_name2').append(players[i]);
		}
	}

	var resetGame = function() {
		if ($('#game_date > option').length < games.length) {
			$('.game_date').empty();
			for (var j=0; j < games.length; j++) {
				$('.game_date').append(games[j].option);
			}
		}
	}
});

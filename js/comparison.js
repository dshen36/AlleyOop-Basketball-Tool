function calculate_age(birthday) { //how to make this a global function?
	ISO_birthdate = new Date(birthday); //convert string to ISO_date
	age_diff = Date.now() - ISO_birthdate.getTime(); //subtract difference in ms
	var ageDate = new Date(age_diff); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
var shot_data = [];
$(document).ready(function() {

	// get player specific data in a function
	$('.filter_comp').on('click', function() {
		var player_id_selected = $('.player_name1').val(); //player id
		var season_selected = $('.season_year').val();
		var team_id = $('.player_name1').find('option:selected').data('team-id');
		var game_id = $('.game_date_comp').val();

		var player_id_selected2 = $('.player_name2').val();
		var team_id2 = $('.player_name2').find('option:selected').data('team-id');

		clear_court();

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
			// TODO: this needs to draw onto the new canvas in comparison tab. 
			draw_shots(shot_data, comp_court, color1, color2); 
		}) ;
		if (player_id_selected2 != "0") {
			$.ajax({
				type: 'GET',
				url: 'http://localhost:1337/stats.nba.com/stats/shotchartdetail?CFID=&CFPARAMS=&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&EndPeriod=10&EndRange=28800&GameID=' + game_id + '&GameSegment=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&PlayerID=' + player_id_selected2 + '&PlayerPosition=&Position=&RangeType=0&RookieYear=&Season=' + season_selected + '&SeasonSegment=&SeasonType=Regular+Season&StartPeriod=1&StartRange=0&TeamID=' + team_id2 + '&VsConference=&VsDivision=&mtitle=&mtype=',
				datatype: 'JSON',
				contentType: 'application/json; charset=utf-8',
				success: function(data) {
				}
			}).done(function(data) {
				var arr = data['resultSets'][0]['rowSet'];
				shot_data2 = [];

				$.each(arr, function(ind, arr) {
					shot_data2.push({
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
				draw_shots(shot_data2, comp_court, color3, color4);
			}) ;

		}
	})

	//only show seaons in which player played	
	$('.player_name1').on('change', function() {
		var player_id_selected = $('.player_name1').val(); //player id

		//display player 2 stats
		// if (player_id_selected != "0") {
			
		// }
		if (player_id_selected != "") {
			$('.game_date_comp').prop("disabled", false);
			var picture_png = 'http://stats.nba.com/media/players/230x185/' + player_id_selected + '.png';

			var name = $('.player_name1').find('option:selected').text()
			$("#player1_name").text(name);

			$('#name1').text(name);
			$('#picture1').attr("src", picture_png);

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
	       		$('#team1').text(arr[17]);
	       		$('#age1').text(calculate_age(arr[6]));
	       		$('#height1').text(arr[10]);
	       		$('#weight1').text(arr[11]);
	       		$('#country1').text(arr[8]);
	       		$('#position1').text([arr[14]]);
			});

		}
		clear_court();

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
					$('.game_date_comp').empty();
					var arr = data['resultSets'][0]['rowSet'];
					$('.game_date_comp').append('<option id="0" value="0"></option>');

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
							$('.game_date_comp').append('<option id="' + val[6] + '" value="' + val[6] + '">' + val[8] + " - " + val[7] + '</option>');
						});

				// }
			}) ;
		}
	});

		//only show players who played in the same game
	$('.player_name2').on('change', function() {
		clear_court();
		var player_id_selected = $('.player_name2').val(); //player id

		//display player 2 stats
		if (player_id_selected != "") {

			var picture_png = 'http://stats.nba.com/media/players/230x185/' + player_id_selected + '.png';

			var name = $('.player_name2').find('option:selected').text()
			$("#player2_name").text(name);

			$('#name2').text(name);
			$('#picture2').attr("src", picture_png);

			var season = $('.season_year2').val();

			$.ajax({
				type: 'GET',
				url: 'http://localhost:1337/stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID='+ player_id_selected +'&SeasonType=Regular+Season',
				data: {} ,
				datatype: 'JSON',
				contentType: 'application/json; charset=utf-8',
				success: function(data) {}

			}).done(function(data) {
				var arr = data['resultSets'][0]['rowSet'][0];
	       		$('#team2').text(arr[17]);
	       		$('#age2').text(calculate_age(arr[6]));
	       		$('#height2').text(arr[10]);
	       		$('#weight2').text(arr[11]);
	       		$('#country2').text(arr[8]);
	       		$('#position2').text([arr[14]]);
			});

		}
	});

	$('.game_date_comp').on('change', function() { //game_date
		//always reset player 2
		$('.player_name2').empty();
		for (var i=0; i < players.length; i++) {
			$('.player_name2').append(players[i]);
		}


		//disable player 2
		var game_id = $(this).val();
		if (parseInt(game_id) == 0) {
			$('.player_name2').prop("disabled", true);
		} else {
			$('.player_name2').prop("disabled", false);
		}

		var season = $('.season_year').val();
		$.ajax({
			type: 'GET',
			url: 'http://localhost:1337/stats.nba.com/stats/leaguegamelog?Counter=1000&Direction=DESC&LeagueID=00&PlayerOrTeam=P&Season=' + season + '&SeasonType=Regular+Season&Sorter=PTS',
			data: {} ,
			datatype: 'JSON',
			contentType: 'application/json; charset=utf-8',
			success: function(data) {}
		}).done(function(data) {
			//get id of players who played in game selected
			var arr = data['resultSets'][0]['rowSet'];
			var id = "#0";
			$.each(arr, function(ind, arr) {
				if (parseInt(arr[6]) === parseInt(game_id)) {
					id = id + ", #" + arr[1];
				}
			});
			//player 2 includes players from both teams
			$('.player_name2 > option').not( id ).remove(); 
		});
	});
});
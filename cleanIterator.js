//We're interested in modifying the weapon, special, a and b skills, which are stored in challenger.*skillname* 
//

//A function for storing the valid skill values of a hero as global arrays for us to access later. Sets global max wins to the current win pct - we'll use this to track the best results.
function newHeroSkills(){
	weapon_values = $('#challenger_weapon>option').map(function() { return $(this).val(); });
	special_values = $("#challenger_special>option").map(function() { return $(this).val(); });
	a_values = $("#challenger_a>option").map(function() { return $(this).val(); });
	b_values = $("#challenger_b>option").map(function() { return $(this).val(); });
	c_values = $("#challenger_c>option").map(function() { return $(this).val(); });
	s_values = $("#challenger_s>option").map(function() { return $(this).val(); });
	s_values.splice(2,1);

}

function resetMaxWins(){
	global_max_wins = parseInt($('#win_pct').text());
	global_net_wins = parseInt($('#win_pct').text()) - parseInt($('#lose_pct').text());
}

function initOptim() {
	//Function for resetting everything. Run before doing anything new.
	resetMaxWins();
	newHeroSkills();
}

function changeSkill(x, i) {
	//Function for changing the skill via jquery (since messing with the challenger values directly seems to backfire pretty badly). Arguments: x is a string representing the skill we want to change.
	//Takes "weapon", "a", "b", "special". 
	//Returns an int representing the number of wins this skill gets.
	$('#challenger_' + x).val(window[x + '_values'][i]); //
	$('#challenger_' + x).trigger('change');
	return parseInt($('#win_pct').text()); 
}

function iterateSkill(x, verbose) {
	newHeroSkills(); //Rewipe stuff in case we switched heroes recently.
	//Function for iterating over a set skill with all other skills kept constant. X is a string representing skill we want to change. Will return a number denoting max wins. 
	var x_length = window[x + '_values'].length; //Set the length of the array we want to iterate over.
	var local_max_wins = 0; //Set local max wins to 0.
	var local_min_losses = 0;
	var optimal_i = -1;
	var tied_skills = [""];
	var true_tied_skills = [""]
	var old_skill_name = "";
	jQuery.fx.off = true; //Yeah, we don't want those animations around for now.
	
	//For loop that iterates over skill_values. We ignore the first entry since it's undefined.
	for (i=1; i<x_length; i++) {
		var current_wins = changeSkill(x,i);
		var current_losses = parseInt($('#lose_pct').text());
		//If the new skill yields more wins than the old max winrate, update the local_max_wins variable, record the index. Reset the tied skills variable (since nothing else is tied now)
		if (current_wins>local_max_wins) {
			local_max_wins = parseInt($('#win_pct').text()); //
			local_min_losses = parseInt($('#lose_pct').text());
			optimal_i = i;
			tied_skills = ["These skills got about as many wins (+-1), but also had more losses: "];
			true_tied_skills = ["These skills were pretty much tied (+-1) in wins and losses: "];
			old_skill_name = data.skills[$('#challenger_' + x).val()].name;
		} //Otherwise if the current wins are within 1 kill, declare a tie.
		else if (Math.abs(current_wins - local_max_wins) < 2) {
			//If there are less losses, we have a new optimal_i
			if (current_losses < local_min_losses && current_wins == local_max_wins) {
				local_min_losses = current_losses;
				optimal_i = i;
				tied_skills.push(old_skill_name);
				old_skill_name = data.skills[$('#challenger_' + x).val()].name;

			}
		 	//In the case of a true tie, push to the true tie array. 
			else if (current_losses == local_min_losses) {
				true_tied_skills.push(data.skills[$('#challenger_' + x).val()].name);
			}
			//Otherwise, push to the lesser ties array. 
			else {
				tied_skills.push(data.skills[$('#challenger_' + x).val()].name);
			}
		}
	}
	//After iterating through the possible values, we change global max wins to our local max wins, and set the current skill to the optimal skill.
	jQuery.fx.off = false; //Turn on animation again.
	global_max_wins = changeSkill(x,optimal_i);

	//Reporting stuff.
	var best_skill_name = data.skills[$('#challenger_' + x).val()].name;


	if (tied_skills.length == 1 && true_tied_skills.length == 1) {
		tied_skills = ["No other skills tied " + best_skill_name + " for net amount of wins."];
	}
	else
	{
		tied_skills.push('.');
	}

	if (true_tied_skills.length == 1) {
		true_tied_skills = [""]
	}
	
	//The function is not verbose unless we tell it otherwise.
	if (verbose) {
		alert("Calculations complete.\nOptimal " + x + " skill was found to be " + best_skill_name + " with " + global_max_wins + " wins overall." + "\n" + tied_skills.join(' ') + "\n" + true_tied_skills.join(' '));
	}
}


$(document).ready(function(){
	initOptim();
	alert("Click the pictures to the left of the skills in order to find the optimal skill for your current skill set.")
	$("#challenger_weapon_picture").click(function() {iterateSkill("weapon", true);});
	$("#challenger_special_picture").click(function() {iterateSkill("special", true);});
	$("#challenger_a_picture").click(function() {iterateSkill("a", true);});
	$("#challenger_b_picture").click(function() {iterateSkill("b", true);});
	$("#challenger_c_picture").click(function() {iterateSkill("c", true);});
	$("#challenger_s_picture").click(function() {iterateSkill("s", true);});
})

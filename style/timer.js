document.getElementById("btn-timer-new").addEventListener("click",function(){
	const countdownDiv = document.getElementById("countdownDiv");
	const templatecountdown = document.getElementById("template-countdown");
	countdownDiv.appendChild(templatecountdown.content.cloneNode(true));

	const countdown = document.getElementById("new-countdown");
	countdown.id = "";

	countdown.dataset.state = "inactive";
	const timer = countdown.getElementsByClassName("timer")[0];
	const btn = countdown.getElementsByClassName("btn-timer-multiuse")[0];
	const reset = countdown.getElementsByClassName("btn-timer-reset")[0];
    const destroy = countdown.getElementsByClassName("btn-timer-close")[0];

	btn.addEventListener("click", function() {
		if (countdown.dataset.state == "inactive") {
			const minutes = countdown.getElementsByClassName("timer-min")[0].value;
			const seconds = countdown.getElementsByClassName("timer-sec")[0].value;

			timer.children[0].remove();
			const templatetimer = document.getElementById("template-timer-active");
			timer.appendChild(templatetimer.content.cloneNode(true));

			const offset = Number(minutes)* 60 * 1000 + Number(seconds) * 1000;
			const deadline = new Date(Date.parse(new Date()) + offset);

			countdown.dataset.deadline = deadline;
			countdown.dataset.offset = offset;
			countdown.dataset.state = "active";

			btn.innerText = "Pause";
			run_clock(countdown, deadline);
		}
		else if (countdown.dataset.state == "active") {
			btn.innerText = "Resume";

			// stop the clock
			clearInterval(Number(countdown.dataset.interval));

			// preserve remaining time
			countdown.dataset.time_left = time_remaining(countdown.dataset.deadline).total;
			countdown.dataset.state = "paused";
		}
		else {
			btn.innerText = "Pause";

			// update the deadline to preserve the amount of time remaining
			deadline = new Date(Date.parse(new Date()) + Number(countdown.dataset.time_left));

			// start the clock
			run_clock(countdown, deadline);

			countdown.dataset.state = "active";
		}
	})

	reset.addEventListener("click", function(){
		clearInterval(Number(countdown.dataset.interval));
		
		const offset = Number(countdown.dataset.offset)
		const deadline = new Date(Date.parse(new Date()) + offset);
		countdown.dataset.deadline = deadline;
		countdown.dataset.state = "active";

		countdown.classList.remove("countdown-done");
		btn.innerText = "Pause";
		run_clock(countdown, deadline);	
	})

    destroy.addEventListener("click", function(){
        countdown.remove();
    })

	timer.addEventListener("click", function(){
		if (timer.children[0].classList.contains("timer-active")) {
			clearInterval(Number(countdown.dataset.interval));

			const minutes = countdown.getElementsByClassName("timer-min")[0].innerText;
			const seconds = countdown.getElementsByClassName("timer-sec")[0].innerText;

			timer.children[0].remove();

			const templatetimer = document.getElementById("template-timer-inactive");
			timer.appendChild(templatetimer.content.cloneNode(true));

			if (Number(minutes) < 10){
				countdown.getElementsByClassName("timer-min")[0].placeholder = "0" + minutes;
			}
			else {
				countdown.getElementsByClassName("timer-min")[0].placeholder = minutes;
			}

			if (Number(seconds) < 10){
				countdown.getElementsByClassName("timer-sec")[0].placeholder = "0" + seconds;
			}
			else {
				countdown.getElementsByClassName("timer-sec")[0].placeholder = seconds;
			}

			btn.innerText = "Start";
			countdown.dataset.state = "inactive";
		}
	})
	
})

function time_remaining(endtime){
		var t = Date.parse(endtime) - Date.parse(new Date());
		var seconds = Math.floor( (t/1000) % 60 );
		var minutes = Math.floor( (t/1000/60));
		var hours = Math.floor( (t/(1000*60*60)) % 24 );
		var days = Math.floor( t/(1000*60*60*24) );
		return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
}

function run_clock(countdown, endtime){
		function update_clock(){
			const t = time_remaining(endtime);
			const minutes = countdown.getElementsByClassName("timer-min")[0];
			const seconds = countdown.getElementsByClassName("timer-sec")[0];
			
			if (t.total < 0){
				clearInterval(Number(countdown.dataset.interval));
				countdown.classList.add("countdown-done");
			}
			else if (t.total == 0){
				countdown.classList.add("countdown-done");
				minutes.innerText = 0;
				seconds.innerText = 0;
			}
			else {
				minutes.innerText = t.minutes;
				seconds.innerText = t.seconds;
			}
		}
		update_clock(); // run function once at first to avoid delay
		countdown.dataset.interval = setInterval(update_clock,1000);
}
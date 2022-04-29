//raise a modal for errors
function raiseModal(error){
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'))
    //error: total minutes is not divisible by number of speakers
    if (error == "divide"){
        document.getElementById("errorText").innerText = "The total time isn't divisible by the number of speakers";
    }
    //error: fields are empty
    else if (error == "empty"){
        document.getElementById("errorText").innerText = "Please don't leave any fields blank";
    }
    //error: a delegate has not been selected
    else if (error = "noDelegate"){
        document.getElementById("errorText").innerText = "Please Select a Delegate";
    }

    errorModal.toggle()
}

//input: Number of delegates desired
//output: list of delegates of length num
function genDelegates(num){
    const emotions = ["Happy", "Sad", "Excited", "Scared", "Angry", "Shy", "Silly", 
                    "Bored", "Tired", "Calm", "Dissapointed", "Suprised", "Jealous",
                    "Proud", "Disgusted"]
    const fruits = ["Apple", "Grape", "Banana", "Orange", "Pineapple", "Mango", "Pear", 
                    "Watermelon", "Lemon", "Lime", "Peach", "Kiwi", "Plum", "Cherry", 
                    "Strawberry", "Blueberry"]
    const names = []
    for (let i = 0; i < num; i++)
    {
        const emotion = emotions[Math.round((emotions.length - 1) * Math.random())]
        const fruit = fruits[Math.round((fruits.length - 1) * Math.random())]
        names.push(emotion + " " + fruit)
    }
    return names;
}

//input: The list of all delegates in comittee
//output: creates an attendence sheet on the delegates tab
function nameDelegates(nameList){
    //creates delegate list div to store delegates in
    const delList = document.createElement("div")
    delList.id = "delegateList";
    delList.classList.add("col-6")

    //finds Number of delegates and iterates through them
    listSize = nameList.length
    for (let i = 0; i < listSize; i++){
        //gets current name from the name list and creates div
        const name = nameList[i];

        const delegateName = document.createElement("p");
        delegateName.style = 'display:inline; margin: auto;';
        delegateName.classList.add("absent");      
        
        const nametext = document.createTextNode(name);
        delegateName.appendChild(nametext);

        //creates present button
        const present = document.createElement("input");
        present.type = "button";
        present.id = "present" + name;
        present.value = "Present";
        present.classList.add("btn");
        present.classList.add("btn-primary");

        //update page on marking delegate present
        present.addEventListener("click", function(event){
            event.preventDefault();
            //remove all current classes on delegate and mark present
            delegateName.classList.add("present");
            delegateName.classList.remove("voting");
            delegateName.classList.remove("absent");

            //update button group to mark present
            btngroup.children[1].classList.remove("active");
            btngroup.children[2].classList.remove("active");
            btngroup.children[0].classList.add("active");

            //update page
            updateDelegates();
        })

        //creates present button
        const voting = document.createElement("input");
        voting.type = "button";
        voting.id = "voting" + name;
        voting.value = "Present and Voting";
        voting.classList.add("btn");
        voting.classList.add("btn-primary");

        //update page on marking delegate present and voting
        voting.addEventListener("click", function(event){
            event.preventDefault();

            //remove all current classes on delegate and mark present and voting
            delegateName.classList.add("present");
            delegateName.classList.add("voting");
            delegateName.classList.remove("absent");

            //update button group to mark present and voting
            btngroup.children[0].classList.remove("active");
            btngroup.children[2].classList.remove("active");
            btngroup.children[1].classList.add("active");

            //update page
            updateDelegates();

        })

        //create absent button
        const absent = document.createElement("input");
        absent.type = "button";
        absent.id = "absent" + name;
        absent.value = "Absent";
        absent.classList.add("btn");
        absent.classList.add("btn-primary");

        //update page on marking delegate present and voting
        absent.addEventListener("click", function(event){
            event.preventDefault();
            
            //remove all current classes and mark absent
            delegateName.classList.remove("present");
            delegateName.classList.remove("voting");
            delegateName.classList.add("absent");
            
            //update button group to mark absent
            btngroup.children[0].classList.remove("active");
            btngroup.children[1].classList.remove("active");
            btngroup.children[2].classList.add("active");

            //update page            
            updateDelegates();
        })

        //create the button group div and store buttons inside
        const btngroup = document.createElement("div");
        btngroup.appendChild(present);
        btngroup.appendChild(voting);
        btngroup.appendChild(absent);

        btngroup.classList.add("btn-group")
        btngroup.classList.add("btn-group-toggle")
        btngroup.children[2].classList.add("active");
        
        //create delegate div and store name and button inside
        const newDelegate = document.createElement("div");
        newDelegate.classList.add(name.replace(/ /g,"_"));
        newDelegate.appendChild(delegateName);
        newDelegate.appendChild(btngroup);

        //mark bootstrap grid classes
        newDelegate.classList.add("row");
        btngroup.classList.add("col-6")
        delegateName.classList.add("col-6");

        //add delegate to delegate list
        delList.appendChild(newDelegate);
    }

    //store delegate list on delegates tab
    delegatesDiv = document.getElementById("delegates");
    delegatesDiv.appendChild(delList);
}

//input: Number of present delegates
//output: calculated majorities on delegates tab
function countDelegates(presentCount){
    const counttext = "There are " + presentCount + " Delegates";
    const simpletext = "A Simple Majority requires " + Math.round(presentCount * 1/2) + " Delegates";
    const thirdstext = "A 2/3 Majority requires " + Math.round(presentCount * 2/3) + " Delegates";

    if (!document.getElementById("delegateCount")) {
        const delCount = document.createElement("div");
        delCount.id = "delegateCount";

        const count = document.createElement("p");
        count.id = "totalCount";
        count.appendChild(document.createTextNode(counttext));

        const simple = document.createElement("p");
        simple.id = "simpleMajority";
        simple.appendChild(document.createTextNode(simpletext));

        const thirds = document.createElement("p");
        thirds.id = "twoThirds";
        thirds.appendChild(document.createTextNode(thirdstext));

        delCount.append(count);
        delCount.append(simple);
        delCount.append(thirds);
        delCount.classList.add("col")

        delegatesDiv = document.getElementById("delegates");
        delegatesDiv.appendChild(delCount);
    }
    else{
        const count = document.getElementById("totalCount");
        count.innerText = counttext;

        const simple = document.getElementById("simpleMajority");
        simple.innerText = simpletext;

        const thirds = document.getElementById("twoThirds");
        thirds.innerText = thirdstext;
    }
}

//input: minutes, speaking time
//output: total Number of speakers
function calcSpeakers(minutes, speakingTime){
    const seconds = minutes * 60;
    
    if (seconds % speakingTime == 0){
        return speakers = Math.round(seconds / speakingTime);
    }
    else {
        return 0;
    }   
}

//input: the total Number of minute the unmod lasts
//input: the speaking time for each speech
//output: speaker's list on the speakers tab
function genSpeakersList(minutes, speakingTime){
    //calculate number of speakers and return error if not divisible
    let speakers = calcSpeakers(minutes, speakingTime);
    if (speakers == 0){
        raiseModal("divide");
        return;
    }

    //remove speakers list if one is already open
    clearSpeakers()

    const speakerList = document.createElement("div");
    speakerList.id = "speakerList";

    //for speaker in list, generate div
    for (let i = 0; i < speakers; i++){
        speakerList.appendChild(createSpeaker("Speaker " + (i + 1)));
    }

    //place speakers into correct div
    speakersdiv = document.getElementById("speakers");
    speakersdiv.appendChild(speakerList);
}

//input: Number of speakers
//output: list of for and against speakers on speakers tab
function genForAgainstList(speakers){
    //remove speakers list if one is already open
    clearForAgainst()

    //create speakers list div
    const speakerList = document.createElement("div");
    speakerList.id = "forAgainstList";

    //add speakers, alternating between for an against
    for (let i = 0; i < (speakers * 2); i++){
        if (i % 2 == 0){
            speakerList.appendChild(createSpeaker("Speaker For " + ((i / 2) + 1)));
        }
        else {
            speakerList.appendChild(createSpeaker("Speaker Against " + (((i - 1)/2) + 1)));
        }
    }
    speakersdiv = document.getElementById("foragainst");
    speakersdiv.appendChild(speakerList);
}

//input: text for speaker
//output: a speaker div
function createSpeaker(text){
    const speakerNum = document.createElement("span");
    speakerNum.classList.add("input-group-text");
    speakerNum.classList.add("col-2");
    speakerNum.style = "justify-content: center;";
    
    const speakerName = document.createTextNode(text);
    speakerNum.appendChild(speakerName);

    const name = document.createElement("select");
    name.classList.add("delegateName");
    name.classList.add("form-select");

    const noDelegate = document.createElement("option");
    noDelegate.value = "noDelegate";
    noDelegate.innerText= "No Delegates";

    name.appendChild(noDelegate);

    const done = document.createElement("input");
    done.type = "button";
    done.value = "Done!";
    done.classList.add("btn");
    done.classList.add("btn-outline-primary");
    done.classList.add("col-1");
    done.addEventListener("click", function(){
        if (done.classList.contains("btn-outline-primary")){
            done.classList.remove("btn-outline-primary");
            done.classList.add("btn-primary");
        }
        else {
            done.classList.remove("btn-primary");
            done.classList.add("btn-outline-primary");
        }
    })

    const speaker = document.createElement("div");
    speaker.id = text;
    speaker.classList.add("input-group");

    speaker.appendChild(speakerNum);
    speaker.appendChild(name);
    speaker.appendChild(done);

    return speaker;
}

//input: Name of vote, vote modifications
//output: a voting div
function createVote(text, mods){
    //create div for vote
    const div = document.createElement("div");
    div.classList.add("motion");
    div.classList.add("input-group");

    //attach name to vote div
    const name = document.createElement("span");
    name.classList.add("input-group-text");
    name.classList.add("col-3");
    name.innerText = text;
    div.appendChild(name);

    //add any modifications to div
    if (mods)
    {
        for (let i = 0; i < mods.length; i++){
            const modDiv = document.createElement("span");
            modDiv.innerText = mods[i];
            modDiv.classList.add("input-group-text");
    
            div.appendChild(modDiv);
        }
    }

    //pass button
    const pass = document.createElement("button");
    pass.classList.add("btn-outline-success");
    pass.classList.add("btn");
    pass.type = "button";
    pass.innerText = "Pass";
    pass.addEventListener("click", function(){
        fail.classList.add("btn-outline-danger");
        fail.classList.remove("btn-danger");
        pass.classList.remove("btn-outline-success");
        pass.classList.add("btn-success");
    })
    div.appendChild(pass);

    //fail button
    const fail = document.createElement("button");
    fail.classList.add("btn-outline-danger");
    fail.classList.add("btn");
    fail.type = "button";
    fail.innerText = "Fail";
    fail.addEventListener("click", function(){
        pass.classList.remove("btn-success");
        pass.classList.add("btn-outline-success");
        fail.classList.remove("btn-outline-danger");
        fail.classList.add("btn-danger");
    })
    div.appendChild(fail);

    //remove button
    const remove = document.createElement("button");
    remove.classList.add("btn-outline-dark");
    remove.classList.add("btn");
    remove.type = "button";
    remove.innerText = "Remove";
    remove.addEventListener("click", function(event){
        event.target.parentElement.remove();
    })
    div.appendChild(remove);    

    //return div
    return div;
}

//Inserts mods in most to least disruptive order
function insertMod(div){
    //grab speakers and minutes from motion div
    const speakers = Number(div.dataset.speakers);
    const minutes = Number(div.dataset.minutes);

    //raise error if speakers are not divisible
    if (speakers == 0){
        raiseModal("divide");
        return;
    }

    //check if mods list is empty
    const mods = document.getElementById("mods").children;
    if (mods[0]){
        //iterate through divs to place in correct order
        for (let i = 0; i < mods.length; i++)
        {
            if (speakers > Number(mods[i].dataset.speakers))
            {
                mods[i].before(div);
                return;
            }
            if (speakers == Number(mods[i].dataset.speakers))
            {
                if (minutes > Number(mods[i].dataset.minutes))
                {
                    mods[i].before(div);
                    return;
                }
            }
        }
        //place at bottom if least diruptive
        document.getElementById("mods").appendChild(div);
        return;
    }
    //add first mood if list is empty
    else {
        document.getElementById("mods").appendChild(div);
    }
}

//inserts unmods in most to least disruptive order
function insertUnmod(div){
    //grab minutes from speaker div
    const minutes = Number(div.dataset.minutes);

    //check if unmods list is empty
    const unmods = document.getElementById("unmods").children;
    if (unmods[0]){
        //iterate through divs to place in correct order
        for (let i = 0; i < unmods.length; i++)
        {
            if (minutes > Number(unmods[i].dataset.minutes))
            {
                unmods[i].before(div);
                return;
            }
        }
        //place at bottom if least diruptive
        document.getElementById("unmods").appendChild(div);
        return;
    }
    //add first mood if list is empty
    else {
        document.getElementById("unmods").appendChild(div);
    }
}

//generates a new motion from motion maker on motions tab
function addMotion(){
    //get selected motion and Delegate 
    const motion = document.getElementById("makeMotion").value;
    const delName = document.getElementById("motionDelegate").value;

    if (delName == "noDelegate" || delName == "chooseDelegate") {
        raiseModal("noDelegate")
        return;
    }

    //set modifications for a motion
    const arguments = {};
    const motionMods = document.getElementById("motionMods").children;
    if (motionMods.length > 0){
        for (let i = 0; i < motionMods.length; i++){
            arguments[motionMods[i].placeholder] = motionMods[i].value;
        }
    }
    const mods = [delName];
    
    let text;
    let motionid;
    
    if (motion == "voting"){
        text = "Enter Voting Procedure";
        
        maindiv = document.getElementById("voting");
    }
    else if (motion == "extend"){
        if (document.getElementById("extendMotion")){
            return;
        }
        else {
            motionid = "extendMotion"
            text = "Extend Previous Moderated Caucus";

            maindiv = document.getElementById("voting");
        }
    }
    else if (motion == "unmod"){
        text = "Unmoderated Caucus";
        
        if(arguments["Minutes"] == ""){
            raiseModal("empty");
            return;
        }

        mods.push(arguments["Minutes"] + " Minutes");

        maindiv = document.getElementById("unmods");
    }
    else if (motion == "strawpoll"){
        if (document.getElementById("strawPollMotion")){
            return;
        }
        else {
            motionid = "strawPollMotion"
            text = "Straw Poll";    

            maindiv = document.getElementById("specialMods");
        }
    }
    else if (motion == "roundrobin"){
        if (document.getElementById("roundrobinMotion")){
            return;
        }
        else {
            motionid = "roundrobinMotion"
            text = "Round Robin";
            maindiv = document.getElementById("specialMods");
        }
    }
    else if (motion == "mod"){
        text = "Moderated Caucus";

        if (arguments["Minutes"] == "" || arguments["Speaking Time"] == ""){
            raiseModal("empty");
            return;
        }

        mods.push(arguments["Minutes"] + " Minutes");
        mods.push(arguments["Speaking Time"] + " Seconds");
        mods.push(arguments["Topic"]);

        maindiv = document.getElementById("mods");
    }
    else if (motion == "other"){
        text = "Other";

        if (arguments["Description"] == ""){
            raiseModal("empty");
            return;
        }

        mods.push(arguments["Description"]);

        maindiv = document.getElementById("other");
    }

    //creates motion div
    const motiondiv = createVote(text, mods);

    //adds motion id if applicable
    if (motionid) {
        motiondiv.id = motionid;
    }

    //places in correct order depening on motion type
    if (motion == "unmod"){
        motiondiv.dataset.minutes = arguments["Minutes"];

        insertUnmod(motiondiv);
    }
    else if (motion == "mod"){
        motiondiv.dataset.speakers = calcSpeakers(arguments["Minutes"], arguments["Speaking Time"]);
        motiondiv.dataset.minutes = arguments["Minutes"];

        insertMod(motiondiv);   
    }
    else {
        maindiv.appendChild(motiondiv);
    }
}

//generates a new directive from div maker on directives tab
function addDir(){
    //creates a vote div for the directive
    const dirName = document.getElementById("dirName").value;
    document.getElementById("dirName").value = "";
    const dirdiv = createVote(dirName);

    //places vote in directives tab
    maindiv = document.getElementById("directiveslist");
    maindiv.appendChild(dirdiv);
}

//returns list of all delegates marked as present
function getDelegates(){
    //gets list of all elements with class "present"
    const presentList = document.getElementsByClassName("present");

    //for element in list, grabs name and adds to list
    const presentNames = [];
    for (let i = 0; i < presentList.length; i++)
    {
        presentNames.push(presentList[i].innerText);
    }
    return(presentNames);
}

//updates the entire page whenever a attendence changes
function updateDelegates(){
    const delList = getDelegates();
    countDelegates(delList.length);

    const delegateNames = document.getElementsByClassName("delegateName");
    for (let i = 0; i < delegateNames.length; i++)
    {
        const delegates = delegateNames[i];
        while (delegates.lastChild) {
            delegates.removeChild(delegates.lastChild);
        }

        if (delList.length == 0){
            const noDelegate = document.createElement("option");
            noDelegate.value = "noDelegate";
            noDelegate.innerText= "No Delegates";

            delegateNames[i].appendChild(noDelegate);
        }
        else{
            const chooseDelegate = document.createElement("option");
            chooseDelegate.value = "chooseDelegate"
            chooseDelegate.innerText = "Choose Delegate";
            delegateNames[i].appendChild(chooseDelegate);

            for (let j = 0; j < delList.length; j++){
                const delegate = document.createElement("option");
                const name = delList[j];
                delegate.value = name;
                delegate.innerText = name;
    
                delegateNames[i].appendChild(delegate);
            }
        }
    }
}

//adds functionality to countdowns
function makeCountdowns(){
	const countdowns = document.getElementsByClassName("countdown-inactive");
	for (let i = 0; i < countdowns.length; i++) {
		const countdown = countdowns[i];
		countdown.dataset.state = "inactive";
		const btn = countdown.getElementsByClassName("btn-timer-multiuse")[0];

		btn.addEventListener("click", function() {
			if (countdown.dataset.state == "inactive") {
				const minutes = countdown.getElementsByClassName("timer-minutes")[0].value;
				const seconds = countdown.getElementsByClassName("timer-seconds")[0].value;
				const timer = countdown.getElementsByClassName("timer-inactive")[0];

				timer.innerHTML = "<p class='timer-active'><span class='timer-min' class='h1 font-weight-bold'></span> Min <span class='timer-sec' class='h1 font-weight-bold'></span> sec</p>";
				timer.className = "timer-active";

				const offset = Number(minutes)*60*1000 + Number(seconds)*1000;
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
				clearInterval(timeinterval);

				// preserve remaining time
				time_left = time_remaining(countdown.dataset.deadline).total;
				countdown.dataset.state = "paused";
			}
			else {
				btn.innerText = "Pause";

				// update the deadline to preserve the amount of time remaining
				deadline = new Date(Date.parse(new Date()) + time_left);

				// start the clock
				run_clock(countdown, deadline);

				countdown.dataset.state = "active";
			}
		})

		const reset = countdown.getElementsByClassName("btn-timer-reset")[0];
		reset.addEventListener("click", function(){
			clearInterval(timeinterval);
			
			const offset = Number(countdown.dataset.offset)
			const deadline = new Date(Date.parse(new Date()) + offset);
			countdown.dataset.deadline = deadline;
			countdown.dataset.state = "active";

			btn.innerText = "Pause";
			run_clock(countdown, deadline);	
		})
	}

	function time_remaining(endtime){
		var t = Date.parse(endtime) - Date.parse(new Date());
		var seconds = Math.floor( (t/1000) % 60 );
		var minutes = Math.floor( (t/1000/60) % 60 );
		var hours = Math.floor( (t/(1000*60*60)) % 24 );
		var days = Math.floor( t/(1000*60*60*24) );
		return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
	}

	function run_clock(countdownDiv, endtime){
		function update_clock(){
			const t = time_remaining(endtime);
			const minutes = countdownDiv.getElementsByClassName("timer-min")[0];
			const seconds = countdownDiv.getElementsByClassName("timer-sec")[0];
			minutes.innerText = t.minutes;
			seconds.innerText = t.seconds;
			if(t.total<=0){ clearInterval(timeinterval); }
		}
		update_clock(); // run function once at first to avoid delay
		timeinterval = setInterval(update_clock,1000);
	}
}


//add functionaility to various interactible elements
function buttonfunctions(){
    //Generate a Speaker's List for a moderated caucus
    document.getElementById("genspeakers").addEventListener("click", function(){
        minutesInput = parseFloat(document.getElementById("minutes").value);
        timeInput = parseFloat(document.getElementById("speakingTime").value);
        genSpeakersList(minutesInput,timeInput);
        updateDelegates();
    })

    //Refresh Speaker's List
    document.getElementById("refreshspeakers").addEventListener("click", clearSpeakers);

    //Generate For Against  List 
    document.getElementById("genforagainst").addEventListener("click", function(){
        speakersInput = parseFloat(document.getElementById("foragainstspeakers").value);
        genForAgainstList(speakersInput);
        updateDelegates();
    })

    //Refresh Speakers Globally
    document.getElementById("refreshforagainst").addEventListener("click", clearForAgainst);

    //Make a New Motion Div
    document.getElementById("makeMotion").addEventListener("change", function(event){
        const motion = event.target.value

        if (motion == "choose"){
            if (document.getElementById("motionDefine")){
                document.getElementById("motionDefine").remove()
            }
        }
        else {
            if (!document.getElementById("motionDefine")){
                const span = document.createElement("span");
                span.id = "motionName";
                span.classList.add("input-group-text");
                span.innerText = "Enter Voting Procdure";

                const motionMods = document.createElement("div");
                motionMods.id = "motionMods";
                motionMods.classList.add("input-group-text");

                const button = document.createElement("button");
                button.id = "addMotion"
                button.classList.add("btn");
                button.classList.add("btn-primary");
                button.type = "button";
                button.innerText = "Add Motion";
                button.addEventListener("click", addMotion)

                const motionDefine = document.createElement("div");
                motionDefine.id = "motionDefine";
                motionDefine.classList.add("input-group");
                motionDefine.style = "justify-content: center; padding: 20px 10px;";

                motionDefine.appendChild(span);
                motionDefine.appendChild(motionMods);
                motionDefine.appendChild(button);

                const motionMaker = document.getElementById("motionMaker");
                motionMaker.appendChild(motionDefine);
            }

            const modifications = document.getElementById("motionMods");
            while (modifications.lastChild) {
                modifications.removeChild(modifications.lastChild);
            }

            if (motion == "voting"){
                document.getElementById("motionName").innerText = "Enter Voting Procedure";
                document.getElementById("motionMods").classList.add("input-group-text");
    
                const speakers = document.createElement("input")
                speakers.id = "votingSpeakers";
                speakers.type = "text";
                speakers.class = "form-control";
                speakers.placeholder = "Speakers For/Against";
    
                const speakingTime = document.createElement("input")
                speakingTime.id = "modTime";
                speakingTime.type = "text";
                speakingTime.class = "form-control";
                speakingTime.placeholder = "Speaking Time";
    
                modifications.appendChild(speakers);
                modifications.appendChild(speakingTime)
            }
            else if (motion == "extend"){
                document.getElementById("motionName").innerText = "Extend Previous Moderated Caucus";
                document.getElementById("motionMods").classList.remove("input-group-text");
            }
            else if (motion == "unmod"){
                document.getElementById("motionName").innerText = "Unmoderated Caucus";
                document.getElementById("motionMods").classList.add("input-group-text");
    
                const minutes = document.createElement("input")
                minutes.id = "unmodMinutes";
                minutes.class = "form-control"
                minutes.type = "text";
                minutes.placeholder = "Minutes";
        
                modifications.appendChild(minutes);
            }
            else if (motion == "strawpoll"){
                document.getElementById("motionName").innerText = "Straw Poll";
                document.getElementById("motionMods").classList.remove("input-group-text");
            }
            else if (motion == "roundrobin"){
                document.getElementById("motionName").innerText = "Round Robin";
                document.getElementById("motionMods").classList.remove("input-group-text");
            }
            else if (motion == "mod"){
                document.getElementById("motionName").innerText = "Moderated Caucus";
                document.getElementById("motionMods").classList.add("input-group-text");
    
                const minutes = document.createElement("input")
                minutes.innerHTML = "id"
                minutes.id = "modMinutes";
                minutes.type = "text";
                minutes.class = "form-control";
                minutes.placeholder = "Minutes";
        
                const speakingTime = document.createElement("input")
                speakingTime.id = "modTime";
                speakingTime.type = "text";
                speakingTime.class = "form-control";
                speakingTime.placeholder = "Speaking Time";
        
                const topic = document.createElement("input")
                topic.id = "modTopic";
                topic.class = "form-control";
                topic.type = "text";
                topic.placeholder = "Topic";
        
                modifications.appendChild(minutes);
                modifications.appendChild(speakingTime);
                modifications.appendChild(topic);
            }
            else if (motion == "other"){
                document.getElementById("motionName").innerText = "Other";
                document.getElementById("motionMods").classList.add("input-group-text");
    
                const desc = document.createElement("input")
                desc.id = "desc";
                desc.class = "form-control"
                desc.type = "text";
                desc.placeholder = "Description";
        
                modifications.appendChild(desc);
            }
        }        
    })

    //Make a New Directive Div
    document.getElementById("makeDir").addEventListener("click", addDir)
}

//clear delegates tab
function clearDelegates() {
    if (document.getElementById("delegateList")){
        document.getElementById("delegateList").remove()
    }
    if (document.getElementById("delegateCount")){
        document.getElementById("delegateCount").remove()
    }
}

//clear motions tab
function clearMotions() {
    const motionssections = document.getElementById("motions").children;
    for (let i = 0; i < motionssections.length; i++) {
        const motions = motionssections[i].children
        while (motions.length) {motions[0].remove()}
    }
}

//clear speakers tab
function clearSpeakers(){
    document.getElementById("minutes").value = null;
    document.getElementById("speakingTime").value = null;
    
    if (document.getElementById("speakerList")){
        document.getElementById("speakerList").remove()
    }
}

//clear speakers tab
function clearForAgainst(){
    if (document.getElementById("forAgainstList")){
        document.getElementById("forAgainstList").remove()
    }
}

//clear directives tab
function clearDirectives(){
    const dirs = document.getElementById("directiveslist").children
    while (dirs.length) {dirs[0].remove()}
}

//clears page
function clearAll(){
    clearDelegates();
    clearMotions();
    clearSpeakers();
    clearDirectives();
}

//main function
function initialize(dellist) {
    clearAll()
    document.getElementById("pills").style.display = "flex";
    nameDelegates(dellist);
    buttonfunctions();  
    makeCountdowns();
}

//Run AutoChair with generated delegates
function test(){
    initialize(genDelegates(15));
}

//Run AutoChair for Tonga Comittee
function tonga(){
    const names = ["Afu'alo Matoto",
    "Baron Fielakepa of Havelu",
    "Clive Edwards",
    "Etuate Lavulavu",
    "Fineasi Funaki",
    "Havea Hikule'o 'oPulotu",
    "Isileli Pulu",
    "Lisiate 'Aloveita 'Akolo",
    "Nikotimasi Fatafehi Laufilitonga Kakau Vaha'i",
    "Paul Karalus",
    "Samiu Vaipulu",
    "Samiuela 'Akilisi P\u014Diva",
    "Siale 'Ataongo Kaho",
    "Sione Feingatau 'Iloa",
    "Sione Teisina Fuko",
    "Siosa'ia Ma'ulupekotofa Tuita",
    "Siosa'ia Lausi'i",
    "Sunia Fili",
    "Tevita Hala Palefau",
    "Tu'ipelehake Viliami Tupoulahi Mailefihi Tuku'aho",
    "Uliti Uata",
    "Viliami Ta'u Tangi",
    "Viliami Veasi'i Veikune"];
    initialize(names);
}

function elliot(){
    const names =["Maria Theresa",
    "Hugues de Lionne",
    "Marin Marais",
    "Fran\u00E7ois Michel Le Tellier",
    "Henriette-Marie",
    "Jacques-Benigne Bossuet",
    "Henri de la Tour D'auvergne",
    "S\u00E9bastien Le Prestre de Vauban",
    "Nicolas Fouquet",
    "Jean Racine",
    "Louis Le Vau",
    "Anne of Austria",
    "Pierre Corneille",
    "Jean-Baptiste Lully",
    "Charles le Brun",
    "Jean-Baptiste Poquelin",
    "Jean-Baptiste Colbert",
    "Philipe I",
    "Louis II de Bourbon",
    "Fran\u00E7oise d'Aubign\u00E9",
    "Andre Charles Boulle",
    "Marie Louise d'Orl\u00E9ans",
    "Philippe",
    "Henri de Guenegaud",
    "Jocelin of Wells"]
    initialize(names);
}

test();
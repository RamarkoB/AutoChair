//input: number of delegates desired
//output: list of delegates of length num
function genDelegateList(num){
    const emotions = ["Happy", "Sad", "Excited", "Scared", "Angry", "Shy", "Silly", 
                    "Bored", "Tired", "Calm", "Dissapointed", "Suprised", "Jealous",
                    "Proud", "Disgusted"]
    const fruits = ["Apple", "Grape", "Banana", "Orange", "Pineapple", "Mango", "Pear", 
                    "Watermelon", "Lemon", "Lime", "Peach", "Kiwi", "Plum", "Cherry", 
                    "Strawberry", "Blueberry"]
    const names = []
    for (var i = 0; i < num; i++)
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
    delList.id = "delegatelist";
    delList.classList.add("col-6")

    //finds number of delegates and iterates through them
    listSize = nameList.length
    for (var i = 0; i < listSize; i++){
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

//input: number of present delegates
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

//input: the total number of minute the unmod lasts
//input: the speaking time for each speech
//output: produces a speaker's list on the speakers tab
function genSpeakersList(minutes, speakingTime){
    if (document.getElementById("speakerList")){
        document.getElementById("speakerList").remove()
    }

    const seconds = minutes * 60;
    const speakers = Math.round(seconds / speakingTime);

    const speakerList = document.createElement("div");
    speakerList.id = "speakerList";

    for(var i = 0; i < speakers; i++){
        const speakerNum = document.createElement("span");
        speakerNum.classList.add("input-group-text");
        speakerNum.classList.add("col-1");
        speakerNum.style = "justify-content: center;";
        
        const speakerNumText = document.createTextNode("Speaker " + (i + 1));
        speakerNum.appendChild(speakerNumText);

        const name = document.createElement("select");
        name.classList.add("delegateName");
        name.classList.add("form-select");
        //name.classList.add("col-8");

        const noDelegate = document.createElement("option");
        noDelegate.value = "noDelegate";
        noDelegate.innerText= "No Delegates";
    
        name.appendChild(noDelegate);

        const done = document.createElement("input");
        done.type = "button";
        done.value = "Add to List";
        done.classList.add("btn");
        done.classList.add("btn-primary");
        done.classList.add("col-1");

        const speaker = document.createElement("div");
        speaker.id = ("speaker_" + (i + 1))
        speaker.classList.add("input-group");
        //speaker.classList.add("row");

        speaker.appendChild(speakerNum);
        speaker.appendChild(name);
        speaker.appendChild(done);

        speakerList.appendChild(speaker);
    }
    speakersdiv = document.getElementById("speakers");
    speakersdiv.appendChild(speakerList);
}

function genForAgainstList(speakers, speakingTime){
    if (document.getElementById("speakerList")){
        document.getElementById("speakerList").remove()
    } 

    const speakerList = document.createElement("div");
    speakerList.id = "speakerList";

    for(var i = 0; i < (speakers * 2); i++){
        const speaker = document.createElement("div");

        const name = document.createElement("select");
        name.classList.add("delegateName");

        const noDelegate = document.createElement("option");
        noDelegate.value = "noDelegate";
        noDelegate.innerText= "No Delegates";
    
        name.appendChild(noDelegate);

        const done = document.createElement("input");
        done.type = "button";
        done.value = "Add to List";
        done.classList.add("btn");
        done.classList.add("btn-primary");

        speaker.appendChild(name);
        speaker.appendChild(done);

        speakerList.appendChild(speaker);
    }
    speakersdiv = document.getElementById("speakers");
    speakersdiv.appendChild(speakerList);
}

function addMotion(motion, arguments){
    const motiondiv = document.createElement("div");
    const p = document.createElement("p");
    motiondiv.appendChild(p);

    var text = motion;
    for (var i = 0; i < arguments.length; i++){
        text = text + " " + arguments[i];
    }

    p.appendChild(document.createTextNode(text));
    
    if (motion == "voting"){
        maindiv = document.getElementById("voting");
        maindiv.appendChild(motiondiv);
    }
    else if (motion == "extend"){
        maindiv = document.getElementById("voting");
        maindiv.appendChild(motiondiv);
    }
    else if (motion == "unmod"){
        maindiv = document.getElementById("unmods");
        maindiv.appendChild(motiondiv);
    }
    else if (motion == "strawpoll"){
        maindiv = document.getElementById("specialMods");
        maindiv.appendChild(motiondiv);
    }
    else if (motion == "roundrobin"){
        maindiv = document.getElementById("specialMods");
        maindiv.appendChild(motiondiv);
    }
    else if (motion == "mod"){
        maindiv = document.getElementById("mods");
        maindiv.appendChild(motiondiv);
    }
    else if (motion == "other"){
        maindiv = document.getElementById("mods");
        maindiv.appendChild(motiondiv);
    }
}

//finds the list of all delegates marked as present
function getDelegates(){
    //gets list of all elements with class "present"
    const presentList = document.getElementsByClassName("present");

    //for element in list, grabs name and adds to list
    const presentNames = [];
    for (var i = 0; i < presentList.length; i++)
    {
        presentNames.push(presentList[i].innerText);
    }
    return(presentNames);
}

//updates the entire page whenever a delegate is added or removed from attendence
function updateDelegates(){
    const delList = getDelegates();
    countDelegates(delList.length);

    const delegateNames = document.getElementsByClassName("delegateName");
    for (var i = 0; i < delegateNames.length; i++)
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
            for (var j = 0; j < delList.length; j++){
                const delegate = document.createElement("option");
                const name = delList[j];
                delegate.value = name.replace(" ","_");
                delegate.innerText = name;
    
                delegateNames[i].appendChild(delegate);
            }
        }
    }
}

//add functionaility to various interactible elements
function buttonfunctions(){
    document.getElementById("genspeakers").addEventListener("click", function(){
        minutesInput = parseFloat(document.getElementById("minutes").value);
        timeInput = parseFloat(document.getElementById("speakingTime").value);
        genSpeakersList(minutesInput,timeInput);
        updateDelegates();
    })

    document.getElementById("refreshspeakers").addEventListener("click", function(){
        const minutes = document.getElementById("minutes");
        const speakingTime = document.getElementById("speakingTime");
        minutes.value = null;
        speakingTime.value = null;
        speakerList = document.getElementById("speakerList")
        if (speakerList){
            speakerList.remove()
        }
    });

    document.getElementById("motionChosen").addEventListener("change", function(event){
        motion = event.target.value
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
    })

    document.getElementById("addMotion").addEventListener("click", function(){
        const motion = document.getElementById("motionChosen");
        const arguments = [];
        const motionMods = document.getElementById("motionMods").children;
        if (motionMods.length > 0){
            for (var i = 0; i < motionMods.length; i++){
                arguments.push(motionMods[i].value);
            }
        }
        addMotion(motion.value, arguments);
    })
}

function tongaNames() {
    return(
        ["Feleti Vaka'uta Sevele",
            "Siale 'Ataongo Kaho",
            "Samiuela 'Akilisi P\u014Diva",
            "Sonatane Tu'akinamolahi Taumopeau Tupou",
            "Clive Edwards",
            "Malakai Fakatoufifita",
            "Viliami Ta'u Tangi",
            "'Etuate Lavulavu",
            "Tu'ipelehake Viliami Tupoulahi Mailefihi Tuku'aho",
            "Baron Fielakepa of Havelu",
            "'Isileli Pulu",
            "Afu'alo Matoto",
            "Paul Karalus",
            "Sione Laumanu'uli Luani",
            "Sione Teisina Fuko",
            "'Uliti Uata",
            "Fineasi Funaki",
            "Lisiate 'Aloveita 'Akolo",
            "Sunia Fili",
            "Siosa'ia Ma'ulupekotofa Tuita",
            "Viliami Veasi'i Veikune",
            "Tevita Hala Palefau",
            "Siosa'ia Lausi'i",
            "Sione Feingatau 'Iloa",
            "Havea Hikule'o 'oPulotu",
            "Samiu Vaipulu",
            "Nikotimasi Fatafehi Laufilitonga Kakau Vaha'i"])
}

(function(){
    nameDelegates(genDelegateList(15));
    buttonfunctions();
})();
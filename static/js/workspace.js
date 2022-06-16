/* global helpers*/
let quizzes_list = document.querySelector(".quizzes-list");
let question_list = document.querySelector(".questions-list");
let dropdown_btn = document.querySelector(".edit-profile");

function addClass(element, new_class) {
    element.classList.add(new_class);
}

function removeClass(element, new_class) {
    element.classList.remove(new_class);
}

function xorClass(element, new_class) {
    if (element.classList.contains(new_class) == true) {
        removeClass(element, new_class);
    } else {
        addClass(element, new_class);
    }
}

function checkForExtraContent(container, shadowPlace) {
    if (container == null) return;
    if (container.offsetHeight + container.scrollTop >= container.scrollHeight - 30) {
        removeClass(document.querySelector(shadowPlace), "shadow-above");
    } else {
        addClass(document.querySelector(shadowPlace), "shadow-above");
    }
}

checkForExtraContent(quizzes_list, ".add-quiz");
checkForExtraContent(question_list, ".add-question");
document.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        document.execCommand('insertLineBreak');
        event.preventDefault();
    }
});

function createSection(name, new_class) {
    let ret = document.createElement(name);
    ret.className = new_class;
    return ret;
}

function addCollapsibleEvent(child) {
    child.addEventListener("click", function () {
        xorClass(this, "rotate");
        this.classList.toggle("active");
        var content = ((this.parentElement).parentElement).lastElementChild;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
        checkForExtraContent(question_list, ".add-question");
    });
    return child;
}

function createOption(Letter, correct, option) {
    let child1 = createSection("div", "option");
    let child2 = createSection("div", "letter plain-text");
    child2.addEventListener("click", function () {
        let content = this.parentElement;
        content = content.parentElement;
        NodeList.prototype.forEach = Array.prototype.forEach
        var children = content.childNodes;
        children.forEach(function (item) {
            if (item.nodeName.toLowerCase() == 'div') {
                item.childNodes[0].classList.remove("correct-answer");
            }
        });
        this.classList.add("correct-answer");
    });
    if (correct) {
        child2.className = "letter plain-text correct-answer";
    }
    child2.appendChild(document.createTextNode(Letter));
    let child3 = document.createElement("div");
    child3.className = "option-statement";
    child3.addEventListener("keypress", function () {
        let content = (this.parentElement).parentElement;
        content.style.maxHeight = "100%";
    });
    child3.contentEditable = "true";
    child3.appendChild(document.createTextNode(option));
    child1.appendChild(child2);
    child1.appendChild(child3);
    return child1;
}
function addDeleteQuizEvent(child){
  child.addEventListener("click",function(){
    this.classList.toggle("active");
    let content = (this.parentElement).parentElement;
    if (confirm("Are you sure you want to delete this quiz?")){
      content.parentNode.removeChild(content);
    }
  });
  return child;
}
function createQuestionElement(question_statement, option_1, option_2, option_3, option_4){
  let node = createSection("div", "question_1");
  let panel = createSection("div", "question-panel flex-center");
  let child1 = createSection("div", "question-statement");
  child1.contentEditable = "true";
  child1.appendChild(document.createTextNode(question_statement));
  panel.appendChild(child1);
  child1 = createSection("button", "icon delete-question");
  child1 = addDeleteEvent(child1);
  let child2 = createSection("i", "fa fa-trash");
  child1.appendChild(child2);
  panel.appendChild(child1);
  child1 = createSection("button", "icon expand-icon collapsible");
  child1 = addCollapsibleEvent(child1);
  child2 = createSection("i", "fa fa-angle-down");
  child1.appendChild(child2);
  panel.appendChild(child1);
  node.appendChild(panel);
  panel = createSection("div", "options-container");
  let options = [option_1, option_2, option_3, option_4];
  let chars = ["A", "B", "C", "D"];
  for (let i = 0; i < options.length; i++) {
      child1 = createOption(chars[i], (id == i), options[i]);
      panel.appendChild(child1);
  }
  node.appendChild(panel);
  return node;
}

function createQuestionElement(question_statement, option_1, option_2, option_3, option_4) {
    let node = createSection("div", "question_1");
    let panel = createSection("div", "question-panel flex-center");
    let child1 = createSection("div", "question-statement");
    child1.contentEditable = "true";
    child1.appendChild(document.createTextNode(question_statement));
    panel.appendChild(child1);
    child1 = createSection("button", "icon delete-question");
    child1 = addDeleteEvent(child1);
    let child2 = createSection("i", "fa fa-trash");
    child1.appendChild(child2);
    panel.appendChild(child1);
    child1 = createSection("button", "icon expand-icon collapsible");
    child1 = addCollapsibleEvent(child1);
    child2 = createSection("i", "fa fa-angle-down");
    child1.appendChild(child2);
    panel.appendChild(child1);
    node.appendChild(panel);
    panel = createSection("div", "options-container");
    let options = [option_1, option_2, option_3, option_4];
    let chars = ["A", "B", "C", "D"];
    for (let i = 0; i < options.length; i++) {
        child1 = createOption(chars[i], (id == i), options[i]);
        panel.appendChild(child1);
    }
    node.appendChild(panel);
    return node;
}

quizzes_list.addEventListener('scroll', function () {
    checkForExtraContent(quizzes_list, ".add-quiz");
});
if (question_list != null)
    question_list.addEventListener('scroll', function () {
        checkForExtraContent(question_list, ".add-question");
    });

function isNumber(char) {
    if (typeof char !== 'string') {
        return false;
    }

    if (char.trim() === '') {
        return false;
    }

    return !isNaN(char);
}
function QREvent(child){
    child.classList.toggle("active");
    let quiz = (child.parentElement).parentElement;
    quiz = (quiz.firstElementChild).firstElementChild;
    let qr = document.querySelector(".prompt3");
    qr.classList.add("prompt3--show");
    let quiz_link = quiz.href;
    let quiz_id = "";
    for (let i = quiz_link.length - 1; i >= 0; i--) {
        if (isNumber(quiz_link[i])) {
            quiz_id += quiz_link.charAt(i);
        } else break;
    }
    quiz_id = quiz_id.split("").reverse().join("");
    qr.querySelector(".prompt__text").textContent = "Quiz ID : " + quiz_id;

    var parametersJson = {
        "size": 300, // Size of Qr Code
        "backgroundColor": "19-80-93", // Background Color Of Qr Code (In RGB)
        "qrColor": "255-255-255", // Color of Qr Code (In RGB)
        "padding": 2, // Padding 
        "data": "dev.to"
    };

    var parameters;
    var img = document.querySelector(".prompt3 img");
    img.addEventListener("click", function () {
        window.location.href = "/quiz/" + quiz_id;
    })
    parametersJson.data = window.location.hostname + "/invited/" + quiz_id;
    parameters = `size=${parametersJson.size}&bgcolor=${parametersJson.backgroundColor}&color=${parametersJson.qrColor}&qzone=${parametersJson.padding}&data=${parametersJson.data}` // Stitch Together all Paramenters
    img.src = `https://api.qrserver.com/v1/create-qr-code/?${parameters}`;
    return child;
}

/* global helpers*/

dropdown_btn.addEventListener("click", function () {
    let menu = document.querySelector(".dropdown-menu");
    xorClass(menu, "show-menu");
});

function updateLisners(){
  let coll = document.getElementsByClassName("collapsible");
  for (let i = 0; i < coll.length; i++) {
    coll[i] = addCollapsibleEvent(coll[i]);
  }
  let delete_quiz = document.getElementsByClassName("delete-quiz");
  for (let i = 0; i<delete_quiz.length;i++){
      delete_quiz[i] = addDeleteQuizEvent(delete_quiz[i]);
  }
  let share_quiz = document.getElementsByClassName("share-quiz");
  for (let i=0;i<share_quiz.length;i++){
    share_quiz[i].addEventListener("click",function(){
      QREvent(this);
    });
  }
  let delete_question = document.getElementsByClassName("delete-question");
  for (let i = 0; i < delete_question.length; i++) {
      delete_question[i] = addDeleteEvent(delete_question[i])
  }
  let expan_icon = document.getElementsByClassName("expand-icon");
  for (let i = 0; i < expan_icon.length; i++) {  
      expan_icon[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let content = (this.parentElement).parentElement;
        content = content.lastElementChild;
        xorClass(content,"add-border");
      });
  }
  let editable_text = document.getElementsByClassName("option-statement");
  for (let i = 0; i < editable_text.length; i++) {
       editable_text[i].addEventListener("keydown", function() {
        let content = this.parentElement;
        content = content.parentElement;
        content.style.maxHeight = "100%";
      });
  }
  let options = document.getElementsByClassName("letter");
  for (let i = 0; i < options.length;i++){
    options[i].addEventListener('click',function(){
      let content = this.parentElement;
      content = content.parentElement;
      NodeList.prototype.forEach = Array.prototype.forEach
      var children = content.childNodes;
      children.forEach(function(item){
        if (item.nodeName.toLowerCase() == 'div'){
          item.childNodes[0].classList.remove("correct-answer");
        }
      });
      this.classList.add("correct-answer");
    });
  }
}

updateLisners();


let id = -1;
let showPrompt2 = (function () {

    let promptEl = document.querySelector('.prompt2'), _cb = null;

    let prompt = {
        el: promptEl,
        form: promptEl.querySelector('.prompt__form2'),
        text: promptEl.querySelector('.prompt__text'),
        input: promptEl.querySelectorAll('.prompt__input'),
        submit: promptEl.querySelector('.prompt__submit')
    }

    prompt.form.addEventListener('submit', hide, false);

    function show(text, cb) {
        prompt.el.classList.add('prompt2--show');
        prompt.text.innerHTML = text;
        _cb = cb;
    }

    function hide(e) {
        let ok = true;
        id = -1;
        for (let i = 0; i < prompt.input.length; i++) {
            let option = prompt.input[i].parentElement;
            option = option.parentElement;
            option = option.firstChild;
            if (prompt.input[i].value == "") {
                ok = false;
            }
            if (i > 0 && option.classList.contains("correct-answer") == true) {
                id = i - 1;
            }
        }
        e.preventDefault();
        if (ok == false) {
            alert("Please fill all required field");
        } else if (id == -1) {
            alert("Please check the correct answer by clicking on its letter")
        } else {
            prompt.el.classList.remove('prompt2--show');
            _cb.call(prompt, prompt.input[0].value, prompt.input[1].value, prompt.input[2].value, prompt.input[3].value, prompt.input[4].value);
            let inpu_vals = document.querySelectorAll(".prompt2 .input-field input");
            let options = document.querySelectorAll(".prompt2 .letter");
            for (let i = 0; i < inpu_vals.length; i++) {
                inpu_vals[i].value = "";
            }
            for (let i = 0; i < options.length; i++) {
                options[i].classList.remove("correct-answer");
            }
        }
    }

    return show;
})();

let showPrompt = (function () {

    let promptEl = document.querySelector('.prompt'),
        _cb = null;

    let prompt = {
        el: promptEl,
        form: promptEl.querySelector('.prompt__form'),
        text: promptEl.querySelector('.prompt__text'),
        input: promptEl.querySelector('.prompt__input'),
        submit: promptEl.querySelector('.prompt__submit')
    }

    prompt.form.addEventListener('submit', hide, false);

    function show(text, cb) {
        prompt.el.classList.add('prompt--show');
        prompt.text.innerHTML = text;
        _cb = cb;
    }

    function hide(e) {
        e.preventDefault();
        if (prompt.input.value == "") {
            alert("Please fill all required field");
        } else {
            prompt.el.classList.remove('prompt--show');
            _cb.call(prompt, prompt.input.value);
            let inpu_vals = document.querySelectorAll(".prompt .input-field input")
            for (let i = 0; i < inpu_vals.length; i++) {
                inpu_vals[i].value = "";
            }
        }
    }


    return show;

})();


let add_quiz = document.querySelector(".add-quiz");
add_quiz.addEventListener('click', function () {
    let quiz_name = "";
    showPrompt('You need to provide your quiz name to continue!', function (answer) {
        quiz_name = answer;
        if (quiz_name != "") {
            createNewQuiz(quiz_name);
        }
    });
})

document.querySelector(".prompt__cancel").addEventListener('click', function () {
    document.querySelector('.prompt').classList.remove('prompt--show');
});
document.querySelector(".prompt__cancel2").addEventListener('click', function () {
    document.querySelector('.prompt2').classList.remove('prompt2--show');
});

let add_question = document.querySelector(".add-question");
if (add_question != null)
    add_question.addEventListener('click', function () {
        showPrompt2('You need to provide information about the question to continue!', function (question_name, option_1, option_2, option_3, option_4) {
            if (question_name != "") {
                createNewQuestion(question_name, option_1, option_2, option_3, option_4);
            }
        });
    });

function get_id() {
    return fetch('/api/get_quizzes_from_user', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    }).then((response) => response.json())
        .then((responseData) => {
            // console.log(responseData);
            return responseData;
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function createNewQuiz(quiz_name) {
    fetch('/workspace', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            'quiz_name': quiz_name,
        })
    }).then(function (response) {
        get_id().then(function (response) {
            let node = createSection("div", "previous-quiz quiz-1");
            let child1 = document.createElement("div");
            let child2 = document.createElement("a");
            console.log(response);
            child2.href = "workspace?id=" + response['id'];
            // console.log("child2.href")
            // console.log(child2.href); // Promise
            // console.log("child2.href")
            child2.appendChild(document.createTextNode(quiz_name));
            child1.appendChild(child2);
            node.appendChild(child1);
            child1 = createSection("div", "icons-container");
            child2 = createSection("button", "share-quiz icon");
            child2.addEventListener("click", function () {
                QREvent(this);
            });
            let child3 = createSection("i", "fa fa-share");
            let child4;
            child2.append(child3);
            child1.append(child2);
            child3 = createSection("button", "delete-quiz icon");
            child3 = addDeleteQuizEvent(child3);
            child4 = createSection("i", "fa fa-trash");
            child3.appendChild(child4);
            child1.append(child3);
            node.append(child1);
            let quizzes = document.querySelector(".quizzes-list");
            // wait for the child2.href
            quizzes.insertBefore(node, add_quiz);
        });

    })
        .catch(function (error) {
            console.log(error);
        });

}


function createNewQuestion(question_statement, option_1, option_2, option_3, option_4) {
    fetch('/workspace', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            'question': question_statement,
            'option_A': option_1,
            'option_B': option_2,
            'option_C': option_3,
            'option_D': option_4,
            'right_option': id,
        })
    }).then(function (response) {
        if (response.ok) {
            response.json()
                .then(function (response) {
                    console.log(response);
                });
        } else {
            throw Error('Something went wrong');
        }
    })
        .catch(function (error) {
            console.log(error);
        });
    let questions_list = document.querySelector(".questions-list");
    let add_question = document.querySelector(".add-question");
    questions_list.insertBefore(createQuestionElement(question_statement, option_1, option_2, option_3, option_4), add_question);
}


let slider = document.querySelector(".switch input");
if (slider != null)
    slider.addEventListener("click", function () {
        xorClass((this.parentElement).lastElementChild, "slider-clicked");
        slider_state = document.querySelector(".slider").classList.contains('slider-clicked');
        fetch('/workspace', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                'state': slider_state,
            })
        });
    });


// document.querySelector('#go_to_previous_quiz:first-child').onclick = function(event) {
//   window.location.href = "/workspace?id={{quiz['id']}}";
// }


let exit_sharing = document.querySelector(".exit-icon");
exit_sharing.addEventListener("click", function () {
    this.classList.toggle("active");
    let quiz = (this.parentElement).parentElement;
    quiz = (quiz.firstElementChild).firstElementChild;
    let qr = document.querySelector(".prompt3");
    qr.classList.remove("prompt3--show");
});
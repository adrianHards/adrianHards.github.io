/* 

unresolved bugs/improvements:

1.  stop additional typing animations while current animation is ongoing; see: https://stackoverflow.com/questions/35928912/jquery-multiple-clicks-wait-until-user-stops-clicking
2.  have user select their name.
3.  have 'input-area' flash each time user submits a message (currently .flash reset is delayed by Timeout in AutoMessage() so doesn't execute on each submit event)

*/

// || variables ----------------------------------------------

// temporary HTML for 'typing' animation
const tempHTML = 
`
<div class="temp-message">
  <div class="message-bubble">
    <div class="message-info">
      <div class="message-info-username">Adrian</div>
    </div>

    <div class="message-text typing">typing</div>
  </div>
</div>
`;

// array of responses to be sent on submission of user message
let responses = [
    "Wow, that's, like, <b>totally</b> so interesting and unique 🙄, tell me more 😪",
    "Watch out! Behind you! 👻👻👻",
    "You're a <b>really</b> greater listener you know that? 😍",
    "Sometimes I feel like I'm just talking to a computer 🤡",
    "OK, I'm not actually typing when it says 'typing' 🤭",
    "The CSS code for the typing animation totally just came to me 🤥",
    "Sending multiple messages at once kinda breaks things 😭",
    "Thank God for StackOverflow amirite! 👀",
    "Is that even a sentence? 👎",
    "Did you notice the text bar <i>flashes</i> when you send? 😍 Just don't send too many at once ...",
    "Am I using too many emojis? I feel like I'm using too many emojis 💩",
    "It's kinda awkward when the same message keeps getting sent 😵‍💫",
    "I can't seem to get the notification sound to execute for my initial message 🤔"
];

// || functions ----------------------------------------------

// pick random response from array of responses
function RandomResponse() {
    let num = Math.floor(Math.random()*responses.length);
    return responses[num];
};

// time and date of when messages are sent and received:
function TimeStamp () {
    const now = new Date();

    const month = (now.getMonth()+1); // zero indexed so need +1
    const day = now.getDay() < 10 ? '0' + now.getDay() : now.getDay() // if value of now.getDay() is < 10 add a 0 in front of number else return now.getDay()
    const hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    const minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
  
    return day + '/' + month + ' ' + hours + ':' + minutes;
};

// auto scroll after messages are sent and received:
function PageScroll() {
    // select .chat-window from the DOM
    const window = document.querySelector(".chat-window");

    // scrolls the window to a particular place in the document
    window.scroll({   

        // specifies number of pixels along the Y axis to scroll the window or element
        top: 100000, 
        
        // specifies how scrolling should animate
        behavior: 'smooth'
    });
};

// HTML to be added to .chat-window as messages are sent and received
function AddMessage(username, align, text) {
    let messageHTML = 
    `
    <div class="message ${align}-message">
      <div class="message-bubble">
        <div class="message-info">
          <div class="message-info-username">${username}</div>
          <div class="message-info-timestamp">${TimeStamp()}</div>
        </div>
    
        <div class="message-text">${text}</div>
      </div>
    </div>
    `;
  
    $(".chat-window").append(messageHTML);
  
    PageScroll();
};

// add temporary HTML code to enable 'typing' animation before automated response is sent
function Typing() {
    $(".chat-window").append(tempHTML);
    PageScroll();
};

// generate automated response when user submits a message
function AutoMessage() {

    // enable 'flash' animation on user submitting a message
    const input = document.querySelector("input");
    let inputClasses = input.classList;
    inputClasses.add("flash");

    // select a random response
    let autoMessage = RandomResponse();

    // call Typing to enable 'typing' animation
    setTimeout(Typing, 2000);

    // delay automated response
    setTimeout(() => {

        // remove .flash so it can be re-added on next user message
        inputClasses.remove("flash");

        // remove .temp-message used for typing animation; to be replaced by automated message
        $("div").remove(".temp-message");

        // call AddMessage function and reply with automated message
        AddMessage("Adrian", "left", autoMessage);

        // play new message notification sound
        $("#notification-sound")[0].play();
      
        PageScroll();

      }, 4000); 
};

// || jQuery ----------------------------------------------

// execute after initial page load
$(document).ready(() => {
  
    setTimeout(Typing, 1500);
    
    setTimeout(() => {
        $("#notification-sound")[0].play(); // doesn't actually play sadly
        $("div").remove(".temp-message");
        AddMessage("Adrian", "left", "Phew! I finally finished my coding assignment 🥳. How's your day going?");
    }, 3000); 
});

// execute when user submits a message:
$('form').on('submit', event => {

    // prevent page refresh.
    event.preventDefault(); 
  
    let text = (document.querySelector(".text-input")).value
    if (!text) return;

    // adds user text to <main> id=chat-window </main> using AddMessage()
    AddMessage("Codeworks", "right", text);
  
    // executes automated response
    AutoMessage();

    // reset all form data
    const form = document.querySelector("form");
    form.reset();  
});

const chatContainer= document.getElementById('chat-body');
const userInput= document.getElementById('user-input');
const sendBtn = document.getElementById('send');

function addMessage(content,isUser=false){
    console.log(isUser);
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser? 'input-text' :'reply-text';

    if(isUser){
        messageDiv.innerHTML=`

        <p>${content}</p>
        `;
    }else{
        messageDiv.innerHTML=`
        <img src="./Finn.png">

        <p>${content}</p>

        `;

    }
    chatContainer.appendChild(messageDiv);
    const textElement = messageDiv.querySelector('p');
    typeText(textElement, content);
    chatContainer.scrollTop = chatContainer.scrollHeight;


}
function typeText(element, text) {
    let index = 0;
    element.innerHTML = '';
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            chatContainer.scrollTop = chatContainer.scrollHeight;
            setTimeout(type, 10); 
        }
    }
    type();
}
function addLoader(){
    const loaderDiv = document.createElement('div');
    loaderDiv.className='reply-text';
    loaderDiv.innerHTML = `
                <img src="./Finn.png">
                <div class="loader">
                    <div class="circle">
                        <div class="dot"></div>
                        <div class="outline"></div>
                    </div>
                    <div class="circle">
                        <div class="dot"></div>
                        <div class="outline"></div>
                    </div>
                    <div class="circle">
                        <div class="dot"></div>
                        <div class="outline"></div>
                    </div>
                    <div class="circle">
                        <div class="dot"></div>
                        <div class="outline"></div>
                    </div>
                </div>`;

        chatContainer.appendChild(loaderDiv)
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return loaderDiv;
    
}

function removeLoader(loaderElement) {
    chatContainer.removeChild(loaderElement);
}


function removeLoader(loaderElement) {
    chatContainer.removeChild(loaderElement);
}



async function generateReply(message) {
    try {
        const response = await fetch('https://finn-ai-version-1-0.onrender.com/predict', {
            method: 'POST',
            body: JSON.stringify({ message: message }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, I couldn't generate a reply due to a technical issue.";
    }
}


sendBtn.addEventListener('click',async () =>{
    const message = userInput.value.trim();
    if (message){
        addMessage(message,true);
        userInput.value='';

        const loader=addLoader();

        try{
            const reply =await generateReply(message);
            removeLoader(loader);
            addMessage(reply);

        }
        catch(e){
            removeLoader(loader);
            addMessage("Sorry, I couldn't generate a reply.");
        }
    }
   

})


userInput.addEventListener('keypress',(e)=>{
    if(e.key==='Enter'){
        sendBtn.click();
    }
});
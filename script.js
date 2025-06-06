let prompt=document.querySelector("#prompt")
let submitbtn=document.querySelector("#submit")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")

// Groq API Endpoint (replace with your actual Groq API key)
const Groq_Api_Url = "https://api.groq.com/openai/v1/chat/completions"
const Groq_Api_Key = "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" // Directly in the script

let user={
    message:null,
    file:{
        mime_type:null,
        data: null
    }
}
 
async function generateResponse(aiChatBox) {
    let text=aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Groq_Api_Key}`
        },
        body:JSON.stringify({
            "model": "llama3-70b-8192", 
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional financial advisor specializing in investment and stock market guidance. Provide clear, well-researched, and responsible financial advice. Always include disclaimers that this is general advice and not personalized financial consulting. Recommend consulting with a certified financial advisor for personalized investment strategies. Focus on explaining investment concepts, market trends, diversification, risk management, and providing balanced perspectives on potential investments."
                },
                {
                    "role": "user",
                    "content": user.message
                }
            ],
            "temperature": 0.7,
            "max_tokens": 500,
            "top_p": 1,
            "stream": false
        })
    }
    try{
        let response = await fetch(Groq_Api_Url, RequestOption)
        let data = await response.json()
        let apiResponse = data.choices[0].message.content.trim()
        text.innerHTML = apiResponse    
    }
    catch(error){
        console.log(error);
        text.innerHTML = "I'm sorry, there was an error processing your request. Please try again."
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src = `img.svg`
        image.classList.remove("choose")
        user.file = {}
    }
}

function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}

function handlechatResponse(userMessage){
    user.message=userMessage
    let html=`<img src="user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`
prompt.value=""
let userChatBox=createChatBox(html,"user-chat-box")
chatContainer.appendChild(userChatBox)

chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

setTimeout(()=>{
let html=`<img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area">
    <img src="loading.webp" alt="" class="load" width="50px">
    </div>`
    let aiChatBox=createChatBox(html,"ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)

},600)

}

// Event Listeners
prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
       handlechatResponse(prompt.value)
    }
})

submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value)
})

imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
       let base64string=e.target.result.split(",")[1]
       user.file={
        mime_type:file.type,
        data: base64string
    }
    image.src=`data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("choose")
    }
    
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})

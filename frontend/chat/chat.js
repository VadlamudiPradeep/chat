var state, group;
let allChats;
const chatUrl='http://localhost:3000/chat/chats'

let backBtn=document.getElementById('back')
let sendBtn=document.getElementById('send')
let messageInp=document.getElementById('message')

// Event Listeners
backBtn.addEventListener('click', goBack)
sendBtn.addEventListener('click', sendMessage)
messageInp.addEventListener('input', checkInput)

//Check if already Logged In and Group ID exists
function checkAuthState(){
    state=JSON.parse(sessionStorage.getItem('auth'))
    group=sessionStorage.getItem('groupId')
    if (state==null||state==undefined||state==''){
        location.replace('../auth.html')
    }else if(state.token){
        if(group==null||group==undefined||group==''){
            location.replace('../groups/groups.html')
        }
        else{
            return
        }
    }else{
        location.replace('../auth.html')
    }
}

checkAuthState()

// Back
function goBack(){
    localStorage.removeItem('chats')
    localStorage.removeItem('groupId')
    sessionStorage.removeItem('groupId')
    location.replace('../groups/groups.html')
}

// Input Check
function checkInput(){
    if(messageInp.value==""||message.value.trim().length===0){
        sendBtn.style.display="none"
        messageInp.style.width="97%"
    }else{
        sendBtn.style.display="flex"
        messageInp.style.width="85%"
    }
}

// Send/Post Message
function sendMessage(e){
    try{
        e.preventDefault()
    }
    catch(err){
        console.log(err)
    }
    let message=messageInp.value
    if(message.trim().length==0){
        return
    }
    messageInp.value=""
    axios({
        method:'post',
        url: chatUrl,
        data:{
            message:message,
            groupId:parseInt(group)
        },
        headers:{'Authorization': state.token}
    }).then(response=>{
        return
    }).catch(err=>console.log(err))
}

// Get Chats
function getChats(){
    allChats=JSON.parse(localStorage.getItem('chats'))
    if(allChats==null){
        axios({
            method:'get',
            url: chatUrl,
            params:{groupId:group},
            headers:{'Authorization': state.token}
        }).then(response=>{
            localStorage.setItem('chats', JSON.stringify(response.data))
            let chats=document.querySelector('.chats')
            chats.innerHTML=""
            if(response.data.length==0){
                let p=document.createElement('p')
                p.className='info'
                p.innerHTML='No Chats Yet!'
                chats.appendChild(p)
            }else{
                response.data.map(chat=>{
                    let p=document.createElement('p')
                    p.className=state.userId==chat.userId?'message sender':"message"
                    p.innerHTML=state.userId==chat.userId?chat.message:`${chat.name} : ${chat.message}`
                    chats.appendChild(p)
                    scrollDown()
                })
            }
        }).catch(err=>console.log(err))
    }else if(allChats.length>0){
        axios({
            method:'get',
            url: chatUrl,
            params:{groupId:group, lastId:allChats[allChats.length-1].id},
            headers:{'Authorization': state.token}
        }).then(response=>{
            if(response.data.length>0){
                allChats=[...allChats, ...response.data]
                let chats=document.querySelector('.chats')
                chats.innerHTML=""
                allChats.map(chat=>{
                    let p=document.createElement('p')
                    p.className=state.userId==chat.userId?'message sender':"message"
                    p.innerHTML=state.userId==chat.userId?chat.message:`${chat.name} : ${chat.message}`
                    chats.appendChild(p)
                    scrollDown()
                })
            }
            else if(response.data.length==0){
                let chats=document.querySelector('.chats')
                chats.innerHTML=""
                allChats.map(chat=>{
                    let p=document.createElement('p')
                    p.className=state.userId==chat.userId?'message sender':"message"
                    p.innerHTML=state.userId==chat.userId?chat.message:`${chat.name} : ${chat.message}`
                    chats.appendChild(p)
                    scrollDown()
                })
            }
        }).catch(err=>console.log(err))
    }else if(allChats.length==0){
        axios({
            method:'get',
            url: chatUrl,
            params:{groupId:group},
            headers:{'Authorization': state.token}
        }).then(response=>{
            localStorage.setItem('chats', JSON.stringify(response.data))
            let chats=document.querySelector('.chats')
            chats.innerHTML=""
            if(response.data.length==0){
                let p=document.createElement('p')
                p.className='info'
                p.innerHTML='No Chats Yet!'
                chats.appendChild(p)
            }else{
                response.data.map(chat=>{
                    let p=document.createElement('p')
                    p.className=state.userId==chat.userId?'message sender':"message"
                    p.innerHTML=state.userId==chat.userId?chat.message:`${chat.name} : ${chat.message}`
                    chats.appendChild(p)
                   scrollDown()
                })
            }
        }).catch(err=>console.log(err))
    }
}

// Set Group Header
function setHeader(){
    let header=document.querySelector('.chat-desc')
    header.id=group
    let img=document.createElement('img')
    img.src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7M-SGyKQ1pNCsXSi8Q-MWpEj5S3J-71f3G5w8QnWLp54ksvYBeQvCtaNk4iqC350pkGc&usqp=CAU"
    img.id=group
    header.appendChild(img)
    let p=document.createElement('p')
    p.innerHTML=sessionStorage.getItem('groupName')
    p.id=group
    header.appendChild(p)
    header.addEventListener('click', manageGroup)
}

// Manage Group
function manageGroup(e){
    console.log(e.target.id)
    location.href='../manage/manage.html'
}

// DOM
window.addEventListener('DOMContentLoaded', ()=>{
    setHeader();
    getChats();
setTimeout(getChats,1000)
    checkInput()
})

// Scroll
function scrollDown(){
    let chats=document.querySelector('.chats')
    chats.scrollTop=chats.scrollHeight
}
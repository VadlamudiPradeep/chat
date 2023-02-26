const userUrl='http://localhost:3000/user/users'
let signUpBtn=document.getElementById('sign-up-btn')
let signInBtn=document.getElementById('sign-in-btn')
var state;
let passIn=document.getElementById('password-in')
let passUp=document.getElementById('password')

signUpBtn.addEventListener('click', signUp)
signInBtn.addEventListener('click', signIn)
passIn.addEventListener('keydown', (e)=>{e.code=='Enter'?signIn():null})
passUp.addEventListener('keydown', (e)=>{e.code=='Enter'?signUp():null})

// Sign up
function signUp(e){
    e.preventDefault()
    let nameInp=document.getElementById('name').value
    let emailInp=document.getElementById('email').value
    let phoneInp=document.getElementById('phone').value
    let passInp=document.getElementById('password').value

    if(nameInp.length<3 || nameInp==""){
        alert('Enter a valid Name!')
        return
    }else if(emailInp.indexOf('@')==-1){
        alert('Enter a valid Email ID!')
        return
    }else if(phoneInp.length<10 || isNaN(phoneInp)){
        alert("Enter a valid Phone No!")
        return
    }else if(passInp.length<5){
        alert("Enter a Strong Password!")
        return
    }else{
        document.getElementById('name').value=""
        document.getElementById('email').value=""
        document.getElementById('phone').value=""
        document.getElementById('password').value=""

        axios({
                method : 'post',
                url : userUrl,
                data: {
                    name: nameInp,
                    email: emailInp,
                    phone: phoneInp,
                    password: passInp
                }
        }).then(response=>{
            if(response.data[1]==false){
                alert("You already have an account with us! Please Login...")
            }
            else{
                alert("Sign Up Successful!")
            }
        }).catch(err=>err)
    }
}

// Sign in
function signIn(e){
    let emailInp=document.getElementById('email-in').value
    let passInp=document.getElementById('password-in').value

    if(emailInp.indexOf('@')==-1){
        alert('Enter a valid Email ID!')
        return
    }else if(passInp.length<5){
        alert("Enter a valid Password!")
        return
    }else{
        document.getElementById('email-in').value=""
        document.getElementById('password-in').value=""

        let creds={
            email: emailInp,
            password:passInp
        }

        axios({
                method : 'get',
                url : `${userUrl}/${JSON.stringify(creds)}`
            }).then(response=>{
                console.log(response)
                if (response.data.code==2){
                    alert("You have entered an Invalid Password!")
                }else if(response.data.code==0){
                    alert("Your email is not registered with us!")
                }else if(response.data.code==1){
                    alert("Sign In Successful!")
                    sessionStorage.setItem('auth', JSON.stringify({token:response.data.token, userId:response.data.userId}))
                    checkAuthState()
                }
        }).catch(err=>console.log(err))
    }
}

//Check if already Logged In
function checkAuthState(){
    state=JSON.parse(sessionStorage.getItem('auth'))
    if (state==null||state==undefined||state==''){
        return
    }else if(state.token){
        location.replace('./groups/groups.html')
    }else{
        return
    }
}

checkAuthState()
const expression = ['0']
const history = []
const buttons = document.querySelectorAll('.btn')
const input = document.querySelector('#expression')
const output = document.querySelector('#result')
const span = document.querySelector('span')
const solve = () => {
    switch(expression.length){
        case 0:
            return 0
        case 1:
        case 2:
            return parseInt(expression[0])   
        default:
            let res=0
            let a = parseInt(expression[0])
            let b = parseInt(expression[2])
            switch(expression[1]){
                case '+':
                    res = a + b
                    break;
                case '-':
                    res = a-b
                    break;
                case '*':
                    res = a*b
                    break;
                case '%':
                    if(b===0)
                        res = {error : 'Modulo by 0 error'}
                    else
                        res = a%b
                    break;
                case '/':
                    if(b===0)
                        res = {error : 'Divide by 0 error'}
                    else
                        res = a/b
                    break
            }
            return res    
    }
}
const setOutput = () => {
    output.classList.remove("error")
    let len = expression.length
    let res = solve()
    if(len<=3){
        if(res?.error){
            output.innerText = res.error
            output.classList.add("error")
        }else{
            output.innerText = parseInt(res)
        }
    }else{
        history.unshift({exp : [...expression], res :  (res?.error) ? res: {val:parseInt(res)}})
        history[0].exp.pop()
        if(history.length>5) 
            history.pop()
        for(let i=1;i<=3;++i)
            expression.shift()  
        if(res?.error){
            res = 0
        }
        expression.unshift(""+parseInt(res))
        setOutput()
    }
    let exp=""
    for(let e of expression)
        exp += e
    input.innerText = exp
}
const setInvalidExpression = (msg = "Invalid Attempt\n") => {
    span.innerText = msg
}
//adding click event
for(let btn of buttons){
    btn.addEventListener('click', (...prop)=>{
        setInvalidExpression("")
        const target = prop[0].target
        const character = target.innerText
        if(target.className.indexOf('number')!=-1){
            switch(expression.length){
                case 0:
                    expression.push()
                    break
                case 1:
                    if(expression[0]==='0')
                        expression[0]=''
                    expression[0]+=character
                    break
                case 2:
                    expression.push(character)
                    break
                default:
                    expression[2]+=character
                    break
            }
        }else{
            if(character==='c'){
                if(expression.length!==0){
                    expression[expression.length-1] = expression[expression.length-1].substring(0, expression[expression.length-1].length - 1);
                    if(expression.at(-1).length===0)
                        expression.pop()
                    if(expression.length===0){
                        expression.push('0')
                    }
                }
            }else{
                switch(expression.length){
                    case 1:
                    case 3:
                        switch(expression.at(-1).at(-1)){
                            case '+':
                            case '-':
                            case '*':
                            case '/':
                            case '%':
                                return setInvalidExpression()
                            default:
                                expression.push(character)
                                break;
                        }
                        break;
                    default:
                        if(character==='+' || character==='-'){
                            expression.push(character)
                        }else{
                            return setInvalidExpression()
                        }
                }
            }
        }
        setOutput()
    })
}

setOutput()



const historyBtn = document.querySelector("#history-icon")
const historyDiv = document.querySelector('.history')
const buttonsDiv = document.querySelector('.buttons')
function callAtStart(){
    buttonsDiv.classList.remove("hide")
    historyDiv.classList.add("hide")
}
callAtStart()
historyBtn.addEventListener('click', ()=>{
    if(historyDiv.className.indexOf('hide')!==-1){
        historyDiv.classList.remove('hide')
        buttonsDiv.classList.add("hide")
        let historyItems=""
        for(let {exp, res} of history){
            let expStr = exp.reduce((p,c)=>p+c,"")
            let resStr = ""
            if(res?.error){
                resStr = `<p id="result" class='error'>= ${res.error}</p>`
            }else{
                resStr = `<p id="result">= ${res.val}</p>`
            }
            historyItems += `
            <div class="item">
                <p id="expression">${expStr}</p>
                ${resStr}
            </div>
            `
        }
        if(historyItems.length===0){
            historyDiv.innerText = 'No History Found'
        }else{
            historyDiv.innerHTML = historyItems
        }
    }else{
        buttonsDiv.classList.remove("hide")
        historyDiv.classList.add("hide")
    }
})

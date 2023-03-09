const passwordDisplay=document.querySelector("[displayPassword]");
const copyButt=document.querySelector("[datacpy]");
const copymsg=document.querySelector("[textMsg]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const slider=document.querySelector("[data-lengthSlider]");
const upperCheckBox=document.querySelector("#uppercase");
const lowerCheckBox=document.querySelector("#lowercase");
const numberCheckBox=document.querySelector("#numbers");
const symbolCheckBox=document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBut=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
function handleSlider(){
    slider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = slider.min;
    const max = slider.max;
    slider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}
setIndicator("#ccc");
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRdnNumber(min, max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRdnNumber(0,9);
}
function generateUpperCase(){
    return String.fromCharCode(getRdnNumber(65,91));
}
function generateLowerCase(){
    return String.fromCharCode(getRdnNumber(97,123));
}
function generateSymbol(){
    let randNum=getRdnNumber(0,symbols.length);
    return symbols.charAt(randNum);
}
// Strength check

function findPasswordStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upperCheckBox.checked) hasUpper = true;
    if (lowerCheckBox.checked) hasLower = true;
    if (numberCheckBox.checked) hasNum = true;
    if (symbolCheckBox.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copymsg.innerText="Copied";
  }
  catch(e){
    copymsg.innerText="Failed";
  }
  copymsg.classList.add("active");
  setTimeout(()=>{
    copymsg.classList.remove("active");
  },2000)
}
function shufflePassword(array){
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
let str = "";
array.forEach((el) => (str += el));
return str;
}

function handleCheckBoxChange(){
  checkCount=0;
  allCheckBox.forEach((checkbox)=>{
    if(checkbox.checked)
      checkCount++;
  });
  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox)=>{
  checkbox.addEventListener('change',handleCheckBoxChange);
})
//Whenever slider is displaced from its position, it will be handled as follow:
slider.addEventListener('input',(e)=>{
  passwordLength=e.target.value;
  handleSlider();
})

copyButt.addEventListener('click',()=>{
  if(passwordDisplay.value)
    copyContent();
})

generateBut.addEventListener('click', () => {
  if(checkCount == 0) 
      return;

  if(passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
  }

  password = "";

 //Let's create an array to store the content of password
  let container = [];

  if(upperCheckBox.checked)
  container.push(generateUpperCase);

  if(lowerCheckBox.checked)
  container.push(generateLowerCase);

  if(numberCheckBox.checked)
  container.push(generateRandomNumber);

  if(symbolCheckBox.checked)
  container.push(generateSymbol);

  for(let i=0; i<container.length; i++) {
      password += container[i]();
  }

 //Let's handle remaining password characters if any, after adding above character.
  for(let i=0; i<passwordLength-container.length; i++) {
      let ptr = getRdnNumber(0 , container.length);
      password += container[ptr]();
  }
  //Let's do shuffling of the password
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  console.log("UI adddition done");
  //Function call for finding strength
  findPasswordStrength();
});
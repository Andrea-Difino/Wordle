<script setup>
import { onMounted, watch, ref } from 'vue';
import { wordsList, random} from './lib/get-word'
import WelcomeItem from './components/Header.vue';
import WinItem from './components/winComponent.vue';
import LostItem from './components/loseComponent.vue';
import confetti from 'canvas-confetti';

let activeInputs = [];
let rows = [];
let keys = [];
const win = ref(false)
const lose = ref(false)
const activeRow = ref(0);
const enter = ref(false);
const backspace = ref(false);
const words = ref(wordsList)
let secretWord = random
console.log(secretWord)

watch(enter, async (val) => {
  if(val){
    console.log(val)
    enter.value = false;
    let word = "";
    let valid = true;

    activeInputs.forEach(input => {
      if (input.value === '') {
        valid = false;
        return;
      }
      word += input.value;
    });

    if (!valid) return;

    if (words.value.includes(word)) {
      await setInputsStyle(word);
      await checkWin(word, activeRow.value + 1);
      setTimeout(() => {
        changeRow(activeRow.value, activeRow.value + 1);
      }, 1700);
    }else{
      alert("la parola non esiste")
    }
  }
});

watch(backspace, (val) => {
  if (val) {
    backspace.value = false;
    let index = Array.from(activeInputs).findLastIndex(input => input.value !== '');
    if (index === -1) index = 0;
    activeInputs[index].value = '';
    if (index > 0) {
      activeInputs[index - 1].focus();
    } else {
      activeInputs[0].focus();
    }
  }
});

async function setInputsStyle(userWord) {
  const secret = secretWord.split('');
  const guess = userWord.split('');

  guess.forEach((ch, i) => {
    if (ch === secret[i]) {
      secret[i] = null;
      guess[i] = null;
    }else if (ch && secret.includes(ch)) {
      secret[secret.indexOf(ch)] = null;
    }
  });

  // Ora colora le caselle con delay progressivo
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const input = activeInputs[i];
      input.classList.remove('flip');
      input.classList.add('flip');
      setTimeout(() => {
        if (userWord[i] === secretWord[i]) {
          input.classList.add('right_pos_let');
          updateKeyColor(userWord[i], 'right_pos_let');

        } else if (secretWord.includes(userWord[i])) {
          input.classList.add('right_let');
          updateKeyColor(userWord[i], 'right_let');
        } else {
          input.classList.add('wrong_let');
          updateKeyColor(userWord[i], 'wrong_key_let');
        }
      }, 300); // metà durata flip
    }, i * 400);
  } 
}

async function checkWin(word, nextRowValue){
    if (word === secretWord) {
      setTimeout(() => {
        win.value = true
        showConfetti();
      }, 2100);
      return 
    }
    
    if (nextRowValue >= 6 && word !== secretWord) {
      setTimeout(() => {
        lose.value = true
      }, 2100);
      return 
    }
}

function showConfetti() {
  confetti({
    particleCount: 130,
    spread: 60,
    origin: { y: 0.6 }
  });
}

function updateKeyColor(letter, className) {
  // Converte keys in array se non lo è già
  const keysArray = Array.from(keys);

  const key = keysArray.find(button => button.textContent.toLowerCase() === letter.toLowerCase());
  if (!key) return;

  key.classList.remove('right_pos_let', 'right_let', 'wrong_let');
  key.classList.add(className);
}

async function changeActiveInputs(){
  rows.forEach(row => {
    let inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
      if (row.classList.contains('active')) {
        input.disabled = false;
      } else {
        input.disabled = true;
      }
    });
  })
}

async function changeRow(prevRow, newRow){
  if (newRow >= 6) {
    return
  }

  rows[prevRow].classList.remove('active')
  rows[newRow].classList.add('active')
  activeRow.value = newRow;
  changeActiveInputs();
  activeInputs = rows[newRow].querySelectorAll('input');
}

function handleLetterInput(letter) {
  if (!activeInputs) return;

  for (let input of activeInputs) {
    if (input.value === '') {
      input.value = letter.toUpperCase();

      input.classList.remove('pop'); 
      void input.offsetWidth;      
      input.classList.add('pop');

      if (input.nextElementSibling) input.nextElementSibling.focus();
      break;
    }
  }
}

document.addEventListener("keyup", (e) => {
  if (/^[a-zA-Z]$/.test(e.key)) {
    e.preventDefault();
    handleLetterInput(e.key);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    enter.value = true;
  }
});

onMounted(async () => {
  const activeRowElement = document.querySelector(`.row_${activeRow.value}`);
  rows = document.querySelectorAll('.rows-container > div');
  activeInputs = activeRowElement.querySelectorAll('input');
  keys = document.querySelectorAll('.key:not(.enter):not(.back)');
  // EVENTI TASTIERA FISICA
  for (let i = 0; i < 6; i++) {
    const row = document.querySelector(`.row_${i}`);
    const rowInputs = row.querySelectorAll('input');
    rowInputs.forEach((input, index) => {
      if (i !== activeRow.value) input.disabled = true;
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');
      input.readOnly = true;
      input.tabIndex = -1;
      input.setAttribute('inputmode', 'none');
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          e.preventDefault();

          if (input.value !== '') {
            input.value = '';
          } else if (input.previousElementSibling) {
            input.previousElementSibling.focus();
            input.previousElementSibling.value = '';
          }
        }
      });
    });
  }

  // EVENTI TASTIERA VIRTUALE (solo 1 volta)
  keys.forEach(key => {
    key.addEventListener('click', (e) => {
      handleLetterInput(e.target.innerText);
    });
    key.addEventListener('touch', (e) => {
      handleLetterInput(e.target.innerText);
    });
  });
});

</script>

<template>

  <header>
    <WelcomeItem align="center"/>
  </header>

  <WinItem v-if="win" :parola="secretWord"/>
  <LostItem v-if="lose" :parola="secretWord"/>
  <main>
        <div class="rows-container">
            <div class="row_0 active">
                <input type="text" name="_1" id="" maxlength="1">
                <input type="text" name="_2" id="" maxlength="1">
                <input type="text" name="_3" id="" maxlength="1">
                <input type="text" name="_4" id="" maxlength="1">
                <input type="text" name="_5" id="" maxlength="1">
            </div>
            <div class="row_1">
                <input type="text" name="_1" id="" maxlength="1">
                <input type="text" name="_2" id="" maxlength="1">
                <input type="text" name="_3" id="" maxlength="1">
                <input type="text" name="_4" id="" maxlength="1">
                <input type="text" name="_5" id="" maxlength="1">
            </div>
            <div class="row_2">
                <input type="text" name="_1" id="" maxlength="1">
                <input type="text" name="_2" id="" maxlength="1">
                <input type="text" name="_3" id="" maxlength="1">
                <input type="text" name="_4" id="" maxlength="1">
                <input type="text" name="_5" id="" maxlength="1">
            </div>
            <div class="row_3">
                <input type="text" name="_1" id="" maxlength="1">
                <input type="text" name="_2" id="" maxlength="1">
                <input type="text" name="_3" id="" maxlength="1">
                <input type="text" name="_4" id="" maxlength="1">
                <input type="text" name="_5" id="" maxlength="1">
            </div>
            <div class="row_4">
                <input type="text" name="_1" id="" maxlength="1">
                <input type="text" name="_2" id="" maxlength="1">
                <input type="text" name="_3" id="" maxlength="1">
                <input type="text" name="_4" id="" maxlength="1">
                <input type="text" name="_5" id="" maxlength="1">
            </div>
            <div class="row_5">
                <input type="text" name="_1" id="" maxlength="1">
                <input type="text" name="_2" id="" maxlength="1">
                <input type="text" name="_3" id="" maxlength="1">
                <input type="text" name="_4" id="" maxlength="1">
                <input type="text" name="_5" id="" maxlength="1">
            </div>
        </div>

        <div class="keyboard">
            <div class="keyboard-row">
                <button class="key">Q</button>
                <button class="key">W</button>
                <button class="key">E</button>
                <button class="key">R</button>
                <button class="key">T</button>
                <button class="key">Y</button>
                <button class="key">U</button>
                <button class="key">O</button>
                <button class="key">M</button>
                <button class="key">P</button>          
            </div>
            <div class="keyboard-row">
                <button class="key">A</button>
                <button class="key">S</button>
                <button class="key">B</button>
                <button class="key">D</button>
                <button class="key">N</button>
                <button class="key">J</button>
                <button class="key">K</button>
                <button class="key">L</button>
                <button class="key">V</button>
                <button class="key">Z</button>
                <button class="key">X</button>
            </div>
            <div class="keyboard-row">
                <button class="key enter" style="width: 80px; padding: 0px 15px" @click="enter = true">Enter</button>
                <button class="key">C</button>
                <button class="key">I</button>
                <button class="key">F</button>
                <button class="key">G</button>
                <button class="key">H</button>
                <button class="key back" style="width: fit-content; padding: 0px 12px" @click="backspace = true">Back</button>
            </div>
        </div>
    </main>
</template>

<style scoped>
    @media (max-width: 564px) {
      input[type="text"]{
          color: var(--light-color);
          width: 50px;
          height: 50px;
          border-radius: 8px;
          margin: 0 5px;
          font-size: 35px;
          line-height: 60px;
          text-align: center;
          text-transform: uppercase;
          background-color: var(--cells-color);
          border: 2px solid var(--lightgray-color);
          caret-color: transparent;
          pointer-events: none;
      }

      .key{
        flex: 1 1 0;
        max-width: 70px;
        height: 30px;
        margin: 0px 2px;
        border-radius: 4px;
        border: none;
        font-size: 17px;
      }

      .keyboard{
          width: 95%;
          height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          align-items: center;
          margin: auto;
          gap: 10px;
      }

      .keyboard-row {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-self: center;
        justify-self: center;
      }
    } 

    @media (min-width: 564px) and (max-width: 1200px) {
      input[type="text"]{
          color: var(--light-color);
          width: 55px;
          height: 55px;
          border-radius: 8px;
          margin: 0 5px;
          font-size: 35px;
          line-height: 60px;
          text-align: center;
          text-transform: uppercase;
          background-color: var(--cells-color);
          border: 2px solid var(--lightgray-color);
          caret-color: transparent;
          pointer-events: none;
      }

      .key{
        flex: 1 1 0;
        max-width: 110px;
        height: 40px;
        margin: 0px 4px;
        border-radius: 4px;
        border: none;
        font-size: 17px;
      }

      .keyboard{
          width: 75%;
          height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          align-items: center;
          margin: auto;
          gap: 10px;
      }

      .keyboard-row {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-self: center;
        justify-self: center;
      }
    } 
</style>

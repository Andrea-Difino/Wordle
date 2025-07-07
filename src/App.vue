<script setup>
import { onMounted, watch, ref } from 'vue';
import WelcomeItem from './components/Header.vue';


let inputs = [];
let rows = [];
let keys = [];
const activeRow = ref(0);
const enter = ref(false);
const backspace = ref(false);
const words = ref(['PESCA', 'BANAN', 'CHERRY', 'GRAPE', 'LEMON',])


watch(enter, (val) => {
  if(val){
    enter.value = false;
    let word = "";
    let valid = true;

    inputs.forEach(input => {
      if (input.value === '') {
        valid = false;
        return;
      }
      word += input.value;
    });

    if (!valid) return;

    if (words.value.includes(word)) {
      changeRow(activeRow.value, activeRow.value + 1);
    }
  }
});

watch(backspace, (val) => {
  if (val) {
    backspace.value = false;
    const currentRowInputs = document.querySelectorAll(`.row_${activeRow.value} input`);
    let index = Array.from(currentRowInputs).findLastIndex(input => input.value !== '');
    if (index === -1) index = 0;
    currentRowInputs[index].value = '';
    if (index > 0) {
      currentRowInputs[index - 1].focus();
    } else {
      currentRowInputs[0].focus();
    }
  }
});

async function changeActiveInputs(){
  rows.forEach(row => {
    inputs = row.querySelectorAll('input');
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
  if(newRow >= 6){
    console.log('Game Over');
    return;
  }

  rows[prevRow].classList.remove('active')
  rows[newRow].classList.add('active')
  activeRow.value = newRow;
  changeActiveInputs(inputs);
  inputs = rows[newRow].querySelectorAll('input');
}

onMounted(() => {
  const activeRowElement = document.querySelector(`.row_${activeRow.value}`);
  rows = document.querySelectorAll('.rows-container > div');
  inputs = activeRowElement.querySelectorAll('input');
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
      input.pattern = "[A-Za-z]";
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Backspace') {
          input.value = '';
          if (input.previousElementSibling) {
            input.previousElementSibling.focus();
          }
        } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
          
          if (input.nextElementSibling) {
            input.nextElementSibling.focus();
          }
          input.value = e.key.toUpperCase();
        }
      });
    });
  }

  // EVENTI TASTIERA VIRTUALE (solo 1 volta)
  keys.forEach(key => {
    key.addEventListener('click', (e) => {
      const activeInputs = document.querySelector('.rows-container .active').querySelectorAll('input');
      for (let input of activeInputs) {
        if (input.value === '') {
          input.value = e.target.innerText;
          if (input.nextElementSibling) input.nextElementSibling.focus();
          break;
        }
      }
    });
  });
});

</script>

<template>

  <header>
    <WelcomeItem align="center"/>
  </header>

  <main>
        <div class="rows-container">
            <div class="row_0 active">
                <input type="text" name="_1" id="" maxlength="1" data-animation="pop">
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
                <button class="key">I</button>
                <button class="key">O</button>
                <button class="key">M</button>
                <button class="key">P</button>
                <button class="key">X</button>
                <button class="key">V</button>
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
                <button class="key">E'</button>
                <button class="key">U'</button>
                <button class="key">O'</button>
                <button class="key">A'</button>
            </div>
            <div class="keyboard-row">
                <button class="key enter" style="width: 80px;" @click.enter="enter = true">ENTER</button>
                <button class="key">C</button>
                <button class="key">I</button>
                <button class="key">F</button>
                <button class="key">G</button>
                <button class="key">H</button>
                <button class="key">Z</button>
                <button class="key back" style="width: fit-content; padding: 0px 15px" @click.enter="backspace = true">BACKSPACE</button>
            </div>
        </div>
    </main>
</template>

<style scoped>

</style>

<script setup>
defineProps({
    parola: String
})

function refreshPage() {
  window.location.reload()
}
</script>

<template>
    <div id="win-box">
        <h2>HAI VINTO!</h2>
        <span>La parola era <span>{{ parola }}</span></span>
        <a v-bind:href="'https://www.treccani.it/vocabolario/ricerca/' + parola.toLowerCase()" target="_blank">
            Cerca su Treccani
        </a>
        <button v-on:click="refreshPage">GIOCA ANCORA</button>
    </div>
</template>

<style scoped>
    #win-box{
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 250px;
        height: fit-content;
        padding: 40px;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -100%);
        background-color: #0a151b;
        z-index: 100;
        border-radius: 20px;
        filter: blur(1.5);
    }

    #win-box span{
        display: block;
    }

    #win-box span span{
        color: #8fa464;
    }

    #win-box button{
        border-radius: 10px;
        outline: none;
        border: 1.5px solid white;
        padding: 5px;
        height: 30px;
        width: 75%;
        background-color: transparent;
        margin: auto;
        cursor: pointer;
    }

    
</style>
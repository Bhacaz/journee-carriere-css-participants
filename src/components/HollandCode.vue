<template>
  <div class="columns align-end ml-0 mt-1">
    <span class="tag letter" :class="codeStyle('R')" style="background-color: #ffd967">R</span>
    <span class="tag letter" :class="codeStyle('I')" style="background-color: #e174ff">I</span>
    <span class="tag letter" :class="codeStyle('A')" style="background-color: #fd6262">A</span>
    <span class="tag letter" :class="codeStyle('S')" style="background-color: #0092fd">S</span>
    <span class="tag letter" :class="codeStyle('E')" style="background-color: #38c2c9">E</span>
    <span class="tag letter" :class="codeStyle('C')" style="background-color: #6abf69">C</span>
  </div>
</template>

<script>
export default {
  name: "HollandCode",
  props: ["codes"],
  methods: {
    codeStyle(code) {
      const index = this.codes.indexOf(code);
      return this.indexToClass(index);
    },
    indexToClass(index) {
      switch (index) {
        case 0:
          return "first";
        case 1:
          return "second";
        case 2:
          return "third";
        default:
          return "ligther";
      }
    },
  }
}
</script>

<style scoped>

.align-end {
  align-items: flex-end;
}

.ligther {
  opacity: 0.6;
}

.letter {
  width: 2em;
  text-align: center;
  padding-bottom: 0.25em;
  padding-top: 0.25em;
  font-weight: bold;
  margin: 0.05em;
  height: auto;
}

.first {
  padding-top: 1.75em;
}

.second {
  padding-top: 1.25em;
}

.third {
  padding-top: 0.75em;
}

</style>
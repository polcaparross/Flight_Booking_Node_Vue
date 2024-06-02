<script>
export default{
  props:['thresholds', 'modelValue'],
  emits:['update:modelValue'],
  data(){
    return{
      figures: {},
      color: 'black'
    }

  },
  methods:{
    handleClick(value){
      let min = this.modelValue.min
      let max = this.modelValue.max
      if(this.figures[value].form == '●' && this.figures[value].color == 'black'){
        this.figures[value].color = 'green'
      } else if(this.figures[value].form == '●' && this.figures[value].color == 'green'){
        this.figures[value].color = 'black'
      } else{
        if(this.figures[min].color == 'green' ){
          if(value>max){
            this.$emit('update:modelValue', {min: max, max:value})
          }else{
            this.$emit('update:modelValue', {min: value, max:max})
          }
        } else if(this.figures[max].color == 'green' ){
          if(value<min){
            this.$emit('update:modelValue', {min: value, max:min})
          } else{
            this.$emit('update:modelValue', {min: min, max:value})
          
          }
        }
      }
      if(value == min){
        this.figures[max].color = 'black' 
      }else if (value == max){
        this.figures[min].color = 'black'
      }

      
    }, 
    initForms(){
      this.thresholds.forEach((el) =>{
        if(el == this.modelValue.max || el == this.modelValue.min){
          this.figures[el] = {
            form: "●",
            color: "black"          
          }
        }else if (el > this.modelValue.min && el < this.modelValue.max){
          this.figures[el] = {
            form: "—",
            color: "black"
          }
        }else{
          this.figures[el] = {
            form: "",
            color: "black"          
          }
        }
      })

    }
  }, 
  watch:{
    modelValue(){
      this.initForms()
    }
  },
  created(){
      this.initForms()
  }
}
</script>

<template>
<div class="range">
    <div v-for="(value) in thresholds">
      <div class="range-item" @click="handleClick(value)" :style="`color: ${figures[value].color}`"> {{ figures[value].form }}</div><span class="range-threshold">{{value}}</span>
    </div>
</div>
</template>

<style>
</style>
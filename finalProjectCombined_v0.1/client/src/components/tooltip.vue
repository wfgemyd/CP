<template>
  <div class="tooltip">
    <slot></slot>
    <span class="tooltip-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style scoped lang="sass">
.tooltip
  position: relative
  display: inline-block
  cursor: pointer

.tooltip .tooltip-text
  visibility: hidden
  width: 18rem
  background-color: #a4a4a4
  color: #fff
  text-align: center
  border-radius: 6px
  padding: 5px
  position: absolute
  z-index: 1
  bottom: 125%
  left: 50%
  margin-left: -100px
  opacity: 0
  transition: opacity 0.3s


.tooltip:hover .tooltip-text
  visibility: visible
  opacity: 1

</style>

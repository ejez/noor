<template>
  <div>{{ data }}</div>
</template>

<script>
export default {
  name: 'NrScalar',

  props: {
    data: {
      validator (data) { return typeof data !== 'object' },
      required: true
    }
  }
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <component
    :is="tag"
    v-if="content"
    class="nr-model__field nr-model__body nr-model__body--html"
    v-html="content"
  />
</template>

<script>
import fieldMixin from './mixins/field-mixin'

/**
 * A default component for rendering the 'body' field of a CMS model.
 */
export default {
  name: 'NrFieldBodyHtml',
  mixins: [fieldMixin],

  props: {
    /**
     * The html tag used for the field
     */
    tag: {
      type: String,
      default: 'div'
    }
  }
}
</script>

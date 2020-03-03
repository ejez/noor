<template>
  <component
    :is="tag"
    v-if="content"
    class="nr-model__field nr-model__title"
  >
    {{ content }}
  </component>
</template>

<script>
import fieldMixin from './mixins/field-mixin'

/**
 * A default component for rendering the 'title' field of a CMS model.
 */
export default {
  name: 'NrFieldTitle',
  mixins: [fieldMixin],

  props: {
    /**
     * The html tag used for the field
     */
    tag: {
      type: String,
      default: 'h4'
    }
  }
}
</script>

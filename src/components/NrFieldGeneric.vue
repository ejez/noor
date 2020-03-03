<template>
  <component
    :is="tag"
    v-if="content"
    class="nr-model__field nr-model__field--generic"
  >
    {{ content }}
  </component>
</template>

<script>
import fieldMixin from './mixins/field-mixin'

/**
 * A default component for rendering any field of a CMS model when no specific
 * component exists.
 */
export default {
  name: 'NrFieldGeneric',
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

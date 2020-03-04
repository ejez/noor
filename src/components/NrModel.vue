<script>
import { getFieldsRenderArgs, compImportFunc } from './utils'

/**
 * A component that renders an individual CMS model (article, blog
 * post, ...)
 *
 */
export default {
  name: 'NrModel',

  props: {
    /**
     * The model fields to render.
     */
    fields: {
      type: Object,
      required: true
    },

    renderArgs: {
      type: Array,
      default () { return [compImportFunc('NrModelWrapper')] }
    }
  },

  computed: {
    /**
     * Computes the render arguments for each field, the render
     * args are passed to Vue `createElement()` to build each field element.
     */
    fieldsRenderArgs () {
      return getFieldsRenderArgs(this.fields)
    }
  },

  render (h) {
    const isChildren = (arg) => Array.isArray(arg) || typeof arg !== 'object'

    if (this.renderArgs.slice(1).some(isChildren)) {
      return h(...this.renderArgs)
    } else {
      const fieldElements = this.fieldsRenderArgs.map(args => h(...args))
      return h(...this.renderArgs, fieldElements)
    }
  }
}
</script>

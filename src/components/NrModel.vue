<script>
import NrModelWrapper from './NrModelWrapper.vue'
import NrFieldGeneric from './NrFieldGeneric.vue'

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
      default () { return [NrModelWrapper] }
    }
  },

  computed: {
    /**
     * Computes the render arguments for each field, the render
     * args are passed to Vue `createElement()` to build each field element.
     */
    fieldsRenderArgs () {
      return this.getFieldsRenderArgs(this.fields)
    }
  },

  methods: {
    getFieldsRenderArgs (fields) {
      const fieldsRenderArgs = []

      // loop through the provided fields
      Object.entries(fields).forEach(([field, value]) => {
        // if the field value is an array, then we use it as the render args
        // without further processing, this allows
        if (Array.isArray(value)) {
          fieldsRenderArgs.push(value)
        } else {
          const fieldCapitalized = field.charAt(0).toUpperCase() +
                                   field.slice(1)

          const getFieldComponent = () =>
            import(`./NrField${fieldCapitalized}.vue`).then(
              fieldComponent => fieldComponent,
              () => NrFieldGeneric
            )

          if (typeof value === 'object') {
            fieldsRenderArgs.push([
              getFieldComponent,
              value
            ])
          } else {
            fieldsRenderArgs.push([
              getFieldComponent,
              { props: { content: value } }
            ])
          }
        }
      })

      return fieldsRenderArgs
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

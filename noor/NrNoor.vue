<script>
import conf from 'src/noor/noor.conf'
import NrMixin from './nr-mixin'
import NrChild from './NrChild.vue'

export default {
  name: 'NrNoor',
  components: { NrChild },
  mixins: [NrMixin],

  props: {
    data: {
      type: Object,
      required: true
    },
    lib: {
      type: [String, Object],
      default: conf.defaultComponentsLibrary || 'vue'
    },
    parents: {
      type: Array,
      default () { return [] }
    }
  },

  computed: {
    comp () { return this.getComp({ fallbackComp: 'NrObject' }) }
  },

  methods: {
    normalizeChildLibProp (child) {
      const libProp = this.lib[child]

      if (libProp) {
        if (typeof libProp === 'object' && !libProp.self) {
          libProp.self = this.getLib()
        }
        return libProp
      }

      return this.getLib()
    }
  },

  render (h) {
    const children = []

    for (const child of Object.keys(this.data)) {
      children.push(h(
        NrChild,
        {
          props: {
            data: this.data[child],
            lib: this.normalizeChildLibProp(child),
            parents: [...this.parents, child]
          }
        }
      ))
    }

    return h(this.comp, children)
  }
}
</script>

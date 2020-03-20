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
    renderData: {
      type: Object,
      default () { return {} }
    },
    lib: {
      type: [String, Object],
      default: conf.defaultComponentsLibrary || 'vue'
    },
    excludeKeys: {
      type: Array,
      default () { return conf.excludeKeys || ['id', '_id', '__typename'] }
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
    getChildRenderDataProp (child) {
      const renderDataProp =
        this.renderData[child] ||
        this.renderData[child.split('___')[0]]

      return typeof renderDataProp === 'object' ? renderDataProp : {}
    },

    getChildLibProp (child) {
      const libProp = this.lib[child] || this.lib[child.split('___')[0]]

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
      if (!this.excludeKeys.includes(child)) {
        children.push(h(
          NrChild,
          {
            props: {
              data: this.data[child],
              renderData: this.getChildRenderDataProp(child),
              lib: this.getChildLibProp(child),
              excludeKeys: this.excludeKeys,
              parents: [...this.parents, child]
            }
          }
        ))
      }
    }

    return h(
      this.comp,
      typeof this.renderData.self === 'object'
        ? { ...this.renderData.self }
        : {},
      children
    )
  }
}
</script>

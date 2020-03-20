<script>
import NrMixin from './nr-mixin'

export default {
  name: 'NrChild',
  mixins: [NrMixin],

  props: {
    data: {
      validator () { return true },
      required: true
    },
    renderData: {
      type: Object,
      required: true
    },
    lib: {
      type: [String, Object],
      required: true
    },
    excludeKeys: {
      type: Array,
      required: true
    },
    parents: {
      type: Array,
      required: true
    }
  },

  computed: {
    comp () {
      if (typeof this.data === 'object') {
        return () => import(
        /* webpackInclude: /Nr.+\.vue$/ */
          './NrNoor.vue'
        )
      }
      return this.getComp({ fallbackComp: 'NrScalar' })
    }
  },

  methods: {
    normalizeData () {
      let data = this.data

      if (Array.isArray(this.data)) {
        data = {}
        const parent = this.parents[this.parents.length - 1]
        for (const [index, item] of this.data.entries()) {
          data[`${parent}Item___${index}`] = item
        }
      }

      return data
    },

    getRenderData () {
      const props = {
        data: this.normalizeData(),
        lib: this.lib,
        parents: this.parents
      }

      if (typeof this.data === 'object') {
        return {
          props: {
            ...props,
            renderData: this.renderData,
            excludeKeys: this.excludeKeys
          }
        }
      }

      if (typeof this.renderData.props === 'object') {
        return {
          ...this.renderData,
          props: { ...this.renderData.props, ...props }
        }
      }

      return {
        ...this.renderData,
        props
      }
    }
  },

  render (h) {
    return h(this.comp, this.getRenderData())
  }
}
</script>

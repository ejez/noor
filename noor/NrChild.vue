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
    lib: {
      type: [String, Object],
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
    }
  },

  render (h) {
    return h(this.comp, {
      props: {
        data: this.normalizeData(),
        parents: this.parents,
        lib: this.lib
      }
    })
  }
}
</script>

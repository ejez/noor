<script>
import compImport from './utils/comp-import'
import conf from 'src/noor/noor.conf.js'

export default {
  name: 'Noor',

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
    parentComp () { return this.getParentComp() },

    childrenComps () {
      const comps = {}
      for (const child of Object.keys(this.data)) {
        comps[child] = this.getChildComp(child)
      }
      return comps
    }
  },

  methods: {
    getParentComp () {
      const formattedParents = this.formatParents(this.parents)
      const lib = this.getParentLib()

      for (const [i] of formattedParents.entries()) {
        const comp = compImport(
          `Nr${formattedParents.slice(i).reverse().join('')}`,
          lib
        )
        if (comp) { return comp }
      }

      const comp = compImport('NrObject', lib)
      if (comp) { return comp }

      return () => import(
        /* webpackInclude: /Nr.+\.vue$/ */
        './components/NrObject.vue'
      )
    },

    getChildComp (child) {
      const parents = [...this.parents, child]
      const formattedParents = this.formatParents(parents)

      const lib = this.getChildLib(child)

      const childData = this.data[child]

      if (typeof childData === 'object') {
        return () => import(
          /* webpackInclude: /Nr.+\.vue$/ */
          './NrNoor.vue'
        )
      }

      for (const [index] of formattedParents.entries()) {
        const comp = compImport(
          `Nr${formattedParents.slice(index).reverse().join('')}`,
          lib
        )
        if (comp) { return comp }
      }

      const comp = compImport('NrScalar', lib)
      if (comp) { return comp }

      return () => import(
        /* webpackInclude: /Nr.+\.vue$/ */
        './components/NrScalar.vue'
      )
    },

    formatParents (parents) {
      const stripIndex = p => p.split('___')[0]
      const capitalize = p => p.charAt(0).toUpperCase() + p.slice(1)
      return parents.map(p => capitalize(stripIndex(p)))
    },

    getParentLib () {
      const lib = typeof this.lib === 'string' ? this.lib : ''
      return lib || this.lib.self || conf.defaultComponentsLibrary || 'vue'
    },

    getChildLib (child) {
      const lib = typeof this.lib === 'string'
        ? this.lib
        : this.lib[child]
          ? typeof this.lib[child] === 'string'
            ? this.lib[child]
            : this.lib[child].self
          : ''

      return lib || this.lib.self || conf.defaultComponentsLibrary || 'vue'
    },

    getChildLibProp (child) {
      if (this.lib[child]) {
        if (typeof this.lib[child] === 'object' && !this.lib[child].self) {
          this.lib[child].self = this.getChildLib(child)
        }
        return this.lib[child]
      }
      return this.getChildLib(child)
    },

    getChildDataProp (child) {
      const childData = this.data[child]
      let childDataProp = childData

      if (Array.isArray(childData)) {
        childDataProp = {}
        for (const [index, item] of childData.entries()) {
          childDataProp[`${child}Item___${index}`] = item
        }
      }

      return childDataProp
    }
  },

  render (h) {
    const children = []

    for (const child of Object.keys(this.data)) {
      children.push(h(
        this.childrenComps[child],
        {
          props: {
            data: this.getChildDataProp(child),
            parents: [...this.parents, child],
            lib: this.getChildLibProp(child)
          }
        }
      ))
    }

    return h(this.parentComp, children)
  }
}
</script>

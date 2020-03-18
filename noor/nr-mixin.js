import conf from 'src/noor/noor.conf'
import getCompFromLib from './utils/get-comp-from-lib'

export default {
  methods: {
    getComp ({ fallbackComp }) {
      const formattedParents = this.formatParents(this.parents)
      const lib = this.getLib()

      for (const [i] of formattedParents.entries()) {
        const comp = getCompFromLib(
          `Nr${formattedParents.slice(i).reverse().join('')}`,
          lib
        )
        if (comp) { return comp }
      }

      const comp = getCompFromLib(fallbackComp, lib)
      if (comp) { return comp }

      return () => import(
        /* webpackInclude: /Nr.+\.vue$/ */
        `./components/${fallbackComp}.vue`
      )
    },

    getLib () {
      const lib = typeof this.lib === 'string' ? this.lib : ''
      return lib || this.lib.self || conf.defaultComponentsLibrary || 'vue'
    },

    formatParents (parents) {
      const stripIndex = p => p.split('___')[0]
      const capitalize = p => p.charAt(0).toUpperCase() + p.slice(1)
      return parents.map(p => capitalize(stripIndex(p)))
    }
  }
}

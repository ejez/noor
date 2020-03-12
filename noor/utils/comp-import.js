import conf from 'src/noor/noor.conf.js'

const compLibs = conf.componentLibs || {}
const customLibs = compLibs.custom || {}
const noorLibs = compLibs.noor || {}

export default function (compName, lib) {
  if (customLibs[lib] && customLibs[lib].includes(compName)) {
    return () => import(
      /* webpackInclude: /Nr.+\.vue$/ */
      `src/noor/components/${lib}/${compName}.vue`
    )
  }

  if (noorLibs[lib] && noorLibs[lib].includes(compName)) {
    return () => import(
      /* webpackInclude: /Nr.+\.vue$/ */
      `@noor-project/components-lib-${lib}/${compName}.vue`
    )
  }

  return false
}

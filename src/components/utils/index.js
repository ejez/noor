
export function getFieldsRenderArgs (fields) {
  const fieldsRenderArgs = []

  // loop through the provided fields
  Object.entries(fields).forEach(([field, value]) => {
    // if the field value is an array, then we use it as the render args
    // without further processing, this allows
    if (Array.isArray(value)) {
      fieldsRenderArgs.push(value)
    } else {
      if (typeof value === 'object') {
        fieldsRenderArgs.push([
          fieldComponentImportFunc(field),
          value
        ])
      } else {
        fieldsRenderArgs.push([
          fieldComponentImportFunc(field),
          { props: { content: value } }
        ])
      }
    }
  })

  return fieldsRenderArgs
}

function fieldComponentImportFunc (field) {
  const fieldCapitalized = field.charAt(0).toUpperCase() + field.slice(1)

  return () => import(`src/components/NrField${fieldCapitalized}.vue`).then(
    comp => comp,
    () => import(`noor/src/components/NrField${fieldCapitalized}.vue`).then(
      comp => comp,
      () => import('noor/src/components/NrFieldGeneric.vue')
    )
  )
}

export function compImportFunc (comp) {
  return () => import(`src/components/${comp}.vue`).then(
    comp => comp,
    () => import(`noor/src/components/${comp}.vue`)
  )
}

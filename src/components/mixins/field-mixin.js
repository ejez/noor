/**
 * A mixin to gather common functionalities of field components.
 */
export default {
  props: {
    /**
    * The field content
    */
    content: {
      type: [String, Number],
      default: ''
    }
  }
}

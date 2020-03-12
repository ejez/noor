# Noor! The Vue frontend for any CMS

Did you think of a magic Vue component that is able to render any data structure, no matter how complicated it is!?

Do you have data objects that you constantly change their structures, and you are tired of constantly adapting your Vue components to take into account the new data shapes?

Do you have a backend CMS providing you with multiple data objects with different shapes, and you want to build its frontend in a quick and easy way?

If yes, then **Noor** is what you are looking for! It is as easy as:

```html
<nr-noor :data="myDataObj"/>
```

## Installation

1. Inside your Vue app:

    ```sh
    yarn add noor # Or: npm i noor
    ```

2. Add a webpack resolve alias called `src`.

    * **Vue CLI** users:

      `vue.config.js`:

      ```js
      module.exports = {
        ...
        configureWebpack: {
          resolve: {
            alias: {
              src: path.resolve(__dirname, 'src/')
            }
          }
        }
      }
      ```

    * **Quasar CLI** users: no need for this step as the alias already exists.

3. Create Noor config file:

    `src/noor/noor.conf.js`

    ```js
    export default {}
    ```

    (Configuration will be explained later)

4. Create `src/noor/components/` directory

5. Install any desired Noor component library:

    ```sh
    yarn add @noor-project/components-lib-vue # Or npm i @noor-project/components-lib-vue
    ```

    then declare its components in `noor.conf.js`

    ```js
    import noorVueLib from '@noor-project/components-lib-vue/components.json'

    export default {
      componentLibs: {
        noor: {
          vue: noorVueLib
        }
      }
    }
    ```

## Usage

In your Vue components, import and use the `NrNoor` component:

```vue
<template>
  <nr-noor :data="myData"/>
</template>

<script>
import NrNoor from 'noor/noor/NrNoor.vue'

export default {
  name: 'MyComponent',
  components: { NrNoor },
  computed: {
    myData () {
      return {
        article: {
          title: 'My Article Title',
          body: 'My Article Body'
        }
      }
    }
  }
}
```

## Customize

You can override any component from an installed library by adding a custom component with the same name. Let's see an example:

Let's assume that Noor `vue` library provides the following component:

`NrNameUser`

```vue
<template>
  <div class="nr-user__name">{{ data }}</div>
</template>

<script>
export default {
  name: 'NrNameUser',
  props: {
    data: {
      type: String,
      required: true
    }
  }
}
</script>
```

The above component will be used whenever a Noor data object contains a child `user.name` (on any nested level):

```js
{
  myShop: {
    user: { name: 'Xyz', age: 33}
  }
}
```

and no more specific component exists (ex: `NrNameUserMyShop`).

If you would like instead to display the user name in **bold** and with a label, you'll need to provide a custom component:

`NrNameUser`

```vue
<template>
  <div class="nr-user__name">
    <b>Name: {{ data }}</b>
  </div>
</template>

<script>
export default {
  name: 'NrNameUser',
  props: {
    data: {
      type: String,
      required: true
    }
  }
}
</script>
```

Save the above component in the following path: `src/noor/components/vue/NrNameUser.vue` then declare it in `noor.conf.js`:

```js
import myVueLib from 'src/noor/components/vue/components.json'

export default {
  componentLibs: {
    custom: {
      vue: myVueLib
    }
  }
}
```

`src/noor/components/vue/components.json`

```json
[
  "NrNameUser"
]
```

You can also create a custom library using the same method. However to use it, you need to tell `NrNoor` about it using the `lib` property:

```html
<nr-noor :data="myDataObj" lib="mylib"/>
```

Or alternatively declare it as default in `noor.conf.js`:

```js
import mylib from 'src/noor/components/mylib/components.json'
export default {
  defaultComponentsLibrary: 'mylib'
  componentLibs: {
    custom: {
      mylib
    }
  }
}
```

To know how Noor works, using a guided example, please see `docs/how-it-works.md`

Please also take a look at the main Noor code at `noor/NrNoor.vue`.

## Todo

* Document the use of `lib` prop
* Comment code and generate jsdoc/styleguidist docs
* Build a components library based on pure Vue
* Build a components library based on Quasar
* Add editing interface
* Add example use cases: CMS with GraphQL example, Json to html converter...etc

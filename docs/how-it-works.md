# How it works

## Example data object

Let's say we want to build a home page that displays:

* a top banner containing the title of the last breaking news story.

* a selected user, the star of the week!

* the last two posts added to our site.

We query our backend, and we receive the following data:

```js
data: {
  newsStoryTitle: 'Title of the last breaking news',
  user: {
    name: 'Xyz'
  },
  postsList: [
    { title: 'Post 1 Title', summary: 'Post 1 summary' },
    { title: 'Post 2 Title', summary: 'Post 2 summary' }
  ]
}
```

## Objective

The desired output might look like:

```html
<div>

  <div class="nr-news-story-title">Title of the last breaking news</div>

  <div class="nr-user">
    <div class="nr-name nr-user__name">Xyz</div>
  </div>

  <div class="nr-posts-list">
    <div class="nr-posts-list-item">
      <div class="nr-posts-list-item__title">Post 1 Title</div>
      <div class="nr-posts-list-item__summary">Post 1 summary</div>
    </div>
    <div class="nr-posts-list-item">
      <div class="nr-posts-list-item__title">Post 2 Title</div>
      <div class="nr-posts-list-item__summary">Post 2 summary</div>
    </div>
  </div>

</div>
```

If we have installed a Noor component library and/or added a custom library, the library components will be automatically  loaded by Noor (retrieved using the provided data object keys), and used to fully control and customize the output.

However to simplify this example, lets assume that no library has been added, Noor generic fallback components will be used, and the resulting html we are looking for is the following:

```html
<div class="nr-object">

  <div class="nr-scalar">Title of the last breaking news</div>

  <div class="nr-object">
    <div class="nr-scalar">Xyz</div>
  </div>

  <div class="nr-object">
    <div class="nr-object">
      <div class="nr-scalar">Post 1 Title</div>
      <div class="nr-scalar">Post 1 summary</div>
    </div>
    <div class="nr-object">
      <div class="nr-scalar">Post 2 Title</div>
      <div class="nr-scalar">Post 2 summary</div>
    </div>
  </div>

</div>
```

(***scalar*** means not an ***object*** and not an ***array/list***, for example ***strings*** and ***numbers*** are ***scalars***)

## Usage

Using Noor, we can generate any complex html by simply providing the data object to the Noor main component `NrNoor`:

```html
<nr-noor :data="{
  newsStoryTitle: 'Title of the last breaking news',
  user: { name: 'Xyz' },
  ...
}" />
```

All the heavy lifting of finding the appropriate Vue components needed to render the items of the provided data will be recursively done by Noor.

## How does Noor generate the desired output

**Note:** Understanding [Vue render functions](https://vuejs.org/v2/guide/render-function.html#createElement-Arguments) is needed for this section.

`NrNoor` has a vue render function:

```js
...
return h(this.parentComp, children)
```

(think of `h` as `createElement`)

### Parent component

Initially the component that Noor assigns to `this.parentComp` is `NrObject`.

### Children

Each child will be rendered using

```js
h(this.childrenComps[child], { props: { data: ..., parents: [...], ... }})
```

* If the "**child data**" is an object (ex: `user`), `NrNoor` hands the child rendering to itself `NrNoor`, but this time with the "**child data**" supplied as its data property, this allows `NrNoor` to continue traversing the provided data object.

* If the "**child data**" is an array (ex: `postsList`), `NrNoor` also hands the child rendering to itself, but with the "**child data**" converted to an object and provided as its data property.

  For our example the "**child data**"

  ```js
  [
    { title: 'Post 1 Title', summary: 'Post 1 summary' },
    { title: 'Post 2 Title', summary: 'Post 2 summary' }
  ]
  ```
  
  will be converted to

  ```js
  {
    postsListItem___1: { title: 'Post 1 Title', summary: 'Post 1 summary' },
    postsListItem___2: { title: 'Post 2 Title', summary: 'Post 2 summary' }
  }
  ```

* If the "**child data**" is a scalar, Noor searches in the added libraries for a matching component to assign to `this.childrenComps[child]` using the data object keys. Lets take an example:

  ```js
  data: {
    article: {
      title: 'Example Article Title'
    },
    blogPost: {
      title: 'Example Blog Post Title'
    }
  }
  ```

  For the first `title` key, Noor searches for `NrTitleArticle` (read it 'Nr Title **of** Article') with the following priority order:

  1. in a **custom** components library (if added).

  2. in a **Noor** components library (if installed).

  If not found, Noor then searches for a more generic component `NrTitle`.

  Similarly, for the second `title` key, Noor searches the libraries initially for the more specific component `NrTitleBlogPost`.If not found, it searches for the more generic `NrTitle`.

  If still not finding a matching component using the keys, a generic fallback component `NrScalar` is used.

  **Note:** Noor searches for the generic fallback component `NrScalar` in the added libraries. If not found, it uses its own provided version.

Lets now look into the example stated above.

### First `NrNoor` call

```js
h(this.parentComp, children)
```

will translate successively to:

```js
h('NrObject', [
  h('NrScalar', { props: { parents: ['newsStoryTitle'], data: 'Title of the last breaking news' }}),
  h('NrNoor', { props: { parents: ['user'], data: { name: 'Xyz' } }}),
  h('NrNoor', { props: { parents: ['postsList'], data: {postsListItem___1: {...}, postsListItem___2: {...}} } })
])
```

```html
<nr-object>
  <nr-scalar :parents="['newsStoryTitle']" :data="'Title of the last breaking news'"></nr-scalar>
  <nr-noor :parents="['user']" :data="{ name: 'Xyz' }"></nr-noor>
  <nr-noor :parents="['postsList']" :data="{postsListItem___1: {...}, postsListItem___2: {...}}"></nr-noor>
</nr-object>
```

Now we can see that `NrNoor` needs to be called again two times.

### Rendering `user`

```html
<nr-noor :parents="['user']" :data="{ name: 'Xyz' }"></nr-noor>
```

`NrNoor` render function will use:

```js
h(this.parentComp, children)
```

* The parent component

  Notice this time `NrNoor` is provided with a `parents` property in addition to the `data` property.

  Having `:parents="['user']"` will tell Noor to search for a component `NrUser` in the added libraries. If not found, the fallback component `NrObject` will be used (because the type of the provided data is an object: `{ name: 'Xyz' }`. Notice also that `NrNoor` accepts only **objects** for its data prop)

* The children components

  As stated earlier, each child will be rendered using

  ```js
  h(this.childrenComps[child], { props: { ... }})
  ```

  For our example:

  ```js
  h(this.childrenComps['name'], { props: { parents: ['user', 'name'], data: 'Xyz' }})
  ```

  and as explained earlier, Noor searches in the libraries for `NrNameUser` (to be read as 'Nr Name **of** User'). If not found it will search for a more generic component `NrName`. If again not found, the fallback component `NrScalar` is used.

As a result we get:

```js
h('NrObject', [h('NrScalar', { props: { parents: ['user', 'name'], data: 'Xyz' }})])
```

which translates successively to:

```html
<nr-object>
  <nr-scalar :parents="['user', 'name']" :data="'Xyz'"></nr-scalar>
</nr-object>
```

```html
<div class="nr-object">
  <div class="nr-scalar">Xyz</div>
</div>
```

### Rendering `postsList`

Similar to the process used to render `user`, we get the following for each item in `postsList`:

```html
<div class="nr-object">
  <div class="nr-scalar">Post n Title</div>
  <div class="nr-scalar">Post n summary</div>
</div>
```

### Putting it all together

As expected, we get:

```html
<div class="nr-object">

  <div class="nr-scalar">Title of the last breaking news</div>

  <div class="nr-object">
    <div class="nr-scalar">Xyz</div>
  </div>

  <div class="nr-object">
    <div class="nr-object">
      <div class="nr-scalar">Post 1 Title</div>
      <div class="nr-scalar">Post 1 summary</div>
    </div>
    <div class="nr-object">
      <div class="nr-scalar">Post 2 Title</div>
      <div class="nr-scalar">Post 2 summary</div>
    </div>
  </div>

</div>
```

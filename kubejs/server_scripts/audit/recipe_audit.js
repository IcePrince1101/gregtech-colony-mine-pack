// Проверка рецептов после загрузки. Откат: удалить этот файл.
// Пустой ингредиент или пустой результат ванильного/модового крафта — ошибка.
// В CI config/gregtech_colony.json ставит recipe_audit_stop, и сервер останавливается.

ServerEvents.loaded(function (event) {
  let fails = []
  let notes = []
  let outputs = {}
  let singles = {}
  let singleCount = 0
  let vanillaHits = 0
  let server = event.server
  let access = null
  try {
    access = server.registryAccess()
  } catch (error) {
    access = null
  }

  let recipes = []
  try {
    recipes = server.getRecipeManager().getRecipes()
  } catch (error) {
    console.error('GTC_AUDIT_FAIL recipe manager: ' + error)
    return
  }

  function vanillaCraft(recipe) {
    let name = ''
    try { name = '' + recipe.getClass().getName() } catch (error) { return false }
    return name.indexOf('ShapedRecipe') >= 0 || name.indexOf('ShapelessRecipe') >= 0
  }

  function at(value, index) {
    try {
      if (typeof value.get === 'function') return value.get(index)
    } catch (error) {
      // fall through to array index
    }
    return value[index]
  }

  function collectionSize(value) {
    if (!value) return 0
    try {
      if (typeof value.size === 'function') {
        let sized = value.size()
        if (typeof sized === 'number') return sized
      }
    } catch (error) {
      // arrays have no size()
    }
    try {
      if (typeof value.length === 'number') return value.length
    } catch (error2) {
      return 0
    }
    return 0
  }

  function stacksOf(ingredient) {
    try {
      return ingredient.getItems()
    } catch (error) {
      return null
    }
  }

  let itemRegistry = null
  try {
    itemRegistry = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries').ITEM
  } catch (error) {
    itemRegistry = null
  }

  function stackId(stack) {
    try {
      if (stack.kjs$getId) return '' + stack.kjs$getId()
    } catch (error) {
      // try the registry next
    }
    try {
      if (itemRegistry && stack.getItem) return '' + itemRegistry.getKey(stack.getItem())
    } catch (error2) {
      return ''
    }
    return ''
  }

  let size = collectionSize(recipes)

  for (let i = 0; i < size; i++) {
    let recipe = at(recipes, i)
    let id = ''
    try { id = '' + recipe.getId() } catch (error) { id = 'recipe#' + i }
    let ingredients = null
    try { ingredients = recipe.getIngredients() } catch (error) { ingredients = null }
    if (vanillaCraft(recipe)) vanillaHits = vanillaHits + 1
    if (ingredients) {
      let n = collectionSize(ingredients)
      for (let j = 0; j < n; j++) {
        let ingredient = at(ingredients, j)
        let stacks = stacksOf(ingredient)
        if (!stacks) continue
        let count = collectionSize(stacks)
        if (count === 0) {
          fails.push('empty ingredient in ' + id)
        } else if (count === 1 && vanillaCraft(recipe)) {
          let only = stackId(at(stacks, 0))
          if (only && only.indexOf(':') > 0) {
            singles[only] = true
            singleCount = singleCount + 1
          }
        }
      }
    }
    if (vanillaCraft(recipe) && access) {
      try {
        let result = recipe.getResultItem(access)
        if (!result || result.isEmpty()) {
          fails.push('empty result in ' + id)
        } else {
          outputs[stackId(result)] = true
        }
      } catch (error) {
        notes.push('result unreadable ' + id)
      }
    }
  }

  let watchedNs = {
    create: true,
    ae2: true,
    ae2wtlib: true,
    thermal: true,
    buildcraftcore: true,
    buildcraftfactory: true,
    buildcraftbuilders: true,
    forestry: true,
    occultism: true
  }
  for (let itemId in singles) {
    if (outputs[itemId]) continue
    let ns = itemId.split(':')[0]
    if (!watchedNs[ns]) continue
    notes.push('no crafting recipe for ' + itemId)
  }

  let lines = []
  let limit = fails.length < 80 ? fails.length : 80
  for (let i = 0; i < limit; i++) lines.push(fails[i])
  console.info('GTC_AUDIT_SUMMARY recipes=' + size + ' fails=' + fails.length + ' notes=' + notes.length + ' single_ingredients=' + singleCount + ' vanilla=' + vanillaHits)
  for (let i = 0; i < lines.length; i++) console.error('GTC_AUDIT_FAIL ' + lines[i])
  let noteLimit = notes.length < 40 ? notes.length : 40
  for (let i = 0; i < noteLimit; i++) console.info('GTC_AUDIT_NOTE ' + notes[i])
  if (fails.length === 0) console.info('GTC_AUDIT_OK')
  console.info('GTC_AUDIT_DONE')

  try {
    let cfg = JsonIO.read('config/gregtech_colony.json')
    if (cfg && cfg.recipe_audit_stop === true) {
      server.scheduleInTicks(40, function () {
        server.stop()
      })
    }
  } catch (error) {
    console.warn('gregtech_colony.json: ' + error)
  }
})

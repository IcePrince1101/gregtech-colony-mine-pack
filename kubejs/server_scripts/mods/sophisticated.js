// Откат: удалить этот файл.
// Сундуки и бочки Sophisticated Storage остаются ранними.
// Контроллер склада — MV. Первый рюкзак — LV.

ServerEvents.recipes(function (event) {
  event.remove({ output: 'sophisticatedstorage:controller' })
  event.shaped('sophisticatedstorage:controller', ['SCS', 'HBH', 'SCS'], {
    S: '#forge:stone',
    C: 'gtceu:good_electronic_circuit',
    H: 'gtceu:mv_machine_hull',
    B: '#sophisticatedstorage:base_tier_wooden_storage'
  }).id('gregtech_colony:storage_controller')

  event.remove({ output: 'sophisticatedbackpacks:backpack' })
  event.custom({
    type: 'sophisticatedbackpacks:basic_backpack',
    conditions: [{
      type: 'sophisticatedcore:item_enabled',
      itemRegistryName: 'sophisticatedbackpacks:backpack'
    }],
    key: {
      C: { tag: 'forge:chests/wooden' },
      L: { tag: 'forge:leather' },
      S: { tag: 'forge:string' },
      X: { item: 'gtceu:basic_electronic_circuit' }
    },
    pattern: ['SLS', 'XCX', 'LLL'],
    result: { item: 'sophisticatedbackpacks:backpack' }
  }).id('gregtech_colony:backpack')
})

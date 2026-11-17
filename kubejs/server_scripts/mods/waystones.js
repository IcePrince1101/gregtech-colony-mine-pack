// Откат: удалить этот файл и config/waystones-common.toml.
// Камень пути и варп-камень собираются из деталей LV, не из кирпича и аметиста.

ServerEvents.recipes(function (event) {
  event.remove({ output: 'waystones:warp_stone' })
  event.shaped('waystones:warp_stone', ['PEP', 'ECE', 'PEP'], {
    P: '#forge:plates/steel',
    E: 'minecraft:ender_pearl',
    C: 'gtceu:basic_electronic_circuit'
  }).id('gregtech_colony:warp_stone')

  event.remove({ output: 'waystones:waystone' })
  event.shaped('waystones:waystone', [' M ', 'SWS', 'OOO'], {
    M: 'gtceu:lv_electric_motor',
    S: '#forge:plates/steel',
    W: 'waystones:warp_stone',
    O: 'minecraft:obsidian'
  }).id('gregtech_colony:waystone')

  event.remove({ output: 'waystones:portstone' })
  event.shaped('waystones:portstone', [' M ', 'SWS', 'OOO'], {
    M: 'gtceu:lv_electric_motor',
    S: '#forge:plates/steel',
    W: 'waystones:warp_stone',
    O: 'minecraft:obsidian'
  }).id('gregtech_colony:portstone')

  event.remove({ output: 'waystones:sharestone' })
  event.shaped('waystones:sharestone', ['SSS', ' M ', 'OWO'], {
    S: 'minecraft:stone_bricks',
    M: 'gtceu:basic_electronic_circuit',
    O: 'minecraft:obsidian',
    W: 'waystones:warp_stone'
  }).id('gregtech_colony:sharestone')

  // Пыль, плита и свитки тоже телепортируют. Без варп-камня это обход LV.
  event.remove({ output: 'waystones:warp_dust' })
  event.shapeless('4x waystones:warp_dust', ['waystones:warp_stone', 'minecraft:amethyst_shard'])
    .id('gregtech_colony:warp_dust')

  event.remove({ output: 'waystones:warp_scroll' })
  event.shaped('3x waystones:warp_scroll', ['GDG', 'GEG', 'PPP'], {
    G: '#balm:gold_nuggets',
    D: '#balm:purple_dyes',
    E: 'waystones:warp_stone',
    P: 'minecraft:paper'
  }).id('gregtech_colony:warp_scroll')

  event.remove({ output: 'waystones:bound_scroll' })
  event.shaped('3x waystones:bound_scroll', ['DDD', 'GEG', 'PPP'], {
    D: '#balm:purple_dyes',
    G: '#balm:gold_nuggets',
    E: 'waystones:warp_stone',
    P: 'minecraft:paper'
  }).id('gregtech_colony:bound_scroll')

  event.remove({ output: 'waystones:return_scroll' })
  event.shaped('3x waystones:return_scroll', ['WEW', 'PPP'], {
    W: 'waystones:warp_dust',
    E: '#balm:purple_dyes',
    P: 'minecraft:paper'
  }).id('gregtech_colony:return_scroll')
})

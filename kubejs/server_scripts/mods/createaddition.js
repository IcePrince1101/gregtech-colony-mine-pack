// Откат: удалить этот файл, config/createaddition-common.toml и мод createaddition.
// Прокатный стан дублирует волочильню GregTech и убран.
// Генератор собирается из LV-мотора, электромотор открывается на MV.

ServerEvents.recipes(function (event) {
  event.remove({ output: 'createaddition:rolling_mill' })
  event.remove({ type: 'createaddition:rolling' })

  event.remove({ output: 'createaddition:alternator' })
  event.custom({
    type: 'create:mechanical_crafting',
    pattern: ['  A  ', ' ISI ', 'IMRMI', ' ICI '],
    key: {
      A: { item: 'create:andesite_casing' },
      I: { tag: 'forge:plates/iron' },
      S: { item: 'createaddition:copper_spool' },
      M: { item: 'gtceu:lv_electric_motor' },
      R: { tag: 'forge:rods/iron' },
      C: { item: 'createaddition:capacitor' }
    },
    result: { item: 'createaddition:alternator' }
  }).id('gregtech_colony:alternator')

  event.remove({ output: 'createaddition:electric_motor' })
  event.custom({
    type: 'create:mechanical_crafting',
    pattern: ['  A  ', ' BSB ', 'BMRMB', ' BCB '],
    key: {
      A: { item: 'gtceu:good_electronic_circuit' },
      B: { tag: 'forge:plates/aluminium' },
      S: { item: 'createaddition:copper_spool' },
      M: { item: 'gtceu:mv_electric_motor' },
      R: { tag: 'forge:rods/iron' },
      C: { item: 'create:brass_casing' }
    },
    result: { item: 'createaddition:electric_motor' }
  }).id('gregtech_colony:electric_motor')
})

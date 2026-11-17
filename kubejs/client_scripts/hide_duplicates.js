// Откат: удалить этот файл вместе с серверными скриптами mods/.
// Скрывает из JEI машины, чьи рецепты сняты.

JEIEvents.hideItems(function (event) {
  let thermal = [
    'thermal:machine_furnace',
    'thermal:machine_pulverizer',
    'thermal:machine_sawmill',
    'thermal:machine_smelter',
    'thermal:machine_centrifuge',
    'thermal:machine_press',
    'thermal:machine_crucible',
    'thermal:machine_chiller',
    'thermal:machine_refinery',
    'thermal:machine_pyrolyzer',
    'thermal:machine_bottler',
    'thermal:machine_crystallizer'
  ]
  let buildcraft = [
    'buildcraftfactory:distiller',
    'buildcraftfactory:heat_exchange',
    'buildcraftcore:gears/gear_wood',
    'buildcraftcore:gears/gear_stone',
    'buildcraftcore:gears/gear_iron',
    'buildcraftcore:gears/gear_gold',
    'buildcraftcore:gears/gear_diamond'
  ]
  let hidden = thermal.concat(buildcraft).concat([
    'createaddition:rolling_mill',
    'occultism:miner_foliot_unspecialized'
  ])
  for (let i = 0; i < hidden.length; i++) {
    event.hide(hidden[i])
  }
})

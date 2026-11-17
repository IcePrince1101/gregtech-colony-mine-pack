// Откат: удалить этот файл и строку thermal в client_scripts/hide_duplicates.js.
// Thermal Expansion 11.0.1. Дубли машин GregTech убираются.
// Каркаса машины, rf_coil и ячеек в этих jar нет, поэтому оставленные машины
// получают новый верстачный рецепт. Стирлинг, сжатие и магма остаются на LV.
// Фито-инсолятор, варщик, сборщик и остальные динамо — корпус и схема MV.

ServerEvents.recipes(function (event) {
  let removed = [
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
  for (let i = 0; i < removed.length; i++) {
    event.remove({ output: removed[i] })
  }

  function kept(output, pattern, key) {
    event.remove({ output: output })
    event.shaped(output, pattern, key).id('gregtech_colony:' + output.replace(':', '_'))
  }

  // forge:wires/tin в GTCEu пустой. Одиночный провод — предмет gtceu:tin_single_wire.
  let wire = 'gtceu:tin_single_wire'
  let mvHull = 'gtceu:mv_machine_hull'
  let mvCircuit = 'gtceu:good_electronic_circuit'
  let ironGear = '#forge:gears/iron'
  let goldGear = '#forge:gears/gold'

  kept('thermal:dynamo_stirling', [' C ', 'IGI', 'YXY'], {
    C: wire, G: ironGear, I: '#forge:ingots/iron', X: '#forge:dusts/redstone', Y: '#forge:stone'
  })
  kept('thermal:dynamo_compression', [' C ', 'IGI', 'YXY'], {
    C: wire, G: ironGear, I: '#forge:ingots/bronze', X: '#forge:dusts/redstone', Y: 'minecraft:piston'
  })
  kept('thermal:dynamo_magmatic', [' C ', 'IGI', 'YXY'], {
    C: wire, G: goldGear, I: '#forge:ingots/invar', X: '#forge:dusts/redstone', Y: 'minecraft:magma_block'
  })
  // Стирлинг, сжатие и магма остаются LV. Остальные динамо и машины схемы — MV.
  kept('thermal:dynamo_numismatic', [' C ', 'HGH', 'YXY'], {
    C: mvCircuit, G: goldGear, H: mvHull, X: '#forge:dusts/redstone', Y: 'minecraft:gold_block'
  })
  kept('thermal:dynamo_lapidary', [' C ', 'HGH', 'YXY'], {
    C: mvCircuit, G: goldGear, H: mvHull, X: '#forge:dusts/redstone', Y: '#forge:gems/lapis'
  })
  kept('thermal:dynamo_disenchantment', [' C ', 'HGH', 'YXY'], {
    C: mvCircuit, G: goldGear, H: mvHull, X: 'minecraft:book', Y: 'minecraft:experience_bottle'
  })
  kept('thermal:dynamo_gourmand', [' C ', 'HGH', 'YXY'], {
    C: mvCircuit, G: ironGear, H: mvHull, X: 'minecraft:cooked_beef', Y: 'minecraft:bowl'
  })
  kept('thermal:machine_insolator', [' X ', 'YHY', 'CPC'], {
    X: 'minecraft:dirt', Y: '#forge:glass', H: mvHull, C: mvCircuit, P: wire
  })
  kept('thermal:machine_brewer', [' X ', 'YHY', 'CPC'], {
    X: 'minecraft:brewing_stand', Y: '#forge:glass', H: mvHull, C: mvCircuit, P: wire
  })
  kept('thermal:machine_crafter', [' X ', 'YHY', 'CPC'], {
    X: 'minecraft:crafting_table', Y: '#forge:glass', H: mvHull, C: mvCircuit, P: wire
  })

  event.custom({
    type: 'thermal:lapidary_fuel',
    ingredient: { item: 'forbidden_arcanus:arcane_crystal' },
    energy: 120000
  }).id('gregtech_colony:lapidary_arcane_crystal')
  event.custom({
    type: 'thermal:lapidary_fuel',
    ingredient: { item: 'ars_nouveau:source_gem' },
    energy: 80000
  }).id('gregtech_colony:lapidary_source_gem')

  let petals = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black']
  for (let i = 0; i < petals.length; i++) {
    let petal = 'botania:' + petals[i] + '_petal'
    event.custom({
      type: 'thermal:insolator',
      ingredient: { item: petal },
      result: [{ item: petal, count: 2 }],
      energy: 20000,
      water: 500
    }).id('gregtech_colony:insolator_' + petals[i] + '_petal')
  }
})

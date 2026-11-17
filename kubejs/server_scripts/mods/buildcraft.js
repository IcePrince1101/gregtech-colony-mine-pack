// Откат: удалить этот файл и строку buildcraft в client_scripts/hide_duplicates.js.
// Нефтезавод и дистилляция BuildCraft убраны. Источники нефти остаются.
// Карьер и шахтный колодец собираются как дорогие машины MV.

ServerEvents.recipes(function (event) {
  event.remove({ output: 'buildcraftfactory:distiller' })
  event.remove({ output: 'buildcraftfactory:heat_exchange' })
  event.remove({ type: 'buildcraftfactory:distiller' })
  event.remove({ type: 'buildcraftfactory:heat_exchange' })

  let gears = [
    'buildcraftcore:gears/gear_wood',
    'buildcraftcore:gears/gear_stone',
    'buildcraftcore:gears/gear_iron',
    'buildcraftcore:gears/gear_gold',
    'buildcraftcore:gears/gear_diamond'
  ]
  let gtGears = ['#forge:gears/wood', '#forge:gears/stone', '#forge:gears/iron', '#forge:gears/gold', '#forge:gears/diamond']
  for (let i = 0; i < gears.length; i++) {
    event.replaceInput({ mod: 'buildcraftcore' }, gears[i], gtGears[i])
    event.replaceInput({ mod: 'buildcraftfactory' }, gears[i], gtGears[i])
    event.replaceInput({ mod: 'buildcraftbuilders' }, gears[i], gtGears[i])
    event.replaceInput({ mod: 'buildcraftenergy' }, gears[i], gtGears[i])
    event.replaceInput({ mod: 'buildcraftsilicon' }, gears[i], gtGears[i])
    event.replaceInput({ mod: 'buildcrafttransport' }, gears[i], gtGears[i])
    event.remove({ output: gears[i] })
  }

  event.remove({ output: 'buildcraftcore:engine_redstone' })
  event.shaped('buildcraftcore:engine_redstone', ['WWW', ' A ', 'GPG'], {
    W: '#minecraft:planks',
    A: 'create:andesite_casing',
    G: '#forge:gears/wood',
    P: 'minecraft:piston'
  }).id('gregtech_colony:bc_redstone_engine')

  event.remove({ output: 'buildcraftbuilders:quarry' })
  event.shaped('buildcraftbuilders:quarry', ['CMC', 'MDM', 'PHP'], {
    C: 'gtceu:good_electronic_circuit',
    M: 'gtceu:mv_electric_motor',
    D: 'gtceu:mv_machine_hull',
    H: 'gtceu:diamond_drill_head',
    P: 'create:precision_mechanism'
  }).id('gregtech_colony:bc_quarry')

  event.remove({ output: 'buildcraftfactory:mining_well' })
  event.shaped('buildcraftfactory:mining_well', ['CRC', 'MHM', 'APA'], {
    C: 'gtceu:good_electronic_circuit',
    R: 'minecraft:redstone',
    M: 'gtceu:mv_electric_motor',
    H: 'gtceu:mv_machine_hull',
    A: 'forbidden_arcanus:arcane_crystal',
    P: 'create:precision_mechanism'
  }).id('gregtech_colony:bc_mining_well')

  event.remove({ output: 'buildcraftbuilders:builder' })
  event.shaped('buildcraftbuilders:builder', ['CRC', 'MHM', 'GPG'], {
    C: 'gtceu:good_electronic_circuit',
    R: 'minecraft:redstone',
    M: 'gtceu:mv_machine_hull',
    H: 'minecraft:crafting_table',
    G: '#forge:gears/iron',
    P: 'gtceu:mv_electric_piston'
  }).id('gregtech_colony:bc_builder')

  event.remove({ output: 'buildcraftbuilders:filler' })
  event.shaped('buildcraftbuilders:filler', ['CRC', 'MHM', 'GPG'], {
    C: 'gtceu:good_electronic_circuit',
    R: 'minecraft:dirt',
    M: 'gtceu:mv_machine_hull',
    H: 'minecraft:cobblestone',
    G: '#forge:gears/iron',
    P: 'gtceu:mv_electric_piston'
  }).id('gregtech_colony:bc_filler')

  event.recipes.gtceu.centrifuge('bc_oil_to_gt')
    .inputFluids(Fluid.of('buildcraftenergy:oil', 1000))
    .outputFluids(Fluid.of('gtceu:oil', 1000))
    .duration(40)
    .EUt(30)
})

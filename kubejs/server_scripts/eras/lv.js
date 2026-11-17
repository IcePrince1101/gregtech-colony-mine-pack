// Откат LV: удалить этот файл.
// Ключ эпохи: электродуговая печь требует усиленный сланец и прецизионный механизм.

ServerEvents.recipes(function (event) {
  event.remove({ output: 'gtceu:electric_blast_furnace' })
  event.shaped('gtceu:electric_blast_furnace', ['CHC', 'PMP', 'CHC'], {
    C: 'gtceu:cupronickel_coil_block',
    H: 'gtceu:heatproof_machine_casing',
    P: 'create:precision_mechanism',
    M: 'bloodmagic:reinforcedslate'
  }).id('gregtech_colony:ebf')

  event.remove({ output: 'gtceu:lv_conveyor_module' })
  event.shaped('gtceu:lv_conveyor_module', ['RRR', 'MCM', 'RRR'], {
    R: 'gtceu:rubber_plate',
    M: 'gtceu:lv_electric_motor',
    C: 'create:belt_connector'
  }).id('gregtech_colony:lv_conveyor')

  event.remove({ type: 'create:mixing', output: 'create:brass_ingot' })
  event.remove({ id: 'create:mixing/brass_ingot' })

  event.remove({ id: 'create:mechanical_crafting/crafter' })
  event.remove({ id: 'create:crafting/kinetics/mechanical_crafter' })
  event.shaped('3x create:mechanical_crafter', ['B', 'C', 'R'], {
    B: 'gtceu:basic_electronic_circuit',
    C: 'create:brass_casing',
    R: 'minecraft:crafting_table'
  }).id('gregtech_colony:mechanical_crafter')

  event.remove({ id: 'ars_nouveau:enchanting_apparatus' })
  event.shaped('ars_nouveau:enchanting_apparatus', ['NSN', 'GDG', 'GSG'], {
    N: '#forge:nuggets/gold',
    S: 'ars_nouveau:sourcestone',
    G: 'gtceu:steel_gear',
    D: '#forge:gems/diamond'
  }).id('gregtech_colony:enchanting_apparatus')

  event.remove({ id: 'botania:runic_altar' })
  event.shaped('botania:runic_altar', ['SPS', 'TTT'], {
    S: 'botania:livingrock',
    P: 'botania:mana_pearl',
    T: 'gtceu:steel_plate'
  }).id('gregtech_colony:runic_altar')

  event.remove({ id: 'minecolonies:blockhutuniversity' })
  event.shaped('minecolonies:blockhutuniversity', ['XTX', 'XCX', 'XBX'], {
    X: '#minecraft:planks',
    T: 'structurize:sceptergold',
    C: 'gtceu:basic_electronic_circuit',
    B: 'minecraft:book'
  }).id('gregtech_colony:colony_university')

  event.remove({ id: 'forestry:smelter/bronze_from_ingots' })
  event.remove({ id: 'forestry:smelter/bronze_from_raw_materials' })
  event.remove({ id: 'forestry:gear_bronze' })
})

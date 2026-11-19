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

  event.remove({ id: 'create:sequenced_assembly/precision_mechanism' })
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: { tag: 'forge:plates/gold' },
    transitionalItem: { item: 'create:incomplete_precision_mechanism' },
    loops: 5,
    sequence: [
      {
        type: 'create:deploying',
        ingredients: [
          { item: 'create:incomplete_precision_mechanism' },
          { item: 'gtceu:basic_electronic_circuit' }
        ],
        results: [{ item: 'create:incomplete_precision_mechanism' }]
      },
      {
        type: 'create:deploying',
        ingredients: [
          { item: 'create:incomplete_precision_mechanism' },
          { item: 'create:cogwheel' }
        ],
        results: [{ item: 'create:incomplete_precision_mechanism' }]
      },
      {
        type: 'create:deploying',
        ingredients: [
          { item: 'create:incomplete_precision_mechanism' },
          { item: 'create:large_cogwheel' }
        ],
        results: [{ item: 'create:incomplete_precision_mechanism' }]
      }
    ],
    results: [
      { chance: 120.0, item: 'create:precision_mechanism' },
      { chance: 8.0, item: 'create:andesite_alloy' },
      { item: 'minecraft:gold_nugget' }
    ]
  }).id('gregtech_colony:precision_mechanism')

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

  // Единственная руна до усиленного сланца. Рецепт MV на алюминии остаётся вторым путём.
  event.shaped('bloodmagic:speedrune', ['ABA', 'CDC', 'ABA'], {
    A: '#forge:stone',
    B: 'bloodmagic:blankslate',
    C: 'minecraft:sugar',
    D: 'bloodmagic:blankrune'
  }).id('gregtech_colony:speed_rune_altar')

  // Латунь Create. Паровой сплавщик берёт только до 8 EU, этот рецепт идёт на LV.
  event.recipes.gtceu.alloy_smelter('brass_ingot')
    .itemInputs('gtceu:copper_dust', 'gtceu:zinc_dust')
    .itemOutputs('2x create:brass_ingot')
    .duration(100)
    .EUt(16)

  // Ванильный электролиз боксита на 60 EU. LV-электролизёр принимает до 32.
  event.remove({ id: 'gtceu:electrolyzer/bauxite_electrolysis' })
  event.recipes.gtceu.electrolyzer('bauxite_electrolysis')
    .itemInputs('15x gtceu:bauxite_dust')
    .itemOutputs('6x gtceu:aluminium_dust', 'gtceu:rutile_dust')
    .outputFluids(Fluid.of('gtceu:oxygen', 9000))
    .duration(270)
    .EUt(30)

  // Ванильный обжиг пыли на 120 EU. Два люка LV дают 64 EU/т.
  event.remove({ id: 'gtceu:electric_blast_furnace/blast_aluminium' })
  event.remove({ id: 'gtceu:electric_blast_furnace/blast_aluminium_gas' })
  event.recipes.gtceu.electric_blast_furnace('blast_aluminium')
    .itemInputs('gtceu:aluminium_dust')
    .circuit(1)
    .itemOutputs('gtceu:aluminium_ingot')
    .blastFurnaceTemp(1700)
    .duration(884)
    .EUt(60)
  event.recipes.gtceu.electric_blast_furnace('blast_aluminium_gas')
    .itemInputs('gtceu:aluminium_dust')
    .inputFluids(Fluid.of('gtceu:nitrogen', 1000))
    .circuit(2)
    .itemOutputs('gtceu:aluminium_ingot')
    .blastFurnaceTemp(1700)
    .duration(592)
    .EUt(60)

  // Жидкий оловянный сплав нужен катушке, отдельного рецепта плавки не было.
  event.recipes.gtceu.extractor('tin_alloy_fluid')
    .itemInputs('gtceu:tin_alloy_ingot')
    .outputFluids(Fluid.of('gtceu:tin_alloy', 144))
    .duration(40)
    .EUt(30)
})

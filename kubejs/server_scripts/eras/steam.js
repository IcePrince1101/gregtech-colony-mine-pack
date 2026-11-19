// Откат пара: удалить этот файл.
// Create открывается паровым сплавщиком. Ключ эпохи: лампа на душевной стали
// и покрытая плата только с механического пресса.

ServerEvents.recipes(function (event) {
  event.remove({ output: 'create:andesite_alloy' })
  event.recipes.gtceu.alloy_smelter('andesite_alloy')
    .itemInputs('2x minecraft:andesite', '#forge:nuggets/iron')
    .itemOutputs('2x create:andesite_alloy')
    .duration(100)
    .EUt(16)
  event.recipes.gtceu.mixer('andesite_alloy')
    .itemInputs('2x minecraft:andesite', '#forge:nuggets/iron')
    .itemOutputs('2x create:andesite_alloy')
    .duration(60)
    .EUt(7)

  event.remove({ output: 'create:cogwheel' })
  event.shapeless('create:cogwheel', ['create:shaft', '#minecraft:planks', 'gtceu:small_bronze_gear'])
    .id('gregtech_colony:cogwheel')
  // Greate снимает ванильные рецепты большой шестерни и не отдаёт create:large_cogwheel.
  event.shapeless('create:large_cogwheel', ['create:cogwheel', '#minecraft:planks'])
    .id('gregtech_colony:large_cogwheel')

  event.remove({ output: 'gtceu:resin_circuit_board' })
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: { item: 'gtceu:wood_plate' },
    transitionalItem: { item: 'gtceu:wood_plate' },
    sequence: [
      {
        type: 'create:deploying',
        ingredients: [{ item: 'gtceu:wood_plate' }, { item: 'gtceu:sticky_resin' }],
        results: [{ item: 'gtceu:wood_plate' }]
      },
      {
        type: 'create:pressing',
        ingredients: [{ item: 'gtceu:wood_plate' }],
        results: [{ item: 'gtceu:wood_plate' }]
      }
    ],
    results: [{ item: 'gtceu:resin_circuit_board' }],
    loops: 1
  }).id('gregtech_colony:coated_board')

  // Стеклянная трубка. Ванильный сплавщик на 16 EU паровая машина не берёт:
  // пар обрабатывает только рецепты ULV, до 8 EU. Форм-пресс и застывание жидкости — машины LV.
  event.recipes.gtceu.alloy_smelter('glass_tube_steam')
    .itemInputs('gtceu:glass_dust')
    .notConsumable('gtceu:ball_casting_mold')
    .itemOutputs('gtceu:glass_tube')
    .duration(160)
    .EUt(7)

  // Лампа руками в бронзе. Сборщик остаётся более быстрым рецептом LV.
  event.remove({ output: 'gtceu:vacuum_tube' })
  event.shaped('gtceu:vacuum_tube', [' S ', 'BTB', 'WWW'], {
    S: 'malum:soul_stained_steel_ingot',
    B: 'gtceu:steel_bolt',
    T: 'gtceu:glass_tube',
    W: 'gtceu:red_alloy_single_wire'
  }).id('gregtech_colony:vacuum_tube_hand')
  event.recipes.gtceu.assembler('vacuum_tube')
    .itemInputs('gtceu:glass_tube', '2x gtceu:steel_bolt', 'malum:soul_stained_steel_ingot')
    .itemOutputs('2x gtceu:vacuum_tube')
    .duration(80)
    .EUt(30)

  event.remove({ id: 'malum:spirit_infusion/soul_stained_steel_ingot' })
  event.custom({
    type: 'malum:spirit_infusion',
    input: { count: 1, item: 'gtceu:steel_ingot' },
    extra_items: [{ count: 4, item: 'malum:processed_soulstone' }],
    output: { item: 'malum:soul_stained_steel_ingot' },
    spirits: [{ type: 'wicked', count: 3 }, { type: 'earthen' }, { type: 'arcane' }]
  }).id('gregtech_colony:soul_stained_steel')

  event.remove({ id: 'botania:mana_spreader' })
  event.shaped('botania:mana_spreader', ['WWW', 'BP ', 'WWW'], {
    W: '#botania:livingwood_logs',
    B: 'gtceu:bronze_plate',
    P: '#botania:petals'
  }).id('gregtech_colony:mana_spreader')

  event.remove({ id: 'botania:mana_pool' })
  event.shaped('botania:mana_pool', ['RAR', 'RRR'], {
    R: 'botania:livingrock',
    A: 'create:andesite_casing'
  }).id('gregtech_colony:mana_pool')

  event.custom({
    type: 'botania:mana_infusion',
    input: { item: 'minecraft:coal_block' },
    mana: 200000,
    output: { item: 'minecraft:diamond' }
  }).id('gregtech_colony:coal_block_to_diamond')

  event.remove({ id: 'ars_nouveau:imbuement_chamber' })
  event.shaped('ars_nouveau:imbuement_chamber', ['XYX', 'X X', 'XBX'], {
    X: 'ars_nouveau:archwood_planks',
    Y: '#forge:ingots/gold',
    B: 'gtceu:bronze_plate'
  }).id('gregtech_colony:imbuement_chamber')

  event.remove({ id: 'bloodmagic:blood_altar' })
  event.shaped('bloodmagic:altar', ['A A', 'CBC', 'GGG'], {
    A: '#forge:stone',
    C: 'gtceu:bronze_brick_casing',
    B: 'minecraft:furnace',
    G: '#forge:ingots/gold'
  }).id('gregtech_colony:blood_altar')

  event.remove({ id: 'minecolonies:blockhutsmeltery' })
  event.shaped('minecolonies:blockhutsmeltery', ['XTX', 'XBX', 'XPX'], {
    X: '#minecraft:planks',
    T: 'structurize:sceptergold',
    B: 'minecraft:iron_ingot',
    P: 'gtceu:bronze_plate'
  }).id('gregtech_colony:colony_smeltery')

  event.shaped('gtceu:lp_steam_macerator', ['BCB', 'PAP', 'BWB'], {
    B: 'gtceu:bronze_machine_casing',
    C: 'forbidden_arcanus:arcane_crystal',
    P: 'gtceu:bronze_small_fluid_pipe',
    A: 'create:andesite_casing',
    W: '#forge:tools/wrenches'
  }).damageIngredient('#forge:tools/wrenches').id('gregtech_colony:steam_macerator_arcane')

  event.recipes.gtceu.coke_oven('peat')
    .itemInputs('forestry:peat')
    .itemOutputs('minecraft:charcoal')
    .outputFluids(Fluid.of('gtceu:creosote', 250))
    .duration(600)
  event.recipes.gtceu.steam_boiler('peat')
    .itemInputs('forestry:peat')
    .duration(300)

  // Поезда Create: не с первых досок и не с MV. Рельсы и корпус дороги требуют бронзу.
  event.remove({ output: 'create:railway_casing' })
  event.custom({
    type: 'create:item_application',
    ingredients: [
      { item: 'create:brass_casing' },
      { item: 'gtceu:bronze_plate' }
    ],
    results: [{ item: 'create:railway_casing' }]
  }).id('gregtech_colony:railway_casing')

  event.remove({ id: 'create:sequenced_assembly/track' })
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: { tag: 'create:sleepers' },
    transitionalItem: { item: 'create:incomplete_track' },
    loops: 1,
    sequence: [
      {
        type: 'create:deploying',
        ingredients: [
          { item: 'create:incomplete_track' },
          { item: 'gtceu:bronze_nugget' }
        ],
        results: [{ item: 'create:incomplete_track' }]
      },
      {
        type: 'create:deploying',
        ingredients: [
          { item: 'create:incomplete_track' },
          { item: 'gtceu:bronze_nugget' }
        ],
        results: [{ item: 'create:incomplete_track' }]
      },
      {
        type: 'create:pressing',
        ingredients: [{ item: 'create:incomplete_track' }],
        results: [{ item: 'create:incomplete_track' }]
      }
    ],
    results: [{ item: 'create:track' }]
  }).id('gregtech_colony:track')

  event.remove({ output: 'create:controls' })
  event.shaped('create:controls', ['B', 'C', 'G'], {
    B: 'minecraft:lever',
    C: 'create:railway_casing',
    G: '#forge:gears/bronze'
  }).id('gregtech_colony:train_controls')

  event.remove({ output: 'create:steam_engine' })
  event.shaped('create:steam_engine', ['P', 'A', 'C'], {
    P: 'gtceu:bronze_plate',
    A: 'create:andesite_alloy',
    C: '#forge:storage_blocks/copper'
  }).id('gregtech_colony:steam_engine')

  event.remove({ output: 'create:schedule' })
  event.shapeless('4x create:schedule', ['gtceu:bronze_plate', 'minecraft:paper'])
    .id('gregtech_colony:schedule')
})

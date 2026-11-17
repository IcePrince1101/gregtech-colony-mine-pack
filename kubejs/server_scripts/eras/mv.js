// Откат MV: удалить этот файл.
// Ключ эпохи: вакуумный морозильник требует водную эссенцию и помпы Create.

ServerEvents.recipes(function (event) {
  // Greate снимает create:crafting/kinetics/mechanical_pump и не кладёт взамен
  // крафт ванильной помпы. Морозильник ниже требует именно create:mechanical_pump.
  event.shapeless('create:mechanical_pump', ['create:cogwheel', 'create:fluid_pipe'])
    .id('gregtech_colony:mechanical_pump')

  event.remove({ output: 'gtceu:vacuum_freezer' })
  event.shaped('gtceu:vacuum_freezer', ['PHP', 'FCF', 'PHP'], {
    P: 'create:mechanical_pump',
    H: 'gtceu:mv_machine_hull',
    F: 'gtceu:frostproof_machine_casing',
    C: 'ars_nouveau:water_essence'
  }).id('gregtech_colony:vacuum_freezer')

  event.remove({ id: 'create:crafting/materials/electron_tube' })
  event.shaped('create:electron_tube', ['L', 'V'], {
    L: 'create:polished_rose_quartz',
    V: 'gtceu:vacuum_tube'
  }).id('gregtech_colony:electron_tube')

  event.remove({ output: 'forbidden_arcanus:hephaestus_forge' })
  event.shaped('forbidden_arcanus:hephaestus_forge', ['ABA', 'PFP', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: 'create:brass_casing',
    P: 'forbidden_arcanus:polished_darkstone',
    F: 'forbidden_arcanus:arcane_crystal_block'
  }).id('gregtech_colony:hephaestus_forge')

  event.remove({ id: 'malum:spirit_infusion/hallowed_gold_ingot' })
  event.custom({
    type: 'malum:spirit_infusion',
    input: { count: 1, item: 'gtceu:rose_gold_ingot' },
    extra_items: [{ count: 4, tag: 'forge:gems/quartz' }],
    output: { item: 'malum:hallowed_gold_ingot' },
    spirits: [{ type: 'sacred', count: 2 }, { type: 'arcane' }]
  }).id('gregtech_colony:hallowed_gold')

  event.remove({ id: 'bloodmagic:blood_rune_speed' })
  event.shaped('bloodmagic:speedrune', ['ABA', 'CDC', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: 'bloodmagic:blankslate',
    C: 'minecraft:sugar',
    D: 'create:precision_mechanism'
  }).id('gregtech_colony:speed_rune')

  event.remove({ output: 'gtceu:mv_assembler' })
  event.shaped('gtceu:mv_assembler', ['CHC', 'PAP', 'CHC'], {
    C: 'gtceu:good_electronic_circuit',
    H: 'gtceu:mv_machine_hull',
    P: 'create:precision_mechanism',
    A: 'gtceu:mv_robot_arm'
  }).id('gregtech_colony:mv_assembler')

  event.remove({ id: 'forestry:apiary' })
  event.shaped('forestry:apiary', ['SSS', 'PCP', 'IBI'], {
    S: '#minecraft:wooden_slabs',
    P: '#minecraft:planks',
    C: 'forestry:impregnated_casing',
    I: 'gtceu:good_electronic_circuit',
    B: 'gtceu:bronze_plate'
  }).id('gregtech_colony:forestry_apiary')

  event.remove({ id: 'gendustry:mutatron' })
  event.shaped('gendustry:mutatron', ['RHI', 'MSR', 'RCI'], {
    R: 'gendustry:receptacle',
    H: 'gendustry:genetics_processor',
    I: 'gtceu:good_electronic_circuit',
    M: 'gendustry:power_module',
    S: 'forestry:sturdy_machine',
    C: 'minecraft:cauldron'
  }).id('gregtech_colony:mutatron')
})

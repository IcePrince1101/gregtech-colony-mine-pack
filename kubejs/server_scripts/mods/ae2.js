// Откат AE2: удалить этот файл.
// Старт сети — MV (хорошая схема и сборщик MV). Автокрафт и диски 16k+ — HV.
// Квантовая связь и пространственные ячейки — EV.
// Метеорит кладёт печати, но не процессоры. Печати бесполезны, пока высекатель
// не собран из деталей MV. Процессоры дополнительно делаются в сборщике на 120 EU/t.

ServerEvents.recipes(function (event) {
  let mv = 'gtceu:good_electronic_circuit'
  let hv = 'gtceu:advanced_integrated_circuit'
  let ev = 'gtceu:nano_processor'
  let hull = 'gtceu:mv_machine_hull'

  event.remove({ output: 'ae2:charger' })
  event.shaped('ae2:charger', ['ABA', 'C  ', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: '#forge:ingots/copper',
    C: mv
  }).id('gregtech_colony:ae2_charger')

  event.remove({ output: 'ae2:inscriber' })
  event.shaped('ae2:inscriber', ['ABA', 'C H', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: 'minecraft:sticky_piston',
    C: mv,
    H: hull
  }).id('gregtech_colony:ae2_inscriber')

  event.remove({ output: 'ae2:energy_acceptor' })
  event.shaped('ae2:energy_acceptor', ['ABA', 'BCB', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: 'ae2:quartz_glass',
    C: mv
  }).id('gregtech_colony:ae2_energy_acceptor')

  event.remove({ output: 'ae2:controller' })
  event.shaped('ae2:controller', ['ABA', 'BCB', 'ABA'], {
    A: 'ae2:smooth_sky_stone_block',
    B: 'ae2:engineering_processor',
    C: mv
  }).id('gregtech_colony:ae2_controller')

  event.remove({ output: 'ae2:drive' })
  event.shaped('ae2:drive', ['ABA', 'C C', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: 'ae2:engineering_processor',
    C: 'ae2:fluix_glass_cable'
  }).id('gregtech_colony:ae2_drive')

  function processor(name, plate) {
    event.remove({ id: 'ae2:inscriber/' + name + '_processor' })
    event.recipes.gtceu.assembler('ae2_' + name + '_processor')
      .itemInputs(plate, 'ae2:silicon', 'minecraft:redstone', mv)
      .itemOutputs('ae2:' + name + '_processor')
      .duration(80)
      .EUt(120)
  }
  processor('logic', '#forge:plates/gold')
  processor('calculation', '#ae2:all_certus_quartz')
  processor('engineering', '#forge:gems/diamond')

  event.remove({ output: 'ae2:cell_component_16k' })
  event.shaped('ae2:cell_component_16k', ['ABA', 'CDC', 'ACA'], {
    A: '#forge:dusts/glowstone',
    B: 'ae2:calculation_processor',
    C: hv,
    D: 'ae2:cell_component_4k'
  }).id('gregtech_colony:ae2_cell_16k')

  event.remove({ output: 'ae2:cell_component_64k' })
  event.shaped('ae2:cell_component_64k', ['ABA', 'CDC', 'ACA'], {
    A: '#forge:dusts/glowstone',
    B: 'ae2:calculation_processor',
    C: hv,
    D: 'ae2:cell_component_16k'
  }).id('gregtech_colony:ae2_cell_64k')

  event.remove({ output: 'ae2:cell_component_256k' })
  event.shaped('ae2:cell_component_256k', ['ABA', 'CDC', 'ACA'], {
    A: '#forge:dusts/glowstone',
    B: 'ae2:calculation_processor',
    C: hv,
    D: 'ae2:cell_component_64k'
  }).id('gregtech_colony:ae2_cell_256k')

  event.remove({ output: 'ae2:crafting_unit' })
  event.shaped('ae2:crafting_unit', ['ABA', 'CDC', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: 'ae2:calculation_processor',
    C: 'ae2:fluix_glass_cable',
    D: hv
  }).id('gregtech_colony:ae2_crafting_unit')

  event.remove({ output: 'ae2:molecular_assembler' })
  event.shaped('ae2:molecular_assembler', ['ABA', 'CDE', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: 'ae2:quartz_glass',
    C: 'ae2:annihilation_core',
    D: hv,
    E: 'ae2:formation_core'
  }).id('gregtech_colony:ae2_molecular_assembler')

  event.remove({ output: 'ae2:blank_pattern' })
  event.shaped('2x ae2:blank_pattern', ['ABA', 'BCB', 'DDD'], {
    A: 'ae2:quartz_glass',
    B: '#forge:dusts/glowstone',
    C: hv,
    D: 'gtceu:plastic_circuit_board'
  }).id('gregtech_colony:ae2_blank_pattern')

  event.remove({ output: 'ae2:pattern_provider' })
  event.shaped('ae2:pattern_provider', ['ABA', 'C D', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: hv,
    C: 'ae2:annihilation_core',
    D: 'ae2:formation_core'
  }).id('gregtech_colony:ae2_pattern_provider')

  event.remove({ output: 'ae2:interface' })
  event.shaped('ae2:interface', ['ABA', 'C D', 'ABA'], {
    A: '#forge:ingots/aluminium',
    B: 'ae2:quartz_glass',
    C: 'ae2:annihilation_core',
    D: hv
  }).id('gregtech_colony:ae2_interface')

  event.remove({ output: 'ae2:crafting_terminal' })
  event.shapeless('ae2:crafting_terminal', ['ae2:terminal', 'minecraft:crafting_table', hv])
    .id('gregtech_colony:ae2_crafting_terminal')

  event.remove({ output: 'ae2:quantum_link' })
  event.shaped('ae2:quantum_link', ['ABA', 'B B', 'ABA'], {
    A: 'ae2:quartz_glass',
    B: ev
  }).id('gregtech_colony:ae2_quantum_link')

  event.remove({ output: 'ae2:quantum_ring' })
  event.shaped('ae2:quantum_ring', ['ABA', 'CDE', 'ABA'], {
    A: '#forge:ingots/titanium',
    B: 'ae2:logic_processor',
    C: 'ae2:engineering_processor',
    D: 'ae2:energy_cell',
    E: ev
  }).id('gregtech_colony:ae2_quantum_ring')

  event.remove({ output: 'ae2:spatial_cell_component_2' })
  event.shaped('ae2:spatial_cell_component_2', ['ABA', 'BCB', 'ABA'], {
    A: '#forge:dusts/glowstone',
    B: 'ae2:fluix_pearl',
    C: ev
  }).id('gregtech_colony:ae2_spatial_2')
})

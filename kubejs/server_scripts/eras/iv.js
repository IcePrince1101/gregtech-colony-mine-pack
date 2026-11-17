// Откат IV: удалить этот файл.
// Ключ эпохи: сборочная линия требует дух Гайи и прецизионный механизм.

ServerEvents.recipes(function (event) {
  event.remove({ output: 'gtceu:assembly_line' })
  event.shaped('gtceu:assembly_line', ['GHG', 'PCP', 'GHG'], {
    G: 'gtceu:assembly_line_grating',
    H: 'gtceu:assembly_line_unit',
    P: 'create:precision_mechanism',
    C: 'botania:life_essence'
  }).id('gregtech_colony:assembly_line')

  event.remove({ output: 'gtceu:iv_field_generator' })
  event.shaped('gtceu:iv_field_generator', ['WPW', 'EFE', 'WPW'], {
    W: 'gtceu:tungsten_steel_plate',
    P: 'botania:pixie_dust',
    E: 'minecraft:ender_eye',
    F: 'gtceu:iv_machine_hull'
  }).id('gregtech_colony:iv_field_generator')
})

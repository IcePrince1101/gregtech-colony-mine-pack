// Откат HV: удалить этот файл.
// Ключ эпохи: корпус фильтра чистой комнаты требует деорум и вентилятор Create.

ServerEvents.recipes(function (event) {
  event.remove({ output: 'gtceu:filter_casing' })
  event.shaped('gtceu:filter_casing', ['FDF', 'PHP', 'FDF'], {
    F: 'create:encased_fan',
    D: 'forbidden_arcanus:deorum_ingot',
    P: 'gtceu:hv_electric_pump',
    H: 'gtceu:hv_machine_hull'
  }).id('gregtech_colony:filter_casing')

  event.remove({ id: 'botania:alfheim_portal' })
  event.shaped('botania:alfheim_portal', ['WSW', 'WTW', 'WSW'], {
    W: '#botania:livingwood_logs',
    T: '#botania:terrasteel_nuggets',
    S: 'gtceu:stainless_steel_frame'
  }).id('gregtech_colony:alfheim_portal')

  event.remove({ id: 'bloodmagic:altar/masterbloodorb' })
  event.custom({
    type: 'bloodmagic:altar',
    altarSyphon: 50000,
    consumptionRate: 30,
    drainRate: 50,
    input: { item: 'gtceu:advanced_integrated_circuit' },
    output: { item: 'bloodmagic:masterbloodorb' },
    upgradeLevel: 3
  }).id('gregtech_colony:master_orb')
})

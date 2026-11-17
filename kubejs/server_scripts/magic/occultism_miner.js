// Откат шахты Occultism: удалить этот файл.
// Фолиот-шахтёр убран. Джинн и выше призываются дорогим ритуалом.
// Редкие руды GregTech весят 12 при весе железа 750, это около 1.6%.

ServerEvents.recipes(function (event) {
  event.remove({ id: 'occultism:ritual/craft_miner_foliot_unspecialized' })
  event.remove({ output: 'occultism:miner_foliot_unspecialized' })

  event.remove({ id: 'occultism:ritual/craft_miner_djinni_ores' })
  event.custom({
    type: 'occultism:ritual',
    ritual_type: 'occultism:craft_miner_spirit',
    activation_item: { item: 'occultism:book_of_binding_bound_djinni' },
    pentacle_id: 'occultism:craft_djinni',
    duration: 120,
    ritual_dummy: { item: 'occultism:ritual_dummy/craft_miner_djinni_ores' },
    ingredients: [
      { item: 'gtceu:advanced_integrated_circuit' },
      { item: 'gtceu:hv_electric_motor' },
      { item: 'occultism:iesnium_pickaxe' },
      { item: 'bloodmagic:demonslate' },
      { item: 'botania:elementium_ingot' },
      { item: 'malum:soul_stained_steel_ingot' },
      { item: 'occultism:spirit_attuned_crystal' }
    ],
    result: { item: 'occultism:miner_djinni_ores' }
  }).id('gregtech_colony:miner_djinni')

  let rare = ['tungsten', 'platinum', 'palladium', 'iridium', 'osmium', 'uranium', 'titanium', 'chromium', 'molybdenum', 'naquadah', 'vanadium']
  for (let i = 0; i < rare.length; i++) {
    let metal = rare[i]
    event.remove({ id: 'occultism:miner/ores/' + metal + '_ore' })
    event.custom({
      type: 'occultism:miner',
      conditions: [{ type: 'forge:not', value: { type: 'forge:tag_empty', tag: 'forge:ores/' + metal } }],
      ingredient: { tag: 'occultism:miners/ores' },
      result: { tag: 'forge:ores/' + metal },
      weight: 12
    }).id('gregtech_colony:miner_' + metal)
  }
})

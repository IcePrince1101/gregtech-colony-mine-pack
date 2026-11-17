// Откат EV: удалить этот файл.
// Ключ эпохи: вольфрамосталь в электродуговой печи требует пыль иесниума.
// Отдельный компонент Create схемой не задан, поэтому его нет.

ServerEvents.recipes(function (event) {
  event.remove({ type: 'gtceu:electric_blast_furnace', output: 'gtceu:hot_tungsten_steel_ingot' })
  event.recipes.gtceu.electric_blast_furnace('tungsten_steel')
    .itemInputs('#forge:ingots/tungsten', '#forge:ingots/steel', 'occultism:iesnium_dust')
    .itemOutputs('gtceu:hot_tungsten_steel_ingot')
    .blastFurnaceTemp(3000)
    .duration(800)
    .EUt(480)

  event.recipes.gtceu.chemical_bath('ev_wafer_life')
    .itemInputs('gtceu:silicon_wafer')
    .inputFluids(Fluid.of('bloodmagic:life_essence_fluid', 250))
    .itemOutputs('gtceu:phosphorus_wafer')
    .duration(200)
    .EUt(480)

  event.remove({ id: 'botania:terra_plate' })
  event.shaped('botania:terra_plate', ['LLL', '0M1', '2T3'], {
    L: 'minecraft:lapis_block',
    0: 'botania:rune_water',
    1: 'botania:rune_fire',
    2: 'botania:rune_earth',
    3: 'botania:rune_air',
    M: 'gtceu:titanium_plate',
    T: 'botania:rune_mana'
  }).id('gregtech_colony:terra_plate')
})

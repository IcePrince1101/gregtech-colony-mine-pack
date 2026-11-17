// Откат каменного века: удалить этот файл.
// Ключ эпохи: контроллер коксовой печи берёт два живых камня Botania.
// В сетке 3x3 не помещаются ещё два предмета сверх 4 кирпичей, 4 слитков и ключа,
// поэтому два слитка заменены живым камнем.
// Пластины gtceu:iron_plate в реестре нет, а кованое железо плавится только в дуговой печи.
// В каменном веке доступен слиток из обычной печи.

ServerEvents.recipes(function (event) {
  event.remove({ output: 'gtceu:coke_oven' })
  event.shaped('gtceu:coke_oven', ['BLB', 'PWP', 'BLB'], {
    B: 'gtceu:coke_oven_bricks',
    L: 'botania:livingrock',
    P: 'minecraft:iron_ingot',
    W: '#forge:tools/wrenches'
  }).damageIngredient('#forge:tools/wrenches').id('gregtech_colony:coke_oven')

  event.remove({ id: 'malum:spirit_altar' })
  event.shaped('malum:spirit_altar', [' Y ', 'ZXZ', 'TPT'], {
    Y: 'malum:processed_soulstone',
    Z: '#forge:ingots/gold',
    X: 'malum:runewood_planks',
    T: 'gtceu:treated_wood_planks',
    P: 'gtceu:treated_wood_plate'
  }).id('gregtech_colony:spirit_altar')

  let chalks = ['white', 'red', 'gold', 'purple']
  for (let i = 0; i < chalks.length; i++) {
    let color = chalks[i]
    let impure = 'occultism:chalk_' + color + '_impure'
    event.remove({ output: impure })
    event.shaped(impure, ['XY', 'XY', 'XM'], {
      X: 'occultism:burnt_otherstone',
      Y: 'occultism:otherworld_ashes',
      M: '#forge:tools/mortars'
    }).damageIngredient('#forge:tools/mortars').id('gregtech_colony:chalk_' + color)
  }
})

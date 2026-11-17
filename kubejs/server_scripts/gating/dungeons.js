// Dungeon gating. Independent from gacha reward tables.
// Turn off by setting dungeon_gating to false in config/gregtech_colony.json.

const GTC_RULES = [
  { prefix: 'endrem:', stage: 'era_iv' },
  { prefix: 'cataclysm:ignitium', stage: 'era_iv' },
  { prefix: 'cataclysm:monstrous', stage: 'era_iv' },
  { prefix: 'cataclysm:abyss', stage: 'era_iv' },
  { prefix: 'cataclysm:void_', stage: 'era_iv' },
  { prefix: 'twilightforest:knightmetal', stage: 'era_hv' },
  { prefix: 'twilightforest:fiery', stage: 'era_hv' },
  { prefix: 'twilightforest:steeleaf', stage: 'era_hv' },
  { prefix: 'twilightforest:ironwood', stage: 'era_hv' },
  { prefix: 'aether:gravitite', stage: 'era_ev' },
  { prefix: 'aether:zanite', stage: 'era_ev' },
  { prefix: 'ae2:cell_component_', stage: 'era_mv' },
  { prefix: 'ae2:spatial', stage: 'era_hv' },
  { prefix: 'gtceu:nano_', stage: 'era_ev' },
  { prefix: 'gtceu:quantum_', stage: 'era_iv' },
  { prefix: 'gtceu:wetware_', stage: 'era_late' },
  { prefix: 'gtceu:luv_', stage: 'era_late' },
  { prefix: 'gtceu:zpm_', stage: 'era_late' },
  { prefix: 'gtceu:uv_', stage: 'era_late' },
  { prefix: 'gtceu:uhv_', stage: 'era_late' },
  { prefix: 'gtceu:hv_', stage: 'era_hv' },
  { prefix: 'gtceu:ev_', stage: 'era_ev' },
  { prefix: 'gtceu:iv_', stage: 'era_iv' },
  { prefix: 'gtceu:lp_steam_', stage: 'era_steam' },
  { prefix: 'gtceu:hp_steam_', stage: 'era_steam' },
  { prefix: 'gtceu:bronze_', stage: 'era_steam' },
  { exact: 'ae2:controller', stage: 'era_mv' },
  { exact: 'ae2:dense_energy_cell', stage: 'era_hv' },
  { exact: 'minecraft:diamond', stage: 'era_lv' },
  { exact: 'minecraft:ancient_debris', stage: 'era_hv' },
  { exact: 'minecraft:netherite_scrap', stage: 'era_hv' },
  { exact: 'minecraft:netherite_ingot', stage: 'era_hv' },
  { exact: 'botania:terrasteel_ingot', stage: 'era_ev' },
  { exact: 'bloodmagic:demonslate', stage: 'era_hv' },
  { exact: 'malum:processed_soulstone', stage: 'era_coke' }
]

const GTC_BOSSES = {
  'cataclysm:ignis': 'era_iv',
  'cataclysm:the_harbinger': 'era_iv',
  'cataclysm:the_leviathan': 'era_iv',
  'cataclysm:ancient_remnant': 'era_iv',
  'cataclysm:maledictus': 'era_iv',
  'cataclysm:scylla': 'era_iv',
  'cataclysm:netherite_monstrosity': 'era_iv',
  'cataclysm:ender_guardian': 'era_iv'
}

const GTC_DIMS = {
  'twilightforest:twilight_forest': 'era_hv',
  'aether:the_aether': 'era_ev',
  'minecraft:the_end': 'era_iv'
}

function gtcConfig() {
  try {
    let read = JsonIO.read('config/gregtech_colony.json')
    if (read) return read
  } catch (error) {
    console.warn('gregtech_colony.json unreadable: ' + error)
  }
  return { dungeon_gating: true }
}

function gtcId(value) {
  let text = '' + value
  let found = text.match(/[a-z0-9_]+:[a-z0-9_./-]+/g)
  if (!found || found.length === 0) return text
  return found[found.length - 1]
}

function gtcHas(player, stage) {
  return player.stages.has(stage)
}

function gtcNeeded(itemId) {
  for (let i = 0; i < GTC_RULES.length; i++) {
    let rule = GTC_RULES[i]
    if (rule.exact && itemId == rule.exact) return rule.stage
    if (rule.prefix && itemId.indexOf(rule.prefix) === 0) return rule.stage
  }
  return ''
}

function gtcLootKey(block) {
  return gtcId(block.level.dimension) + ':' + block.x + ',' + block.y + ',' + block.z
}

function gtcKnownChest(server, key) {
  let list = server.persistentData.gtcLootChests
  if (!list) return false
  for (let i = 0; i < list.length; i++) {
    if (list[i] == key) return true
  }
  return false
}

function gtcRememberChest(server, key) {
  let list = server.persistentData.gtcLootChests
  if (!list) list = []
  for (let i = 0; i < list.length; i++) {
    if (list[i] == key) return
  }
  list.push(key)
  server.persistentData.gtcLootChests = list
}

function gtcStrip(inventory, player) {
  let size = inventory.getContainerSize()
  let removed = false
  for (let i = 0; i < size; i++) {
    let stack = inventory.getItem(i)
    if (!stack || stack.isEmpty()) continue
    let needed = gtcNeeded(gtcId(stack.id))
    if (needed && !gtcHas(player, needed)) {
      inventory.setItem(i, Item.of('minecraft:air'))
      removed = true
    }
  }
  return removed
}

PlayerEvents.chestOpened(function (event) {
  if (gtcConfig().dungeon_gating === false) return
  let block = event.block
  if (!block) return
  let table = ''
  try {
    let data = block.entityData
    if (data && data.LootTable) table = '' + data.LootTable
  } catch (error) {
    table = ''
  }
  let key = gtcLootKey(block)
  let known = gtcKnownChest(event.server, key)
  if (!table && !known) return
  gtcRememberChest(event.server, key)
  let inventory = event.inventory
  let player = event.player
  event.server.scheduleInTicks(1, function () {
    if (gtcStrip(inventory, player)) {
      player.tell('Сундук данжа обрезан до вашей эпохи. Откройте соответствующий квест.')
    }
  })
})

PlayerEvents.tick(function (event) {
  let player = event.player
  if (player.age % 40 !== 0) return
  if (gtcConfig().dungeon_gating === false) return
  let dim = gtcId(player.level.dimension)
  let needed = GTC_DIMS[dim]
  if (!needed || gtcHas(player, needed)) return
  let overworld = player.server.getLevel('minecraft:overworld')
  player.teleportTo(overworld, player.x, 200, player.z, player.yaw, player.pitch)
  player.tell('Это измерение закрыто до нужной эпохи GregTech.')
})

EntityEvents.hurt(function (event) {
  if (gtcConfig().dungeon_gating === false) return
  let entityId = gtcId(event.entity.type)
  let needed = GTC_BOSSES[entityId]
  if (!needed) return
  let source = event.source
  if (!source) return
  let attacker = source.actual
  if (!attacker || !attacker.isPlayer()) return
  if (gtcHas(attacker, needed)) return
  event.cancel()
  attacker.tell('Этот босс закрыт до эпохи IV.')
})

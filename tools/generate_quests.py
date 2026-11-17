#!/usr/bin/env python3
"""Generate the GregTech Colony quest book.

Reward tables are the only gacha. Quests keep working if that folder is removed:
a random reward whose table is missing gives nothing and does not fail the quest.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUESTS = ROOT / "config" / "ftbquests" / "quests"
CHAPTERS = QUESTS / "chapters"
TABLES = QUESTS / "reward_tables"

# Small positive ids. Hex form is what FTB Quests stores; table_id is the same value as a long.
_seq = 0x3000


def nid() -> str:
    global _seq
    _seq += 1
    return f"{_seq:016X}"


def nlong(hex_id: str) -> int:
    return int(hex_id, 16)


def q(text: str) -> str:
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'


def snbt_value(value, indent: int) -> str:
    pad = "\t" * indent
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int) and not isinstance(value, bool):
        return str(value)
    if isinstance(value, float):
        return f"{value:.1f}f"
    if isinstance(value, str):
        return q(value)
    if isinstance(value, list):
        if not value:
            return "[ ]"
        inner = []
        for item in value:
            inner.append(pad + "\t" + snbt_value(item, indent + 1))
        return "[\n" + "\n".join(inner) + "\n" + pad + "]"
    if isinstance(value, dict):
        lines = []
        for key, item in value.items():
            lines.append(f"{pad}\t{key}: {snbt_value(item, indent + 1)}")
        return "{\n" + "\n".join(lines) + "\n" + pad + "}"
    raise TypeError(type(value))


def dump(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(snbt_value(data, 0) + "\n", encoding="utf-8")


# Items a pool may contain. None of these are quest targets.
# Each pool is the previous pool plus only what the milestone that just
# finished already forced the player to touch. The quest that introduces
# a thing never rolls that thing.
POOLS: dict[str, list[dict]] = {}


def food(item: str, count: int, weight: float) -> dict:
    entry: dict = {"item": item, "weight": float(weight)}
    if count != 1:
        entry = {"count": count, "item": item, "weight": float(weight)}
    return entry


POOLS["start"] = [
    food("minecraft:bread", 6, 24),
    food("minecraft:apple", 4, 18),
    food("minecraft:cooked_beef", 4, 16),
    food("farmersdelight:cabbage", 4, 14),
    food("minecraft:torch", 16, 16),
    food("minecraft:oak_sapling", 2, 8),
    food("minecraft:leather", 3, 8),
    food("minecraft:string", 6, 8),
    food("minecraft:bowl", 4, 6),
    food("minecraft:wheat_seeds", 4, 8),
    food("minecraft:name_tag", 1, 2),
    food("minecraft:dandelion", 4, 3),
]

POOLS["hand"] = POOLS["start"] + [
    food("minecraft:flint", 8, 14),
    food("minecraft:coal", 8, 12),
    food("minecraft:brick", 8, 10),
    food("minecraft:glass", 6, 8),
    food("minecraft:clay_ball", 8, 8),
]

POOLS["coke"] = POOLS["hand"] + [
    food("minecraft:charcoal", 12, 14),
    food("gtceu:wood_dust", 8, 10),
    food("minecraft:iron_ingot", 2, 6),
]

POOLS["pbf"] = POOLS["coke"] + [
    food("minecraft:copper_ingot", 4, 10),
    food("minecraft:clay", 4, 6),
]

POOLS["steam"] = POOLS["pbf"] + [
    food("gtceu:tin_ingot", 2, 8),
    food("minecraft:bucket", 1, 6),
]

POOLS["resin"] = POOLS["steam"] + [
    food("gtceu:sticky_resin", 4, 10),
]

POOLS["lv"] = POOLS["resin"] + [
    food("minecraft:redstone", 8, 10),
    food("minecraft:glowstone_dust", 2, 6),
    food("minecraft:gunpowder", 4, 6),
]

POOLS["mv"] = POOLS["lv"] + [
    food("minecraft:gold_ingot", 2, 6),
    food("minecraft:lapis_lazuli", 8, 6),
]

POOLS["hv"] = POOLS["mv"] + [
    food("minecraft:blaze_powder", 2, 5),
    food("minecraft:ender_pearl", 1, 4),
]

POOLS["ev"] = POOLS["hv"] + [
    food("minecraft:ghast_tear", 1, 3),
    food("minecraft:amethyst_shard", 4, 5),
]

POOLS["iv"] = POOLS["ev"] + [
    food("minecraft:shulker_shell", 1, 2),
    food("minecraft:phantom_membrane", 2, 3),
]

POOLS["late"] = [
    food("minecraft:name_tag", 1, 8),
    food("minecraft:oxeye_daisy", 8, 10),
    food("minecraft:cooked_beef", 8, 14),
    food("minecraft:torch", 32, 12),
    food("farmersdelight:cabbage", 8, 10),
    food("minecraft:music_disc_cat", 1, 1),
]


QUESTS_DATA: list[dict] = []


def add_quest(
    *,
    chapter: str,
    key: str,
    title: str,
    subtitle: str,
    description: list[str],
    icon: str,
    task_type: str,
    task_item: str | None = None,
    task_dimension: str | None = None,
    task_count: int = 1,
    deps: list[str] | None = None,
    pool: str,
    stage: str | None = None,
    x: float,
    y: float,
    shape: str = "square",
) -> str:
    qid = nid()
    tid = nid()
    QUESTS_DATA.append(
        {
            "chapter": chapter,
            "key": key,
            "id": qid,
            "title": title,
            "subtitle": subtitle,
            "description": description,
            "icon": icon,
            "task_type": task_type,
            "task_item": task_item,
            "task_dimension": task_dimension,
            "task_count": task_count,
            "task_id": tid,
            "deps": deps or [],
            "pool": pool,
            "stage": stage,
            "x": x,
            "y": y,
            "shape": shape,
        }
    )
    return key


def build() -> None:
    # --- Intro ---
    add_quest(
        chapter="intro",
        key="book",
        title="Книга эпох",
        subtitle="Прогресс свой, party общий",
        description=[
            "Это карта эпох GregTech, а не список кликов. Квест закрывается предметом или событием, текст объясняет, как устроена механика.",
            "",
            "Пока вы один, команда FTB Teams состоит из вас: прогресс квестов только ваш. Если собрать party и пригласить друзей, прогресс становится общим внутри party, потому что FTB Quests хранит его на команде. Награда-гача при этом личная: каждый забирает свой бросок.",
        ],
        icon="ftbquests:book",
        task_type="checkmark",
        pool="start",
        x=0,
        y=0,
        shape="hexagon",
    )
    add_quest(
        chapter="intro",
        key="hardcore",
        title="Хардкор уже включён",
        subtitle="config/gtceu.yaml",
        description=[
            "Ванильная генерация руд выключена: металл лежит в жилах GregTech, их выдают индикаторы на поверхности. Из бревна выходит мало досок, палки тоже урезаны, уголь в обычной печи не жарится из брёвен как раньше.",
            "",
            "Кремень и сталь требует стальных деталей, броня и инструменты ванили собраны жёстче, машины GT ломаются инструментами GT, а не голой рукой. Это фон всей книги, а не отдельный челлендж.",
        ],
        icon="minecraft:oak_log",
        task_type="item",
        task_item="minecraft:oak_log",
        deps=["book"],
        pool="start",
        x=0,
        y=1.6,
    )
    add_quest(
        chapter="intro",
        key="gacha_rules",
        title="Сундук только из пройденного",
        subtitle="Гачу можно выключить",
        description=[
            "Случайная награда берётся из таблицы уже открытого подэтапа. Квест, который впервые требует паровую машину, не может выдать паровую машину. В пуле еда, расходники и немного сырья, которое этот подэтап уже заставил получить.",
            "",
            "Таблицы лежат отдельно в config/ftbquests/quests/reward_tables. Если каталог убрать, квесты остаются, а бросок просто ничего не даёт. Гейтинг данжей к этим таблицам не привязан.",
        ],
        icon="minecraft:chest",
        task_type="checkmark",
        deps=["hardcore"],
        pool="start",
        x=0,
        y=3.2,
        shape="rsquare",
    )

    # --- Stone ---
    add_quest(
        chapter="stone",
        key="planks",
        title="Дерево больше не щедрое",
        subtitle="Мало досок и палок",
        description=[
            "Рецепт досок и палок урезан конфигом. Деревянная заготовка GT, длинная палка и деревянная пластина, с этого момента расходник, а не мусор: на них сидят формы, рукояти и первые станки.",
            "",
            "Лес рядом с базой заканчивается быстрее, чем кажется по ванильному опыту.",
        ],
        icon="gtceu:wood_plate",
        task_type="item",
        task_item="gtceu:wood_plate",
        deps=["gacha_rules"],
        pool="start",
        x=0,
        y=0,
    )
    add_quest(
        chapter="stone",
        key="furnace",
        title="Печь без халявного угля",
        subtitle="Брёвна не становятся углём сами",
        description=[
            "Обычная печь больше не превращает бревно в уголь тем рецептом, к которому привыкла ваниль. Уголь и древесный уголь дальше завязаны на коксование. Ранняя еда и первый обжиг камня всё ещё живут в печи и в костре.",
        ],
        icon="minecraft:furnace",
        task_type="item",
        task_item="minecraft:furnace",
        deps=["planks"],
        pool="start",
        x=0,
        y=1.6,
    )
    add_quest(
        chapter="stone",
        key="pick",
        title="Камень, не жила",
        subtitle="Инструмент, чтобы дойти до руды",
        description=[
            "Каменная кирка нужна, чтобы копать камень и добраться до индикатора жилы. Сама жила не заменяет этот шаг: ванильные россыпи руды в мире не генерируются.",
            "",
            "Индикатор на поверхности показывает материал под землёй. Копать наугад в поисках «обычной» железной руды бесполезно.",
        ],
        icon="minecraft:stone_pickaxe",
        task_type="item",
        task_item="minecraft:stone_pickaxe",
        deps=["furnace"],
        pool="start",
        stage="era_hand",
        x=0,
        y=3.2,
        shape="hexagon",
    )
    add_quest(
        chapter="stone",
        key="mortar",
        title="Ступка",
        subtitle="Пыль раньше дробилки",
        description=[
            "Ступка растирает куски в пыль без машины. На каменном веке это способ получить пыль и красители, не дожидаясь паровой мацератора. Инструмент не расходуется квестом.",
        ],
        icon="gtceu:mortar",
        task_type="item",
        task_item="gtceu:mortar",
        deps=["pick"],
        pool="hand",
        x=-2.2,
        y=4.8,
        shape="rsquare",
    )
    add_quest(
        chapter="stone",
        key="wrench",
        title="Гаечный ключ",
        subtitle="Им крутят машины",
        description=[
            "Ключ задаёт сторону машины и снимает кабели и корпуса. По конфигу блоки GregTech не отдаются голой рукой: без ключа разобрать станок нельзя. Позже появятся электрические ключи, но принцип тот же.",
        ],
        icon="gtceu:wrench",
        task_type="item",
        task_item="gtceu:wrench",
        deps=["pick"],
        pool="hand",
        x=0,
        y=4.8,
    )
    add_quest(
        chapter="stone",
        key="cutter",
        title="Кусачки",
        subtitle="Провода не ломают киркой",
        description=[
            "Кусачки обслуживают провода и кабели. Когда появится энергия, резать сеть киркой будет потерей материала. Инструмент живёт в том же наборе, что ключ и ступка.",
        ],
        icon="gtceu:wire_cutter",
        task_type="item",
        task_item="gtceu:wire_cutter",
        deps=["wrench"],
        pool="hand",
        x=2.2,
        y=4.8,
        shape="rsquare",
    )
    add_quest(
        chapter="stone",
        key="form",
        title="Деревянная форма",
        subtitle="Кирпич коксовой печи",
        description=[
            "Коксовый кирпич формуется, а не лепится как ванильный. Форма многоразовая, глина и песок уходят в заготовку. Это порог между костром и первой многоблоковой печью.",
        ],
        icon="gtceu:brick_wooden_form",
        task_type="item",
        task_item="gtceu:brick_wooden_form",
        deps=["wrench", "mortar"],
        pool="hand",
        x=0,
        y=6.4,
    )
    add_quest(
        chapter="stone",
        key="coke",
        title="Коксовая печь",
        subtitle="Уголь и креозот без тока",
        description=[
            "Коксовая печь, многоблок из коксового кирпича. Она сушит брёвна в древесный уголь и креозот и не просит электричество. Внутренний бак принимает креозот, люк открывает автоматизацию, когда она появится.",
            "",
            "Пока печи нет, сталь и обработанное дерево не из чего разгонять.",
        ],
        icon="gtceu:coke_oven",
        task_type="item",
        task_item="gtceu:coke_oven",
        deps=["form"],
        pool="hand",
        stage="era_coke",
        x=0,
        y=8.0,
        shape="hexagon",
    )
    add_quest(
        chapter="stone",
        key="pbf",
        title="Примитивная домна",
        subtitle="Первая сталь",
        description=[
            "Домна переплавляет железо в сталь на древесном угле. Это ещё не электропечь: температура и форма многоблока важнее кнопки. Сталь открывает бронзовые корпуса и пар, но сама домна не питается паром.",
        ],
        icon="gtceu:primitive_blast_furnace",
        task_type="item",
        task_item="gtceu:primitive_blast_furnace",
        deps=["coke"],
        pool="coke",
        stage="era_pbf",
        x=0,
        y=9.6,
        shape="hexagon",
    )

    # --- Steam ---
    add_quest(
        chapter="steam",
        key="bronze_case",
        title="Бронзовый корпус",
        subtitle="Каркас паровой эпохи",
        description=[
            "Бронза здесь конструкционный металл, не украшение. Корпус задаёт стены паровых машин и котлов. Пока нет корпуса, пар не во что собирать.",
        ],
        icon="gtceu:bronze_machine_casing",
        task_type="item",
        task_item="gtceu:bronze_machine_casing",
        deps=["pbf"],
        pool="pbf",
        x=0,
        y=0,
    )
    add_quest(
        chapter="steam",
        key="boiler",
        title="Паровой котёл",
        subtitle="Тепло становится паром",
        description=[
            "Твердотопливный котёл низкого давления сжигает уголь и греет воду. Пар, отдельный энергоноситель со своими трубами, не EU. Высокое давление позже снимет штраф к скорости, но низкое давление уже заменяет ручной крафт пыли и обжига.",
        ],
        icon="gtceu:lp_steam_solid_boiler",
        task_type="item",
        task_item="gtceu:lp_steam_solid_boiler",
        deps=["bronze_case"],
        pool="pbf",
        stage="era_steam",
        x=0,
        y=1.6,
        shape="hexagon",
    )
    add_quest(
        chapter="steam",
        key="steam_furnace",
        title="Паровая печь",
        subtitle="Обжиг без ведра угля в руках",
        description=[
            "Паровая печь низкого давления делает тот же обжиг, что ванильная печь, но кормится паром и работает пакетом. Штраф времени у низкого давления настоящий: машина медленнее электрической наследницы. Это мост, не финал металлургии.",
        ],
        icon="gtceu:lp_steam_furnace",
        task_type="item",
        task_item="gtceu:lp_steam_furnace",
        deps=["boiler"],
        pool="steam",
        x=0,
        y=3.2,
    )
    add_quest(
        chapter="steam",
        key="resin",
        title="Каучуковое дерево",
        subtitle="Смола раньше кабеля",
        description=[
            "Липкая смола собирается с каучукового дерева. Без неё нет резины, а без резины кабельная изоляция электрической эпохи не собирается. Дерево редкое, саженец стоит беречь.",
        ],
        icon="gtceu:sticky_resin",
        task_type="item",
        task_item="gtceu:sticky_resin",
        deps=["boiler"],
        pool="steam",
        stage="era_resin",
        x=2.4,
        y=3.2,
        shape="hexagon",
    )
    add_quest(
        chapter="steam",
        key="create_alloy",
        title="Мастерская Create",
        subtitle="Параллельный цех, не замена EU",
        description=[
            "Андезитовый сплав запускает кинетику Create: валы, шестерни, скорость вместо напряжения. Это не обход GregTech. Мод Greate потом привяжет те же механизмы к материалам и оборотам GT, но электрические корпуса он не заменяет.",
            "",
            "Ветка необязательна для перехода на LV.",
        ],
        icon="create:andesite_alloy",
        task_type="item",
        task_item="create:andesite_alloy",
        deps=["boiler"],
        pool="steam",
        x=-2.6,
        y=3.2,
        shape="rsquare",
    )
    add_quest(
        chapter="steam",
        key="water_wheel",
        title="Водяное колесо",
        subtitle="Крутящий момент из реки",
        description=[
            "Колесо даёт вращение, пока есть поток. Рядом с паровой сетью это второй источник движения для Create и, через Greate, для станков, которые понимают обороты. Напряжение EU от колеса само не появится.",
        ],
        icon="create:water_wheel",
        task_type="item",
        task_item="create:water_wheel",
        deps=["create_alloy"],
        pool="steam",
        x=-2.6,
        y=4.8,
        shape="rsquare",
    )

    # --- LV ---
    add_quest(
        chapter="lv",
        key="tube",
        title="Вакуумная лампа",
        subtitle="Первая электроника",
        description=[
            "Лампа, порог между паром и током. Из неё собирается базовая электронная схема. Рецепты схем ужаты конфигом: выход меньше, чем в мягких сборках, запас ламп лучше держать, а не пускать на эксперименты.",
        ],
        icon="gtceu:vacuum_tube",
        task_type="item",
        task_item="gtceu:vacuum_tube",
        deps=["resin", "steam_furnace"],
        pool="resin",
        x=0,
        y=0,
    )
    add_quest(
        chapter="lv",
        key="lv_hull",
        title="Корпус LV",
        subtitle="Низкое напряжение",
        description=[
            "Корпус LV принимает детали и становится машиной на 32 EU/т. Ошибочное напряжение выше номинала корпус сжигает. Пар к этому корпусу напрямую не подключается: нужна отдельная генерация EU.",
        ],
        icon="gtceu:lv_machine_hull",
        task_type="item",
        task_item="gtceu:lv_machine_hull",
        deps=["tube"],
        pool="resin",
        x=0,
        y=1.6,
    )
    add_quest(
        chapter="lv",
        key="lv_circuit",
        title="Базовая схема",
        subtitle="Электронная, не микросхема",
        description=[
            "Базовая электронная схема открывает рецепты LV-машин. Более высокие схемы её не заменяют в старых рецептах: у каждого напряжения свой класс платы. Конфиг режет выход, поэтому одна удачная партия не закрывает эпоху.",
        ],
        icon="gtceu:basic_electronic_circuit",
        task_type="item",
        task_item="gtceu:basic_electronic_circuit",
        deps=["lv_hull"],
        pool="resin",
        stage="era_lv",
        x=0,
        y=3.2,
        shape="hexagon",
    )
    add_quest(
        chapter="lv",
        key="motor",
        title="Электромотор LV",
        subtitle="Деталь, не станок",
        description=[
            "Мотор, поршень, насос и конвейер, комплектующие, которые вставляются в корпуса. Сами по себе они ничего не перерабатывают. Терять их в гаче было бы заменой цеха, поэтому в сундук они не кладутся.",
        ],
        icon="gtceu:lv_electric_motor",
        task_type="item",
        task_item="gtceu:lv_electric_motor",
        deps=["lv_circuit"],
        pool="lv",
        x=-2.3,
        y=4.8,
        shape="rsquare",
    )
    add_quest(
        chapter="lv",
        key="assembler",
        title="Сборщик LV",
        subtitle="Рецепты, которые стол больше не тянет",
        description=[
            "Сборщик собирает схемы и детали по рецепту с жидкостью или без, пакетом. Верстак для этих рецептов либо не существует, либо сознательно хуже. Жёсткие рецепты мультиблоков и контроллеров в конфиге как раз про то, что дальше ручной стол отстаёт.",
        ],
        icon="gtceu:lv_assembler",
        task_type="item",
        task_item="gtceu:lv_assembler",
        deps=["motor"],
        pool="lv",
        x=-2.3,
        y=6.4,
        shape="rsquare",
    )
    add_quest(
        chapter="lv",
        key="chem",
        title="Химический реактор",
        subtitle="Жидкости становятся линией",
        description=[
            "Реактор LV ведёт реакции, которые ступка только намекает. Полиэтилен, кислоты и растворы для следующих плат начинаются здесь. Без химии MV упирается в недостающие жидкости, а не в недостаток руды.",
        ],
        icon="gtceu:lv_chemical_reactor",
        task_type="item",
        task_item="gtceu:lv_chemical_reactor",
        deps=["lv_circuit"],
        pool="lv",
        x=2.3,
        y=4.8,
        shape="rsquare",
    )
    add_quest(
        chapter="lv",
        key="prospector",
        title="Рудный проспектор",
        subtitle="Жила без случайных шахт",
        description=[
            "Проспектор LV показывает, какая жила в чанке, и не заменяет бурение. Он тратит EU. Это инструмент разведки к уже включённой генерации жил, а не источник готового металла.",
        ],
        icon="gtceu:prospector.lv",
        task_type="item",
        task_item="gtceu:prospector.lv",
        deps=["lv_circuit"],
        pool="lv",
        x=2.3,
        y=6.4,
        shape="rsquare",
    )

    # --- MV ---
    add_quest(
        chapter="mv",
        key="mv_hull",
        title="Корпус MV",
        subtitle="Среднее напряжение",
        description=[
            "MV, 128 EU/т. Машины LV в эту сеть без трансформатора сгорают. Корпус снова только каркас: рецепт машины просит детали своего уровня и схему классом выше базовой.",
        ],
        icon="gtceu:mv_machine_hull",
        task_type="item",
        task_item="gtceu:mv_machine_hull",
        deps=["assembler", "chem"],
        pool="lv",
        stage="era_mv",
        x=0,
        y=0,
        shape="hexagon",
    )
    add_quest(
        chapter="mv",
        key="good_circuit",
        title="Хорошая электронная схема",
        subtitle="Класс MV",
        description=[
            "Хорошая схема не крафтится стопкой базовых. У неё свой маршрут через пластины и компоненты MV. Рецепты HV смотрят уже на следующий класс, так что запас хороших схем не открывает высокую эпоху сам по себе.",
        ],
        icon="gtceu:good_electronic_circuit",
        task_type="item",
        task_item="gtceu:good_electronic_circuit",
        deps=["mv_hull"],
        pool="mv",
        x=0,
        y=1.6,
    )
    add_quest(
        chapter="mv",
        key="ae_certus",
        title="Сертис",
        subtitle="Материя для ME",
        description=[
            "Кристалл сертиса, сырьё Applied Energistics. Сеть ME хранит и крафтит, но не производит EU и не заменяет химию. Имеет смысл после того, как LV-цех уже что-то производит пакетами, иначе нечего класть в ячейки.",
        ],
        icon="ae2:certus_quartz_crystal",
        task_type="item",
        task_item="ae2:certus_quartz_crystal",
        deps=["mv_hull"],
        pool="mv",
        x=-2.6,
        y=1.6,
        shape="rsquare",
    )
    add_quest(
        chapter="mv",
        key="ae_acceptor",
        title="Приёмник энергии",
        subtitle="ME не питается от котла",
        description=[
            "Энергоприёмник переводит внешнюю энергию в сеть AE2. Канал и сторона имеют значение: неправильный ввод просто не питает контроллер. Это инфраструктура, не генератор.",
        ],
        icon="ae2:energy_acceptor",
        task_type="item",
        task_item="ae2:energy_acceptor",
        deps=["ae_certus"],
        pool="mv",
        x=-2.6,
        y=3.2,
        shape="rsquare",
    )
    add_quest(
        chapter="mv",
        key="ae_controller",
        title="Контроллер ME",
        subtitle="Мозг сети, не фабрика",
        description=[
            "Контроллер держит каналы и устройства. Без него сеть из кабелей не становится системой автокрафта. Он не выдаёт схемы GregTech и не обходит сборщик.",
        ],
        icon="ae2:controller",
        task_type="item",
        task_item="ae2:controller",
        deps=["ae_acceptor", "good_circuit"],
        pool="mv",
        x=-2.6,
        y=4.8,
        shape="rsquare",
    )

    # --- HV ---
    add_quest(
        chapter="hv",
        key="hv_hull",
        title="Корпус HV",
        subtitle="Высокое напряжение",
        description=[
            "HV, 512 EU/т. Трансформаторы и кабель другого сечения здесь уже не косметика: ошибка в линии уничтожает машины ниже по сети. Корпус собирается на материалах, которые MV только начал выпускать пакетами.",
        ],
        icon="gtceu:hv_machine_hull",
        task_type="item",
        task_item="gtceu:hv_machine_hull",
        deps=["good_circuit"],
        pool="mv",
        x=0,
        y=0,
    )
    add_quest(
        chapter="hv",
        key="adv_circuit",
        title="Продвинутая интегральная схема",
        subtitle="Класс HV",
        description=[
            "Интегральная схема этого класса сидит в чистой химии и более точных компонентах, не в стопке хороших плат. С этого порога данжи Сумеречного леса и алтари Forbidden and Arcanus перестают быть чужой эпохой.",
        ],
        icon="gtceu:advanced_integrated_circuit",
        task_type="item",
        task_item="gtceu:advanced_integrated_circuit",
        deps=["hv_hull"],
        pool="hv",
        stage="era_hv",
        x=0,
        y=1.6,
        shape="hexagon",
    )

    # --- EV ---
    add_quest(
        chapter="ev",
        key="ev_hull",
        title="Корпус EV",
        subtitle="Экстремальное напряжение",
        description=[
            "EV, 2048 EU/т. Потери в кабеле и тепло катушек становятся конструкцией, а не справкой. Чистая комната и обслуживание мультиблоков, которые конфиг не отключал, здесь уже обычный режим, не сюрприз.",
        ],
        icon="gtceu:ev_machine_hull",
        task_type="item",
        task_item="gtceu:ev_machine_hull",
        deps=["adv_circuit"],
        pool="hv",
        x=0,
        y=0,
    )
    add_quest(
        chapter="ev",
        key="nano_cpu",
        title="Нанопроцессор",
        subtitle="Класс EV",
        description=[
            "Нанопроцессор собирается в чистой среде. Это ключ к экстремальным машинам и к эфирной ветке измерений. Квантовый процессор следующим шагом не заменяется нанопроцессором в старых рецептах.",
        ],
        icon="gtceu:nano_processor",
        task_type="item",
        task_item="gtceu:nano_processor",
        deps=["ev_hull"],
        pool="ev",
        stage="era_ev",
        x=0,
        y=1.6,
        shape="hexagon",
    )

    # --- IV ---
    add_quest(
        chapter="iv",
        key="iv_hull",
        title="Корпус IV",
        subtitle="Безумное напряжение",
        description=[
            "IV, 8192 EU/т. Сеть этого уровня не прощает трансформатор «примерно подходящий». Корпус снова каркас: квантовая электроника и вольфрам вокруг него, а не вместо него.",
        ],
        icon="gtceu:iv_machine_hull",
        task_type="item",
        task_item="gtceu:iv_machine_hull",
        deps=["nano_cpu"],
        pool="ev",
        x=0,
        y=0,
    )
    add_quest(
        chapter="iv",
        key="qcpu",
        title="Квантовый процессор",
        subtitle="Класс IV",
        description=[
            "Квантовый процессор закрывает безумную электронику. Глаза Края и старшие боссы Катаклизма завязаны на эту отметку: до неё их добыча в данжах срезается. Сам процессор в сундук гачи не попадает.",
        ],
        icon="gtceu:quantum_processor",
        task_type="item",
        task_item="gtceu:quantum_processor",
        deps=["iv_hull"],
        pool="iv",
        stage="era_iv",
        x=0,
        y=1.6,
        shape="hexagon",
    )

    # --- Late ---
    add_quest(
        chapter="late",
        key="luv_hull",
        title="Корпус LuV",
        subtitle="Дальше обзор, не маршрут",
        description=[
            "LuV начинает вторую половину таблицы напряжений: ZPM, UV, UHV и выше строятся вокруг чистых комнат, платин, наквады и вейпа. Эта книга не расписывает каждый мультиблок тех эпох.",
            "",
            "Смысл отметки в другом: поздний данж и старшие материалы больше не считаются чужими. Маршрут плат тот же, что раньше, только класс процессора снова шагает вверх, вплоть до мокрого вейпа.",
        ],
        icon="gtceu:luv_machine_hull",
        task_type="item",
        task_item="gtceu:luv_machine_hull",
        deps=["qcpu"],
        pool="iv",
        stage="era_late",
        x=0,
        y=0,
        shape="hexagon",
    )
    add_quest(
        chapter="late",
        key="horizon",
        title="Дальше UHV",
        subtitle="Напряжения не кончаются корпусом",
        description=[
            "UEV, UIV, UXV, OpV и MAX существуют в моде как продолжение той же логики: корпус, энергия, схема, обслуживание. Отдельного сюжета под каждый из них здесь нет.",
            "",
            "Если партия дошла до LuV, книга своё дело сделала. Дальше ориентир, JEI и уже построенный цех, а не новый пошаговый текст.",
        ],
        icon="gtceu:uhv_machine_hull",
        task_type="checkmark",
        deps=["luv_hull"],
        pool="late",
        x=0,
        y=1.6,
        shape="rsquare",
    )

    # --- Magic ---
    add_quest(
        chapter="magic",
        key="soulstone",
        title="Камень душ",
        subtitle="Malum",
        description=[
            "Сырой камень душ Malum лежит в мире как свой минерал, не как жила GregTech. Алхимия душ не питает EU-машины и не заменяет домну. Она начинается, когда каменные инструменты уже позволяют уйти от спавна.",
        ],
        icon="malum:raw_soulstone",
        task_type="item",
        task_item="malum:raw_soulstone",
        deps=["pick"],
        pool="hand",
        x=0,
        y=0,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="encyclopedia",
        title="Энциклопедия тайного",
        subtitle="Карта духов Malum",
        description=[
            "Энциклопедия объясняет духов, руны и алтарь. Это справочник мода, не рецепт GT. Души не конвертируются в EU сами собой.",
        ],
        icon="malum:encyclopedia_arcana",
        task_type="item",
        task_item="malum:encyclopedia_arcana",
        deps=["soulstone", "coke"],
        pool="coke",
        x=0,
        y=1.6,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="spirit_altar",
        title="Алтарь духов",
        subtitle="Крафт Malum",
        description=[
            "Алтарь духов собирает вещи Malum из душ и камня. Ему нужен уже понятный ранний металл, поэтому он стоит после коксовой печи, но паровой котёл ему не требуется.",
        ],
        icon="malum:spirit_altar",
        task_type="item",
        task_item="malum:spirit_altar",
        deps=["encyclopedia"],
        pool="coke",
        x=0,
        y=3.2,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="notebook",
        title="Потрёпанный блокнот",
        subtitle="Ars Nouveau",
        description=[
            "Блокнот Ars Nouveau вводит источник, глифы и башню заклинаний. Магия источника расходует свой ресурс, не EU. Ранние глифы не заменяют ступку и печь.",
        ],
        icon="ars_nouveau:worn_notebook",
        task_type="item",
        task_item="ars_nouveau:worn_notebook",
        deps=["pick"],
        pool="hand",
        x=2.6,
        y=0,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="source_gem",
        title="Камень источника",
        subtitle="Топливо заклинаний",
        description=[
            "Камень источника копят аппараты Ars, не генераторы GT. Он тратится на глифы. Запас камней не ускоряет коксование.",
        ],
        icon="ars_nouveau:source_gem",
        task_type="item",
        task_item="ars_nouveau:source_gem",
        deps=["notebook", "coke"],
        pool="coke",
        x=2.6,
        y=1.6,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="spellbook",
        title="Книга заклинаний",
        subtitle="Новичок Ars",
        description=[
            "Книга новичка держит собранные глифы. Ars Creo связывает часть этой магии с механизмами Create, если кинетическая ветка вообще построена. Без источника книга пустая.",
        ],
        icon="ars_nouveau:novice_spell_book",
        task_type="item",
        task_item="ars_nouveau:novice_spell_book",
        deps=["source_gem", "boiler"],
        pool="steam",
        x=2.6,
        y=3.2,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="livingrock",
        title="Живой камень",
        subtitle="Botania",
        description=[
            "Живой камень, строительный материал Botania. Мана производится цветами и не заменяет паровой котёл. Лексикон дальше объясняет пулы и распространители.",
        ],
        icon="botania:livingrock",
        task_type="item",
        task_item="botania:livingrock",
        deps=["boiler"],
        pool="steam",
        x=5.2,
        y=1.6,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="lexicon",
        title="Лексикон",
        subtitle="Справочник маны",
        description=[
            "Лексикон описывает потоки маны, цветы и алтари. Это параллельная энергия. Предметы террастали и эльфийской ветки живут внутри Botania и не открывают корпуса MV.",
        ],
        icon="botania:lexicon",
        task_type="item",
        task_item="botania:lexicon",
        deps=["livingrock"],
        pool="steam",
        x=5.2,
        y=3.2,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="mana_pool",
        title="Пул маны",
        subtitle="Накопитель, не батарея EU",
        description=[
            "Пул хранит ману и кормит алтарь и распространитель. Он не принимает EU и не отдаёт EU. Рядом с электрическим цехом это отдельный контур.",
        ],
        icon="botania:mana_pool",
        task_type="item",
        task_item="botania:mana_pool",
        deps=["lexicon", "lv_circuit"],
        pool="lv",
        x=5.2,
        y=4.8,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="dagger",
        title="Жертвенный кинжал",
        subtitle="Blood Magic",
        description=[
            "Кинжал открывает жизнь как ресурс Blood Magic. Алтарь крови требует этот ресурс и свою сланцевую линейку. В EU кинжал ничего не генерирует.",
        ],
        icon="bloodmagic:sacrificialdagger",
        task_type="item",
        task_item="bloodmagic:sacrificialdagger",
        deps=["lv_circuit"],
        pool="lv",
        x=7.8,
        y=3.2,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="blood_altar",
        title="Кровавый алтарь",
        subtitle="Сланец и жизнь",
        description=[
            "Алтарь перерабатывает сланец по уровням. Каждый уровень алтаря просит больше инфраструктуры вокруг, это не один верстак. Демонический сланец и старшие кристаллы остаются внутри этой лестницы.",
        ],
        icon="bloodmagic:altar",
        task_type="item",
        task_item="bloodmagic:altar",
        deps=["dagger"],
        pool="lv",
        x=7.8,
        y=4.8,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="dictionary",
        title="Словарь духов",
        subtitle="Occultism",
        description=[
            "Словарь объясняет мелки, ритуалы и связанных духов. Дух-работник может таскать и крафтить, но рецепты GregTech он не обходит: у них свои станки и напряжение.",
        ],
        icon="occultism:dictionary_of_spirits",
        task_type="item",
        task_item="occultism:dictionary_of_spirits",
        deps=["coke"],
        pool="coke",
        x=-2.6,
        y=1.6,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="chalk",
        title="Мел ритуала",
        subtitle="Круг Occultism",
        description=[
            "Белый мел рисует базовый круг. Золотой, красный и пурпурный мелки поднимают ранг духа. Ритуал потребляет предметы круга, а не EU.",
        ],
        icon="occultism:chalk_white",
        task_type="item",
        task_item="occultism:chalk_white",
        deps=["dictionary", "boiler"],
        pool="steam",
        x=-2.6,
        y=3.2,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="arcane_crystal",
        title="Арканный кристалл",
        subtitle="Forbidden and Arcanus",
        description=[
            "Кристалл, валюта и материал Forbidden and Arcanus. Кузница Гефеста рядом с ним усиливает предметы своим деревом улучшений. Это не уровень напряжения и не схема.",
        ],
        icon="forbidden_arcanus:arcane_crystal",
        task_type="item",
        task_item="forbidden_arcanus:arcane_crystal",
        deps=["mv_hull"],
        pool="mv",
        x=10.4,
        y=0,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="hephaestus",
        title="Кузница Гефеста",
        subtitle="Усиление, не конвейер",
        description=[
            "Кузница принимает арканные материалы и поднимает тир предмета. Она не штампует корпуса HV. Имеет смысл, когда высокое напряжение уже кормит базу и есть что усиливать.",
        ],
        icon="forbidden_arcanus:hephaestus_forge",
        task_type="item",
        task_item="forbidden_arcanus:hephaestus_forge",
        deps=["arcane_crystal", "adv_circuit"],
        pool="hv",
        x=10.4,
        y=1.6,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="notes",
        title="Заметки исследователя",
        subtitle="Thaumon",
        description=[
            "Заметки Thaumon заменяют привычный таумономикон: исследование идёт через них и янтарь, без отдельного порта Thaumcraft. Аспекты не плавятся в пыль GT.",
        ],
        icon="thaumon:research_notes",
        task_type="item",
        task_item="thaumon:research_notes",
        deps=["lv_circuit"],
        pool="lv",
        x=-5.2,
        y=3.2,
        shape="pentagon",
    )
    add_quest(
        chapter="magic",
        key="amber",
        title="Янтарь",
        subtitle="Материал Thaumon",
        description=[
            "Янтарь и янтарное стекло, локальный материал мода. Он не заменяет каучук и не идёт в кабель LV. Ветка остаётся исследовательской.",
        ],
        icon="thaumon:amber",
        task_type="item",
        task_item="thaumon:amber",
        deps=["notes"],
        pool="lv",
        x=-5.2,
        y=4.8,
        shape="pentagon",
    )

    # --- Colony ---
    add_quest(
        chapter="colony",
        key="supply",
        title="Лагерь снабжения",
        subtitle="Старт MineColonies",
        description=[
            "Сундук снабжения разворачивает лагерь. Колония кормит и строит сама, но материалы берёт из вашего склада. На каменном веке это рот, который надо кормить, а не фабрика схем.",
        ],
        icon="minecolonies:supplychestdeployer",
        task_type="item",
        task_item="minecolonies:supplychestdeployer",
        deps=["pick"],
        pool="hand",
        x=0,
        y=0,
    )
    add_quest(
        chapter="colony",
        key="townhall",
        title="Ратуша",
        subtitle="Колония существует",
        description=[
            "Ратуша регистрирует колонию, жителей и постройки. Размер территории и список построек растут от ратуши, не от напряжения сети. Коксовая печь к этому моменту уже кормит уголь и креозот, иначе стройка встанет на топливе.",
        ],
        icon="minecolonies:blockhuttownhall",
        task_type="item",
        task_item="minecolonies:blockhuttownhall",
        deps=["supply", "coke"],
        pool="coke",
        x=0,
        y=1.6,
    )
    add_quest(
        chapter="colony",
        key="builder",
        title="Хижина строителя",
        subtitle="Они кладут блоки",
        description=[
            "Строитель забирает блоки со склада и ставит их по стилю. Без запаса дерева, камня и инструментов очередь построек не двигается. Пар здесь полезен как источник обработанных материалов, не как требование UI колонии.",
        ],
        icon="minecolonies:blockhutbuilder",
        task_type="item",
        task_item="minecolonies:blockhutbuilder",
        deps=["townhall", "boiler"],
        pool="steam",
        x=0,
        y=3.2,
    )
    add_quest(
        chapter="colony",
        key="guard",
        title="Башня стражи",
        subtitle="Рейды ходят к ратуше",
        description=[
            "Стража держит рейды. Оружие и броня для них лежат в хижине, не в вашем EU-хранилище. Пока эпоха паровая, ожидайте деревянное и каменное, не квантовые доспехи.",
        ],
        icon="minecolonies:blockhutguardtower",
        task_type="item",
        task_item="minecolonies:blockhutguardtower",
        deps=["builder"],
        pool="steam",
        x=-2.4,
        y=4.8,
        shape="rsquare",
    )
    add_quest(
        chapter="colony",
        key="warehouse",
        title="Склад",
        subtitle="Буфер между цехом и колонией",
        description=[
            "Склад колонии принимает стаки и отдаёт их курьерам. Имеет смысл, когда LV уже производит пачками: иначе курьеры носят булыжник. В ME-сеть он сам не подключается.",
        ],
        icon="minecolonies:blockhutwarehouse",
        task_type="item",
        task_item="minecolonies:blockhutwarehouse",
        deps=["builder", "lv_circuit"],
        pool="lv",
        x=0,
        y=4.8,
    )
    add_quest(
        chapter="colony",
        key="university",
        title="Университет",
        subtitle="Жители умнеют медленно",
        description=[
            "Университет поднимает уровень работников. Высокий уровень открывает рецепты хижин, не рецепты GregTech. К среднему напряжению колония уже может обслуживать себя, не подменяя химреактор.",
        ],
        icon="minecolonies:blockhutuniversity",
        task_type="item",
        task_item="minecolonies:blockhutuniversity",
        deps=["warehouse", "mv_hull"],
        pool="mv",
        x=0,
        y=6.4,
    )
    add_quest(
        chapter="colony",
        key="alchemist",
        title="Хижина алхимика",
        subtitle="Зелья колонии",
        description=[
            "Алхимик варит зелья для жителей. Это пересечение с магией колонии, не с Blood Magic и не с реактором HV. Ингредиенты он берёт со склада.",
        ],
        icon="minecolonies:blockhutalchemist",
        task_type="item",
        task_item="minecolonies:blockhutalchemist",
        deps=["university", "adv_circuit"],
        pool="hv",
        x=2.4,
        y=6.4,
        shape="rsquare",
    )

    # --- Dungeons ---
    add_quest(
        chapter="dungeons",
        key="compass",
        title="Компас исследователя",
        subtitle="Структуры не спрятаны",
        description=[
            "Компас ищет ближайшую структуру выбранного типа. В паке одновременно живут шахты и данжи YUNG, таверны, Dungeon Crawl, археология, переосмысленные хижины и крепости. Компас не поднимает лут до вашей эпохи: сундук всё равно фильтруется.",
        ],
        icon="explorerscompass:explorerscompass",
        task_type="item",
        task_item="explorerscompass:explorerscompass",
        deps=["pick"],
        pool="hand",
        x=0,
        y=0,
    )
    add_quest(
        chapter="dungeons",
        key="mines",
        title="Шахты и склепы",
        subtitle="YUNG и ванильные каркасы",
        description=[
            "Улучшенные шахты, склепы, пустынные и тропические храмы, хижины ведьм, это ранний слой. Там дерево, кости, иногда железо. Алмазы, незерит, глаза Края и детали высоких напряжений из этих сундуков вырезаются, пока соответствующая эпоха не отмечена квестом.",
        ],
        icon="minecraft:mossy_cobblestone",
        task_type="item",
        task_item="minecraft:mossy_cobblestone",
        deps=["compass"],
        pool="hand",
        x=0,
        y=1.6,
    )
    add_quest(
        chapter="dungeons",
        key="brush",
        title="Кисть археолога",
        subtitle="Better Archeology",
        description=[
            "Кисть снимает подозрительный песок и гравий. Находки археологии остаются в раннем и среднем слое. Это не источник схем и не обход коксовой печи, печь к этому моменту уже должна стоять, иначе нечем чинить инструмент.",
        ],
        icon="minecraft:brush",
        task_type="item",
        task_item="minecraft:brush",
        deps=["mines", "coke"],
        pool="coke",
        x=-2.4,
        y=3.2,
        shape="rsquare",
    )
    add_quest(
        chapter="dungeons",
        key="tavern",
        title="Таверны и подземелья",
        subtitle="When Dungeons Arise, Taverns, Crawl",
        description=[
            "Крупные подземелья и таверны держат больше боя и больше сундуков, чем шахта. Лут по-прежнему обрезан по эпохе: сундук не становится MV-складом только потому, что структура большая. Тотем нежити отмечает, что рейды иллагеров вам уже по плечу вместе со средним напряжением.",
        ],
        icon="minecraft:totem_of_undying",
        task_type="item",
        task_item="minecraft:totem_of_undying",
        deps=["mines", "mv_hull"],
        pool="mv",
        x=0,
        y=3.2,
    )
    add_quest(
        chapter="dungeons",
        key="liveroot",
        title="Печёночник",
        subtitle="Сумеречный лес",
        description=[
            "Печёночник растёт в Сумеречном лесу. Портал в измерение пускает только после высокой эпохи: раньше измерение выталкивает обратно. Рыцарский металл, огненный металл и стальной лист из сундуков леса тоже ждут эту отметку.",
        ],
        icon="twilightforest:liveroot",
        task_type="item",
        task_item="twilightforest:liveroot",
        deps=["tavern", "adv_circuit"],
        pool="hv",
        x=0,
        y=4.8,
    )
    add_quest(
        chapter="dungeons",
        key="twilight_dim",
        title="Войти в чащу",
        subtitle="Измерение леса",
        description=[
            "Измерение Сумеречного леса открывается порталом, но квест засчитает само пребывание там. Боссы леса идут лестницей внутри мода. Гача этого квеста всё ещё из пула HV, без огненных слитков леса.",
        ],
        icon="twilightforest:magic_map",
        task_type="dimension",
        task_dimension="twilightforest:twilight_forest",
        deps=["liveroot"],
        pool="hv",
        x=0,
        y=6.4,
        shape="hexagon",
    )
    add_quest(
        chapter="dungeons",
        key="ambrosium",
        title="Осколок амброзия",
        subtitle="Эфир",
        description=[
            "Амброзий, местное топливо и материал Эфира. Портал в небо пускает после экстремальной эпохи. Занитовые и гравититовые вещи из сундуков Эфира до этой отметки снимаются.",
        ],
        icon="aether:ambrosium_shard",
        task_type="item",
        task_item="aether:ambrosium_shard",
        deps=["twilight_dim", "nano_cpu"],
        pool="ev",
        x=2.6,
        y=6.4,
    )
    add_quest(
        chapter="dungeons",
        key="aether_dim",
        title="Небесный портал",
        subtitle="Измерение Эфира",
        description=[
            "Квест закрывается входом в Эфир. Данжи островов и боссы измерения остаются опаснее леса, но их добыча не заменяет квантовый процессор.",
        ],
        icon="aether:aether_portal_frame",
        task_type="dimension",
        task_dimension="aether:the_aether",
        deps=["ambrosium"],
        pool="ev",
        x=2.6,
        y=8.0,
        shape="hexagon",
    )
    add_quest(
        chapter="dungeons",
        key="witch_eye",
        title="Глаз ведьмы",
        subtitle="End Remastered",
        description=[
            "Глаза Края разбросаны по структурам и открывают портал только набором. До безумной эпохи сундуки эти глаза не оставляют. Квест отмечает, что глаз у вас уже законный, а не выбитый раньше времени.",
        ],
        icon="endrem:witch_eye",
        task_type="item",
        task_item="endrem:witch_eye",
        deps=["aether_dim", "qcpu"],
        pool="iv",
        x=0,
        y=8.0,
    )
    add_quest(
        chapter="dungeons",
        key="horn",
        title="Чудовищный рог",
        subtitle="Катаклизм",
        description=[
            "Рог падает со старших боссов Катаклизма. Пока нет отметки IV, удар по Игнису, Левиафану, Предвестнику, Сцилле, Древнему останку, Маледиктусу, Адскому чудовищу и Стражу Края не проходит.",
            "",
            "Рог не кладётся в гачу. Его нельзя выбить сундуком квеста раньше боя.",
        ],
        icon="cataclysm:monstrous_horn",
        task_type="item",
        task_item="cataclysm:monstrous_horn",
        deps=["witch_eye"],
        pool="iv",
        x=0,
        y=9.6,
        shape="hexagon",
    )
    add_quest(
        chapter="dungeons",
        key="ignitium",
        title="Игнитий",
        subtitle="Материал после босса",
        description=[
            "Игнитий, слиток с вершины Катаклизма. Он живёт в своей броне и оружии и не заменяет корпус LuV. Квест стоит после поздней отметки, когда измеренческий гейт уже снят.",
        ],
        icon="cataclysm:ignitium_ingot",
        task_type="item",
        task_item="cataclysm:ignitium_ingot",
        deps=["horn", "luv_hull"],
        pool="late",
        x=0,
        y=11.2,
    )


def ancestors(by_key: dict[str, dict], key: str, acc: set[str] | None = None) -> set[str]:
    if acc is None:
        acc = set()
    for dep in by_key[key]["deps"]:
        if dep not in acc:
            acc.add(dep)
            ancestors(by_key, dep, acc)
    return acc


def validate(by_key: dict[str, dict]) -> None:
    owner: dict[str, str] = {}
    for quest in QUESTS_DATA:
        item = quest["task_item"]
        if not item:
            continue
        if item in owner:
            raise SystemExit(f"duplicate task item {item}")
        owner[item] = quest["key"]
    for quest in QUESTS_DATA:
        allowed = ancestors(by_key, quest["key"])
        for entry in POOLS[quest["pool"]]:
            item = entry["item"]
            who = owner.get(item)
            if who is not None and who not in allowed:
                raise SystemExit(
                    f"pool {quest['pool']} on {quest['key']} contains {item}, owned by unfinished {who}"
                )


def quest_snbt(quest: dict, by_key: dict[str, dict], tables: dict[str, tuple[str, int]]) -> dict:
    table_hex, table_long = tables[quest["pool"]]
    rewards = [
        {
            "id": nid(),
            "table_id": table_long,
            "team_reward": False,
            "type": "random",
        }
    ]
    if quest["stage"]:
        rewards.append(
            {
                "auto": "invisible",
                "id": nid(),
                "stage": quest["stage"],
                "team_reward": False,
                "type": "gamestage",
            }
        )
    task: dict = {"id": quest["task_id"], "type": quest["task_type"]}
    if quest["task_type"] == "item":
        task["item"] = quest["task_item"]
        if quest["task_count"] != 1:
            task["count"] = quest["task_count"]
    elif quest["task_type"] == "dimension":
        task["dimension"] = quest["task_dimension"]
    data = {
        "dependencies": [by_key[name]["id"] for name in quest["deps"]],
        "description": quest["description"],
        "icon": quest["icon"],
        "id": quest["id"],
        "rewards": rewards,
        "shape": quest["shape"],
        "size": 1.0,
        "subtitle": quest["subtitle"],
        "tasks": [task],
        "title": quest["title"],
        "x": quest["x"],
        "y": quest["y"],
    }
    # floats for size/x/y are written by snbt_value as 1.0f; FTB accepts f for doubles in practice
    # but community files use 0.5d. Override below by post-processing is unnecessary if we emit d.
    return data


def emit_double_fields(text: str) -> str:
    # snbt_value emits floats. Coordinates in the reference pack use the d suffix.
    return text.replace(".0f", ".0d")


def main() -> None:
    build()
    by_key = {quest["key"]: quest for quest in QUESTS_DATA}
    missing = [dep for quest in QUESTS_DATA for dep in quest["deps"] if dep not in by_key]
    if missing:
        raise SystemExit(f"missing deps {missing}")
    validate(by_key)

    tables: dict[str, tuple[str, int]] = {}
    if TABLES.exists():
        for old in TABLES.glob("*.snbt"):
            old.unlink()
    if CHAPTERS.exists():
        for old in CHAPTERS.glob("*.snbt"):
            old.unlink()

    for index, (name, entries) in enumerate(POOLS.items()):
        hex_id = nid()
        tables[name] = (hex_id, nlong(hex_id))
        dump(
            TABLES / f"{index:02d}_{name}.snbt",
            {
                "id": hex_id,
                "loot_size": 1,
                "order_index": index,
                "rewards": entries,
                "title": name,
            },
        )

    groups = {
        "gt": (nid(), "GregTech"),
        "magic": (nid(), "Магия"),
        "colony": (nid(), "Колония"),
        "dungeons": (nid(), "Данжи"),
    }
    chapter_meta = [
        ("intro", "gt", "Как устроена книга", "ftbquests:book", "Вводная", 0),
        ("stone", "gt", "Каменный век", "minecraft:cobblestone", "Руки и кокс", 1),
        ("steam", "gt", "Паровая эпоха", "gtceu:lp_steam_furnace", "Пар и бронза", 2),
        ("lv", "gt", "Низкое напряжение", "gtceu:lv_machine_hull", "LV", 3),
        ("mv", "gt", "Среднее напряжение", "gtceu:mv_machine_hull", "MV", 4),
        ("hv", "gt", "Высокое напряжение", "gtceu:hv_machine_hull", "HV", 5),
        ("ev", "gt", "Экстремальное напряжение", "gtceu:ev_machine_hull", "EV", 6),
        ("iv", "gt", "Безумное напряжение", "gtceu:iv_machine_hull", "IV", 7),
        ("late", "gt", "LuV и дальше", "gtceu:luv_machine_hull", "Обзор конца таблицы", 8),
        ("magic", "magic", "Магия", "malum:encyclopedia_arcana", "Рядом с эпохами", 0),
        ("colony", "colony", "Колония", "minecolonies:blockhuttownhall", "MineColonies", 0),
        ("dungeons", "dungeons", "Данжи", "minecraft:mossy_cobblestone", "Структуры по эпохам", 0),
    ]
    grouped: dict[str, list[dict]] = {name: [] for name, *_ in chapter_meta}
    for quest in QUESTS_DATA:
        grouped[quest["chapter"]].append(quest_snbt(quest, by_key, tables))

    CHAPTERS.mkdir(parents=True, exist_ok=True)
    for filename, group, title, icon, subtitle, order in chapter_meta:
        payload = {
            "default_hide_dependency_lines": False,
            "default_quest_shape": "square",
            "filename": filename,
            "group": groups[group][0],
            "icon": icon,
            "id": nid(),
            "order_index": order,
            "quest_links": [],
            "quests": grouped[filename],
            "subtitle": subtitle,
            "title": title,
        }
        text = emit_double_fields(snbt_value(payload, 0) + "\n")
        (CHAPTERS / f"{filename}.snbt").write_text(text, encoding="utf-8")

    dump(
        QUESTS / "chapter_groups.snbt",
        {
            "chapter_groups": [
                {"id": groups["gt"][0], "title": groups["gt"][1]},
                {"id": groups["magic"][0], "title": groups["magic"][1]},
                {"id": groups["colony"][0], "title": groups["colony"][1]},
                {"id": groups["dungeons"][0], "title": groups["dungeons"][1]},
            ]
        },
    )
    dump(
        QUESTS / "data.snbt",
        {
            "default_autoclaim_rewards": "disabled",
            "default_consume_items": False,
            "default_quest_disable_jei": False,
            "default_quest_shape": "square",
            "default_reward_team": False,
            "detection_delay": 20,
            "disable_gui": False,
            "drop_book_on_death": False,
            "drop_loot_crates": False,
            "grid_scale": 0.5,
            "hide_excluded_quests": False,
            "icon": "ftbquests:book",
            "lock_message": "Сначала закройте связанный этап.",
            "pause_game": False,
            "progression_mode": "flexible",
            "title": "GregTech Colony",
            "version": 13,
        },
    )
    # grid_scale was emitted as float; reference packs use a double suffix.
    data_path = QUESTS / "data.snbt"
    data_path.write_text(data_path.read_text(encoding="utf-8").replace("0.5f", "0.5d"), encoding="utf-8")

    print(f"quests {len(QUESTS_DATA)}")
    print(f"pools {len(POOLS)} tables {len(list(TABLES.glob('*.snbt')))}")
    print(f"chapters {len(list(CHAPTERS.glob('*.snbt')))}")


if __name__ == "__main__":
    main()

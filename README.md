# GregTech Colony

Сборка Minecraft **1.20.1** на **Forge 47.4.29** для небольшой компании русскоязычных друзей. В основе GregTech CEu Modern, Create и MineColonies, плюс магия, данжи и оптимизация. Версия **0.1.0** только запускается: квестов и скриптов KubeJS ещё нет.

Автор сборки: IcePrince1101.

Клиенту хватает **6–8 ГБ** оперативной памяти. Для выделенного сервера на хостинге лучше **8–10 ГБ**: проверка на пустом мире дошла до `Done` и на 6 ГБ, но с игроками, GregTech и генерацией структур запас нужен больше. Подойдёт Java 17 или Java 21 (сервер проверялся на Java 21).

## Установка в Prism Launcher

1. Скачайте [packwiz-installer-bootstrap.jar](https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar).
2. В Prism создайте экземпляр: Minecraft **1.20.1**, загрузчик **Forge 47.4.29**.
3. Откройте папку экземпляра и положите `packwiz-installer-bootstrap.jar` в каталог игры (там же, где появится `options.txt`; Prism называет его `.minecraft` или `minecraft`).
4. В настройках экземпляра включите свои команды и вставьте в поле **Pre-launch command**:

```
"$INST_JAVA" -jar packwiz-installer-bootstrap.jar https://raw.githubusercontent.com/IcePrince1101/gregtech-colony-mine-pack/main/pack.toml
```

5. В настройках Java выставьте **-Xmx** на 6–8 ГБ.
6. Запустите игру. Установщик скачает моды с `pack.toml` на ветке `main`. При первом запуске он спросит про необязательные файлы: шейдерпаки по умолчанию выключены.

Пока этот репозиторий не влит в `main`, тот же адрес можно временно заменить на сырой `pack.toml` ветки с изменениями.

## Шейдеры

Oculus стоит как обычный клиентский мод и сам по себе картинку не меняет. MakeUp Ultra Fast и Complementary Reimagined лежат в сборке как необязательные клиентские файлы и **выключены**.

Чтобы включить:

1. В окне packwiz-installer отметьте нужный шейдерпак, иначе файл не скачается.
2. В игре откройте **Настройки → Настройки графики → Наборы шейдеров**.
3. Выберите MakeUp Ultra Fast или Complementary Reimagined.

Чтобы выключить, в том же меню выберите внутренние шейдеры (пункт без пака, обычно **OFF** / внутренний). На сервер эти файлы не ставятся.

## Сервер

На машине с Java 17 или 21:

1. Скачайте установщик Forge **1.20.1-47.4.29** и выполните `java -jar forge-1.20.1-47.4.29-installer.jar --installServer`.
2. Примите EULA: в `eula.txt` должно быть `eula=true`.
3. Положите рядом `packwiz-installer-bootstrap.jar` и выполните:

```
java -jar packwiz-installer-bootstrap.jar -g -s server https://raw.githubusercontent.com/IcePrince1101/gregtech-colony-mine-pack/main/pack.toml
```

`-s server` ставит общие моды и моды логического сервера. Чисто клиентские файлы установщик пропускает: Embeddium, Oculus, ImmediatelyFast, Dynamic FPS, Entity Culling и шейдерпаки. Xaero's Minimap и Xaero's World Map ставятся и на сервер, у них есть серверная часть.

4. Запуск:

```
java -Xms4G -Xmx8G @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.4.29/unix_args.txt nogui
```

Или отредактируйте `user_jvm_args.txt` (раскомментируйте `-Xmx`) и запустите `./run.sh nogui`. Для хостинга с панелью укажите ту же версию Forge и ту же команду установщика в каталоге сервера; многие панели понимают packwiz через переменную с адресом `pack.toml`.

## Что уже настроено

- В `config/gtceu.yaml` включены жёсткие рецепты GregTech: дерево и палки, деревянные рецепты, ванильные инструменты и броня, кирпичи, редстоун, красители, прочие рецепты, схемы и контроллеры механизмов. Остальные пункты GTCEu оставлены как есть, в том числе отключение ванильной генерации руд.
- Руды Thermal (олово, свинец, никель, серебро, киноварь, сера, селитра) выключены в `config/thermal-common.toml`. Те же жилы дополнительно убраны датапаком KubeJS (`kubejs/data/thermal/forge/biome_modifier/`), чтобы в мире оставались жилы GregTech. Нефтяной песок и каучуковые деревья Thermal не трогались.

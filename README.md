# Brain — Gemini контекстный мост для opencode

Генерирует PDF-контекст из кодовой базы проекта для обсуждения с Google Gemini AI.

## Установка

```bash
git clone <url> brain-pack
cd brain-pack
opencode
```

В opencode введите:

```
@brain install
```

Скрипт покажет план и запросит подтверждение перед каждым шагом.

### Альтернатива (без opencode)

```bash
cd brain-pack
node install.js      # с подтверждением
node install.js -y   # без подтверждения
node install.js --dry-run  # только посмотреть, что будет
```

## Что делает установка

| Шаг | Что происходит | Зачем |
|---|---|---|
| `npm install` | Скачивает `pdfkit` в `brain-pack/node_modules/` | Нужен для генерации PDF |
| `npm link --force` | Создаёт глобальную команду `gemini-pdf` | Утилита должна быть доступна из любой папки |
| Копирует SKILL.md | → `~/.config/opencode/skills/brain/SKILL.md` | opencode читает скиллы отсюда |

Установка не трогает ничего за пределами:
- `~/.config/opencode/skills/brain/` — только один файл SKILL.md
- Глобальный `node_modules` — только симлинк на `gemini-pdf`

Всё остаётся в `brain-pack/` и может быть удалено ручным удалением папки.

## Использование

В любом проекте, в opencode:

```
@brain опиши архитектуру
@brain найди все роуты
@brain объясни, как работает авторизация
```

После генерации появится `gemini_task.pdf` — его можно загрузить в Google AI Studio и обсуждать.

## Удаление

```bash
rm -rf ~/.config/opencode/skills/brain
npm unlink -g opencode-brain
rm -rf brain-pack
```

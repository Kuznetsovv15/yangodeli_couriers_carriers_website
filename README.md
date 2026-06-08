# Yango Deli Careers Website

Сайт карьеры [Yango Deli](https://yango-deli.co.il) — набор персонала в Израиле: сборщики заказов, курьеры, служба поддержки, менеджеры смен.

**GitHub:** [Kuznetsovv15/yangodeli_couriers_carriers_website](https://github.com/Kuznetsovv15/yangodeli_couriers_carriers_website)

---

## Возможности

- **3 языка** — иврит (RTL), английский, русский
- **4 роли** — pickers, couriers, support, manager с отдельным контентом и изображениями
- **Deep links** — `?role=pickers|couriers|support|manager`
- **Анимации** — Framer Motion, GSAP ScrollTrigger, Lenis smooth scroll
- **Регистрация** — модальная форма, контактная секция, всплывающий CTA через 5 секунд
- **Адаптив** — mobile-first, safe-area, touch-friendly
- **Бренд** — токены Yango Deli, volumetric UI, официальные логотипы

## Языки и URL

| URL | Язык | Направление |
|-----|------|-------------|
| `/he` | Иврит | RTL |
| `/en` | English | LTR |
| `/ru` | Русский | LTR |

По умолчанию: **иврит** (`/he`).

Пример: `http://localhost:3000/ru?role=couriers`

## Стек

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + shadcn/ui
- **next-intl** — локализация
- **Framer Motion, GSAP, Lenis** — анимации и скролл
- **React Hook Form + Zod** — формы

## Быстрый старт

```bash
git clone https://github.com/Kuznetsovv15/yangodeli_couriers_carriers_website.git
cd yangodeli_couriers_carriers_website
npm install
npm run dev
```

Откройте [http://localhost:3000/he](http://localhost:3000/he).

### Команды

```bash
npm run dev      # dev-сервер
npm run build    # production-сборка
npm run start    # запуск production
npm run lint     # ESLint
```

### Переменные окружения (опционально)

```bash
cp .env.local.example .env.local
```

Для синхронизации ассетов с WordPress / Yandex Disk. **Не коммитьте `.env.local`.**

### Бренд-ассеты

В репозитории — только файлы, нужные для сайта. Полный пакет (PSD, фото, презентации) скачивается локально:

```bash
python3 scripts/sync-brand-from-yadisk.py
```

Каталог: [`design/brand-assets.md`](design/brand-assets.md)

## Структура проекта

```
src/
├── app/[locale]/       # Маршруты he / en / ru
├── components/
│   ├── brand/          # Логотип Yango Deli
│   ├── forms/          # Форма заявки
│   ├── layout/         # Header, Footer, PromoBar
│   ├── modals/         # Модалка заявки, CTA-попап
│   ├── motion/         # Анимационные компоненты
│   ├── sections/       # Hero, Benefits, Features…
│   └── ui/             # shadcn/ui
├── i18n/               # next-intl
├── lib/                # Хуки, утилиты, ассеты
├── messages/           # he.json, en.json, ru.json
└── styles/             # Design tokens
public/
├── images/             # Изображения ролей и бренда
├── logos/              # Официальные логотипы
└── fonts/              # Шрифты Yango
```

## CI

GitHub Actions на каждый push в `main`:

- `npm ci` → `npm run lint` → `npm run build`

См. [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Деплой

```bash
npm run build
npm run start
```

Подходит для Vercel, Node-сервера и других Next.js-хостингов.

## Лицензия

Приватный проект — © Yango Deli. All rights reserved.
